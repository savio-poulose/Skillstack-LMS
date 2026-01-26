import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

import StudentSidebar from "../../components/studentComponents/StudentSidebar";
import StudentHeader from "../../components/studentComponents/StudentHeader";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/enroll/my-courses");

        const enrolledCourses = res.data
          .filter((e) => e.course)
          .map((e) => ({
            ...e.course,
            progress: e.progress ?? 0,
          }));

        setCourses(enrolledCourses);
      } catch (err) {
        console.error("Failed to fetch my courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar />

      <div className="flex flex-col flex-1 bg-gray-50">
        <StudentHeader />

        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">My Courses</h1>

          {loading ? (
            <p>Loading...</p>
          ) : courses.length === 0 ? (
            <p>No enrollments</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() =>
                    navigate(`/student/my-courses/${course._id}`)
                  }
                  className="cursor-pointer bg-white border rounded-lg hover:shadow-md"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-40 w-full object-cover rounded-t-lg"
                  />

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold">{course.title}</h3>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded">
                        <div  
                          className="h-2 bg-blue-600 rounded"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyCourses;
