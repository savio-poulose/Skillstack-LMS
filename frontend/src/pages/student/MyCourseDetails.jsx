import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";

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

  // Feedback states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Get enrolled course + progress
        const courseRes = await api.get(`/enroll/my-courses/${id}`);
        setCourse(courseRes.data.course);
        setProgress(courseRes.data.progress || 0);

        // 2️⃣ Get lessons
        const lessonsRes = await api.get(`/courses/${id}/lessons`);
        setLessons(lessonsRes.data);

        // 3️⃣ Check quiz (optional)
        try {
          const quizRes = await api.get(`/courses/${id}/quiz`);
          if (quizRes.data?._id) {
            setQuizId(quizRes.data._id);
          }
        } catch {
          // quiz not created yet — ignore
        }

        // 4️⃣ Check if feedback already submitted
        try {
          const feedbackCheck = await api.get(`/feedback/my/${id}`);
          setHasSubmittedFeedback(feedbackCheck.data.submitted);
        } catch {
          // ignore feedback check error
        }

      } catch (err) {
        console.error("MyCourseDetail error:", err);
        navigate("/student/my-courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const isCourseCompleted = progress >= 100;

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/feedback", {
        courseId: id,
        rating,
        comment,
      });

      toast.success("Feedback submitted successfully");
      setHasSubmittedFeedback(true);
      setShowFeedbackModal(false);

    } catch (error) {
      const msg = error.response?.data?.message || "Submission failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

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
            <p className="text-gray-600 max-w-3xl">{course.description}</p>
          </div>

          {/* QUIZ UNLOCK */}
          {isCourseCompleted && quizId && (
            <div className="max-w-3xl bg-green-50 border border-green-200 rounded-xl p-6 flex justify-between items-center">
              <div>
                <p className="text-green-800 font-bold text-lg">
                  🎉 Course Complete! Quiz Unlocked
                </p>
                <p className="text-green-600 text-sm">
                  You've finished all lessons. Test your knowledge now!
                </p>
              </div>
              <button
                onClick={() => navigate(`/student/quiz/${quizId}`)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg"
              >
                Take Quiz →
              </button>
            </div>
          )}

          {/* FEEDBACK BUTTON */}
          {isCourseCompleted && !hasSubmittedFeedback && (
            <div className="max-w-3xl">
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                ⭐ Give Feedback
              </button>
            </div>
          )}

          {hasSubmittedFeedback && (
            <p className="text-green-600 font-medium">
              You have already submitted feedback.
            </p>
          )}

          {/* PROGRESS */}
          <div className="max-w-3xl">
            <div className="flex justify-between text-sm mb-1">
              <span>Course Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* LESSONS */}
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

        </main>
      </div>

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">Rate this course</h2>

            <div className="flex space-x-2 text-3xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={star <= rating ? "text-yellow-400" : "text-gray-300"}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              rows="4"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded-lg p-3"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitFeedback}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourseDetail;