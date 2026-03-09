import React, { useState } from "react";
import Link from "next/link";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import axios from "axios";

export default function ForgotPassword() {

    const [email , setEmail] = useState("");
    const [isLoading , setIsLoading] = useState(false);
    const [isSubmitted , setIsSubmitted] = useState(false);
    const [message , setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: ""});

    const isEmailValid = email.includes("@") && email.includes(".");

    const handleSendResetLink = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);
        setMessage({ type: "", text: "" });

        if (!isEmailValid) return;

        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            // ยิง API ไปหา server เพื่อบอกให้ supabase ส่ง email
            await axios.post(`${apiUrl}/api/auth/forgot-password`, {
                email: email,
            });

            // ถ้าหากสำเร็จ
            setMessage({
                type: "success",
                text: "ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบกล่องจดหมาย"
            });
        } catch (error) {
            const err = error as Error;
            console.error("❌ เกิดข้อผิดพลาด:", err.message);
            setMessage({
                type: "error",
                text: "ไม่สามารถส่งลิงก์ได้ กรุณาตรวจสอบว่าอีเมลนี้มีอยู่ในระบบหรือไม่"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-gray-0 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Forgot Password
                    </h1>
                    <p className="text-brand-gray-300 text-sm sm:text-base">
                        กรอกอีเมลที่คุณใช้สมัครสมาชิกก
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSendResetLink}>
                    <div className="space-y-4 sm:space-y-5">
                        <InputField 
                            label="Email"
                            placeholder="Enter your email"
                            text={email}
                            // เคลียร์ข้อความแจ้งเตือน เมื่อผู้ใช้งานเริ่มพิมใหม่
                            onChange={(val) => { setEmail(val); setMessage({ type: "", text: ""}); }}
                            correct={!isSubmitted || isEmailValid}
                            textTrue=""
                            textFalse="invalid email format"
                            // ปิดการแก้ไข ถ้ากำลังโหลด หรือ ส่งอีเมลสำเร็จไปแล้ว
                            disabled={isLoading || message.type === "success"}
                        />
                    </div>

                    {/* แสดงข้อความ Error หรือ Success */}
                    {message.text && (
                        <p className={`text-sm text-center ${message.type === "success" ? "text-brand-green" : "text-brand-red"}`}>
                            {message.text}
                        </p>
                    )}

                    {/* ซ่อนปุ่มถ้าส่งสำเร็จแล้ว เพื่อไม่ให้ User สับสนและกดส่งรัวๆ */}
                    <div className="pt-2 flex justify-center">
                        {message.type !== "success" && (
                            <Button 
                                variant="primary"
                                type="submit"
                                className="w-full cursor-pointer"
                                disabled={isLoading || (!isEmailValid && isSubmitted)}
                            >
                                <span className="w-full text-center block">
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </span>
                            </Button>
                        )}
                    </div>
                </form>

                <p className="text-center text-brand-gray-300 mt-6 text-sm sm:text-base">
                        Remember your password? {""}
                        <Link href="/login" className="text-white font-semibold hover:underline">
                            Login
                        </Link>
                </p>
            </div>
        </div>
    );
}