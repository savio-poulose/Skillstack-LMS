import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export const CoursePreview = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {

      const res = await api.get("/courses");

      // show only published courses
      const publishedCourses = res.data.filter(
        (course) => course.status === "published"
      );

      setCourses(publishedCourses.slice(0,4)); // show 4 courses

    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally{
      setLoading(false)
    }
  };

  const handleExploreCourses = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
  } else {
    navigate("/courses");
  }
};
  return (
    <section className="py-16 px-2 bg-gradient-to-r from-blue-50 via-white to-blue-100">

      <div className="container mx-auto px-[100px]">

        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-14">
          Explore Our Popular Courses
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading courses...</p>
        ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {courses.map((course) => (

            <div
              key={course._id}
              className="
                bg-white border border-gray-200 
                rounded-lg overflow-hidden 
                shadow-sm hover:shadow-md hover:-translate-y-1
                transition-all duration-300 cursor-pointer
              "
            >

              <div className="h-40 w-full overflow-hidden">

                <img
                  src={
                    course.thumbnail ||
                    "https://dummyimage.com/600x400/1e40af/ffffff&text=Course"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover"
                />

              </div>

              <div className="p-4">

                <h3 className="font-semibold text-[15px] text-gray-900 leading-tight">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {course.instructor?.name || "Instructor"}
                </p>

                {/* Rating placeholder */}
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-yellow-500 text-sm">★</span>
                  <span className="text-sm font-medium">
                    {course.rating || 4.5}
                  </span>
                </div>

                <p className="text-lg font-semibold text-blue-600 mt-3">
                  ₹{course.price || "Free"}
                </p>

              </div>

            </div>

          ))}

        </div>

        )}

        <div className="mt-12 flex justify-center">

          <button
          onClick={handleExploreCourses}
            className="
            inline-flex items-center gap-2 text-blue-600 bg-white border border-blue-600 py-3 px-8 
            hover:bg-blue-50 rounded-lg text-lg font-medium transition"
          >
            Explore Courses

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>

          </button>

        </div>

      </div>

    </section>
  );
};