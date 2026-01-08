import { BookOpen, Layers, Users, Briefcase } from "react-feather"; 
// feather icons

export const Features = () => {
  const features = [
    {
      icon: <Layers size={40} className="text-blue-600" />,
      title: "Structured Learning Path",
      desc: "Follow a clear roadmap designed to take you from beginner to advanced without confusion."
    },
    {
      icon: <BookOpen size={40} className="text-blue-600" />,
      title: "Real-World Projects",
      desc: "Build practical projects that demonstrate your skills and strengthen your portfolio."
    },
    {
      icon: <Users size={40} className="text-blue-600" />,
      title: "Expert Mentorship",
      desc: "Learn directly from experienced developers and accelerate your growth."
    },
    {
      icon: <Briefcase size={40} className="text-blue-600" />,
      title: "Job & Placement Support",
      desc: "Interview preparation, mock tests, and job guidance to help you land the right role."
    }
  ];

  return (
    <section className=" py-10  bg-gradient-to-r from-blue-50 via-white to-blue-100 px-16">
      <div className="container mx-auto px-[55px]">
        
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Why Choose SkillStack?
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-md shadow-blue-100/50 hover:shadow-lg transition duration-300"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
