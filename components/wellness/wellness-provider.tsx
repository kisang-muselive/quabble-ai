"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface WellnessContextType {
  isWellnessModalOpen: boolean;
  currentExerciseId: string;
  openWellnessModal: (exerciseId?: string) => void;
  closeWellnessModal: () => void;
  shouldShowWellnessTrigger: boolean;
  setShouldShowWellnessTrigger: (show: boolean) => void;
  isRoutineCheckinModalOpen: boolean;
  openRoutineCheckinModal: () => void;
  closeRoutineCheckinModal: () => void;
  isAppOnlyModalOpen: boolean;
  appOnlyExerciseId: string;
  appOnlyTitle: string;
  appOnlyDescription: string;
  openAppOnlyModal: (exerciseId: string, title: string, description: string) => void;
  closeAppOnlyModal: () => void;
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export function WellnessProvider({ children }: { children: ReactNode }) {
  const [isWellnessModalOpen, setIsWellnessModalOpen] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState("breathing");
  const [shouldShowWellnessTrigger, setShouldShowWellnessTrigger] = useState(false);
  const [isRoutineCheckinModalOpen, setIsRoutineCheckinModalOpen] = useState(false);
  const [isAppOnlyModalOpen, setIsAppOnlyModalOpen] = useState(false);
  const [appOnlyExerciseId, setAppOnlyExerciseId] = useState("");
  const [appOnlyTitle, setAppOnlyTitle] = useState("");
  const [appOnlyDescription, setAppOnlyDescription] = useState("");

  const openWellnessModal = (exerciseId?: string) => {
    setCurrentExerciseId(exerciseId || "breathing");
    setIsWellnessModalOpen(true);
  };
  const closeWellnessModal = () => setIsWellnessModalOpen(false);

  const openRoutineCheckinModal = () => setIsRoutineCheckinModalOpen(true);
  const closeRoutineCheckinModal = () => setIsRoutineCheckinModalOpen(false);

  const openAppOnlyModal = (exerciseId: string, title: string, description: string) => {
    setAppOnlyExerciseId(exerciseId);
    setAppOnlyTitle(title);
    setAppOnlyDescription(description);
    setIsAppOnlyModalOpen(true);
  };
  const closeAppOnlyModal = () => setIsAppOnlyModalOpen(false);

  return (
    <WellnessContext.Provider
      value={{
        isWellnessModalOpen,
        currentExerciseId,
        openWellnessModal,
        closeWellnessModal,
        shouldShowWellnessTrigger,
        setShouldShowWellnessTrigger,
        isRoutineCheckinModalOpen,
        openRoutineCheckinModal,
        closeRoutineCheckinModal,
        isAppOnlyModalOpen,
        appOnlyExerciseId,
        appOnlyTitle,
        appOnlyDescription,
        openAppOnlyModal,
        closeAppOnlyModal,
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
