"use client";

import React from "react";

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  divider?: boolean; // 👉 ถ้า true = มีเส้นด้านล่าง item นี้
  danger?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  mobile?: boolean;
}

export default function Dropdown({
  items,
  mobile = false,
}: DropdownProps) {
  return (
    <div
      className={
        mobile
          ? "w-full bg-gradient-to-b from-[#0F172A] to-[#020617] text-white p-6"
          : "absolute right-0 mt-3 w-56 bg-[#111827] text-white rounded-xl shadow-lg p-2 border border-white/10"
      }
    >
      <div className="flex flex-col">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <button
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition
                ${
                  item.danger
                    ? mobile
                      ? "text-gray-400"
                      : "text-gray-400 hover:bg-red-500/10"
                    : mobile
                    ? "text-gray-400"
                    : "text-gray-400 hover:bg-white/5"
                }
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>

            {/* 🔥 เส้นอยู่ "ใต้" item ที่มี divider */}
            {item.divider && (
              <div
                className={
                  mobile
                    ? "border-t border-white/10 my-3"
                    : "border-t border-white/10 my-2"
                }
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}