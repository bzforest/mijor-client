import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import axios from "axios";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: "" });

  const router = useRouter();

  const isPasswordValid = password.length >= 6;
  const isPasswordMatch = password === confirmPassword;
  const isConfirmPasswordError = isSubmitted && (!isPasswordMatch || confirmPassword === "");
  const isFormDisabled = isLoading || !isPasswordValid || !isPasswordMatch;

  // ดึง access_token ออกมาจาก URL Hash เมื่อหน้าเว็บโหลดขึ้นมา
  useEffect(() => {

    const hash = window.location.hash;
    if (hash) {
      // แปลง Hash เป็น Object เพื่อให้ดึงค่าง่ายๆ
      const hashParams = new URLSearchParams(hash.substring(1));
      const token = hashParams.get("access_token");
      const rToken = hashParams.get("refresh_token");

      if (token) setAccessToken(token);
      if (rToken) setRefreshToken(rToken);
    }
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setMessage({ type: "", text: "" });

    if (!isPasswordValid || !isPasswordMatch) return;

    if (!accessToken) {
      setMessage({ type: "error", text: "ไม่พบข้อมูลยืนยันตัวตน (Token) กรุณากดลิงก์จากอีเมลใหม่อีกครั้ง" });
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // ยิง API ไปหา Backend พร้อมส่งรหัสใหม่และ Token ไปให้
      await axios.post(`${apiUrl}/api/auth/update-password`, {
        password: password,
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      setMessage({ type: "success", text: "เปลี่ยนรหัสผ่านสำเร็จ! ระบบกำลังพาคุณไปหน้าเข้าสู่ระบบ..." });
      
      // เปลี่ยนรหัสเสร็จ รอ 2 วินาทีแล้วเด้งกลับไปหน้า Login
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาด:", error);
      setMessage({ type: "error", text: "ไม่สามารถเปลี่ยนรหัสผ่านได้ ลิงก์อาจหมดอายุแล้ว" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-gray-0 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Set New Password
          </h1>
          <p className="text-brand-gray-300 text-sm sm:text-base">
            กรุณาตั้งรหัสผ่านใหม่ของคุณ (อย่างน้อย 6 ตัวอักษร)
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleUpdatePassword}>
          <div className="space-y-4 sm:space-y-5">
            <InputField
              label="New Password"
              placeholder="Enter new password"
              text={password}
              onChange={(val) => { setPassword(val); setMessage({ type: "", text: "" }); }}
              type="password"
              correct={!isSubmitted || isPasswordValid}
              textTrue=""
              textFalse="Password must be at least 6 characters"
              disabled={isLoading || message.type === "success"}
            />

            <InputField 
              label="Confirm New Password"
              placeholder="Confirm new password"
              text={confirmPassword}
              onChange={(val) => { setConfirmPassword(val); setMessage({ type: "", text: "" }); }}
              type="password"
              correct={!isConfirmPasswordError}
              textTrue=""
              textFalse={isConfirmPasswordError ? "Passwords do not match" : ""}
              disabled={isLoading || message.type === "success"}
            />
          </div>

          {message.text && (
            <p className={`text-sm text-center ${message.type === "success" ? "text-brand-green" : "text-brand-red"}`}>
              {message.text}
            </p>
          )}

          <div className="pt-2 flex justify-center">
            <Button 
              variant="primary" 
              type="submit" 
              className="w-full cursor-pointer" 
              disabled={isFormDisabled || message.type === "success"}
            >
              <span className="w-full text-center block">
                {isLoading ? "Updating..." : "Update Password"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}