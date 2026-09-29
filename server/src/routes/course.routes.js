import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/educator.middleware.js";
import { uploadCourseThumbnailToCloudinary } from "../middlewares/multer.middleware.js";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getDashboardStats,
  publishCourse,
  unpublishCourse,
} from "../controllers/course.controller.js";

const router = express.Router();

// ✅ Fixed route paths and upload middleware usage
router.get("/getAllCourse", getAllCourses);
router.get("/getCourse/:id", getCourseById);
router.get(
  "/dashboard-stats",
  verifyJWT,
  authorizeRoles("admin", "instructor"),
  getDashboardStats
);

router.post(
  "/createCourse",
  verifyJWT,
  authorizeRoles("admin", "instructor"),
  uploadCourseThumbnailToCloudinary,
  createCourse
);

router.put(
  "/updateCourse/:id",
  verifyJWT,
  authorizeRoles("admin", "instructor"),
  uploadCourseThumbnailToCloudinary,
  updateCourse
);

router.get("/getCourse/:id",verifyJWT, getCourseById);
router.get("/getAllCourse",verifyJWT, getAllCourses);

router.delete(
  "/deleteCourse/:id",
  verifyJWT,
  authorizeRoles("admin", "instructor"),
  deleteCourse
);

router.patch(
  "/course/:id/publish",
  verifyJWT,
  authorizeRoles("admin", "instructor"),
  publishCourse
);

router.patch(
  "/course/:id/unpublish",
  verifyJWT,
  authorizeRoles("admin", "instructor"),
  unpublishCourse
);

export default router;
