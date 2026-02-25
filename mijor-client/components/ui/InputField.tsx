import { Search, X } from "lucide-react";

type InputFieldProps = {
    disabled?: boolean;
    label: string;
    text: string;
    placeholder: string;
    textTrue?: string;
    textFalse?: string;
    correct?: boolean;
    search?: boolean;
    onSearch?: () => void;
    onClear?: () => void;
    onChange?: (value: string) => void;
    type?: string;
}

function InputField({
    disabled,
    label,
    text,
    textTrue,
    textFalse,
    placeholder,
    correct,
    search,
    onSearch,
    onClear,
    onChange,
}: InputFieldProps) {
    return (
        <div
            className={`flex flex-col gap-[4px] ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            {/* ===== Label ===== */}
            <label className={`text-body-2 text-brand-gray-400 ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}>
                {label}
            </label>

            {/* ===== Input Wrapper ===== */}
            <div className="relative">
                {/* ================= Search Button ================= */}
                {search && (
                    <button
                        onClick={onSearch}
                        disabled={disabled}
                        className={`
                            absolute left-[16px] top-1/2 -translate-y-1/2
                            text-brand-gray-300
                            ${
                                disabled
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer hover:text-white"
                            }
                            disabled:cursor-not-allowed
                        `}
                    >
                        <Search size={24} />
                    </button>
                )}

                {/* ================= Text Input ================= */}
                <input
                    type="text"
                    value={text}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={(e) => onChange?.(e.target.value)}
                    className={`
                        w-full bg-brand-gray-100
                        py-[12px] pr-[40px]
                        ${search ? "pl-[48px]" : "pl-[16px]"}
                        rounded-[4px]
                        text-white border
                        placeholder:text-brand-gray-300
                        ${
                            correct
                                ? "border-brand-gray-300"
                                : "border-brand-red"
                        }
                        focus:border-brand-gray-200
                        focus:text-white
                        focus:outline-none
                        ${disabled ? "cursor-not-allowed" : ""}
                    `}
                />

                {/* ================= Clear Button ================= */}
                <button
                    type="button"
                    onClick={onClear}
                    disabled={disabled}
                    className={`
                        absolute right-[12px] top-1/2 -translate-y-1/2
                        text-brand-gray-300 hover:text-white
                        ${
                            disabled
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                        }
                    `}
                >
                    <X size={24} />
                </button>
            </div>

            {/* ===== Validation Message ===== */}
            <p
                className={`text-body-3 ${
                    correct ? "text-brand-gray-300" : "text-brand-red"
                }`}
            >
                {correct ? textTrue : textFalse}
            </p>
        </div>
    );
}

export default InputField;
