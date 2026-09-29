import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
// import Rating from "./Rating";
import { useGetAllCoursesQuery } from "../../../Redux/api/userApi";

const CourseCard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const username = user?.fullname || user?.username || "User";

  const handleEnroll = (course) => {
    toast.success(`${username} is enrolled in ${course.title}!`);
  };

  // Fetch courses from API
  const { data, isLoading, isError } = useGetAllCoursesQuery();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        Loading courses...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-red-500">
        Something went wrong while fetching courses.
      </div>
    );
  }

  // Get latest 4 courses
  const latestCourses = [...data.data]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Latest Courses</h2>

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-black">
        {latestCourses.map((course) => (
          <motion.div
            key={course._id}
            className="bg-white shadow-lg rounded-xl flex flex-col overflow-hidden md:h-96"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Thumbnail */}
            <img
              src={course.coursethumbnailUrl}
              alt={course.title}
              className="h-40 w-full object-cover"
            />

            {/* Info */}
            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-1">
                  Instructor: {course.instructor?.fullname || "N/A"}
                </p>
                <p className="text-gray-500 text-sm mb-1">
                  {course.category} | {course.level}
                </p>
                <p className="text-gray-500 text-sm mb-2">
                  Duration: {course.duration} weeks
                </p>
                {/* <Rating rating={course.rating} /> */}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-lg font-bold">₹{course.price}/m</p>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    onClick={() => navigate(`/course/${course._id}`)}
                  >
                    Details
                  </button>
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                    onClick={() => handleEnroll(course)}
                  >
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show More Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/course-list")}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
