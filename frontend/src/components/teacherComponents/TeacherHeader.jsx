
import { Link } from "react-router-dom";

const StudentHeader = ({ user }) => {
  return (
    <header className="bg-[#EFF6FF] border-b border-blue-100 px-6 py-4 flex items-center justify-between">
      
      {/* LEFT: PAGE TITLE */}
      <h2 className="text-lg font-semibold text-[#1E293B]">
        Dashboard
      </h2>

      {/* RIGHT: PROFILE */}
      <Link
        to="/teacher/profile"
        className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
      >
        <img
          src={user?.avatar || "frontend/src/assets/default-avatar.webp"}
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover border border-blue-200"
        />

        <div className="text-sm text-left leading-tight hidden sm:block">
          <p className="font-medium text-[#1E293B]">
            {user?.name || "Teacher"}
          </p>
          <p className="text-xs text-[#374151]">
            Teacher
          </p>
        </div>
      </Link>
    </header>
  );
};

export default StudentHeader;
