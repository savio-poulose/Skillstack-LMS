import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

import TeacherSidebar from "../../components/teacherComponents/TeacherSidebar";
import TeacherHeader from "../../components/teacherComponents/TeacherHeader";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/courses/teacher");
        setCourses(res.data);
        
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <TeacherHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold mb-6">My Courses</h1>

          {loading && (
            <p className="text-gray-500">Loading courses...</p>
          )}

          {!loading && courses.length === 0 && (
            <p className="text-gray-500">
              You haven’t created any courses yet.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white border rounded-lg shadow-sm p-4"
              >
                <h3 className="text-lg font-semibold mb-1">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  Status:{" "}
                  <span className="font-medium">
                    {course.status}
                  </span>
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  Lessons: {course.totalLessons}
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/teacher/courses/${course._id}/editor`
                    )
                  }
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit course
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
