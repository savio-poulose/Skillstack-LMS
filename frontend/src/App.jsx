import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

// dashboards
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";

import CourseDetail from "./pages/student/CourseDetails";
import MyCourses from "./pages/student/MyCourses";
import StudentProfile from "./pages/student/StudentProfile";

import CreateCourse from "./pages/teacher/CreateCourse";
import CourseEditor from "./pages/teacher/CourseEditor";
import TeacherCourses from "./pages/teacher/MyCourses";
import TeacherProfile from "./pages/teacher/TeacherProfile"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* DEFAULT ROUTE → LANDS ON LANDING PAGE */}
        <Route path="/" element={<Navigate to="/landing" />} />

        {/* Landing Page */}
        <Route path="/landing" element={<Landing />} />

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
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
          path="/student/my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
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
              <TeacherProfile/>
            </ProtectedRoute>
          }
        />

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
