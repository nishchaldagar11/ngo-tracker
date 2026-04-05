import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

export default function Dashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    events: 0,
    volunteers: 0,
    attendance: 0
  });

  const [eventData, setEventData] = useState([]);
  const [volunteerData, setVolunteerData] = useState([]);

  useEffect(() => {

    // ================= STATS =================
    const fetchStats = async () => {
      try {
        const res = await API.get("/dashboard");
        setStats(res.data);
      } catch (error) {
        console.log("Stats Error:", error.response?.data || error.message);
      }
    };

    // ================= EVENTS =================
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events");

        if (!Array.isArray(res.data)) {
          setEventData([]);
          return;
        }

        const monthMap = {};

        res.data.forEach((e) => {
          if (!e.date) return;

          const date = new Date(e.date);

          const monthName = date.toLocaleString("default", { month: "short" });
          const monthNumber = date.getMonth() + 1;
          const year = date.getFullYear();

          const key = `${monthNumber}-${year}`;

          if (!monthMap[key]) {
            monthMap[key] = {
              month: monthName,
              monthNumber,
              year,
              events: 0
            };
          }

          monthMap[key].events += 1;
        });

        // ✅ SORT FIX
        const sortedData = Object.values(monthMap).sort(
          (a, b) =>
            a.year - b.year || a.monthNumber - b.monthNumber
        );

        setEventData(sortedData);

      } catch (error) {
        console.log("EVENT ERROR:", error.response?.data || error.message);
        setEventData([]);
      }
    };

    // ================= VOLUNTEERS =================
    const fetchVolunteers = async () => {
      try {
        const res = await API.get("/volunteers");

        if (!Array.isArray(res.data)) {
          setVolunteerData([]);
          return;
        }

        const monthMap = {};

        res.data.forEach((v) => {
          if (!v.createdAt) return;

          const date = new Date(v.createdAt);

          const monthName = date.toLocaleString("default", { month: "short" });
          const monthNumber = date.getMonth() + 1;

          const key = monthNumber;

          if (!monthMap[key]) {
            monthMap[key] = {
              month: monthName,
              monthNumber,
              volunteers: 0
            };
          }

          monthMap[key].volunteers += 1;
        });

        // ✅ SORT FIX
        const sortedData = Object.values(monthMap).sort(
          (a, b) => a.monthNumber - b.monthNumber
        );

        setVolunteerData(sortedData);

      } catch (error) {
        console.log("VOL ERROR:", error.response?.data || error.message);
        setVolunteerData([]);
      }
    };

    fetchStats();
    fetchEvents();
    fetchVolunteers();

  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2>Total Events</h2>
          <p className="text-3xl">{stats.events}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2>Volunteers</h2>
          <p className="text-3xl">{stats.volunteers}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2>Attendance</h2>
          <p className="text-3xl">{stats.attendance}</p>
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-8">

        {/* EVENTS GRAPH */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="mb-4 font-semibold">Events Per Month</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={eventData}>

              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="events" fill="#3b82f6" 
              onClick={(data) => {
                if (!data) return;

                navigate(`monthly/${data.year}/${data.monthNumber}`);

              }} />

            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* VOLUNTEERS GRAPH */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="mb-4 font-semibold">Volunteer Growth</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={volunteerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="volunteers" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}