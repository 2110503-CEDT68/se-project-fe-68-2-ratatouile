import { useState, useEffect } from "react";
import { RestaurantItem } from "../../interface";

interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    restaurant: RestaurantItem;
}

export default function MenuModal({ isOpen, onClose, restaurant }: MenuModalProps) {

    if (!isOpen) return null;

    if (!restaurant) return null;
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-[#D9C89C]/30 bg-[#1A1814] shadow-2xl animate-in fade-in zoom-in duration-300">
                
                {/* Header */}
                <div className="p-6 text-center border-b border-[#D9C89C]/10">
                    <h3 className="text-2xl font-light text-[#E8D9A0] font-serif">{restaurant.name}'s menu</h3>
                    <p className="text-white/40 text-sm mt-1">{restaurant.address}</p>
                </div>

                <div className="px-8 py-4 flex flex-col items-center gap-1">

                    <div className="grid w-full grid-cols-[1fr_1fr_2fr_1fr] gap-4 font-bold border-b mb-4 pb-4 text-[#E8D9A0] text-center">
                        <div>Name</div>
                        <div>Category</div>
                        <div>Description</div>
                        <div>Price</div>
                    </div>

                    {restaurant.menu?.map((m, i) => (
                        <div key={i} className="grid text-center w-full grid-cols-[1fr_1fr_2fr_1fr] gap-4 text-gray-200 items-center py-2" >
                            <div className="w-full px-2 py-1">
                                {m.name}
                            </div>

                            <div className="w-full px-2 py-1">
                                {m.category}
                            </div>

                            <div className="w-full px-2 py-1">
                                {m.description}
                            </div>

                            <div className="w-full px-2 py-1">
                                {m.price}
                            </div>
                        </div>
                    ))}

                    {/* Buttons */}
                    <div className="flex w-full gap-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-2 mt-3 rounded-full text-white/60 text-xs tracking-widest uppercase hover:text-white transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}