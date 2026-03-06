import { useEffect, useState } from "react";
import api from "../../api";
import AdminSidebar from "../../components/adminComponents/AdminSidebar";
import AdminHeader from "../../components/adminComponents/AdminHeader";

export default function AdminWallet() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalTeacherPayout: 0,
    totalAdminCommission: 0,
    totalSales: 0,
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminWallet = async () => {
      try {
        const userRes = await api.get("/users/me");
        setUser(userRes.data);

        const summaryRes = await api.get("/admin/wallet-summary");
        setSummary(summaryRes.data);

        const teacherRes = await api.get("/admin/teacher-earnings");
        setTeachers(teacherRes.data);
      } catch (error) {
        console.error("Admin wallet fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminWallet();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me"); 
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching teacher", error);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <AdminHeader user={user} />

        <main className="p-6 space-y-8">

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 shadow-sm rounded">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h2 className="text-2xl font-bold text-blue-600 mt-2">
                ₹{summary.totalPlatformRevenue}
              </h2>
            </div>

            <div className="bg-white p-6 shadow-sm rounded">
              <p className="text-sm text-gray-500">Teacher Payout</p>
              <h2 className="text-2xl font-bold text-green-600 mt-2">
                ₹{summary.totalTeacherPayout}
              </h2>
            </div>

            <div className="bg-white p-6 shadow-sm rounded">
              <p className="text-sm text-gray-500">Admin Commission</p>
              <h2 className="text-2xl font-bold text-purple-600 mt-2">
                ₹{summary.totalAdminCommission}
              </h2>
            </div>

            <div className="bg-white p-6 shadow-sm rounded">
              <p className="text-sm text-gray-500">Total Sales</p>
              <h2 className="text-2xl font-bold mt-2">
                {summary.totalTransactions}
              </h2>
            </div>
          </div>

          {/* Teacher Earnings Table */}
          <div className="bg-white shadow-sm rounded">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">
                Teacher Earnings Overview
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3">Teacher</th>
                    <th className="text-left px-6 py-3">Email</th>
                    <th className="text-left px-6 py-3">Sales</th>
                    <th className="text-left px-6 py-3">Earned</th>
                  </tr>
                </thead>

                <tbody>
                  {teachers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No teacher earnings yet
                      </td>
                    </tr>
                  ) : (
                    teachers.map((teacher) => (
                      <tr key={teacher.teacherId} className="border-t">
                        <td className="px-6 py-4 font-medium">
                          {teacher.name}
                        </td>
                        <td className="px-6 py-4">
                          {teacher.email}
                        </td>
                        <td className="px-6 py-4">
                          {teacher.totalSales}
                        </td>
                        <td className="px-6 py-4 text-green-600 font-medium">
                          ₹{teacher.totalEarned}
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