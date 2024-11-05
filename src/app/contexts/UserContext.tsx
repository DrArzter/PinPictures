import React, { useState, useContext, useEffect } from "react";
import * as api from "@/app/api";

// Создаем UserContext
const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

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

export const useUserContext = () => useContext(UserContext);
