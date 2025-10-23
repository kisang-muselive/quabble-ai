"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface WellnessContextType {
  isWellnessModalOpen: boolean;
  openWellnessModal: (exerciseId?: string) => void;
  closeWellnessModal: () => void;
  shouldShowWellnessTrigger: boolean;
  setShouldShowWellnessTrigger: (show: boolean) => void;
  isRoutineCheckinModalOpen: boolean;
  openRoutineCheckinModal: () => void;
  closeRoutineCheckinModal: () => void;
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export function WellnessProvider({ children }: { children: ReactNode }) {
  const [isWellnessModalOpen, setIsWellnessModalOpen] = useState(false);
  const [shouldShowWellnessTrigger, setShouldShowWellnessTrigger] = useState(false);
  const [isRoutineCheckinModalOpen, setIsRoutineCheckinModalOpen] = useState(false);

  const openWellnessModal = (exerciseId?: string) => {
    setIsWellnessModalOpen(true);
  };
  const closeWellnessModal = () => setIsWellnessModalOpen(false);

  const openRoutineCheckinModal = () => setIsRoutineCheckinModalOpen(true);
  const closeRoutineCheckinModal = () => setIsRoutineCheckinModalOpen(false);

  return (
    <WellnessContext.Provider
      value={{
        isWellnessModalOpen,
        openWellnessModal,
        closeWellnessModal,
        shouldShowWellnessTrigger,
        setShouldShowWellnessTrigger,
        isRoutineCheckinModalOpen,
        openRoutineCheckinModal,
        closeRoutineCheckinModal,
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
