import React, { useContext,useState } from "react";
import { AuthContext } from "../components/authContext"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";


const employeesData = [
  { id: 1, name: "John Doe", email: "john@example.com", department: "Development", role: "Software Engineer", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", department: "Marketing", role: "Marketing Manager", status: "Inactive" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", department: "HR", role: "HR Executive", status: "Active" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", department: "Finance", role: "Finance Analyst", status: "Active" },
];

const ViewEmployeesPage = () => {
  const {user,token} = useContext(AuthContext);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const getEmployeeData = async() =>{
    try{
    console.log("Fetching Employees Data!");
    const endpoint = "https://internal-task-management-system.onrender.com/api/employee";
    console.log("Fetching employee data from:", endpoint);
    
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(response);
    setEmployees(response?.data);
    }catch(err){
      console.log(err);
    } 
  }
    React.useEffect(() => {
      if(!user){
      console.warn("User not available, skipping employee fetching.");
      return;
    }
    getEmployeeData();
    },[user]);
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
              {employees.map((employee, index) => (
                <tr
                  key={index}
                  // onClick={() => navigate(`/employee/${employee.id}`, { state: employee })}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>{employee.role}</td>
                  <td>
                    <span className={`badge ${employee.status === "active" ? "bg-success" : "bg-secondary"}`}>
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

export default ViewEmployeesPage;
