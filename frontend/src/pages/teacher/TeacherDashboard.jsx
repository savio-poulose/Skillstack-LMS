import TeacherSidebar from "../../components/teacherComponents/TeacherSidebar";
import TeacherHeader from "../../components/teacherComponents/TeacherHeader";

export default function TeacherDashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <div className="shrink-0">
          <TeacherHeader />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-sm p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Courses</p>
              <h2 className="text-3xl font-bold mt-2">3</h2>
            </div>

            <div className="bg-white rounded-sm p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Enrollments</p>
              <h2 className="text-3xl font-bold mt-2">124</h2>
            </div>

            <div className="bg-white rounded-sm p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Earnings</p>
              <h2 className="text-3xl font-bold mt-2">₹0</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
          </div>

          {/* RECENT ENROLLMENTS */}
          <div className="bg-white rounded-sm shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Recent Enrollments</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3">Student</th>
                    <th className="text-left px-6 py-3">Course</th>
                    <th className="text-left px-6 py-3">Enrolled On</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-t">
                    <td className="px-6 py-4">Akhil</td>
                    <td className="px-6 py-4">MERN Bootcamp</td>
                    <td className="px-6 py-4">12 Jan 2026</td>
                  </tr>

                  <tr className="border-t">
                    <td className="px-6 py-4">Anu</td>
                    <td className="px-6 py-4">React Basics</td>
                    <td className="px-6 py-4">11 Jan 2026</td>
                  </tr>

                  <tr className="border-t">
                    <td className="px-6 py-4">Rahul</td>
                    <td className="px-6 py-4">JavaScript Mastery</td>
                    <td className="px-6 py-4">10 Jan 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm"></div>
        </main>
      </div>
    </div>
  );
}
