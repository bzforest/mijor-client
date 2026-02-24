import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox"; // 💡 นำเข้า Checkbox
import Alert from "@/components/ui/Alert";       // 💡 นำเข้า Alert
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false); // 💡 State สำหรับ Checkbox Remember
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const router = useRouter();

  const isEmailValid = email.includes("@") && email.includes("."); 
  const isPasswordValid = password.length > 0; 

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setErrorMessage("");

    if (!isEmailValid || !isPasswordValid) return;

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email: email,
        password: password,
      });

      console.log("✅ ล็อกอินผ่าน Backend สำเร็จ:", response.data);
      
      // เก็บ Token ลง localStorage เหมือนเดิม
      if (response.data.session) {
        localStorage.setItem("access_token", response.data.session.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); 
      }

      router.push("/"); 
      
    } catch (error) {
      const err = error as Error; 
      console.error("❌ เกิดข้อผิดพลาด:", err.message);
      // โชว์ Alert Error ตามดีไซน์ Figma
      setErrorMessage("error"); 
    } finally {
      setIsLoading(false);
    }
  };

  // 💡 ตัวแปรช่วยเช็กว่าต้องแสดงกรอบแดงที่ Input ไหม
  // จะแดงก็ต่อเมื่อ Submit แล้วข้อมูลไม่ครบ หรือ มี Error จากฝั่ง Backend โผล่มา
  const isEmailError = (isSubmitted && !isEmailValid) || errorMessage !== "";
  const isPasswordError = (isSubmitted && !isPasswordValid) || errorMessage !== "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-gray-0 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-white mb-8">
          Login
        </h1>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 sm:space-y-5">
            <InputField
              label="Email"
              placeholder="Email"
              text={email}
              onChange={(val) => { setEmail(val); setErrorMessage(""); }} // ถ้าพิมพ์ใหม่ให้เคลียร์ Error
              correct={!isEmailError} // ถ้ามี Error จะส่งค่า false ไปทำให้กรอบแดง
              textTrue="" 
              textFalse="" // เราเอาข้อความยิบย่อยออก เพราะจะไปโชว์ในกล่อง Alert แทน
              disabled={isLoading}
            />

            <InputField
              label="Password"
              placeholder="Password"
              text={password}
              onChange={(val) => { setPassword(val); setErrorMessage(""); }}
              type="password"
              correct={!isPasswordError}
              textTrue="" 
              textFalse=""
              disabled={isLoading}
            />
          </div>

          {/* 💡 แถว Remember และ Forget password? */}
          <div className="flex items-center justify-between mt-2">
            <Checkbox
              label="Remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <Link href="/forgot-password" className="text-sm font-semibold text-white hover:underline">
              Forget password?
            </Link>
          </div>

          <div className="pt-4 flex justify-center">
            <Button 
              variant="primary" 
              type="submit" 
              className="w-full" 
              disabled={isLoading || (!isEmailValid || !isPasswordValid)} // ให้ปุ่มทึบถ้ายังกรอกไม่ครบแบบ Figma
            >
              <span className="w-full text-center block">
                {isLoading ? "Logging in..." : "Login"}
              </span>
            </Button>
          </div>
        </form>

        <p className="text-center text-brand-gray-300 mt-6 text-sm sm:text-base">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-white font-semibold hover:underline">
            Register
          </Link>
        </p>

        {/* 💡 กล่อง Alert แสดง Error วางไว้ล่างสุดตาม Figma */}
        {errorMessage && (
          <div className="mt-6">
            <Alert
              type="error"
              title="Your password is incorrect or this email doesn't exist"
              message="Please try another password or email"
              onClose={() => setErrorMessage("")}
            />
          </div>
        )}

      </div>
    </div>
  );
}