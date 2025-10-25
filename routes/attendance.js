const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const protect = require("../middleware/authMiddleware");

// Mark Attendance
router.post("/mark", protect, async (req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const studentId = req.student._id;

    const exists = await Attendance.findOne({ student: studentId, date: today });
    if (exists) return res.status(200).json({ message: "Attendance already marked for today!" });

    await Attendance.create({ student: studentId, date: today });
    res.status(200).json({ message: "Attendance marked successfully!" });
});

// Get Attendance History
router.get("/history", protect, async (req, res) => {
    const studentId = req.student._id;
    const records = await Attendance.find({ student: studentId }).sort({ date: -1 });
    res.json(records);
});

module.exports = router;
