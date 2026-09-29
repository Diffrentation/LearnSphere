import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const generateToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  // Generate Access Token
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
  console.log("Access Token generated:", accessToken);

  // Generate Refresh Token
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  console.log("Refresh Token generated:", refreshToken);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export default generateToken;
