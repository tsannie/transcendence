import React, { createContext, Dispatch, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export type TransitionContextType = {
  enableTransition: boolean;
  transitionStage: string;
  displayLocation: any;
  location: any;
  setEnableTransition: (enableTransition: boolean) => void;
  setTransistionStage: (stage: string) => void;
  setDisplayLocation: (location: any) => void;
};

export const TransitionContext = createContext<Partial<TransitionContextType>>(
  {}
);

interface IProps {
  children: JSX.Element | JSX.Element[];
}

enum TransitionPageLvl {
  NULL = 0,
  PROFILE = 1,
  CHAT = 2,
  GAME = 3,
  SETTINGS = 4,
}

export const TransitionProvider = ({ children }: IProps) => {
  const location = useLocation();

  const [enableTransition, setEnableTransition] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("");
  const [actualLvl, setActualLvl] = useState(TransitionPageLvl.NULL);

  function getTransitionStage(path: string) {
    switch (path.split("/")[1]) {
      case "profile":
        return TransitionPageLvl.PROFILE;
      case "chat":
        return TransitionPageLvl.CHAT;
      case "game":
        return TransitionPageLvl.GAME;
      case "settings":
        return TransitionPageLvl.SETTINGS;
      default:
        return TransitionPageLvl.NULL;
    }
  }

  useEffect(() => {
    const newLvl = getTransitionStage(location.pathname);

    if (newLvl !== actualLvl && actualLvl !== TransitionPageLvl.NULL) {
      if (actualLvl < newLvl) {
        setTransistionStage("exit-up");
      } else if (actualLvl > newLvl) {
        setTransistionStage("exit-down");
      }
    } else {
      setDisplayLocation(location);
    }
    setActualLvl(newLvl);
  }, [location, displayLocation]);

  return (
    <TransitionContext.Provider
      value={{
        setEnableTransition,
        enableTransition,
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
