import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import LearningSidebar from "../../components/studentComponents/LearningSidebar";

const getYoutubeId = (url) => {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^"&?/\s]{11})/,
  );

  return match ? match[1] : null;
};

const LearnCourse = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await api.get(`/enroll/my-courses/${courseId}`);
        setCourse(courseRes.data.course);
        setProgress(courseRes.data.progress || 0);

        const lessonsRes = await api.get(`/courses/${courseId}/lessons`);
        setLessons(lessonsRes.data);

        const active = lessonsRes.data.find((l) => l._id === lessonId);
        setCurrentLesson(active);
      } catch (err) {
        console.error(err);
        navigate("/student/my-courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, lessonId, navigate]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!currentLesson) return <p className="p-6">Lesson not found</p>;

  return (
    <div className="h-screen flex bg-gray-50">
      {/* LEFT SIDEBAR */}
      <LearningSidebar
        lessons={lessons}
        activeLessonId={lessonId}
        progress={progress}
        onLessonClick={(id) => navigate(`/student/learn/${courseId}/${id}`)}
      />

      {/* RIGHT CONTENT */}
      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* VIDEO */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow">
          <iframe
            src={`https://www.youtube.com/embed/${getYoutubeId(
              currentLesson.youtubeUrl,
            )}`}
            title={currentLesson.title}
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {course.title}
        </h1>

        <h2 className="text-2xl font-bold">{currentLesson.title}</h2>

        {/* DESCRIPTION */}
        {currentLesson.description && (
          <p className="text-gray-600 max-w-3xl">{currentLesson.description}</p>
        )}

        {/* MARK AS READ */}
        <div className="pt-4">
          <button
            onClick={() => setCompleted(!completed)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              completed
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {completed ? "Marked as Read ✓" : "Mark as Read"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default LearnCourse;
