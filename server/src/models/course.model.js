import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    coursethumbnailUrl: {
      type: String,
      default: "",
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
