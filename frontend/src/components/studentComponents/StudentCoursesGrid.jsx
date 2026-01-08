import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentCoursesGrid = ({ courses }) => {
   const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-lg mb-8 shadow-md"
      />

      {/* COURSES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => navigate(`/student/course/${course._id}`)}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden 
                       shadow-sm hover:shadow-md hover:-translate-y-1
                       transition-all duration-300 cursor-pointer"
          >
            {/* IMAGE */}
            <div className="h-40 w-full overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h3 className="font-semibold text-[15px] text-gray-900 leading-tight">
                {course.title}
              </h3>

              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center gap-1 mt-2">
                <span className="text-yellow-500 text-sm">★</span>
                <span className="text-sm font-medium">4.5</span>
                <span className="text-xs text-gray-400">(120)</span>
              </div>

              <p className="text-lg font-semibold text-blue-600 mt-3">
                ₹{course.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCoursesGrid;
