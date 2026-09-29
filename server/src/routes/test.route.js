import express from "express";
import createTestWithCloudinary from "../controllers/test.controller.js";
import { deleteTest } from "../controllers/test.controller.js";
import {uploadTestImageToCloudinary} from "../middlewares/multer.middleware.js"
import { getTests } from "../controllers/test.controller.js";

const router = express.Router();

// POST /api/tests  → Create new test
router.post("/generate-test",uploadTestImageToCloudinary, createTestWithCloudinary);
// Delete test
router.delete("/delete-test/:id", deleteTest);
router.get("/get-tests", getTests);

export default router;
