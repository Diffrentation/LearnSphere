import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../../Redux/api/authApi";

function OtpSendTo() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // RTK Query hook
  const [forgotPassword, { isLoading, isError, error, isSuccess, data }] =
    useForgotPasswordMutation();

  // Validate Email
  const validateEmail = (value) => {
    const emailRegex =
      /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    try {
      // Call forgot password API
      const res = await forgotPassword({ email }).unwrap();

      // Navigate to OTP verification page
      navigate("/auth/verify-forgot-pass", {
        state: {
          from: "forgot",
          userId: res?.data?.userId,
          email
        },
      });
    } catch (err) {
      console.error("Forgot Password Error:", err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value.trim().toLowerCase();
    setEmail(value);
  };

  const isValid = validateEmail(email);

  return (
    <div className="flex items-center justify-center min-h-screen bg-cyan-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300">
        <h1 className="text-3xl font-bold text-center text-cyan-700 mb-6">
          Send OTP
        </h1>

        <form onSubmit={handleSendOtp} className="space-y-6">
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border-2 rounded-xl outline-none text-lg bg-cyan-50 transition duration-300
                ${isError
                  ? "border-red-400 focus:border-red-500 focus:ring-red-300"
                  : "border-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300"} 
                text-cyan-700`}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl shadow-lg 
                       hover:bg-cyan-700 active:scale-95 
                       focus:ring-4 focus:ring-cyan-300 
                       transition duration-300 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {isError && (
          <p className="text-center mt-4 font-medium text-red-500">
            {error?.data?.message || "Failed to send OTP. Try again."}
          </p>
        )}

        {isSuccess && (
          <p className="text-center mt-4 font-medium text-cyan-700">
            {data?.message || "✅ OTP sent successfully!"}
          </p>
        )}
      </div>
    </div>
  );
}

export default OtpSendTo;
