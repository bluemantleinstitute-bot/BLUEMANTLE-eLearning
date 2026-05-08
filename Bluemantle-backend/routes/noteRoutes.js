const express = require("express");
const router = express.Router();

const { createNote, getStudentNotes } = require("../controllers/noteController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin and Teacher create note
router.post("/", authMiddleware, roleMiddleware("admin", "owner", "teacher"), createNote);

// Student get my notes
router.get("/my-notes", authMiddleware, getStudentNotes);

module.exports = router;
