import { useEffect, useState } from "react";
import api from "../../api";
import AdminSidebar from "../../components/adminComponents/AdminSidebar";
import AdminHeader from "../../components/adminComponents/AdminHeader";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    pendingApprovals: 0,
    totalCourses: 0,
    recentTeachers: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard-stats");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-6">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-sm p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Teachers</p>
              <h2 className="text-3xl font-bold mt-2">
                {stats.totalTeachers}
              </h2>
            </div>

            <div className="bg-white rounded-sm p-6 shadow-sm">
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <h2 className="text-3xl font-bold mt-2 text-yellow-600">
                {stats.pendingApprovals}
              </h2>
            </div>

            <div className="bg-white rounded-sm p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Courses</p>
              <h2 className="text-3xl font-bold mt-2">
                {stats.totalCourses}
              </h2>
            </div>
          </div>

          {/* RECENT TEACHERS */}
          <div className="bg-white rounded-sm shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">
                Recent Teacher Registrations
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3">Name</th>
                    <th className="text-left px-6 py-3">Email</th>
                    <th className="text-left px-6 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {stats.recentTeachers.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                        No teachers found
                      </td>
                    </tr>
                  ) : (
                    stats.recentTeachers.map((teacher) => (
                      <tr key={teacher._id} className="border-t">
                        <td className="px-6 py-4">{teacher.name}</td>
                        <td className="px-6 py-4">{teacher.email}</td>
                        <td
                          className={`px-6 py-4 font-medium ${
                            teacher.isApproved
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {teacher.isApproved ? "Approved" : "Pending"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}