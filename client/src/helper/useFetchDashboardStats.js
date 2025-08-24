import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../components/authContext";

const useFetchDashboardStats = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user) return; // Wait for user to load
        const token = localStorage.getItem("token");

        const response = await axios.get("https://internal-task-management-system.onrender.com/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading };
};

export default useFetchDashboardStats;
