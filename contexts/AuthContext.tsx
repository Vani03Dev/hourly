"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useDispatch } from "react-redux";
import { setAuth, clearAuth } from "@/store/slices/authSlice";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Note: we instantiate the supabase client once securely inside the provider
  const supabase = createClient();

  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuthChange = async (currentSession: Session | null) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user && currentSession.access_token) {
        // Fetch onboarding status
        const { data } = await supabase
          .from('expert_profiles')
          .select('is_onboarded')
          .eq('id', currentSession.user.id)
          .single();
          
        const isOnboarded = !!data?.is_onboarded;
        
        dispatch(setAuth({ 
          user: currentSession.user, 
          token: currentSession.access_token,
          isOnboarded 
        }));
      } else {
        dispatch(clearAuth());
      }
      setIsLoading(false);
    };

    // 1. Fetch active session instantly on mount
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleAuthChange(session);
    };
    
    fetchSession();

    // 2. Setup highly-secure real-time listener for Auth State changes (Login, Logout, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        handleAuthChange(currentSession);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, dispatch]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
