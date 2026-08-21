"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { saveToken, getToken, clearToken, decodeToken, isTokenExpired } from "@/lib/auth";
import { AuthResponseDto, UserLoginDto, UserRegisterDto } from "@/types/auth";

interface User {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: UserLoginDto) => Promise<void>;
  register: (dto: UserRegisterDto) => Promise<void>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getInitialUser(): User | null {
  const token = getToken();

  if (!token) return null;

  if (isTokenExpired(token)) {
    clearToken();
    return null;
  }

  const decoded = decodeToken(token);
  return decoded ? { name: decoded.name, email: decoded.email } : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const router = useRouter();

  function updateUser(partial: Partial<User>) {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  }

  async function login(dto: UserLoginDto) {
    const response = await apiFetch<AuthResponseDto>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    });

    saveToken(response.token);
    setUser({ name: response.name, email: response.email });
    router.push("/dashboard");
  }

  async function register(dto: UserRegisterDto) {
    const response = await apiFetch<AuthResponseDto>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(dto),
    });

    saveToken(response.token);
    setUser({ name: response.name, email: response.email });
    router.push("/dashboard");
  }

  function logout() {
    clearToken();
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: false,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}