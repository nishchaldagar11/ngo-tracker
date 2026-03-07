import express from "express";

import {
  createEvent,
  getEvents,
  deleteEvent,
  getArchivedEvents,
  restoreEvent
} from "../controllers/eventController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can create event
router.post("/", protect, authorizeRoles("admin"), createEvent);

// Anyone logged in can see events
router.get("/", protect, getEvents);

// Only admin can delete event
router.delete("/:id", protect, authorizeRoles("admin"), deleteEvent);

// Archived events
router.get("/archived", protect, authorizeRoles("admin"), getArchivedEvents);

// Restore event
router.post("/restore/:id", protect, authorizeRoles("admin"), restoreEvent);

export default router;