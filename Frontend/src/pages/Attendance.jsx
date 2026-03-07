export default function Attendance() {

  const attendance = [
    { name: "Rahul", event: "Plantation Drive", status: "Present" },
    { name: "Ankit", event: "Dog Food Drive", status: "Present" },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Attendance</h1>

      <div className="bg-white p-6 rounded shadow">

        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th>Name</th>
              <th>Event</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((a, i) => (
              <tr key={i} className="border-b">
                <td>{a.name}</td>
                <td>{a.event}</td>
                <td className="text-green-600">{a.status}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}