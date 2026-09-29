// utils/generateUsername.js
import User from "../models/user.model.js";

/**
 * Generate a logical, unique username based on full name
 * @param {string} fullName - the user's full name
 * @returns {string} - unique logical username
 */
export const generateLogicalUsername = async (fullName) => {
  // Create base username from full name
  const names = fullName.toLowerCase().trim().split(" ");
  let baseUsername = names.join("."); // john.doe
  baseUsername = baseUsername.replace(/[^a-z0-9.]/g, ""); // remove invalid chars

  let username = baseUsername;
  let suffix = 1;

  // Check uniqueness
  while (await User.findOne({ username })) {
    username = `${baseUsername}${suffix}`; // john.doe1, john.doe2...
    suffix++;
  }

  return username;
};
