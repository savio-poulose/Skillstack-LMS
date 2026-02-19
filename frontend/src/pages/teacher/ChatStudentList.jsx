import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../api";

import TeacherSidebar from "../../components/teacherComponents/TeacherSidebar";
import TeacherHeader from "../../components/teacherComponents/TeacherHeader";

export default function ChatStudentList() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const socketRef = useRef(null);

  // 🔹 Fetch students enrolled in teacher courses
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/chat/students");
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students", err);
      }
    };

    fetchStudents();
  }, []);

  // 🔹 Setup socket for real-time unread updates
  useEffect(() => {
    if (socketRef.current) return; // prevent duplicate connections

    socketRef.current = io("http://localhost:5000", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketRef.current.on("newMessage", (message) => {
      // Only increment if message is from a student
      setStudents((prev) =>
        prev.map((student) =>
          student._id === message.sender
            ? { ...student, unread: (student.unread || 0) + 1 }
            : student,
        ),
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <div className="shrink-0">
          <TeacherHeader />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-xl font-semibold mb-4">Your Students</h2>

          <div className="flex flex-col divide-y bg-white rounded-lg shadow">
            {students.map((student) => (
              <div
                key={student._id}
                onClick={() => {
                  setStudents((prev) =>
                    prev.map((s) =>
                      s._id === student._id ? { ...s, unread: 0 } : s,
                    ),
                  );
                  navigate(`/teacher/chat/${student._id}`);
                }}
                className="flex items-center justify-between px-4 py-4 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                      {student.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>

                {student.unread > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {student.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
