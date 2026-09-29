import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand / About */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">CrystalVision Academy</h2>
          <p className="text-sm leading-relaxed">
            Trusted coaching institute for Class 1st to 12th.
            Experienced teachers, smart study material, weekly tests,
            and personalized doubt-solving to help students learn
            better and score higher.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
          <Link to="/about" className="hover:text-yellow-400 transition">About</Link>
          <Link to="/course-list" className="hover:text-yellow-400 transition">Courses</Link>
          <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <p className="text-sm">📍 Near P.S Memorial Public School,<br/>Akbarpur, Behrampur, Ghaziabad.</p>
          <p className="text-sm">📧 dev745640@gmail.com</p>
          <p className="text-sm">📞 +91 98214 36957</p>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-blue-500"><FaFacebookF /></a>
            <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
            <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-400"><FaLinkedinIn /></a>
          </div>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} CrystalVision Academy. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
