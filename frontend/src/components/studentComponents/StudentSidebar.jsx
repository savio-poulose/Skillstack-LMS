import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import api from "../../api";

const StudentSidebar = () => {
  const linkClass = ({ isActive }) =>
    `
    relative flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all
    ${isActive
      ? "bg-[#2563EB]/20 text-white before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-[#2563EB]"
      : "text-[#60A5FA] hover:bg-[#1E3A8A]/60 hover:text-white"
    }
  `;

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/landing", { replace: true });
    window.location.reload();
  };

  return (
    <aside className="w-64 h-screen bg-[#1E40AF] text-white flex flex-col">
      {/* BRAND */}
      <div className="px-6 py-7">
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

          <h1 className="text-lg font-semibold tracking-wide">
            SKILL<span className="text-[#60A5FA]">S</span>TACK
          </h1>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="mx-6 mb-4 border-t border-white/10" />

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        <NavLink to="/student/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/student/my-courses" className={linkClass}>
          My Enrollments
        </NavLink>

        <NavLink to="/student/quizzes" className={linkClass}>
          My Quizzes
        </NavLink>

        <NavLink to="/student/mentor" className={linkClass}>
          Talk to Mentor
        </NavLink>

        <NavLink to="/student/profile" className={linkClass}>
          Profile
        </NavLink>
      </nav>

      {/* LOGOUT */}
      <div className="px-4 py-6">
        <button onClick={handleLogout}
          className="
            w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium
            text-[#60A5FA] hover:bg-red-600/90 hover:text-white transition
          "
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
