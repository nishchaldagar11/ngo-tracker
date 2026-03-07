import { useEffect, useState } from "react";
import API from "../services/api";
import QRCode from "qrcode.react";

export default function Events() {

  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  // Automatically get device IP
  const baseURL = "http://192.168.29.26:5173";

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Create event
  const createEvent = async () => {

    if (!title || !location || !date) {
      alert("Please fill all fields");
      return;
    }

    try {

      await API.post("/events", {
        title: title,
        location: location,
        date: date
      });

      setTitle("");
      setLocation("");
      setDate("");

      fetchEvents();

    } catch (error) {
      console.log(error);
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    try {
      await API.delete(`/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.log(error);
    }
  };

  // Archive event
  const archiveEvent = async (id) => {
    try {
      await API.post(`/events/archive/${id}`);
      fetchEvents();
    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Events</h1>

      {/* Create Event */}

      <div className="bg-white p-4 shadow rounded mb-6">

        <input
          className="border p-2 mr-2"
          placeholder="Event title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          className="border p-2 mr-2"
          placeholder="Location"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 mr-2"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
        />

        <button
          onClick={createEvent}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Event
        </button>

      </div>


      {/* Event List */}

      <div className="bg-white shadow rounded">

        {events.length === 0 && (
          <p className="p-4 text-gray-500">No events available</p>
        )}

        {events.map((event)=>(

          <div
            key={event._id}
            className="flex justify-between items-center p-4 border-b"
          >

            <div>

              <h3 className="font-semibold text-lg">
                {event.title || event.name}
              </h3>

              <p className="text-gray-500">
                {event.location}
              </p>

              <p className="text-sm text-gray-400">
                {new Date(event.date).toLocaleDateString()}
              </p>

              {/* QR Code */}

              <div className="mt-3">

                <QRCode
                  value={`${baseURL}/attendance/${event._id}`}
                  size={90}
                />

              </div>

            </div>


            {/* Buttons */}

            <div className="flex gap-2">

              <button
                onClick={()=>archiveEvent(event._id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Archive
              </button>

              <button
                onClick={()=>deleteEvent(event._id)}
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