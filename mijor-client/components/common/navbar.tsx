"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Dropdown from "./dropdown";
import { History, Ticket, User, Key, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import router from "next/router";

export default function Navbar() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const userName = user?.name || user?.email || "";
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dropdownItems = [
    { label: "Booking history", icon: <History size={18} /> },
    { label: "My coupons", icon: <Ticket size={18} /> },
    { label: "Profile", icon: <User size={18} /> },
    { label: "Reset password", icon: <Key size={18} />, divider: true },
    { label: "Log out", icon: <LogOut size={18} />, danger: true, onclick: logout },
  ];

  return (
    <header
      className="
      sticky top-0 left-0 w-full z-50 
      bg-brand-gray-100/20 backdrop-blur-[15px] 
      border-b border-white/10 
      transition-all duration-300 ease-in-out
      "
    >
      <nav className="w-full h-[80px] px-6 md:px-[80px] flex items-center justify-between relative z-60">
        <Image
          src="/logo.png"
          alt="logo"
          width={36}
          height={36}
          style={{ width: 36, height: 36 }}
          className="object-contain"
          onClick={() => router.push("/landing")}
        />

        <div className="hidden md:flex items-center gap-6">
          {!isLoggedIn ? (
            <div className="flex gap-4">
              <button
                className="text-white font-light"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
              <button
                className="px-5 py-2 border border-white/20 rounded-md text-white hover:bg-white/10"
                onClick={() => router.push("/register")}
              >
                Register
              </button>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 outline-none"
              >
                <img
                  src="/logo.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
                <span className="text-white text-sm font-medium">
                  {userName} 
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-brand-gray-300 transform duration-200 ${
                    isOpen ? "-rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && <Dropdown items={dropdownItems} />}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden text-white outline-none"
        >
          {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      
      <div
        className={`
        md:hidden overflow-hidden transition-all duration-500 ease-in-out
        ${isMobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
      `}
      >
        {/* เส้นแบ่งระหว่าง Navbar กับ Menu */}
        <div className="w-full h-px bg-white/10" />

        <div className="flex flex-col">
          {!isLoggedIn ? (
            <div className="p-8 flex flex-col gap-8">
              <button
                className="text-left text-body-2 font-light text-white/90"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
              <button
                className="text-left text-body-2 font-light text-white/90"
                onClick={() => router.push("/register")}
              >
                Register
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Profile Area */}
              <div className="flex items-center gap-4 p-8">
                <img
                  src="/logo.png"
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow-xl"
                />
                <span className="text-xl font-medium text-white">
                  {userName}
                </span>
              </div>
              <Dropdown items={dropdownItems} mobile />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
