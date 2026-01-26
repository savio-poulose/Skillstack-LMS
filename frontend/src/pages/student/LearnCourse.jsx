import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

const LearnCourse = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const lessonsRes = await api.get(`/lessons/course/${courseId}`);
      const progressRes = await api.get(`/progress/${courseId}`);

      setLessons(lessonsRes.data);
      setCompleted(progressRes.data?.completedLessons || []);

      const lesson =
        lessonsRes.data.find((l) => l._id === lessonId) ||
        lessonsRes.data[0];

      setCurrentLesson(lesson);
    };

    fetchData();
  }, [courseId, lessonId]);

  const markComplete = async () => {
    await api.post("/progress/complete", {
      courseId,
      lessonId: currentLesson._id,
    });

    const currentIndex = lessons.findIndex(
      (l) => l._id === currentLesson._id
    );

    const nextLesson = lessons[currentIndex + 1];

    if (nextLesson) {
      navigate(`/learn/${courseId}/${nextLesson._id}`);
    }
  };

  if (!currentLesson) return <p>Loading...</p>;

  return (
    <div className="flex h-screen">
      {/* LEFT SIDEBAR */}
      <div className="w-64 border-r p-4 space-y-2">
        {lessons.map((l) => (
          <div
            key={l._id}
            onClick={() => navigate(`/learn/${courseId}/${l._id}`)}
            className={`cursor-pointer p-2 rounded ${
              l._id === currentLesson._id
                ? "bg-blue-100"
                : ""
            }`}
          >
            {l.title}
            {completed.includes(l._id) && " ✔"}
          </div>
        ))}
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-6 space-y-4">
        <h1 className="text-2xl font-bold">
          {currentLesson.title}
        </h1>

        {currentLesson.videoUrl && (
          <video
            controls
            src={currentLesson.videoUrl}
            className="w-full rounded"
          />
        )}

        <p>{currentLesson.content}</p>

        <button
          onClick={markComplete}
          className="px-5 py-2 bg-green-600 text-white rounded"
        >
          Mark as Complete
        </button>
      </div>
    </div>
  );
};

export default LearnCourse;
