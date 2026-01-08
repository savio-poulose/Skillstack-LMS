import { useEffect, useState } from "react";
import api from "../../api";

import StudentSidebar from "../../components/studentComponents/StudentSidebar";
import StudentHeader from "../../components/studentComponents/StudentHeader";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/enroll/my-courses");

        // attach progress to course
        const enrolledCourses = res.data
          .filter((enrollment) => enrollment.course)
          .map((enrollment) => ({
            ...enrollment.course,
            progress: enrollment.progress,
          }));

        setCourses(enrolledCourses);
      } catch (error) {
        console.error("Failed to fetch my courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR (same as dashboard) */}
      <StudentSidebar />

      {/* MAIN */}
      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        {/* HEADER (same as dashboard) */}
        <div className="shrink-0">
          <StudentHeader />
        </div>

        {/* CONTENT (same main wrapper as dashboard) */}
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">My Enrollments</h1>

          {loading ? (
            <div className="text-center text-gray-500">
              Loading your courses...
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center text-gray-500">
              You haven’t enrolled in any courses yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white border border-gray-200 rounded-lg
                             shadow-sm hover:shadow-md transition-all"
                >
                  {/* IMAGE */}
                  <div className="h-40 w-full overflow-hidden rounded-t-lg">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 space-y-4">
                    {/* COURSE NAME */}
                    <h3 className="font-semibold text-[15px] text-gray-900">
                      {course.title}
                    </h3>

                    {/* PROGRESS */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{course.progress ?? 0}%</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${course.progress ?? 0}%` }}
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
