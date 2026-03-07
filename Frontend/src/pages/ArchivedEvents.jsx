import { useEffect, useState } from "react";
import API from "../services/api";

export default function ArchivedEvents() {

  const [events, setEvents] = useState([]);

  const fetchArchived = async () => {
    const res = await API.get("/events/archived");
    setEvents(res.data);
  };

  useEffect(() => {
    fetchArchived();
  }, []);

  const restoreEvent = async (id) => {
    await API.post(`/events/restore/${id}`);
    fetchArchived();
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Archived Events
      </h1>

      <div className="bg-white shadow rounded">

        {events.map((event)=>(
          <div
            key={event._id}
            className="flex justify-between p-4 border-b"
          >

            <div>
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-gray-500">{event.location}</p>
            </div>

            <button
              onClick={()=>restoreEvent(event._id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Restore
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}