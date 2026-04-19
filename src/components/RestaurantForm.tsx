"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { apiUrl } from "@/libs/apiUrl";

import { RestaurantItem } from "../../interface";

export default function RestaurantForm({
  onSuccess,
  onClose,
  editData,
}: {
  onSuccess?: () => void;
  onClose?: () => void;
  editData?: RestaurantItem;
}) {
  const { data: session } = useSession();
  const [name, setName] = useState(editData?.name || "");
  const [address, setAddress] = useState(editData?.address || "");
  const [telephone, setTelephone] = useState(editData?.telephone || "");
  const [openTime, setOpenTime] = useState(editData?.openTime || "");
  const [closeTime, setCloseTime] = useState(editData?.closeTime || "");
  const [picture, setPicture] = useState(editData?.picture || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isEdit = !!editData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!session?.user?.token) {
      setError(`Please sign in before ${isEdit ? "updating" : "creating"} a restaurant profile.`);
      return;
    }

    if (openTime >= closeTime) {
      setError("Close time must be later than open time.");
      return;
    }

    setLoading(true);

    try {
      const url = isEdit 
        ? apiUrl(`/api/v1/restaurants/${editData._id}`) 
        : apiUrl("/api/v1/restaurants");
        
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify({
          name,
          address,
          telephone,
          openTime,
          closeTime,
          picture,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = Array.isArray(data.error)
          ? data.error.join(", ")
          : data.error || data.message || `Failed to ${isEdit ? "update" : "create"} restaurant`;
        throw new Error(errorMessage);
      }

      setSuccess(true);
      if (!isEdit) {
        setName("");
        setAddress("");
        setTelephone("");
        setOpenTime("");
        setCloseTime("");
        setPicture("");
      }
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl relative overflow-hidden"
        style={{
          border: "8px solid transparent",
          backgroundImage:
            "linear-gradient(white, white), linear-gradient(135deg, #73683B, #D9C89C)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-[#877959] hover:text-[#59200D] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2
          className="text-3xl font-bold text-center mb-6 text-[#73683B]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {isEdit ? "Edit Restaurant Profile" : "Create a Restaurant"}
        </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded-lg text-sm">
          {isEdit ? "Restaurant updated successfully!" : "Restaurant created successfully!"}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#3D220F] mb-1.5">
            Restaurant Name
          </label>
          <input
            type="text"
            required
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter restaurant name"
            className="w-full px-4 py-2 border border-[#D9C89C] rounded-lg bg-[#f9f7f3] text-[#59200D] focus:outline-none focus:ring-2 focus:ring-[#D9C89C] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D220F] mb-1.5">
            Address
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter full address"
            className="w-full px-4 py-2 border border-[#D9C89C] rounded-lg bg-[#f9f7f3] text-[#59200D] focus:outline-none focus:ring-2 focus:ring-[#D9C89C] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D220F] mb-1.5">
            Telephone
          </label>
          <input
            type="tel"
            required
            pattern="[0-9+\-\s()]{6,20}"
            title="Please enter a valid telephone number"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="e.g. 0812345678"
            className="w-full px-4 py-2 border border-[#D9C89C] rounded-lg bg-[#f9f7f3] text-[#59200D] focus:outline-none focus:ring-2 focus:ring-[#D9C89C] text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3D220F] mb-1.5">
              Open Time
            </label>
            <input
              type="time"
              required
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="w-full px-4 py-2 border border-[#D9C89C] rounded-lg bg-[#f9f7f3] text-[#59200D] focus:outline-none focus:ring-2 focus:ring-[#D9C89C] text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D220F] mb-1.5">
              Close Time
            </label>
            <input
              type="time"
              required
              min={openTime || undefined}
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="w-full px-4 py-2 border border-[#D9C89C] rounded-lg bg-[#f9f7f3] text-[#59200D] focus:outline-none focus:ring-2 focus:ring-[#D9C89C] text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D220F] mb-1.5">
            Picture URL
          </label>
          <input
            type="url"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-[#D9C89C] rounded-lg bg-[#f9f7f3] text-[#59200D] focus:outline-none focus:ring-2 focus:ring-[#D9C89C] text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#D9C89C] to-[#877959] text-white font-semibold hover:opacity-90 transition disabled:opacity-50 mt-6"
        >
          {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Restaurant" : "Create Restaurant")}
        </button>
      </form>
      </div>
    </div>
  );
}
