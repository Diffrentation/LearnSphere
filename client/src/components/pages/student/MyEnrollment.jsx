import React from "react";

function MyEnrollment() {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-20">
      <div className="rounded-lg bg-gray-800 p-10 text-center shadow-md">
        <h2 className="text-2xl font-bold text-white">My Enrolled Courses</h2>
        <p className="mt-3 text-gray-300">
          You have not enrolled in any courses yet.
        </p>
      </div>
    </div>
  );
}

export default MyEnrollment;
