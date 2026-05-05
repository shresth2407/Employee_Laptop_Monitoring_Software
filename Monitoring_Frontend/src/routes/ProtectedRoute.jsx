import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {

  const token = localStorage.getItem("accessToken");

  let user = null;

  try {
    const userData = localStorage.getItem("user");

    if (userData && userData !== "undefined") {
      user = JSON.parse(userData);
    }
  } catch (err) {
    console.log("User parse error:", err);
    localStorage.removeItem("user"); // corrupted data clean
  }

  // 🔴 token nahi hai → login page
  if (!token || token === "undefined") {
    return <Navigate to="/login" replace />;
  }

  // 🔴 role mismatch
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;