/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Authentication } from "@/utils/Authentication";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import client from "@/utils/FeathersClient";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

const login = async (
  email: string,
  password: string,
  rememberMe: boolean
) => {

  if(rememberMe) {
    localStorage.setItem("remember-me", "true");
  }

  const result = await Authentication.login(email, password);
  setUser(result.user);

  router.push("/");
};

  const logout = async () => {
    await Authentication.logout();
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
    router.push("/");
  };

  const getAuthStatus = () => {
    return Authentication.isAuthenticated();
  };

  useEffect(() => {
    const reauthenticate = async () => {
      const token = localStorage.getItem("feathers-jwt");

      if (!token) {
        router.push("/auth/signin");
      } else {
        try {
          const { user } = await client.reAuthenticate();
          setUser(user);
        } catch (error) {
          console.error("Reauthentication failed:", error);
          router.push("/auth/signin");
        }
      }
    };
    reauthenticate();
  }, [router]);

  window.onbeforeunload = () => {
    console.log("localStorage.getItem('remember-me')", localStorage.getItem("remember-me"));
    if(!localStorage.getItem("remember-me")){
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: getAuthStatus(), login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
