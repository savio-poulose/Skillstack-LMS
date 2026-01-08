import React from "react";
import { FiCpu, FiUsers, FiBookOpen, FiBriefcase } from "react-icons/fi";

export const WhyChooseUs = () => {
  const features = [
    {
      icon: <FiCpu className="w-8 h-8 text-blue-600" />,
      title: "Learn by Building",
      desc: "Master development through real-world projects that make your portfolio stand out.",
    },
    {
      icon: <FiUsers className="w-8 h-8 text-blue-600" />,
      title: "1-on-1 Mentor Support",
      desc: "Get help whenever you're stuck. We guide you with clarity at every step.",
    },
    {
      icon: <FiBookOpen className="w-8 h-8 text-blue-600" />,
      title: "Structured Learning Path",
      desc: "No confusion. Follow a step-by-step modern roadmap built for absolute beginners.",
    },
    {
      icon: <FiBriefcase className="w-8 h-8 text-blue-600" />,
      title: "Job-Ready Skills",
      desc: "Learn skills that companies actually hire for, with interview preparation included.",
    },
  ];

  return (
    <section className="py-16 px-5 bg-gradient-to-r from-blue-50 via-white to-blue-100  ">
      <div className="container mx-auto px-6 md:px-20">
        
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Why Students Choose SkillStack
        </h2>
        <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
          Practical learning, real mentorship, and job-focused training — built for serious learners.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-14">
          {features.map((item, index) => (
            <div
              key={index}
              className="p-6 border border-blue-100 rounded-xl hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 bg-white"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
