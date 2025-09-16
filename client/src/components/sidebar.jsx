import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./authContext";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="profile">
        <img src="/pfp-placeholder2.jpeg" alt="User" className="profile-pic" />
        {!collapsed && (
          <>
            <h5>{user.name}</h5>
            <p>{user.email}</p>
          </>
        )}
      </div>

      <ul className="nav flex-column">
        {user.role === "admin" ? (
          <li>
            <Link to="/adminDashboard">📊 Dashboard</Link>
          </li>
        ) : (
          <li>
            <Link to="/employeeDashboard">📊 Dashboard</Link>
          </li>
        )}

        {user.role === "admin" && !collapsed && (
          <>
            <li>
              <Link to="/departmentPage">🏢 Departments</Link>
            </li>
            <li>
              <Link to="/employeeManagementDashBoard">👥 Employees</Link>
            </li>
            <li>
              <Link to="/analyticsPage">📊 Analytics</Link>
            </li>
          </>
        )}
        <li>
          <Link to="/tasksDashboard">📋 Tasks</Link>
        </li>
      </ul>

      {/* Collapse toggle button */}
      <button
        className="collapse-btn .align-items-center"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "➡️" : "⬅️"}
      </button>
    </div>
  );
};

export default Sidebar;
