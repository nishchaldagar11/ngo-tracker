import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// PAGES
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Events from "./pages/Events";
import Volunteers from "./pages/Volunteers";
import Attendance from "./pages/Attendance";
import ArchivedEvents from "./pages/ArchivedEvents";
import AttendancePage from "./pages/AttendancePage";

// 🔥 NEW PAGES
import MonthlyDashboard from "./pages/MonthlyDashboard";
import MonthlyDetails from "./pages/MonthlyDetails";
import EventAttendance from "./pages/EventAttendance";

// TRACKER PAGES
import DashboardTracker from "./pages/tracker/DashboardTracker";
import CIP from "./pages/tracker/CIP";
import AchalCollective from "./pages/tracker/AchalCollective";
import Stemora from "./pages/tracker/Stemora";
import Paltan from "./pages/tracker/Paltan";

import QRScanner from "./pages/QRScanner";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= LOGIN ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= PUBLIC QR ATTENDANCE ================= */}
        <Route path="/attendance/:id" element={<AttendancePage />} />

        {/* ================= PROTECTED APP ================= */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex">

                {/* SIDEBAR */}
                <Sidebar />

                {/* MAIN CONTENT */}
                <div className="ml-64 w-full">

                  <Navbar />

                  <div className="p-6">

                    <Routes>

                      {/* ================= DASHBOARD ================= */}
                      <Route path="/" element={<Dashboard />} />

                      {/* ================= MONTHLY ================= */}
                      <Route path="/dashboard-stats" element={<MonthlyDashboard />} />
                      <Route path="/monthly/:year/:month" element={<MonthlyDetails />} />

                      {/* ================= EVENTS ================= */}
                      <Route path="/events" element={<Events />} />
                      <Route path="/events/:program" element={<Events />} />

                      {/* ================= VOLUNTEERS ================= */}
                      <Route path="/volunteers" element={<Volunteers />} />

                      {/* ================= ATTENDANCE ================= */}
                      <Route path="/attendance" element={<Attendance />} />

                      {/* ================= EVENT ATTENDANCE (🔥 NEW) ================= */}
                      <Route path="/event/:id" element={<EventAttendance />} />

                      {/* ================= ARCHIVED ================= */}
                      <Route path="/archived-events" element={<ArchivedEvents />} />

                      {/* ================= TRACKER ================= */}
                      <Route path="/tracker/dashboard" element={<DashboardTracker />} />
                      <Route path="/tracker/cip" element={<CIP />} />
                      <Route path="/tracker/achal" element={<AchalCollective />} />
                      <Route path="/tracker/stemora" element={<Stemora />} />
                      <Route path="/tracker/paltan" element={<Paltan />} />


                      {/* ================= QR SCANNER ================= */}
                      <Route path="/scan" element={<QRScanner />} />

                    </Routes>

                  </div>

                </div>

              </div>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}