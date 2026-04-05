import express from "express";

import {
  markAttendance,
  markAttendanceQR,
  getAttendance,
  getEventAttendance,
  exportAttendanceExcel,
  publicAttendance
} from "../controllers/attendanceController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

import Attendance from "../models/Attendance.js"; // ✅ IMPORTANT

const router = express.Router();


// =======================
// MARK ATTENDANCE
// =======================
router.post("/", protect, markAttendance);


// =======================
// 🔥 QR SCAN ATTENDANCE
// =======================
router.post("/mark-qr", markAttendanceQR);


// =======================
// GET EVENT ATTENDANCE (ADMIN)
// =======================
router.get("/event/:eventId", protect, getEventAttendance);


// =======================
// EXPORT EXCEL
// =======================
router.get(
  "/export/:eventId",
  protect,
  authorizeRoles("admin"),
  exportAttendanceExcel
);


// =======================
// GET ATTENDANCE (USED IN FRONTEND)
// =======================
router.get("/:eventId", protect, async (req, res) => {
  try {
    const data = await Attendance.find({
      event: req.params.eventId
    })
      .populate("user", "name email")
      .populate("event", "name"); // ✅ VERY IMPORTANT

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("public",publicAttendance);


export default router;