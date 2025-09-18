import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import { AuthContext } from "../../components/authContext";
import axios from "axios";

const CompletedTasksPage = () => {
  // const user = { name: "Admin", email: "admin@gmail.com", role: "admin" };
  const {user} = React.useContext(AuthContext);
  const [tasks, setTasks] = React.useState([]);
  const [loading,setLoading] = React.useState(true);
  const navigate = useNavigate();

  const getCompletedTask = useCallback(async () =>{
    try{
      const token = localStorage.getItem("token");
       if(!token){
         console.error("No token found");
         return;
       }
       const endpoint = user.role === "admin"? "https://internal-task-management-system.onrender.com/api/task/allCompletedTasks":`https://internal-task-management-system.onrender.com/api/task/completedTasksAssignedTo/${user.id}`;

       const response = await axios.get(endpoint,{
        headers:{Authorization: `Bearer ${token}`}
       });
       const data = response.data;
       console.log(data);
       setTasks(data);
      }catch(error){
        console.error("Error fetching tasks:", error.response?.data || error.message);
      }finally{
        setLoading(false);
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
    if(loading){
    return <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
            </div>
  }


  return (
    <>
      <Sidebar />
      <div className="content">
        <h2 className="text-center">Completed Tasks</h2>
        <div className="card p-3 mt-4 bg-light">
          <h4>Task List</h4>
          {tasks.length === 0 ? (
            <p className="text-center text-muted">No completed tasks.</p>
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
                    <span className="badge bg-success">Completed</span> <br />
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

export default CompletedTasksPage;
