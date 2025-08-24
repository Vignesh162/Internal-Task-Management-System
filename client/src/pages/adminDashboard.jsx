import React from "react";
import Sidebar from "../components/sidebar";
import TaskCard from "../components/taskCard";
import { useContext } from "react";
import { AuthContext } from "../components/authContext";
import useFetchDashboardStats from "../helper/useFetchDashboardStats";

const AdminDashboard = () => {
  //const user = { name: "Admin", email: "admin@gmail.com", role: "admin" };
  const { user } = useContext(AuthContext);
  const { stats, loading } = useFetchDashboardStats();
  if(!stats){
    return <div>Loading...</div>;
  }
  return (
    <div className="dashboard-container">
      <Sidebar user={user} />
      <div className="content">
        <h2 className="text-center m-4 mb-5 fw-bold">Dashboard</h2>
        <div className="row">
          <TaskCard className="shadow-sm rounded-3 hover-card" title="Total Departments" count={stats.departments} color="warning" icon="bi-building" route="/departmentPage" />
          <TaskCard className="shadow-sm rounded-3 hover-card" title="Total Employees" count={stats.employees} color="primary" icon="bi-people" route="/employeeManagementDashBoard" />
          {/* <TaskCard title="Assign New Task" count={1} color="danger" icon="bi-file-earmark-plus" route="/tasks/assign"/> */}
          <TaskCard className="shadow-sm rounded-3 hover-card" title="Pending Tasks" count={stats.pendingTasks} color="danger" icon="bi-file-earmark-plus" route="/tasks/new" />
          <TaskCard className="shadow-sm rounded-3 hover-card" title="In Progress Tasks" count={stats.inProgressTasks} color="danger" icon="bi-clock" route="/tasks/inprogress" />
          <TaskCard className="shadow-sm rounded-3 hover-card" title="Completed Tasks" count={stats.completedTasks} color="success" icon="bi-check-circle" route="/tasks/completed" />
          <TaskCard className="shadow-sm rounded-3 hover-card" title="Total Tasks" count={stats.allTasks} color="primary" icon="bi-list-task" route="/tasks/all"/>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
