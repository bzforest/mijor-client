type ButtonVariant = "primary" | "secondary" | "text";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled,
  type,
}: ButtonProps) {
  // base Styles
  const baseStyles =
    "flex items-center justify-center w-fit h-[48px] px-[40px] py-[12px] gap-[6px] rounded-[4px] text-[16px] font-[700] leading-[24px] transition-all duration-200 border text-white";

  // variant Styles
  const variantStyles = {
    primary:
      "bg-brand-blue-100 border-brand-blue-100 hover:bg-brand-blue-200 hover:border-brand-blue-200 active:bg-brand-blue-300",
    secondary:
      "border-brand-gray-300 hover:bg-brand-gray-300 active:bg-brand-gray-200 active:border-brand-gray-200",
    text: "underline border-transparent hover:text-brand-gray-400 active:text-brand-gray-300",
  };

  // disabled
  const disabledStyle = disabled ? "pointer-events-none opacity-30" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyle} ${className}`.trim()}
      type={type}
    >
      {children}
    </button>
  );
}
