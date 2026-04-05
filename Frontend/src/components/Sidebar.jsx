import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const linkStyle = (path) =>
    `block px-4 py-2 rounded transition ${
      location.pathname === path
        ? "bg-gray-700"
        : "hover:bg-gray-700"
    }`;

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed">
      
      {/* Logo / Title */}
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        NGO Tracker
      </div>

      <nav className="flex flex-col p-4 space-y-2">
        
        {/* Dashboard */}
        <Link to="/" className={linkStyle("/")}>
          Dashboard
        </Link>

        {/* Events */}
        <Link to="/events" className={linkStyle("/events")}>
          Events
        </Link>

        {/* TRACKER SECTION */}
        <div className="mt-4 text-gray-400 text-xs uppercase tracking-wider">
          Tracker
        </div>

        <Link to="/events/cip" className={linkStyle("/events/cip")}>
          CIP
        </Link>

        <Link to="/events/achal" className={linkStyle("/events/achal")}>
          Achal Collective
        </Link>

        <Link to="/events/stemora" className={linkStyle("/events/stemora")}>
          STEMoRA
        </Link>

        <Link to="/events/paltan" className={linkStyle("/events/paltan")}>
          Paltan
        </Link>

        {/* MANAGEMENT SECTION */}
        <div className="mt-6 text-gray-400 text-xs uppercase tracking-wider">
          Management
        </div>

        <Link to="/volunteers" className={linkStyle("/volunteers")}>
          Volunteers
        </Link>

        <Link to="/attendance" className={linkStyle("/attendance")}>
          Attendance
        </Link>

        <Link to="/archived-events" className={linkStyle("/archived-events")}>
          Archived Events
        </Link>

      </nav>
    </div>
  );
}