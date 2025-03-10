import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";

const employeesData = [
  { id: 1, name: "John Doe", email: "john@example.com", department: "Development", role: "Software Engineer", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", department: "Marketing", role: "Marketing Manager", status: "Inactive" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", department: "HR", role: "HR Executive", status: "Active" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", department: "Finance", role: "Finance Analyst", status: "Active" },
];

const TotalEmployeesPage = () => {
  const user = { name: "Admin", email: "admin@gmail.com", role: "admin" };
  const navigate = useNavigate();

  return (
    <>
      <Sidebar user={user} />
      <div className="content">
        <h2 className="text-center">Total Employees</h2>
        <div className="card p-3 mt-4 bg-light">
          <h4>Employee List</h4>
          <table className="table table-striped mt-3">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employeesData.map((employee, index) => (
                <tr
                  key={employee.id}
                  onClick={() => navigate(`/employee/${employee.id}`, { state: employee })}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>{employee.role}</td>
                  <td>
                    <span className={`badge ${employee.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                      {employee.status}
                    </span>
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

export default TotalEmployeesPage;
