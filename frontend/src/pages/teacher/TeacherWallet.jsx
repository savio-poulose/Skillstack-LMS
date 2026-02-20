import { useEffect, useState } from "react";
import api from "../../api";
import TeacherHeader from "../../components/teacherComponents/TeacherHeader";
import TeacherSidebar from "../../components/teacherComponents/TeacherSidebar";

export default function TeacherWallet() {
  const [user, setUser] = useState(null);
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    totalSales: 0,
  });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const userRes = await api.get("/users/me");
        setUser(userRes.data);

        const earningsRes = await api.get("/teacher/earnings");
        setEarnings(earningsRes.data);

        const paymentsRes = await api.get("/teacher/payments");
        setPayments(paymentsRes.data);
      } catch (error) {
        console.error("Teacher wallet fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <TeacherHeader user={user} />

        <main className="p-6 space-y-8">

          {/* Wallet Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 shadow-sm rounded">
              <p className="text-sm text-gray-500">Total Earnings</p>
              <h2 className="text-3xl font-bold text-green-600 mt-2">
                ₹{earnings.totalEarnings}
              </h2>
            </div>

            <div className="bg-white p-6 shadow-sm rounded">
              <p className="text-sm text-gray-500">Total Sales</p>
              <h2 className="text-3xl font-bold mt-2">
                {earnings.totalSales}
              </h2>
            </div>
          </div>

          {/* Payment Report */}
          <div className="bg-white shadow-sm rounded">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Your Sales</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3">Student</th>
                    <th className="text-left px-6 py-3">Course</th>
                    <th className="text-left px-6 py-3">Earned</th>
                    <th className="text-left px-6 py-3">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No sales yet
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment._id} className="border-t">
                        <td className="px-6 py-4">
                          {payment.student?.name}
                        </td>
                        <td className="px-6 py-4">
                          {payment.course?.title}
                        </td>
                        <td className="px-6 py-4 text-green-600 font-medium">
                          ₹{payment.teacherAmount}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(payment.createdAt).toLocaleDateString()}
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