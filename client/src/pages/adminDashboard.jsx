import React, { useContext } from "react";
import Sidebar from "../components/sidebar";
import TaskCard from "../components/taskCard";
import { AuthContext } from "../components/authContext";
import useFetchDashboardStats from "../helper/useFetchDashboardStats";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { stats } = useFetchDashboardStats();
  const navigate = useNavigate();

  if (!stats) {
    return (
      <div className="d-flex justify-content-center align-items-center  " style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container d-flex">
      <Sidebar user={user} />
      <div className="content p-4">
        {/* Greeting */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold text-center">Welcome, {user?.name || "Admin"}</h2>
          <span className="badge bg-secondary fs-6">{user?.role}</span>
        </div>

        {/* Dashboard Title */}
        <h3 className="mb-2 fw-semibold text-primary">Dashboard Overview</h3>

        {/* Task Cards */}
        <div className="row g-4">
          <div className="col-md-4 col-sm-6">
            <TaskCard className="hover-card" title="Total Departments" count={stats.departments} color="warning" icon="bi-building" route="/departmentPage" />
          </div>
          <div className="col-md-4 col-sm-6">
            <TaskCard className="hover-card" title="Total Employees" count={stats.employees} color="primary" icon="bi-people" route="/employeeManagementDashBoard" />
          </div>
          <div className="col-md-4 col-sm-6">
            <TaskCard className="hover-card" title="Pending Tasks" count={stats.pendingTasks} color="danger" icon="bi-file-earmark-plus" route="/tasks/new" />
          </div>
          <div className="col-md-4 col-sm-6">
            <TaskCard className="hover-card" title="In Progress Tasks" count={stats.inProgressTasks} color="info" icon="bi-clock" route="/tasks/inprogress" />
          </div>
          <div className="col-md-4 col-sm-6">
            <TaskCard className="hover-card" title="Completed Tasks" count={stats.completedTasks} color="success" icon="bi-check-circle" route="/tasks/completed" />
          </div>
          <div className="col-md-4 col-sm-6">
            <TaskCard className="hover-card" title="Total Tasks" count={stats.allTasks} color="secondary" icon="bi-list-task" route="/tasks/all" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="d-flex gap-3 mt-3">
          <button className="btn btn-primary" onClick={() => navigate("/tasks/assign")}>
            <i className="bi bi-plus-circle me-2"></i> Assign Task
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate("/employeeManagementDashBoard")}>
            <i className="bi bi-person-plus me-2"></i> Manage Employees
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
