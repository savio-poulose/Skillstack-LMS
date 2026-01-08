import { useState } from "react";
// import axios from "axios";
import api from "../api";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.includes("@")) newErrors.email = "Enter a valid email";
    if (phone.length !== 10) newErrors.phone = "Phone must be 10 digits";
    if (!age || age < 10 || age > 100) newErrors.age = "Invalid age";
    if (!gender) newErrors.gender = "Please select gender";
    if (!role) newErrors.role = "Please select role";
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    } else {
      const strongPasswordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

      
      if (!strongPasswordRegex.test(password)) {
        toast.error(
          "Password must include uppercase, lowercase, number, and symbol"
        );
        newErrors.password =
          "Password must include uppercase, lowercase, number, and symbol";
      }
    }

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //  console.log("HANDLE SUBMIT FIRED");

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      console.log("API call sending...");
      const res = await api.post("/auth/register", {
        name,
        email,
        phone,
        age,
        gender,
        password,
        role,
      });

      toast.success(res.data.message);

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md ">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <input
            type="number"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}

          <div className="flex items-center gap-6">
            {/* Male */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
                className="h-4 w-4"
              />
              <span>Male</span>
            </label>

            {/* Female */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
                className="h-4 w-4"
              />
              <span>Female</span>
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

          <div className="password-field flex items-center gap-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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

          <div className="comfirm-password-field flex items-center gap-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Comfirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="flex-1 border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="px-3 py-2 text-sm border rounded bg-gray-200 hover:bg-gray-300 w-16 text-center"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-3 rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="text-center text-sm mt-4">
          already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#2563EB] cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
