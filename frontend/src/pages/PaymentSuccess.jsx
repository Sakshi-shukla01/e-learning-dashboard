// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const location = useLocation();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get("session_id");
      const courseId = params.get("courseId");

      if (!sessionId || !courseId) {
        console.error("Missing session_id or courseId");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/payment/verify?session_id=${sessionId}&courseId=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          // ✅ Mark purchased in localStorage
          const purchasedCourses = JSON.parse(
            localStorage.getItem("purchasedCourses") || "[]"
          );
          if (!purchasedCourses.includes(courseId)) {
            purchasedCourses.push(courseId);
            localStorage.setItem(
              "purchasedCourses",
              JSON.stringify(purchasedCourses)
            );
          }

          setVerified(true);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    };

    verifyPayment();
  }, [location]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>✅ Payment Successful!</h1>
      {verified ? (
        <>
          <p>Your course has been successfully unlocked!</p>
          <p>You can now access it from the <strong>Explore Courses</strong> section.</p>
        </>
      ) : (
        <>
          <p>Verifying your payment and unlocking your course...</p>
          <p>Please wait a moment ⏳</p>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
