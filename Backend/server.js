import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import { protect, authorizeRoles } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api", dashboardRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("NGO Tracker API Running...");
});

// Protected test route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route!",
    user: req.user,
  });
});

// Admin only route
app.get("/api/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin 🔥",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});