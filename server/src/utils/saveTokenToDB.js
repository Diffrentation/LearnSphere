import UserSchema from "../models/user.model.js";

// Function to save refresh token to the user's document
const saveTokenDB = async (userId, refreshToken) => {
  try {
    if (!userId) {
      console.log("No userId provided for token saving.");
      return null;
    }

    // Await the user document
    const user = await UserSchema.findById(userId);
    if (!user) {
      console.log("User not found for token saving.");
      return null;
    }

    // Save refresh token
    user.token = refreshToken;
    return await user.save();
  } catch (error) {
    console.error("Error saving token to user document:", error);
    return null;
  }
};

export default saveTokenDB;
