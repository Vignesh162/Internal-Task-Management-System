import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { AuthContext } from "../components/authContext";
import axios from "axios";

const DepartmentPage = () => {
  const { user } = useContext(AuthContext);

  // State for departments
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState(""); // Department name
  const [newDeptDescription, setNewDeptDescription] = useState(""); // Department description

  // Fetch departments
  const getDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await axios.get("http://localhost:5000/api/department", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "newDept") setNewDept(value);
    if (name === "newDeptDescription") setNewDeptDescription(value);
  };

  // Add new department
  const handleAddDepartment = async () => {
    if (newDept.trim() === "" || newDeptDescription.trim() === "") return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const newDepartment = {
        name: newDept,
        description: newDeptDescription,
      };

      const response = await axios.post(
        "http://localhost:5000/api/department",
        newDepartment,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDepartments([...departments, response.data]); // Add new dept to UI
      setNewDept(""); // Clear name input
      setNewDeptDescription(""); // Clear description input
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="content">
        <h2 className="text-center">Departments</h2>

        {/* Department List */}
        <div className="card p-3 mt-4 bg-light">
          <h4>Existing Departments</h4>
          <ul className="list-group">
            {departments.map((dept) => (
              <li key={dept._id} className="list-group-item">
                <strong>{dept.name}</strong>
                <p className="text-muted mb-0">{dept.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Add New Department */}
        <div className="card p-3 mt-4 bg-light">
          <h4>Add New Department</h4>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter department name"
            name="newDept"
            value={newDept}
            onChange={handleChange}
          />
          <textarea
            className="form-control"
            placeholder="Enter department description"
            name="newDeptDescription"
            value={newDeptDescription}
            onChange={handleChange}
          />
          <button className="btn btn-primary mt-3" onClick={handleAddDepartment}>
            Add Department
          </button>
        </div>
      </div>
    </>
  );
};

export default DepartmentPage;
