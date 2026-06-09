"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, role?: string) => void;
  logout: () => void;
  signup: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, role: string = "mentee") => {
    setUser({
      id: "u123",
      name: email.split("@")[0],
      email: email,
      avatar: "https://i.pravatar.cc/150?u=current_user",
      role
    });
  };

  const logout = () => {
    setUser(null);
  };

  const signup = (userData: any) => {
    setUser({
      id: "u124",
      name: userData.name,
      email: userData.email,
      avatar: "https://i.pravatar.cc/150?u=new_user",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        signup,
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
