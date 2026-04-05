import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import QRCode from "qrcode.react";

export default function Events() {

  const { program } = useParams();

  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const [editId, setEditId] = useState(null); // 🔥 IMPORTANT

  const [selectedProgram, setSelectedProgram] = useState(
    program ? program.toLowerCase() : "dashboard"
  );

  const baseURL = window.location.origin;

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    try {
      const res = await API.get(`/events?program=${selectedProgram}`);
      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (program) {
      setSelectedProgram(program.toLowerCase());
    }
  }, [program]);

  useEffect(() => {
    fetchEvents();
  }, [selectedProgram]);



  // ================= CREATE EVENT =================
  const createEvent = async () => {
    try {

      if (!name || !location || !date) {
        alert("Fill all fields");
        return;
      }

      await API.post("/events", {
        name,
        location,
        date,
        program: selectedProgram
      });

      resetForm();
      fetchEvents();

    } catch (error) {
      console.log(error);
    }
  };



  // ================= UPDATE EVENT =================
  const updateEvent = async () => {
    try {

      await API.put(`/events/${editId}`, {
        name,
        location,
        date,
        program: selectedProgram
      });

      resetForm();
      fetchEvents();

    } catch (error) {
      console.log(error);
    }
  };



  // ================= SET EDIT =================
  const handleEdit = (event) => {
    setEditId(event._id);
    setName(event.name);
    setLocation(event.location);
    setDate(event.date?.split("T")[0]);
  };



  // ================= RESET =================
  const resetForm = () => {
    setName("");
    setLocation("");
    setDate("");
    setEditId(null);
  };



  // ================= DELETE =================
  const deleteEvent = async (id) => {
    try {
      await API.delete(`/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.log(error);
    }
  };



  // ================= ARCHIVE =================
  const archiveEvent = async (id) => {
    try {
      await API.delete(`/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Events ({selectedProgram})
      </h1>


      {/* ================= FORM ================= */}

      <div className="bg-white p-4 shadow rounded mb-6">

        <select
          className="border p-2 mr-2"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
        >
          <option value="dashboard">Dashboard</option>
          <option value="cip">CIP</option>
          <option value="achal">Achal Collective</option>
          <option value="stemora">STEMoRA</option>
          <option value="paltan">Paltan</option>
        </select>

        <input
          className="border p-2 mr-2"
          placeholder="Event name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 mr-2"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 mr-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* 🔥 MAIN BUTTON */}
        <button
          onClick={editId ? updateEvent : createEvent}
          className={`px-4 py-2 rounded text-white ${
            editId ? "bg-blue-500" : "bg-green-500"
          }`}
        >
          {editId ? "Update Event" : "Create Event"}
        </button>

        {/* 🔥 CANCEL EDIT */}
        {editId && (
          <button
            onClick={resetForm}
            className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
        )}

      </div>



      {/* ================= EVENTS LIST ================= */}

      <div className="bg-white shadow rounded">

        {events.length === 0 && (
          <p className="p-4 text-gray-500">No events available</p>
        )}

        {events.map((event) => (

          <div key={event._id} className="p-4 border-b">

            <h3 className="font-semibold text-lg">
              {event.name}
            </h3>

            <p className="text-gray-500">
              {event.location}
            </p>

            <p className="text-sm text-gray-400">
              {new Date(event.date).toLocaleDateString()}
            </p>

            {/* QR */}
            <div className="mt-3">
              <QRCode
                value={`${baseURL}/attendance/${event._id}`}
                size={90}
              />
            </div>

            {/* 🔥 ACTION BUTTONS */}
            <div className="mt-4 flex gap-2">

              <button
                onClick={() => handleEdit(event)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => archiveEvent(event._id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Archive
              </button>

              <button
                onClick={() => deleteEvent(event._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}