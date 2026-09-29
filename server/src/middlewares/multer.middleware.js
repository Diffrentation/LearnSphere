import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// --------------------- Cloudinary Config ---------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --------------------- Helper ---------------------
const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
};

// --------------------- Local Storages ---------------------
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("uploads", "images");
    createFolder(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("uploads", "videos");
    createFolder(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// --------------------- File Filters ---------------------
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb(new Error("Only image files are allowed!"));
};

const videoFileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mkv|mov|quicktime/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb(new Error("Only video files are allowed!"));
};

// --------------------- Multer Uploaders ---------------------

// 📸 For course thumbnails (LOCAL)
export const uploadCourseThumbnail = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB
}).single("coursethumbnailUrl");

const uploadCourseThumbnailcloudStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "course_thumbnails",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});
export const uploadCourseThumbnailToCloudinary = multer({
  storage: uploadCourseThumbnailcloudStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("coursethumbnailUrl");

// ☁ For test images (CLOUDINARY)
const testImageCloudStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "thumbnails", 
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "auto",
  },
});

export const uploadTestImageToCloudinary = multer({
  storage: testImageCloudStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("testpic");

// 🎥 For lecture files (LOCAL)
export const uploadLectureFiles = multer({
  storage: (req, file, cb) => {
    if (file.fieldname === "lecturethumbnailUrl") cb(null, imageStorage);
    else if (file.fieldname === "videoUrl") cb(null, videoStorage);
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "lecturethumbnailUrl") imageFileFilter(req, file, cb);
    else if (file.fieldname === "videoUrl") videoFileFilter(req, file, cb);
  },
  limits: { fileSize: 500 * 1024 * 1024 },
}).fields([
  { name: "lecturethumbnailUrl", maxCount: 1 },
  { name: "videoUrl", maxCount: 1 },
]);

const uploadLectureFilesCloudStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "lecturethumbnailUrl") {
      return {
        folder: "lecture_thumbnails",
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      };
    } else if (file.fieldname === "videoUrl") {
      return {
        folder: "lecture_videos",
        resource_type: "video",
        allowed_formats: ["mp4", "avi", "mkv", "mov", "quicktime"],
        transformation: [{ width: 1920, height: 1080, crop: "limit" }],
      };
    }
  },
});

export const uploadLectureFilesToCloudinary = multer({
  storage: uploadLectureFilesCloudStorage,
  limits: { fileSize: 500 * 1024 * 1024 },
}).fields([
  { name: "lecturethumbnailUrl", maxCount: 1 },
  { name: "videoUrl", maxCount: 1 },
]);


const profilePicCloudStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pics", // 👈 cloud folder name
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

export const uploadProfilePicToCloudinary = multer({
  storage: profilePicCloudStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("profilePic");
