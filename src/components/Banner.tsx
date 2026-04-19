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

        <div className="flex flex-col items-center gap-6 mt-15">

            <Image src="/logo.png" alt="logo" width={150} height={10} className="object-cover"/>

            <h1 className="text-6xl font-semibold uppercase">Ratatouille</h1>

            <h2 className="text-xl font-regular text-gray-200">Elevate every occasion with a table tailored to your standards.</h2>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D9C89C] to-transparent"></div>

            <div className="flex gap-7 justify-center">
              <button className="cursor-pointer w-60 py-2 brightness-[1.1] rounded-lg bg-linear-to-r from-[#D9C89C] to-[#877959] transition-all duration-200 hover:scale-105 text-[#672E11]" onClick={(e)=>{e.stopPropagation; router.push('/booking')}}>
                Reservation
              </button>

              <button className="
                bg-[#F5F5DC]/10 shadow-xl backdrop-blur border border-[#D9C89C]/90
                cursor-pointer w-60 py-2 border rounded-lg transition-all duration-200 hover:scale-105 text-[#D9C89C]"
                onClick={(e)=>{e.stopPropagation; router.push('/restaurants')}}>
                  View Restaurants
              </button>
            </div>


            <div className="flex gap-10 justify-center mt-10">
              <FeatureCard icon="/featureCard/PremierRestaurants.png" title={"Premier\nRestaurants"} description="Exclusive access to Michelin-starred establishments and hidden gems." />
              <FeatureCard icon="/featureCard/CuratedExperiences.png" title={"Curated\nExperiences"} description="Discover romantic dinners, business luncheons, and bespoke tasting menus." />
              <FeatureCard icon="/featureCard/GuaranteedSeating.png" title={"Guaranteed\nSeating"} description="Secure prime tables at the city's most sought-after venues, even during peak hours." />
              <FeatureCard icon="/featureCard/VIPServices.png" title={"VIP\nServices"} description="Dedicated concierge for personalized requests, private rooms, and special occasions." />
            </div>

        </div>
      </main>
  );
}