import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useRef } from "react";


import StudentSidebar from "../../components/studentComponents/StudentSidebar";
import StudentHeader from "../../components/studentComponents/StudentHeader";

const ChatTeacherList = () => {
  const [user, setUser] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();
  const socketRef = useRef(null);

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

  //fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get("/chat/teachers");
        setTeachers(res.data);
      } catch (err) {
        console.error("Error fetching teachers", err);
      }
    };

    fetchTeachers();
  }, []);

  //sokcet io something
  useEffect(() => {
  if (!user) return;

  socketRef.current = io("http://localhost:5000", {
    auth: {
      token: localStorage.getItem("token"),
    },
  });

  socketRef.current.on("newMessage", (message) => {
    // Only update unread if I'm NOT inside that chat
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher._id === message.sender
          ? { ...teacher, unread: teacher.unread + 1 }
          : teacher
      )
    );
  });

  return () => {
    socketRef.current.disconnect();
  };
}, [user]);

  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <div className="shrink-0">
          <StudentHeader user={user} />
          <main className="flex-1 overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Your Mentors</h2>

            <div className="grid gap-4">
              {teachers.map((teacher) => (
                <div
                  key={teacher._id}
                  onClick={() => navigate(`/student/chat/${teacher._id}`)}
                  className="bg-white cursor-pointer hover:bg-gray-100 shadow rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-sm text-gray-500">{teacher.email}</p>
                    </div>
                  </div>

                  {teacher.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {teacher.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChatTeacherList;
