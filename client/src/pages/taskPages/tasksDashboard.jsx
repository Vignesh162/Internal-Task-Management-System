import React from "react";
import Sidebar from "../../components/sidebar";
import TaskCard from "../../components/taskCard";
import useFetchDashboardStats from "../../helper/useFetchDashboardStats";

const TasksDashboard = () => {

  const user = { name: "Admin", email: "admin@gmail.com", role: "admin" };
  const {stats, loading} = useFetchDashboardStats();
  if(!stats) return <div>Loading...</div>;
  return (
    <div className="dashboard-container">
      <Sidebar  />
      <div className="content">
        <h2 className="text-center">Tasks Dashboard</h2>
        <div className="row">

          {
          user.role === "admin"&&
          <TaskCard title="Assign New Tasks" count={1} color="danger" icon="bi-file-earmark-plus" route="/tasks/assign"/>
          }
          <TaskCard title="View New Tasks" count={stats.pendingTasks} color="danger" icon="bi-file-earmark-plus" route="/tasks/new" />
          <TaskCard title="View In Progress Tasks" count={stats.inProgressTasks} color="danger" icon="bi-clock" route="/tasks/inprogress" />
          <TaskCard title="View Completed Tasks" count={stats.completedTasks} color="success" icon="bi-check-circle" route="/tasks/completed" />
          <TaskCard title="View All Tasks" count={stats.allTasks} color="primary" icon="bi-list-task" route="/tasks/all"/>
        </div>
      </div>
    </div>
  );
};

export default TasksDashboard;
