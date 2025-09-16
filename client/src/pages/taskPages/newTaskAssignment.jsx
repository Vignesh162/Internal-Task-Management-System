import React, { useState, useEffect } from "react"; 
import Sidebar from "../../components/sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import axios from "axios";

const NewTaskAssignment = () => {
  const token = localStorage.getItem("token");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("Low");
  const [deadline, setDeadline] = useState(new Date());
  const [attachments, setAttachments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "https://internal-task-management-system.onrender.com/api/employee",
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
  }, [token]);

  // Handle file selection
  const handleAttachmentChange = (e) => {
    setAttachments([...e.target.files]);
  };

  // Handle form submit with Cloudinary upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return alert("No token found");
    if (!taskTitle || !taskDesc || selectedEmployees.length === 0)
      return alert("Please fill all required fields!");

    try {
      const uploadedFiles = [];

      // Upload each file to Cloudinary
      for (const file of attachments) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "task_uploads"); // replace with your preset
        formData.append("folder", "task_files"); // files will go to Home → task_files

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dvjkompau/upload", // replace with your cloud name
          formData
        );

        // Store both URL and public_id
        uploadedFiles.push({
          url: res.data.secure_url,
          public_id: res.data.public_id,
        });
      }

      // Prepare task data
      const taskData = {
        title: taskTitle,
        description: taskDesc,
        deadline: deadline.toISOString(),
        priority: selectedPriority,
        assignedTo: selectedEmployees.map((emp) => emp.value),
        attachments: uploadedFiles,
      };

      await axios.post(
        "https://internal-task-management-system.onrender.com/api/task",
        taskData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Task Assigned Successfully!");

      // Reset form
      setTaskTitle("");
      setTaskDesc("");
      setSelectedEmployees([]);
      setSelectedPriority("Low");
      setDeadline(new Date());
      setAttachments([]);
    } catch (error) {
      console.error("Error assigning task:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="content">
        <h2 className="text-center">New Task Assignment</h2>
        <form className="card p-3 mt-4 bg-light" onSubmit={handleSubmit}>
          <h4>Task Details</h4>

          {/* Employee Selection */}
          <div className="mb-4 mt-4">
            <label>Select Employee(s):</label>
            {loading ? (
              <p>Loading employees...</p>
            ) : (
              <Select
                options={employees}
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
            ></textarea>
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label htmlFor="attachments" className="form-label">Attach Files</label>
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

          {/* Email Notification */}
          <div className="mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="emailNotification"
            />
            <label htmlFor="emailNotification" className="form-label ms-2">
              Email Notification to Employee
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary mt-3">Assign Task</button>
        </form>
      </div>
    </>
  );
};

export default NewTaskAssignment;
