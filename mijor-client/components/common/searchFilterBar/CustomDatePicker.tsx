"use client";

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { formatDisplayDate, toDateString, parseDateString } from "./shared"

interface CustomDatePickerProps {
    value: string;
    onChange: (val: string) => void;
    className: string;
}

export function CustomDatePicker({ value, onChange, className }: CustomDatePickerProps) {
    const [open, setOpen] = React.useState(false)
    const selectedDate = parseDateString(value)
    const [month, setMonth] = React.useState<Date | undefined>(selectedDate || new Date())

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={`${className} flex justify-between items-center text-left font-normal text-white`}
                >
                    <span className="truncate">
                        {value ? formatDisplayDate(selectedDate) : "All date"}
                    </span>
                    <CalendarIcon className="w-4 h-4 opacity-50 shrink-0 ml-2" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0 border border-brand-gray-200 bg-brand-gray-0 text-white shadow-2xl rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 w-fit"
                align="start"
                sideOffset={4}
            >
                <div className="p-1">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(newDate) => {
                            onChange(toDateString(newDate))
                            setOpen(false)
                        }}
                        initialFocus
                        className="rounded-md border-none"
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
