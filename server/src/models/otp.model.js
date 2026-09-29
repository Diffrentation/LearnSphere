// models/otp.model.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  verificationMethod: {
    type: String,
    enum: ["email", "sms"],
    required: true,
  },
  purpose: {
    type: String,
    enum: ["verification", "password_reset"],
    default: "verification",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for automatic expiration
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("OTP", otpSchema);