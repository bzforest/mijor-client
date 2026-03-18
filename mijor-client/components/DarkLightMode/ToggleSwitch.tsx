"use client";

import { useState, useEffect } from "react";

const SunRays = () => (
  <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full" aria-hidden="true">
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <line
        key={i}
        x1="20" y1="20"
        x2={20 + 14 * Math.cos((angle * Math.PI) / 180)}
        y2={20 + 14 * Math.sin((angle * Math.PI) / 180)}
        stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round"
        style={{ transformOrigin: "20px 20px", opacity: 0.9 }}
      />
    ))}
  </svg>
);

type Props = {
  alignItems?: string;
};

function ToggleSwitch({ alignItems = "items-start" }: Props) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false); // เพิ่ม State สำหรับเช็คว่า Component โหลดเสร็จหรือยัง

  // 1. ตรวจสอบค่าจาก localStorage และ System Preference ตอนโหลดครั้งแรก
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // ถ้าเคยเซฟไว้ว่า dark หรือ ไม่เคยเซฟแต่เครื่องตั้ง dark ไว้
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  // 2. ซิงค์ค่า .dark กับ <html> และบันทึกลง localStorage เมื่อ isDark เปลี่ยนแปลง
  useEffect(() => {
    if (!mounted) return; // ป้องกันการทำงานก่อนที่ข้อมูลตั้งต้นจะพร้อม

    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light"); // บันทึกค่า
    window.dispatchEvent(new CustomEvent("theme-sync"));
  }, [isDark, mounted]);
 
  // 3. Listen for theme changes from other ToggleSwitch instances
  useEffect(() => {
    const sync = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    window.addEventListener("theme-sync", sync);
    return () => window.removeEventListener("theme-sync", sync);
  }, []);

  // ป้องกัน UI กระพริบ/Error ก่อนเช็คค่าจาก localStorage เสร็จ
  if (!mounted) {
    return <div className={`relative inline-flex flex-col justify-center ${alignItems}`} style={{ width: 64, height: 32 }} />;
  }

  return (
    <div className={`relative inline-flex flex-col justify-center ${alignItems}`}>
      {/* Track */}
      <button
        onClick={() => setIsDark((v) => !v)}
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
        className="relative flex items-center outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-400 rounded-full"
        style={{ width: 64, height: 32, padding: 3, cursor: "pointer", border: "none", background: "none" }}
      >
        {/* Sky background */}
        <span
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            transition: "background 700ms cubic-bezier(0.4, 0, 0.2, 1)",
            background: isDark
              ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
              : "linear-gradient(135deg, #38bdf8 0%, #7dd3fc 50%, #bae6fd 100%)",
            boxShadow: isDark
              ? "inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 10px rgba(0,0,0,0.5)"
              : "inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 10px rgba(56,189,248,0.4)",
          }}
        >
          {/* Stars — visible only in dark mode */}
          {[
            { top: "22%", left: "14%", size: 1.5, delay: "0ms" },
            { top: "55%", left: "22%", size: 1.0, delay: "150ms" },
            { top: "35%", left: "38%", size: 1.2, delay: "80ms" },
            { top: "70%", left: "45%", size: 0.9, delay: "220ms" },
            { top: "18%", left: "52%", size: 1.3, delay: "310ms" },
            { top: "60%", left: "60%", size: 1.0, delay: "60ms" },
          ].map((star, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                top: star.top, left: star.left,
                width: star.size, height: star.size,
                background: "#e2e8f0",
                transition: `opacity 600ms ease ${star.delay}, transform 600ms ease ${star.delay}`,
                opacity: isDark ? 1 : 0,
                transform: isDark ? "scale(1)" : "scale(0)",
                boxShadow: isDark ? `0 0 ${star.size * 2}px ${star.size}px rgba(226,232,240,0.6)` : "none",
              }}
            />
          ))}

          {/* Cloud 1 — bottom right */}
          <span
            className="absolute"
            style={{
              bottom: "18%",
              right: "8%",
              transition: "opacity 500ms ease, transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: isDark ? 0 : 0.95,
              transform: isDark ? "translateX(6px) scale(0.8)" : "translateX(0) scale(1)",
              pointerEvents: "none",
            }}
          >
            <svg width="16" height="8" viewBox="0 0 28 14" fill="none">
              <ellipse cx="14" cy="10" rx="13" ry="4" fill="white" fillOpacity="0.9" />
              <ellipse cx="10" cy="8" rx="7" ry="5" fill="white" fillOpacity="0.9" />
              <ellipse cx="17" cy="7" rx="6" ry="4.5" fill="white" fillOpacity="0.9" />
            </svg>
          </span>

          {/* Cloud 2 — top right */}
          <span
            className="absolute"
            style={{
              top: "13%",
              right: "10%",
              transition: "opacity 500ms ease 80ms, transform 600ms cubic-bezier(0.4, 0, 0.2, 1) 80ms",
              opacity: isDark ? 0 : 0.72,
              transform: isDark ? "translateX(6px) scale(0.8)" : "translateX(0) scale(1)",
              pointerEvents: "none",
            }}
          >
            <svg width="12" height="6" viewBox="0 0 20 10" fill="none">
              <ellipse cx="10" cy="7" rx="9" ry="3" fill="white" fillOpacity="0.85" />
              <ellipse cx="7" cy="5" rx="5" ry="4" fill="white" fillOpacity="0.85" />
              <ellipse cx="13" cy="5" rx="4.5" ry="3.5" fill="white" fillOpacity="0.85" />
            </svg>
          </span>
        </span>

        {/* Thumb */}
        <span
          className="relative z-10 flex items-center justify-center rounded-full flex-shrink-0"
          style={{
            width: 26, height: 26,
            transition: "transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: isDark ? "translateX(32px)" : "translateX(0px)",
            background: isDark
              ? "linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%)"
              : "linear-gradient(145deg, #fef08a 0%, #fbbf24 60%, #f59e0b 100%)",
            boxShadow: isDark
              ? "0 2px 6px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.5)"
              : "0 2px 6px rgba(251,191,36,0.55), 0 0 0 1px rgba(255,255,255,0.25), inset 0 1px 0 rgba(255,255,255,0.5), 0 0 12px 2px rgba(253,224,71,0.35)",
          }}
        >
          {/* Sun */}
          <span
            className="absolute inset-0"
            style={{
              transition: "opacity 400ms ease, transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: isDark ? 0 : 1,
              transform: isDark ? "rotate(-30deg) scale(0.7)" : "rotate(0deg) scale(1)",
            }}
          >
            <SunRays />
            <span
              className="absolute rounded-full"
              style={{
                inset: "28%",
                background: "radial-gradient(circle, #fef9c3 0%, #fde68a 60%, #fbbf24 100%)",
                boxShadow: "0 0 4px 1px rgba(253,224,71,0.5)",
              }}
            />
          </span>

          {/* Moon */}
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transition: "opacity 400ms ease 100ms, transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: isDark ? 1 : 0,
              transform: isDark ? "rotate(0deg) scale(1)" : "rotate(30deg) scale(0.7)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <defs>
                <mask id="moon-mask">
                  <rect width="24" height="24" fill="white" />
                  <circle cx="16" cy="8" r="8" fill="black" />
                </mask>
              </defs>
              <circle cx="12" cy="12" r="9" fill="#94a3b8" mask="url(#moon-mask)" />
              <circle cx="8" cy="15" r="1.4" fill="#64748b" opacity="0.5" mask="url(#moon-mask)" />
              <circle cx="11" cy="10" r="0.9" fill="#64748b" opacity="0.4" mask="url(#moon-mask)" />
            </svg>
          </span>
        </span>
      </button>

      {/* Ambient glow */}
      <span
        className="absolute rounded-full"
        style={{
          bottom: -10,
          width: 48, height: 4,
          filter: "blur(6px)",
          transition: "background 700ms ease, opacity 700ms ease",
          background: isDark
            ? "radial-gradient(ellipse, #6366f1 0%, transparent 70%)"
            : "radial-gradient(ellipse, #fbbf24 0%, transparent 70%)",
          opacity: 0.5,
          pointerEvents: "none"
        }}
      />
    </div>
  );
}

export default ToggleSwitch;