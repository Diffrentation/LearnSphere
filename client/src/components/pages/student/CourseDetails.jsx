import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import CourseDetailCard from "./CourseDetailCard";
// import Rating from "./Rating";
import { useGetCourseByIdQuery } from "../../../Redux/api/userApi";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetCourseByIdQuery(id);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Loading course details...</p>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <p className="text-red-500 p-6 text-xl">
        Course not found or failed to load!
      </p>
    );
  }

  const course = data.data; // course object from API

  return (
    <div
      className="w-full mt-10 pt-24 px-6 md:px-24 lg:px-48 min-h-screen
      bg-cyan-400"
    >
      <div className="flex flex-col md:flex-row gap-10 items-start w-full">
        {/* Left side: course details */}
        <div className="flex-1">
          <h1 className="text-5xl font-extrabold mb-6 text-cyan-900">
            {course.title}
          </h1>
           <strong className="text-cyan-800 md:text-xl">Description:</strong>{" "}
          <span className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
            {course.description}
          </span>
          <ul className="space-y-3 text-lg md:text-xl text-gray-700">
            <li>
              <strong className="text-cyan-800">Instructor:</strong>{" "}
              {course.instructor?.fullname || "Unknown"}
            </li>
            <li>
              <strong className="text-cyan-800">Level:</strong> {course.level}
            </li>
            <li>
              <strong className="text-cyan-800">Duration:</strong>{" "}
              {course.duration} {typeof course.duration === "number" ? "weeks" : ""}
            </li>
            <li>
              <strong className="text-cyan-800">Category:</strong>{" "}
              {course.category}
            </li>
            <li>
              <strong className="text-cyan-800">Price:</strong> ₹{course.price}/m
            </li>
            <li>
              {/* <Rating rating={course.rating} /> */}
            </li>
          </ul>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-2 rounded-lg
              bg-gradient-to-r from-cyan-400 to-cyan-600
              text-white font-semibold shadow-md
              hover:from-cyan-500 hover:to-cyan-700
              transition"
          >
            ← Back
          </button>
        </div>

        {/* Right side: course preview card */}
        <div className="w-full md:w-[400px] bg-cyan-900 rounded-lg shadow-lg p-4 ">
          <CourseDetailCard course={course} />
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
