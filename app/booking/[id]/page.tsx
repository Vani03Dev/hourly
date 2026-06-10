import React from "react";
import { notFound } from "next/navigation";
import { mockExperts } from "@/lib/mock-data";
import { BookingConfirmation } from "../../../components/booking/BookingConfirmation";

export default function BookingPage({ params }: { params: { id: string } }) {
  const expert = mockExperts.find(e => e.id === params.id) || mockExperts[0];

  if (!expert) {
    notFound();
  }

  return <BookingConfirmation expert={expert} />;
}
