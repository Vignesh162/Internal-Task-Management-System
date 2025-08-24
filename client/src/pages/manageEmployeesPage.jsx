import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../components/authContext";
import Sidebar from "../components/sidebar";

const ManageEmployeesPage = () => {
  const { token, user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [departments,setDepartments] = useState([]);
          
  // Fetch employees from backend
  useEffect(() => {
    if (!token) return;
    fetchEmployees();
    fetchDepartments();
  }, [user]);

  const fetchEmployees = async () => {
      try {
        const res = await axios.get("https://internal-task-management-system.onrender.com/api/employee", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
  const fetchDepartments = async () => {
    try {
      const res = await axios.get("https://internal-task-management-system.onrender.com/api/department", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data); // Expecting an array of department names
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };
  // Handle edit click
  const handleEdit = (employee) => {
    console.log(departments);
    setEditingId(employee._id);
    setFormData(employee);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle save
  const handleSave = async () => {
    try {
      const { name, department, role, status } = formData;

      await axios.put(`https://internal-task-management-system.onrender.com/api/employee`,{id:editingId,  name, department, role, status}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === editingId ? { ...formData } : emp))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  return (
    <>
      <Sidebar user={user} />
      <div className="content p-4">
        <h2 className="m-4 text-center">Manage Employees</h2>
        <div className="card p-3 bg-light">
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee._id}>
                  <td>{index + 1}</td>
                  <td>
                    {editingId === employee._id ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                      />
                    ) : (
                      employee.name
                    )}
                  </td>

                  {/* editable email */}
                  {/* <td>
                    {editingId === employee._id ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                      />
                    ) : (
                      employee.email
                    )}
                  </td> */}

                  {/* uneditable email */}
                  <td>{employee.email}</td>
                  <td>
                    {editingId === employee._id ? (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept, idx) => (
                        <option key={idx} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    ) : (
                      employee.department
                    )}
                  </td>
                  <td>
                    {/* {editingId === employee._id ? (
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="form-control"
                      />
                    ) : (
                      employee.role
                    )} */}
                    {employee.role}
                  </td>
                  <td>
                    {editingId === employee._id ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span className={`badge ${employee.status === "active" ? "bg-success" : "bg-secondary"}`}>
                        {employee.status}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingId === employee._id ? (
                      <>
                        <button className="btn btn-success btn-sm me-2" onClick={handleSave}>
                          Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(employee)}>
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageEmployeesPage;
