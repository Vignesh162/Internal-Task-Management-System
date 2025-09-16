import React, { useEffect, useState } from "react";
 import Sidebar from "../components/sidebar";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer
} from "recharts";

const AnalyticsPage = () => {
  const token = localStorage.getItem("token");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          "https://internal-task-management-system.onrender.com/api/task",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [token]);

  // ---- Process Data for Charts ----
  const statusDistribution = ["pending", "in-progress", "completed"].map((status) => ({
    name: status,
    value: tasks.filter((t) => t.status === status).length,
  }));

  // Monthly status distribution (group by month-year)
  const monthlyData = tasks.reduce((acc, task) => {
    const month = new Date(task.deadline).toLocaleString("default", { month: "short", year: "numeric" });
    if (!acc[month]) acc[month] = { month, pending: 0, "in-progress": 0, completed: 0 };
    acc[month][task.status] = (acc[month][task.status] || 0) + 1;
    return acc;
  }, {});
  const monthlyChartData = Object.values(monthlyData);

  // Weekly status distribution (group by ISO week)
  const weeklyData = tasks.reduce((acc, task) => {
    const d = new Date(task.deadline);
    const week = `${d.getFullYear()}-W${Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 86400000 + d.getDay() + 1) / 7)}`;
    if (!acc[week]) acc[week] = { week, pending: 0, "in-progress": 0, completed: 0 };
    acc[week][task.status] = (acc[week][task.status] || 0) + 1;
    return acc;
  }, {});
  const weeklyChartData = Object.values(weeklyData);

  // Yearly status distribution
  const yearlyData = tasks.reduce((acc, task) => {
    const year = new Date(task.deadline).getFullYear();
    if (!acc[year]) acc[year] = { year, pending: 0, "in-progress": 0, completed: 0 };
    acc[year][task.status] = (acc[year][task.status] || 0) + 1;
    return acc;
  }, {});
  const yearlyChartData = Object.values(yearlyData);

  const COLORS = ["#FF8042", "#0088FE", "#00C49F"];

  return (
    <>
      <Sidebar />
      <div className="content p-4">
        <h2 className="text-center mb-4">📊 Task Analytics (Admin)</h2>

        {/* Pie Chart: Current Task Status */}
        <div className="card p-3 mb-5 shadow bg-light">
          <h4 className="text-center">Task Status Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Monthly Status */}
        <div className="card p-3 mb-5 shadow bg-light">
          <h4 className="text-center">Monthly Task Status</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" fill="#FF8042" />
              <Bar dataKey="in-progress" fill="#0088FE" />
              <Bar dataKey="completed" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart: Weekly Status */}
        <div className="card p-3 mb-5 shadow bg-light">
          <h4 className="text-center">Weekly Task Trends</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pending" stroke="#FF8042" />
              <Line type="monotone" dataKey="in-progress" stroke="#0088FE" />
              <Line type="monotone" dataKey="completed" stroke="#00C49F" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Yearly Status */}
        <div className="card p-3 mb-5 shadow bg-light">
          <h4 className="text-center">Yearly Task Status</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" fill="#FF8042" />
              <Bar dataKey="in-progress" fill="#0088FE" />
              <Bar dataKey="completed" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
