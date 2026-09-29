import React from "react";
import { useLogoutUserMutation } from "../../../Redux/api/authApi";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../../../Redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function LogoutButton() {
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // ✅ Call backend to invalidate token
      await logoutUser().unwrap();

      // ✅ Clear Redux state
      dispatch(clearCredentials());

      // ✅ Clear session storage
      sessionStorage.clear();

      // ✅ Clear localStorage too (Important)
      localStorage.removeItem("auth");   // ⬅ if you only stored credentials here
      // OR use this if you want to wipe everything:
      // localStorage.clear();

      toast.success("Logged out successfully");

      // ✅ Redirect to login page
      navigate("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error(err?.data?.message || "Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}

export default LogoutButton;
