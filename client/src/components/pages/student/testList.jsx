import React from "react";
import TestCard from "./testCard.jsx";
import { useGetTestsQuery } from "../../../Redux/api/userApi";

export default function TestList() {
  const { data, isLoading, isError } = useGetTestsQuery();

  if (isLoading) return (
    <div className="min-h-screen bg-cyan-300 flex items-center justify-center">
      <p className="text-center text-cyan-800 text-lg">Loading tests...</p>
    </div>
  );
  
  if (isError) return (
    <div className="min-h-screen bg-cyan-300 flex items-center justify-center">
      <p className="text-center text-red-600 text-lg">Failed to load tests</p>
    </div>
  );

  const tests = data?.data || [];

  return (
    <div className="min-h-screen bg-cyan-300 overflow-hidden">
      <div className="max-w-7xl mx-auto p-6 pt-24"> {/* Increased top padding for navbar */}
        {tests.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-center text-cyan-700 text-lg">No tests available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {tests.map((test) => (
              <TestCard key={test._id} test={test} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



// import React from "react";
// import TestCard from "./TestCard";
// import { useGetTestsQuery } from "../../../Redux/api/userApi";

// export default function TestList() {
//   const { data, isLoading, isError } = useGetTestsQuery();

//   if (isLoading) return <p className="text-center mt-10">Loading tests...</p>;
//   if (isError) return <p className="text-center mt-10 text-red-500">Failed to load tests</p>;

//   // Access the array from backend
//   const tests = data?.data || [];

//   return (
//     <div className="max-w-3xl mx-auto p-4 mt-20">
//       {tests.length === 0 && <p className="text-center text-gray-500">No tests available.</p>}
//       {tests.map((test) => (
//         <TestCard key={test._id} test={test} />
//       ))}
//     </div>
//   );
// }
