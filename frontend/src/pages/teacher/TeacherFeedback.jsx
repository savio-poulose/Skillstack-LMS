import { useEffect, useState } from "react";
import api from "../../api";

import TeacherSidebar from "../../components/teacherComponents/TeacherSidebar";
import TeacherHeader from "../../components/teacherComponents/TeacherHeader";

export default function TeacherFeedback() {

  const [user, setUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch teacher user
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

  // Fetch feedbacks for teacher courses
useEffect(() => {
  const fetchFeedback = async () => {
    try {

      const userRes = await api.get("/users/me");
      const teacherId = userRes.data._id;

      setUser(userRes.data);

      const res = await api.get(`/teacher/feedback/${teacherId}`);
      // console.log("teacherid:"+teacherId)

      setFeedbacks(res.data);
      // console.log("Feedback:", res.data);

    } catch (error) {
      console.error("Error fetching feedback", error);
    } finally {
      setLoading(false);
    }
  };

  fetchFeedback();
}, []);

  return (
    <div className="flex h-screen overflow-hidden">

      <TeacherSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">

        <div className="shrink-0">
          <TeacherHeader user={user} />
        </div>

        <div className="p-6 overflow-auto">

          <h1 className="text-2xl font-bold mb-6">Course Feedback</h1>

          {loading ? (
            <p>Loading feedback...</p>
          ) : feedbacks.length === 0 ? (
            <p className="text-gray-500">No feedback yet.</p>
          ) : (

            <div className="bg-white shadow rounded-lg overflow-hidden">

              <table className="min-w-full text-sm">

                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-left">Course</th>
                    <th className="p-3 text-left">Rating</th>
                    <th className="p-3 text-left">Comment</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {feedbacks.map((fb) => (
                    <tr key={fb._id} className="border-t">

                      <td className="p-3">
                        {fb.user?.name || "Student"}
                      </td>

                      <td className="p-3">
                        {fb.course?.title}
                      </td>

                      <td className="p-3">
                        ⭐ {fb.rating}
                      </td>

                      <td className="p-3">
                        {fb.comment}
                      </td>

                      <td className="p-3">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          )}
        </div>
      </div>
    </div>
  );
}