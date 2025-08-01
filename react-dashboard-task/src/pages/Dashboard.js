import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { FaVirusCovid } from "react-icons/fa6";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("https://disease.sh/v3/covid-19/all");
        setStats(res.data);
      } catch (err) {
        console.error("Stats Fetch Error:", err);
      }
    };

    const fetchChartData = async () => {
      try {
        const res = await axios.get(
          "https://disease.sh/v3/covid-19/historical/all?lastdays=30"
        );
        const formattedData = Object.keys(res.data.cases).map((date) => ({
          date,
          cases: res.data.cases[date],
          deaths: res.data.deaths[date],
          recovered: res.data.recovered[date]
        }));
        setChartData(formattedData);
      } catch (err) {
        console.error("Chart Data Fetch Error:", err);
      }
    };

    fetchStats();
    fetchChartData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6">
      {/* Header */}
      <header className="flex flex-col items-center text-center mb-10">
        <FaVirusCovid className="text-5xl text-blue-600 animate-pulse mb-3" />
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          COVID-19 Dashboard
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-2">
          Global Statistics & Trends — Updated Daily
        </p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total Cases" value={stats.cases} color="text-blue-600" />
        <StatCard label="Deaths" value={stats.deaths} color="text-red-600" />
        <StatCard label="Recovered" value={stats.recovered} color="text-green-600" />
      </section>

      {/* Chart */}
      <section className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-xl font-bold mb-4 text-center sm:text-left text-gray-700">
          Global Trends (Last 30 Days)
        </h2>
        <div className="w-full h-[50vh] min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="deaths" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-white rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer p-6 text-center">
    <p className="text-lg text-gray-600 mb-2">{label}</p>
    <h2 className={`text-3xl font-bold ${color}`}>
      {value?.toLocaleString() || "—"}
    </h2>
  </div>
);

export default Dashboard;
