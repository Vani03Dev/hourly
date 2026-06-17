import React from 'react';
import { ExpertSidebar } from '@/components/layout/ExpertSidebar';
import { PresenceTracker } from '@/components/shared/PresenceTracker';

export default function ExpertPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed top-[64px] left-0 right-0 bottom-0 z-40 overflow-hidden bg-[#FCFCFD]">
      <PresenceTracker />
      <div className="flex h-full overflow-hidden font-sans">
        <ExpertSidebar />
        <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  );
}
