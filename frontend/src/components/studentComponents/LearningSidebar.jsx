import { useNavigate } from "react-router-dom";

const LearningSidebar = ({
  lessons,
  activeLessonId,
  onLessonClick,
  progress,
  completedLessons = [],
}) => {
  const navigate = useNavigate();

  return (
    <aside className="w-72 h-full bg-[#1E40AF] text-white flex flex-col">
      {/* BRAND */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-[#2563EB] rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          <h1
            className="text-lg font-semibold tracking-wide cursor-pointer"
            onClick={() => navigate("/student/dashboard")}
          >
            SKILL<span className="text-[#60A5FA]">S</span>TACK
          </h1>
        </div>

        {/* PROGRESS */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-[#BFDBFE] mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-[#1E3A8A] rounded">
            <div
              className="h-2 bg-[#60A5FA] rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mx-6 mb-2" />

      {/* LESSON LIST */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson._id);

          return (
            <div
              key={lesson._id}
              onClick={() => onLessonClick(lesson._id)}
              className={`px-4 py-3 rounded-lg text-sm cursor-pointer transition mb-1 flex justify-between items-center
                ${
                  lesson._id === activeLessonId
                    ? "bg-[#2563EB]/30 text-white font-semibold"
                    : "text-[#BFDBFE] hover:bg-[#1E3A8A]/70"
                }`}
            >
              <span>
                {index + 1}. {lesson.title}
              </span>

              {isCompleted && (
                <span className="text-green-400 text-xs">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default LearningSidebar;
