import TeacherSidebar from "../../components/teacherComponents/TeacherSidebar";
import TeacherHeader from "../../components/teacherComponents/TeacherHeader";

const CourseEditor = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <TeacherHeader />

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: STRUCTURE PANEL */}
          <aside className="w-80 bg-white border-r overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Course Content</h2>
              <p className="text-sm text-gray-500">
                Build your course structure
              </p>
            </div>

            {/* ADD SECTION */}
            <div className="p-4">
              <button className="w-full py-2 text-sm rounded-lg border border-dashed hover:bg-gray-50">
                + Add Section
              </button>
            </div>

            {/* SECTIONS LIST */}
            <div className="px-4 pb-4 space-y-3">
              {/* SECTION */}
              <div className="border rounded-lg">
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
                  <p className="text-sm font-medium">
                    Section 1: Introduction
                  </p>
                  <button className="text-xs text-blue-600">
                    + Lesson
                  </button>
                </div>

                {/* LESSONS */}
                <ul className="text-sm">
                  <li className="px-4 py-2 border-t hover:bg-gray-50 cursor-pointer">
                    1. Welcome
                  </li>
                  <li className="px-4 py-2 border-t hover:bg-gray-50 cursor-pointer">
                    2. Course Overview
                  </li>
                </ul>
              </div>

              {/* EMPTY STATE SAMPLE */}
              <div className="border rounded-lg opacity-60">
                <div className="px-3 py-2 bg-gray-50 text-sm">
                  Section 2
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: EDITOR PANEL */}
          <main className="flex-1 p-6 overflow-y-auto">
            {/* EMPTY STATE */}
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <h3 className="text-lg font-semibold mb-2">
                  Start building your course
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add sections and lessons to begin creating
                  your course content.
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Add your first section
                </button>
              </div>
            </div>

            {/* 
              Later this area becomes:
              - Lesson editor
              - Video upload
              - PDF upload
              - Text editor
            */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
