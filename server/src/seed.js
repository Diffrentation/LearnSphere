import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/user.model.js";
import Course from "./models/course.model.js";
import Lecture from "./models/lecture.model.js";
import Test from "./models/test.model.js";

dotenv.config({ path: "./.env" });

const password = "SeedPass!2026";
const imageBaseUrl = process.env.SEED_IMAGE_BASE_URL || "http://localhost:3000/seed-images";
const images = {
  development: `${imageBaseUrl}/web-development.png`,
  analytics: `${imageBaseUrl}/data-analytics.png`,
};

const userProfiles = [
  ["Aarav Mehta", "aarav.mehta", "instructor", "9000000001", "Senior full-stack educator focused on practical JavaScript, Node.js, and system design.", "Bengaluru", "MSc Computer Science", "2026", "FAC-001"],
  ["Meera Iyer", "meera.iyer", "instructor", "9000000002", "Data educator helping learners turn questions into clear, useful analysis.", "Chennai", "MSc Data Science", "2026", "FAC-002"],
  ["Kabir Shah", "kabir.shah", "admin", "9000000003", "Platform administrator and learning operations lead.", "Mumbai", "MBA Education Management", "2026", "ADM-001"],
  ["Ananya Rao", "ananya.rao", "user", "9000000004", "Curious learner building a strong web-development foundation.", "Pune", "BTech Information Technology", "Second year", "STU-001"],
  ["Rohan Kapoor", "rohan.kapoor", "user", "9000000005", "Aspiring data analyst who enjoys solving problems with numbers.", "Delhi", "BSc Statistics", "First year", "STU-002"],
  ["Isha Patel", "isha.patel", "user", "9000000006", "Design-minded learner exploring frontend engineering.", "Ahmedabad", "BCA", "Third year", "STU-003"],
  ["Vihaan Singh", "vihaan.singh", "user", "9000000007", "Backend learner interested in APIs and databases.", "Jaipur", "BTech Computer Science", "Second year", "STU-004"],
  ["Diya Nair", "diya.nair", "user", "9000000008", "Student of analytics, visualization, and responsible AI.", "Kochi", "BCom Analytics", "First year", "STU-005"],
  ["Arjun Bose", "arjun.bose", "user", "9000000009", "Learner strengthening programming and interview skills.", "Kolkata", "BTech Computer Science", "Fourth year", "STU-006"],
  ["Sana Khan", "sana.khan", "user", "9000000010", "Learning data storytelling and dashboard design.", "Hyderabad", "BBA Business Analytics", "Second year", "STU-007"],
  ["Neil Fernandes", "neil.fernandes", "user", "9000000011", "Developer-in-training interested in cloud-native applications.", "Goa", "BSc Computer Science", "Third year", "STU-008"],
  ["Tara Das", "tara.das", "user", "9000000012", "Building confidence in coding through small, consistent projects.", "Guwahati", "BCA", "First year", "STU-009"],
];

const courseProfiles = [
  ["Modern JavaScript Foundations", "Build a practical understanding of modern JavaScript syntax, the DOM, async workflows, and modular application structure.", "Web Development", 799, 6, 4.7, "Beginner", "development"],
  ["React Interface Patterns", "Create accessible, resilient React interfaces using components, hooks, state management, and reusable visual patterns.", "Web Development", 999, 8, 4.8, "Intermediate", "development"],
  ["Node.js API Engineering", "Design Express APIs with validation, authentication, error handling, and MongoDB persistence.", "Backend Development", 1099, 8, 4.8, "Intermediate", "development"],
  ["MongoDB Data Modeling", "Model application data, write robust queries, and understand indexes, relationships, and aggregation pipelines.", "Databases", 899, 5, 4.6, "Intermediate", "analytics"],
  ["Python for Data Analysis", "Use Python, tabular data, visual exploration, and reproducible notebooks to answer real questions.", "Data Science", 999, 7, 4.9, "Beginner", "analytics"],
  ["SQL Analytics Toolkit", "Write reliable SQL for filtering, joins, aggregations, common table expressions, and reporting workflows.", "Data Analytics", 749, 5, 4.7, "Beginner", "analytics"],
  ["Data Visualization Principles", "Transform analytical results into readable charts, dashboards, and concise decision-ready narratives.", "Data Analytics", 849, 5, 4.6, "Intermediate", "analytics"],
  ["Machine Learning Essentials", "Understand supervised learning, evaluation, feature preparation, and responsible model interpretation.", "Machine Learning", 1299, 9, 4.8, "Advanced", "analytics"],
  ["Git and Team Collaboration", "Use branches, pull requests, code review, and release practices to work safely in a software team.", "Developer Tools", 599, 4, 4.5, "Beginner", "development"],
  ["Cloud Deployment Basics", "Deploy a full-stack application with environment configuration, logs, health checks, and practical security defaults.", "Cloud Computing", 1199, 6, 4.7, "Intermediate", "development"],
];

async function upsertUser(profile, index) {
  const [fullname, username, role, phoneNumber, bio, address, course, year, rollNo] = profile;
  const email = `seed.${username}@learnsphere.local`;
  const image = index % 2 === 0 ? images.development : images.analytics;
  const user = (await User.findOne({ email })) || new User({ email });

  user.set({
    username,
    fullname,
    email,
    password,
    role,
    profileUrl: image,
    phoneNumber,
    isVerified: true,
    address: `${address}, India`,
    bio,
    skills: role === "instructor" ? ["Teaching", "Mentoring", "Curriculum design"] : ["Problem solving", "Communication", "Continuous learning"],
    college: role === "instructor" || role === "admin" ? "LearnSphere Academy" : "LearnSphere Partner College",
    course,
    year,
    rollNo,
    token: null,
    resetToken: null,
    resetTokenExpiry: null,
  });

  await user.save();
  return user;
}

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required in server/.env before seeding.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  const users = await Promise.all(userProfiles.map(upsertUser));
  const instructors = users.filter((user) => user.role === "instructor");
  const students = users.filter((user) => user.role === "user");
  const courses = [];

  for (const [index, profile] of courseProfiles.entries()) {
    const [title, description, category, price, duration, rating, level, imageKey] = profile;
    const enrolledStudents = [students[index % students.length], students[(index + 2) % students.length], students[(index + 5) % students.length]];
    const course = (await Course.findOne({ title })) || new Course({ title });

    course.set({
      title,
      description,
      instructor: instructors[index % instructors.length]._id,
      category,
      price,
      duration,
      rating,
      studentsEnrolled: enrolledStudents.map((student) => student._id),
      coursethumbnailUrl: images[imageKey],
      isPublished: true,
      publishedAt: new Date("2026-01-15T09:00:00.000Z"),
      level,
    });
    await course.save();
    courses.push(course);
  }

  for (const student of students) {
    const enrolledCourses = courses
      .filter((course) => course.studentsEnrolled.some((studentId) => studentId.equals(student._id)))
      .map((course) => course._id);
    student.enrolledCourses = enrolledCourses;
    await student.save();
  }

  for (const [index, course] of courses.entries()) {
    for (const order of [1, 2]) {
      const title = order === 1 ? `${course.title}: Core Concepts` : `${course.title}: Guided Practice`;
      const lecture = (await Lecture.findOne({ course: course._id, order })) || new Lecture({ course: course._id, order });
      lecture.set({
        title,
        lecturethumbnailUrl: course.coursethumbnailUrl,
        description: `A complete ${order === 1 ? "concept" : "practice"} lesson for ${course.title}, including outcomes, examples, and a next-step activity.`,
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration: 900 + index * 30 + order * 60,
        course: course._id,
        resources: [
          { url: course.coursethumbnailUrl, type: "image", originalName: `${course.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-cover.png` },
          { url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", type: "file", originalName: `${course.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-notes.pdf` },
        ],
        order,
      });
      await lecture.save();
    }
  }

  for (const [index, course] of courses.entries()) {
    const subject = course.category;
    const chaptername = `${course.title} Assessment`;
    const test = await Test.findOne({ subject, chaptername });
    if (test) {
      test.set({
        subject,
        chaptername,
        description: `A structured assessment covering the key outcomes from ${course.title}.`,
        testpic: course.coursethumbnailUrl,
        date: `0${(index % 9) + 1}-02-2026`,
      });
      await test.save();
    } else {
      await new Test({
        subject,
        chaptername,
        description: `A structured assessment covering the key outcomes from ${course.title}.`,
        testpic: course.coursethumbnailUrl,
        date: `0${(index % 9) + 1}-02-2026`,
      }).save();
    }
  }

  console.log(`Seeded ${users.length} users, ${courses.length} courses, ${courses.length * 2} lectures, and ${courses.length} tests.`);
  console.log(`All seeded accounts use password: ${password}`);
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
