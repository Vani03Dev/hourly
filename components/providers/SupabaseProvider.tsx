"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createClient } from "@/utils/supabase/client";
import { setAuth, clearAuth } from "@/store/slices/authSlice";

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const supabase = createClient();

  useEffect(() => {
    // 1. Fetch initial session on mount (covers hard reloads)
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        dispatch(
          setAuth({
            user: session.user,
            token: session.access_token,
          })
        );
      } else {
        dispatch(clearAuth());
      }
    };

    initializeAuth();

    // 2. Listen to ongoing auth changes (covers logins/logouts in other tabs or components)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(
          setAuth({
            user: session.user,
            token: session.access_token,
          })
        );
      } else {
        dispatch(clearAuth());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, supabase.auth]);

  return <>{children}</>;
}
