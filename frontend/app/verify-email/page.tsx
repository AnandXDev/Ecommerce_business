"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmailVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromUrl = searchParams.get("email");
  const tokenFromUrl = searchParams.get("token"); // ✅ NEW

  const [email, setEmail] = useState(emailFromUrl || "");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔥 AUTO VERIFY WITH TOKEN (EMAIL LINK)
  useEffect(() => {
    if (tokenFromUrl) {
      verifyWithToken();
    }
  }, [tokenFromUrl]);

  const verifyWithToken = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/auth/verify-email?token=${tokenFromUrl}`
      );

      alert("✅ Email verified successfully");

      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("❌ Invalid or expired verification link");
    } finally {
      setLoading(false);
    }
  };

  // 🔢 SEND OTP
  const sendOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        { email }
      );

      alert(res.data.message);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };

  // 🔢 VERIFY OTP
  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );

      alert(res.data.message);
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    }
  };

  // 🔥 LOADING STATE (for token verification)
  if (loading) {
    return <h2 style={{ padding: "20px" }}>Verifying email...</h2>;
  }

  // 🔢 UI
  return (
    <div style={{ padding: "20px" }}>
      <h2>Email Verification</h2>

      {/* 👉 TOKEN MODE (no UI needed) */}
      {tokenFromUrl ? (
        <p>Verifying your email...</p>
      ) : (
        <>
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <br /><br />

              <button onClick={sendOtp}>Send OTP</button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <br /><br />

              <button onClick={verifyOtp}>Verify OTP</button>
            </>
          )}
        </>
      )}
    </div>
  );
}