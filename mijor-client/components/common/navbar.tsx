"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Dropdown from "./dropdown";
import {
  History,
  Ticket,
  User,
  Key,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  userImage?: string;
}

export default function Navbar({
  isLoggedIn = false,
  userName = "",
  userImage = "",
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ปิด dropdown เมื่อคลิกข้างนอก (desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownItems = [
    {
      label: "Booking history",
      icon: <History size={18} />,
    },
    {
      label: "My coupons",
      icon: <Ticket size={18} />,
    },
    {
      label: "Profile",
      icon: <User size={18} />,
    },
    {
      label: "Reset password",
      icon: <Key size={18} />,
      divider: true,
    },
    {
      label: "Log out",
      icon: <LogOut size={18} />,
      danger: true,
    },
  ];

  return (
    <>
      {/* 🔥 Navbar */}
      <nav
        className="
        w-full h-[72px] 
        px-6 md:px-[80px] 
        flex items-center justify-between
        bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1F2937]
        border-b border-white/5
      "
      >
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="logo"
          width={36}
          height={36}
          className="object-contain"
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex relative items-center gap-6">
          {!isLoggedIn ? (
            <>
              <button className="text-white hover:opacity-80 transition">
                Login
              </button>
              <button className="px-5 py-2 border border-white/30 rounded-md text-white hover:border-white transition">
                Register
              </button>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3"
              >
                <img
                  src={userImage || "/logo.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />

                <span className="text-white text-sm font-medium opacity-90">
                  {userName}
                </span>

                {/* 🔥 ลูกศร */}
                <svg
                  className={`w-4 h-4 text-white opacity-70 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && <Dropdown items={dropdownItems} />}
            </div>
          )}
        </div>

        {/* Hamburger (Mobile) */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden text-white"
        >
          {isMobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* 🔥 Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden w-full bg-gradient-to-b from-[#0F172A] to-[#020617] text-white">
          {!isLoggedIn ? (
            <div className="p-6 flex flex-col gap-4">
              <button className="text-left">Login</button>
              <button className="text-left">Register</button>
            </div>
          ) : (
            <>
              {/* User Section */}
              <div className="flex items-center gap-4 p-6 border-b border-white/10">
                <img
                  src={userImage || "/logo.png"}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-lg font-medium">
                  {userName}
                </span>
              </div>

              {/* ใช้ Dropdown ตัวเดียวกัน */}
              <Dropdown items={dropdownItems} mobile />
            </>
          )}
        </div>
      )}
    </>
  );
}