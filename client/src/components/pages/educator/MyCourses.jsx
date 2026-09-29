import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Users, PlusCircle, IndianRupee, Video, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetAllCoursesQuery, useDeleteCourseMutation } from "../../../Redux/api/userApi";
import { toast } from "react-hot-toast";

export default function MyCourses() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetAllCoursesQuery();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const courses = data?.data || [];
  const filteredCourses = courses.filter((course) => {
    const query = searchTerm.trim().toLowerCase();
    return !query || [course.title, course.category, course.instructor?.fullname]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });
  const grandTotal = filteredCourses.reduce((total, course) => total + (course.price || 0), 0);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const response = await deleteCourse(courseId).unwrap();
      toast.success(response?.message || "Course deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete course");
    }
  };

  if (isLoading) {
    return <div className="w-screen h-screen flex justify-center items-center bg-gray-900 text-white">Loading courses...</div>;
  }
  if (error) {
    return <div className="w-screen h-screen flex justify-center items-center bg-gray-900 text-red-400">Failed to load courses. Please try again later.</div>;
  }

  return (
    <div className="w-screen min-h-screen mt-16 flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-7xl overflow-x-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-4xl font-extrabold text-white tracking-wide">My Courses</h2>
          <label className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search courses"
              className="w-full rounded-lg border border-gray-600 bg-gray-900 py-2 pl-10 pr-4 text-white placeholder-gray-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </label>
        </div>

        <div className="min-w-[1050px] grid grid-cols-7 bg-gray-900/80 border border-gray-700 rounded-t-2xl px-6 py-3 text-gray-300 font-semibold text-sm">
          <span>Title</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Enrolled</span>
          <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> Price</span>
          <span className="flex items-center gap-1"><Video className="w-4 h-4" /> Lectures</span>
          <span className="text-center">Edit</span>
          <span className="text-center">Delete</span>
          <span className="text-center">Add Lecture</span>
        </div>

        <div className="min-w-[1050px] flex flex-col divide-y divide-gray-700">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-7 bg-gray-900/80 border-l border-r border-gray-700 px-6 py-4 text-gray-200 items-center"
            >
              <span>{course.title}</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-green-400 cursor-pointer" onClick={() => navigate("/educator/student-enrolled", { state: { id: course._id } })} />{course.enrolledCount}</span>
              <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4 text-yellow-400" />{course.price || 0}</span>
              <span className="flex items-center gap-2"><Video className="w-4 h-4 text-pink-400" />{course.lectureCount}</span>
              <span className="flex justify-center"><Edit className="w-5 h-5 text-blue-400 cursor-pointer hover:text-blue-600 transition" onClick={() => navigate("/educator/edit-course", { state: { id: course._id } })} /></span>
              <span className="flex justify-center"><Trash2 className={`w-5 h-5 cursor-pointer transition ${isDeleting ? "text-gray-400 cursor-not-allowed" : "text-red-400 hover:text-red-600"}`} onClick={() => !isDeleting && handleDelete(course._id)} /></span>
              <span className="flex justify-center"><PlusCircle className="w-5 h-5 text-indigo-400 cursor-pointer hover:text-indigo-600 transition" onClick={() => navigate("/educator/add-lecture", { state: { id: course._id } })} /></span>
            </motion.div>
          ))}

          {filteredCourses.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-7 bg-gray-800/90 border border-gray-700 rounded-b-2xl px-6 py-4 text-gray-200 font-semibold">
              <span className="col-span-2">Grand Total</span>
              <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4 text-yellow-400" />{grandTotal}</span>
              <span></span><span></span><span></span><span></span>
            </motion.div>
          )}
          {!filteredCourses.length && (
            <div className="border border-gray-700 bg-gray-900/80 px-6 py-10 text-center text-gray-400">
              No courses match your search.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
