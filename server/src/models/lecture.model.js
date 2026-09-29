import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    lecturethumbnailUrl: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number, // duration in seconds or minutes (your choice, just be consistent)
      required: true,
      min: 1,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    resources: [
      {
        url: {
          type: String,
          required: true,
          trim: true,
        },
        type: {
          type: String,
          enum: ["image", "file"],
          required: true,
        },
        originalName: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;
