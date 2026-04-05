import Attendance from "../models/Attendance.js";
import Event from "../models/Event.js";
import ExcelJS from "exceljs";


// =======================
// MARK ATTENDANCE (NORMAL)
// =======================
export const markAttendance = async (req, res) => {
  try {

    const { eventId, status } = req.body;

    if (!eventId) {
      return res.status(400).json({
        message: "Event ID is required"
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const alreadyMarked = await Attendance.findOne({
      event: eventId,
      user: req.user._id
    });

    if (alreadyMarked) {
      return res.status(400).json({
        message: "Attendance already marked"
      });
    }

    const attendance = await Attendance.create({
      event: eventId,
      user: req.user._id,
      status: status || "Present"
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// =======================
// 🔥 QR ATTENDANCE
// =======================
export const markAttendanceQR = async (req, res) => {
  try {

    const { eventId, volunteerId } = req.body;

    if (!eventId || !volunteerId) {
      return res.status(400).json({
        message: "EventId and VolunteerId required"
      });
    }

    const existing = await Attendance.findOne({
      event: eventId,
      user: volunteerId
    });

    if (existing) {
      return res.status(200).json({
        message: "Already marked"
      });
    }

    const attendance = await Attendance.create({
      event: eventId,
      user: volunteerId,
      status: "Present"
    });

    res.status(201).json({
      message: "QR Attendance marked",
      attendance
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// =======================
// GET ATTENDANCE (FOR EVENT)
// =======================
export const getAttendance = async (req, res) => {
  try {

    const attendance = await Attendance.find({
      event: req.params.eventId
    }).populate("user", "name email");

    res.status(200).json(attendance);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// =======================
// ADMIN VIEW (WITH COUNT)
// =======================
export const getEventAttendance = async (req, res) => {
  try {

    const attendance = await Attendance.find({
      event: req.params.eventId
    }).populate("user", "name email");

    res.status(200).json({
      total: attendance.length,
      volunteers: attendance
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// =======================
// 🔥 EXPORT SINGLE EVENT EXCEL
// =======================
export const exportAttendanceExcel = async (req, res) => {
  try {

    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const attendance = await Attendance.find({
      event: eventId
    }).populate("user", "name email");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    // Columns
    sheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Status", key: "status", width: 15 }
    ];

    // Rows
    attendance.forEach((a) => {
      sheet.addRow({
        name: a.user?.name || "N/A",
        email: a.user?.email || "N/A",
        status: a.status || "Present"
      });
    });

    // Headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${event.name}-attendance.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// =======================
// 🔥 EXPORT FULL MONTH EXCEL
// =======================
export const exportMonthlyExcel = async (req, res) => {
  try {

    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        message: "Year and Month required"
      });
    }

    const events = await Event.find({
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1)
      }
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Monthly Report");

    sheet.columns = [
      { header: "Event Name", key: "event", width: 25 },
      { header: "Date", key: "date", width: 20 },
      { header: "Volunteer Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Status", key: "status", width: 15 }
    ];

    for (let ev of events) {

      const attendance = await Attendance.find({ event: ev._id })
        .populate("user", "name email");

      attendance.forEach((a) => {
        sheet.addRow({
          event: ev.name,
          date: new Date(ev.date).toLocaleDateString(),
          name: a.user?.name || "N/A",
          email: a.user?.email || "N/A",
          status: a.status || "Present"
        });
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=monthly-report-${month}-${year}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};



// =======================
// PUBLIC ATTENDANCE (QR)
// =======================
export const publicAttendance = async (req, res) => {
  try {

    const { eventId, name, email } = req.body;

    const attendance = await Attendance.create({
      event: eventId,
      name,
      email,
      status: "Present"
    });

    res.json({
      message: "Attendance marked successfully",
      attendance
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};