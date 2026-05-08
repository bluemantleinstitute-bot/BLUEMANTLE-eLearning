const express = require("express");
const router = express.Router();

const { scheduleClass, getAllClasses, getTeacherClasses, getBatchClasses, getMyClasses, joinLive, watchRecording, updateStatus, updateClass, deleteClass } = require("../controllers/liveClassController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin and Teacher schedule and get classes
router.post("/", authMiddleware, roleMiddleware("admin", "owner", "teacher"), scheduleClass);
router.get("/", authMiddleware, roleMiddleware("admin", "owner"), getAllClasses);

// Manage specific class
router.put("/:id", authMiddleware, roleMiddleware("admin", "owner", "teacher"), updateClass);
router.delete("/:id", authMiddleware, roleMiddleware("admin", "owner", "teacher"), deleteClass);

// Teacher view classes
router.get("/teacher", authMiddleware, roleMiddleware("teacher"), getTeacherClasses);

// Auth view classes (authorization in controller)
router.get("/batch/:batchId", authMiddleware, getBatchClasses);
router.get("/my-classes", authMiddleware, getMyClasses);

// Attendance logic
router.post("/join-live", authMiddleware, joinLive);
router.post("/watch-recording", authMiddleware, watchRecording);

// Class management (Teacher/Admin)
router.put("/:classId/status", authMiddleware, updateStatus);
router.post("/sync-zoom-attendance", authMiddleware, roleMiddleware("teacher", "admin", "owner"), require("../controllers/liveClassController").syncZoomAttendance);

module.exports = router;
