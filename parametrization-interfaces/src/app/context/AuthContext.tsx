"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { AuthContextType, UserInterface } from "./interfaces/auth.interface";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {

  const [user, setUser] = useState<UserInterface | undefined>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("user") || "null");
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          await apiGet("/auth/profile");
        } catch (error) {
          console.error("Error fetching user", error);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const getUser = () => {
    return JSON.parse(localStorage.getItem("user") || "null");
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await apiPost("/auth/login", { email, password });
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.user);
      router.push("/home/dashboard");

    } catch (error) {
      throw new Error("Credenciales incorrectas");
    }
  };

  const recovery_pass = async (email: string, password: string, password_confirm: string) => {
    try {
      const res = await apiPost("/auth/recovery_pass", { email, password, password_confirm });
    } catch (error) {
      throw new Error("Credenciales incorrectas");
    }
  };

  const logout = async () => {
    const res = await apiPost("/auth/logout", {});
    if (res) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      localStorage.clear();
      router.push("/auth/login");
      setUser(undefined);
    }
  };

  const getUserRolName = () => {
    if (user) {
      return user.rol.name;
    }
    return null;
  };

  const isRolAdmin = () => {
    if (user) {
      return user.rol.isAdmin;
    }
    return false;
  };

  const getPermissons = ( ) => {
    if (user) {
      return user.rol.permissons;
    }
    return [];
  };

  const hasPermission = (permission: string) => {
    return getUser()?.rol.permissons.includes(permission) ?? false;
  };

  const value = useMemo(() => ({ user, login, recovery_pass, logout , getUserRolName, isRolAdmin, getPermissons, hasPermission, loading }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
