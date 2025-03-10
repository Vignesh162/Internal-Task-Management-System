import React from "react"; 
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar";

const TaskDetailsPage = () => {
  const location = useLocation();
  const task = location.state;

  if (!task) return <h2 className="text-center">Task not found!</h2>;

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
          {console.log(task.comments)}
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
          <button className="btn btn-warning mt-3" onClick={() => alert("Navigate to Edit Task Page")}>
            Edit Task
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskDetailsPage;
