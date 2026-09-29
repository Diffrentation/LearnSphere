import { v2 as cloudinary } from "cloudinary";
import Lecture from "../models/lecture.model.js";
import Course from "../models/course.model.js";
import fs from "fs/promises";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// Helper function to handle multiple file uploads (PDFs / Images)
const uploadResources = async (files) => {
  const resourceUrls = [];

  for (const file of files) {
    const filePath = file.path;

    // Determine resource type
    const isImage = file.mimetype.startsWith("image/");
    const resourceType = isImage ? "image" : "raw"; // raw allows pdf, docs, zip, etc.

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
      folder: "lectures/resources",
    });

    resourceUrls.push({
      url: result.secure_url,
      type: isImage ? "image" : "file",
      originalName: file.originalname,
    });

    // Clean up local file after upload
    await fs.unlink(filePath);
  }

  return resourceUrls;
};

// ------------------ CREATE LECTURE ------------------
export const createLecture = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;
  const courseId = req.params.courseId;

  if (!req.user) throw new ApiError(401, "You must be logged in to create a lecture");

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  if (!["admin", "instructor"].includes(req.user.role))
    throw new ApiError(403, "Only instructors or admins can add lectures");

  if (req.user.role !== "admin" && course.instructor.toString() !== req.user._id.toString())
    throw new ApiError(403, "You are not allowed to add lectures to this course");

  if (!title) throw new ApiError(400, "Title is required");

  // ✅ Upload thumbnail (optional)
  let lecturethumbnailUrl = "";
  if (req.files?.lecturethumbnailUrl) {
    lecturethumbnailUrl = await uploadToCloudinary(
      req.files.lecturethumbnailUrl[0].path,
      "lectures",
      "image"
    );
  }

  // ✅ Upload video and get duration automatically
  let videoUrl = "";
  let videoDuration = 0;
  if (req.files?.videoUrl) {
    const videoPath = req.files.videoUrl[0].path;
    const uploadResult = await cloudinary.uploader.upload(videoPath, {
      resource_type: "video",
      folder: "lectures/videos",
    });

    videoUrl = uploadResult.secure_url;
    videoDuration = Math.floor(uploadResult.duration);

    await fs.unlink(videoPath);
  }

  // ✅ Handle multiple resources (PDF, images, etc.)
  let resources = [];
  if (req.files?.resources && req.files.resources.length > 0) {
    resources = await uploadResources(req.files.resources);
  }

  const lecture = new Lecture({
    title,
    duration: videoDuration,
    description: description || "",
    lecturethumbnailUrl,
    videoUrl,
    course: course._id,
    resources,
    order: order ? Number(order) : 0,
  });

  await lecture.save();

  res.status(201).json(new ApiResponse(201, "Lecture created successfully", lecture));
});

// ------------------ UPDATE LECTURE ------------------
export const updateLecture = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;
  const { title, description, order } = req.body;

  const lecture = await Lecture.findById(lectureId);
  if (!lecture) throw new ApiError(404, "Lecture not found");

  const course = await Course.findById(lecture.course);
  if (!course) throw new ApiError(404, "Associated course not found");

  if (!["admin", "instructor"].includes(req.user.role))
    throw new ApiError(403, "Only instructors or admins can update lectures");

  if (req.user.role !== "admin" && course.instructor.toString() !== req.user._id.toString())
    throw new ApiError(403, "You are not allowed to update lectures of this course");

  if (title) lecture.title = title;
  if (description !== undefined) lecture.description = description;
  if (order !== undefined) lecture.order = Number(order);

  // ✅ Update thumbnail if provided
  if (req.files?.lecturethumbnailUrl) {
    lecture.lecturethumbnailUrl = await uploadToCloudinary(
      req.files.lecturethumbnailUrl[0].path,
      "lectures",
      "image"
    );
  }

  // ✅ Update video & duration if provided
  if (req.files?.videoUrl) {
    const videoPath = req.files.videoUrl[0].path;
    const uploadResult = await cloudinary.uploader.upload(videoPath, {
      resource_type: "video",
      folder: "lectures/videos",
    });

    lecture.videoUrl = uploadResult.secure_url;
    lecture.duration = Math.floor(uploadResult.duration);

    await fs.unlink(videoPath);
  }

  // ✅ Append new resources if provided
  if (req.files?.resources && req.files.resources.length > 0) {
    const newResources = await uploadResources(req.files.resources);
    lecture.resources = [...lecture.resources, ...newResources];
  }

  await lecture.save();

  res.status(200).json(new ApiResponse(200, "Lecture updated successfully", lecture));
});

// ------------------ DELETE LECTURE ------------------
export const deleteLecture = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;

  const lecture = await Lecture.findById(lectureId);
  if (!lecture) throw new ApiError(404, "Lecture not found");

  const course = await Course.findById(lecture.course);
  if (!course) throw new ApiError(404, "Associated course not found");

  if (!["admin", "instructor"].includes(req.user.role))
    throw new ApiError(403, "Only instructors or admins can delete lectures");

  if (req.user.role !== "admin" && course.instructor.toString() !== req.user._id.toString())
    throw new ApiError(403, "You are not allowed to delete lectures of this course");

  await lecture.deleteOne();

  res.status(200).json(new ApiResponse(200, "Lecture deleted successfully", null));
});

// ------------------ GET ALL LECTURES OF A COURSE ------------------
export const getLecturesByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const lectures = await Lecture.find({ course: courseId }).sort({ order: 1 });

  res.status(200).json(new ApiResponse(200, "Lectures retrieved successfully", lectures));
});
