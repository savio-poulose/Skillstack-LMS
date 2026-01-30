import { useEffect, useState } from "react";
import api from "../../api";
import AdminSidebar from "../../components/adminComponents/AdminSidebar";
import AdminHeader from "../../components/adminComponents/AdminHeader"

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/admin/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const updateStatus = async (id, isBlocked) => {
    try {
      await api.patch(`/admin/students/${id}`, { isBlocked });
      fetchStudents();
    } catch (err) {
      console.error("Failed to update student", err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <AdminHeader title="Students" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-sm shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Students</h3>
            </div>

            {loading ? (
              <p className="p-6 text-sm text-gray-500">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-6 py-3">Name</th>
                      <th className="text-left px-6 py-3">Email</th>
                      <th className="text-left px-6 py-3">Status</th>
                      <th className="text-left px-6 py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((s) => (
                      <tr key={s._id} className="border-t">
                        <td className="px-6 py-4">{s.name}</td>
                        <td className="px-6 py-4">{s.email}</td>
                        <td className="px-6 py-4">
                          {s.isBlocked ? (
                            <span className="text-red-600 font-medium">
                              Blocked
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {s.isBlocked ? (
                            <button
                              onClick={() => updateStatus(s._id, false)}
                              className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200"
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => updateStatus(s._id, true)}
                              className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              Block
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Students;
