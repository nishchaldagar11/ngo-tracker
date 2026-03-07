import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function AttendancePage() {

  const { eventId } = useParams();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const markAttendance = async () => {

    if (!name) {
      alert("Please enter your name");
      return;
    }

    try {

      const res = await axios.post(
        "http://192.168.29.26:5000/api/attendance",
        {
          name: name,
          eventId: eventId
        }
      );

      setMessage("✅ Attendance Marked Successfully!");

      setName("");

    } catch (error) {

      console.log(error);

      setMessage("❌ Error marking attendance");

    }

  };

  return (

    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-80 text-center">

        <h1 className="text-xl font-bold mb-4">
          Volunteer Attendance
        </h1>

        <input
          type="text"
          placeholder="Enter your name"
          className="border p-2 w-full mb-4 rounded"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <button
          onClick={markAttendance}
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          Mark Attendance
        </button>

        {message && (
          <p className="mt-4 text-sm">
            {message}
          </p>
        )}

      </div>

    </div>

  );

}