import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaGithub,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../../Redux/api/authApi";
function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();

  // ✅ RTK Query mutation
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const passwordStrength = () => {
    if (password.length < 6) return "Weak";
    if (
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[@$!%*?&]/.test(password)
    )
      return "Strong";
    return "Medium";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newError = {};

    // ✅ Client-side validation
    if (!fullname.trim()) newError.fullname = "Full Name is required";
    if (!email.trim()) newError.email = "Email is required";
    if (!password) newError.password = "Password is required";
    if (!confirmPassword)
      newError.confirmPassword = "Confirm Password is required";
    if (password && confirmPassword && password !== confirmPassword)
      newError.confirmPassword = "Passwords do not match";

    setError(newError);

    if (Object.keys(newError).length === 0) {
      try {
        const userData = { fullname, email: email.trim(), password };

        // ✅ Call register API
        const response = await registerUser(userData).unwrap();
        console.log("registerRes", response);

        // ✅ Extract accessToken safely (handle multiple response shapes)
        const accessToken =
          response?.message?.accessToken ||
          response?.data?.accessToken ||
          response?.accessToken ||
          null;

        // ✅ Save token to localStorage if available
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          console.log("Access token saved in localStorage:", accessToken);
        } else {
          console.warn("⚠️ No accessToken found in response");
        }

        // ✅ Get userId for OTP verification
        const userId =
          response?.message?.userId ||
          response?.data?.userId ||
          response?.userId ||
          null;

        // ✅ Redirect to OTP page
        navigate("/auth/verify-register-otp", {
          state: {
            userId,
            email,
            from: "signup",
          },
        });
      } catch (err) {
        console.error("Register error:", err);
        setError({
          submit:
            err?.data?.message ||
            err?.message ||
            "",
        });
      }
    }
  };


  return (
    <div className="flex items-center mt-10 justify-center min-h-screen bg-gradient-to-t from-cyan-700 to-cyan-800 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl p-10 bg-cyan-900 rounded-2xl shadow-2xl border border-cyan-700"
      >
        <h2 className="text-3xl font-bold text-center text-cyan-100 mb-8">
          Create Account
        </h2>

        {error.submit && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error.submit}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm text-cyan-200 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-cyan-800 text-cyan-100 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {error.fullname && (
              <p className="text-red-400 text-sm mt-1">{error.fullname}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-cyan-200 mb-2">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-cyan-800 text-cyan-100 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {error.email && (
              <p className="text-red-400 text-sm mt-1">{error.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-cyan-200 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-cyan-800 text-cyan-100 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-cyan-400 hover:text-cyan-100"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {password && (
              <p
                className={`mt-1 text-sm ${
                  passwordStrength() === "Weak"
                    ? "text-red-400"
                    : passwordStrength() === "Medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                Strength: {passwordStrength()}
              </p>
            )}
            {error.password && (
              <p className="text-red-400 text-sm mt-1">{error.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-cyan-200 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-cyan-800 text-cyan-100 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {error.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {error.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="md:col-span-2 flex items-center mt-2">
            <input type="checkbox" className="accent-cyan-500" />
            <p className="text-sm text-cyan-300 ml-2">
              I agree to the{" "}
              <a href="/terms" className="text-cyan-400 hover:underline">
                Terms
              </a>{" "}
              &{" "}
              <a href="/privacy" className="text-cyan-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.97 }}
            className="md:col-span-2 w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 rounded-lg font-semibold shadow hover:from-cyan-600 hover:to-cyan-700 transition disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-grow border-cyan-600" />
          <span className="mx-2 text-cyan-300 text-sm">or</span>
          <hr className="flex-grow border-cyan-600" />
        </div>

        {/* Social Signup */}
        <div className="flex justify-center gap-4 cursor-pointer">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-3 rounded-full bg-red-600 text-white shadow hover:bg-red-700"
          >
            <FaGoogle size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-3 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700"
          >
            <FaFacebook size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-3 rounded-full bg-cyan-500 text-white shadow hover:bg-cyan-600"
          >
            <FaGithub size={20} />
          </motion.button>
        </div>

        <p className="text-sm text-center mt-6 text-cyan-300">
          Already have an account?{" "}
          <a
            onClick={() => navigate("/auth/login")}
            className="text-cyan-400 hover:underline font-medium cursor-pointer"
          >
            Log in
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
