"use client";

import Image from "next/image";
import { Star } from "lucide-react";

interface ReviewProps {
  userName: string;
  userImage?: string;
  date: string;
  content: string;
  rating?: number;
}

export default function Review({
  userName,
  userImage,
  date,
  content,
  rating = 5,
}: ReviewProps) {
  return (
    <div className="w-full bg-brand-gray-100 rounded-2xl p-6 text-white">

      {/* Top Section */}
      <div className="flex justify-between items-start">

        {/* Left: Avatar + Name */}
        <div className="flex items-center gap-4">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-lg font-bold">
              {userName.charAt(0)}
            </div>
          )}

          <div>
            <p className="font-semibold">{userName}</p>
            <p className="text-sm text-brand-gray-400">{date}</p>
          </div>
        </div>

        {/* ⭐ Desktop Stars */}
        <div className="hidden md:flex gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={20}
              fill={index < rating ? "#4E7BEE" : "transparent"}
              stroke="#4E7BEE"
            />
          ))}
        </div>
      </div>

      {/* ⭐ Mobile Stars (อยู่กลาง ระหว่าง date กับ content) */}
      <div className="flex justify-center mt-4 md:hidden gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={20}
            fill={index < rating ? "#4E7BEE" : "transparent"}
            stroke="#4E7BEE"
          />
        ))}
      </div>

      {/* Content */}
      <p className="mt-4 text-brand-gray-300 leading-relaxed text-center md:text-left">
        {content}
      </p>
    </div>
  );
}