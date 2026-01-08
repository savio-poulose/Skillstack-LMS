
import React from "react";

export const CoursePreview = () => {
  const courses = [
    {
      id: 1,
      title: "Build Text to Image SaaS App in React JS",
      teacher: "Richard James",
      rating: 4.5,
      reviews: 122,
      price: "$10.99",
      image: "https://dummyimage.com/600x400/1e40af/ffffff&text=SaaS+App",
    },
    {
      id: 2,
      title: "Full Stack Web Development",
      teacher: "John Parker",
      rating: 4.7,
      reviews: 340,
      price: "$12.99",
      image: "https://dummyimage.com/600x400/0284c7/ffffff&text=Full+Stack",
    },
    {
      id: 3,
      title: "JavaScript Zero to Hero",
      teacher: "Alex Morgan",
      rating: 4.6,
      reviews: 210,
      price: "$9.99",
      image: "https://dummyimage.com/600x400/065f46/ffffff&text=JavaScript",
    },
    {
      id: 4,
      title: "Python Programming Mastery",
      teacher: "Sophia Turner",
      rating: 4.8,
      reviews: 500,
      price: "$11.49",
      image: "https://dummyimage.com/600x400/9333ea/ffffff&text=Python",
    },
  ];

  return (
    <section className="py-16 px-2 bg-gradient-to-r from-blue-50 via-white to-blue-100  ">
      <div className="container mx-auto px-[100px]">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-14">
          Explore Our Popular Courses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {courses.map((course) => (
            <div
              key={course.id}
              className="
                bg-white border border-gray-200 
                rounded-lg overflow-hidden 
                shadow-sm hover:shadow-md hover:-translate-y-1
                transition-all duration-300 cursor-pointer
              "
            >
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-[15px] text-gray-900 leading-tight">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">{course.teacher}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-yellow-500 text-sm">★</span>
                  <span className="text-sm font-medium">{course.rating}</span>
                  <span className="text-xs text-gray-400">
                    ({course.reviews})
                  </span>
                </div>

                {/* Price */}
                <p className="text-lg font-semibold text-blue-600 mt-3">
                  {course.price}
                </p>
              </div>
            </div>
          ))}
        </div>
         <div className="mt-12 flex justify-center">
          <button
            className="inline-flex items-center gap-2 text-blue-600 bg-white border border-blue-600 py-3 px-8 
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
