"use client"
import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react";
import FeatureCard from "./FeatureCard";


export default function Banner() {

  const router = useRouter()

  const {data:session} = useSession()
  console.log(session?.user.token);

  return (
      <main className="relative flex h-screen w-full flex-col items-center justify-center text-center text-white">
        <Image src="/img/8.png" alt="Background" fill priority className="absolute inset-0 -z-10 h-full w-full object-cover brightness-[0.6] blur-xs"/>

        <div className="flex flex-col items-center gap-4 sm:gap-6 mt-10 md:mt-15 px-4 w-full max-w-5xl">
            <Image src="/logo.png" alt="logo" width={120} height={10} className="object-cover md:w-[150px]"/>

            <h1 className="text-4xl md:text-6xl font-semibold uppercase tracking-widest text-shadow-lg">Ratatouille</h1>

            <h2 className="text-base md:text-xl font-regular text-gray-200 max-w-2xl px-4">Elevate every occasion with a table tailored to your standards.</h2>

            <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#D9C89C] to-transparent"></div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-7 justify-center w-full max-w-md sm:max-w-none">
              <button className="cursor-pointer w-full sm:w-60 py-3 brightness-[1.1] rounded-lg bg-linear-to-r from-[#D9C89C] to-[#877959] transition-all duration-200 hover:scale-105 text-[#672E11] font-semibold" onClick={(e)=>{e.stopPropagation; router.push('/booking')}}>
                Reservation
              </button>

              <button className="
                bg-[#F5F5DC]/10 shadow-xl backdrop-blur border border-[#D9C89C]/90
                cursor-pointer w-full sm:w-60 py-3 border rounded-lg transition-all duration-200 hover:scale-105 text-[#D9C89C]"
                onClick={(e)=>{e.stopPropagation; router.push('/restaurants')}}>
                  View Restaurants
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10 justify-center mt-6 md:mt-10 w-full">
              <FeatureCard icon="/featureCard/PremierRestaurants.png" title={"Premier\nRestaurants"} description="Exclusive access to establishments." />
              <FeatureCard icon="/featureCard/CuratedExperiences.png" title={"Curated\nExperiences"} description="Romantic dinners and tasting menus." />
              <FeatureCard icon="/featureCard/GuaranteedSeating.png" title={"Guaranteed\nSeating"} description="Secure prime tables even during peak hours." />
              <FeatureCard icon="/featureCard/VIPServices.png" title={"VIP\nServices"} description="Dedicated concierge for personalized requests." />
            </div>
        </div>
      </main>
  );
}