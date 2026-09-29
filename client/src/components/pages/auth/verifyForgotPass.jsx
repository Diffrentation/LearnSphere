import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useVerifyOTPForgotPassMutation } from "../../../Redux/api/authApi";

function OtpVerifyForgotPass() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [verifyOTP, { isLoading }] = useVerifyOTPForgotPassMutation();

  // ✅ Get userId from location.state
  useEffect(() => {
    const stateUserId = location.state?.userId;
    if (!stateUserId) {
      setError("No userId found. Please restart the forgot password process.");
    } else {
      setUserId(stateUserId);
      sessionStorage.setItem(
        "otpData",
        JSON.stringify({ userId: stateUserId })
      );
    }
  }, [location.state]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("No userId found. Please restart the forgot password process.");
      return;
    }

    if (otp.some((digit) => digit === "")) {
      setError("• Please enter all 6 digits");
      return;
    }

    try {
      const otpCode = otp.join("");
      const result = await verifyOTP({ userId, otp: otpCode }).unwrap();

      if (result.success) {
        alert("✅ OTP Verified Successfully!");
        navigate("/auth/reset-password", {
          state: { userId }, // pass userId to reset password page
        });
      } else {
        setError(result?.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError(err?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cyan-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center text-cyan-700 mb-6">
          Enter OTP
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center border-2 border-cyan-300 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 outline-none text-xl font-semibold text-cyan-700 bg-cyan-50 transition duration-200"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl shadow-lg hover:bg-cyan-700 transition duration-300 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default OtpVerifyForgotPass;
