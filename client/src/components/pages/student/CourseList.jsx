import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
// import Rating from "./Rating";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import { useGetAllCoursesQuery } from "../../../Redux/api/userApi";

const CourseList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const username = user?.fullname || user?.username || "User";

  const handleEnroll = (course) => {
    toast.success(`${username} is enrolled in ${course.title}!`);
  };

  const { data, isLoading, isError } = useGetAllCoursesQuery();
  const [query, setQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: Infinity,
    category: "all",
  });

  // Filter courses based on search and filters
  useEffect(() => {
    if (!data?.data) return;

    const result = data.data.filter((course) => {
      const searchQuery = query.toLowerCase();
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery) ||
        course.instructor?.fullname.toLowerCase().includes(searchQuery);

      const matchesRating = course.rating >= filters.minRating;
      const matchesPrice = course.price <= filters.maxPrice;
      const matchesCategory =
        filters.category === "all" || course.category === filters.category;

      return matchesSearch && matchesRating && matchesPrice && matchesCategory;
    });

    setFilteredCourses(result);
  }, [data, query, filters]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-cyan-100">
        Loading courses...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-red-500bg-gradient-to-r from-cyan-900 via-cyan-700 to-cyan-400">
        Something went wrong while fetching courses.
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-r from-cyan-900 via-cyan-700 to-cyan-400 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-white mb-12">
          Explore Our Courses
        </h2>

        {/* Search bar */}
        <div className="mb-6 flex justify-end">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSubmit={(e) => e.preventDefault()}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 justify-end">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Min Rating:</label>
            <select
              className="rounded-md border-gray-300 shadow-sm text-black"
              onChange={(e) =>
                setFilters({ ...filters, minRating: Number(e.target.value) })
              }
            >
              <option value="0">Any</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Max Price:</label>
            <select
              className="rounded-md border-gray-300 shadow-sm text-black"
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: Number(e.target.value) })
              }
            >
              <option value="10000">Any</option>
              <option value="300">Under ₹300</option>
              <option value="500">Under ₹500</option>
              <option value="1000">Under ₹1000</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              className="rounded-md border-gray-300 shadow-sm text-black"
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="all">All Categories</option>
              <option value="Science">Science</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Mathmatics">Mathmatics</option>
            </select>
          </div>
        </div>

        {/* Course grid */}
        {filteredCourses.length === 0 ? (
          <div className="w-full h-64 flex items-center justify-center text-gray-600 text-lg">
            No courses found.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-black mb-20">
            {filteredCourses.map((course) => (
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

                  {/* Price + Buttons */}
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
        )}
      </div>
    </div>
  );
};

export default CourseList;
