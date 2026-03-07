import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Events from "./pages/Events";
import Volunteers from "./pages/Volunteers";
import Attendance from "./pages/Attendance";
import ArchivedEvents from "./pages/ArchivedEvents";
import AttendancePage from "./pages/AttendancePage";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* QR ATTENDANCE PAGE (PUBLIC) */}
        <Route path="/attendance/:id" element={<AttendancePage />} />

        {/* PROTECTED DASHBOARD */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>

              <div className="flex">

                {/* SIDEBAR */}
                <Sidebar />

                {/* MAIN AREA */}
                <div className="ml-64 w-full">

                  <Navbar />

                  <div className="p-6">

                    <Routes>

                      <Route path="/" element={<Dashboard />} />

                      <Route path="/events" element={<Events />} />

                      <Route path="/volunteers" element={<Volunteers />} />

                      <Route path="/attendance" element={<Attendance />} />

                      <Route path="/archive" element={<ArchivedEvents />} />

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