import { useState, useEffect } from "react";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    restaurantName: string;
    initialData?: { rating: number; comment: string } | null; 
    onSubmit: (rating: number, comment: string) => Promise<void>;
}

export default function ReviewModal({ isOpen, onClose, restaurantName, initialData, onSubmit }: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // กรณี Edit: ใช้ค่าเก่า
                setRating(initialData.rating);
                setComment(initialData.comment);
            } else {
                // กรณี Create: ใช้ค่าเริ่มต้น
                setRating(5);
                setComment("");
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;
    

    const handleSubmit = async () => {
        if (!comment.trim()) return alert("Please enter a comment");
        setIsSubmitting(true);
        await onSubmit(rating, comment);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#D9C89C]/30 bg-[#1A1814] shadow-2xl animate-in fade-in zoom-in duration-300">
                
                {/* Header */}
                <div className="p-6 text-center border-b border-[#D9C89C]/10">
                    <h3 className="text-2xl font-light text-[#E8D9A0] font-serif">Rate Your Experience</h3>
                    <p className="text-white/40 text-sm mt-1">{restaurantName}</p>
                </div>

                <div className="p-8 flex flex-col items-center gap-6">
                    {/* Star Selection */}
                    <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                                key={star} 
                                onClick={() => setRating(star)}
                                className={`text-3xl transition-all duration-200 transform hover:scale-125 ${star <= rating ? "drop-shadow-[0_0_8px_rgba(232,217,160,0.6)]" : "opacity-30 grayscale"}`}
                            >
                                {star <= rating ? "⭐" : "⭐"}
                            </button>
                        ))}
                    </div>

                    {/* Text Area */}
                    <div className="w-full">
                        <label className="text-[10px] uppercase tracking-widest text-[#D9C89C] mb-2 block">Your Review</label>
                        <textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Describe your dining experience..."
                            className="w-full h-32 bg-white/[0.03] border border-[#D9C89C]/20 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-[#D9C89C] focus:ring-1 focus:ring-[#D9C89C] transition-all resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex w-full gap-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-3 rounded-full text-white/60 text-xs tracking-widest uppercase hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 py-3 rounded-full text-[#5C3D1A] text-xs tracking-widest uppercase font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                            style={{ background: "linear-gradient(135deg, #E8D9A0, #C9A96E)" }}
                        >
                            {isSubmitting ? "Sending..." : "Submit Review"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}