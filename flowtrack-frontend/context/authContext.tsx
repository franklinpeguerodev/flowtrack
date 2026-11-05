"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  saveToken,
  getToken,
  clearToken,
  decodeToken,
  isTokenExpired,
  getStoredProfile,
  saveProfile,
  clearProfile,
} from "@/lib/auth";
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
  logout: () => Promise<void>;
  updateUser: (partial: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getInitialUser(): User | null {
  const token = getToken();

  if (!token) return null;

  if (isTokenExpired(token)) {
    clearToken();
    clearProfile();
    return null;
  }

  const decoded = decodeToken(token);
  if (!decoded) return null;

  // El token identifica al usuario; el perfil local permite reflejar cambios
  // (por ejemplo el nombre) sin endpoint de perfil ni refresh token.
  const stored = getStoredProfile();

  return {
    name: stored?.name || decoded.name,
    email: stored?.email || decoded.email,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const router = useRouter();

  function updateUser(partial: Partial<User>) {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      saveProfile({ name: next.name, email: next.email });
      return next;
    });
  }

  async function login(dto: UserLoginDto) {
    const response = await apiFetch<AuthResponseDto>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    });

    saveToken(response.token);
    saveProfile({ name: response.name, email: response.email });
    setUser({ name: response.name, email: response.email });
    router.push("/dashboard");
  }

  async function register(dto: UserRegisterDto) {
    const response = await apiFetch<AuthResponseDto>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(dto),
    });

    saveToken(response.token);
    saveProfile({ name: response.name, email: response.email });
    setUser({ name: response.name, email: response.email });
    router.push("/dashboard");
  }

  async function logout() {
    try {
      // Invalida el token en el backend (incrementa token_version).
      await apiFetch<void>("/api/auth/logout", { method: "POST" });
    } catch {
      // Si el token ya expiró o la API no responde, se limpia la sesión local igual.
    } finally {
      clearToken();
      clearProfile();
      setUser(null);
      router.push("/login");
    }
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
