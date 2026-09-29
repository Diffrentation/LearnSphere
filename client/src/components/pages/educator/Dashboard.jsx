import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  IndianRupee,
  Video,
  PlusCircle,
  FileText,
  ClipboardCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetDashboardStatsQuery } from "../../../Redux/api/userApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetDashboardStatsQuery();
  const dashboard = data?.data;
  const stats = [
    { title: "Total Courses", value: dashboard?.stats.totalCourses ?? 0, icon: BookOpen, color: "text-indigo-400" },
    { title: "Enrolled Students", value: dashboard?.stats.enrolledStudents ?? 0, icon: Users, color: "text-green-400" },
    { title: "Enrollment Value", value: `₹${(dashboard?.stats.enrollmentValue ?? 0).toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-yellow-400" },
    { title: "Lectures Uploaded", value: dashboard?.stats.lecturesUploaded ?? 0, icon: Video, color: "text-pink-400" },
  ];
  const quickActions = [
    { title: "Add Course", icon: PlusCircle, path: "/educator/add-course" },
    { title: "My Courses", icon: FileText, path: "/educator/my-courses" },
    { title: "Tests", icon: ClipboardCheck, path: "/educator/tests" },
  ];

  return (
    <div className="w-screen min-h-screen mt-16 flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl"
      >
        <h2 className="text-4xl font-extrabold text-white mb-6 text-center tracking-wide">
          Educator Dashboard
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {quickActions.map((action) => (
            <motion.button
              key={action.title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.path)}
              className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 shadow-xl rounded-2xl p-6 flex flex-col items-center justify-center hover:border-indigo-500 transition"
            >
              <action.icon className="w-10 h-10 text-indigo-400 mb-2" />
              <span className="text-gray-300 font-medium text-sm text-center">{action.title}</span>
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 shadow-xl rounded-2xl p-6 flex items-center gap-4"
            >
              <stat.icon className={`${stat.color} w-10 h-10`} />
              <div>
                <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                <p className="text-2xl font-bold text-white">{isLoading ? "…" : stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 shadow-xl rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
          {isError ? (
            <p className="text-red-300">Could not load dashboard statistics. Please refresh the page.</p>
          ) : dashboard?.recentActivities?.length ? (
            <ul className="space-y-3">
              {dashboard.recentActivities.map((activity, index) => (
                <li key={`${activity.text}-${index}`} className="text-gray-300 text-sm border-b border-gray-700 pb-2">
                  {activity.text}
                </li>
              ))}
            </ul>
          ) : !isLoading ? (
            <p className="text-gray-400">No course or lecture activity yet.</p>
          ) : null}
        </motion.div>
      </motion.div>
    </div>
  );
}
