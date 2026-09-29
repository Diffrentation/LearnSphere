import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import Companies from "./Companies";

export default function Hero() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center text-white bg-gradient-to-r from-cyan-900 via-cyan-700 to-cyan-400 pt-20 pb-10">

      {/* Tag Line Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-4 py-1 rounded-full bg-white/20 text-white border border-white/30 mb-4 text-sm"
      >
        Coaching for Class 1st to 12th | Online + Offline | All Subjects
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-2xl md:text-5xl font-extrabold text-center leading-tight md:leading-snug px-6 md:px-40"
      >
        Build Strong Concepts.  
        <span className="text-yellow-300"> Score Better. </span>
        Shape Your Future.
      </motion.h1>

      {/* Highlight Text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-sm md:text-xl text-center text-gray-200 mt-6"
      >
        Expert teachers, smart learning, weekly tests & doubt sessions —  
        <br className="hidden md:block" />
        everything your child needs to become a topper.
      </motion.p>

      {/* Search bar */}
      <div className="mt-10 w-full flex justify-center">
        <SearchBar />
      </div>

      {/* Key Points */}
      <div className="flex flex-wrap justify-center gap-6 mt-10">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-md px-6 py-3 border border-white/30 text-sm font-medium text-white">
          ✅ CBSE / ICSE / UP Board
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-md px-6 py-3 border border-white/30 text-sm font-medium text-white">
          ✅ Math, Science, English, Computer, Commerce
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-md px-6 py-3 border border-white/30 text-sm font-medium text-white">
          ✅ Weekly Tests & Progress Report
        </div>
      </div>

      {/* Slider */}
      <div className="mt-16 w-full">
        <Companies />
      </div>
    </div>
  );
}
