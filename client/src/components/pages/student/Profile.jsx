import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../../Redux/api/authApi";

function Profile() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const user = data?.data?.user;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Failed to load user data. Please login again.</p>
      </div>
    );
  }

  const avatar = user.profileUrl || "";
  
  const skills = Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "";

  return (
    <div className="w-full min-h-screen mt-10 bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-7xl bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col">
        <div className="flex flex-col lg:flex-row items-center lg:items-start p-6 lg:p-10 gap-6 lg:gap-10 flex-1 overflow-y-auto">
          
          {/* Avatar */}
          <img
            className="w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56 rounded-full border-4 border-gray-200 dark:border-gray-700 object-cover shadow-lg"
            src={avatar}
            alt="Avatar"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />

          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center lg:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-gray-100">
                {user.fullname || user.username || "User"}
              </h2>
              <button
                onClick={() => navigate("/educator")}
                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-2 sm:mt-0"
              >
                Go To Admin Dashboard
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-lg">
              {user.email}
            </p>

            {/* Action Buttons */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button
                className="px-4 sm:px-6 py-2 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition text-sm sm:text-lg"
                onClick={() => navigate("/student/profile/editprofile")}
              >
                Edit Profile
              </button>
              <button className="px-4 sm:px-6 py-2 border border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-950 transition text-sm sm:text-lg">
                View Certificates
              </button>
            </div>

            {/* User Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-gray-700 dark:text-gray-300 mb-6 text-sm sm:text-lg">
              <span><strong>📞 Phone:</strong> {user.phoneNumber || "-"}</span>
              <span><strong>📚 Course:</strong> {user.course || "-"}</span>
              <span><strong>🎓 Year:</strong> {user.year || "-"}</span>
              <span><strong>🆔 Roll No:</strong> {user.rollNo || "-"}</span>
              <span><strong>📍 College:</strong> {user.college || "-"}</span>
              <span><strong>🏠 Address:</strong> {user.address || "-"}</span>
              <span><strong>🌐 Skills:</strong> {skills || "-"}</span>
            </div>

            {/* Bio Section */}
            <div>
              <span className="block font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-xl sm:text-2xl">
                About Me
              </span>
              <p className="text-gray-700 dark:text-gray-400 text-sm sm:text-lg leading-relaxed">
                {user.bio || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
