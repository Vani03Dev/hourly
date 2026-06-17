"use client";

import { useEffect, useRef } from "react";
import { updatePresence } from "@/app/actions/presence";

export function PresenceTracker() {
  const isOnlineRef = useRef(false);

  useEffect(() => {
    const pingOnline = async () => {
      try {
        await updatePresence(true);
        isOnlineRef.current = true;
      } catch (e) {
        console.error("Failed to ping presence", e);
      }
    };

    const pingOffline = () => {
      updatePresence(false).catch(() => {});
      isOnlineRef.current = false;
    };

    // Initial ping when mounted
    pingOnline();

    // Listen for visibility changes (tab hidden or closed)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        pingOffline();
      } else if (document.visibilityState === 'visible') {
        pingOnline();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", pingOffline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", pingOffline);
      if (isOnlineRef.current) {
        pingOffline();
      }
    };
  }, []);

  return null;
}
