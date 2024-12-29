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
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const result = await Authentication.login(email, password);
    setUser(result.user);
  };

  const logout = async () => {
    await Authentication.logout();
    setUser(null);
    router.push("/");
  };

  const getAuthStatus = () => {
    return Authentication.isAuthenticated();
  };

  useEffect(() => {
    const reauthenticate = async () => {
      const token = window.localStorage.getItem("feathers-jwt");
      if (!client.authentication.authenticated) {
        if (!token) {
          router.push("/auth/signin");
        } else {
          try {
            await client.authentication.setAccessToken(token);
            const { user } = await client.reAuthenticate();
            setUser(user);
          } catch (error) {
            console.error("Reauthentication failed:", error);
            router.push("/auth/signin");
          }
        }
      }
    };
    reauthenticate();
  }, [router, Authentication.isAuthenticated()]);

  console.log(Authentication.isAuthenticated());

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
