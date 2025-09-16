import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import { AuthContext } from "../../components/authContext";
import { getStatusBadge } from "../../helper/getStatusBadge";
import axios from "axios";

const NewTasksPage = () => {
  // const user = { name: "Admin", email: "admin@gmail.com", role: "admin" };
  const {user} = React.useContext(AuthContext);
  const [tasks, setTasks] = React.useState([]);
  const navigate = useNavigate();

  const getCompletedTask = useCallback(async () =>{
    try{
      const token = localStorage.getItem("token");
       if(!token){
         console.error("No token found");
         return;
       }
       const endpoint = user.role === "admin"? "https://internal-task-management-system.onrender.com/api/task/allPendingTasks":`https://internal-task-management-system.onrender.com/api/task/pendingTasksAssignedTo/${user.id}`;

       const response = await axios.get(endpoint,{
        headers:{Authorization: `Bearer ${token}`}
       });
       const data = response.data;
      //  console.log(data);
       setTasks(data);
      }catch(error){
        console.error("Error fetching tasks:", error.response?.data || error.message);
      }
       }
 ,[user]);
 React.useEffect(() =>
{
  if(!user){
    return;
  }
  // console.log(user);
  getCompletedTask();
},[user]);



  return (
    <>
      <Sidebar />
      <div className="content">
        <h2 className="text-center">New Tasks</h2>
        <div className="card p-3 mt-4 bg-light">
          <h4>Task List</h4>
          {tasks.length === 0 ? (
            <p className="text-center text-muted">No New tasks.</p>
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
                    <small className="text-muted">Assigned to: {task.assignedTo[0].name} | Priority: {task.priority}</small>
                  </div>
                  <div className="text-end">
                    {/* <span className="badge bg-info">Pending</span> <br /> */}
                     {getStatusBadge(task.status, task.deadline)} <br/>
                    <span className="badge bg-secondary mt-1">Deadline: {task.deadline}</span>
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

export default NewTasksPage;
