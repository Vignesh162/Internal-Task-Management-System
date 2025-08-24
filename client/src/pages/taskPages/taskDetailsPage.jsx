import React from "react"; 
import {useNavigate, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import axios from "axios";


const TaskDetailsPage = () => {
  const location = useLocation();
  const task = location.state;
  const navigate = useNavigate();
  const [newCommentText,setNewCommentText]= React.useState("");

  if (!task) return <h2 className="text-center">Task not found!</h2>;

  const handleAddComment = async (e) => {
    e.preventDefault();
    try{
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }
      console.log("Adding Comment:", newCommentText);
      console.log("Task ID:", task._id);
      const response = await axios.post(`https://internal-task-management-system.onrender.com/api/task/${task._id}/comment`,
        { text: newCommentText, taskId: task._id },
        {headers:{
          "Authorization": `Bearer ${token}`,
        }});
        setNewCommentText("");
      }catch(error){
        console.error("Error adding comment:", error);
      }
    }
  
  return (
    <>
      <Sidebar />
      <div className="content">
        <h2 className="text-center">{task.title}</h2>
        <div className="card p-3 mt-4 bg-light shadow">
          <h4 className="mb-3">Task Details</h4>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Assigned To:</strong> <span className="badge bg-primary">{task.assignedTo?.[0]?.name || "Not Assigned"}</span></p>
          <p><strong>Assignment Date:</strong> {new Date(task.assignmentDate).toLocaleDateString()}</p>
          <p><strong>Deadline:</strong> <span className="badge bg-danger">{new Date(task.deadline).toLocaleDateString()}</span></p>
          <p><strong>Priority:</strong> <span className={`badge ${task.priority === "High" ? "bg-danger" : task.priority === "Medium" ? "bg-warning" : "bg-success"}`}>{task.priority}</span></p>
          <p><strong>Status:</strong> <span className={`badge ${task.status === "completed" ? "bg-success" : task.status === "in-progress" ? "bg-warning" : "bg-secondary"}`}>{task.status}</span></p>

          {/* Attachments */}
          {task.attachments.length > 0 && (
            <p>
              <strong>Attachments:</strong>
              {task.attachments.map((file, index) => (
                <a key={index} href={file} target="_blank" rel="noopener noreferrer" className="ms-2">
                  Attachment {index + 1}
                </a>
              ))}
            </p>
          )}

          {/* Comments Section */}
          {task.comments && task.comments.length > 0 && (
            <div className="mt-3">
              <h5>Comments:</h5>
              <ul className="list-group">
                {task.comments.map((comment, index) => (
                  <li key={index} className="list-group-item">
                    <strong>{comment.user.name}:</strong> <br/>
                    {comment.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Edit Task Button */}
          {/* only show if task is not completed */}
          {task.status !== "completed" && <button className="btn btn-warning mt-3" onClick={() =>{
            navigate("/tasks/update", {state: task});
            }}>
            Edit Task
          </button>}

          {/* add comment button */}
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => {
                setNewCommentText(e.target.value);
              }}
            />
            <button className="btn btn-primary mt-2" onClick={handleAddComment}>Add Comment</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetailsPage;
