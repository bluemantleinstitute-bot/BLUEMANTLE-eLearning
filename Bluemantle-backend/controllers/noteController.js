const Note = require("../models/Note");
const User = require("../models/user");

exports.createNote = async (req, res) => {
    try {
        const { title, fileUrl, courseId, moduleId } = req.body;
        
        if (!title || !fileUrl || !courseId || !moduleId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const note = await Note.create({ title, fileUrl, courseId, moduleId });

        res.status(201).json({ success: true, message: "Note created successfully", data: note });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getStudentNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("enrolledCourses");

        if (!user || !user.enrolledCourses || user.enrolledCourses.length === 0) {
            return res.json({ success: true, folders: [], recentFiles: [] });
        }

        const notes = await Note.find({ courseId: { $in: user.enrolledCourses } })
            .populate("courseId", "title")
            .populate("moduleId", "title")
            .sort({ createdAt: -1 })
            .lean();

        // Organize into folders (by Course)
        const folderMap = {};
        notes.forEach(note => {
            const courseTitle = note.courseId ? note.courseId.title : "Other Materials";
            if (!folderMap[courseTitle]) {
                folderMap[courseTitle] = { name: courseTitle, fileCount: 0 };
            }
            folderMap[courseTitle].fileCount++;
        });

        const folders = Object.values(folderMap);
        const recentFiles = notes.slice(0, 10).map(n => ({
            id: n._id,
            name: n.title,
            folder: n.courseId ? n.courseId.title : "Uncategorized",
            size: "Unknown", // We don't store size in the model yet
            url: n.fileUrl
        }));

        res.json({ success: true, folders, recentFiles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find()
            .populate("courseId", "title")
            .populate("moduleId", "title")
            .sort({ createdAt: -1 });
        res.json({ success: true, data: notes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        res.json({ success: true, message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
