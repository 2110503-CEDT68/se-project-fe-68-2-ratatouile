import Link from "next/link"
import {ReservationItem} from "../../interface"
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useState } from "react";
import ReviewModal from "./ReviewModal";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function BookingCard({ book, onDelete }: { book: ReservationItem, onDelete: (id: string) => void }) {


    const { data: session } = useSession();

    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const handleReviewSubmit = async (rating: number, comment: string) => {
        try {
            const response = await fetch(`https://be-project-68-dinoping-host.vercel.app/api/v1/restaurants/${book.restaurant._id}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user.token}`
                },
                body: JSON.stringify({ rating, comment })
            });

            if (response.ok) {
                alert("Thank you for your review!");
                setIsReviewOpen(false);
            } else {
                const data = await response.json();
                alert(data.message || "Failed to submit");
            }
        } catch (error) {
            console.error(error);
        }
    };

    
    const deleteBooking = async (e: React.FormEvent) => {

        const isConfirmed = window.confirm("Are you sure you want to delete this reservation?");
        if (!isConfirmed) return;

        try {
            const response = await fetch(`https://be-project-68-dinoping-host.vercel.app/api/v1/reservations/${book._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user.token}`
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete a reservation");
            }

            alert(
                "Delete your reservation Successful!"
            );
            onDelete(book._id);

            } catch (error) {
                console.error("Error:", error);
            }
    }

    return (
        <div>


            <div key={book._id} className="flex flex-col md:flex-row gap-6 rounded-2xl overflow-hidden"
            style={{ background: "rgba(117, 101, 58, 0.08)", border: "1px solid #D9C89C33" }}>
            {/* Restaurant Image */}
            <div className="md:w-64 w-full h-52 md:h-auto shrink-0 relative overflow-hidden rounded-2xl m-3">
                <img src={book.restaurant.picture ?? "/img/1.png"} alt={book.restaurant.name} className="w-full h-full object-cover 
                transition-transform duration-500 hover:scale-105"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A10]/50 to-transparent" />
            </div>

            {/* Right side */}
            <div className="flex flex-col flex-1 p-4 gap-4 justify-between">
                {/* Restaurant name */}
                <h2 className="text-3xl font-normal text-[#E8D9A0]" 
                style={{ fontFamily: "'Cormorant Garamond', 'Sarabun', serif" }}>
                    {book.restaurant.name}
                </h2>

                {/* Description box */}
                <div className="rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden" 
                style={{ border: "1px solid #D9C89C", background: "rgba(217, 200, 156, 0.08)" }}>
                    <div className="absolute inset-0 bg-white opacity-[0.05] pointer-events-none rounded-2xl" />
                    <DescRow label="ผู้จอง" value={book.user?.name ?? "—"} />
                    <DescRow label="ที่อยู่" value={book.restaurant.address} />
                    <DescRow label="เวลาจอง" value={dayjs(book.reservationDate).utc().format("DD MMM YYYY HH:mm")} />
                    <DescRow label="โทรศัพท์" value={book.restaurant.telephone} />
                </div>

                {/* Buttons */}
                <div className="flex justify-between">
                    <button onClick={() => setIsReviewOpen(true)}
                        className="px-7 py-2 rounded-full text-[#5C3D1A] text-xs 
                        tracking-[0.15em] uppercase font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow"
                        style={{ background: "linear-gradient(135deg, #E8D9A0, #C9A96E)" }}>
                            Review
                    </button>
                <div className="flex gap-3 justify-end">
                    <Link href={`/booking?reservationId=${book._id}&restaurant=${book.restaurant.name}&id=${book.restaurant._id}&update=1`}className="px-7 py-2 rounded-full text-[#5C3D1A] text-xs 
        tracking-[0.15em] uppercase font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow"
                        style={{ background: "linear-gradient(135deg, #E8D9A0, #C9A96E)" }}>
                            Edit
                    </Link>
                    
                    <button onClick={deleteBooking} 
                        className="px-7 py-2 rounded-full text-[#E8D9A0] text-xs tracking-[0.15em] uppercase font-medium
                        transition-all duration-200 hover:scale-105 active:scale-95 border cursor-pointer"
                        style={{ borderColor: "#D9C89C", background: "transparent" }}>
                            Delete
                    </button>
                    </div>
                </div>
            </div>
            </div>

            <ReviewModal 
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                restaurantName={book.restaurant.name}
                onSubmit={handleReviewSubmit}
            />

        </div>
    )
}

function DescRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm font-light">
      <span className="text-[#D9C89C] shrink-0">{label}:</span>
      <span className="text-white/80">{value}</span>
    </div>
  );
}

function convertTime(time: string) {
    const date = new Date(time);
    return date.toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        hour12: false,

        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}