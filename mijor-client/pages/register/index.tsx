import React, { useState } from "react";
import Link from "next/link";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // 💡 2. สร้าง State เพิ่มสำหรับคุมการ Loading และแสดง Error จาก Backend
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isNameValid = name.trim() !== "";
  const isEmailValid = email.includes("@") && email.includes("."); 
  const isPasswordValid = password.length >= 6;
  
  const router = useRouter();

  // 💡 3. เปลี่ยนเป็น async function
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setErrorMessage(""); // เคลียร์ error เก่าทิ้งก่อน
    setSuccessMessage("");

    // ถ้าข้อมูลไม่ครบ ไม่ต้องยิง API
    if (!isNameValid || !isEmailValid || !isPasswordValid) return;

    setIsLoading(true); // เริ่มหมุนติ้วๆ

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        throw error;
      }

      // 💡 1. เพิ่มโค้ดเช็กตรงนี้ครับ: ถ้า identities เป็น array ว่าง แปลว่าอีเมลนี้มีอยู่แล้ว
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setErrorMessage("อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบหรือใช้อีเมลอื่น");
        return; // สั่งให้หยุดการทำงานแค่นี้ ไม่ต้องไปโชว์ข้อความสีเขียว
      }

      // ถ้าสมัครสำเร็จแบบสดๆ ร้อนๆ
      console.log("✅ สมัครสำเร็จ:", data);
      router.push("/register-success");
      
    } catch (error) {
      const err = error as Error; 
      console.error("❌ เกิดข้อผิดพลาด:", err.message);
      setErrorMessage(err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-gray-0 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-white mb-8">
          Register
        </h1>

        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4 sm:space-y-5">
            <InputField
              label="Name"
              placeholder="Full name"
              text={name}
              onChange={setName}
              correct={!isSubmitted || isNameValid}
              textTrue="" 
              textFalse="Name is required"
              disabled={isLoading} // ล็อกช่องกรอกตอนกำลังโหลด
            />

            <InputField
              label="Email"
              placeholder="Email"
              text={email}
              onChange={setEmail}
              correct={!isSubmitted || isEmailValid}
              textTrue="" 
              textFalse="Invalid email format"
              disabled={isLoading}
            />

            <InputField
              label="Password"
              placeholder="Password"
              text={password}
              onChange={setPassword}
              type="password"
              correct={!isSubmitted || isPasswordValid}
              textTrue="" 
              textFalse="Password must be at least 6 characters"
              disabled={isLoading}
            />
          </div>

          {/* 💡 แสดงข้อความ Error หรือ Success จาก Database */}
          {errorMessage && <p className="text-brand-red text-sm text-center">{errorMessage}</p>}
          {successMessage && <p className="text-brand-green text-sm text-center">{successMessage}</p>}

          <div className="pt-4 flex justify-center">
            {/* 💡 เปลี่ยนข้อความปุ่มตอนกำลังโหลด และ disable ปุ่ม */}
            <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
              <span className="w-full text-center block">
                {isLoading ? "Registering..." : "Register"}
              </span>
            </Button>
          </div>
        </form>

        <p className="text-center text-brand-gray-300 mt-6 text-sm sm:text-base">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}