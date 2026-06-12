"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Role = "company" | "expert";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  walletBalance?: number;
  user_metadata?: any;
  app_metadata?: any;
  aud?: string;
  created_at?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: Role) => {
    setUser({
      id: "mock-123",
      name: role === "company" ? "Acme Corp" : "Arjun Sharma",
      email: role === "company" ? "founder@acme.com" : "arjun@example.com",
      role,
      walletBalance: role === "company" ? 82400 : undefined,
      user_metadata: { full_name: role === "company" ? "Acme Corp" : "Arjun Sharma" },
      app_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString()
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        role: user?.role || null,
        login,
        logout,
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
