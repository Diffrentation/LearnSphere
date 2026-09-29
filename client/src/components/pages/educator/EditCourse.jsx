import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Save, Upload } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetCourseByIdQuery, useUpdateCourseMutation } from "../../../Redux/api/userApi";
import { toast } from "react-hot-toast";

export default function EditCourse() {
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.state?.id;

  // Fetch course by ID
  const { data: courseData, isLoading, isError, refetch } = useGetCourseByIdQuery(courseId, {
    skip: !courseId,
  });

  // Update course mutation
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    duration: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailName, setThumbnailName] = useState("");

  // Prefill form when data is loaded
  useEffect(() => {
    if (courseData?.data) {
      const c = courseData.data;
      setFormData({
        title: c.title || "",
        category: c.category || "",
        description: c.description || "",
        price: c.price || "",
        duration: c.duration || "",
      });
      setThumbnailName(c.coursethumbnailUrl ? c.coursethumbnailUrl.split("/").pop() : "");
    }
  }, [courseData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId) return toast.error("Course ID not found");

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("duration", formData.duration);

      // ✅ Important: field name must match Multer's .single("coursethumbnailUrl")
      if (thumbnailFile) payload.append("coursethumbnailUrl", thumbnailFile);

      // Send mutation
      await updateCourse({ id: courseId, body: payload }).unwrap();
      toast.success("✅ Course updated successfully!");

      // Refetch updated data (optional)
      refetch();

      navigate("/educator/my-courses");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update course");
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-gray-900">
        <p className="text-white text-lg animate-pulse">Loading course...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-gray-900">
        <p className="text-red-400 text-lg">Failed to fetch course. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen mt-16 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-gray-900/80 backdrop-blur-lg border border-gray-700 shadow-2xl rounded-2xl p-10"
      >
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wide">
          📚 Edit Course
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Title */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Course Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
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
              <option value="">Select Category</option>
              <option>Science</option>
              <option>Mathematics</option>
              <option>Social Studies</option>
              <option>English</option>
              <option>Hindi</option>
              <option>Computer Science</option>
            </select>
          </motion.div>

          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Course Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </motion.div>

          {/* Price */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </motion.div>

          {/* Duration */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Duration (weeks)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </motion.div>

            {/* Thumbnail Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="md:col-span-2"
            >
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Replace / Update Course Thumbnail
              </label>

              {/* Show current thumbnail preview */}
              {courseData?.data?.coursethumbnailUrl && !thumbnailFile && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-1">Current Thumbnail:</p>
                  <img
                    src={courseData.data.coursethumbnailUrl}
                    alt="Current Thumbnail"
                    className="w-48 h-32 object-cover rounded-lg border border-gray-600"
                  />
                </div>
              )}

              <div className="w-full border-2 border-dashed border-gray-600 bg-gray-800/60 rounded-2xl flex flex-col items-center justify-center p-10 cursor-pointer hover:border-indigo-500 transition">
                <input
                  type="file"
                  name="coursethumbnailUrl"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  id="thumbnailUpload"
                />
                <label htmlFor="thumbnailUpload" className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-indigo-400 mb-3" />
                  <span className="text-gray-400">
                    {thumbnailName || "Click to upload or drag & drop new thumbnail"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, SVG</span>
                </label>
              </div>
            </motion.div>

          {/* Save Button */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="md:col-span-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isUpdating}
              className={`w-full ${isUpdating ? "bg-green-800" : "bg-green-600 hover:bg-green-700"} text-white font-semibold py-3 rounded-xl shadow-lg transition text-base flex items-center justify-center gap-2`}
            >
              <BookOpen className="w-5 h-5" />
              <Save className="w-5 h-5" />
              {isUpdating ? "Saving..." : "Save Changes"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
