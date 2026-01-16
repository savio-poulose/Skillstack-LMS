import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";

import TeacherSidebar from "../../components/teacherComponents/TeacherSidebar";
import TeacherHeader from "../../components/teacherComponents/TeacherHeader";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    status: "draft",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
  toast.error("Title, description, and category are required");
  return;
}


    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", Number(formData.price));
      data.append("category", formData.category);
      data.append("status", formData.status);

      // 🔥 THIS is the only thing Cloudinary needs from frontend
      if (thumbnail) {
        data.append("thumbnail", thumbnail); // must match upload.single("thumbnail")
      }

      const res = await api.post("/courses", data);
      // ❌ DO NOT manually set multipart headers — axios handles it

      toast.success("Course created successfully");

      const courseId = res.data._id;
      navigate(`/teacher/courses/${courseId}/editor`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create course");
    } finally {
      setLoading(false);
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
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* LEFT */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

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
                      <option>JavaScript</option>
                      <option>DSA</option>
                      <option>DevOps</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-sm font-medium mb-3">
                    Course Thumbnail
                  </p>

                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      id="thumbnail"
                      className="hidden"
                      onChange={(e) => setThumbnail(e.target.files[0])}
                    />

                    <label
                      htmlFor="thumbnail"
                      className="cursor-pointer text-blue-600 text-sm"
                    >
                      {thumbnail
                        ? thumbnail.name
                        : "Click to upload image"}
                    </label>

                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: 1280 × 720
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create & Continue"}
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
