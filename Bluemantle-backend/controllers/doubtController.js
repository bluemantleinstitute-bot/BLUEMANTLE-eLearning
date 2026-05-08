const Doubt = require("../models/Doubt");

// Student submits a new doubt
exports.submitDoubt = async (req, res) => {
    try {
        const { subject, question } = req.body;
        if (!subject || !question) {
            return res.status(400).json({ success: false, message: "Subject and Question are required" });
        }

        const doubt = await Doubt.create({
            studentId: req.user.id,
            subject,
            question
        });

        res.status(201).json({ success: true, message: "Doubt submitted successfully", data: doubt });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Student gets their own doubts
exports.getMyDoubts = async (req, res) => {
    try {
        const doubts = await Doubt.find({ studentId: req.user.id })
            .sort({ createdAt: -1 })
            .lean();
        res.json({ success: true, data: doubts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin/Teacher gets all doubts
exports.getAllDoubts = async (req, res) => {
    try {
        const doubts = await Doubt.find()
            .populate("studentId", "name email")
            .sort({ status: 1, createdAt: -1 })
            .lean();
        res.json({ success: true, data: doubts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Teacher/Admin responds to a doubt
exports.respondToDoubt = async (req, res) => {
    try {
        const { id } = req.params;
        const { answer, status } = req.body;

        if (!answer) {
            return res.status(400).json({ success: false, message: "Answer is required" });
        }

        const doubt = await Doubt.findById(id);
        if (!doubt) {
            return res.status(404).json({ success: false, message: "Doubt not found" });
        }

        doubt.answer = answer;
        doubt.status = status || "Resolved";
        doubt.instructorId = req.user.id;
        doubt.resolvedAt = Date.now();
        
        await doubt.save();

        res.json({ success: true, message: "Response submitted successfully", data: doubt });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
