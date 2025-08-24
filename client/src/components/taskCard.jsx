import React from "react";
import { useNavigate } from "react-router-dom";

const TaskCard = ({ title, count, color, icon, route,className }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`card text-white bg-${color} mb-3 ${className || ""}`}
      style={{ maxWidth: "24rem", cursor: "pointer" }}
      onClick={() => navigate(route)} // Navigate on click
    >
      <div className="card-body text-center">
        <h2>{count}</h2>
        <i className={`bi ${icon} display-6`}></i>
        <h5 className="card-title mt-2">{title}</h5>
      </div>
    </div>
  );
};

export default TaskCard;
