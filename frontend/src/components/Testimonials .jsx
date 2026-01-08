import React from "react";
import { FaStar } from "react-icons/fa";

export const Testimonials = () => {
  const feedback = [
    {
      name: "Rahul Menon",
      role: "Frontend Developer @ TCS",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      review:
        "SkillStack helped me go from absolute beginner to landing my first developer job. The mentorship was the biggest game changer.",
    },
    {
      name: "Aisha Khan",
      role: "MERN Intern @ Startup",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      review:
        "The projects were real and practical. I finally understood how full-stack apps work. Best decision I made this year!",
    },
    {
      name: "Dev Patel",
      role: "Backend Engineer @ Infosys",
      img: "https://randomuser.me/api/portraits/men/50.jpg",
      review:
        "Clear guidance, structured roadmap, and constant support helped me crack interviews with confidence.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 via-white to-blue-100">
      <div className="container mx-auto px-[100px]">

        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          What Our Students Say
        </h2>
        <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
          Real stories from learners who built skills, projects, and careers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14">
          {feedback.map((user, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 border border-blue-100"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.img}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
              </div>

              <p className="text-gray-700 mt-4 text-sm leading-relaxed">
                {user.review}
              </p>

              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
