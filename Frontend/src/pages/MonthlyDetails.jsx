import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function MonthlyDetails() {

  const { year, month } = useParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState("");

  const fetchData = async () => {
    try {
      const res = await API.get(
        `/events?year=${year}&month=${month}&program=${program}`
      );
      setEvents(res.data);
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year, month, program]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        📅 {new Date(year, month - 1).toLocaleString("default", {
          month: "long"
        })} {year}
        <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
          {events.length} Events
        </span>
      </h1>

      {/* FILTER */}
      <select
        value={program}
        onChange={(e) => setProgram(e.target.value)}
        className="mb-4 border p-2 rounded"
      >
        <option value="">All Programs</option>
        <option value="CIP">CIP</option>
        <option value="STEMoRA">STEMoRA</option>
        <option value="Paltan">Paltan</option>
      </select>

      {/* FULL MONTH EXCEL */}
      <button
        onClick={() => {
          window.open(
            `http://localhost:5000/api/attendance/export/monthly?year=${year}&month=${month}`,
            "_blank"
          );
        }}
        className="mb-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download Full Month Report
      </button>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* EMPTY */}
      {!loading && events.length === 0 && (
        <p>No events found</p>
      )}

      {/* EVENTS LIST */}
      {!loading && events.map((e) => (
        <div
          key={e._id}
          onClick={() => navigate(`/event/${e._id}`)}
          className="bg-white p-4 mb-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >

          <h3 className="font-semibold text-lg">
            {e.name || "No name"}
          </h3>

          <p className="text-gray-600">
            📍 {e.location || "No location"}
          </p>

          <p className="text-sm text-gray-400 mb-3">
            📅 {e.date
              ? new Date(e.date).toLocaleDateString()
              : "No date"}
          </p>

          {/* 🔥 STOP PROPAGATION (IMPORTANT) */}
          <button
            onClick={(event) => {
              event.stopPropagation(); // 🔥 prevents redirect
              window.open(
                `http://localhost:5000/api/attendance/export/${e._id}`,
                "_blank"
              );
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Export Attendance Excel
          </button>

        </div>
      ))}

    </div>
  );
}