import React from "react";
import { FaStar } from "react-icons/fa";

function CourseDetailCard({ course }) {
  return (
    <div className="w-full md:w-96 text-cyan-100 bg-cyan-900">
      <div className="bg-cyan-900 shadow-xl rounded-2xl p-6 w-full text-cyan-100 flex flex-col">
        {/* Thumbnail */}
        <img
          src={course.coursethumbnailUrl || "https://via.placeholder.com/400x220"}
          alt={course.title}
          className="rounded-lg mb-4 w-full h-48 object-cover border border-cyan-700"
        />

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2 text-cyan-100">{course.title}</h2>

        {/* Instructor */}
        <p className="text-cyan-300 mb-4">
          <strong className="text-cyan-100">Instructor:</strong>{" "}
          {course.instructor?.fullname || "Unknown"}
        </p>

        {/* Description */}
        <p className="text-sm text-cyan-200 mb-4">{course.description}</p>

        {/* Info */}
        <div className="space-y-2 text-lg flex-1">
          <p>
            <strong className="text-cyan-100">Category:</strong> {course.category}
          </p>
          <p>
            <strong className="text-cyan-100">Level:</strong> {course.level}
          </p>
          <p>
            <strong className="text-cyan-100">Duration:</strong> {course.duration}{" "}
            {typeof course.duration === "number" ? "weeks" : ""}
          </p>
          <p>
            <strong className="text-cyan-100">Price:</strong> ₹{course.price}/m
          </p>

          {/* Rating */}
          {/* <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.round(course.rating)
                    ? "text-yellow-400"
                    : "text-cyan-700"
                }
              />
            ))}
            <span className="ml-2 text-sm text-cyan-300">{course.rating}</span>
          </div> */}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition">
            Enroll Now
          </button>
          <button className="flex-1 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white py-2 px-4 rounded-lg hover:from-cyan-500 hover:to-cyan-600 transition">
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailCard;
