import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authContext";
import TaskFlowLogo3 from "/Task Flow logo 3.png";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const {user} = useContext(AuthContext);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          <img src={TaskFlowLogo3} alt="Logo"  height="65" className="me-2" />
        </Link>

        {/* Navbar Toggle Button (for mobile) */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Navbar Links aligned to the right */}
          <ul className="navbar-nav ms-auto"> 
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

             {/* Role-based dashboard */}
            {user?.role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/adminDashboard"> Dashboard</Link>
              </li>
            )}

            {user?.role === "employee" && (
              <li className="nav-item">
                <Link className="nav-link" to="/employeeDashboard"> Dashboard</Link>
              </li>
            )}
            {/* Feedback Form */}
            <li className="nav-item">
              <Link className="nav-link" to="/feedbackForm">Feedback</Link>
            </li>

            {/* About Page */}
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>

            {/* Login / Logout Button */}
            <li className="nav-item">
              {token ? (
                <button className="btn btn-danger ms-3" onClick={handleLogout}>Logout</button>
              ) : (
                <Link className="btn btn-primary ms-3" to="/login">Login</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
