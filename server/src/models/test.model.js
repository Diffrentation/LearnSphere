import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    chaptername: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      unique: true,
    },
    testpic: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to auto-generate order & date
testSchema.pre("save", async function (next) {
  // Only set order if it's a new document
  if (this.isNew) {
    const lastTest = await mongoose.model("Test").findOne().sort({ order: -1 });
    this.order = lastTest ? lastTest.order + 1 : 1;

    // Auto-set date if not provided
    if (!this.date) {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      this.date = `${day}-${month}-${year}`;
    }
  }

  next();
});

export default mongoose.model("Test", testSchema);
