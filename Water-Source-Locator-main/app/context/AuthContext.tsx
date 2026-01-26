// context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  user: { id: string; email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  const login = async (email: string, password: string) => {
    // Call your backend here
    // If success:
    setUser({ id: "123", email });
  };

  const signup = async (email: string, password: string) => {
    // Call your backend API for signup
    // If success:
    setUser({ id: "123", email }); // ✅ sets the user immediately
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
