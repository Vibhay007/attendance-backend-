const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const protect = require("../middleware/authMiddleware");

// Get logged-in student info
router.get("/me", protect, async (req, res) => {
    const student = await Student.findById(req.student._id);
    const count = await Attendance.countDocuments({ student: req.student._id });
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({
        name: student.name,
        email: student.email,
        attendanceCount: count,
    });
});

module.exports = router;
