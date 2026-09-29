// TeachersSection.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Himansu from "../../../assets/himanshu.jpg"
import Chandan from "../../../assets/Chandhu.jpg"
import Lucky from "../../../assets/lucky.jpg"

// ---------- Teacher Data ----------
const teachers = [
  {
    name: "Himanshu Mishra",
    subject: "Science",
    image: Himansu,
    style: "Concept-first approach with real-life science experiments.",
    bio: `Mr. Himanshu makes Science simple, logical, and exciting. 
    His teaching style focuses on understanding concepts instead of just memorizing formulas. 
    With practical activities, real-life examples, and smart explanations, students learn how science works in daily life. 
    He helps students build strong fundamentals for school exams and competitive tests, ensuring every child feels confident in Physics, Chemistry, and Biology.`
  },
  {
    name: "Chandan Kumar",
    subject: "Mathematics",
    image: Chandan,
    style: "Step-by-step problem solving with shortcut tricks.",
    bio: `Mr. Chandan helps students overcome their fear of Mathematics through clarity and practice. 
    He explains every topic from basics to advanced in an easy and friendly manner. 
    His classes include short tricks, logical methods, and exam-focused problem solving. 
    Students learn how to think smart, score high, and enjoy mathematics without confusion.`
  },
  {
    name: "Aryan Upadhyay",
    subject: "Social Studies",
    image: Lucky,
    style: "Storytelling-based teaching with real-world connections.",
    bio: `Mr. Aryan makes History, Civics, and Geography come alive through storytelling and interactive examples. 
    Instead of memorizing dates, students understand events, why they happened, and how society changes. 
    His teaching develops awareness, critical thinking, and general knowledge. 
    Students learn to connect classroom knowledge with the real world—perfect for board exams and future competitive studies.`
  },
];

// ---------- Accordion Sections ----------
const sections = [
  {
    title: "Our Vision for Transformative Education",
    content: `At our institution, education is not limited to textbooks and exams—it is about creating thinkers, innovators, and leaders. 
    We aim to go beyond traditional methods, helping students discover their inner potential. 
    Our classrooms are designed to spark creativity, curiosity, and collaboration. 
    We believe in teaching real-life applications of every concept, making learning both relevant and exciting. 
    By integrating technology, interactive projects, and hands-on learning, we prepare students for a rapidly evolving world. 
    We want our students to question, explore, and innovate rather than simply memorize. 
    Our vision is to nurture a generation of responsible, adaptable, and future-ready individuals. 
    With dedicated mentorship and constant encouragement, we ensure every student becomes confident in their journey of lifelong learning. 
    Education, for us, is not about marks—it is about transformation and empowerment.`,
  },
  {
    title: "Why Choose Us for Your Educational Journey",
    content: `Choosing the right place for learning is one of the most important decisions for a student, and we provide everything needed for success. 
    Our institution combines academic excellence with practical skills, ensuring students are ready for both exams and real-life challenges. 
    We provide personalized attention, mentorship, and support to every learner. 
    Our modern teaching approach includes project-based assignments, real-world case studies, and interactive sessions. 
    We integrate advanced technology into classrooms to make learning engaging and effective. 
    Students benefit from workshops, career guidance, and exposure to industry professionals. 
    Our strong alumni network and placement opportunities ensure future success. 
    Beyond academics, we focus on building confidence, discipline, and creativity in each student. 
    We believe in holistic growth—mind, body, and character. 
    By choosing us, students join a community where dreams are nurtured and goals are achieved.`,
  },
  {
    title: "Meet Our Dedicated Teachers",
    content: `Our teachers are not just educators—they are mentors, guides, and role models. 
    With years of experience and expertise, they bring knowledge alive through interactive teaching methods. 
    Each teacher is dedicated to understanding the unique strengths and challenges of students. 
    They focus on making concepts clear, interesting, and practical. 
    Our teachers believe in two-way communication, encouraging questions and discussions. 
    Many of them come from diverse professional backgrounds, enriching lessons with real-world perspectives. 
    They go beyond academic teaching, guiding students on leadership, ethics, and teamwork. 
    Teachers actively mentor students, helping them plan careers and personal growth paths. 
    Their passion for teaching creates an environment full of inspiration and motivation. 
    At the heart of our success lies the commitment of our teachers to shaping bright futures.`,
  },
  {
    title: "Inspiring Students Towards Success",
    content: `Our students are our pride, and everything we do revolves around their growth and success. 
    We believe each student is unique and has untapped potential waiting to be discovered. 
    We encourage them to think creatively, solve problems, and express themselves with confidence. 
    Students are provided opportunities to participate in competitions, workshops, and projects. 
    We guide them in developing life skills such as teamwork, leadership, and adaptability. 
    Our motivational programs and mentorship ensure students remain focused and inspired. 
    Success is not just about marks, but about becoming resilient, confident, and well-rounded individuals. 
    We teach students to embrace failures as lessons and celebrate every achievement with pride. 
    Students learn to balance academics with extracurricular growth, ensuring holistic development. 
    We shape our students into lifelong learners who are prepared for challenges in every stage of life.`,
  },
  {
    title: "Our Unique Teaching Methodology",
    content: `We use innovative teaching methods that move beyond traditional lectures. 
    Our classrooms are interactive, with discussions, debates, and hands-on activities. 
    We integrate modern tools such as digital simulations, videos, and real-world problem-solving. 
    Every lesson is designed to be engaging, practical, and inspiring. 
    Teachers use personalized strategies for slow and fast learners, ensuring no one is left behind. 
    We encourage peer-to-peer learning, allowing students to learn collaboratively. 
    Continuous assessments and feedback ensure students improve consistently. 
    Our system values creativity and innovation as much as theoretical knowledge. 
    By blending theory with practice, we prepare students for both exams and real-world applications. 
    This unique approach makes our teaching effective, memorable, and future-focused.`,
  },
  {
    title: "Building Confidence and Leadership",
    content: `Confidence and leadership are essential for success in today’s world, and we focus strongly on both. 
    Students are encouraged to speak, present, and lead group discussions regularly. 
    Leadership opportunities are provided through clubs, events, and teamwork projects. 
    We believe every student has leadership qualities waiting to be developed. 
    Our teachers guide students to make decisions, solve problems, and lead responsibly. 
    Confidence is built step by step through achievements, encouragement, and practice. 
    We also conduct workshops on communication, personality development, and public speaking. 
    Students learn how to lead with empathy, discipline, and collaboration. 
    By the time they graduate, they are prepared to take on leadership roles in any field. 
    Our goal is to build confident individuals who inspire others through action and example.`,
  },
  {
    title: "Shaping Global Citizens",
    content: `Education is not just about academics—it is about preparing students for a globalized world. 
    We teach students to think beyond boundaries and embrace diversity. 
    Our curriculum includes lessons on cultural understanding, ethics, and social responsibility. 
    Students learn to respect different perspectives while holding strong values. 
    We encourage participation in international programs, events, and cultural exchanges. 
    Global issues like sustainability, technology, and community development are discussed in classrooms. 
    Our goal is to shape students who can contribute positively at a local and global level. 
    We believe in creating citizens who are socially responsible and globally aware. 
    Students learn to balance personal success with making the world a better place. 
    By shaping global citizens, we prepare them for meaningful impact in every community they touch.`,
  },
  {
    title: "Commitment to Lifelong Learning",
    content: `We believe education never ends—it is a journey that continues for life. 
    Our aim is to instill in students a love for learning that stays with them forever. 
    We encourage curiosity, questioning, and a hunger for knowledge in every lesson. 
    Our alumni often return to share how the skills they learned still guide them today. 
    We teach adaptability, ensuring students can thrive in a changing world. 
    Teachers constantly update their knowledge to bring the latest insights into classrooms. 
    Students are trained not just to study, but to research, explore, and innovate. 
    Our culture promotes growth, reflection, and improvement at every stage. 
    We believe every new challenge is an opportunity to learn and evolve. 
    Lifelong learners become leaders who inspire change and progress wherever they go.`,
  },
];

export default function TeachersSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleSection = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-gradient-to-br mt-10 from-cyan-100 via-cyan-200 to-cyan-300 py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-8 text-cyan-900">
          Meet Our Teachers
        </h1>

        {/* Teacher Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {teachers.map((teacher, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="bg-white shadow-lg rounded-xl p-6 border border-cyan-300 flex flex-col items-center text-center"
            >
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-32 h-32 object-cover rounded-full shadow-md mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800">
                {teacher.name}
              </h2>
              <p className="text-cyan-600 font-medium">{teacher.subject}</p>
              <p className="mt-2 italic text-gray-600">{teacher.style}</p>
              <p className="mt-4 text-gray-700 text-sm leading-relaxed">
                {teacher.bio}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Accordion Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-cyan-900">
            Our Missons
          </h1>

          {sections.map((section, index) => (
            <div
              key={index}
              className="w-full border border-cyan-400 rounded-xl shadow-md bg-white"
            >
              <button
                className="flex justify-between items-center w-full p-5 text-left text-xl font-semibold text-gray-800 hover:bg-cyan-50 rounded-xl transition"
                onClick={() => toggleSection(index)}
              >
                {section.title}
                {activeIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-cyan-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-cyan-600" />
                )}
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 text-gray-700 leading-relaxed text-justify">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
