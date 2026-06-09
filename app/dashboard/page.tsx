import React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpcomingSection } from "@/components/dashboard/UpcomingSection";
import { BookingsList } from "@/components/dashboard/BookingsList";

import { Box } from "@mui/material";

export default function DashboardPage() {
  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <DashboardHeader />
      <UpcomingSection />
      <BookingsList />
    </Box>
  );
}
