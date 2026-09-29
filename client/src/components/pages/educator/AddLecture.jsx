import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Video, Plus, Trash2, Link, FileText, Clock, ListOrdered, BookOpen, File, X, Globe, Download } from "lucide-react";

export default function AddLecture() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoOption: "upload",
    videoFile: null,
    videoUrl: "",
    duration: "",
    order: "",
    resourceOption: "upload",
    resourceFiles: [],
    resourceUrls: [{ name: "", url: "" }],
    isPublished: false
  });

  const [videoName, setVideoName] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoName(file.name);
      setFormData(prev => ({
        ...prev,
        videoFile: file
      }));
    }
  };

  const handleVideoOptionChange = (option) => {
    setFormData(prev => ({
      ...prev,
      videoOption: option,
      videoFile: option === 'url' ? null : prev.videoFile,
      videoUrl: option === 'upload' ? "" : prev.videoUrl
    }));
    
    if (option === 'url') {
      setVideoName("");
    }
  };

  const handleResourceOptionChange = (option) => {
    setFormData(prev => ({
      ...prev,
      resourceOption: option,
      resourceFiles: option === 'url' ? [] : prev.resourceFiles,
      resourceUrls: option === 'upload' ? [{ name: "", url: "" }] : prev.resourceUrls
    }));
  };

  const handleResourceUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      resourceFiles: [...prev.resourceFiles, ...files]
    }));
    
    // Reset the input
    e.target.value = null;
  };

  const handleResourceUrlChange = (index, field, value) => {
    const updatedUrls = [...formData.resourceUrls];
    updatedUrls[index] = {
      ...updatedUrls[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      resourceUrls: updatedUrls
    }));
  };

  const addResourceUrl = () => {
    setFormData(prev => ({
      ...prev,
      resourceUrls: [...prev.resourceUrls, { name: "", url: "" }]
    }));
  };

  const removeResourceUrl = (index) => {
    if (formData.resourceUrls.length > 1) {
      const updatedUrls = formData.resourceUrls.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        resourceUrls: updatedUrls
      }));
    }
  };

  const removeResourceFile = (index) => {
    setFormData(prev => ({
      ...prev,
      resourceFiles: prev.resourceFiles.filter((_, i) => i !== index)
    }));
  };

  const clearVideo = () => {
    setFormData(prev => ({
      ...prev,
      videoFile: null
    }));
    setVideoName("");
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.duration) errors.duration = "Duration is required";
    
    if (formData.videoOption === "upload" && !formData.videoFile) {
      errors.video = "Please upload a video file";
    }
    
    if (formData.videoOption === "url" && !formData.videoUrl) {
      errors.video = "Please provide a video URL";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Form submission logic would go here
      alert("Lecture created successfully!");
    }
  };

  return (
    <div className="w-screen min-h-screen mt-16 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl bg-gray-900/80 backdrop-blur-lg border border-gray-700 shadow-2xl rounded-2xl p-8 md:p-10"
      >
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 text-center tracking-wide">
          <BookOpen className="inline-block mr-2 mb-1" />
          Create New Lecture
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Lecture Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lecture Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter lecture title"
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
            {formErrors.title && (
              <p className="text-red-400 text-xs mt-1">{formErrors.title}</p>
            )}
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter lecture description"
              rows={3}
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
            {formErrors.description && (
              <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>
            )}
          </motion.div>

          {/* Video Option Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video Source *
            </label>
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => handleVideoOptionChange('upload')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  formData.videoOption === 'upload' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => handleVideoOptionChange('url')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  formData.videoOption === 'url' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                <Link className="w-4 h-4 mr-2" />
                Use URL
              </button>
            </div>

            {formData.videoOption === 'upload' ? (
              <div>
                {formData.videoFile ? (
                  <div className="relative">
                    <div className="w-full border-2 border-dashed border-indigo-500 bg-indigo-500/10 rounded-2xl p-4 flex flex-col items-center">
                      <Video className="w-12 h-12 text-indigo-400 mb-2" />
                      <p className="text-white font-medium text-sm truncate">{videoName}</p>
                      <button
                        type="button"
                        onClick={clearVideo}
                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm flex items-center"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove Video
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full border-2 border-dashed border-gray-600 bg-gray-800/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="videoUpload"
                    />
                    <label htmlFor="videoUpload" className="flex flex-col items-center">
                      <Upload className="w-12 h-12 text-indigo-400 mb-3" />
                      <span className="text-gray-300 text-center">
                        Click to upload or drag & drop a video file
                      </span>
                      <span className="text-xs text-gray-500 mt-2">
                        Supported formats: MP4, AVI, MOV, MKV
                      </span>
                    </label>
                  </div>
                )}
                {formErrors.video && (
                  <p className="text-red-400 text-xs mt-2">{formErrors.video}</p>
                )}
              </div>
            ) : (
              <div>
                <div className="relative">
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/video.mp4"
                    className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                  <Globe className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
                {formErrors.video && (
                  <p className="text-red-400 text-xs mt-2">{formErrors.video}</p>
                )}
              </div>
            )}
          </motion.div>

          {/* Duration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration (minutes) *
            </label>
            <div className="relative">
              <input
                type="number"
                name="duration"
                min="1"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Duration in minutes"
                className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <Clock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            </div>
            {formErrors.duration && (
              <p className="text-red-400 text-xs mt-1">{formErrors.duration}</p>
            )}
          </motion.div>

          {/* Order */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Order
            </label>
            <div className="relative">
              <input
                type="number"
                name="order"
                min="0"
                value={formData.order}
                onChange={handleInputChange}
                placeholder="Lecture order in course"
                className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <ListOrdered className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            </div>
          </motion.div>

          {/* Published Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center"
          >
            <label className="flex items-center text-sm font-medium text-gray-300">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
                className="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 mr-2"
              />
              Publish immediately
            </label>
          </motion.div>

          {/* Resources Option Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="md:col-span-2"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Resources (Optional)
            </label>
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => handleResourceOptionChange('upload')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  formData.resourceOption === 'upload' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                <Download className="w-4 h-4 mr-2" />
                Upload Files
              </button>
              <button
                type="button"
                onClick={() => handleResourceOptionChange('url')}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  formData.resourceOption === 'url' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                <Link className="w-4 h-4 mr-2" />
                Use URLs
              </button>
            </div>

            {formData.resourceOption === 'upload' ? (
              <div className="space-y-4 p-4 bg-gray-800/30 rounded-xl">
                {/* Resource Upload Area */}
                <div className="w-full border-2 border-dashed border-gray-600 bg-gray-800/40 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition">
                  <input
                    type="file"
                    multiple
                    onChange={handleResourceUpload}
                    className="hidden"
                    id="resourceUpload"
                  />
                  <label htmlFor="resourceUpload" className="flex flex-col items-center">
                    <FileText className="w-10 h-10 text-indigo-400 mb-2" />
                    <span className="text-gray-300 text-center">
                      Click to upload or drag & drop resource files
                    </span>
                    <span className="text-xs text-gray-500 mt-2">
                      PDF, DOC, PPT, ZIP, etc.
                    </span>
                  </label>
                </div>

                {/* Resource Files List */}
                {formData.resourceFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Uploaded Resources:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {formData.resourceFiles.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg"
                        >
                          <div className="flex items-center overflow-hidden">
                            <File className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" />
                            <span className="text-sm text-white truncate">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeResourceFile(index)}
                            className="text-red-400 hover:text-red-300 ml-2"
                            title="Remove resource"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 p-4 bg-gray-800/30 rounded-xl">
                {formData.resourceUrls.map((resource, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Resource Name
                      </label>
                      <input
                        type="text"
                        value={resource.name}
                        onChange={(e) => handleResourceUrlChange(index, 'name', e.target.value)}
                        placeholder="Resource name"
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Resource URL
                      </label>
                      <input
                        type="url"
                        value={resource.url}
                        onChange={(e) => handleResourceUrlChange(index, 'url', e.target.value)}
                        placeholder="https://example.com/resource.pdf"
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      />
                    </div>
                    <div className="flex justify-end">
                      {formData.resourceUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeResourceUrl(index)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm flex items-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addResourceUrl}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Another Resource
                </button>
              </div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="md:col-span-2 mt-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition text-base flex items-center justify-center gap-2"
            >
              <Video className="w-5 h-5" />
              Create Lecture
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}