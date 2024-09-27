"use client";
import { createContext, useContext, useState } from "react";

type TriggerContextType = {
  triggerFunction: () => void;
  setTriggerFunction: (func: () => void) => void;
};

const TriggerContext = createContext<TriggerContextType | undefined>(undefined);

export const useTriggerContext = () => {
  const context = useContext(TriggerContext);
  if (!context) {
    throw new Error("useTriggerContext must be used within a TriggerProvider");
  }
  return context;
};

export const TriggerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [triggerFunction, setTriggerFunction] = useState<() => void>(() => {});

  return (
    <TriggerContext.Provider value={{ triggerFunction, setTriggerFunction }}>
      {children}
    </TriggerContext.Provider>
  );
};
