import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/educator.middleware.js";
import { uploadLectureFiles } from "../middlewares/multer.middleware.js";
import {
  createLecture,
  updateLecture,
  deleteLecture,
  getLecturesByCourse,
} from "../controllers/lecture.controller.js";

const router = express.Router();

// Public routes
router.get("/course/:courseId", getLecturesByCourse);

// Protected routes (only instructor/admin)
router.post(
  "/createLecture/:courseId",
  verifyJWT,
  authorizeRoles("admin", "instructor"),
  uploadLectureFiles, // both thumbnail and video will be uploaded here
  createLecture
);

router.put(
  "/:id",
  verifyJWT,
  authorizeRoles("admin", "instructor"),
  uploadLectureFiles, // both thumbnail and video can be updated
  updateLecture
);

router.get("/lecture/:id", verifyJWT, authorizeRoles("admin", "instructor"), getLecturesByCourse);

router.delete("lecture/:id", verifyJWT, authorizeRoles("admin", "instructor"), deleteLecture);

export default router;
