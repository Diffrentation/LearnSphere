import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LogoutButton from "../auth/logout";
import { useSelector } from "react-redux";
import { useGetCurrentUserQuery } from "../../../Redux/api/authApi";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { user: isLoggedIn } = useSelector((state) => state.auth);
  const { data } = useGetCurrentUserQuery(undefined, {
    skip: !isLoggedIn,
    refetchOnMountOrArgChange: true,
  });
  const user = data?.data?.user;

  const navLinksLoggedIn = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/course-list" },
    { name: "Instructors", path: "/instructors" },
    { name: "Test", path: "/test-list" },
  ];

  const navLinksLoggedOut = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/course-list" },
    { name: "Instructors", path: "/instructors" },
  ];

  return (
    <nav className="shadow-md fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-cyan-900 via-cyan-700 to-cyan-400 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            <Link to="/">CrystalVision Academy</Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {(isLoggedIn ? navLinksLoggedIn : navLinksLoggedOut).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-yellow-300 transition"
              >
                {link.name}
              </Link>
            ))}

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link to="/student/profile" className="flex items-center gap-2">
                  <img
                    src={user?.profileUrl || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <span className="font-semibold">
                    {user?.fullname || "User"}
                  </span>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 bg-white/20 border border-white/40 rounded-lg hover:bg-white/30 transition"
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-4 py-2 bg-white text-cyan-800 font-semibold rounded-lg hover:bg-gray-200 transition"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-gradient-to-r from-cyan-900 via-cyan-700 to-cyan-400 shadow-md text-white"
          >
            <div className="flex flex-col px-4 py-3 gap-3">
              {(isLoggedIn ? navLinksLoggedIn : navLinksLoggedOut).map(
                (link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-yellow-300 transition"
                  >
                    {link.name}
                  </Link>
                )
              )}

              {isLoggedIn ? (
                <div className="flex flex-col gap-2 mt-2">
                  <Link to="/student/profile" className="flex items-center gap-2">
                    <img
                      src={user?.profileUrl || "/default-avatar.png"}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <span className="font-semibold">
                      {user?.fullname || "User"}
                    </span>
                  </Link>
                  <LogoutButton />
                </div>
              ) : (
                <div className="flex items-center gap-4 mt-2">
                  <Link
                    to="/auth/login"
                    className="px-4 py-2 bg-white/20 border border-white/40 rounded-lg hover:bg-white/30 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="px-4 py-2 bg-white text-cyan-800 font-semibold rounded-lg hover:bg-gray-200 transition"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
