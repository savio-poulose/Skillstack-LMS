import { useEffect, useState } from "react";
import api from "../../api";
import AdminSidebar from "../../components/adminComponents/AdminSidebar";
import AdminHeader from "../../components/adminComponents/AdminHeader";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/admin/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const updateStatus = async (id, isApproved) => {
    try {
      await api.patch(`/admin/teachers/${id}`, { isApproved });
      fetchTeachers(); // refresh list
    } catch (err) {
      console.error("Failed to update teacher", err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <AdminHeader title="Teachers" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-sm shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Teachers</h3>
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
                    {teachers.map((t) => (
                      <tr key={t._id} className="border-t">
                        <td className="px-6 py-4">{t.name}</td>
                        <td className="px-6 py-4">{t.email}</td>
                        <td className="px-6 py-4">
                          {t.isApproved ? (
                            <span className="text-green-600 font-medium">
                              Approved
                            </span>
                          ) : (
                            <span className="text-yellow-600 font-medium">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {t.isApproved ? (
                            <button
                              onClick={() => updateStatus(t._id, false)}
                              className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              onClick={() => updateStatus(t._id, true)}
                              className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200"
                            >
                              Approve
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

export default Teachers;
