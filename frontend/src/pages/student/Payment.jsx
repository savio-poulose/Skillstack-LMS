import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";
import StudentHeader from "../../components/studentComponents/StudentHeader";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [paying, setPaying] = useState(false);
  const [user,setUser] = useState(null);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load course");
        navigate("/student/dashboard");
      }
    };

    fetchCourse();
  }, [id, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();
  }, []);

  const handlePayment = async () => {
    try {
      setPaying(true);

      // 🔥 ONLY CALL PAYMENT
      await api.post(`/payments/fake/${id}`);

      toast.success("Payment successful!");

      navigate("/student/my-courses");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment failed"
      );
    } finally {
      setPaying(false);
    }
  };

  if (!course) return null;

  return (
    <>
      <StudentHeader user={user}/>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
          <h1 className="text-2xl font-bold">
            Pay for {course.title}
          </h1>

          <p className="text-gray-600">
            Course Price
          </p>

          <p className="text-3xl font-bold text-blue-600">
            ₹{course.price}
          </p>

          <button
            onClick={handlePayment}
            disabled={paying}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {paying ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;