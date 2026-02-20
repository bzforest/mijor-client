"use client";

import { InputHTMLAttributes } from "react";

interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export default function Radio({
  label,
  checked = false,
  disabled = false,
  ...props
}: RadioProps) {
  return (
    <label
      className={`
        flex items-center gap-3 select-none
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <div className="relative flex items-center justify-center">
        {/* Hidden Native Input */}
        <input
          type="radio"
          checked={checked}
          disabled={disabled}
          className="sr-only"
          {...props}
        />

        {/* Outer Circle */}
        <div
          className={`
            w-5 h-5 rounded-full border-2
            flex items-center justify-center
            transition-all duration-200
            ${
              checked
                ? "border-brand-blue-100"
                : "border-brand-gray-300"
            }
          `}
        >
          {/* Inner Dot */}
          {checked && (
            <div className="w-2.5 h-2.5 rounded-full bg-brand-blue-100" />
          )}
        </div>
      </div>

      {/* Label */}
      <span
        className={`
          text-body-1
          ${disabled ? "text-brand-gray-300" : "text-white"}
        `}
      >
        {label}
      </span>
    </label>
  );
}
