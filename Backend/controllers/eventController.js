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
    const { name, description, date, location, program } = req.body;

    if (!name || !date || !location) {
      return res.status(400).json({
        message: "Name, date and location are required"
      });
    }

    const event = await Event.create({
      name,
      description,
      date,
      location,
      program,
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
// GET EVENTS (PROGRAM + MONTH FILTER)
// =======================
export const getEvents = async (req, res) => {
  try {

    const filter = {};

    // 🔹 PROGRAM FILTER
    if (req.query.program) {
      filter.program = req.query.program;
    }

    // 🔹 MONTH + YEAR FILTER (🔥 IMPORTANT FOR GRAPH CLICK)
    if (req.query.month && req.query.year) {

      const year = parseInt(req.query.year);
      const month = parseInt(req.query.month);

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      filter.date = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const events = await Event.find(filter)
      .populate("createdBy", "name email")
      .sort({ date: -1 });

    // 🔹 ADD ATTENDANCE COUNT
    const eventsWithAttendance = await Promise.all(
      events.map(async (event) => {

        const attendanceCount = await Attendance.countDocuments({
          event: event._id
        });

        return {
          ...event._doc,
          attendanceCount
        };
      })
    );

    res.status(200).json(eventsWithAttendance);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =======================
// UPDATE EVENT
// =======================
export const updateEvent = async (req, res) => {
  try {

    const { name, description, date, location, program } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { name, description, date, location, program },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent
    });

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

    // 🔹 ARCHIVE EVENT
    await ArchivedEvent.create([{
      ...event.toObject(),
      archivedAt: new Date(),
      archivedBy: req.user._id
    }], { session });

    // 🔹 ARCHIVE ATTENDANCE
    const attendance = await Attendance.find({ event: eventId }).session(session);

    if (attendance.length > 0) {
      await ArchivedAttendance.insertMany(
        attendance.map(a => ({
          ...a.toObject(),
          archivedAt: new Date(),
          archivedBy: req.user._id
        })),
        { session }
      );
    }

    // 🔹 DELETE ACTIVE DATA
    await Attendance.deleteMany({ event: eventId }).session(session);
    await Event.findByIdAndDelete(eventId).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Event archived and deleted successfully"
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
      .populate("archivedBy", "name email")
      .sort({ archivedAt: -1 });

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
      return res.status(404).json({
        message: "Archived event not found"
      });
    }

    await Event.create({
      name: archivedEvent.name,
      description: archivedEvent.description,
      date: archivedEvent.date,
      location: archivedEvent.location,
      program: archivedEvent.program,
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



// =======================
// PERMANENT DELETE ARCHIVED EVENT
// =======================
export const deleteArchivedEvent = async (req, res) => {
  try {

    const eventId = req.params.id;

    const deleted = await ArchivedEvent.findByIdAndDelete(eventId);

    if (!deleted) {
      return res.status(404).json({
        message: "Archived event not found"
      });
    }

    await ArchivedAttendance.deleteMany({ event: eventId });

    res.status(200).json({
      message: "Archived event permanently deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =======================
// MONTHLY STATS (GRAPH DATA)
// =======================
export const getMonthlyStats = async (req, res) => {
  try {

    const { program } = req.query;

    const matchStage = {};

    if (program) {
      matchStage.program = program;
    }

    const stats = await Event.aggregate([

      { $match: matchStage },

      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          totalEvents: { $sum: 1 }
        }
      },

      { $sort: { "_id.year": 1, "_id.month": 1 } }

    ]);

    res.json(stats);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};