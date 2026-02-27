"use client";

import React from "react";

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  divider?: boolean; // 👉 ถ้า true = มีเส้นด้านล่าง item นี้
  danger?: boolean;
  onclick?: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
  mobile?: boolean;
  onClick?:() => void
  className?: string;
}

export default function Dropdown({
  items,
  mobile = false,
  onClick,
  className = "",
}: DropdownProps) {
  return (
    <div
      className={
        mobile
          ? "w-full text-white p-6"
          : `absolute right-0 mt-3 w-56 bg-brand-gray-0 text-white rounded-xl shadow-lg p-2 border border-white/10 ${className}`
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
              onClick={() => {
                item.onclick?.();
                onClick?.();
              }}
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