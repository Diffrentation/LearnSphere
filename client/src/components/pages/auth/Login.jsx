import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import { useLoginUserMutation } from "../../../Redux/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../Redux/slices/authSlice"; // ✅ IMPORT FIX

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    const newError = {};

    if (!email.trim()) newError.email = "• Email is required";
    if (!password) newError.password = "• Password is required";
    setError(newError);

    if (Object.keys(newError).length === 0) {
      try {
        const response = await loginUser({ email: email.trim(), password }).unwrap();
        const loginData = response?.data;

        if (loginData?.requiresOTP) {
          sessionStorage.setItem(
            "otpData",
            JSON.stringify({
              userId: loginData.userId,
              email: email.trim(),
              from: "login",
            })
          );
          navigate("/auth/verify-login-otp", {
            state: { userId: loginData.userId },
            replace: true,
          });
          return;
        }

        if (loginData?.user && loginData?.accessToken) {
          const auth = {
            user: loginData.user,
            accessToken: loginData.accessToken,
            refreshToken: loginData.refreshToken || null,
          };
          dispatch(setCredentials(auth));
          localStorage.setItem("auth", JSON.stringify(auth));
          navigate("/", { replace: true });
          return;
        }

        setError({ submit: response?.message || "Login could not be completed." });
      } catch (err) {
        console.error(err);
        setError({
          submit: err?.data?.message || "Login failed. Please try again.",
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
        className="w-full max-w-md p-10 bg-cyan-900 rounded-2xl shadow-2xl border border-cyan-700"
      >
        <h2 className="text-3xl font-bold text-center text-cyan-100 mb-8">
          Welcome Back
        </h2>

        {error.submit && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error.submit}</p>
          </div>
        )}

        <form className="space-y-6 text-start" onSubmit={handleLogin}>
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {error.password && (
              <p className="text-red-400 text-sm mt-1">{error.password}</p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm text-cyan-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-cyan-500" />
              Remember me
            </label>
            <span
              onClick={() => navigate("/auth/forgot-password")}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Forgot Password?
            </span>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.97 }}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 rounded-lg font-semibold shadow hover:from-cyan-600 hover:to-cyan-700 transition disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-grow border-cyan-600" />
          <span className="mx-2 text-cyan-300 text-sm">or</span>
          <hr className="flex-grow border-cyan-600" />
        </div>

        {/* Social Login */}
        <div className="flex cursor-pointer justify-center gap-4">
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

        {/* Redirect */}
        <p className="text-sm text-center mt-6 text-cyan-300">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/auth/signup")}
            className="text-cyan-400 hover:underline font-medium cursor-pointer"
          >
            Signup
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
