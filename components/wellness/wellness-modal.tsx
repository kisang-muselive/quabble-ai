"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { BreathingExercise, type BreathingExerciseType } from "./breathing-exercise";
import Image from "next/image";

interface WellnessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseId?: string;
}

const BREATHING_TECHNIQUES: Array<{
  id: BreathingExerciseType;
  name: string;
  displayName: string;
}> = [
  { id: "box", name: "Box breathing", displayName: "Box breathing" },
  { id: "478", name: "4 • 7 • 8 breathing", displayName: "4 • 7 • 8 breathing" },
  { id: "555", name: "5 • 5 • 5 breathing", displayName: "5 • 5 • 5 breathing" },
];

export function WellnessModal({
  open,
  onOpenChange,
  exerciseId = "breathing",
}: WellnessModalProps) {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingExerciseType>("478");
  const [isExerciseStarted, setIsExerciseStarted] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setIsExerciseStarted(false);
      // Map exercise IDs to breathing exercise types
      const getBreathingExerciseType = (id: string): BreathingExerciseType => {
        switch (id) {
          case "box-breathing":
            return "box";
          case "breathing":
            return "478";
          case "555-breathing":
            return "555";
          default:
            return "478";
        }
      };
      setSelectedTechnique(getBreathingExerciseType(exerciseId));
    } else {
      setIsExerciseStarted(false);
    }
  }, [open, exerciseId]);

  const handlePrevious = () => {
    const currentIndex = BREATHING_TECHNIQUES.findIndex(t => t.id === selectedTechnique);
    const previousIndex = currentIndex === 0 ? BREATHING_TECHNIQUES.length - 1 : currentIndex - 1;
    setSelectedTechnique(BREATHING_TECHNIQUES[previousIndex].id);
  };

  const handleNext = () => {
    const currentIndex = BREATHING_TECHNIQUES.findIndex(t => t.id === selectedTechnique);
    const nextIndex = currentIndex === BREATHING_TECHNIQUES.length - 1 ? 0 : currentIndex + 1;
    setSelectedTechnique(BREATHING_TECHNIQUES[nextIndex].id);
  };

  const handleBegin = () => {
    setIsExerciseStarted(true);
  };

  const handleComplete = () => {
    setIsExerciseStarted(false);
    onOpenChange(false);
  };

  const currentTechnique = BREATHING_TECHNIQUES.find(t => t.id === selectedTechnique);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 rounded-lg sm:rounded-lg" showCloseButton={false}>
        {!isExerciseStarted ? (
          // Selection Screen
          <div className="relative min-h-[600px] flex flex-col">
            {/* Background image based on technique */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: selectedTechnique === "box" 
                  ? "url(/workouts/breathing/breathing_bg.jpg)"
                  : selectedTechnique === "478"
                  ? "url(/workouts/breathing/breathing_bg_478.jpg)"
                  : "url(/workouts/breathing/breathing_bg_555.jpg)"
              }}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/10" />
            
            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Info button */}
            <button
              className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              <span className="text-white text-sm font-semibold">i</span>
            </button>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-8">
              {/* Title */}
              <h2 className="text-4xl font-bold mb-2" style={{ color: selectedTechnique === "555" ? "white" : selectedTechnique === "478" ? "white" : "#64B5F6" }}>
                1 min Breathing
              </h2>
              <p className="text-base mb-8 text-center" style={{ color: selectedTechnique === "555" ? "rgba(255,255,255,0.9)" : selectedTechnique === "478" ? "rgba(255,255,255,0.9)" : "#90CAF9" }}>
                Just 60 seconds to calm your thoughts and stay grounded.
              </p>

              {/* Duck and Cloud Illustration */}
              <div className="relative w-[280px] h-[280px] mb-8 flex items-center justify-center">
                <Image
                  src="/workouts/breathing/breathing_cloud.svg"
                  alt="Cloud"
                  width={279}
                  height={232}
                  className="absolute z-0"
                />
                <Image
                  src="/workouts/breathing/breathing_duck.svg"
                  alt="Duck"
                  width={223}
                  height={176}
                  className="absolute z-10"
                />
              </div>

              {/* Technique Selection */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Previous technique"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div className="text-center min-w-[200px]">
                  <p className="text-2xl font-semibold mb-2 text-white">
                    {currentTechnique?.displayName}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    3 Set
                  </Button>
                </div>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Next technique"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Begin Button */}
              <Button
                onClick={handleBegin}
                size="lg"
                className="w-full max-w-[320px] rounded-full text-lg font-semibold py-6 bg-white hover:bg-gray-100 text-black shadow-lg"
              >
                Begin
              </Button>
            </div>
          </div>
        ) : (
          // Exercise Screen
          <div className="py-4">
            <BreathingExercise
              exerciseType={selectedTechnique}
              onComplete={handleComplete}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
