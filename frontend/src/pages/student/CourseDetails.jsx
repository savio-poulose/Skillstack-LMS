import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import StudentHeader from "../../components/studentComponents/StudentHeader";
import toast from "react-hot-toast";


const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  // FETCH COURSE
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (error) {
        console.error("Error fetching course", error);
        navigate("/student/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  // ENROLL HANDLER
  const handleEnroll = async () => {
  try {
    setEnrolling(true);

    const res = await api.post(`/enroll/${id}`);

    toast.success(res.data.message || "Enrollment successful");

    // redirect after short delay (feels better UX)
    setTimeout(() => {
      navigate("/student/my-courses");
    }, 800);

  } catch (error) {
    const msg =
      error.response?.data?.message || "Enrollment failed";

    toast.error(msg);
  } finally {
    setEnrolling(false);
  }
};


  // LOADING STATE
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading course...
      </div>
    );
  }

  // NOT FOUND
  if (!course) {
    return (
      <div className="p-6 text-center text-gray-500">
        Course not found
      </div>
    );
  }

  return (
  <>
    <StudentHeader />

    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          {/* HERO */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {course.title}
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              {course.description}
            </p>

            {/* STATS */}
            <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                📘 {course.totalLectures || 0} Lectures
              </span>
              <span className="flex items-center gap-1">
                ⏱ {course.totalDuration || "—"}
              </span>
              <span className="flex items-center gap-1">
                🎯 {course.level || "Beginner"}
              </span>
            </div>
          </div>

          {/* PREVIEW IMAGE */}
          <div className="rounded-xl overflow-hidden shadow-md bg-white">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-[360px] object-cover"
            />
          </div>

          {/* WHAT YOU WILL LEARN */}
          {course.outcomes?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                What you’ll learn
              </h2>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.outcomes.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="text-green-600 font-bold">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR (ENROLL CARD) */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <p className="text-3xl font-bold text-blue-600">
              ₹{course.price}
            </p>

            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className={`w-full py-3 rounded-lg text-lg font-medium transition
                ${
                  enrolling
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
              `}
            >
              {enrolling ? "Enrolling..." : "Enroll Now"}
            </button>

            <div className="text-sm text-gray-500 space-y-2">
              <p>✔ Full lifetime access</p>
              <p>✔ Learn at your own pace</p>
              <p>✔ Certificate on completion</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </>
);

};

export default CourseDetail;
