import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import OTP from "../models/otp.model.js"

export const verifyForgotPasswordOTP = asyncHandler(async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      throw new ApiError(400, "User ID and OTP are required");
    }

    const otpRecord = await OTP.findOne({
      userId,
      otp,
      purpose: "password_reset",
      isVerified: false,
    });

    if (!otpRecord) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    if (otpRecord.expiresAt < Date.now()) {
      throw new ApiError(400, "OTP expired");
    }

    // ✅ Mark as verified so it can't be reused
    otpRecord.isVerified = true;
    await otpRecord.save();

    // ✅ Attach userId to request for next handler (password reset)
    req.userId = userId;

    next();
  } catch (err) {
    next(err);
  }});

// Optional: Middleware for routes that don't require email verification
export const verifyJWTOptional = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(); // Continue without user if no token
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?.id).select(
      "-password -token"
    );

    if (user) {
      req.user = user;
      req.body.userId = decodedToken.id;
    }

    next();
  } catch (error) {
    // For optional auth, we just continue without setting req.user
    next();
  }
});

// Middleware specifically for refresh token verification
export const verifyRefreshToken = asyncHandler(async (req, res, next) => {
  try {
    const incomingToken =
      req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    const decodedToken = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Compare incoming token with the token stored in user.token
    if (user.token !== incomingToken) {
      throw new ApiError(403, "Invalid refresh token");
    }

    req.user = user;
    req.body.userId = decodedToken.id;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Refresh token expired");
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// Middleware for routes that require unverified users (like OTP verification)
export const verifyJWTUnverified = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?.id).select(
      "-password"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    req.body.userId = decodedToken.id;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid or expired access token");
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Access token expired");
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const getUserByIdMiddleware = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findById(userId).select("-password -token");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  req.user = user; // attach user to request
  next();
});

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?.id).select(
      "-password -token"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account",
      });
    }

    req.user = user;

    // ✅ Ensure req.body exists
    if (!req.body) req.body = {};
    req.body.userId = decodedToken.id;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
      });
    }

    console.error("JWT Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: error?.message || "Invalid access token",
    });
  }
});

