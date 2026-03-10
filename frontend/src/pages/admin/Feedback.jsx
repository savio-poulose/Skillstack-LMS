import { useEffect, useState } from "react";
import api from "../../api";
import AdminSidebar from "../../components/adminComponents/AdminSidebar";
import AdminHeader from "../../components/adminComponents/AdminHeader";

export default function Feedback() {
  const [user, setUser] = useState(null);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get("/admin/feedback");
        setFeedback(res.data);
        console.log(res.data)
      } catch (error) {
        console.error("Error fetching feedback", error);
      }
    };

    fetchFeedback();
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

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <AdminHeader user={user} />
        <main>
          <div className="p-6 overflow-auto">
            <h1 className="text-2xl font-bold mb-4">Course Feedback</h1>

            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Course</th>
                  <th className="p-3 text-left">Rating</th>
                  <th className="p-3 text-left">Comment</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {feedback.map((f) => (
                  <tr key={f._id} className="border-b">
                    <td className="p-3">{f.user?.name}</td>
                    <td className="p-3">{f.course?.title}</td>
                    <td className="p-3">⭐ {f.rating}</td>
                    <td className="p-3">{f.comment}</td>
                    <td className="p-3">
                      {new Date(f.createdAt).toLocaleDateString()}
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
}
