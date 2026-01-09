import { useParams } from "react-router-dom";
import { useState } from "react";
import TeacherSidebar from "../../components/teacherComponents/TeacherSidebar";
import TeacherHeader from "../../components/teacherComponents/TeacherHeader";

const CourseEditor = () => {
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showNotesEditor, setShowNotesEditor] = useState(false);
  const [notesFile, setNotesFile] = useState(null);

  const addLesson = () => {
    const newLesson = {
      id: Date.now(),
      title: "New Lesson",
      youtubeUrl: "",
      description: "",
    };
    setLessons([...lessons, newLesson]);
    setSelectedLesson(newLesson);
    setShowNotesEditor(false);
  };

  const updateLesson = (field, value) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === selectedLesson.id ? { ...l, [field]: value } : l
      )
    );
    setSelectedLesson((prev) => ({ ...prev, [field]: value }));
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
                Course ID: {courseId}
              </p>
            </div>

            <div className="p-4">
              <button
                onClick={addLesson}
                className="w-full py-2 text-sm rounded-lg border border-dashed hover:bg-gray-50"
              >
                + Add Lesson
              </button>
            </div>

            <ul className="px-4 pb-4 space-y-2 text-sm">
              {lessons.map((lesson, index) => (
                <li
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setShowNotesEditor(false);
                  }}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    selectedLesson?.id === lesson.id
                      ? "bg-gray-100 font-medium"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {index + 1}. {lesson.title}
                </li>
              ))}

              {/* COURSE NOTES PDF */}
              <li
                onClick={() => {
                  setSelectedLesson(null);
                  setShowNotesEditor(true);
                }}
                className={`p-3 border rounded-lg mt-4 cursor-pointer ${
                  showNotesEditor
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                📄 Course Notes (PDF)
              </li>
            </ul>
          </aside>

          {/* RIGHT PANEL */}
          <main className="flex-1 p-6 overflow-y-auto">
            {/* EMPTY STATE */}
            {!selectedLesson && !showNotesEditor && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <h3 className="text-lg font-semibold mb-2">
                    Start building your course
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Add lessons or upload course notes
                  </p>
                  <button
                    onClick={addLesson}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Add your first lesson
                  </button>
                </div>
              </div>
            )}

            {/* LESSON EDITOR */}
            {selectedLesson && (
              <div className="max-w-3xl space-y-6">
                <h2 className="text-xl font-semibold">Edit Lesson</h2>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={selectedLesson.title}
                    onChange={(e) =>
                      updateLesson("title", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    YouTube Video URL
                  </label>
                  <input
                    type="text"
                    value={selectedLesson.youtubeUrl}
                    onChange={(e) =>
                      updateLesson("youtubeUrl", e.target.value)
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
                    value={selectedLesson.description}
                    onChange={(e) =>
                      updateLesson("description", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Save Lesson
                </button>
              </div>
            )}

            {/* COURSE NOTES PDF EDITOR */}
            {showNotesEditor && (
              <div className="max-w-xl space-y-6">
                <h2 className="text-xl font-semibold">
                  Course Notes (PDF)
                </h2>

                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setNotesFile(e.target.files[0])
                    }
                  />

                  {notesFile && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {notesFile.name}
                    </p>
                  )}
                </div>

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Save Notes
                </button>

                <p className="text-xs text-gray-500">
                  These notes will be used later to generate the final quiz.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
