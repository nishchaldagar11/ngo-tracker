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

// =======================
// CONNECT DB
// =======================
connectDB();


// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());


// =======================
// ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api", dashboardRoutes);


// =======================
// HOME ROUTE (IMPORTANT)
// =======================
app.get("/", (req, res) => {
  res.status(200).send("NGO Tracker API Running 🚀");
});


// =======================
// HEALTH CHECK (RENDER FIX)
// =======================
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});


// =======================
// TEST ROUTES
// =======================
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route!",
    user: req.user,
  });
});

app.get("/api/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin 🔥",
  });
});


// =======================
// ERROR HANDLER (VERY IMPORTANT)
// =======================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    message: "Server Error",
    error: err.message,
  });
});


// =======================
// SERVER START (RENDER FIX)
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});