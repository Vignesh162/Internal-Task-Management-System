import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/sidebar";

const EditTaskPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state; // Receiving task data from TaskDetailsPage
  if(!task) return <h2 className="text-center">Task not found!</h2>;
  const token = localStorage.getItem("token");

  // Local state for progress and new comment
  const [progress, setProgress] = useState(task.progress || 0);
  const [loading, setLoading] = useState(false); // ✅ Loading state for save button

  // Handle Save (Progress + Comment)
  const handleSave = async () => {
    setLoading(true);
    try {
      // Update Progress
      await axios.put(
        `http://localhost:5000/api/task/${task._id}`,
        { progress },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );


      alert("Task updated successfully!"); // ✅ Feedback to user
      navigate(-1); // Go back to TaskDetailsPage
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  if (!task) return <h2 className="text-center">Task not found!</h2>;

  return (
    <>
      <Sidebar />
      <div className="content">
        <h2 className="text-center">{task.title}</h2>
        <div className="card p-3 mt-4 bg-light">
          <h4>Task Details</h4>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Assigned To:</strong> {task.assignedTo.name}</p>
          <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
          <p><strong>Priority:</strong> {task.priority}</p>

          {/* Progress Update */}
          <div className="mb-3">
            <label><strong>Progress:</strong></label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="form-range"
            />
            <span>{progress}%</span>
          </div>


          {/* Buttons */}
          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTaskPage;
