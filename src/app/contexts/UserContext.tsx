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
        console.log(response);
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

  return (
    <UserContext.Provider value={{ user, setUser, setUserLoading, userLoading }}>
      <div
        style={{
          backgroundImage: user?.uiBackground ? `url(${user.uiBackground})` : "none",
        }}>
        {children}
      </div>
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
