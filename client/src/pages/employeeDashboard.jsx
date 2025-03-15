import React from "react";
import Sidebar from "../components/sidebar";
import TaskCard from "../components/taskCard";
import { useContext } from "react";
import { AuthContext } from "../components/authContext";
import useFetchDashboardStats from "../helper/useFetchDashboardStats";

const EmployeeDashboard = () => {
  //const user = { name: "Rahul Singh", email: "rahul12@gmail.com", role: "employee" };
    const { user } = useContext(AuthContext);
    const { stats, loading } = useFetchDashboardStats();
    if(!stats){
      return <div>Loading...</div>;
    }
  return (
    <div className="dashboard-container">
      <Sidebar/>
      <div className="content">
        <h2 className="text-center">Dashboard</h2>
        <div className="row">
          <TaskCard title="New Tasks" count={stats.pendingTasks} color="danger" icon="bi-file-earmark-plus" route="/tasks/new" />
          <TaskCard title="In Progress Tasks" count={stats.inProgressTasks} color="warning" icon="bi-clock" route="/tasks/inprogress" />
          <TaskCard title="Completed Tasks" count={stats.completedTasks} color="success" icon="bi-check-circle" route="/tasks/completed" />
          <TaskCard title="All Tasks" count={stats.allTasks} color="primary" icon="bi-list-task" route="/tasks/all" />
          <TaskCard title="View tasks in Calender" count={1}  color="primary" icon="bi bi-calendar" route="/tasks/calender" />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
