import TeacherSidebar from "../../components/teacherComponents/TeacherSidebar";
import TeacherHeader from "../../components/teacherComponents/TeacherHeader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api"; // axios instance

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    status: "draft",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      thumbnail: "https://picsum.photos/400/250",
    };

    try {
      const res = await api.post("/courses", payload);

      const courseId = res.data._id;

      navigate(`/teacher/courses/${courseId}/editor`);
    } catch (error) {
      console.error(error);
      alert("Failed to create course");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <TeacherSidebar />

      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
        <TeacherHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold mb-6">Create New Course</h1>

          <form
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            onSubmit={handleSubmit}
          >
            {/* LEFT SIDE */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
                {/* TITLE */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* SHORT DESCRIPTION */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* WHAT YOU'LL LEARN */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    What you’ll learn
                  </label>
                  <textarea
                    rows="3"
                    placeholder="• Build full-stack MERN apps
• Understand REST APIs
• Deploy real projects"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* PRICE + CATEGORY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Select category</option>
                      <option>Web Development</option>
                      <option>Frontend Development</option>
                      <option>Backend Development</option>
                      <option>Full Stack Development</option>
                      <option>Programming Basics</option>
                      <option>JavaScript</option>
                      <option>Data Structures & Algorithms</option>
                      <option>DevOps</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE – CONTROL PANEL */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                {/* THUMBNAIL */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-sm font-medium mb-3">Course Thumbnail</p>

                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      id="thumbnail"
                      className="hidden"
                    />

                    <label
                      htmlFor="thumbnail"
                      className="cursor-pointer text-blue-600 text-sm"
                    >
                      Click to upload image
                    </label>

                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: 1280 × 720
                    </p>
                  </div>
                </div>

                {/* SETTINGS + ACTION */}
                <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Create & Continue
                  </button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateCourse;
