"use client";

import React, { useState, useEffect } from "react";
import { Film, Ticket, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const READ_IDS_BASE_KEY = "noti_read_ids";

// Get the localStorage key for a specific profile
const getReadIdsKey = (profileId?: string) =>
  profileId ? `${READ_IDS_BASE_KEY}_${profileId}` : READ_IDS_BASE_KEY;

interface Notification {
  id: string;
  type: "movie" | "coupon";
  title: string;
  description: string;
  image: string;
  time: string;
  is_new_this_week?: boolean;
  is_new_today?: boolean;
}

interface NotiNavbarProps {
  profileId?: string; // user's profile id — used to separate readIds per user
  onDataLoaded?: (unreadCount: number) => void;
  onClose?: () => void;
}

const isToday = (date: Date) => {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const isWithinDays = (date: Date, days: number) => {
  const now = new Date().getTime();
  return date.getTime() >= now - days * 24 * 60 * 60 * 1000;
};

const formatRelativeTime = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.log("Invalid date:", dateString);
    return "";
  }

  try {
    return formatDistanceToNow(date, { addSuffix: false, locale: th })
      .replace("ประมาณ ", "")
      .replace("ที่แล้ว", "");
  } catch (e) {
    return "";
  }
};

// Load readIds from localStorage (per profile)
const loadReadIds = (profileId?: string): Set<string> => {
  try {
    const stored = localStorage.getItem(getReadIdsKey(profileId));
    if (stored) return new Set(JSON.parse(stored));
  } catch {}
  return new Set();
};

// Save readIds to localStorage (per profile)
const saveReadIds = (ids: Set<string>, profileId?: string) => {
  try {
    localStorage.setItem(getReadIdsKey(profileId), JSON.stringify(Array.from(ids)));
  } catch {}
};

export default function NotiNavbar({ profileId, onDataLoaded, onClose }: NotiNavbarProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "movie" | "coupon">("all");
  const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState<{
    all: Notification[];
    movie: Notification[];
    coupon: Notification[];
  }>({ all: [], movie: [], coupon: [] });
  const [loading, setLoading] = useState(true);
  // Per-notification read tracking
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Load readIds on mount — scoped to this profile
  useEffect(() => {
    setReadIds(loadReadIds(profileId));
  }, [profileId]);

  const handleTabChange = (tab: "all" | "movie" | "coupon") => {
    setActiveTab(tab);
    setShowAll(false);
  };

  const handleSeeAll = () => {
    setShowAll(true);
  };

  const markAsRead = (noti: Notification) => {
    const key = `${noti.type}-${noti.id}`;
    const updated = new Set(readIds);
    updated.add(key);
    setReadIds(updated);
    saveReadIds(updated, profileId); // save with profileId scope
  };

  const handleNotiClick = (noti: Notification) => {
    // Mark this notification as read immediately
    markAsRead(noti);

    if (noti.type === "movie") {
      router.push(`/movies/${noti.id}`);
    } else if (noti.type === "coupon") {
      router.push(`/coupons/${noti.id}`);
    }

    if (onClose) onClose();
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/notifications`);
        if (response.data.success) {
          const data = response.data.data;
          setNotifications(data);

          if (onDataLoaded) {
            // Calculate unread count based on THIS profile's readIds
            const currentReadIds = loadReadIds(profileId);
            const unread = (data.all as Notification[]).filter(
              (n) => !currentReadIds.has(`${n.type}-${n.id}`)
            ).length;
            onDataLoaded(unread);
          }
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Also recalculate unread when readIds change
  useEffect(() => {
    if (onDataLoaded && notifications.all.length > 0) {
      const unread = notifications.all.filter(
        (n) => !readIds.has(`${n.type}-${n.id}`)
      ).length;
      onDataLoaded(unread);
    }
  }, [readIds, notifications]);

  const filteredNotifications = notifications[activeTab] || [];
  // Show 6 initially, all when showAll is true
  const INITIAL_LIMIT = 6;
  const displayNotifications = showAll
    ? filteredNotifications
    : filteredNotifications.slice(0, INITIAL_LIMIT);
  const hasMore = !showAll && filteredNotifications.length > INITIAL_LIMIT;

  return (
    <div
      className="w-full bg-brand-gray-100 border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="text-white text-xl font-bold">Notifications</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-3">
        <button
          onClick={() => handleTabChange("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "all"
              ? "bg-brand-blue-100/20 text-brand-blue-100"
              : "text-brand-gray-300 hover:bg-white/5 cursor-pointer"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleTabChange("movie")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "movie"
              ? "bg-brand-blue-100/20 text-brand-blue-100"
              : "text-brand-gray-300 hover:bg-white/5 cursor-pointer"
          }`}
        >
          Movie
        </button>
        <button
          onClick={() => handleTabChange("coupon")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "coupon"
              ? "bg-brand-blue-100/20 text-brand-blue-100"
              : "text-brand-gray-300 hover:bg-white/5 cursor-pointer"
          }`}
        >
          Coupons
        </button>
      </div>

      <div className="px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-bold text-white">Previous</span>
        {!showAll && (
          <button
            onClick={handleSeeAll}
            className="text-sm font-medium text-brand-blue-100 hover:underline cursor-pointer"
          >
            See All
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[480px] overflow-y-auto custom-scrollbar pb-2">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-brand-gray-300">
            <Loader2 className="animate-spin mb-2" size={32} />
            <span className="text-sm">กำลังโหลด...</span>
          </div>
        ) : displayNotifications.length > 0 ? (
          displayNotifications.map((noti) => {
            const notiKey = `${noti.type}-${noti.id}`;
            // isNew = not yet read by the user (per-ID tracking)
            const isNew = !readIds.has(notiKey);

            const date = new Date(noti.time);
            const isValidDate = !isNaN(date.getTime());

            const isNewMovieToday = isValidDate && noti.type === "movie" && isToday(date);
            const isNewThisWeek = isValidDate && noti.type === "movie" && isWithinDays(date, 7);
            const isNewCoupon = isValidDate && noti.type === "coupon" && isWithinDays(date, 7);

            const displayText =
              noti.type === "movie"
                ? `${noti.title || "หนังใหม่"} เข้าฉายแล้ว!`
                : noti.title || noti.description || "คูปองใหม่";

            return (
              <div
                key={notiKey}
                onClick={() => handleNotiClick(noti)}
                className="group flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors relative"
              >
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 bg-brand-gray-0">
                    <img
                      src={noti.image}
                      alt={noti.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/logo.png";
                      }}
                    />
                  </div>
                  {/* Type Icon Overlay */}
                  <div
                    className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-brand-gray-100 ${
                      noti.type === "movie" ? "bg-brand-blue-100" : "bg-brand-green"
                    }`}
                  >
                    {noti.type === "movie" ? (
                      <Film size={10} className="text-white fill-current" />
                    ) : (
                      <Ticket size={10} className="text-white fill-current" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Badge เข้าฉายวันนี้ */}
                  {isNewMovieToday && (
                    <span className="inline-block text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full mb-1">
                      🎬 เข้าฉายวันนี้!
                    </span>
                  )}
                  {/* Badge ใหม่ภายใน 7 วัน - Movie */}
                  {isNewThisWeek && !isNewMovieToday && (
                    <span className="inline-block text-[10px] font-bold bg-brand-blue-100 text-white px-2 py-0.5 rounded-full mb-1">
                      🆕 ใหม่!
                    </span>
                  )}
                  {/* Badge คูปองใหม่ภายใน 7 วัน */}
                  {isNewCoupon && (
                    <span className="inline-block text-[10px] font-bold bg-brand-green text-white px-2 py-0.5 rounded-full mb-1">
                      🎟️ คูปองใหม่!
                    </span>
                  )}
                  <p
                    className={`text-[13px] leading-snug line-clamp-3 ${
                      isNew ? "text-white" : "text-brand-gray-300"
                    }`}
                  >
                    <span className={isNew ? "font-semibold" : ""}>{displayText}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[12px] font-medium ${
                        isNew ? "text-brand-blue-100" : "text-brand-gray-400"
                      }`}
                    >
                      {formatRelativeTime(noti.time)}
                    </span>
                  </div>
                </div>

                {/* Blue dot — unread indicator, disappears after click */}
                {isNew && (
                  <div className="w-3 h-3 bg-brand-blue-100 rounded-full shrink-0 ml-1 animate-pulse" />
                )}
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center text-brand-gray-300 text-sm">
            ไม่มีการแจ้งเตือน
          </div>
        )}

        {/* See previous notifications button */}
        {hasMore && (
          <div className="px-4 mt-2">
            <button
              onClick={handleSeeAll}
              className="w-full py-2.5 mb-2 text-sm text-white font-medium bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              See previous notifications ({filteredNotifications.length - INITIAL_LIMIT} more)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
