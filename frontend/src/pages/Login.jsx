import { useState } from "react";
// import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();

  // states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✨ you will fill this logic!
  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email.trim()) return toast.error("Email is required");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return toast.error("Enter a valid email");

  if (!password.trim()) return toast.error("Password is required");

  setLoading(true);

  try {
    const res = await api.post("/auth/login", { email, password });

    // 🔥 THIS WAS MISSING
    localStorage.setItem("token", res.data.token);

    const role = res.data.user.role;

    if (role === "student") navigate("/student/dashboard");
    if (role === "teacher") navigate("/teacher/dashboard");
    if (role === "admin") navigate("/admin/dashboard");
  } catch (error) {
    toast.error(error.response?.data?.message || "Invalid login details");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-100
">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* EMAIL INPUT */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* PASSWORD INPUT + SHOW/HIDE */}
          <div className="flex items-center gap-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="flex-1 border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-3 py-2 text-sm border rounded bg-gray-200 hover:bg-gray-300 w-16 text-center"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-3 rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Link to Register */}
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#2563EB] cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
