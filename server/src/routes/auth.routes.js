import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeUserPassword,
  verifyOTPRegister,
  verifyOTPLogin,
  forgotPassword,
  resendOTP,
  resetPassword,
  verifyOTPForgotPass,
  getCurrentUser,
  updateCurrentUser
} from "../controllers/user.controllers.js";
import { 
  verifyJWT, 
  verifyRefreshToken ,
  verifyForgotPasswordOTP,
  getUserByIdMiddleware,
} from "../middlewares/auth.middleware.js";
import { uploadProfilePicToCloudinary } from "../middlewares/multer.middleware.js";

const router = express.Router();

// ===================== PUBLIC AUTH ROUTES =====================

// Registration flow
router.post("/register", registerUser);
router.post("/verify-otp-registration", verifyOTPRegister);

// Login flow
router.post("/login", loginUser);
router.post("/verify-otp-login",getUserByIdMiddleware, verifyOTPLogin);

// Password reset flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp-forgot-password", verifyOTPForgotPass);
router.post("/reset-password", resetPassword);

// OTP resend (for various purposes)
router.post("/resend-otp", resendOTP);

// Token refresh
router.post("/refresh-token", verifyRefreshToken, refreshAccessToken);

// ===================== PROTECTED ROUTES (Require verified authentication) =====================

// Authentication routes
router.post("/logout", verifyJWT, logoutUser);
router.post("/change-password", verifyJWT, changeUserPassword);

// User profile routes
router.get("/me", verifyJWT, getCurrentUser);
router.put("/me/update", verifyJWT,uploadProfilePicToCloudinary, updateCurrentUser);

export default router;
