"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Button } from "../shared/Button";
import { useRouter } from "next/navigation";

export function BookingCalendar() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Mock days 1-30
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  
  const timeSlots = [
    { time: "09:00 AM", status: "booked" },
    { time: "09:30 AM", status: "available" },
    { time: "10:00 AM", status: "1 left" },
    { time: "10:30 AM", status: "available" },
    { time: "11:00 AM", status: "available" },
    { time: "11:30 AM", status: "booked" },
    { time: "02:00 PM", status: "available" },
    { time: "02:30 PM", status: "1 left" },
  ];

  const handleBook = () => {
    if (selectedDate && selectedTime) {
      router.push(`/booking/1`);
    }
  };

  return (
    <div id="booking-calendar" className="py-10 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-[28px] font-bold text-navy mb-8">Available Slots</h2>
        
        <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          <div className="bg-teal py-4 px-6 text-white text-center">
            <h3 className="text-[20px] font-bold">November 2023</h3>
          </div>
          
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="grid grid-cols-7 gap-2 mb-4 text-center text-[14px] font-bold text-gray-400">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {/* Empty slots for starting day offset */}
                <div className="h-10 w-10"></div>
                <div className="h-10 w-10"></div>
                <div className="h-10 w-10"></div>
                
                {days.map(day => {
                  const isAvailable = day % 2 !== 0 && day > 10;
                  const isSelected = selectedDate === day;
                  
                  return (
                    <button
                      key={day}
                      disabled={!isAvailable}
                      onClick={() => setSelectedDate(day)}
                      className={`h-10 w-full max-w-[40px] mx-auto flex items-center justify-center rounded-full text-[14px] font-medium transition-all ${
                        isSelected 
                          ? "bg-navy text-white" 
                          : isAvailable 
                            ? "bg-teal/10 text-teal hover:bg-teal hover:text-white" 
                            : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-[18px] font-bold text-navy mb-4">
                {selectedDate ? `November ${selectedDate}, 2023` : "Select a date"}
              </h4>
              
              {selectedDate ? (
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot, index) => {
                    const isSelected = selectedTime === slot.time;
                    let bgClass = "bg-gray-100 text-gray-400 cursor-not-allowed";
                    
                    if (slot.status === "available") bgClass = "bg-[#D1FAE5] text-[#065F46] hover:bg-[#A7F3D0]";
                    if (slot.status === "1 left") bgClass = "bg-[#FEF3C7] text-yellow hover:bg-[#FDE68A]";
                    if (isSelected) bgClass = "bg-white border-2 border-teal text-teal font-bold";

                    return (
                      <button
                        key={index}
                        disabled={slot.status === "booked"}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`h-12 rounded-md text-[14px] font-medium transition-all flex flex-col items-center justify-center ${bgClass}`}
                      >
                        {isSelected ? (
                          <>
                            <span>{slot.time}</span>
                            <span className="text-[10px] leading-none">Selected ✓</span>
                          </>
                        ) : (
                          <span>{slot.time}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-[14px]">
                  Select a date to view available time slots
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[28px] font-bold text-teal">
              Total: {formatPrice(500)}
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full md:w-auto min-w-[200px]"
              disabled={!selectedDate || !selectedTime}
              onClick={handleBook}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
