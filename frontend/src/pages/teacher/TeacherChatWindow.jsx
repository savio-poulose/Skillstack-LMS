import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../api";

import TeacherSidebar from "../../components/teacherComponents/TeacherSidebar";
import TeacherHeader from "../../components/teacherComponents/TeacherHeader";

export default function TeacherChatWindow() {
  const { studentId } = useParams();

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  // Fetch logged-in teacher
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  // Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/${studentId}`);
        setMessages(res.data);
        await api.put(`/chat/${studentId}/read`);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [studentId]);

  // Setup socket
  useEffect(() => {
    if (!user) return;

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        auth: { token: localStorage.getItem("token") },
      });
    }

    socketRef.current.on("newMessage", (message) => {
      if (message.sender === studentId || message.receiver === studentId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socketRef.current?.off("newMessage");
    };
  }, [user, studentId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    socketRef.current.emit("sendMessage", {
      receiverId: studentId,
      content: input,
    });

    setInput("");
  };

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar />

      <div className="flex flex-col flex-1 bg-gray-100">
        <TeacherHeader />

        <div className="flex flex-col flex-1 p-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-lg space-y-2">
            {messages.map((msg) => {
              const isMe = msg.sender === user._id;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 text-sm shadow-sm ${
                      isMe
                        ? "bg-blue-500 text-white rounded-2xl rounded-br-md"
                        : "bg-white border border-gray-200 rounded-2xl rounded-bl-md"
                    }`}
                  >
                    <div className="break-words">{msg.content}</div>

                    <div className="text-[10px] opacity-70 mt-1 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="mt-3 flex gap-3 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />

            <button
              onClick={handleSend}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
