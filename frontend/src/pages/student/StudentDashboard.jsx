import { useEffect, useState } from "react";
import api from "../../api";

import StudentSidebar from "../../components/studentComponents/StudentSidebar";
import StudentHeader from "../../components/studentComponents/StudentHeader";
import StudentBanner from "../../components/studentComponents/StudentBanner";
import StudentCoursesGrid from "../../components/studentComponents/StudentCoursesGrid";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);

  // fetch user (for header)
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

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <div className="shrink-0">
          <StudentHeader user={user} />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <StudentBanner />
          <StudentCoursesGrid courses={courses} />
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
