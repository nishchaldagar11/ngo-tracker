import { useState } from "react";

export default function Volunteers() {

  const [volunteers, setVolunteers] = useState([
    { name: "Rahul", email: "rahul@gmail.com" },
    { name: "Ankit", email: "ankit@gmail.com" }
  ]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const addVolunteer = () => {
    setVolunteers([...volunteers, { name, email }]);
    setName("");
    setEmail("");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Volunteers</h1>

      <div className="bg-white p-6 rounded shadow mb-6">

        <h2 className="text-xl font-semibold mb-4">Add Volunteer</h2>

        <input
          className="border p-2 mr-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 mr-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={addVolunteer}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>

      </div>

      <div className="bg-white p-6 rounded shadow">

        <table className="w-full">

          <thead>
            <tr className="text-left border-b">
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {volunteers.map((v, i) => (
              <tr key={i} className="border-b">
                <td>{v.name}</td>
                <td>{v.email}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}