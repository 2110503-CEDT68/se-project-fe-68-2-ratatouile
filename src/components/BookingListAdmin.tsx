"use client";
import { ReservationItem, RestaurantItem } from "../../interface";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import BookingCard from "./BookingCard";
import { apiUrl } from "@/libs/apiUrl";
import RestaurantForm from "./RestaurantForm";
import MenuForm from "./MenuForm";

export default function BookingListAdmin() {
  const { data: session } = useSession();

  const [bookItems, setBookItems] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditMenuModalOpen, setIsEditMenuModalOpen] = useState(false);
  
  const [ownerRestaurant, setOwnerRestaurant] = useState<RestaurantItem | null>(null);
  const [showReservations, setShowReservations] = useState(true);

  const removeBookingFromState = (id: string) => {
    setBookItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const fetchData = async () => {
    if (!session?.user.token) {
      setLoading(false);
      return;
    }

    try {
      // Fetch reservations
      const resResponse = await fetch(apiUrl("/api/v1/reservations"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
      });

      const resResult = await resResponse.json();
      if (resResult.success) {
        setBookItems(resResult.data);
      }

      // If restaurant owner, fetch their restaurant details
      if (session.user.role === 'restaurantOwner') {
        const restResponse = await fetch(apiUrl("/api/v1/restaurants"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
        });
        const restResult = await restResponse.json();
        if (restResult.success && restResult.data.length > 0) {
          const myRest = restResult.data.find((r: any) => 
            r.owner === session.user._id || r.owner?._id === session.user._id
          );
          if (myRest) setOwnerRestaurant(myRest);
        }
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!ownerRestaurant || !session?.user.token) return;
    
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${ownerRestaurant.name}"? This will also cancel all associated reservations.`
    );
    
    if (!isConfirmed) return;

    try {
      const response = await fetch(apiUrl(`/api/v1/restaurants/${ownerRestaurant._id}`), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        alert("Restaurant deleted successfully");
        setOwnerRestaurant(null);
        fetchData();
      } else {
        alert(result.error || "Failed to delete restaurant");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the restaurant");
    }
  };

  useEffect(() => {
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
        <p className="text-center text-white/70 text-lg mt-30">Loading...</p>
      ) : (
        <div
          className="max-w-5xl mx-auto px-6 pt-6 pb-20 relative scroll"
          style={{ fontFamily: "'Jost', 'Sarabun', sans-serif" }}
        >
          {/* Top Actions Section - Removed absolute to prevent overlap */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mb-8 w-full">
            {session?.user.role === 'restaurantOwner' && (
              <>
                <button
                  onClick={() => setShowReservations(!showReservations)}
                  className="px-6 py-2.5 rounded-full text-black text-xs sm:text-sm tracking-[0.18em] uppercase font-black
                            transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg border border-[#C9A96E]/50"
                  style={{
                    background: "linear-gradient(135deg, #E8D9A0, #C9A96E)",
                    textShadow: "0.5px 0.5px 0px rgba(255,255,255,0.3)"
                  }}
                >
                  {showReservations ? "hide reservations" : "list reservation"}
                </button>
                {!ownerRestaurant && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-2.5 rounded-full text-black text-xs sm:text-sm tracking-[0.18em] uppercase font-black
                              transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg border border-[#C9A96E]/50"
                    style={{
                      background: "linear-gradient(135deg, #E8D9A0, #C9A96E)",
                      textShadow: "0.5px 0.5px 0px rgba(255,255,255,0.3)"
                    }}
                  >
                    create restaurant
                  </button>
                )}
              </>
            )}
            <Link
              href="/booking"
              className="px-6 py-2.5 rounded-full text-black text-xs sm:text-sm tracking-[0.18em] uppercase font-black
                        transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg border border-[#C9A96E]/50 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #E8D9A0, #C9A96E)",
                textShadow: "0.5px 0.5px 0px rgba(255,255,255,0.3)"
              }}
            >
              create booking
            </Link>
          </div>

          {/* Restaurant Management Section */}
          {session?.user.role === 'restaurantOwner' && ownerRestaurant && (
            <div className="mt-20 mb-10">
              <h2 className="text-2xl font-normal text-[#E8D9A0] mb-6 flex items-center gap-3" 
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <span className="w-8 h-[1px] bg-[#D9C89C]" />
                Manage My Restaurant
                <span className="flex-1 h-[1px] bg-[#D9C89C]/30" />
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6 p-6 rounded-3xl"
                   style={{ background: "#73683B", border: "2px solid #D9C89C" }}>
                <div className="md:w-64 h-48 rounded-xl overflow-hidden relative border border-[#D9C89C33]">
                  <img src={ownerRestaurant.picture || "/img/1.png"} alt={ownerRestaurant.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{ownerRestaurant.name}</h3>
                    <div className="space-y-1">
                      <DescRow label="Address" value={ownerRestaurant.address} />
                      <DescRow label="Telephone" value={ownerRestaurant.telephone} />
                      <DescRow label="Hours" value={`${ownerRestaurant.openTime} - ${ownerRestaurant.closeTime}`} />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">

                    <button
                      onClick={() => setIsEditMenuModalOpen(true)}
                      className="px-8 py-2 rounded-full text-black text-xs tracking-widest uppercase font-black
                                transition-all hover:scale-105 active:scale-95 shadow-md"
                      style={{ 
                        background: "linear-gradient(135deg, #E8D9A0, #C9A96E)",
                        textShadow: "0.5px 0.5px 0px rgba(255,255,255,0.3)"
                      }}
                    >
                      Edit Menu
                    </button>


                    <button
                      onClick={() => setIsUpdateModalOpen(true)}
                      className="px-8 py-2 rounded-full text-[#5C3D1A] text-xs tracking-widest uppercase font-medium
                                transition-all hover:scale-105 active:scale-95"
                      style={{ background: "linear-gradient(135deg, #E8D9A0, #C9A96E)" }}
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleDeleteRestaurant}
                      className="px-8 py-2 rounded-full text-red-100 text-xs tracking-widest uppercase font-medium
                                transition-all hover:bg-red-900 border border-red-400"
                    >
                      Delete Restaurant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {session?.user.role === 'restaurantOwner' && isEditMenuModalOpen && (

            <MenuForm 
              onSuccess={() => {
                setIsEditMenuModalOpen(false);
                fetchData();
              }} 
              onClose={() => setIsEditMenuModalOpen(false)}
              editData={ownerRestaurant ?? undefined}
            />
          )}

          {session?.user.role === 'restaurantOwner' && isCreateModalOpen && (
            <RestaurantForm 
              onSuccess={() => {
                setIsCreateModalOpen(false);
                fetchData();
              }} 
              onClose={() => setIsCreateModalOpen(false)}
            />
          )}

          {session?.user.role === 'restaurantOwner' && isUpdateModalOpen && ownerRestaurant && (
            <RestaurantForm 
              editData={ownerRestaurant}
              onSuccess={() => {
                setIsUpdateModalOpen(false);
                fetchData();
              }} 
              onClose={() => setIsUpdateModalOpen(false)}
            />
          )}

          {/* Main container */}
          {(session?.user.role !== 'restaurantOwner' || showReservations) && (
            <div className="mt-6">
               <h2 className="text-xl md:text-2xl font-normal text-[#E8D9A0] mb-6 flex items-center gap-3" 
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <span className="w-8 h-[1px] bg-[#D9C89C]" />
                {session?.user.role === 'restaurantOwner' ? "Manage Reservations" : "My Reservations"}
                <span className="flex-1 h-[1px] bg-[#D9C89C]/30" />
              </h2>
              
              {bookItems.length === 0 ? (
                <div
                  className="rounded-4xl p-16 text-center"
                  style={{ background: "#73683B", border: "2px solid #D9C89C" }}
                >
                  <p
                    className="text-[#D9C89C] text-xl tracking-widest uppercase"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    No Reservations Found
                  </p>
                  <p className="text-[#D9C89C]/60 text-sm mt-2">
                    Bookings will appear here
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
                        onUpdate={fetchData}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
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
