import React from "react";
import { Link, useNavigate } from "react-router-dom";
import DCTechInfoLogo from "/dctechinfologo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          <img src={DCTechInfoLogo} alt="Logo" width="65" height="65" className="me-2" />
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
            <li className="nav-item">
              <Link className="nav-link" to="/feedbackForm">Feedback</Link>
            </li>
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
