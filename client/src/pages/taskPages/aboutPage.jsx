import React from "react";

export default function AboutPage() {
  return (
    <div className="container my-5">
      <div className="p-5 bg-light rounded shadow-sm text-start">
        <h1 className="mb-3 fw-bold text-primary text-center">
          About Internal Task Management System
        </h1>
        <p className="lead text-muted mb-4">
          The <strong>Internal Task Management System</strong> is a web-based platform
          designed to streamline task assignments, improve collaboration, and
          ensure deadlines are met within your organization.
        </p>

        <p className="text-secondary mb-4">
          With role-based access control for admins, managers, and employees,
          the system allows efficient task creation, assignment, progress tracking,
          and file sharing — all in one place.
        </p>

        <h4 className="mt-4 mb-3 text-dark fw-semibold">Key Features</h4>
        <ul className="list-unstyled fs-5">
          <li>✅ Role-based permissions</li>
          <li>✅ Task creation, editing, and deletion</li>
          <li>✅ Deadline tracking and reminders</li>
          <li>✅ File attachments for tasks</li>
          <li>✅ Secure login with JWT authentication</li>
        </ul>

        <p className="mt-4 text-muted">
          Built with the <strong>MERN stack</strong> — MongoDB, Express.js, React, and
          Node.js — this system is scalable, secure, and user-friendly.
        </p>
      </div>
    </div>
  );
}
