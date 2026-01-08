import { useEffect, useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";

import StudentSidebar from "../../components/studentComponents/StudentSidebar";

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);

        // populate form
        setFormData({
          name: res.data.name || "",
          phone: res.data.phone || "",
          age: res.data.age || "",
          gender: res.data.gender || "",
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen">
        <StudentSidebar />
        <div className="flex-1 flex items-center justify-center">
          Loading profile...
        </div>
      </div>
    );
  }
  const handleSave = async () => {
  try {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("age", formData.age);
    data.append("gender", formData.gender);

    if (profilePic) {
      data.append("profilePic", profilePic); // MUST match multer field
    }

    const res = await api.put("/users/me", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setUser(res.data);
    setProfilePic(null);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  } catch (error) {
    console.log(error);
    toast.error("Failed to update profile");
  }
};


  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar />

      <div className="flex-1 p-14 ">
        <h1 className="text-2xl  font-bold mb-6">My Profile</h1>
        <div className="flex flex-col  gap-2">
          <img
            src={user.avatar || "frontend/src/assets/default-avatar.webp"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border"
          />

          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="text-sm"
            />
          )}
        </div>

        <div className="space-y-4 max-w-md ">
          <div>
            <label>Name</label>
            {isEditing ? (
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border p-2"
              />
            ) : (
              <p className="p-2 border rounded bg-gray-50">{user.name}</p>
            )}
          </div>

          <div>
            <label>Email</label>
            <input value={user.email} className="w-full border p-2" disabled />
          </div>
          {/* Phone */}
          <div>
            <label>Phone</label>
            {isEditing ? (
              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border p-2"
              />
            ) : (
              <p className="p-2 border rounded bg-gray-50">{user.phone}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block mb-1">Age</label>
            {isEditing ? (
              <input
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="w-full border p-2"
              />
            ) : (
              <p className="p-2 border rounded bg-gray-50">{user.age}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1">Gender</label>
            {isEditing ? (
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full border p-2"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            ) : (
              <p className="p-2 border rounded bg-gray-50">{user.gender}</p>
            )}
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>

              <button
                onClick={() => {
                  // revert changes
                  setFormData({
                    name: user.name || "",
                    phone: user.phone || "",
                    age: user.age || "",
                    gender: user.gender || "",
                  });
                  setProfilePic(null);
                  setIsEditing(false);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
