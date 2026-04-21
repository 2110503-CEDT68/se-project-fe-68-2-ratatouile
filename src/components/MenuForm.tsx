"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { apiUrl } from "@/libs/apiUrl";

import { RestaurantItem ,MenuItem } from "../../interface";

export default function MenuForm({
  onSuccess,
  onClose,
  editData,
}: {
  onSuccess?: () => void;
  onClose?: () => void;
  editData?: RestaurantItem;
}) {
  const { data: session } = useSession();
  const [menu, setMenu] = useState<MenuItem[]>(editData?.menu ?? []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);


  const updateMenu = (index: number, field: string, value: any) => {
    setMenu((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!session?.user?.token) {
      setError(`Please sign in before updating restaurant menu.`);
      return;
    }


    setLoading(true);

    try {
      const url = apiUrl(`/api/v1/restaurants/${editData?._id}`) 
        
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify({
          menu
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = Array.isArray(data.error)
          ? data.error.join(", ")
          : data.error || data.message || `Failed to update restaurant menu`;
        throw new Error(errorMessage);
      }

      setSuccess(true);
      
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
          Edit Restaurant Menu
        </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded-lg text-sm">
          Restaurant menu updated successfully!
        </div>
      )}

  <form onSubmit={handleSubmit} className="space-y-5">

  <div className="grid grid-cols-[1fr_1fr_2fr_1fr_60px] gap-4 font-bold border-b pb-2 text-center">
    <div>Name</div>
    <div>Category</div>
    <div>Description</div>
    <div>Price</div>
    <div></div>
  </div>

  {menu.map((m, i) => (
    <div
      key={i}
      className="grid grid-cols-[1fr_1fr_2fr_1fr_60px] gap-4 items-center border-b py-2"
    >
      <input
        value={m.name}
        required
        onChange={(e) => updateMenu(i, "name", e.target.value)}
        className="w-full px-2 py-1 rounded"
      />

      <input
        value={m.category}
        required
        onChange={(e) => updateMenu(i, "category", e.target.value)}
        className="w-full px-2 py-1 rounded"
      />

      <input
        value={m.description}
        required
        onChange={(e) => updateMenu(i, "description", e.target.value)}
        className="w-full px-2 py-1 rounded"
      />

      <input
        type="number"
        value={m.price}
        required
        min={1}
        onChange={(e) => updateMenu(i, "price", Number(e.target.value))}
        className="w-full px-2 py-1 rounded text-center"
      />

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() =>
            setMenu((prev) => prev.filter((_, index) => index !== i))
          }
          className="text-red-500 hover:text-red-700"
        >
          <svg className="w-8 cursor-pointer" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.5001 6H3.5" stroke="#e32400" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M9.5 11L10 16" stroke="#e32400" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M14.5 11L14 16" stroke="#e32400" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" stroke="#e32400" strokeWidth="1.5"></path> <path d="M18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5M18.8334 8.5L18.6334 11.5" stroke="#e32400" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
        </button>
      </div>
    </div>
    ))}

        <div
            onClick={() => {
              setMenu((prev) => [
                ...prev,
                {
                  category: '',
                  name: '',
                  price: 0,
                  description: ''
                },
              ]);
            }}
            className="cursor-pointer text-center hover:bg-gray-100 text-2xl w-full py-1.5 font-thin rounded-lg border-[#D9C89C] border-3 text-[#D9C89C] hover:bg-gray transition mt-2"
          >
          +
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer py-3 rounded-lg bg-gradient-to-r from-[#D9C89C] to-[#877959] text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
          {loading ? "Updating..."  :  "Save Restaurant Menu" }
        </button>
      </form>
      </div>
    </div>
  );
}
