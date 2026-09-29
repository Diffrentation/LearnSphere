import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {string} filePath - path of file from Multer
 * @param {string} folder - folder in Cloudinary
 * @param {'image' | 'video' | 'raw'} resourceType - default 'image'
 * @returns {Promise<string>} secure_url
 */
export const uploadToCloudinary = async (filePath, folder, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
    });
    // await fs.unlink(filePath); // remove local file
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw new Error("Failed to upload file to Cloudinary");
  }
};

export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (err) {
    console.error("Cloudinary Delete Error:", err);
    throw new Error("Failed to delete file from Cloudinary");
  }
};

