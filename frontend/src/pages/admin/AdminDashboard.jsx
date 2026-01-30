import AdminSidebar from "../../components/adminComponents/AdminSidebar";
import AdminHeader from "../../components/adminComponents/AdminHeader"

export default function AdminDashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <div className="shrink-0">
          {/* <AdminHeader /> */}
          <AdminHeader/>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-sm p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Teachers</p>
              <h2 className="text-3xl font-bold mt-2">5</h2>
            </div>

            <div className="bg-white rounded-sm p-6 shadow-sm">
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <h2 className="text-3xl font-bold mt-2">2</h2>
            </div>

            <div className="bg-white rounded-sm p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Courses</p>
              <h2 className="text-3xl font-bold mt-2">12</h2>
            </div>
          </div>

          {/* RECENT TEACHERS */}
          <div className="bg-white rounded-sm shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Recent Teacher Registrations</h3>
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
                  <tr className="border-t">
                    <td className="px-6 py-4">Akhil</td>
                    <td className="px-6 py-4">akhil@gmail.com</td>
                    <td className="px-6 py-4 text-yellow-600 font-medium">
                      Pending
                    </td>
                  </tr>

                  <tr className="border-t">
                    <td className="px-6 py-4">Anu</td>
                    <td className="px-6 py-4">anu@gmail.com</td>
                    <td className="px-6 py-4 text-green-600 font-medium">
                      Approved
                    </td>
                  </tr>

                  <tr className="border-t">
                    <td className="px-6 py-4">Rahul</td>
                    <td className="px-6 py-4">rahul@gmail.com</td>
                    <td className="px-6 py-4 text-green-600 font-medium">
                      Approved
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
