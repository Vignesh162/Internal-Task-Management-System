import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/sidebar";

const EditTaskPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state;

  if (!task) return <h2 className="text-center mt-5">Task not found!</h2>;

  const token = localStorage.getItem("token");

  const [progress, setProgress] = useState(task.progress || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    setLoading(true);

    try {
      // Update progress
      const response = await axios.put(
        `https://internal-task-management-system.onrender.com/api/task/${task._id}`,
        { progress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Task updated successfully!");
      navigate(-1); // Go back to TaskDetailsPage
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="content">
        <h2 className="text-center">{task.title}</h2>
        <div className="card p-3 mt-4 bg-light">
          <h4>Task Details</h4>
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

          <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
          <p><strong>Priority:</strong> {task.priority}</p>

          {/* Optional: Display attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="mb-3">
              <strong>Attachments:</strong>{" "}
              {task.attachments.map((file, idx) => (
                <a key={idx} href={file} target="_blank" rel="noopener noreferrer" className="ms-2">
                  File {idx + 1}
                </a>
              ))}
            </div>
          )}

          {/* Progress Update */}
          <div className="mb-3">
            <label><strong>Progress:</strong></label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="form-range"
            />
            <span className="ms-2">{progress}%</span>
          </div>

          {/* Buttons */}
          <div className="mt-3">
            <button
              className="btn btn-primary me-2"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>

          {error && <p className="text-danger mt-2">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default EditTaskPage;
