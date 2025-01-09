"use client";
import { createContext, useState } from "react";

export const UserLocationContext = createContext();

export const UserLocationContextProvider = ({ children }) => {

  return (
    <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
      {children}
    </UserLocationContext.Provider>
  );
};
