const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.student = await Student.findById(decoded.id).select("-password");
            if (!req.student) return res.status(401).json({ message: "Student not found" });
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, token missing" });
    }
};

module.exports = protect;
