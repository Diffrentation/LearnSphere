import { v2 as cloudinary } from "cloudinary";
import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import fs from "fs/promises";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// ------------------ CREATE COURSE ------------------
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, published, level,category,duration } = req.body;

  if (!req.user) throw new ApiError(401, "You must be logged in to create a course");
  if (!["instructor", "admin"].includes(req.user.role))
    throw new ApiError(403, "Only instructors or admins can create courses");

  if (!title || !description || !price)
    throw new ApiError(400, "Title, description, and price are required");

  const parsedPrice = Number(price);
  if (isNaN(parsedPrice) || parsedPrice < 0)
    throw new ApiError(400, "Invalid price value");

  let coursethumbnailUrl = "";
if (req.file) {
    coursethumbnailUrl = await uploadToCloudinary(req.file.path, "courses", "image");
  }

  const course = new Course({
    title,
    description,
    duration,
    category,
    price: parsedPrice,
    published: published || false,
    level: level || "Beginner",
    coursethumbnailUrl:coursethumbnailUrl,
    instructor: req.user._id,
  });

  await course.save();
  res.status(201).json(new ApiResponse(201, "Course created successfully", course));
});

// ------------------ UPDATE COURSE ------------------
export const updateCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const { title, description, price, published, level,category,duration } = req.body;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  if (req.user.role !== "admin" && course.instructor.toString() !== req.user._id.toString())
    throw new ApiError(403, "You are not allowed to update this course");

  if (title) course.title = title;
  if (description) course.description = description;
  if (category) course.category = category;
  if (duration) course.duration = duration;

  if (price !== undefined) {
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0)
      throw new ApiError(400, "Invalid price value");
    course.price = parsedPrice;
  }
  if (published !== undefined) course.published = published;
  if (level) course.level = level;

  // ✅ Update course thumbnail if new file provided
  if (req.file) {
    course.coursethumbnailUrl = await uploadToCloudinary(req.file.path, "courses", "image");
  }

  await course.save();
  res.status(200).json(new ApiResponse(200, "Course updated successfully", course));
});

// ------------------ DELETE COURSE ------------------
export const deleteCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  if (
    req.user.role !== "admin" &&
    course.instructor.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You are not allowed to delete this course");
  }

  // ✅ Use deleteOne instead of remove
  await course.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, "Course deleted successfully", null));
});


// ------------------ GET ALL COURSES ------------------
export const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .populate("instructor", "fullname email role")
    .sort({ createdAt: -1 })
    .lean();
  const lectureCounts = await Lecture.aggregate([
    { $group: { _id: "$course", count: { $sum: 1 } } },
  ]);
  const lectureCountByCourse = new Map(
    lectureCounts.map(({ _id, count }) => [_id.toString(), count])
  );
  const coursesWithCounts = courses.map((course) => ({
    ...course,
    enrolledCount: course.studentsEnrolled?.length || 0,
    lectureCount: lectureCountByCourse.get(course._id.toString()) || 0,
  }));

  res.status(200).json(new ApiResponse(200, "Courses retrieved successfully", coursesWithCounts));
});

// ------------------ GET COURSE BY ID ------------------
export const getCourseById = asyncHandler(async (req, res) => {
  const courseId = req.params.id;

  const course = await Course.findById(courseId).populate("instructor", "fullname email role");
  if (!course) throw new ApiError(404, "Course not found");

  res.status(200).json(new ApiResponse(200, "Course retrieved successfully", course));
});

// ------------------ EDUCATOR DASHBOARD ------------------
export const getDashboardStats = asyncHandler(async (req, res) => {
  const courseFilter = req.user.role === "admin" ? {} : { instructor: req.user._id };
  const courses = await Course.find(courseFilter)
    .select("title price studentsEnrolled createdAt")
    .sort({ createdAt: -1 });
  const courseIds = courses.map((course) => course._id);
  const lectures = courseIds.length
    ? await Lecture.find({ course: { $in: courseIds } })
        .select("title course createdAt")
        .populate("course", "title")
        .sort({ createdAt: -1 })
    : [];

  const enrolledStudentIds = new Set(
    courses.flatMap((course) => course.studentsEnrolled.map((studentId) => studentId.toString()))
  );
  const enrollmentValue = courses.reduce(
    (total, course) => total + course.price * course.studentsEnrolled.length,
    0
  );
  const recentActivities = [
    ...courses.map((course) => ({
      timestamp: course.createdAt,
      text: `Course created: ${course.title}`,
    })),
    ...lectures.map((lecture) => ({
      timestamp: lecture.createdAt,
      text: `Lecture added: ${lecture.title}${lecture.course?.title ? ` (${lecture.course.title})` : ""}`,
    })),
  ]
    .sort((first, second) => second.timestamp - first.timestamp)
    .slice(0, 5);

  res.status(200).json(
    new ApiResponse(200, "Dashboard statistics retrieved successfully", {
      stats: {
        totalCourses: courses.length,
        enrolledStudents: enrolledStudentIds.size,
        enrollmentValue,
        lecturesUploaded: lectures.length,
      },
      recentActivities,
    })
  );
});

// ------------------ PUBLISH / UNPUBLISH COURSE ------------------
export const publishCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  if (req.user.role !== "admin" && course.instructor.toString() !== req.user._id.toString())
    throw new ApiError(403, "You are not allowed to publish/unpublish this course");

  course.published = true;
  course.publishedAt = new Date();
  await course.save();

  res.status(200).json(new ApiResponse(200, "Course published successfully", course));
});

export const unpublishCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  if (req.user.role !== "admin" && course.instructor.toString() !== req.user._id.toString())
    throw new ApiError(403, "You are not allowed to publish/unpublish this course");

  course.published = false;
  course.publishedAt = null;
  await course.save();

  res.status(200).json(new ApiResponse(200, "Course unpublished successfully", course));
});
