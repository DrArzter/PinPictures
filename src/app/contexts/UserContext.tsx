import React, { useState, useContext, useEffect } from "react";
import * as api from "@/app/api";

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
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

    fetchUser();
  }, []);

  // Передаем все нужные значения в контекст
  return (
    <UserContext.Provider value={{ user, setUser, setUserLoading, userLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
