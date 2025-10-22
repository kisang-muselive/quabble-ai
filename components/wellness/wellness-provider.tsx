"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface WellnessContextType {
  isWellnessModalOpen: boolean;
  openWellnessModal: () => void;
  closeWellnessModal: () => void;
  shouldShowWellnessTrigger: boolean;
  setShouldShowWellnessTrigger: (show: boolean) => void;
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export function WellnessProvider({ children }: { children: ReactNode }) {
  const [isWellnessModalOpen, setIsWellnessModalOpen] = useState(false);
  const [shouldShowWellnessTrigger, setShouldShowWellnessTrigger] = useState(false);

  const openWellnessModal = () => setIsWellnessModalOpen(true);
  const closeWellnessModal = () => setIsWellnessModalOpen(false);

  return (
    <WellnessContext.Provider
      value={{
        isWellnessModalOpen,
        openWellnessModal,
        closeWellnessModal,
        shouldShowWellnessTrigger,
        setShouldShowWellnessTrigger,
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  const context = useContext(WellnessContext);
  if (context === undefined) {
    throw new Error("useWellness must be used within a WellnessProvider");
  }
  return context;
}
