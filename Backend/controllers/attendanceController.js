import Attendance from "../models/Attendance.js";
import Event from "../models/Event.js";


// MARK ATTENDANCE
export const markAttendance = async (req, res) => {
  try {

    const { eventId, status } = req.body;

    const attendance = await Attendance.create({
      event: eventId,
      user: req.user._id,
      status: status || "present"
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ATTENDANCE
export const getAttendance = async (req, res) => {
  try {

    const attendance = await Attendance.find({
      event: req.params.eventId
    }).populate("user", "name email");

    res.status(200).json(attendance);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};