import React from "react";
import { useNavigate } from "react-router-dom";

export const Navbar = ({ showLogin = false, showProfile = false }) => {
  const navigate = useNavigate();

  return (
    <header className="text-black body-font bg-gradient-to-r from-blue-50 via-white to-blue-100 shadow-md shadow-blue-100/50 backdrop-blur-sm">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        {/* Logo */}
        <a
          className="flex title-font font-medium items-center cursor-pointer text-gray-900 mb-4 md:mb-0"
          onClick={() => navigate("/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-[#2563EB] rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">
            SKILL<span className="text-[#2563EB]">S</span>TACK
          </span>
        </a>

        {/* Links */}
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <a className="mr-5 cursor-pointer hover:text-[#2563EB]">About</a>
          <a className="mr-5 cursor-pointer hover:text-[#2563EB]">Contact</a>
          <a className="mr-5 cursor-pointer hover:text-[#2563EB]">Courses</a>
          <a className="mr-5 cursor-pointer hover:text-[#2563EB]">
            Talk To Mentor
          </a>
        </nav>

        {/* Login button */}
        {showLogin && (
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center bg-[#2563EB] text-white border-0 py-1 px-3 
            focus:outline-none hover:bg-white hover:text-[#2563EB] rounded text-base mt-4 md:mt-0 shadow-md"
          > 
            Login
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        )}

        {/* Profile Picture */}
        {showProfile && (
          <img
            src="https://etail.market/image/cache/catalog/marvel-s-spider-man-remastered_screenshot_a604m_cover-750x422.webp"
            alt="profile"
            className="w-10 h-10 rounded-full cursor-pointer object-cover mt-4 md:mt-0 shadow-md"
            onClick={() => navigate("/profile")}
          />
        )}
      </div>
    </header>
  );
};
