"use client"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { Dayjs } from "dayjs";
import React, { useState } from "react";

export default function DatePickers({onDateChange}:{onDateChange:Function}) {

    const [bookingDate, setBookingDate] = useState<Dayjs|null>(null)

    return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="">
                    <div className="text-[#3D220F] mb-1">Date</div>
                    <DatePicker
                    value={bookingDate}
                    onChange={(value)=>{setBookingDate(value);onDateChange(value);}}
                    className="w-full"

                    slotProps={{
                        textField: {
                        variant: "outlined",
                        InputProps: {
                            sx: {
                            borderRadius: "16px",
                            backgroundColor: "rgba(217, 200, 156, 0.3)",
                            "& fieldset": {
                                border: "2px solid #3D220F",
                            },
                            "&:hover fieldset": {
                                border: "2px solid #3D220F",
                            },
                            "&.Mui-focused fieldset": {
                                border: "2px solid #3D220F",
                            },
                            },
                        },
                        },
                    }}

                    />
                </div>
            </LocalizationProvider>
    );
}