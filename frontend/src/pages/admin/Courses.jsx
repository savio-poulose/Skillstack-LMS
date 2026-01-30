import { useEffect, useState } from "react";
import api from "../../api";
import AdminSidebar from "../../components/adminComponents/AdminSidebar";
import AdminHeader from "../../components/adminComponents/AdminHeader"
const Courses = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
  try {
    const res = await api.get("/admin/courses");
    setCourses(res.data);
  } catch (error) {
    console.error("FETCH COURSES ERROR:", error.response?.data || error.message);
  }
};


  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleCourse = async (id, isActive) => {
    await api.patch(`/admin/courses/${id}`, { isActive });
    fetchCourses();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-col flex-1 bg-gray-50">
        <AdminHeader title="Courses" />

        <main className="p-6">
          <div className="bg-white shadow-sm rounded-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Course</th>
                  <th className="px-6 py-3 text-left">Teacher</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="px-6 py-4">{c.title}</td>
                    <td className="px-6 py-4">
                      {c.teacher?.name}
                    </td>
                    <td className="px-6 py-4">
                      {c.isActive ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Disabled</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {c.isActive ? (
                        <button
                          onClick={() => toggleCourse(c._id, false)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded"
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleCourse(c._id, true)}
                          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded"
                        >
                          Enable
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Courses;
