import React from "react";

export default function Loader() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      {/* Circle avatar/image placeholder */}
      <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse"></div>
      
      {/* Text placeholder */}
      <div className="w-3/4 h-6 rounded bg-gray-300 animate-pulse"></div>
      <div className="w-1/2 h-6 rounded bg-gray-300 animate-pulse"></div>

      {/* Card placeholders */}
      <div className="w-full max-w-md h-40 rounded-xl bg-gray-300 animate-pulse mt-6"></div>
      <div className="w-full max-w-md h-40 rounded-xl bg-gray-300 animate-pulse mt-4"></div>
      <div className="w-full max-w-md h-40 rounded-xl bg-gray-300 animate-pulse mt-4"></div>
    </div>
  );
}
