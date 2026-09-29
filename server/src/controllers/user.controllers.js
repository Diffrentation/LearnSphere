import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import saveTokenToDB from "../utils/saveTokenToDB.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { setAuthCookies } from "../utils/setAuthCookies.js";
import { createTransporter } from "../utils/mailer.js";
import { generateLogicalUsername } from "../utils/generateUsername.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";

import OTP from "../models/otp.model.js";
import fs from "fs";

// ===================== Generate OTP =====================
export const generateOTP = (length = 6) => {
  let otp = "";
  const digits = "0123456789";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// ===================== REGISTER USER =====================
export const registerUser = asyncHandler(async (req, res) => {
  const transporter = createTransporter();

  try {
    let { fullname, username, email, password } = req.body;

    // 1. Validate required fields
    if ([fullname, email, password].some((field) => !field?.trim())) {
      throw new ApiError(400, "All fields are required");
    }

    // Normalize email
    email = email.toLowerCase().trim();

    // 2. Generate logical username if not provided or already exists
    if (!username || (await User.findOne({ username }))) {
      username = await generateLogicalUsername(fullname);
    }

    // 3. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    // 4. Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new ApiError(
        400,
        "Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character"
      );
    }

    // 5. Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ApiError(409, "User with the email or username already exists");
    }

    // 6. Create user (unverified initially)
    const user = await User.create({
      fullname: fullname.trim(),
      username,
      email,
      password,
      isVerified: false,
    });

    // 7. Generate Tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // 8. Save refresh token to DB
    await saveTokenToDB(user._id, refreshToken);

    // save token to localStorage
    setAuthCookies(res, accessToken, refreshToken);
    // 10. Generate OTP for email verification
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OTP.create({
      userId: user._id,
      otp,
      expiresAt,
      verificationMethod: "email",
      purpose: "verification",
    });

    // 11. Send OTP email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "CrystalVision Registration OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to CrystalVision!</h2>
          <p>Hello ${fullname},</p>
          <p>Your registration OTP is: <strong style="font-size: 18px; color: #007bff;">${otp}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this registration, please ignore this email.</p>
          <br>
          <p>Best regards,<br>The CrystalVision Team</p>
        </div>
      `,
    });

    // 12. Auto-delete unverified users after 10 min
    setTimeout(async () => {
      try {
        const unverifiedUser = await User.findOne({
          _id: user._id,
          isVerified: false,
        });
        if (unverifiedUser) {
          await User.findByIdAndDelete(user._id);
          await OTP.deleteMany({ userId: user._id });
          console.log(
            `Unverified user ${user.email} deleted after OTP expiry.`
          );
        }
      } catch (error) {
        console.error("Error in auto-delete unverified user:", error);
      }
    }, 10 * 60 * 1000);

    // 13. Send response
    return res.status(201).json(
      new ApiResponse(
        201,
        {
          userId: user._id,
          email: user.email,
          accessToken,
        },
        "OTP sent to your email. Please verify to complete registration."
      )
    );
  } catch (error) {
    console.error("User registration error:", error);

    // Clean up any partially created user on error
    if (req.body.email) {
      await User.findOneAndDelete({ email: req.body.email.toLowerCase() });
    }

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Internal server error during registration")
      );
  }
});

// ===================== LOGIN USER =====================
export const loginUser = asyncHandler(async (req, res) => {
  const transporter = createTransporter();

  try {
    const { email, password, username } = req.body;

    if ((!email && !username) || !password) {
      throw new ApiError(400, "Email or username and password are required");
    }

    // Normalize email if provided
    const normalizedEmail = email ? email.toLowerCase().trim() : null;

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: username?.trim() }],
    });

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordMatch = await existingUser.isPassMatch(password);
    if (!isPasswordMatch) {
      throw new ApiError(401, "Invalid password");
    }

    // Only unverified accounts need an OTP. This used to check merely that
    // the account existed, forcing every valid login into the OTP branch.
    if (!existingUser.isVerified) {
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await OTP.create({
        userId: existingUser._id,
        otp,
        expiresAt,
        verificationMethod: "email",
        purpose: "verification",
      });

      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: existingUser.email,
        subject: "CrystalVision Login OTP",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Login OTP Required</h2>
            <p>Hello ${existingUser.fullname},</p>
            <p>Your login OTP is: <strong style="font-size: 18px; color: #007bff;">${otp}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>
            <br>
            <p>Best regards,<br>The CrystalVision Team</p>
          </div>
        `,
      });

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            userId: existingUser._id,
            requiresOTP: true,
          },
          "OTP sent to your email. Please verify to complete login."
        )
      );
    }

    // Verified users proceed directly with normal login.
    const accessToken = existingUser.generateAccessToken();
    const refreshToken = existingUser.generateRefreshToken();

    await saveTokenToDB(existingUser._id, refreshToken);

    const userData = await User.findById(existingUser._id).select(
      "-password -token"
    );

    if (!userData) {
      throw new ApiError(404, "User data not found");
    }

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: userData,
          accessToken,
          refreshToken,
          requiresOTP: false,
        },
        "User logged in successfully"
      )
    );
  } catch (error) {
    console.error("User login error", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error during login"));
  }
});

// ===================== LOGOUT USER =====================
export const logoutUser = asyncHandler(async (req, res) => {
  try {
    // ✅ Recommended: get userId from authenticated request (middleware)
    const userId = req.user?._id || req.body.userId;

    if (!userId) {
      throw new ApiError(400, "User ID is required for logout");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.token === null || user.token === undefined) {
      throw new ApiError(400, "User already logged out");
    }

    // ✅ Clear token from DB and mark user as logged out
    await User.findByIdAndUpdate(userId, {
      $unset: { token: "" },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      secure: true
    };

    return res
      .status(200)
      .clearCookie("token", cookieOptions)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, null, "User logged out successfully"));
  } catch (error) {
    console.error("User logout error:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error during logout"));
  }
});
// ===================== Refresh AccessToken =====================
export const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingToken =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!incomingToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    // Verify the token using REFRESH_TOKEN_SECRET
    const decodedToken = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find user by decoded id
    const user = await User.findById(decodedToken?.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Compare incoming token with the token stored in user.token
    if (user.token !== incomingToken) {
      throw new ApiError(403, "Invalid refresh token");
    }

    // Generate new tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save new refresh token
    await User.findByIdAndUpdate(user._id, { token: refreshToken });

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    console.error("Refresh access token error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid refresh token"));
    }

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Internal server error during token refresh")
      );
  }
});

// ===================== Change user password =====================
export const changeUserPassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      throw new ApiError(401, "New password and confirmation do not match");
    }

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "Current and new passwords are required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await user.isPassMatch(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new ApiError(401, "Current password is incorrect");
    }

    // Password strength check
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new ApiError(
        400,
        "New password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character"
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send notification email
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Changed Successfully",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Updated</h2>
          <p>Hello ${user.fullname},</p>
          <p>Your password has been successfully changed.</p>
          <p>If you didn't make this change, please contact support immediately.</p>
          <br>
          <p>Best regards,<br>The CrystalVision Team</p>
        </div>
      `,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password updated successfully"));
  } catch (error) {
    console.error("Password update error:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Internal server error during password update"
        )
      );
  }
});

// ===================== Verify OTP Registration =====================
export const verifyOTPRegister = asyncHandler(async (req, res) => {
  const transporter = createTransporter();

  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      throw new ApiError(400, "User ID and OTP are required");
    }

    // 1. Find OTP record
    const otpRecord = await OTP.findOne({
      userId,
      otp,
      purpose: "verification",
      isVerified: false,
    });

    if (!otpRecord) {
      throw new ApiError(400, "Invalid OTP or already used");
    }

    if (otpRecord.expiresAt < new Date()) {
      // If expired, delete unverified user immediately
      await User.findByIdAndDelete(userId);
      await OTP.deleteMany({ userId });
      throw new ApiError(
        400,
        "OTP has expired. User deleted. Please register again."
      );
    }

    // 2. Mark OTP as verified
    otpRecord.isVerified = true;
    await otpRecord.save();

    // 3. Update user to verified
    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    ).select("-password -token");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // 4. Create the session now that the account is verified.
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    await saveTokenToDB(user._id, refreshToken);
    setAuthCookies(res, accessToken, refreshToken);

    // 5. Send welcome email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Welcome to CrystalVision!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Welcome to CrystalVision! 🎉</h2>
          <p>Hello <strong>${user.fullname}</strong>,</p>
          <p>Congratulations! Your registration with CrystalVision has been successfully verified.</p>
          <p>Your account is now active, and you can start exploring all the features we offer.</p>
          <br>
          <p>We're excited to have you onboard and can't wait to see what you'll learn!</p>
          <br>
          <p>Best regards,<br>The CrystalVision Team</p>
        </div>
      `,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken },
          "OTP verified successfully. Welcome email sent!"
        )
      );
  } catch (error) {
    console.error("OTP verification error:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Internal server error during OTP verification"
        )
      );
  }
});

// ===================== Verify OTP Login =====================
export const verifyOTPLogin = asyncHandler(async (req, res) => {
  const transporter = createTransporter();
  const { otp } = req.body;
  const user = req.user; // user is already attached by middleware

  try {
    if (!otp) {
      throw new ApiError(400, "OTP is required");
    }

    const otpRecord = await OTP.findOne({
      userId: user._id,
      otp,
      purpose: "verification",
      isVerified: false,
    });

    if (!otpRecord) {
      throw new ApiError(400, "Invalid OTP or already used");
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new ApiError(400, "OTP has expired");
    }

    // Mark OTP as verified
    otpRecord.isVerified = true;
    await otpRecord.save();

    // Update user to verified
    user.isVerified = true;
    await user.save();

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await saveTokenToDB(user._id, refreshToken);
    setAuthCookies(res, accessToken, refreshToken);

    // Send welcome back email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Welcome Back to CrystalVision!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome Back! 🎉</h2>
          <p>Hello <strong>${user.fullname}</strong>,</p>
          <p>Your login has been successfully verified.</p>
          <p>We're glad to have you back! Continue your learning journey with us.</p>
          <br>
          <p>Best regards,<br>The CrystalVision Team</p>
        </div>
      `,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken },
          "OTP verified successfully. Welcome back!"
        )
      );
  } catch (error) {
    console.error("OTP verification error:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Internal server error during OTP verification"
        )
      );
  }
});

// ===================== FORGOT PASSWORD =====================
export const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find user by email
    const user = await User.findOne({ email: normalizedEmail });

    // For security: Always send success response even if user doesn't exist
    if (!user) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            null,
            "If your account exists, a password reset OTP has been sent"
          )
        );
    }

    // 2. Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3. Save or update OTP record
    await OTP.findOneAndUpdate(
      { userId: user._id, purpose: "password_reset" },
      {
        otp,
        expiresAt,
        verificationMethod: "email",
        purpose: "password_reset",
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    // 4. Send OTP email
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: normalizedEmail,
      subject: "🔐 CrystalVision Forgot Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Forgot Password Reset Request</h2>
          <p>Hello <strong>${user.fullname}</strong>,</p>
          <p>Your password reset OTP is: <strong style="font-size: 18px; color: #007bff;">${otp}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <br>
          <p>Best regards,<br>The CrystalVision Team</p>
        </div>
      `,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { userId: user._id },
          "Password reset OTP sent successfully"
        )
      );
  } catch (error) {
    console.error("Forgot password error:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Internal server error during forgot password process"
        )
      );
  }
});

// ===================== Verify OTP Forgot Password =====================
export const verifyOTPForgotPass = asyncHandler(async (req, res) => {
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
      throw new ApiError(400, "Invalid OTP or already used");
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new ApiError(400, "OTP has expired");
    }

    // Mark OTP as verified
    otpRecord.isVerified = true;
    await otpRecord.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { userId },
          "OTP verified successfully. You can now reset your password."
        )
      );
  } catch (error) {
    console.error("OTP verification error:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Internal server error during OTP verification"
        )
      );
  }
});

// ===================== RESEND OTP =====================
export const resendOTP = asyncHandler(async (req, res) => {
  try {
    const { userId, purpose = "verification" } = req.body;

    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update OTP in database
    await OTP.findOneAndUpdate(
      { userId, purpose },
      {
        otp,
        expiresAt,
        verificationMethod: "email",
        purpose,
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    // Determine email subject and content based on purpose
    const emailConfig = {
      verification: {
        subject: "CrystalVision Verification OTP",
        message: "Your verification OTP is",
      },
      password_reset: {
        subject: "CrystalVision Password Reset OTP",
        message: "Your password reset OTP is",
      },
    };

    const config = emailConfig[purpose] || emailConfig.verification;

    // Send OTP email
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: config.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${config.subject}</h2>
          <p>Hello <strong>${user.fullname}</strong>,</p>
          <p>${config.message}: <strong style="font-size: 18px; color: #007bff;">${otp}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
          <br>
          <p>Best regards,<br>The CrystalVision Team</p>
        </div>
      `,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "OTP resent successfully"));
  } catch (error) {
    console.error("Resend OTP error:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Internal server error while resending OTP")
      );
  }
});

// ===================== RESET PASSWORD =====================
export const resetPassword = asyncHandler(async (req, res) => {
  const transporter = createTransporter();

  try {
    const { userId, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      throw new ApiError(401, "New password and confirmation do not match");
    }

    if (!newPassword) {
      throw new ApiError(400, "New password is required");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Verify that OTP was verified for password reset
    const verifiedOTP = await OTP.findOne({
      userId,
      purpose: "password_reset",
      isVerified: true,
    });

    if (!verifiedOTP) {
      throw new ApiError(
        400,
        "Please verify OTP first before resetting password"
      );
    }

    // Password strength check
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new ApiError(
        400,
        "New password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character"
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Clear the used OTP
    await OTP.deleteMany({ userId, purpose: "password_reset" });

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset Successful!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Successful</h2>
          <p>Hello <strong>${user.fullname}</strong>,</p>
          <p>Your password has been successfully reset.</p>
          <p>You can now log in with your new password.</p>
          <p>If you didn't make this change, please contact support immediately.</p>
          <br>
          <p>Best regards,<br>The CrystalVision Team</p>
        </div>
      `,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset successfully"));
  } catch (error) {
    console.error("Password reset error:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Internal server error during password reset"
        )
      );
  }
});

// ===================== GET CURRENT USER =====================
export const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -token");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { user }, "Current user fetched successfully")
      );
  } catch (error) {
    console.error("Get current user error:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Internal server error while fetching user")
      );
  }
});

// ===================== UPDATE USER PROFILE =====================
// export const updateUserProfile = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.user?._id || req.body.userId;
//     if (!userId) {
//       throw new ApiError(400, "User ID is required");
//     }

//     // Extract allowed fields from req.body
//     const { fullname, username, phoneNumber, address, bio } = req.body;

//     const updates = {};
//     if (fullname) updates.fullname = fullname;
//     if (username) updates.username = username;
//     if (phoneNumber) updates.phoneNumber = phoneNumber;
//     if (address) updates.address = address;
//     if (bio) updates.bio = bio;

//     // ✅ Handle image upload to Cloudinary if file is provided
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "user_profiles",
//         resource_type: "image",
//       });

//       updates.profileUrl = result.secure_url;

//       // Clean up temp file
//       fs.unlinkSync(req.file.path);
//     }

//     // ✅ Update the user in DB
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: updates },
//       { new: true, runValidators: true }
//     ).select("-password -token");

//     if (!updatedUser) {
//       throw new ApiError(404, "User not found");
//     }

//     return res
//       .status(200)
//       .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
//   } catch (error) {
//     throw new ApiError(500, error.message || "Failed to update profile");
//   }
// });

// ------------------ UPDATE CURRENT USER ------------------
export const updateCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      fullname,
      username,
      email,
      phoneNumber,
      bio,
      address,
      skills,
      college,
      course,
      year,
      rollNo,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Profile picture
    if (req.file) {
      if (user.profileUrl && fs.existsSync(user.profileUrl)) fs.unlinkSync(user.profileUrl);
      user.profileUrl = req.file.path;

      console.log("Profile picture updated:", user.profileUrl);
    }

    // Update fields
    if (fullname) user.fullname = fullname;
    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.bio = bio;
    if (address) user.address = address;       // NEW
    if (college) user.college = college;       // NEW
    if (course) user.course = course;
    if (year) user.year = year;
    if (rollNo) user.rollNo = rollNo;

    if (skills) {
      if (typeof skills === "string") user.skills = skills.split(",").map((s) => s.trim());
      else if (Array.isArray(skills)) user.skills = skills;
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update Current User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




