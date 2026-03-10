import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import api from "../api";

export const Testimonials = () => {

  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchFeedback = async () => {
      try {

        const res = await api.get("/feedback/public");

        setFeedback(res.data);

      } catch (error) {

        console.error("Failed to fetch feedback:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();

  }, []);

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 via-white to-blue-100">

      <div className="container mx-auto px-[100px]">

        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          What Our Students Say
        </h2>

        <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
          Real stories from learners who built skills, projects, and careers.
        </p>

        {loading ? (
          <p className="text-center mt-10 text-gray-500">
            Loading testimonials...
          </p>
        ) : (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14">

          {feedback.map((item) => (

            <div
              key={item._id}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 border border-blue-100"
            >

              {/* User Info */}

              <div className="flex items-center gap-4">

                <img
                  src={
                    item.user?.avatar ||
                    `https://ui-avatars.com/api/?name=${item.user?.name}&background=random`
                  }
                  alt={item.user?.name}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.user?.name}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {item.course?.title}
                  </p>
                </div>

              </div>

              {/* Review */}

              <p className="text-gray-700 mt-4 text-sm leading-relaxed">
                {item.comment}
              </p>

              {/* Rating */}

              <div className="flex text-yellow-400 mt-4">

                {[...Array(item.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}

              </div>

            </div>

          ))}

        </div>

        )}

      </div>

    </section>
  );
};