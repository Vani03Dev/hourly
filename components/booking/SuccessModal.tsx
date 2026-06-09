"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Calendar, Video, ArrowRight } from "lucide-react";
import { Expert } from "@/types";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";

interface SuccessModalProps {
  isOpen: boolean;
  expert: Expert;
}

export function SuccessModal({ isOpen, expert }: SuccessModalProps) {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <div className="flex flex-col items-center text-center py-4">
        <div className="h-20 w-20 bg-green/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-12 w-12 text-green animate-bounce" />
        </div>
        
        <h2 className="text-[32px] font-bold text-navy mb-4">Booking Confirmed!</h2>
        <p className="text-[18px] text-gray-600 mb-8 max-w-md">
          Your session with {expert.name} has been successfully scheduled. We've sent a calendar invite to your email.
        </p>

        <Card padding="32" className="w-full mb-8 bg-gray-50 border-none">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-left">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-teal" />
              <div>
                <p className="text-[14px] text-gray-500 font-medium">Date & Time</p>
                <p className="text-[16px] font-bold text-navy">Thu, Nov 16 • 10:00 AM</p>
              </div>
            </div>
            
            <div className="hidden md:block w-px h-12 bg-gray-300" />
            
            <div className="flex items-center gap-3">
              <Video className="h-8 w-8 text-teal" />
              <div>
                <p className="text-[14px] text-gray-500 font-medium">Format</p>
                <p className="text-[16px] font-bold text-navy">Google Meet</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button 
            variant="primary" 
            className="flex-1 h-[52px]"
            onClick={() => router.push("/dashboard")}
          >
            Go to My Bookings <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 h-[52px]"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </Modal>
  );
}
