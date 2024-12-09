"use client";
import React, { useState, useContext, useEffect, ReactNode } from "react";
import * as api from "@/app/api";
import { ClientSelfUser, ClientSelfUserContextType } from "@/app/types/global";

const UserContext = React.createContext<ClientSelfUserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ClientSelfUser | undefined>(undefined);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      setUserLoading(true);
      const response = await api.getUser();
      if (response) {
        console.log("Fetched user:", response);
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
      value={{
        user: user,
        setUser: setUser,
        fetchUser: fetchUser,
        userLoading: userLoading,
        setUserLoading: setUserLoading,
      }}
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
