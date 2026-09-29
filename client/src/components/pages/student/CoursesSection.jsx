import CourseCard from "./CourseCard";

const CourseSection = () => {
  return (
    <div className="bg-cyan-800/70 text-white py-10">
      
      {/* Heading & Description */}
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Explore Our Courses for Class Up to 12th
        </h2>

        <p className="text-gray-200 mb-6">
          Quality education for every student! We offer well-structured classes
          for all subjects including Math, Science, English, Computer,
          Commerce, and more. With experienced teachers, concept-based learning,
          smart notes, and regular tests — students learn better, score higher,
          and build confidence for exams and future goals.
        </p>
      </div>

      <CourseCard />
    </div>
  );
};

export default CourseSection;
