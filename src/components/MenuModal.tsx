import { RestaurantItem, MenuItem } from "../../interface";

interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    restaurant: RestaurantItem;
}

export default function MenuModal({ isOpen, onClose, restaurant }: MenuModalProps) {

    if (!isOpen) return null;
    if (!restaurant) return null;
    
    const menus = restaurant.menus as MenuItem[] | undefined;
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-[#D9C89C]/30 bg-[#1A1814] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 text-center border-b border-[#D9C89C]/10 flex-shrink-0">
                    <h3 className="text-3xl font-light text-[#E8D9A0] font-serif">{restaurant.name}'s Menu</h3>
                    <p className="text-white/40 text-sm mt-1">{restaurant.address}</p>
                </div>

                <div className="px-8 py-6 overflow-y-auto flex-1 custom-scrollbar">
                    
                    {!menus || menus.length === 0 ? (
                        <div className="text-center text-white/40 py-10">
                            No menus available for this restaurant yet.
                        </div>
                    ) : (
                        menus.map((menu, mIndex) => (
                            <div key={menu._id || mIndex} className="mb-10 last:mb-2">
                                
                                {/* Menu Category Title */}
                                <h4 className="text-2xl font-serif text-[#D9C89C] border-b border-[#D9C89C]/20 pb-2 mb-4 text-left">
                                    {menu.title}
                                </h4>

                                {/* Menu Items (Dishes) */}
                                {!menu.items || menu.items.length === 0 ? (
                                    <div className="text-center text-white/30 text-sm py-4">
                                        No items in this category.
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {menu.items.map((dish, i) => (
                                            <div 
                                                key={dish._id || i} 
                                                className="flex flex-row items-center gap-4 py-3 px-3 border-b border-white/5 hover:bg-white/5 transition-colors rounded-xl" 
                                            >
                                                {/* Image - Larger and more rounded */}
                                                <div className="flex-shrink-0">
                                                    {dish.picture ? (
                                                        <img 
                                                            src={dish.picture} 
                                                            alt={dish.name} 
                                                            className="w-20 h-20 object-cover rounded-2xl border border-white/10 shadow-sm" 
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=No+Image";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-[10px] text-white/20 shadow-sm">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Text Content - Left Aligned */}
                                                <div className="flex flex-col flex-1 text-left justify-center overflow-hidden">
                                                    <div className="text-xl font-bold text-gray-100 truncate">
                                                        {dish.name}
                                                    </div>
                                                    <div className="text-sm mt-1 truncate">
                                                        {/* Category and Description together, slightly brighter */}
                                                        {dish.category && (
                                                            <span className="font-medium text-[#D9C89C]/90">
                                                                {dish.category}
                                                            </span>
                                                        )}
                                                        {dish.category && dish.description && (
                                                            <span className="mx-2 text-white/30">-</span>
                                                        )}
                                                        {dish.description && (
                                                            <span className="text-white/70">
                                                                {dish.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Price - Right Aligned with formatting */}
                                                <div className="flex-shrink-0 text-right pl-4 pr-2">
                                                    <div className="text-2xl font-bold text-[#E8D9A0]">
                                                        ฿{Number(dish.price).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Buttons */}
                <div className="p-4 border-t border-[#D9C89C]/10 flex-shrink-0 bg-[#1A1814]">
                    <button 
                        onClick={onClose}
                        className="w-full py-3 rounded-full border border-[#D9C89C]/40 bg-[#D9C89C]/10 text-[#E8D9A0] text-sm font-semibold tracking-widest uppercase hover:bg-[#D9C89C]/20 transition-all shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}