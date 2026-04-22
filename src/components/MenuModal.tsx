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

                                {/* Table Header */}
                                <div className="grid w-full grid-cols-[1.5fr_1fr_2fr_1fr] gap-4 font-bold mb-2 pb-2 text-[#E8D9A0]/70 text-center text-sm">
                                    <div>Name</div>
                                    <div>Category</div>
                                    <div>Description</div>
                                    <div>Price</div>
                                </div>

                                {/* Menu Items (Dishes) */}
                                {!menu.items || menu.items.length === 0 ? (
                                    <div className="text-center text-white/30 text-sm py-4">
                                        No items in this category.
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        {menu.items.map((dish, i) => (
                                            <div 
                                                key={dish._id || i} 
                                                className="grid text-center w-full grid-cols-[1.5fr_1fr_2fr_1fr] gap-4 text-gray-200 items-center py-3 border-b border-white/5 hover:bg-white/5 transition-colors rounded-lg" 
                                            >
                                                <div className="w-full px-2 font-medium">
                                                    {dish.name}
                                                </div>

                                                <div className="w-full px-2 text-white/50 text-sm">
                                                    {dish.category}
                                                </div>

                                                <div className="w-full px-2 text-white/70 text-sm italic">
                                                    {dish.description}
                                                </div>

                                                <div className="w-full px-2 font-bold text-[#E8D9A0]">
                                                    {dish.price}
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
                        className="w-full py-3 rounded-full bg-white/5 text-white/60 text-xs tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}