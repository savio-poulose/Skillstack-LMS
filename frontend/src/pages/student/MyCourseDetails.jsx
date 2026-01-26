import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

import StudentSidebar from "../../components/studentComponents/StudentSidebar";
import StudentHeader from "../../components/studentComponents/StudentHeader";

const MyCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]); // ✅ FIXED
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // enrolled course
        const courseRes = await api.get(`/enroll/my-courses/${id}`);
        setCourse(courseRes.data.course);

        // lessons
        const lessonsRes = await api.get(`/courses/${id}/lessons`);
        setLessons(lessonsRes.data);
      } catch (err) {
        console.error(err);
        navigate("/student/my-courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!course) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar />

      <div className="flex flex-col flex-1 bg-gray-50">
        <StudentHeader />

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* THUMBNAIL */}
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full max-h-[300px] object-cover rounded-lg shadow"
            />
          )}

          {/* COURSE INFO */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600 max-w-3xl">
              {course.description}
            </p>
          </div>

          {/* BRAND MESSAGE */}
          <div className="bg-white border rounded-lg p-6 shadow-sm max-w-3xl">
            <h2 className="text-xl font-semibold mb-3">
              You’re building more than skills here
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Learning alone is hard. Feeling lost is normal.
              <br /><br />
              Think of SkillStack as the brother you never had —
              the one who pushes you when you’re stuck,
              explains things without judging,
              and reminds you why you started.
              <br /><br />
              No shortcuts. Just real skills, built step by step.
            </p>
          </div>

          {/* LESSON LIST */}
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold mb-3">Lessons</h2>

            {lessons.length === 0 ? (
              <p className="text-gray-500">No lessons available yet.</p>
            ) : (
              <ul className="space-y-2">
                {lessons.map((lesson, index) => (
                  <li
                    key={lesson._id}
                    className="bg-white border rounded-lg p-4 flex gap-3"
                  >
                    <span className="text-sm text-gray-500 font-semibold">
                      {index + 1}.
                    </span>
                    <span className="font-medium">
                      {lesson.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={() => console.log("Start learning")}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Learning
          </button>
        </main>
      </div>
    </div>
  );
};

export default MyCourseDetail;
