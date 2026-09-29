import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, LayoutDashboard, FileText, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/educator/dashboard", icon: LayoutDashboard },
    { name: "Tests", path: "/educator/tests", icon: FileText },
  ];

  const handleLogout = () => {
    // 👉 Add your logout logic here
    console.log("Educator logged out");
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 bg-gray-900 border-b border-gray-700 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-indigo-400 font-bold text-xl cursor-pointer"
        >
          <GraduationCap className="w-7 h-7" />
          <span>LearnSphere</span>
        </div>

        {/* Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition"
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </motion.nav>
  );
}
