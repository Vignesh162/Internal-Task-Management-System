import React, { useContext } from "react"; 
import Sidebar from "../components/sidebar";
import TaskCard from "../components/taskCard";
import { AuthContext } from "../components/authContext";
import useFetchDashboardStats from "../helper/useFetchDashboardStats";

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const { stats, loading } = useFetchDashboardStats();

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="dashboard-container d-flex">
      <Sidebar />

      <div className="content flex-grow-1 p-4" style={{ background: "#f5f7fa", minHeight: "100vh" }}>
        {/* Welcome Heading */}
        <div className="mb-4 text-center">
          <h2 className="fw-bold mb-2">Welcome, {user.name}!</h2>
          <p className="text-muted">Here's a quick overview of your tasks</p>
        </div>

        {/* Task Cards Grid */}
        <div className="row g-4">
          <TaskCard
            className="hover-card"
            title="New Tasks"
            count={stats.pendingTasks}
            color="danger"
            icon="bi-file-earmark-plus"
            route="/tasks/new"
          />
          <TaskCard
            className="hover-card"
            title="In Progress Tasks"
            count={stats.inProgressTasks}
            color="warning"
            icon="bi-clock"
            route="/tasks/inprogress"
          />
          <TaskCard
            className="hover-card"
            title="Completed Tasks"
            count={stats.completedTasks}
            color="success"
            icon="bi-check-circle"
            route="/tasks/completed"
          />
          <TaskCard
            className="hover-card"
            title="All Tasks"
            count={stats.allTasks}
            color="primary"
            icon="bi-list-task"
            route="/tasks/all"
          />
          <TaskCard
            className="hover-card"
            title="View tasks in Calendar"
            count={1}
            color="info"
            icon="bi-calendar"
            route="/tasks/calender"
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
