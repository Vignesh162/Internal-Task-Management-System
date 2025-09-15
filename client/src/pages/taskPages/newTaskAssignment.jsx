import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../../components/sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import axios from "axios";
import { AuthContext } from "../../components/authContext";

const NewTaskAssignment = () => {
  const token = localStorage.getItem("token")
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("Low");
  const [deadline, setDeadline] = useState(new Date());
  const [attachments, setAttachments] = useState([]);

  const [employees, setEmployees] = useState([]); // ✅ Employee state
  const [loading, setLoading] = useState(true); // ✅ Loading state

  // ✅ Fetch employees from backend API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("https://internal-task-management-system.onrender.com/api/employee",
          { headers: { 'Authorization': `Bearer ${token}` } }); // Replace with your API endpoint
        const formattedEmployees = response.data.map((emp) => ({
          value: emp._id,
          label: emp.name,
        }));
        setEmployees(formattedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleAttachmentChange = (e) => {
    setAttachments([...e.target.files]); // ✅ Store multiple files in state
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!token) {
        console.log("No token found");
        return;
      }
  
      if (!taskTitle || !taskDesc || selectedEmployees.length === 0) {
        alert("Please fill all required fields!");
        return;
      }
  
      const taskData = {
        title: taskTitle,
        description: taskDesc,
        deadline: deadline.toISOString(),
        priority: selectedPriority,
        assignedTo: selectedEmployees.map((emp) => emp.value), // Send as an array
        attachments: attachments.map((file) => `${file.name}`),
      };
  
      console.log("Sending Data:", taskData); // Debugging
  
      const response = await axios.post("https://internal-task-management-system.onrender.com/api/task", taskData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",  // ✅ Important: Sending JSON
        },
      });
  
      alert("Task Assigned Successfully!");
  
      // Reset form after successful submission
      setTaskTitle("");
      setTaskDesc("");
      setSelectedEmployees([]);
      setSelectedPriority("Low");
      setDeadline(new Date());
      setAttachments(null);
  
    } catch (error) {
      console.error("Error assigning task:", error.response?.data || error.message);
    }
  };
  

  return (
    <>
      <Sidebar />
      <div className="content">
        <h2 className="text-center">New Task Assignment</h2>
        <form className="card p-3 mt-4 bg-light">
          <h4>Task Details</h4>

          {/* Employee Selection */}
          <div className="mb-4 mt-4">
            <label>Select Employee(s):</label>
            {loading ? (
              <p>Loading employees...</p> // ✅ Show loading state
            ) : (
              <Select
                options={employees} // ✅ Now employees are fetched dynamically
                isMulti
                value={selectedEmployees}
                onChange={setSelectedEmployees}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          </div>

          {/* Task Title */}
          <div className="mb-4">
            <label htmlFor="taskTitle" className="form-label">Task Title</label>
            <input
              className="form-control form-control-lg"
              id="taskTitle"
              type="text"
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              aria-label="Task Title"
            />
          </div>

          {/* Task Description */}
          <div className="mb-4 mt-3">
            <label htmlFor="taskDesc" className="form-label">Task Description</label>
            <textarea
              className="form-control"
              id="taskDesc"
              placeholder="Enter task description"
              rows="3"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              aria-label="Task Description"
            ></textarea>
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label htmlFor="formFile" className="form-label">Attach File</label>
            <input
              className="form-control"
              type="file"
              id="attachments"
              multiple
              onChange={handleAttachmentChange}
            />
          </div>

          {/* Task Priority */}
          <div className="mb-4">
            <label htmlFor="priority" className="form-label">Task Priority</label>
            <select
              className="form-select"
              id="priority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="" disabled>Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Task Deadline */}
          <div className="mb-4">
            <label>Select Deadline:</label>
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              className="form-control"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div className="mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="emaillNotification"
            />
             <label htmlFor="emaillNotification" className="form-label">Email Notification to Employee </label>
          </div>

        <button 
            className="btn btn-primary mt-3" 
            onClick={handleSubmit}
            >
            Assign Task
        </button>
 
        </form>
      </div>
    </>
  );
};

export default NewTaskAssignment;
