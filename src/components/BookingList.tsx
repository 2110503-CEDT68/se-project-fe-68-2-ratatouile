"use client";
import { ReservationItem } from "../../interface";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import BookingCard from "./BookingCard";
import { apiUrl } from "@/libs/apiUrl";

export default function BookingList() {
  const { data: session } = useSession();

  const [bookItems, setBookItems] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const removeBookingFromState = (id: string) => {
    setBookItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  useEffect(() => {
    async function fetchData() {
      if (!session || !session.user.token) return;

      try {
        const response = await fetch(apiUrl("/api/v1/reservations"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text(); // อ่านเป็นข้อความธรรมดาแทน JSON
          console.error("Server returned error HTML:", errorText);
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setBookItems(result.data);
          console.log("Actual Data:", result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session]);

  return (
    <div className="relative min-h-screen overflow-hidden pt-13">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&family=Sarabun:wght@300;400;500&display=swap');`}</style>

      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/img/4.png"
          alt="Background"
          className="w-full h-full object-cover scale-110 blur-xs brightness-75"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(to bottom right, #000000, #76652D)",
          opacity: 0.45,
        }}
      />

      {loading ? (
        <p className="text-center text-white/70 text-lg mt-30"> {(!session || !session.user.token) ? "Please sign-in to continue" : "Loading..."}</p>
      ) : (
        <div
          className="max-w-5xl mx-auto px-6 pt-6 pb-20 relative scroll"
          style={{ fontFamily: "'Jost', 'Sarabun', sans-serif" }}
        >
          {/* Create Booking Button */}
          <div className="absolute px-10 pt-13 right-6 -top-1">
            <Link
              href="/booking"
              className="px-8 py-3 rounded-full text-[#1A0F08] text-sm tracking-[0.18em] uppercase font-bold
                        transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg border border-[#C9A96E]/50"
              style={{
                background: "linear-gradient(135deg, #E8D9A0, #C9A96E)",
                fontFamily: "'Jost', 'Sarabun', sans-serif",
                letterSpacing: "0.18em",
              }}
            >
              create booking
            </Link>
          </div>

          {/* Main container */}
          {bookItems.length === 0 ? (
            <div
              className="mt-10 rounded-4xl p-16 text-center"
              style={{ background: "#73683B", border: "2px solid #D9C89C" }}
            >
              <p
                className="text-[#D9C89C] text-xl tracking-widest uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                No Reservations Found
              </p>
              <p className="text-[#D9C89C]/60 text-sm mt-2">
                Your bookings will appear here
              </p>
            </div>
          ) : (
            <div
              className="rounded-3xl p-6 flex flex-col gap-6"
              style={{ background: "#73683B", border: "2px solid #D9C89C" }}
            >
              {bookItems.map((book: ReservationItem) => {
                return (
                  <BookingCard
                    key={book._id}
                    book={book}
                    onDelete={removeBookingFromState}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
