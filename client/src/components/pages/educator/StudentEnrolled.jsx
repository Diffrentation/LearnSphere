export default function StudentEnrolled() {
  return (
    <div className="w-screen min-h-screen mt-16 flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="w-full max-w-4xl rounded-2xl border border-gray-700 bg-gray-900/80 p-10 text-center">
        <h2 className="text-4xl font-extrabold text-white">Enrolled Students</h2>
        <p className="mt-4 text-gray-300">
          No students have enrolled in your courses yet.
        </p>
      </div>
    </div>
  );
}
