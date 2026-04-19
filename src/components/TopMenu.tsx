"use client"
import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import Link from "next/link";
import { Session } from "next-auth";
import { useState } from "react";

type TopMenuProps = {
  session: Session | null;
};

export default function TopMenu({ session }: TopMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="ds-topbar">
      <div className="ds-shell ds-topbar__content">
        {/* Logo and Mobile Toggle */}
        <div className="flex items-center gap-4 flex-1">
           <div className="relative h-10 w-10 md:h-12 md:w-12">
            <Image
              src="/LogoDark.png"
              alt="logo"
              fill
              className="object-contain"
            />
          </div>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-1 text-[#59200d] hover:bg-brand-accent/20 rounded-md transition-colors"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="ds-nav-cluster hidden lg:flex">
          <TopMenuItem title="Home" pageRef="/" />
          <TopMenuItem title="Reservation" pageRef="/booking" />
          <TopMenuItem title="Restaurants" pageRef="/restaurants" />
          {session?.user?.role === "admin" || session?.user?.role === "restaurantOwner" ? (
            <TopMenuItem title="Dashboard" pageRef="/dashboard" />
          ) : (
            <TopMenuItem title="My Booking" pageRef="/mybooking" />
          )}
        </div>

        {/* Action Group */}
        <div className="ds-action-group justify-end flex-1">
          {session ? (
            <div className="ds-action-group">
              <div className="hidden sm:block text-base md:text-xl font-medium">Hello, {session.user?.name}</div>
              <Link href="/api/auth/signout">
                <div className="ds-button-primary text-xs sm:text-sm">Sign-Out</div>
              </Link>
            </div>
          ) : (
            <div className="ds-action-group">
              <Link href="/auth/signup" className="hidden sm:block">
                <div className="ds-button-secondary text-xs sm:text-sm">Sign-Up</div>
              </Link>
              <Link href="/auth/signin">
                <div className="ds-button-primary text-xs sm:text-sm">Sign-in</div>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-[3.25rem] left-0 right-0 bg-[#f8f6f2] border-b border-soft lg:hidden flex flex-col p-4 gap-4 shadow-xl z-50">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-lg py-2 px-4 hover:bg-brand-accent/20 rounded-md">Home</Link>
            <Link href="/booking" onClick={() => setIsOpen(false)} className="text-lg py-2 px-4 hover:bg-brand-accent/20 rounded-md">Reservation</Link>
            <Link href="/restaurants" onClick={() => setIsOpen(false)} className="text-lg py-2 px-4 hover:bg-brand-accent/20 rounded-md">Restaurants</Link>
            {session?.user?.role === "admin" || session?.user?.role === "restaurantOwner" ? (
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-lg py-2 px-4 hover:bg-brand-accent/20 rounded-md">Dashboard</Link>
            ) : (
              <Link href="/mybooking" onClick={() => setIsOpen(false)} className="text-lg py-2 px-4 hover:bg-brand-accent/20 rounded-md">My Booking</Link>
            )}
            {/* Mobile Actions (if not hidden by main group) */}
            <div className="sm:hidden flex flex-col gap-2 pt-4 border-t border-soft">
               {session ? (
                 <div className="text-center font-medium py-2">Hello, {session.user?.name}</div>
               ) : (
                 <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="text-center py-2 border rounded-md">Sign-Up</Link>
               )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
