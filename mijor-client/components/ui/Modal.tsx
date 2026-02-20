import { ReactNode } from "react";
import Button from "./Button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  primaryActionButton?: string;
  secondaryActionButton?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  primaryActionButton,
  secondaryActionButton,
  onPrimaryAction,
  onSecondaryAction,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 1. Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 2. Modal Card */}
      <div className="relative w-full max-w-lg bg-brand-gray-100 border border-brand-gray-200 rounded-[8px] p-6">
        {/* Close Button Icon */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-brand-gray-400 hover:text-white transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Title */}
        <h4 className="text-headline-4 text-white text-center mb-4">{title}</h4>

        {/* Modal Body */}
        <div className="text-body-2 text-brand-gray-400 text-center mb-8 leading-6">
          {children}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {secondaryActionButton && (
            <Button variant="secondary" onClick={onSecondaryAction}>
              {secondaryActionButton}
            </Button>
          )}
          {primaryActionButton && (
            <Button variant="primary" onClick={onPrimaryAction}>
              {primaryActionButton}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
