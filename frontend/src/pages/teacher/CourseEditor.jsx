import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";

import TeacherSidebar from "../../components/teacherComponents/TeacherSidebar";
import TeacherHeader from "../../components/teacherComponents/TeacherHeader";

const CourseEditor = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    youtubeUrl: "",
    description: "",
  });

  // PDF state
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // FETCH LESSONS
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await api.get(`/courses/${courseId}/lessons`);
        setLessons(res.data);
        if (res.data.length > 0) {
          setSelectedLesson(res.data[0]);
        }
      } catch {
        toast.error("Failed to load lessons");
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId]);

  // CREATE LESSON
  const handleCreateLesson = async () => {
    if (!formData.title || !formData.youtubeUrl) {
      toast.error("Title and YouTube URL are required");
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

      toast.success("Lesson created successfully");
    } catch {
      toast.error("Failed to create lesson");
    }
  };

  // UPDATE LESSON
  const handleUpdateLesson = async () => {
    try {
      const res = await api.put(
        `/lessons/${selectedLesson._id}`,
        formData
      );

      setLessons((prev) =>
        prev.map((l) =>
          l._id === res.data._id ? res.data : l
        )
      );

      setSelectedLesson(res.data);
      setIsEditing(false);

      toast.success("Lesson updated successfully");
    } catch {
      toast.error("Failed to update lesson");
    }
  };

  // DELETE LESSON
  const handleDeleteLesson = async () => {
    if (!selectedLesson) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/lessons/${selectedLesson._id}`);

      setLessons((prev) =>
        prev.filter((l) => l._id !== selectedLesson._id)
      );

      setSelectedLesson(null);
      setIsEditing(false);

      toast.success("Lesson deleted successfully");
    } catch {
      toast.error("Failed to delete lesson");
    }
  };

  // UPLOAD PDF
  const handlePdfUpload = async () => {
    if (!pdfFile) {
      toast.error("Please select a PDF");
      return;
    }

    try {
      setUploadingPdf(true);

      const form = new FormData();
      form.append("pdf", pdfFile);

      await api.put(`/courses/${courseId}/pdf`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("PDF uploaded successfully");
      setPdfFile(null);
    } catch {
      toast.error("Failed to upload PDF");
    } finally {
      setUploadingPdf(false);
    }
  };

  // DELETE COURSE
  const handleDeleteCourse = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await api.delete(`/courses/${courseId}`);
      toast.success("Course deleted successfully");
      navigate("/teacher/courses");
    } catch {
      toast.error("Failed to delete course");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <TeacherHeader />

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT PANEL */}
          <aside className="w-80 bg-white border-r overflow-y-auto flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Course Content</h2>
              <p className="text-sm text-gray-500">
                {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="p-4 space-y-4">
              {/* PDF UPLOAD */}
              <div className="border rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium">Course PDF</p>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="text-sm"
                />

                <button
                  onClick={handlePdfUpload}
                  disabled={uploadingPdf}
                  className="w-full text-sm py-1 border rounded-lg"
                >
                  {uploadingPdf ? "Uploading..." : "Upload PDF"}
                </button>
              </div>

              <button
                onClick={() => {
                  setIsCreating(true);
                  setIsEditing(false);
                  setSelectedLesson(null);
                  setFormData({
                    title: "",
                    youtubeUrl: "",
                    description: "",
                  });
                }}
                className="w-full py-2 text-sm rounded-lg border border-dashed"
              >
                + Add Lesson
              </button>
            </div>

            <ul className="px-4 pb-4 space-y-2 text-sm flex-1">
              {loading && <p>Loading...</p>}

              {!loading &&
                lessons.map((lesson, index) => (
                  <li
                    key={lesson._id}
                    onClick={() => {
                      setSelectedLesson(lesson);
                      setFormData({
                        title: lesson.title,
                        youtubeUrl: lesson.youtubeUrl,
                        description: lesson.description || "",
                      });
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    className={`p-3 border rounded-lg cursor-pointer ${
                      selectedLesson?._id === lesson._id
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                  >
                    {index + 1}. {lesson.title}
                  </li>
                ))}
            </ul>

            {/* DELETE COURSE */}
            <div className="p-4 border-t">
              <button
                onClick={handleDeleteCourse}
                className="w-full py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-700"
              >
                Delete Course
              </button>
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <main className="flex-1 p-6 overflow-y-auto">
            {/* CREATE MODE */}
            {isCreating && (
              <div className="max-w-3xl space-y-4">
                <h2 className="text-xl font-semibold">Add Lesson</h2>

                <input
                  placeholder="Lesson title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />

                <input
                  placeholder="YouTube URL"
                  value={formData.youtubeUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      youtubeUrl: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />

                <textarea
                  rows="4"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />

                <button
                  onClick={handleCreateLesson}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save Lesson
                </button>
              </div>
            )}

            {/* EDIT MODE */}
            {isEditing && selectedLesson && (
              <div className="max-w-3xl space-y-4">
                <h2 className="text-xl font-semibold">Edit Lesson</h2>

                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />

                <input
                  value={formData.youtubeUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      youtubeUrl: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />

                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateLesson}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={handleDeleteLesson}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete Lesson
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="border px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* VIEW MODE */}
            {!isCreating && !isEditing && selectedLesson && (
              <div className="max-w-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {selectedLesson.title}
                  </h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="border px-3 py-1 rounded bg-gray-600 text-white"
                  >
                    Edit
                  </button>
                </div>

                <input
                  value={selectedLesson.youtubeUrl}
                  disabled
                  className="w-full border px-3 py-2 bg-gray-100 rounded"
                />

                <textarea
                  rows="4"
                  value={selectedLesson.description || ""}
                  disabled
                  className="w-full border px-3 py-2 bg-gray-100 rounded"
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
