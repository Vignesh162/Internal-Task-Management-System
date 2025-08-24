import React, { useContext } from "react";
import { AuthContext } from "./authContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  const getStartedLink = !user
    ? "/login"
    : user.role === "admin"
    ? "/adminDashboard"
    : "/employeeDashboard";

  const buttonText = !user ? "Get Started" : "Go to Dashboard";

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        minHeight: "80vh",
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
        padding: "2rem",
      }}
    >
      <h1
        className="display-4 fw-bold text-primary"
        style={{ maxWidth: "700px" }}
      >
        Welcome to My Internal Task Management App
      </h1>
      <p className="lead text-secondary mt-3">
        Manage your tasks smoothly and efficiently!
      </p>
      <a
        href={getStartedLink}
        className="btn btn-primary btn-lg mt-4 px-5"
        style={{
          borderRadius: "50px",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)")
        }
        onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
      >
        {buttonText}
      </a>
    </div>
  );
};

export default Home;
