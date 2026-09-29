import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useResetPasswordMutation } from "../../../Redux/api/authApi"; // Make sure this API exists

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Get userId from location.state
  useEffect(() => {
    const stateUserId = location.state?.userId;
    console.log("resetPassword User if is :", stateUserId);

    if (!stateUserId) {
      setError("No userId found. Please restart the forgot password process.");
    } else {
      setUserId(stateUserId);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!userId) {
      setError("No userId found. Cannot reset password.");
      return;
    }

    try {
      // ✅ Match backend controller fields
      const result = await resetPassword({
        userId,
        newPassword: password,
        confirmPassword,
      }).unwrap();

      alert(result.message || "✅ Password reset successfully!");
      navigate("/auth/login"); // Redirect to login
    } catch (err) {
      setError(err?.data?.message || "Failed to reset password.");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-cyan-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-cyan-700 mb-6">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-cyan-300 rounded-xl outline-none text-lg bg-cyan-50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 text-cyan-700 transition duration-300"
            />
          </div>

          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-cyan-300 rounded-xl outline-none text-lg bg-cyan-50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 text-cyan-700 transition duration-300"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl shadow-lg hover:bg-cyan-700 transition duration-300 disabled:opacity-50"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
