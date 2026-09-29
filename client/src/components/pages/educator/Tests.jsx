import React from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetTestsQuery, useDeleteTestMutation } from "../../../Redux/api/userApi.js";
import toast from "react-hot-toast";


function Tests() {
  const navigate = useNavigate();

  // Fetch all tests from backend
  const { data, isLoading, isError } = useGetTestsQuery();
  const [deleteTest] = useDeleteTestMutation();

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    try {
      await deleteTest(id).unwrap();
      toast.success("✅ Test deleted successfully!");
    } catch (error) {
      console.error("❌ Delete Error:", error);
      toast.error("❌ Failed to delete test.");
    }
  };

  // Loading or Error UI
  if (isLoading) return <p className="text-white text-center mt-20">Loading tests...</p>;
  if (isError) return <p className="text-red-500 text-center mt-20">Error fetching tests!</p>;

  const tests = data?.data || []; // API response has {success, message, data: [...]}

  return (
    <div className="p-6 bg-gradient-to-br mt-14 from-black via-gray-900 to-gray-800 min-h-screen">
      {/* Header with Generate Test Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">All Tests</h1>
        <button
          onClick={() => navigate("/educator/add-test")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-black text-white rounded-lg shadow hover:opacity-90 transition"
        >
          <PlusCircle size={20} />
          Generate Test
        </button>
      </div>

      {/* Tests Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 shadow-lg rounded-lg bg-gradient-to-br from-gray-900 to-black">
          <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Subject</th>
              <th className="px-6 py-3 text-left">Chapter Title</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 py-4">
                  No tests found
                </td>
              </tr>
            ) : (
              tests.map((test, index) => (
                <tr
                  key={test._id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 text-gray-200">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-100">{test.subject}</td>
                  <td className="px-6 py-4 whitespace-pre-wrap break-words max-w-md text-gray-300">
                    {test.chaptername}
                  </td>
                  <td className="px-6 py-4 text-gray-200">{test.date}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(test._id)}
                      className="text-red-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tests;
