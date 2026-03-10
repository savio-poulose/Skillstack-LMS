import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function About() {
  return (
    <div>

      <Navbar showLogin={true} showProfile={false} />

      <section className="py-20 bg-gradient-to-r from-blue-50 via-white to-blue-100">
        <div className="container mx-auto px-[100px]">

          <h1 className="text-4xl font-bold text-gray-900 text-center mb-6">
            About SkillStack
          </h1>

          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            SkillStack is an online learning platform designed to help students
            build real-world development skills through structured courses,
            mentorship, and hands-on projects.
          </p>

          <div className="grid md:grid-cols-3 gap-10 mt-10">

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#2563EB]">
                Our Mission
              </h3>

              <p className="text-gray-600 text-sm">
                To bridge the gap between academic learning and real industry
                skills by providing practical, project-based education.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#2563EB]">
                What We Offer
              </h3>

              <p className="text-gray-600 text-sm">
                Full-stack development courses, mentorship, real-world projects,
                and career guidance for aspiring developers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#2563EB]">
                Our Vision
              </h3>

              <p className="text-gray-600 text-sm">
                To empower students worldwide with the skills and confidence to
                build impactful technology solutions.
              </p>
            </div>

          </div>

        </div>
      </section>

      <Footer />

    </div>
  );
}