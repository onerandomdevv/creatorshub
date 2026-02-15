"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    credentials: any,
  ) => Promise<{
    success: boolean;
    requiresVerification?: boolean;
    email?: string;
    error?: string;
  }>;
  register: (userData: any) => Promise<{
    success: boolean;
    requiresVerification?: boolean;
    email?: string;
    error?: string;
  }>;
  logout: (redirectPath?: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const storedUser = localStorage.getItem("gmc_user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.token) {
            const data = await api.getMe(parsedUser.token);
            if (data.success) {
              setUser({ ...data.user, token: parsedUser.token });
            } else {
              localStorage.removeItem("gmc_user");
            }
          }
        } catch (e) {
          localStorage.removeItem("gmc_user");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      const data = await api.login(credentials);
      if (data.success) {
        if (data.requiresVerification) {
          toast.error("Please verify your email address.");
          // We return email so the UI can redirect
          return {
            success: false,
            requiresVerification: true,
            email: credentials.email,
          };
        }

        const userData = { ...data.user, token: data.token };
        setUser(userData);
        localStorage.setItem("gmc_user", JSON.stringify(userData));
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true };
      } else {
        toast.error(data.error || "Login failed");
        // Check if error response indicates verification (though backend sends 401, data.requiresVerification depends on how api.login parses error)
        if (data.requiresVerification) {
          return {
            success: false,
            requiresVerification: true,
            email: credentials.email,
          };
        }
        return { success: false, error: data.error };
      }
    } catch (err) {
      toast.error("Network error during login");
      return { success: false, error: "Network error" };
    }
  };

  const register = async (userData: any) => {
    try {
      const data = await api.register(userData);
      if (data.success) {
        if (data.requiresVerification) {
          toast.success("Please verify your email address.");
          return {
            success: true,
            requiresVerification: true,
            email: data.email,
          };
        }

        const newUser = { ...data.user, token: data.token };
        setUser(newUser);
        localStorage.setItem("gmc_user", JSON.stringify(newUser));
        toast.success("Account created successfully!");
        return { success: true };
      } else {
        toast.error(data.error || "Registration failed");
        return { success: false, error: data.error };
      }
    } catch (err) {
      toast.error("Network error during registration");
      return { success: false, error: "Network error" };
    }
  };

  const logout = (redirectPath: string = "/login") => {
    setUser(null);
    localStorage.removeItem("gmc_user");
    window.location.assign(redirectPath);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
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
