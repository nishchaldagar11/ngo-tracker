import Event from "../models/Event.js";
import Volunteer from "../models/Volunteer.js";
import Attendance from "../models/Attendance.js";

export const getDashboardStats = async (req, res) => {
  try {

    const totalEvents = await Event.countDocuments();
    const totalVolunteers = await Volunteer.countDocuments();
    const totalAttendance = await Attendance.countDocuments();

    res.json({
      events: totalEvents,
      volunteers: totalVolunteers,
      attendance: totalAttendance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};