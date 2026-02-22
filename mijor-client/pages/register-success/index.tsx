import React from "react";
import { useRouter } from "next/router";
import Button from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

export default function RegisterSuccess() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-gray-0 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        
        {/* ไอคอนติ๊กถูกสีเขียว */}
        <div className="text-brand-green">
          <CheckCircle size={80} strokeWidth={1.5} />
        </div>

        {/* ข้อความแสดงความสำเร็จ */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Registration success
          </h1>
          <p className="text-brand-gray-300 text-sm sm:text-base">
            Your account has been successfully created.
          </p>
        </div>

        {/* ปุ่มกลับไปหน้า Login */}
        <div className="w-full pt-4">
          <Button 
            variant="primary" 
            className="w-full" 
            onClick={() => router.push("/login")}
          >
            <span className="w-full text-center block">Go to login</span>
          </Button>
        </div>

      </div>
    </div>
  );
}