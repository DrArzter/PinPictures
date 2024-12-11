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
      api.getUser().then((response) => {
        if (response.data.data) {
          setUser(response.data.data);
        } else {
          setUser(undefined);
        }
      });
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
