const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
      index: true
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    zoomLink: {
      type: String,
      required: true
    },
    zoomMeetingId: {
      type: String
    },
    zoomStartUrl: {
      type: String  // Host/teacher start URL from Zoom
    },
    zoomPassword: {
      type: String  // Meeting password for joining
    },
    topic: {
      type: String
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    duration: {
      type: Number
    },
    reminderSent: {
      type: Boolean,
      default: false
    },
    recordingUrl: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "finished", "recorded"],
      default: "scheduled"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("LiveClass", liveClassSchema);
