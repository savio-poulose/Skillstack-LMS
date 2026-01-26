import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Landing from "./pages/Landing";

import ProtectedRoute from "./components/ProtectedRoute";

// student
import StudentDashboard from "./pages/student/StudentDashboard";
import CourseDetail from "./pages/student/CourseDetails";
import MyCourses from "./pages/student/MyCourses";
import MyCourseDetail from "./pages/student/MyCourseDetails";
import StudentProfile from "./pages/student/StudentProfile";
import PaymentPage from "./pages/student/Payment";
import LearnCourse from "./pages/student/LearnCourse";


// teacher
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateCourse from "./pages/teacher/CreateCourse";
import CourseEditor from "./pages/teacher/CourseEditor";
import TeacherCourses from "./pages/teacher/MyCourses";
import TeacherProfile from "./pages/teacher/TeacherProfile";

// admin
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* STUDENT */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/course/:id"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/course/:id/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-courses/:id"
          element={
            <ProtectedRoute>
              <MyCourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
  path="/student/learn/:courseId/:lessonId"
  element={
    <ProtectedRoute>
      <LearnCourse />
    </ProtectedRoute>
  }
/>


        <Route
          path="/student/profile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        {/* TEACHER */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/create-courses"
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/courses/:courseId/editor"
          element={
            <ProtectedRoute>
              <CourseEditor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/my-courses"
          element={
            <ProtectedRoute>
              <TeacherCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute>
              <TeacherProfile />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
