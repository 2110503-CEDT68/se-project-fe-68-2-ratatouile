"use client"
import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function TimePickers({onTimeChange}:{onTimeChange:Function}) {
  const [bookingTime, setBookingTime] = useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <div className="text-[#3D220F] mb-1">Time</div>

        {/* <TimePicker
          value={bookingTime}
          onChange={(value) => {
            setBookingTime(value);
            onTimeChange(value);
          }}
          format="HH:mm"
          className="bg-[#D9C89C]/30 w-full"
          sx={{ borderColor: "#fff" }}
        /> */}

        <TimePicker
        value={bookingTime}
        format="HH:mm"
        onChange={(value) => {
            setBookingTime(value);
            onTimeChange(value);
          }}
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