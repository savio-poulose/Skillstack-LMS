import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

import StudentSidebar from "../../components/studentComponents/StudentSidebar";
import StudentHeader from "../../components/studentComponents/StudentHeader";

const MyCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [quizId, setQuizId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // enrolled course + progress
        const courseRes = await api.get(`/enroll/my-courses/${id}`);
        setCourse(courseRes.data.course);
        setProgress(courseRes.data.progress || 0);

        // lessons
        const lessonsRes = await api.get(`/courses/${id}/lessons`);
        setLessons(lessonsRes.data);

        // check if quiz exists for this course
        try {
          const quizRes = await api.get(`/courses/${id}/quiz`);
          if (quizRes.data?._id) setQuizId(quizRes.data._id);
        } catch {
          // no quiz yet — that's fine
        }
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

  const isCourseCompleted = progress >= 100;

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
            <p className="text-gray-600 max-w-3xl">{course.description}</p>
          </div>

          {/* QUIZ UNLOCKED BANNER */}
          {isCourseCompleted && quizId && (
            <div className="max-w-3xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <p className="text-green-800 font-bold text-lg mb-0.5">
                  🎉 Course Complete! Quiz Unlocked
                </p>
                <p className="text-green-600 text-sm">
                  You've finished all lessons. Test your knowledge now!
                </p>
              </div>
              <button
                onClick={() => navigate(`/student/quiz/${quizId}`)}
                className="flex-shrink-0 px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm"
              >
                Take Quiz →
              </button>
            </div>
          )}

          {/* PROGRESS BAR */}
          <div className="max-w-3xl">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Course Progress</span>
              <span className="font-semibold text-gray-700">{progress}%</span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* BRAND MESSAGE */}
          <div className="bg-white border rounded-lg p-6 shadow-sm max-w-3xl">
            <h2 className="text-xl font-semibold mb-3">
              You're building more than skills here
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Learning alone is hard. Feeling lost is normal.
              <br /><br />
              Think of SkillStack as the brother you never had —
              the one who pushes you when you're stuck,
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
                    <span className="font-medium">{lesson.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              if (lessons.length > 0) {
                navigate(`/student/learn/${id}/${lessons[0]._id}`);
              }
            }}
            disabled={lessons.length === 0}
            className={`px-8 py-3 rounded-lg font-semibold transition ${lessons.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Start Learning
          </button>
        </main>
      </div>
    </div>
  );
};

export default MyCourseDetail;
