import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Video } from "lucide-react";

export default function EditLecture() {
  const [videoName, setVideoName] = useState("");

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setVideoName(file.name);
  };

  return (
    <div className="w-screen min-h-screen mt-16 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl bg-gray-900/80 backdrop-blur-lg border border-gray-700 shadow-2xl rounded-2xl p-10"
      >
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wide">
          ✏️ Edit Lecture
        </h2>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Lecture Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lecture Title
            </label>
            <input
              type="text"
              defaultValue="Introduction to React"
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </motion.div>

          {/* Date */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              defaultValue="2025-08-24"
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </motion.div>

          {/* Description (Full Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              defaultValue="This lecture covers the basics of React components and JSX."
              rows={3}
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </motion.div>

          {/* Video Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2"
          >
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Replace / Update Lecture Video
            </label>

            <div className="w-full border-2 border-dashed border-gray-600 bg-gray-800/60 rounded-2xl flex flex-col items-center justify-center p-10 cursor-pointer hover:border-indigo-500 transition">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                id="videoUpload"
              />
              <label htmlFor="videoUpload" className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-indigo-400 mb-3" />
                <span className="text-gray-400">
                  {videoName ? (
                    <span className="text-green-400 font-medium">
                      {videoName}
                    </span>
                  ) : (
                    "Click to upload or drag & drop new video"
                  )}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Supported formats: MP4, MKV, AVI
                </span>
              </label>
            </div>
          </motion.div>

          {/* Save Changes Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-green-700 transition text-base flex items-center justify-center gap-2"
            >
              <Video className="w-5 h-5" />
              Save Changes
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
