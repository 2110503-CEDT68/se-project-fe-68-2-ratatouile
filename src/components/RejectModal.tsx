"use client";
import { useState } from "react";

export default function RejectModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl relative"
        style={{
          border: "4px solid transparent",
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
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-[#73683B]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Reason for Rejection
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!reason.trim()) return;
            onSubmit(reason);
            setReason("");
          }}
          className="space-y-4"
        >
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason..."
            className="w-full px-4 py-3 border border-[#D9C89C] rounded-lg bg-[#f9f7f3] text-[#59200D] focus:outline-none focus:ring-2 focus:ring-[#D9C89C] text-sm"
            rows={4}
            maxLength={300}
          />

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold hover:opacity-90 transition mt-4"
          >
            Confirm Rejection
          </button>
        </form>
      </div>
    </div>
  );
}
