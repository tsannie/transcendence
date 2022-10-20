import React, { createContext, Dispatch, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export type TransitionContextType = {
  transitionStage: string;
  displayLocation: any;
  location: any;
  setTransistionStage: (stage: string) => void;
  setDisplayLocation: (location: any) => void;
};

export const TransitionContext = createContext<Partial<TransitionContextType>>(
  {}
);

interface IProps {
  children: JSX.Element | JSX.Element[];
}

export const TransitionProvider = ({ children }: IProps) => {
  const location = useLocation();

  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("bounce-in-up");

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage("bounce-in-down");
  }, [location, displayLocation]);

  return (
    <TransitionContext.Provider
      value={{
        displayLocation,
        transitionStage,
        setTransistionStage,
        setDisplayLocation,
        location,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};
