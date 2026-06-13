import React from "react";
import { BrowseExperts } from "../../components/experts/BrowseExperts";

export const metadata = {
  title: "Browse Experts | Sessionly",
  description: "Find and book verified startup and corporate experts (CAs, lawyers, CTOs, CFOs, HR leads) for 15-60 min paid sessions. Pay per session.",
};

export default function ExpertsPage() {
  return (
    <div className="bg-bg min-h-screen">
      {/* Banner */}
      <div className="bg-white border-b border-border py-[32px] text-center px-[20px]">
        <h1 className="text-[28px] md:text-[36px] font-bold text-primary leading-tight">
          Browse Verified Experts
        </h1>
        <p className="text-[14px] md:text-[16px] text-muted mt-[8px] max-w-[500px] mx-auto leading-relaxed">
          On-demand B2B consultation sessions billed per minute. Get tax-compliant invoices and Input Credit.
        </p>
      </div>

      {/* Main Browse and filter component */}
      <BrowseExperts />
    </div>
  );
}
