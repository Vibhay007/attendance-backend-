const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// Register Student
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const exists = await Student.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const student = await Student.create({ name, email, password });
    if (student) {
        res.status(201).json({
            _id: student._id,
            name: student.name,
            email: student.email,
            token: generateToken(student._id),
        });
    } else {
        res.status(400).json({ message: "Invalid data" });
    }
});

// Login Student
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (student && (await student.matchPassword(password))) {
        res.json({
            _id: student._id,
            name: student.name,
            email: student.email,
            token: generateToken(student._id),
        });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

module.exports = router;
