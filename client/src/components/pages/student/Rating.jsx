import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function Rating({ rating, totalStars = 5 }) {
  return (
    <div className="flex items-center text-yellow-500">
      {Array.from({ length: totalStars }, (_, i) => {
        const starValue = i + 1;

        if (rating >= starValue) {
          // full star
          return <FaStar key={i} />;
        } else if (rating >= starValue - 0.5) {
          // half star
          return <FaStarHalfAlt key={i} />;
        } else {
          // empty star
          return <FaRegStar key={i} className="text-gray-300" />;
        }
      })}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}

export default Rating;
