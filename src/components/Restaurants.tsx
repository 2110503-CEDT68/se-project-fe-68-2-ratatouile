"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { RestaurantItem } from "./../../interface";
import getRestaurants from "../libs/getRestaurants";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ReviewModal from "./ReviewModal";
import { apiUrl } from "@/libs/apiUrl";
import RestaurantForm from "./RestaurantForm";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? "#8B3A2A" : "none"}
          stroke="#8B3A2A"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-xs text-[#8B3A2A] ml-1">{rating}</span>
    </div>
  );
}

export default function Restaurants() {
  const [booked, setBooked] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  const onEdit = (review: any) => {
    setEditingReview(review);
    setIsReviewOpen(true);
  };

  async function fetchData() {
    try {
      setLoading(true);
      const json = await getRestaurants();
      setRestaurants(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    try {
      const isEdit = !!editingReview;
      const url = isEdit
        ? apiUrl(`/api/v1/reviews/${editingReview._id}`)
        : apiUrl(`/api/v1/restaurants/${editingReview.restaurant}/reviews`);

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (response.ok) {
        alert(isEdit ? "Update Successful!" : "Review Submitted!");
        setIsReviewOpen(false);
        setEditingReview(null);
        fetchData();
      } else {
        const data = await response.json();
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit review");
    }
  };

  const onDelete = async (reviewId: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!isConfirmed) return;

    try {
      const response = await fetch(apiUrl(`/api/v1/reviews/${reviewId}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Review deleted successfully!");
        fetchData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Error: Could not delete the review.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/img/8.png"
          alt="Background"
          fill
          priority
          className="object-cover scale-110 blur-xs brightness-75"
        />
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');`}</style>

      <div
        className="max-w-6xl mx-auto px-6 pb-24"
        style={{ fontFamily: "'Jost', 'Sarabun', sans-serif" }}
      >
        <header className="text-center pt-20 pb-10">
          <h1
            className="text-6xl font-bold text-shadow-lg text-white mb-4 leading-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Restaurants
          </h1>
        </header>

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-white/70 text-lg">Loading...</p>
        ) : (
          <>
            {/* Restaurants Grid */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                {restaurants.map((r) => (
                  // restaurants card
                  <div
                    key={r._id}
                    className="flex flex-col bg-white/90 rounded-2xl overflow-hidden shadow-lg border border-[#C9A96E]/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                  >
                    {/* image restaurants */}
                    <div className="w-[90%] h-52 relative rounded-xl overflow-hidden shrink-0 left-1/2 -translate-x-1/2 top-3">
                      <img
                        src={r.picture}
                        alt={r.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2C1A10]/30"></div>
                    </div>

                    {/* description container */}
                    <div className="p-6 flex flex-col flex-1">
                      <h2
                        className="text-2xl font-normal text-[#5C1A0E] mb-1"
                        style={{
                          fontFamily: "'Cormorant Garamond', 'Sarabun', serif",
                        }}
                      >
                        {r.name}
                      </h2>

                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-[#7A6357] font-light">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#8B3A2A"
                            strokeWidth="2"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {r.address}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#7A6357] font-light">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#8B3A2A"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {r.openTime} – {r.closeTime}
                        </div>
                      </div>

                      {/* Rating Restaurants เฉลี่ยจาก reviews */}
                      {r.reviews && r.reviews.length > 0 && (
                        <div className="mb-4">
                          <StarRating
                            rating={
                              r.reviews.reduce(
                                (sum, rv) => sum + rv.rating,
                                0
                              ) / r.reviews.length
                            }
                          />
                        </div>
                      )}

                      <Link
                        href={`/booking?id=${r._id}&restaurant=${r.name}`}
                        className="mt-auto w-full py-3 rounded-lg text-[#D9C89C] text-xs tracking-[0.2em] uppercase font-normal
                                transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer
                                bg-[#5C1A0E] hover:bg-[#3A6B45] text-center block"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews Section */}
            {restaurants.some((r) => r.reviews && r.reviews.length > 0) && (
              <section className="mt-24">
                {/* header */}
                <div className="text-center mb-10">
                  <h2
                    className="text-5xl font-bold text-white text-shadow-lg"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Reviews
                  </h2>
                </div>

                {/* Group reviews by restaurant */}
                <div className="space-y-12">
                  {restaurants.map(
                    (restaurant) =>
                      restaurant.reviews &&
                      restaurant.reviews.length > 0 && (
                        <div key={restaurant._id}>
                          <h3
                            className="text-3xl font-semibold text-white mb-6"
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                            }}
                          >
                            {restaurant.name}
                          </h3>
                          {/* review card */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {restaurant.reviews.map((review) => (
                              <div
                                key={review._id}
                                className="relative bg-white/90 rounded-2xl p-7 shadow-lg border border-[#C9A96E]/15 transition-all duration-300 hover:-translate-y-1"
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  {/* avatar profile */}
                                  <div className="w-12 h-10 rounded-full bg-[#C9A96E]/30 flex items-center justify-center text-[#5C1A0E] font-bold text-lg">
                                    {typeof review.user === "object"
                                      ? review.user.name[0]
                                      : "?"}
                                  </div>

                                  {/* users header */}
                                  <div className="w-full">
                                    <div className="flex justify-between">
                                      <p
                                        className="text-lg font-semibold text-[#2C1A10]"
                                        style={{
                                          fontFamily:
                                            "'Cormorant Garamond', 'Sarabun', serif",
                                        }}
                                      >
                                        {typeof review.user === "object"
                                          ? review.user.name
                                          : "Anonymous"}
                                      </p>

                                      {typeof review.user === "object" &&
                                        (session?.user?._id ==
                                          review.user?._id ||
                                          session?.user?.role == "admin") && (
                                          <div className="flex gap-2 items-center ml-auto">
                                            <button
                                              onClick={() => onEdit(review)}
                                              className="text-[#D9C89C] text-xs uppercase tracking-widest hover:text-[#D9C89C]/50 transition-colors cursor-pointer"
                                            >
                                              Edit
                                            </button>

                                            <button
                                              onClick={() =>
                                                onDelete(review._id)
                                              }
                                              className="text-red-400 text-xs uppercase tracking-widest hover:text-red-400/50 transition-colors cursor-pointer"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        )}
                                    </div>
                                    <StarRating rating={review.rating} />
                                  </div>
                                </div>
                                {/* comment */}
                                <p
                                  className="text-base font-light italic text-[#7A6357] leading-relaxed"
                                  style={{
                                    fontFamily:
                                      "'Cormorant Garamond', 'Sarabun', serif",
                                  }}
                                >
                                  {review.comment}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </section>
            )}
          </>
        )}
        <ReviewModal
          isOpen={isReviewOpen}
          onClose={() => {
            setIsReviewOpen(false);
            setEditingReview(null);
          }}
          restaurantName={editingReview?.restaurantName || "Restaurant Review"}
          initialData={
            editingReview
              ? { rating: editingReview.rating, comment: editingReview.comment }
              : null
          }
          onSubmit={handleReviewSubmit}
        />
      </div>
    </div>
  );
}
