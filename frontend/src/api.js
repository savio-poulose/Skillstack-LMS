import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔥 REQUEST: attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 RESPONSE: handle blocked users globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // 🚫 BLOCKED STUDENT
    if (status === 403 && message?.toLowerCase().includes("blocked")) {
      toast.error("🚫 Your account has been blocked by the admin");

      // logout student
      localStorage.removeItem("token");

      // redirect after toast
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }

    return Promise.reject(error);
  }
);

export default api;
