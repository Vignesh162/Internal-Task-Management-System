import React, { useContext, useState, useEffect } from "react";   
import { AuthContext } from "./authContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [currentImage, setCurrentImage] = useState(0);

  const heroImages = [
    "/adminDashboard.png",
    "/completedTask2.png",
    "/taskDetail.png",
     "/newTaskAssignment.png",
     "/analytics.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000); // change image every 4 seconds
    return () => clearInterval(interval);
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
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="row align-items-center w-100">
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
              style={{ borderRadius: "50px", fontWeight: "600" }}
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

          {/* Right side - sliding hero image */}
          <div className="col-md-6 mt-5 mt-md-0" style={{ height: "50vh", position: "relative" }}>
            <AnimatePresence>
              <motion.img
                key={currentImage}
                src={heroImages[currentImage]}
                alt="Task management illustration"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
                initial={{ y: "100%", opacity: 0 }}   // new comes from bottom
                animate={{ y: "0%", opacity: 1 }}     // fills in to center
                exit={{ y: "-100%", opacity: 0 }}     // old leaves up
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </AnimatePresence>
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
