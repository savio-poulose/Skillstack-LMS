import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import StudentHeader from "../../components/studentComponents/StudentHeader";
import toast from "react-hot-toast";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [user,setUser] = useState(null);

  

  useEffect(() => {
    const fetchData = async () => {
      try {

        const [courseRes, lessonsRes, myCoursesRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/lessons`),
          api.get("/enroll/my-courses"),
        ]);

        setCourse(courseRes.data);
        setLessons(lessonsRes.data);

        const enrolled = myCoursesRes.data.some(
          (en) => en.course?._id === id
        );

        setIsEnrolled(enrolled);

      } catch (error) {
        console.error(error);
        navigate("/student/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();
  }, []);

  

  const handleEnroll = async () => {

    if (isEnrolled) {
      toast("You are already enrolled in this course");
      return;
    }

    try {

      setEnrolling(true);

      const res = await api.post(`/enroll/${id}`);

      toast.success(res.data.message || "Enrollment successful");

      setIsEnrolled(true);

    } catch (error) {

      const msg = error.response?.data?.message || "Enrollment failed";

      toast.error(msg);

    } finally {
      setEnrolling(false);
    }
  };

 

  const handleButtonClick = () => {

    if (isEnrolled) {
      toast("You are already enrolled in this course");
      return;
    }

    if (course.price === 0) {
      handleEnroll(); // free course
    } else {
      navigate(`/student/course/${id}/payment`); // paid course
    }
  };

  

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading course...
      </div>
    );
  }

  

  if (!course) {
    return (
      <div className="p-6 text-center text-gray-500">
        Course not found
      </div>
    );
  }


  return (
    <>
      <StudentHeader user={user}/>

      <div className="bg-gray-50 min-h-screen">

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT CONTENT */}

          <div className="lg:col-span-2 space-y-8">

            {/* TITLE */}

            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {course.title}
              </h1>

              <p className="mt-4 text-gray-600 text-lg">
                {course.description}
              </p>

              <div className="flex gap-6 mt-6 text-sm text-gray-500">
                <span>📘 {course.totalLessons} Lessons</span>
                <span>⏱ Self-paced</span>
                <span>🎯 {course.level}</span>
              </div>
            </div>

            {/* THUMBNAIL */}

            {course.thumbnail && (
              <div className="rounded-xl overflow-hidden shadow-md bg-white">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-[360px] object-cover"
                />
              </div>
            )}

            {/* LESSON PREVIEW */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-2xl font-semibold mb-4">
                Course content
              </h2>

              {lessons.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No lessons added yet
                </p>
              ) : (
                <ul className="space-y-3">

                  {lessons.map((lesson, index) => (
                    <li
                      key={lesson._id}
                      className="flex justify-between border-b pb-2 text-sm"
                    >
                      <span>
                        {index + 1}. {lesson.title}
                      </span>

                      {!isEnrolled && (
                        <span className="text-gray-400">🔒</span>
                      )}

                    </li>
                  ))}

                </ul>
              )}

            </div>

          </div>

          {/* RIGHT SIDEBAR */}

          <div className="lg:sticky lg:top-24 h-fit">

            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">

              <p className="text-3xl font-bold text-blue-600">
                {course.price === 0 ? "Free" : `₹${course.price}`}
              </p>

              <button
                onClick={handleButtonClick}
                disabled={enrolling}
                className={`w-full py-3 rounded-lg text-lg font-medium transition
                  ${
                    enrolling
                      ? "bg-gray-400 cursor-not-allowed"
                      : isEnrolled
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }
                `}
              >
                {enrolling
                  ? "Enrolling..."
                  : isEnrolled
                  ? "Already Enrolled"
                  : course.price === 0
                  ? "Enroll Now"
                  : "Buy Course"}
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