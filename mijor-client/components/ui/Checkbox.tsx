"use client";

import { InputHTMLAttributes } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export default function Checkbox({
  label,
  checked = false,
  disabled = false,
  ...props
}: CheckboxProps) {
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
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />

        {/* Custom Box */}
        <div
          className={`
            w-5 h-5 rounded border flex items-center justify-center
            transition-all duration-200
            ${
              checked
                ? "bg-brand-blue-100 border-brand-blue-100"
                : "border-brand-gray-300"
            }
          `}
        >
          {/* Check Icon */}
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.42 0l-3.2-3.2a1 1 0 011.42-1.42l2.49 2.49 6.49-6.49a1 1 0 011.42 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Label */}
      <span
        className={`
          text-body-2
          ${disabled ? "text-brand-gray-300" : "text-white"}
        `}
      >
        {label}
      </span>
    </label>
  );
}
