import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";

import TeacherSidebar from "../../components/teacherComponents/TeacherSidebar";
import TeacherHeader from "../../components/teacherComponents/TeacherHeader";

const CourseEditor = () => {
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // create mode
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    youtubeUrl: "",
    description: "",
  });

  // 🔹 FETCH LESSONS
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await api.get(`/courses/${courseId}/lessons`);
        setLessons(res.data);

        if (res.data.length > 0) {
          setSelectedLesson(res.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch lessons", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  // 🔹 CREATE LESSON
  const handleCreateLesson = async () => {
    if (!formData.title || !formData.youtubeUrl) {
      alert("Title and YouTube URL are required");
      return;
    }

    try {
      const res = await api.post(
        `/courses/${courseId}/lessons`,
        formData
      );

      setLessons((prev) => [...prev, res.data]);
      setSelectedLesson(res.data);

      setFormData({ title: "", youtubeUrl: "", description: "" });
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create lesson", error);
      alert("Failed to create lesson");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <TeacherHeader />

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT PANEL */}
          <aside className="w-80 bg-white border-r overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Course Content</h2>
              <p className="text-sm text-gray-500">
                {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="p-4">
              <button
                onClick={() => {
                  setIsCreating(true);
                  setSelectedLesson(null);
                }}
                className="w-full py-2 text-sm rounded-lg border border-dashed hover:bg-gray-50"
              >
                + Add Lesson
              </button>
            </div>

            <ul className="px-4 pb-4 space-y-2 text-sm">
              {loading && (
                <p className="text-gray-500">Loading lessons...</p>
              )}

              {!loading && lessons.length === 0 && (
                <p className="text-gray-500">No lessons yet</p>
              )}

              {lessons.map((lesson, index) => (
                <li
                  key={lesson._id}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setIsCreating(false);
                  }}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    selectedLesson?._id === lesson._id
                      ? "bg-gray-100 font-medium"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {index + 1}. {lesson.title}
                </li>
              ))}
            </ul>
          </aside>

          {/* RIGHT PANEL */}
          <main className="flex-1 p-6 overflow-y-auto">
            {/* CREATE MODE */}
            {isCreating && (
              <div className="max-w-3xl space-y-6">
                <h2 className="text-xl font-semibold">Add New Lesson</h2>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    value={formData.youtubeUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        youtubeUrl: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCreateLesson}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Save Lesson
                  </button>

                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* EMPTY STATE */}
            {!isCreating && !selectedLesson && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Select or create a lesson
                  </h3>
                  <p className="text-sm text-gray-500">
                    Choose a lesson from the left panel
                  </p>
                </div>
              </div>
            )}

            {/* VIEW MODE */}
            {!isCreating && selectedLesson && (
              <div className="max-w-3xl space-y-6">
                <h2 className="text-xl font-semibold">
                  {selectedLesson.title}
                </h2>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    YouTube Video URL
                  </label>
                  <input
                    type="text"
                    value={selectedLesson.youtubeUrl}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    value={selectedLesson.description || ""}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
