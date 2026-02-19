"use client";

import { useState } from "react";

type AlertType = "error" | "success";

interface AlertProps {
  type?: AlertType;
  title: string;
  message: string;
  showButton?: boolean;
  onClose?: () => void;
}

export default function Alert({
  type = "error",
  title,
  message,
  showButton = true,
  onClose,
}: AlertProps) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  const bgColor: Record<AlertType, string> = {
    error: "bg-[var(--color-brand-red)]/60",
    success: "bg-[var(--color-brand-green)]/60",
  };

  return (
    <div
      className={`
        w-[480px]
        h-[100px]
        flex
        justify-between
        items-start
        p-4
        gap-3
        rounded
        backdrop-blur-[20px]
        text-white
        ${bgColor[type]}
      `}
    >
      <div className="flex flex-col">
        <h3 className="text-body-1">{title}</h3>
        <p className="text-body-2 opacity-90">{message}</p>
      </div>

      {showButton && (
         <button
         onClick={() => {
           setOpen(false); 
           onClose?.();          
         }}
         className="text-body-1-bold hover:opacity-70 transition"
       >
          ✕
        </button>
      )}
    </div>
  );
}
