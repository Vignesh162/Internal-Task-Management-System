import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "./authContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ new loading state
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true); // ✅ Start loading

    const endpoint = 'https://internal-task-management-system.onrender.com/api/auth/login';

    try {
      const res = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
      });

      // Store token & user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Set user in context
      setUser(res.data.user);

      setSuccess("Login successful! Redirecting...");

      // Redirect based on user role
      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate('/adminDashboard');
        } else {
          navigate('/employeeDashboard');
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="p-4 border rounded">
            <h2 className="text-center mb-4">Login</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading} // ✅ disable while logging in
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading} // ✅ disable while logging in
                />
              </div>

              {error && <p className="text-danger text-center">{error}</p>}
              {success && <p className="text-success text-center">{success}</p>}

              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading} // ✅ disable button
              >
                {loading ? "Logging in..." : "Login"} {/* ✅ show progress */}
              </button>

              <p className="text-center mt-3">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
