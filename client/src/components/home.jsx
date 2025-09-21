import React, { useContext, useState, useEffect } from "react";  
import { AuthContext } from "./authContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [animateHero, setAnimateHero] = useState(false);

  useEffect(() => {
    setAnimateHero(true); // trigger animation on mount
  }, []);

  const getStartedLink = !user
    ? "/login"
    : user.role === "admin"
    ? "/adminDashboard"
    : "/employeeDashboard";

  const buttonText = !user ? "Get Started" : "Go to Dashboard";

  return (
    <>
      {/* Hero Section */}
      <div
        className="container-fluid d-flex align-items-center justify-content-center"
        style={{
          minHeight: "90vh",
          background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
          padding: "3rem",
          opacity: animateHero ? 1 : 0,
          transform: animateHero ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1s ease, transform 1s ease",
        }}
      >
        <div className="row align-items-center">
          {/* Left side - text */}
          <div className="col-md-6 text-center text-md-start">
            <h1 className="display-3 fw-bold text-primary mb-3">
              Manage Your Tasks <br /> Smarter & Faster 🚀
            </h1>
            <p className="lead text-secondary mb-4" style={{ maxWidth: "500px" }}>
              Stay organized, track progress, and collaborate seamlessly with our
              internal task management system.
            </p>
            <Link
              to={getStartedLink}
              className="btn btn-primary btn-lg px-5 py-3 me-3"
              style={{
                borderRadius: "50px",
                transition: "all 0.3s ease",
                fontWeight: "600",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {buttonText}
            </Link>
            <Link
              to="/about"
              className="btn btn-outline-secondary btn-lg px-4 py-3"
              style={{ borderRadius: "50px" }}
            >
              Learn More
            </Link>
          </div>

          {/* Right side - illustration */}
          <div className="col-md-6 mt-5 mt-md-0 text-center">
            <img
              src="/adminDashboard2.png"
              alt="Task management illustration"
              className="img-fluid"
              style={{
                height: "50vh",        // occupy 50% of viewport height
                width: "100%",          // fill container width
                objectFit: "contain",   // maintain aspect ratio
                transition: "transform 0.5s ease, opacity 1s ease",
                transform: animateHero ? "scale(1)" : "scale(0.95)",
                opacity: animateHero ? 1 : 0,
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </div>

      {/* Feature Highlights Section */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5 text-dark">
          Why Choose Our Task Management App?
        </h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow border-0 h-100 text-center p-4">
              <div className="mb-3">
                <span style={{ fontSize: "3rem" }}>✅</span>
              </div>
              <h5 className="fw-bold">Track Progress</h5>
              <p className="text-muted">
                Monitor tasks in real-time and never miss a deadline again.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow border-0 h-100 text-center p-4">
              <div className="mb-3">
                <span style={{ fontSize: "3rem" }}>👥</span>
              </div>
              <h5 className="fw-bold">Collaborate Seamlessly</h5>
              <p className="text-muted">
                Assign tasks, share files, and work together efficiently.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow border-0 h-100 text-center p-4">
              <div className="mb-3">
                <span style={{ fontSize: "3rem" }}>📊</span>
              </div>
              <h5 className="fw-bold">Stay Organized</h5>
              <p className="text-muted">
                Keep everything in one place with structured task management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
