"use client";
import React, { useState, useContext, useEffect, ReactNode } from "react";
import * as api from "@/app/api";
import { User, UserContextType } from "@/app/types/global";

// Создаем UserContext с типом UserContextType
const UserContext = React.createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      setUserLoading(true);
      const response = await api.getUser();
      if (response) {
        setUser(response);
      } else {
        console.warn("No response from API.");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, fetchUser, userLoading, setUserLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
