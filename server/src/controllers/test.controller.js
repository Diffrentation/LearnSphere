import Test from "../models/test.model.js";
import { v2 as cloudinary } from "cloudinary";


const createTestWithCloudinary = async (req, res) => {
  try {
    const { subject, chaptername, description } = req.body;

    // Validate required fields
    if (!subject) {
      return res.status(400).json({ success: false, message: "Subject is required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const imageUrl = req.file.path; // Cloudinary middleware sets file.path to the URL

    // Create a new test (order & date will be auto-set by schema pre-save)
    const newTest = await Test.create({
      subject,
      chaptername,
      description,
      testpic: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "✅ Test created successfully with Cloudinary image",
      data: newTest,
    });
  } catch (error) {
    console.error("❌ Cloudinary Test Upload Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTests = async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 }); 
    res.status(200).json({
      success: true,
      data: tests,
    });
  } catch (error) {
    console.error("❌ Get Tests Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// 🗑️ Delete Test Controller
export const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find the test by ID
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    // 2️⃣ Extract the public_id from the Cloudinary URL
    if (test.testpic) {
      const segments = test.testpic.split("/");
      const filename = segments[segments.length - 1];
      const publicId = filename.split(".")[0]; // remove file extension

      // 3️⃣ Delete the image from Cloudinary
      await cloudinary.uploader.destroy(`thumbnails/${publicId}`);
    }

    // 4️⃣ Delete the test document from MongoDB
    await Test.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "✅ Test and image deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Test Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default createTestWithCloudinary;
