import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, PlusCircle } from "lucide-react";
import { useCreateCourseMutation } from "../../../Redux/api/userApi";

export default function AddCourse() {
  const [thumbnailName, setThumbnailName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "Subjects",
    price: "",
    level: "Beginner",
    duration: "",
    description: "",
    thumbnail: null,
  });

  const [createCourse, { isLoading }] = useCreateCourseMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, thumbnail: file });
      setThumbnailName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.duration) {
      alert("Please fill in all required fields");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("level", formData.level);
    data.append("duration", formData.duration);
    data.append("description", formData.description);
    if (formData.thumbnail) data.append("coursethumbnailUrl", formData.thumbnail);

    try {
      await createCourse(data).unwrap();
      alert("Course created successfully!");

      setFormData({
        title: "",
        category: "Subjects",
        price: "",
        level: "Beginner",
        duration: "",
        description: "",
        thumbnail: null,
      });
      setThumbnailName("");
    } catch (err) {
      console.error(err);
      alert("Failed to create course");
    }
  };

  return (
    <div className="w-screen min-h-screen mt-16 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-gray-900/80 backdrop-blur-lg border border-gray-700 shadow-2xl rounded-2xl p-10"
      >
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wide">
          📚 Add New Course
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full" onSubmit={handleSubmit}>
          {/* Course Title */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Course Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Mastering React from Scratch"
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </motion.div>

          {/* Category */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            >
              <option>Science</option>
              <option>Mathematics</option>
              <option>Social Studies</option>
              <option>English</option>
              <option>Hindi</option>
              <option>Computer Science</option>
            </select>
          </motion.div>

          {/* Price */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 499"
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </motion.div>

          {/* Level */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </motion.div>

          {/* Duration */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Duration (weeks)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 6"
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </motion.div>

          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a detailed description of your course..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </motion.div>

          {/* Thumbnail Upload */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-3">Upload Course Thumbnail</label>
            <div className="w-full border-2 border-dashed border-gray-600 bg-gray-800/60 rounded-2xl flex flex-col items-center justify-center p-10 cursor-pointer hover:border-indigo-500 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
                id="thumbnailUpload"
              />
              <label htmlFor="thumbnailUpload" className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-indigo-400 mb-3" />
                <span className="text-gray-400">
                  {thumbnailName ? (
                    <span className="text-green-400 font-medium">{thumbnailName}</span>
                  ) : (
                    "Click to upload or drag & drop course thumbnail"
                  )}
                </span>
                <span className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, JPEG</span>
              </label>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="md:col-span-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition text-base flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <PlusCircle className="w-5 h-5" />
              {isLoading ? "Adding..." : "Add Course"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
