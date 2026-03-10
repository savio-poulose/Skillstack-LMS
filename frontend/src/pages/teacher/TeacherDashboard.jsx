import { useEffect, useState } from "react";
import api from "../../api";

import TeacherSidebar from "../../components/teacherComponents/TeacherSidebar";
import TeacherHeader from "../../components/teacherComponents/TeacherHeader";

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [loading, setLoading] = useState(true);
   const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    totalSales: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      await fetchUser();
      await fetchTeacherCourses();
    };

    loadData();
  }, []);

  // fetch teacher
  const fetchUser = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (error) {
      console.error("User fetch error:", error);
    }
  };

  // fetch courses
  const fetchTeacherCourses = async () => {
    try {
      const res = await api.get("/courses/teacher");
      const coursesData = res.data || [];

      setCourses(coursesData);

      // fetch enrollments separately
      const enrollRes = await api.get("/teacher/enrollments");
      console.log(enrollRes)

      const enrollments = enrollRes.data || [];
      // console.log(enrollments)

      setTotalEnrollments(enrollments.length);

      const recent = enrollments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map((en) => ({
          student: en.student?.name || "Student",
          course: en.course?.title || "Course",
          date: en.createdAt,
        }));

      setRecentEnrollments(recent);
    } catch (error) {
      console.error("Dashboard error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      const fetchWalletData = async () => {
        try {
          const earningsRes = await api.get("/teacher/earnings");
          setEarnings(earningsRes.data);
        } catch (error) {
          console.error("Teacher wallet fetch error", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchWalletData();
    }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <TeacherHeader user={user} />

        <main className="flex-1 overflow-y-auto p-6">
          {/* STATS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-sm p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Courses</p>
              <h2 className="text-3xl font-bold mt-2">{courses.length}</h2>
            </div>

            <div className="bg-white rounded-sm p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Enrollments</p>
              <h2 className="text-3xl font-bold mt-2">{totalEnrollments}</h2>
            </div>

            <div className="bg-white rounded-sm p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Earnings</p>
              <h2 className="text-3xl text-green-600 font-bold mt-2">₹{earnings.totalEarnings}</h2>
            </div>
          </div>

          {/* RECENT ENROLLMENTS */}

          <div className="bg-white rounded-sm shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Recent Enrollments</h3>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <p className="p-6 text-gray-500">Loading enrollments...</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-6 py-3">Student</th>
                      <th className="text-left px-6 py-3">Course</th>
                      <th className="text-left px-6 py-3">Enrolled On</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentEnrollments.length > 0 ? (
                      recentEnrollments.map((en, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-6 py-4">{en.student}</td>
                          <td className="px-6 py-4">{en.course}</td>
                          <td className="px-6 py-4">
                            {new Date(en.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-6 text-gray-500"
                        >
                          No enrollments yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
