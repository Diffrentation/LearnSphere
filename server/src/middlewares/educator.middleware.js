import ApiError from "../utils/ApiError.js";

/**
 * Middleware to allow only users with certain roles.
 * @param  {...string} roles - Allowed roles (e.g., "admin", "instructor")
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "User not authenticated"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Role '${req.user.role}' is not authorized for this action`
        )
      );
    }

    next(); 
  };
};
