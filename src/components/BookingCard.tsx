import Link from "next/link";
import { ReservationItem } from "../../interface";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useState } from "react";
import ReviewModal from "./ReviewModal";
import RejectModal from "./RejectModal";
import { apiUrl } from "@/libs/apiUrl";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function BookingCard({
  book,
  onDelete,
  onUpdate,
}: {
  book: ReservationItem;
  onDelete: (id: string) => void;
  onUpdate?: () => void;
}) {
  const { data: session } = useSession();

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleUpdateStatus = async (status: 'approved' | 'rejected', reason: string = "") => {
    try {
      const response = await fetch(apiUrl(`/api/v1/reservations/${book._id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify({ status, reason_reject: reason }),
      });

      if (response.ok) {
        alert(`Reservation successfully ${status}!`);
        setIsRejectModalOpen(false);
        if (onUpdate) onUpdate();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update reservation status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    try {
      const response = await fetch(
        apiUrl(`/api/v1/restaurants/${book.restaurant._id}/reviews`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

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
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this reservation?"
    );
    if (!isConfirmed) return;

    if (!session?.user.token) {
      alert("Please sign in again before cancelling this reservation.");
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/v1/reservations/${book._id}`), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 404) {
          alert(
            data?.message ||
              "This reservation was already cancelled or could not be found."
          );
          onDelete(book._id);
          if (onUpdate) onUpdate();
          return;
        }

        if (response.status === 403) {
          alert(
            data?.message ||
              "You do not have permission to cancel this reservation."
          );
          return;
        }

        if (response.status >= 500) {
          alert(
            data?.message || "Unable to cancel reservation right now. Please try again."
          );
          return;
        }

        throw new Error(data?.message || "Failed to cancel reservation");
      }

      alert(data?.message || "Reservation cancelled successfully!");
      onDelete(book._id);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to cancel reservation right now."
      );
    }
  };

  return (
    <div>
      <div
        key={book._id}
        className="flex flex-col md:flex-row gap-6 rounded-2xl overflow-hidden"
        style={{
          background: "rgba(117, 101, 58, 0.08)",
          border: "1px solid #D9C89C33",
        }}
      >
        {/* Restaurant Image */}
        <div className="md:w-64 w-full h-52 md:h-auto shrink-0 relative overflow-hidden rounded-2xl m-3">
          <img
            src={book.restaurant.picture ?? "/img/1.png"}
            alt={book.restaurant.name}
            className="w-full h-full object-cover 
                transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A10]/50 to-transparent" />
        </div>

        {/* Right side */}
        <div className="flex flex-col flex-1 p-4 gap-4 justify-between">
          {/* Restaurant name */}
          <h2
            className="text-3xl font-normal text-[#E8D9A0]"
            style={{ fontFamily: "'Cormorant Garamond', 'Sarabun', serif" }}
          >
            {book.restaurant.name}
          </h2>

          {/* Description box */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden"
            style={{
              border: "1px solid #D9C89C",
              background: "rgba(217, 200, 156, 0.08)",
            }}
          >
            <div className="absolute inset-0 bg-white opacity-[0.05] pointer-events-none rounded-2xl" />
            <DescRow label="ผู้จอง" value={book.user?.name ?? "—"} />
            <DescRow label="ที่อยู่" value={book.restaurant.address} />
            <DescRow
              label="เวลาจอง"
              value={dayjs(book.reservationDate)
                .utc()
                .format("DD MMM YYYY HH:mm")}
            />
            <DescRow label="โทรศัพท์" value={book.restaurant.telephone} />
            <DescRow 
              label="สถานะ" 
              value={book.status ? (book.status.charAt(0).toUpperCase() + book.status.slice(1)) : 'Waiting'} 
            />
            {book.status === 'rejected' && book.reason_reject && (
              <DescRow label="เหตุผล" value={book.reason_reject} />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            {session?.user.role === 'restaurantOwner' ? (
              <div className="flex gap-3 justify-end w-full">
                {(!book.status || book.status === 'waiting') && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus('approved')}
                      className="px-7 py-2 rounded-full text-[#5C3D1A] text-xs 
                        tracking-[0.15em] uppercase font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow"
                      style={{
                        background: "linear-gradient(135deg, #E8D9A0, #C9A96E)",
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setIsRejectModalOpen(true)}
                      className="px-7 py-2 rounded-full text-red-500 text-xs tracking-[0.15em] uppercase font-medium
                        transition-all duration-200 hover:scale-105 active:scale-95 border border-red-400 cursor-pointer hover:bg-red-50"
                      style={{ background: "transparent" }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsReviewOpen(true)}
                  className="px-7 py-2 rounded-full text-[#5C3D1A] text-xs 
                            tracking-[0.15em] uppercase font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow"
                  style={{
                    background: "linear-gradient(135deg, #E8D9A0, #C9A96E)",
                  }}
                >
                  Review
                </button>
                <div className="flex gap-3 justify-end">
                  <Link
                    href={`/booking?reservationId=${book._id}&restaurant=${book.restaurant.name}&id=${book.restaurant._id}&update=1`}
                    className="px-7 py-2 rounded-full text-[#5C3D1A] text-xs 
            tracking-[0.15em] uppercase font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow"
                    style={{
                      background: "linear-gradient(135deg, #E8D9A0, #C9A96E)",
                    }}
                  >
                    Edit
                  </Link>

                  <button
                    onClick={deleteBooking}
                    className="px-7 py-2 rounded-full text-[#E8D9A0] text-xs tracking-[0.15em] uppercase font-medium
                            transition-all duration-200 hover:scale-105 active:scale-95 border cursor-pointer"
                    style={{ borderColor: "#D9C89C", background: "transparent" }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={(reason) => handleUpdateStatus('rejected', reason)}
      />

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        restaurantName={book.restaurant.name}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
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

    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
