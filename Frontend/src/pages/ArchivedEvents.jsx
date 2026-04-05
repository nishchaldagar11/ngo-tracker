import { useEffect, useState } from "react";
import API from "../services/api";

export default function ArchivedEvents() {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH ARCHIVED =================
  const fetchArchived = async () => {
    try {
      setLoading(true);
      const res = await API.get("/events/archived");
      setEvents(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchived();
  }, []);

  // ================= RESTORE EVENT =================
  const restoreEvent = async (id) => {
    try {
      await API.post(`/events/restore/${id}`);
      fetchArchived();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= DELETE EVENT (NEW 🔥) =================
  const deleteEvent = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to permanently delete this event?"
      );

      if (!confirmDelete) return;

      await API.delete(`/events/archived/${id}`);
      fetchArchived();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Archived Events
      </h1>

      <div className="bg-white shadow rounded">

        {/* 🔄 Loading */}
        {loading && (
          <p className="p-4 text-gray-500">Loading...</p>
        )}

        {/* ❌ Empty */}
        {!loading && events.length === 0 && (
          <p className="p-4 text-gray-500">
            No archived events
          </p>
        )}

        {/* ✅ DATA */}
        {!loading && events.map((event)=>(
          <div
            key={event._id}
            className="flex justify-between items-center p-4 border-b hover:bg-gray-50"
          >

            <div>
              <h3 className="font-semibold text-lg">
                {event.name || event.title || event.description || "No Title"}
              </h3>

              <p className="text-gray-500">
                {event.location || "No Location"}
              </p>

              <p className="text-sm text-gray-400">
                {event.program?.toUpperCase?.() || "GENERAL"}
              </p>

              <p className="text-sm text-gray-400">
                {event.date
                  ? new Date(event.date).toLocaleDateString()
                  : "No date"}
              </p>
            </div>

            {/* 🔥 BUTTONS */}
            <div className="flex gap-2">

              <button
                onClick={()=>restoreEvent(event._id)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Restore
              </button>

              <button
                onClick={()=>deleteEvent(event._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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