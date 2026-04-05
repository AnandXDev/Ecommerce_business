  "use client";

  import { useState, useEffect } from "react";
  import axios from "axios";
  import { useRouter, useSearchParams } from "next/navigation";

  export default function EmailVerify() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const emailFromUrl = decodeURIComponent(searchParams.get("email") || "");
    const tokenFromUrl = searchParams.get("token");

    const [email, setEmail] = useState(emailFromUrl.trim().toLowerCase());
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (tokenFromUrl) {
        verifyWithToken();
      }
    }, [tokenFromUrl]);

    const verifyWithToken = async () => {
      try {
        setLoading(true);

        await axios.get(
          `${API_URL}/api/auth/verify-email?token=${tokenFromUrl}`
        );

        alert("✅ Email verified successfully");
        router.push("/login");

      } catch (err: any) {
        console.error(err);

        alert(
          err?.response?.data?.message ||
          "❌ Invalid or expired verification link"
        );

      } finally {
        setLoading(false);
      }
    };

    const sendOtp = async () => {
      if (!email) {
        alert("Please enter email");
        return;
      }

      try {
        const res = await axios.post(
          `${API_URL}/api/auth/send-otp`,
          { email }
        );

        alert(res.data.message);
        setStep(2);

      } catch (err: any) {
        console.error(err);

        alert(
          err?.response?.data?.message ||
          "Error sending OTP"
        );
      }
    };

    const verifyOtp = async () => {
      if (!otp) {
        alert("Enter OTP");
        return;
      }

      try {
        const res = await axios.post(
          `${API_URL}/api/auth/verify-otp`,
          { email, otp }
        );

        alert(res.data.message);
        router.push("/login");

      } catch (err: any) {
        console.error(err);

        alert(
          err?.response?.data?.message ||
          "Invalid OTP"
        );
      }
    };

    if (loading) {
      return <h2 style={{ padding: "20px" }}>Verifying email...</h2>;
    }

    return (
      <div style={{ padding: "20px" }}>
        <h2>Email Verification</h2>

        {tokenFromUrl ? (
          <p>Verifying your email...</p>
        ) : (
          <>
            {step === 1 && (
              <>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  // disabled={step !== 1}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <br /><br />
                <button onClick={sendOtp}>Send OTP</button>
              </>
            )}

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