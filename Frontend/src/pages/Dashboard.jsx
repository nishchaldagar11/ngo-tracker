import { useEffect, useState } from "react";

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

  const [stats, setStats] = useState({
    events: 0,
    volunteers: 0,
    attendance: 0
  });

  const [eventData, setEventData] = useState([]);
  const [volunteerData, setVolunteerData] = useState([]);

  useEffect(() => {

    // Dashboard stats
    fetch("http://localhost:5000/api/dashboard")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log(err));


    // Fetch events
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((events) => {

        const monthMap = {};

        events.forEach((e) => {
          const month = new Date(e.date).toLocaleString("default",{month:"short"});

          monthMap[month] = (monthMap[month] || 0) + 1;
        });

        const chartData = Object.keys(monthMap).map((m)=>({
          month:m,
          events:monthMap[m]
        }));

        setEventData(chartData);

      });


    // Fetch volunteers
    fetch("http://localhost:5000/api/volunteers")
      .then((res) => res.json())
      .then((vols) => {

        const monthMap = {};

        vols.forEach((v)=>{

          const month = new Date(v.createdAt).toLocaleString("default",{month:"short"});

          monthMap[month] = (monthMap[month] || 0) + 1;

        });

        const chartData = Object.keys(monthMap).map((m)=>({
          month:m,
          volunteers:monthMap[m]
        }));

        setVolunteerData(chartData);

      });

  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}

      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Total Events</h2>
          <p className="text-3xl font-bold">{stats.events}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Volunteers</h2>
          <p className="text-3xl font-bold">{stats.volunteers}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Attendance</h2>
          <p className="text-3xl font-bold">{stats.attendance}</p>
        </div>

      </div>


      {/* Charts */}

      <div className="grid grid-cols-2 gap-8">

        {/* Events Chart */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-lg font-semibold mb-4">
            Events Per Month
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={eventData}>

              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="events"
                fill="#3b82f6"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* Volunteer Growth */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-lg font-semibold mb-4">
            Volunteer Growth
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={volunteerData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="volunteers"
                stroke="#10b981"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}