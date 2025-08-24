import React from "react";
import Sidebar from "../components/sidebar";
import TaskCard from "../components/taskCard";

const EmployeeManagementDashboard = () => {
  const user = { name: "Admin", email: "admin@gmail.com", role: "admin" };

  return (
    <div className="dashboard-container">
      <Sidebar user={user} />
      <div className="content">
        <h2 className="text-center">Employee Mangement Dashboard</h2>
        <div className="row">
        <TaskCard title="View All Employees" color="primary" icon="bi-people" route="/viewEmployeesPage" />
        <TaskCard title="Manage Employees"  color="primary" icon="bi-people" route="/manageEmployeesPage" />
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagementDashboard;
