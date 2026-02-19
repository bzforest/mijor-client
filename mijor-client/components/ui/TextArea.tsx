type TextAreaProp = {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

function TextArea({ label, placeholder, value, onChange }: TextAreaProp) {
    return (
        <div className="flex flex-col gap-[10px]">
            {/* ===== Label ===== */}
            <label className="text-body-2 text-brand-gray-400">
                {label}
            </label>

            {/* ===== Textarea ===== */}
            <textarea
                rows={4}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="
            pl-[8px] pr-[2px]
            pt-[8px] pb-[2px]
            text-body-2
            placeholder:text-brand-gray-300
            border border-brand-gray-200
            rounded-[4px]
            focus:border-brand-gray-300
            focus:outline-none
        "
            />
        </div>

    )
}

export default TextArea;