"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../shared/Button";
import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ActionBarProps {
  price: number;
}

export function ActionBar({ price }: ActionBarProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`w-full bg-white transition-all duration-300 z-30 ${isSticky ? "fixed top-16 left-0 shadow-md py-4 border-b border-gray-100" : "relative py-6"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[32px] font-bold text-teal">
            {formatPrice(price)}<span className="text-[16px] font-normal text-gray-500 ml-1">/session</span>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="h-[52px] w-12 px-0 flex-shrink-0 text-gray-500 border-gray-300 hover:text-navy hover:border-navy">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="h-[52px] flex-grow md:flex-grow-0 md:w-[160px] text-[16px]">
              Ask Question
            </Button>
            <Button variant="primary" className="h-[52px] flex-grow md:flex-grow-0 md:w-[200px] text-[16px]" onClick={() => {
              document.getElementById("booking-calendar")?.scrollIntoView({ behavior: "smooth" });
            }}>
              Book Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
