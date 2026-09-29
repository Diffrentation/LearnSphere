import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * @param {string[]} roles - array of roles allowed to access this route (optional)
 */
const ProtectedRoute = ({ roles = [] }) => {
  const { user } = useSelector((state) => state.auth);

  // ✅ Not logged in
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // ✅ Role check if roles array is provided
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ User is logged in and role is allowed
  return <Outlet />;
};

export default ProtectedRoute;
