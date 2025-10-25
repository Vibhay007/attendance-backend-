const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


let isConnected = false;
async function connectToMongoDB() {
    try {
        await mongoose
            .connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
        isConnected = true;
        console.log("✅ MongoDB Connected")
    } catch (error) {
        console.log("❌ MongoDB Connection Error:", error.message)
    }
}
// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToMongoDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});


// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/student", require("./routes/student"));

app.get("/", (req, res) => res.send("Attendify API Running..."));

// Handle invalid routes
app.all("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start Server
module.exports = app;