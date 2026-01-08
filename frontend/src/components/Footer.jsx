import React from "react";
import { FiMail, FiInstagram, FiLinkedin, FiGithub } from "react-icons/fi";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-50 via-white to-blue-100 border-t border-blue-100">
      <div className="container mx-auto px-6 md:px-20 py-14">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              SKILL<span className="text-blue-600">STACK</span>
            </h3>
            <p className="text-gray-600 text-sm mt-4 leading-relaxed">
              SkillStack is a practical learning platform focused on real-world
              development skills, projects, and job-ready training.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="hover:text-blue-600 cursor-pointer">About Us</li>
              <li className="hover:text-blue-600 cursor-pointer">Courses</li>
              <li className="hover:text-blue-600 cursor-pointer">Mentors</li>
              <li className="hover:text-blue-600 cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="hover:text-blue-600 cursor-pointer">Blog</li>
              <li className="hover:text-blue-600 cursor-pointer">FAQs</li>
              <li className="hover:text-blue-600 cursor-pointer">Support</li>
              <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiMail />
              <span>support@skillstack.dev</span>
            </div>

            <div className="flex gap-4 mt-5 text-gray-600">
              <FiInstagram className="hover:text-blue-600 cursor-pointer" />
              <FiLinkedin className="hover:text-blue-600 cursor-pointer" />
              <FiGithub className="hover:text-blue-600 cursor-pointer" />
            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-blue-100 mt-12 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SkillStack. All rights reserved.
        </div>

      </div>
    </footer>
  );
};
