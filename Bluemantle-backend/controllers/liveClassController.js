const LiveClass = require("../models/LiveClass");
const Batch = require("../models/Batch");
const Attendance = require("../models/Attendance");
const zoomHelper = require("../utils/zoomHelper");

exports.scheduleClass = async (req, res) => {
    try {
        const { batchId, teacherId, topic, date, duration } = req.body;
        const actingTeacherId = teacherId || req.user.id;

        if (!batchId || !actingTeacherId || !date) {
            return res.status(400).json({ success: false, message: "batchId, teacherId, and date are required" });
        }

        const batch = await Batch.findById(batchId).populate("teacherId", "name email");
        if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

        // Check: only one active/scheduled session per batch at a time
        const existingActive = await LiveClass.findOne({
            batchId,
            status: { $in: ["scheduled", "live"] }
        });
        if (existingActive) {
            return res.status(409).json({
                success: false,
                message: "This batch already has an active or scheduled session. Only one session per batch is allowed at a time."
            });
        }

        // Auto-create Zoom meeting
        let zoomData = {};
        try {
            const teacherEmail = batch.teacherId?.email;
            zoomData = await zoomHelper.createZoomMeeting({
                topic: topic || `${batch.name} – Live Class`,
                startTime: new Date(date).toISOString(),
                duration: duration || 60,
                teacherEmail
            });
        } catch (zoomErr) {
            return res.status(502).json({
                success: false,
                message: `Zoom API error: ${zoomErr.message}`
            });
        }

        const liveClass = await LiveClass.create({
            batchId,
            teacherId: actingTeacherId,
            zoomLink: zoomData.joinUrl,
            zoomStartUrl: zoomData.startUrl,
            zoomMeetingId: zoomData.meetingId,
            zoomPassword: zoomData.password,
            topic: topic || `${batch.name} – Live Class`,
            date,
            duration: duration || 60
        });

        const populated = await LiveClass.findById(liveClass._id)
            .populate("batchId", "name")
            .populate("teacherId", "name email");

        res.status(201).json({
            success: true,
            message: "Live class scheduled and Zoom meeting created successfully",
            data: populated
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllClasses = async (req, res) => {
    try {
        const classes = await LiveClass.find({})
            .sort({ date: -1 })
            .populate("batchId", "name")
            .populate("teacherId", "name email");
        res.json({ success: true, message: "All live classes retrieved", data: classes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTeacherClasses = async (req, res) => {
    try {
        const classes = await LiveClass.find({ teacherId: req.user.id })
            .sort({ date: -1 })
            .populate("batchId", "name courseId");
        res.json({ success: true, message: "Classes retrieved successfully", data: classes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getBatchClasses = async (req, res) => {
    try {
        const { batchId } = req.params;
        const batch = await Batch.findById(batchId);
        if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

        if (req.user.role === "student" && !batch.students.includes(req.user.id)) {
            return res.status(403).json({ success: false, message: "Access denied. Not in batch." });
        }

        const classes = await LiveClass.find({ batchId }).sort({ date: 1 }).populate("teacherId", "name");
        res.json({ success: true, message: "Batch classes retrieved successfully", data: classes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyClasses = async (req, res) => {
    try {
        const userId = req.user.id;
        const batch = await Batch.findOne({ students: userId });
        if (!batch) return res.status(404).json({ success: false, message: "Batch not found for student" });

        const classes = await LiveClass.find({ batchId: batch._id })
            .sort({ date: 1 })
            .populate("teacherId", "name")
            .populate("batchId", "name");
        res.json({ success: true, message: "Your classes retrieved successfully", data: classes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.joinLive = async (req, res) => {
    try {
        const { classId } = req.body;
        const userId = req.user.id;

        const liveClass = await LiveClass.findById(classId);
        if (!liveClass) return res.status(404).json({ success: false, message: "Class not found" });

        if (liveClass.status !== "live") {
            return res.status(400).json({ success: false, message: "Class is not currently live" });
        }

        await Attendance.findOneAndUpdate(
            { classId, studentId: userId },
            { status: "present" },
            { upsert: true, new: true }
        );

        res.json({ success: true, message: "Attendance marked as present", joinUrl: liveClass.zoomLink });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.watchRecording = async (req, res) => {
    try {
        const { classId } = req.body;
        const userId = req.user.id;

        const liveClass = await LiveClass.findById(classId);
        if (!liveClass) return res.status(404).json({ success: false, message: "Class not found" });

        if (liveClass.status !== "recorded") {
            return res.status(400).json({ success: false, message: "Recording not available yet" });
        }

        const existingAttendance = await Attendance.findOne({ classId, studentId: userId });
        if (existingAttendance && existingAttendance.status === "present") {
            return res.json({ success: true, message: "Attendance already marked as present" });
        }

        const classDate = new Date(liveClass.date);
        const now = new Date();
        const diffInDays = (now - classDate) / (1000 * 60 * 60 * 24);

        const status = diffInDays <= 7 ? "late" : "absent";

        await Attendance.findOneAndUpdate(
            { classId, studentId: userId },
            { status },
            { upsert: true, new: true }
        );

        res.json({ success: true, message: `Attendance marked as ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { classId } = req.params;
        const { status, recordingUrl } = req.body;

        const liveClass = await LiveClass.findById(classId);
        if (!liveClass) return res.status(404).json({ success: false, message: "Class not found" });

        if (status) liveClass.status = status;
        if (recordingUrl) liveClass.recordingUrl = recordingUrl;

        await liveClass.save();

        res.json({ success: true, message: "Class status updated successfully", data: liveClass });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getRecordings = async (req, res) => {
    try {
        const { classId } = req.params;
        const liveClass = await LiveClass.findById(classId);
        if (!liveClass || !liveClass.zoomMeetingId) {
            return res.status(404).json({ success: false, message: "Class or Zoom meeting ID not found" });
        }

        const recordings = await zoomHelper.getMeetingRecordings(liveClass.zoomMeetingId);
        res.json({ success: true, data: recordings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.syncZoomAttendance = async (req, res) => {
    try {
        const { classId } = req.body;
        const liveClass = await LiveClass.findById(classId).populate("batchId");
        if (!liveClass) return res.status(404).json({ success: false, message: "Class not found" });

        if (!liveClass.zoomMeetingId) {
            return res.status(400).json({ success: false, message: "No zoomMeetingId attached to this class." });
        }

        const participants = await zoomHelper.getMeetingParticipants(liveClass.zoomMeetingId);

        const durationByEmail = {};
        participants.forEach(p => {
            const email = p.user_email?.toLowerCase();
            if (email) {
                durationByEmail[email] = (durationByEmail[email] || 0) + p.duration;
            }
        });

        // 90% attendance threshold (class duration is in minutes, Zoom reports in seconds)
        const classDurationSeconds = (liveClass.duration || 60) * 60;
        const requiredSeconds = classDurationSeconds * 0.9;

        const batch = await Batch.findById(liveClass.batchId._id || liveClass.batchId).populate("students", "email");
        if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });

        const ops = batch.students.map(student => {
            const studentEmail = student.email?.toLowerCase();
            const timeInMeeting = durationByEmail[studentEmail] || 0;
            const status = timeInMeeting >= requiredSeconds ? "present" : "absent";

            return {
                updateOne: {
                    filter: { classId: liveClass._id, studentId: student._id },
                    update: { $set: { status } },
                    upsert: true
                }
            };
        });

        if (ops.length > 0) {
            await Attendance.bulkWrite(ops);
        }

        res.json({ success: true, message: `Zoom attendance synced for ${ops.length} students` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { topic, date, duration } = req.body;

        const liveClass = await LiveClass.findById(id);
        if (!liveClass) return res.status(404).json({ success: false, message: "Class not found" });

        // Update Zoom meeting if date or topic changed
        if (topic || date || duration) {
            try {
                await zoomHelper.updateZoomMeeting(liveClass.zoomMeetingId, {
                    topic: topic || liveClass.topic,
                    startTime: date ? new Date(date).toISOString() : liveClass.date.toISOString(),
                    duration: duration || liveClass.duration
                });
            } catch (zoomErr) {
                console.error("Zoom update error:", zoomErr);
            }
        }

        if (topic) liveClass.topic = topic;
        if (date) liveClass.date = date;
        if (duration) liveClass.duration = duration;

        await liveClass.save();

        const populated = await LiveClass.findById(liveClass._id)
            .populate("batchId", "name")
            .populate("teacherId", "name email");

        res.json({ success: true, message: "Live class updated successfully", data: populated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        const liveClass = await LiveClass.findById(id);
        if (!liveClass) return res.status(404).json({ success: false, message: "Class not found" });

        // Delete Zoom meeting
        try {
            await zoomHelper.deleteZoomMeeting(liveClass.zoomMeetingId);
        } catch (zoomErr) {
            console.error("Zoom delete error:", zoomErr);
        }

        await LiveClass.findByIdAndDelete(id);
        // Also delete related attendance
        await Attendance.deleteMany({ classId: id });

        res.json({ success: true, message: "Live class deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
