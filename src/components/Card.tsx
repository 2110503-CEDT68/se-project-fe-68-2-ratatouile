"use client"
import Image from "next/image";
import InteractiveCard from "./InteractiveCard";
import { Rating } from "@mui/material";
import React from "react";

export default function Card({restaurantName,imgSrc,onRatingChange} : {restaurantName:string,imgSrc:string,onRatingChange?: Function}) {

  return (
    <InteractiveCard>
      <div className="relative h-[190px] w-full rounded-md overflow-hidden">
          <Image src={imgSrc} alt={restaurantName} fill className="object-cover"/>
      </div>

      <p className="mt-3 text-lg font-semibold text-center mb-2">{restaurantName}</p>

      {onRatingChange && <Rating
        id={`${restaurantName} Rating`}
        name={`${restaurantName} Rating`}
        data-testid={`${restaurantName} Rating`}
        size="large"
        onClick={(e)=>e.stopPropagation()}
        onChange={(event, newValue) => {
          onRatingChange(restaurantName, newValue)
        }}
      />}
    </InteractiveCard>
  );
}