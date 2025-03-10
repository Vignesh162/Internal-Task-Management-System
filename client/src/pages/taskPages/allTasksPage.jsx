import React, { useEffect, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import { AuthContext } from "../../components/authContext";
import {getStatusBadge} from "../../helper/getStatusBadge";
import axios from "axios";

const AllTasksPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // ✅ Get user context properly
  //const [user,setUser] = React.useState(null)
  const [tasks, setTasks] = useState([]);

  // useEffect(() => {
  //   const storedUser =  localStorage.getItem("user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //     // console.log("Fetched user from localStorage:", storedUser);
  //   }
  // }, []);

  const getAllTasks = useCallback(async () => {

    try {
      console.log("Fetching tasks for user:", user);
      const endpoint = user.role=="admin"? "http://localhost:5000/api/task":`http://localhost:5000/api/task/allTasksAssignedTo/${user.id}`;
       console.log("Fetching tasks from:", endpoint);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log("Tasks fetched:", response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      console.warn("User not available, skipping task fetch.");
      return;
    }
    getAllTasks();
  }, [user]);

  // // ✅ Function to return status badges based on task status & deadline
  // const getStatusBadge = (status, deadline) => {
  //   const today = new Date();
  //   const deadlineDate = new Date(deadline);

  //   if (status === "completed") {
  //     return <span className="badge bg-success">Completed</span>;
  //   } else if (deadlineDate < today) {
  //     return <span className="badge bg-danger">Past Deadline</span>;
  //   } else if (status === "in-progress") {
  //     return <span className="badge bg-warning text-dark">In Progress</span>;
  //   }
  //   else{
  //     return <span className="badge bg-info">Pending</span>;
  //   }
  // };

  return (
    <>
      <Sidebar />
      <div className="content">
        <h2 className="text-center">All Tasks</h2>
        <div className="card p-3 mt-4 bg-light">
          <h4>Task List</h4>
          {tasks.length === 0 ? (
            <p className="text-center text-muted">No tasks available.</p>
          ) : (
            <ul className="list-group">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  onClick={() => navigate(`/tasks/${task._id}`, { state: task })}
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <strong>{task.title}</strong> <br />
                    <small className="text-muted">
                      Assigned to: {task.assignedTo[0].name || "Unassigned"} | Priority: {task.priority}
                    </small>
                  </div>
                  <div className="text-end">
                    {getStatusBadge(task.status, task.deadline)} <br />
                    <span className="badge bg-secondary mt-1">
                      Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default AllTasksPage;
