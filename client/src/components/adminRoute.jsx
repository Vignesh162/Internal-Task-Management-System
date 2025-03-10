import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || user?.role !== "admin") {
    return <Navigate to="/unauthorized" />; // Redirect to an error page
  }

  return <Outlet />;
};

export default AdminRoute;
