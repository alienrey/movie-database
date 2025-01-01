"use client";
import { Authentication } from "@/utils/Authentication";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import client from "@/utils/FeathersClient";
import { dynamicStorage } from "@/utils/DynamicStorage";

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
  createAccount: (email: string, password: string, name: string, signUpCode: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const trimInputs = (...inputs: string[]) => inputs.map(input => input.trim());

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const path = usePathname(); 
  const [user, setUser] = useState<User | null>(null);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    [email, password] = trimInputs(email, password);

    if(rememberMe) {
      dynamicStorage.setRememberMe(true);
    } else {
      dynamicStorage.setRememberMe(false);
    }

    const result = await Authentication.login(email, password);
    setUser(result.user);

    router.push("/");
  };

  const createAccount = async (
    email: string,
    password: string,
    name: string,
    signUpCode: string
  ) => {
    [email, password, name, signUpCode] = trimInputs(email, password, name, signUpCode);

    const result = await client.service('users').create({ email, password, name, signUpCode });
    setUser(result);
    router.push("/");
  };

  const logout = async () => {
    await Authentication.logout();
    setUser(null);
    dynamicStorage.clearAll();
    router.push("/");
  };

  const getAuthStatus = () => {
    return Authentication.isAuthenticated();
  };

  useEffect(() => {
    const reauthenticate = async () => {
      const token = dynamicStorage.getItem("feathers-jwt");
      if (!token) {
        if(path !== "/auth/signin" && path !== "/auth/signup") {
          router.push("/auth/signin");
        }
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

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: getAuthStatus(), login, logout, createAccount }}
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
