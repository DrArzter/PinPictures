"use client";
import React, { useState, useContext, useEffect, ReactNode } from "react";
import * as api from "@/app/api";

const StuffContext = React.createContext<Record<string, unknown> | undefined>(
  undefined
);

interface StuffProviderProps {
  children: ReactNode;
}

export const StuffProvider: React.FC<StuffProviderProps> = ({ children }) => {
  return <StuffContext.Provider value={{}}>{children}</StuffContext.Provider>;
};

export const useStuffContext = () => {
  const context = useContext(StuffContext);
  if (!context) {
    throw new Error("useStuffContext must be used within a StuffProvider");
  }
  return context;
};
