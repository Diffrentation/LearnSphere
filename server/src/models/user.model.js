// src/models/user.model.js
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Define the user Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
    },

    fullname: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin", "instructor"],
      default: "user",
    },

    profileUrl: {
      type: String,
      default: "",
      trim: true,
    },

    phoneNumber: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    skills: {
      type: [String], // array of skills
      default: [],
    },

    college: {
      type: String,
      default: "",
      trim: true,
    },

    course: {
      type: String,
      default: "",
      trim: true,
    },

    year: {
      type: String,
      default: "",
      trim: true,
    },

    rollNo: {
      type: String,
      default: "",
      trim: true,
    },

    token: {
      type: String,
      default: null,
    },

    resetToken: {
      type: String,
      default: null,
    },

    resetTokenExpiry: {
      type: Date,
      default: null,
    },

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

// 🧂 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Compare password
userSchema.methods.isPassMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

// 🔑 Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
  );
};

// 🔄 Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

// 🧼 Remove sensitive data before sending user object
userSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.token;
  delete userObj.resetToken;
  delete userObj.resetTokenExpiry;
  return userObj;
};

const User = mongoose.model("User", userSchema);
export default User;
