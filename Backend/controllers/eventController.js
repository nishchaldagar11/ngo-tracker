import mongoose from "mongoose";

import Event from "../models/Event.js";
import Attendance from "../models/Attendance.js";
import ArchivedEvent from "../models/ArchivedEvent.js";
import ArchivedAttendance from "../models/ArchivedAttendance.js";


// =======================
// CREATE EVENT
// =======================
export const createEvent = async (req, res) => {
  try {
    const { name, description, date, location } = req.body;

    const event = await Event.create({
      name,
      description,
      date,
      location,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// GET ALL ACTIVE EVENTS
// =======================
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email");

    res.status(200).json(events);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// ARCHIVE + DELETE EVENT
// =======================
export const deleteEvent = async (req, res) => {

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const eventId = req.params.id;

    const event = await Event.findById(eventId).session(session);

    if (!event) {
      throw new Error("Event not found");
    }

    // Archive Event
    await ArchivedEvent.create([{
      ...event.toObject(),
      archivedAt: new Date(),
      archivedBy: req.user._id,
    }], { session });

    // Archive Attendance
    const attendance = await Attendance.find({ event: eventId })
      .session(session);

    if (attendance.length > 0) {
      await ArchivedAttendance.insertMany(
        attendance.map(a => ({
          ...a.toObject(),
          archivedAt: new Date(),
          archivedBy: req.user._id,
        })),
        { session }
      );
    }

    // Delete Active Data
    await Attendance.deleteMany({ event: eventId }).session(session);
    await Event.findByIdAndDelete(eventId).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Event archived and deleted successfully",
    });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ message: error.message });
  }
};


// =======================
// GET ARCHIVED EVENTS
// =======================
export const getArchivedEvents = async (req, res) => {
  try {
    const events = await ArchivedEvent.find()
      .populate("archivedBy", "name email");

    res.status(200).json(events);

  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};


// =======================
// RESTORE EVENT
// =======================
export const restoreEvent = async (req, res) => {
  try {

    const eventId = req.params.id;

    const archivedEvent = await ArchivedEvent.findById(eventId);

    if (!archivedEvent) {
      return res.status(404).json({ message: "Archived event not found" });
    }

    await Event.create({
      title: archivedEvent.title,
      description: archivedEvent.description,
      date: archivedEvent.date,
      location: archivedEvent.location,
      createdBy: archivedEvent.createdBy
    });

    await ArchivedEvent.findByIdAndDelete(eventId);

    res.status(200).json({
      message: "Event restored successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};