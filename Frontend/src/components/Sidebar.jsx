import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed">

      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        NGO Tracker
      </div>

      <nav className="flex flex-col p-4 space-y-4">

        <Link to="/" className="hover:bg-gray-700 p-2 rounded">
          Dashboard
        </Link>

        <Link to="/events" className="hover:bg-gray-700 p-2 rounded">
          Events
        </Link>

        <Link to="/volunteers" className="hover:bg-gray-700 p-2 rounded">
          Volunteers
        </Link>

        <Link to="/attendance" className="hover:bg-gray-700 p-2 rounded">
          Attendance
        </Link>

        <Link to="/archived-events" className="hover:bg-gray-700 p-2 rounded">
          Archived Events
        </Link>

      </nav>

    </div>
  );
}