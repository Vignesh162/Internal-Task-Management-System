import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import axios from "axios";

const TaskDetailsPage = () => {
  const location = useLocation();
  const task = location.state;
  const navigate = useNavigate();

  const [newCommentText, setNewCommentText] = useState("");
  const [comments, setComments] = useState(task?.comments || []);
  const [error, setError] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);

  if (!task) return <h2 className="text-center mt-5">Task not found!</h2>;

  const handleAddComment = async (e) => {
    e.preventDefault();
    setError("");

    if (!newCommentText.trim()) return setError("Comment cannot be empty");

    try {
      const token = localStorage.getItem("token");
      if (!token) return setError("User not authenticated");

      setLoadingComment(true);

      const response = await axios.post(
        `https://internal-task-management-system.onrender.com/api/task/${task._id}/comment`,
        { text: newCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local comments state immediately
      setComments(response.data.task.comments);
      setNewCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Try again.");
    } finally {
      setLoadingComment(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="content">
        <h2 className="text-center">{task.title}</h2>

        <div className="card p-3 mt-4 bg-light shadow">
          <h4 className="mb-3">Task Details</h4>

          <p><strong>Description:</strong> {task.description}</p>

          <p>
            <strong>Assigned To:</strong>{" "}
            {task.assignedTo && task.assignedTo.length > 0
              ? task.assignedTo.map((user, idx) => (
                  <span key={user._id || idx} className="badge bg-primary me-1">
                    {user.name}
                  </span>
                ))
              : <span className="badge bg-secondary">Not Assigned</span>}
          </p>

          <p><strong>Assignment Date:</strong> {new Date(task.assignmentDate).toLocaleDateString()}</p>
          <p><strong>Deadline:</strong> <span className="badge bg-danger">{new Date(task.deadline).toLocaleDateString()}</span></p>

          <p>
            <strong>Priority:</strong>{" "}
            <span className={`badge ${task.priority === "High" ? "bg-danger" : task.priority === "Medium" ? "bg-warning text-dark" : "bg-success"}`}>
              {task.priority}
            </span>
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span className={`badge ${task.status === "completed" ? "bg-success" : task.status === "in-progress" ? "bg-warning text-dark" : "bg-secondary"}`}>
              {task.status}
            </span>
          </p>

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="mb-2">
              <strong>Attachments:</strong>{" "}
              {task.attachments.map((file, index) => {
                // Handle both string URLs and objects with 'url' property
                const fileUrl = typeof file === "string" ? file : file.url;
                return (
                  <a
                    key={index}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ms-2"
                  >
                    File {index + 1}
                  </a>
                );
              })}
            </div>
          )}

          {/* Comments */}
          <div className="mt-3">
            <h5>Comments:</h5>
            {comments && comments.length > 0 ? (
              <ul className="list-group">
                {comments.map((comment, index) => (
                  <li key={index} className="list-group-item">
                    <strong>{comment.user?.name || "Unknown"}:</strong>
                    <br />
                    {comment.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}
          </div>

          {/* Edit Task Button */}
          {task.status !== "completed" && (
            <button
              className="btn btn-warning mt-3"
              onClick={() => navigate("/tasks/update", { state: task })}
            >
              Edit Task
            </button>
          )}

          {/* Add Comment */}
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            />
            <button
              className="btn btn-primary mt-2"
              onClick={handleAddComment}
              disabled={loadingComment}
            >
              {loadingComment ? "Adding..." : "Add Comment"}
            </button>
            {error && <p className="text-danger mt-1">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetailsPage;
