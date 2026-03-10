import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api";

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function Contact() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {

      await api.post("/contact", form);

      toast.success("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        message: ""
      });

    } catch (error) {

      toast.error("Failed to send message");

      console.error(error);

    } finally {
      setLoading(false);
    }

  };

  return (
    <div>

      <Navbar showLogin={true} showProfile={false} />

      <section className="py-20 bg-gradient-to-r from-blue-50 via-white to-blue-100">

        <div className="container mx-auto px-[100px]">

          <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
            Contact Us
          </h1>

          <p className="text-center text-gray-600 mb-12">
            Have questions about our courses or need guidance? Send us a message.
          </p>

          <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md"
          >

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Your Name"
              className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Your Email"
              className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              placeholder="Your Message"
              className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] text-white py-3 rounded hover:bg-blue-700 transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

          </form>

        </div>

      </section>

      <Footer />

    </div>
  );
}