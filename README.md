# LearnSphere

A comprehensive e-learning platform that connects students and educators, enabling seamless course creation, enrollment, and learning experiences.

## 📚 Overview

LearnSphere is a full-stack learning management system (LMS) that provides a platform for educators to create and manage courses, and for students to discover, enroll, and learn from these courses. The platform includes features like OTP-based authentication, course management, lecture videos, quizzes/tests, and student progress tracking.

## ✨ Features

### For Students
- 🔐 **Secure Authentication**: OTP-based login and registration via email/SMS
- 🔍 **Course Discovery**: Browse and search courses by category, instructor, or keywords
- 📖 **Course Enrollment**: Enroll in courses and track progress
- 🎥 **Video Lectures**: Watch course lectures with integrated video player
- 📝 **Tests & Quizzes**: Take tests and quizzes to assess learning
- 👤 **Profile Management**: Edit profile, add skills, and manage personal information
- 📊 **My Enrollments**: Track all enrolled courses in one place
- ⭐ **Ratings & Reviews**: Rate and review courses

### For Educators
- 🎓 **Course Management**: Create, edit, and publish courses
- 📹 **Lecture Management**: Add and manage video lectures for courses
- 📋 **Test Creation**: Create quizzes and tests for students
- 👥 **Student Analytics**: View enrolled students and their progress
- 📈 **Dashboard**: Comprehensive dashboard with course statistics
- 🖼️ **Media Upload**: Upload course thumbnails and lecture videos via Cloudinary

### General Features
- 🔒 **Role-Based Access Control**: Separate interfaces for students and educators
- 📧 **Email Notifications**: OTP verification and password reset via email
- 📱 **SMS Notifications**: OTP verification via Twilio
- 🎨 **Modern UI**: Built with Tailwind CSS and Framer Motion
- 🔄 **State Management**: Redux Toolkit for efficient state management
- 🛡️ **Protected Routes**: Secure route protection based on user roles

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **React YouTube** - YouTube video integration

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Media storage
- **Nodemailer** - Email service
- **Twilio** - SMS service
- **Cookie Parser** - Cookie handling

## 📁 Project Structure

```
LearnSphere/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── auth/          # Authentication components
│   │   │   │   ├── student/       # Student-facing pages
│   │   │   │   └── educator/      # Educator-facing pages
│   │   │   └── context/           # React context
│   │   ├── Redux/                 # Redux store and slices
│   │   │   ├── api/               # API slices
│   │   │   └── slices/            # Redux slices
│   │   ├── App.jsx
│   │   ├── PageRoutes.jsx         # Route configuration
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── controllers/           # Route controllers
│   │   ├── models/                # Mongoose models
│   │   ├── routes/                # API routes
│   │   ├── middlewares/           # Custom middlewares
│   │   ├── utils/                 # Utility functions
│   │   └── db/                    # Database connection
│   ├── server.js                  # Entry point
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LearnSphere
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Server
PORT=3000
CORS_ORIGIN=http://localhost:5173

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary (for media uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Twilio (for SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Running the Application

1. **Start the MongoDB server** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:3000`

3. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/logout` - Logout user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create a new course (Educator only)
- `PUT /api/courses/:id` - Update course (Educator only)
- `DELETE /api/courses/:id` - Delete course (Educator only)
- `POST /api/courses/:id/enroll` - Enroll in a course

### Lectures
- `GET /api/lectures/:courseId` - Get lectures for a course
- `POST /api/lectures` - Create a new lecture (Educator only)
- `PUT /api/lectures/:id` - Update lecture (Educator only)
- `DELETE /api/lectures/:id` - Delete lecture (Educator only)

### Tests
- `GET /api/tests/:courseId` - Get tests for a course
- `POST /api/tests` - Create a new test (Educator only)
- `POST /api/tests/:id/submit` - Submit test answers

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/enrolled-courses` - Get enrolled courses

## 👥 User Roles

- **User (Student)**: Can browse, enroll, and learn from courses
- **Instructor (Educator)**: Can create and manage courses, lectures, and tests
- **Admin**: Full access to all features

## 🎯 Key Features Implementation

- **OTP Authentication**: Secure two-factor authentication via email and SMS
- **File Upload**: Course thumbnails and lecture videos stored on Cloudinary
- **JWT Tokens**: Secure authentication with access and refresh tokens
- **Protected Routes**: Role-based route protection on both frontend and backend
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## 📝 Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server
- `npm run dev` - Start development server with nodemon
- `npm run build` - Install dependencies

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Bhupendra Singh**

---

Made with ❤️ for the learning community