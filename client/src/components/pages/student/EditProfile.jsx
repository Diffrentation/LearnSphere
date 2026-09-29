import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery, useUpdateProfileMutation } from "../../../Redux/api/authApi";
import { toast } from "react-hot-toast";

function EditProfile() {
  const navigate = useNavigate();

  const { data, isLoading: isUserLoading, refetch } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    college: "",
    course: "",
    year: "",
    rollNo: "",
    address: "", // NEW
    profileUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (data?.data?.user) {
      const user = data.data.user;
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        skills: user.skills?.join(", ") || "",
        college: user.college || "",
        course: user.course || "",
        year: user.year || "",
        rollNo: user.rollNo || "",
        address: user.address || "", // PREFILL
        profileUrl: user.profileUrl || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFormData((prev) => ({
        ...prev,
        profileUrl: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "profileUrl") payload.append(key, formData[key]);
    });
    if (selectedFile) payload.append("profilePic", selectedFile);

    try {
      await updateProfile(payload).unwrap();
      await refetch();
      toast.success("Profile updated successfully!");
      navigate("/student/profile");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (isUserLoading) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen flex items-center mt-10 justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 animate-fadeIn"
      >
        <h2 className="text-3xl font-bold text-cyan-300 mb-6 text-center">Edit Profile</h2>

        {/* Avatar */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">Avatar</label>
          <div className="flex items-center gap-6">
            <img
              src={formData.profileUrl ? formData.profileUrl.replace("\\", "/") : "https://via.placeholder.com/80"}
              alt="avatar"
              className="w-20 h-20 rounded-full border-4 border-cyan-400 shadow-lg object-cover"
            />
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-white" />
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {[
            { field: "fullname", label: "Full Name" },
            { field: "email", label: "Email" },
            { field: "phoneNumber", label: "Phone" },
            { field: "college", label: "College" },
            { field: "address", label: "Address" }, // NEW
          ].map(({ field, label }) => (
            <div key={field} className="flex flex-col">
              <label className="text-gray-300 mb-2 font-medium">{label}</label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="p-3 rounded-lg border border-white/20 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder={label}
              />
            </div>
          ))}
        </div>

        {/* Academic Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {[
            { field: "course", label: "Course" },
            { field: "year", label: "Year" },
            { field: "rollNo", label: "Roll No" },
          ].map(({ field, label }) => (
            <div key={field} className="flex flex-col">
              <label className="text-gray-300 mb-2 font-medium">{label}</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="p-3 rounded-lg border border-white/20 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder={label}
              />
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 rounded-lg border border-white/20 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Write something about yourself..."
          />
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">Skills</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-white/20 bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Skills (comma separated)"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="reset"
            onClick={() => {
              if (data?.data?.user) {
                const user = data.data.user;
                setFormData({
                  fullname: user.fullname || "",
                  email: user.email || "",
                  phoneNumber: user.phoneNumber || "",
                  bio: user.bio || "",
                  skills: user.skills?.join(", ") || "",
                  college: user.college || "",
                  course: user.course || "",
                  year: user.year || "",
                  rollNo: user.rollNo || "",
                  address: user.address || "", // RESET
                  profileUrl: user.profileUrl || "",
                });
              }
              setSelectedFile(null);
            }}
            className="px-5 py-2 rounded-lg bg-gray-600/40 hover:bg-gray-600 text-white transition"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold shadow-lg transition"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
