import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,            // User profile data
  loading: false,           // For async actions
  error: null,              // Error messages
  isAuthenticated: false,   // Login status
  courses: [],              // Courses created (only for admin/instructor)
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set full user profile
    setUserProfile: (state, action) => {
      state.profile = action.payload;
      state.isAuthenticated = true;
      state.error = null;

      // Initialize courses array only if admin or instructor
      if (action.payload.role === "admin" || action.payload.role === "instructor") {
        state.courses = action.payload.courses || [];
      } else {
        state.courses = [];
      }
    },

    // Clear user profile (logout)
    clearUserProfile: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
      state.courses = [];
      state.error = null;
      state.loading = false;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Update specific fields in user profile
    updateUserField: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },

    // Add a course (only for admin/instructor)
    addCourse: (state, action) => {
      if (state.profile?.role === "admin" || state.profile?.role === "instructor") {
        if (!state.courses.includes(action.payload)) {
          state.courses.push(action.payload);
        }
      }
    },

    // Remove a course (only for admin/instructor)
    removeCourse: (state, action) => {
      if (state.profile?.role === "admin" || state.profile?.role === "instructor") {
        state.courses = state.courses.filter((id) => id !== action.payload);
      }
    },
  },
});

// Export actions
export const {
  setUserProfile,
  clearUserProfile,
  setLoading,
  setError,
  updateUserField,
  addCourse,
  removeCourse,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
