"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { History, Ticket, User, Key, LogOut, Menu, X, ChevronDown, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import ToggleSwitch from "@/components/DarkLightMode/ToggleSwitch";
import axios from "axios";
import Dropdown from "./dropdown";
import NotiNavbar from "./notiNavbar";

export default function Navbar() {
  const router = useRouter();
  const { user, logout, navigateToLogin } = useAuth();

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
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Function to fetch unread count scoped to this user
  const fetchUnreadCount = async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications`);
      if (response.data.success) {
        const allNotis = response.data.data.all;
        
        // Load read IDs for this specific profile
        const storageKey = `noti_read_ids_${userId}`;
        const stored = localStorage.getItem(storageKey);
        const readIds = stored ? new Set(JSON.parse(stored)) : new Set();
        
        // Calculate unread
        const unread = allNotis.filter((n: any) => !readIds.has(`${n.type}-${n.id}`)).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setIsNotiOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recalculate unread count when user changes or noti is toggled closed
  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount(user.id);
    } else {
      setUnreadCount(0);
    }
  }, [user, isNotiOpen]);

  const handleNotiDataLoaded = (count: number) => {
    setUnreadCount(count);
  };

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const syncTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    window.addEventListener("theme-sync", syncTheme);
    return () => window.removeEventListener("theme-sync", syncTheme);
  }, []);

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
      onclick: () => router.push("/user-manage/booking-history"),
    },
    {
      label: "My coupons",
      icon: <Ticket size={18} />,
      onclick: () => router.push("/user-manage/my-coupons"),
    },
    {
      label: "Profile",
      icon: <User size={18} />,
      onclick: () => router.push("/user-manage/profile"),
    },
    {
      label: "Reset password",
      icon: <Key size={18} />,
      divider: true,
      onclick: () => router.push("/user-manage/reset-password"),
    },
    {
      label: isDark ? "Light mode" : "Dark mode",
      icon: <ToggleSwitch />,
      divider: true,
      onclick: () => {
        const root = document.documentElement;
        const isDarkNow = root.classList.contains("dark");
        root.classList.toggle("dark", !isDarkNow);
        localStorage.setItem("theme", !isDarkNow ? "dark" : "light");
        window.dispatchEvent(new CustomEvent("theme-sync"));
      },
    },
    {
      label: "Log out",
      icon: <LogOut size={18} />,
      danger: true,
      onclick: logout,
    },
  ];

  const closeAll = () => {
    setIsNotiOpen(false);
    setIsMobileOpen(false);
    setIsOpen(false);
  };

  return (
    <header
      className="
      sticky top-0 left-0 w-full z-100 
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
          className="object-contain cursor-pointer"
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
                className="px-5 py-2 border border-white/20 rounded-md text-white hover:bg-white/10 transition-colors"
                onClick={() => router.push("/register")}
              >
                Register
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="relative" ref={notiRef}>
                <button
                  onClick={() => setIsNotiOpen(!isNotiOpen)}
                  className={`relative p-2 rounded-full transition-all duration-200 outline-none ${
                    isNotiOpen ? "bg-white/10 text-white" : "text-brand-gray-300 hover:text-white"
                  }`}
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-brand-red text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-brand-gray-0 transform translate-x-1/4 -translate-y-1/4">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {isNotiOpen && (
                  <div className="absolute top-[calc(100%+8px)] right-0 w-[360px] z-100">
                    <NotiNavbar 
                      profileId={user?.id}
                      onDataLoaded={handleNotiDataLoaded}
                    />
                  </div>
                )}
              </div>

              {/* User Dropdown */}
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
        ${isMobileOpen ? "max-h-[800px] opacity-100 pb-8" : "max-h-0 opacity-0 pointer-events-none"}
      `}
      >
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
              <div className="flex items-center justify-between p-8 pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={avatarUrl || "/logo.png"}
                    alt="avatar"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow-xl"
                  />
                  <div className="flex flex-col">
                    <span className="text-xl font-medium text-white">
                      {userName}
                    </span>
                  </div>
                </div>
                
                 <div className="relative" ref={notiRef}>
                   <button 
                    onClick={() => setIsNotiOpen(!isNotiOpen)}
                    className={`p-2 rounded-full transition-all duration-200 outline-none ${
                        isNotiOpen ? "bg-white/10 text-white" : "text-brand-gray-300 hover:text-white"
                      }`}
                   >
                      <Bell size={32} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-6 h-6 bg-brand-red text-white text-[12px] font-bold flex items-center justify-center rounded-full border-2 border-[#1a1d2d]">
                          {unreadCount}
                        </span>
                      )}
                   </button>
                   {isNotiOpen && (
                    <div className="fixed inset-x-0 top-[160px] px-4 z-100">
                        <NotiNavbar 
                          profileId={user?.id}
                          onDataLoaded={handleNotiDataLoaded}
                          onClose={closeAll}
                        />
                    </div>
                  )}
                </div>
              </div>
              <Dropdown items={dropdownItems} mobile />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

