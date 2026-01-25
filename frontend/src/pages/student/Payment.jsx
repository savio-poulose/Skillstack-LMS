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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch {
        toast.error("Failed to load course");
        navigate("/student/dashboard");
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handlePayment = async () => {
    try {
      setPaying(true);

      await api.post(`/payments/fake/${id}`);
      await api.post(`/enroll/${id}`);

toast.success("Payment & enrollment successful")

      navigate(`/student/my-courses`);
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
      <StudentHeader />

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
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {paying ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
