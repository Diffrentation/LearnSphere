import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function SearchBar({ query, setQuery, onSubmit }) {
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/course-list/" + query);
    // Add actual search logic here
  };

  return (
    <motion.form
      onSubmit={handleSearch}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
      className="flex w-11/12 md:w-1/2 bg-white/20 backdrop-blur-md rounded-full overflow-hidden shadow-lg border border-white/30 hover:border-cyan-400/70 transition-all duration-300"
    >
      <input
        type="text"
        placeholder="Search for courses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-5 py-3 outline-none text-white placeholder-gray-200 bg-transparent focus:ring-0"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 flex items-center gap-2"
      >
        <span>Search</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
      </button>
    </motion.form>
  );
}

export default SearchBar;
