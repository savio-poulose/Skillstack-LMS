import { useEffect, useState } from "react";
import api from "../../api";

import AdminSidebar from "../../components/adminComponents/AdminSidebar";
import AdminHeader from "../../components/adminComponents/AdminHeader";

export default function Messages() {

  const [messages, setMessages] = useState([]);

  useEffect(() => {

    const fetchMessages = async () => {
      try {

        const res = await api.get("/contact/admin");

        setMessages(res.data);

      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();

  }, []);

  return (
    <div className="flex h-screen">

      <AdminSidebar />

      <div className="flex flex-col flex-1 bg-gray-50">

        <AdminHeader />

        <main className="p-6">

          <h1 className="text-2xl font-semibold mb-6">
            Contact Messages
          </h1>

          <div className="bg-white rounded shadow overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Message</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>

              <tbody>

                {messages.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-500">
                      No messages yet
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr key={msg._id} className="border-t">

                      <td className="p-3">{msg.name}</td>

                      <td className="p-3">{msg.email}</td>

                      <td className="p-3">{msg.message}</td>

                      <td className="p-3">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </main>

      </div>

    </div>
  );
}