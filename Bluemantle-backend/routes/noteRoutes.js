const express = require("express");
const router = express.Router();

const { createNote, getStudentNotes, getAllNotes, deleteNote } = require("../controllers/noteController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin and Teacher create note
router.get("/", authMiddleware, roleMiddleware("admin", "owner", "teacher"), getAllNotes);
router.post("/", authMiddleware, roleMiddleware("admin", "owner", "teacher"), createNote);
router.delete("/:id", authMiddleware, roleMiddleware("admin", "owner", "teacher"), deleteNote);

// Student get my notes
router.get("/my-notes", authMiddleware, getStudentNotes);

module.exports = router;
