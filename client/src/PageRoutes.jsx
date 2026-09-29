import React, { lazy, Suspense } from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/pages/auth/ProtectedRoute.jsx";
import Loader from "./components/pages/auth/Loader.jsx";

// ---------------- Lazy load components ----------------
// Student components
const Navbar = lazy(() => import("./components/pages/student/Navbar"));
const Home = lazy(() => import("./components/pages/student/Home"));
const Instructors = lazy(() => import("./components/pages/student/Instructors"));
const CourseList = lazy(() => import("./components/pages/student/CourseList"));
const CourseDetails = lazy(() => import("./components/pages/student/CourseDetails"));
const MyEnrollments = lazy(() => import("./components/pages/student/MyEnrollment"));
const EditProfile = lazy(() => import("./components/pages/student/EditProfile"));
const Profile = lazy(() => import("./components/pages/student/Profile"));
const Player = lazy(() => import("./components/pages/student/Player"));
const Loading = lazy(() => import("./components/pages/student/Loading"));
const TestList = lazy(() => import("./components/pages/student/testList"));

// Auth components
const Login = lazy(() => import("./components/pages/auth/Login"));
const Signup = lazy(() => import("./components/pages/auth/Signup"));
const VerifyLogin = lazy(() => import("./components/pages/auth/verifyLoginOtp"));
const VerifyForgotPass = lazy(() => import("./components/pages/auth/verifyForgotPass"));
const OtpSendTo = lazy(() => import("./components/pages/auth/OtpSendTo"));
const VerifyRegisterOtp = lazy(() => import("./components/pages/auth/verifyRegisterOtp"));
const ResetPassword = lazy(() => import("./components/pages/auth/resetPassword"));

// Educator components
const Educator = lazy(() => import("./components/pages/educator/Educator"));
const Dashboard = lazy(() => import("./components/pages/educator/Dashboard"));
const AddCourse = lazy(() => import("./components/pages/educator/AddCourse"));
const EditCourse = lazy(() => import("./components/pages/educator/EditCourse"));
const AddLecture = lazy(() => import("./components/pages/educator/AddLecture"));
const EditLecture = lazy(() => import("./components/pages/educator/EditLecture"));
const MyCourses = lazy(() => import("./components/pages/educator/MyCourses"));
const MyLectures = lazy(() => import("./components/pages/educator/MyLectures"));
const Tests = lazy(() => import("./components/pages/educator/Tests"));
const AddTest = lazy(() => import("./components/pages/educator/AddTest"));
const StudentEnrolled = lazy(() => import("./components/pages/educator/StudentEnrolled"));

function PageRoutes() {
  const isEducatorPath = useMatch("/educator/*");
  const { user } = useSelector((state) => state.auth);

  return (
    <Suspense fallback={<Loader />}>
      {!isEducatorPath && <Navbar />}

      <Routes>
        {/* ---------------- Auth Routes ---------------- */}
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="verify-forgot-pass" element={<VerifyForgotPass />} />
          <Route path="verify-login-otp" element={<VerifyLogin />} />
          <Route path="verify-register-otp" element={<VerifyRegisterOtp />} />
          <Route path="forgot-password" element={<OtpSendTo />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* ---------------- Public Routes ---------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />

        {/* ---------------- Protected Student Routes ---------------- */}
        <Route element={<ProtectedRoute roles={["user", "admin"]} />}>
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/profile/editprofile" element={<EditProfile />} />
          <Route path="/my-enrollments" element={<MyEnrollments />} />
          <Route path="/player/:courseId" element={<Player />} />
          <Route path="/loading/:path" element={<Loading />} />
          <Route path="/test-list" element={<TestList />} />
        </Route>

        {/* ---------------- Protected Educator Routes ---------------- */}
        <Route
          path="/educator"
          element={<ProtectedRoute roles={["instructor", "admin"]} />}
        >
          <Route element={<Educator />}>
            <Route index element={<Dashboard />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="edit-course" element={<EditCourse />} />
            <Route path="add-lecture" element={<AddLecture />} />
            <Route path="edit-lecture" element={<EditLecture />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="my-lectures" element={<MyLectures />} />
            <Route path="tests" element={<Tests />} />
            <Route path="add-test" element={<AddTest />} />
            <Route path="student-enrolled" element={<StudentEnrolled />} />
          </Route>
        </Route>

        {/* ---------------- 404 Fallback ---------------- */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default PageRoutes;
