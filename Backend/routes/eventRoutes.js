import express from "express";

import {
  createEvent,
  getEvents,
  deleteEvent,
  getArchivedEvents,
  restoreEvent,
  updateEvent,
  deleteArchivedEvent,
  getMonthlyStats
} from "../controllers/eventController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();


// =======================
// CREATE EVENT
// =======================
router.post("/", protect, authorizeRoles("admin"), createEvent);


// =======================
// GET EVENTS
// =======================
router.get("/", protect, getEvents);


// =======================
// 📊 MONTHLY STATS
// =======================
router.get("/stats/monthly", protect, getMonthlyStats);


// =======================
// 👥 GET VOLUNTEERS  ✅ FIXED PATH
// =======================
// ⚠️ FINAL URL → /api/events/volunteers
router.get("/volunteers", protect, async (req, res) => {
  try {
    const users = await User.find({ role: "volunteer" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// =======================
// GET ARCHIVED EVENTS
// =======================
router.get("/archived", protect, authorizeRoles("admin"), getArchivedEvents);


// =======================
// RESTORE EVENT
// =======================
router.post("/restore/:id", protect, authorizeRoles("admin"), restoreEvent);


// =======================
// PERMANENT DELETE ARCHIVED EVENT
// =======================
router.delete(
  "/archived/:id",
  protect,
  authorizeRoles("admin"),
  deleteArchivedEvent
);


// =======================
// UPDATE EVENT
// =======================
router.put("/:id", protect, authorizeRoles("admin"), updateEvent);


// =======================
// DELETE EVENT (ARCHIVE FLOW)
// =======================
router.delete("/:id", protect, authorizeRoles("admin"), deleteEvent);


export default router;