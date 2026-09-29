// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./src/db/db.js"; // Make sure this path is correct
import authRoute from "./src/routes/auth.routes.js"
import courseRoute from "./src/routes/course.routes.js"
import lectureRoute from "./src/routes/lecture.routes.js"
import testRoute from "./src/routes/test.route.js"

// Load environment variables
dotenv.config({ path: "./.env" });

// Initialize Express app
const app = express();
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/seed-images", express.static("public/seed-images"));

// Example route (you can remove or add your routes here)
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api",authRoute);
app.use("/api",courseRoute);
app.use("/api",lectureRoute);
app.use("/api",testRoute);

// Connect to DB and start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });
