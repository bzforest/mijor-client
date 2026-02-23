type ButtonVariant = "primary" | "secondary" | "text";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  state?: "default" | "hover" | "active" | "disabled";
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled,
  type,
  state = "default",
}: ButtonProps) {
  // base Styles
  const baseStyles =
    "flex items-center justify-center w-fit h-[48px] gap-[6px] rounded-[4px] text-[16px] font-[700] leading-[24px] transition-all duration-200";

  // 2. ปรับชุดสี
  const variantStyles = {
    primary: {
      default: "bg-brand-blue-100 border border-brand-blue-100 text-white px-[40px] py-[12px]",
      hover: "bg-brand-blue-200 border border-brand-blue-200 text-white px-[40px] py-[12px]",
      active: "bg-brand-blue-300 border border-brand-blue-300 text-white px-[40px] py-[12px]",
      disabled:
        "bg-brand-blue-100 border border-brand-blue-100 text-white opacity-30 cursor-not-allowed pointer-events-none px-[40px] py-[12px]",
    },
    secondary: {
      default: "bg-transparent border border-brand-gray-300 text-white px-[40px] py-[12px]",
      hover: "bg-brand-gray-300 border border-brand-gray-300 text-white px-[40px] py-[12px]",
      active: "bg-brand-gray-200 border border-brand-gray-200 text-white px-[40px] py-[12px]",
      disabled:
        "bg-transparent border border-brand-gray-300 text-white opacity-30 cursor-not-allowed pointer-events-none px-[40px] py-[12px]",
    },
    text: {
      default: "bg-transparent border border-transparent underline text-white",
      hover:
        "bg-transparent border border-transparent underline text-brand-gray-400",
      active:
        "bg-transparent border border-transparent underline text-brand-gray-300",
      disabled:
        "bg-transparent border border-transparent underline text-white opacity-30 cursor-not-allowed pointer-events-none",
    },
  };

  // 3. ปรับ Interactive Styles
  const interactiveStyles =
    state === "default"
      ? {
          primary:
            "hover:bg-brand-blue-200 hover:border-brand-blue-200 active:bg-brand-blue-300",
          secondary: "hover:bg-brand-gray-300 active:bg-brand-gray-200",
          text: "hover:text-brand-gray-400 active:text-brand-gray-300",
        }[variant]
      : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles} 
        ${variantStyles[variant][state]} 
        ${interactiveStyles} 
        ${className}`.trim()}
      type={type}
    >
      {children}
    </button>
  );
}
