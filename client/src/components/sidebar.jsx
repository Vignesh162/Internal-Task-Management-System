import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authContext";

const Sidebar = () => {
  const { user } =  useContext(AuthContext);
  if (!user) {
    return <p>Loading...</p>; // ✅ Prevents crash if user is null
  }
  return (
    <div className="sidebar">
      <div className="profile">
        <img src="/pfp-placeholder2.jpeg" alt="User" className="profile-pic" />
        <h5>{user.name}</h5>
        <p>{user.email}</p>
      </div>
      <ul className="nav flex-column">
        {user.role === "admin"?<li><Link to="/adminDashboard">📊 Dashboard</Link></li>:<li><Link to="/employeeDashboard">📊 Dashboard</Link></li>}
        
        {user.role === "admin" && (
          <>
            <li><Link to="/departmentPage">🏢 Departments</Link></li>
            <li><Link to="/employeeManagementDashBoard">👥 Employees</Link></li>
          </>
        )}
        <li><Link to="/tasksDashboard">📋 Tasks</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
