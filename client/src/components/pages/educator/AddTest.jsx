import React, { useState } from "react";
import { useGenerateTestMutation } from "../../../Redux/api/userApi.js";

function AddTest() {
  const [testData, setTestData] = useState({
    subject: "",
    chaptername: "",
    description: "",
    file: null,
  });

  const [generateTest, { isLoading }] = useGenerateTestMutation();

  // 🧠 Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setTestData({
      ...testData,
      [name]: files ? files[0] : value,
    });
  };

  // 🧠 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("subject", testData.subject);
    formData.append("chaptername", testData.chaptername);
    formData.append("description", testData.description);
    if (testData.file) formData.append("testpic", testData.file);

    try {
      console.log("📤 Sending data to backend...");
      const res = await generateTest(formData).unwrap();
      console.log("✅ API Response:", res);
      alert("✅ Test successfully uploaded!");
    } catch (error) {
      console.error("❌ API Error:", error);
      alert("❌ Failed to upload test. Check console for details.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex justify-center items-center">
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          ➕ Create or Upload Test
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subject */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={testData.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          {/* Chapter */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">Chapter Title</label>
            <input
              type="text"
              name="chaptername"
              value={testData.chaptername}
              onChange={handleChange}
              placeholder="Enter chapter title"
              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          {/* 📝 Description */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={testData.description}
              onChange={handleChange}
              placeholder="Enter short test description"
              rows="3"
              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Upload Test (PDF or Image)
            </label>
            <input
              type="file"
              name="file"
              accept=".pdf,image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 text-white file:text-white file:bg-gray-800 file:border-0 file:rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            {testData.file && (
              <p className="mt-2 text-sm text-gray-400">
                📄 Selected: {testData.file.name}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-black via-gray-800 to-gray-900 text-white font-semibold py-2 rounded-lg shadow-md hover:opacity-90 transition"
          >
            {isLoading ? "Uploading..." : "Upload Test"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTest;
