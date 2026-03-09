"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "./dropdown";
import { History, Ticket, User, Key, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

export default function Navbar() {
  const router = useRouter();
  const { user, logout , navigateToLogin} = useAuth();

  /* ===== state avatar ===== */
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  /* ===== Route Handlers ===== */
  const isActive = (path: string) => router.pathname === path;

  // We are on the root homepage now
  const isHomePage = isActive('/');

  /* ===== Utility Handlers ===== */
  const [name, setName] = useState<string | null>(null);
  const isLoggedIn = !!user;
  const userName = name || user?.email || "";
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const loadAvatar = async () => {
  
      if (!user) return;
  
      const { data } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", user.id)
        .single();
  
      if (data) {
  
        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url + "?t=" + Date.now());
        }
  
        if (data.name) {
          setName(data.name);
        }
  
      }
  
    };
  
    loadAvatar();
  
    /* ===== listen auth change ===== */
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
  
        if (event === "USER_UPDATED" && session?.user) {
  
          const updatedUser = session.user;
  
          if (updatedUser.user_metadata?.avatar_url) {
            setAvatarUrl(updatedUser.user_metadata.avatar_url + "?t=" + Date.now());
          }
  
          if (updatedUser.user_metadata?.name) {
            setName(updatedUser.user_metadata.name);
          }
  
        }
  
      }
    );
  
    return () => {
      listener.subscription.unsubscribe();
    };
  
  }, [user]);

  const dropdownItems = [
    {
      label: "Booking history",
      icon: <History size={18} />,
      onclick: () => router.push("/user-manage/booking-history"), // 🔥 เพิ่ม
    },
    {
      label: "My coupons",
      icon: <Ticket size={18} />,
      onclick: () => router.push("/user-manage/my-coupons"), // 🔥 เพิ่ม
    },
    {
      label: "Profile",
      icon: <User size={18} />,
      onclick: () => router.push("/user-manage/profile"), // 🔥 เพิ่ม
    },
    {
      label: "Reset password",
      icon: <Key size={18} />,
      divider: true,
      onclick: () => router.push("/user-manage/reset-password"), // 🔥 เพิ่ม
    },
    {
      label: "Log out",
      icon: <LogOut size={18} />,
      danger: true,
      onclick: logout,
    },
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
          onClick={() => router.push("/")}
        />

        <div className="hidden md:flex items-center gap-6">
          {!isLoggedIn ? (
            <div className="flex gap-4">
              <button
                className="text-white font-light"
                onClick={navigateToLogin}
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
                  src={avatarUrl || "/logo.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
                <span className="text-white text-sm font-medium">
                  {userName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-brand-gray-300 transform duration-200 ${isOpen ? "-rotate-180" : ""
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
                  src={avatarUrl || "/logo.png"}
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
