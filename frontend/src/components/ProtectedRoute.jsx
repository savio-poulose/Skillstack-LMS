import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔥 QUICK EXIT (prevents useless API call)
    if (!token) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        await api.get("/auth/me"); // token is now attached
        setAuthorized(true);
      } catch (err) {
        setAuthorized(false);
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null;

  return authorized ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
