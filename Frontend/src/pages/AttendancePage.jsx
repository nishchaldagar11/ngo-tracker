import { useParams } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

export default function AttendancePage() {

  const { id } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {

      await API.post("/attendance/public", {
        eventId: id,
        name,
        email
      });

      setSubmitted(true);

    } catch (error) {
      console.log(error);
      alert("Error ❌");
    }
  };

  if (submitted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold text-green-600">
          Attendance Marked ✅
        </h2>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded shadow w-80">

        <h2 className="text-xl font-bold mb-4 text-center">
          Mark Attendance
        </h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Enter Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white w-full p-2 rounded"
        >
          Submit
        </button>

      </div>

    </div>
  );
}