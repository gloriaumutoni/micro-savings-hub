import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../types";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  setAuth: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function parseJwt(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { id: payload.id, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem("token");
    if (!stored || !parseJwt(stored)) {
      localStorage.removeItem("token");
      return null;
    }
    return stored;
  });
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("token");
    return stored ? parseJwt(stored) : null;
  });

  const setAuth = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(parseJwt(newToken));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
