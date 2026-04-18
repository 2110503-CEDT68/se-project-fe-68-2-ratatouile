"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { apiUrl } from "@/libs/apiUrl";

export default function RestaurantForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [picture, setPicture] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!session?.user?.token) {
      setError("Please sign in before creating a restaurant profile.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl("/api/v1/restaurants"), {
        method: "POST",
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
          : data.error || data.message || "Failed to create restaurant";
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setName("");
      setAddress("");
      setTelephone("");
      setOpenTime("");
      setCloseTime("");
      setPicture("");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto p-8 rounded-3xl shadow-2xl relative overflow-hidden mt-8 mb-16"
      style={{
        background: "white",
        border: "8px solid transparent",
        backgroundImage:
          "linear-gradient(white, white), linear-gradient(135deg, #73683B, #D9C89C)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <h2
        className="text-3xl font-bold text-center mb-6 text-[#73683B]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Create a Restaurant
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded-lg text-sm">
          Restaurant created successfully!
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
          {loading ? "Creating..." : "Create Restaurant"}
        </button>
      </form>
    </div>
  );
}
