import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function EventAttendance() {

  const { id } = useParams();

  const [data, setData] = useState([]);
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const res = await API.get(`/attendance/${id}`);
      setData(res.data);

      // ✅ Event name निकाल (अगर available हो)
      if (res.data.length > 0) {
        setEventName(res.data[0]?.event?.name || "Event");
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [id]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          📋 {eventName || "Attendance"} ({data.length})
        </h1>

        {/* ✅ EXPORT BUTTON */}
        <button
          onClick={() => {
            window.open(
              `http://localhost:5000/api/attendance/export/${id}`,
              "_blank"
            );
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>

      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* NO DATA */}
      {!loading && data.length === 0 && (
        <p>No attendance found</p>
      )}

      {/* DATA LIST */}
      {!loading && data.length > 0 && (
        <div className="space-y-3">

          {data.map((a) => (
            <div
              key={a._id}
              className="p-4 bg-white shadow rounded-xl flex justify-between items-center"
            >

              <div>
                <p className="font-semibold text-lg">
                  {a.user?.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {a.user?.email}
                </p>
              </div>

              <span className="text-green-600 font-medium">
                {a.status}
              </span>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}