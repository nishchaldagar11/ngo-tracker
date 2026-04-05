import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// 🔥 IMPORTANT FIX (CHART REGISTER)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyDashboard() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await API.get("/events/stats/monthly");
      setData(res.data);
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 🔥 SAFE CHECK
  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!data || data.length === 0) {
    return <p className="p-6">No data available</p>;
  }

  const labels = data.map(
    d => `${d._id.month}/${d._id.year}`
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Events per Month",
        data: data.map(d => d.totalEvents),
        backgroundColor: "rgba(59, 130, 246, 0.6)"
      }
    ]
  };

  return (
    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">
        Monthly Events
      </h2>

      <Bar
        data={chartData}
        onClick={(e, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const selected = data[index];

            navigate(`/monthly/${selected._id.year}/${selected._id.month}`);
          }
        }}
      />

    </div>
  );
}