"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { BreathingExercise, type BreathingExerciseType } from "./breathing-exercise";
import { Grounding54321Exercise } from "./grounding-54321-exercise";
import { WatermelonTaichiExercise } from "./watermelon-taichi-exercise";
import { MindfulMeditationExercise } from "./mindful-meditation-exercise";
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
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingExerciseType>("box");
  const [isExerciseStarted, setIsExerciseStarted] = useState(false);
  const [exerciseKey, setExerciseKey] = useState(0);
  const [exerciseType, setExerciseType] = useState<"breathing" | "54321" | "taichi" | "meditation">("breathing");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setIsExerciseStarted(false);
      setExerciseKey(0); // Reset exercise key for fresh start
      
      // Determine exercise type
      if (exerciseId === "grounding-54321") {
        setExerciseType("54321");
      } else if (exerciseId === "yoga-stretch") {
        setExerciseType("taichi");
      } else if (exerciseId === "meditation") {
        setExerciseType("meditation");
      } else {
        setExerciseType("breathing");
        // Map exercise IDs to breathing exercise types
        const getBreathingExerciseType = (id: string): BreathingExerciseType => {
          switch (id) {
            case "box-breathing":
              return "box";
            case "breathing":
              return "box";
            case "555-breathing":
              return "555";
            default:
              return "box";
          }
        };
        setSelectedTechnique(getBreathingExerciseType(exerciseId));
      }
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
    setExerciseKey(prev => prev + 1); // Force remount of exercise component
    setIsExerciseStarted(true);
  };

  const handleComplete = () => {
    setIsExerciseStarted(false);
    onOpenChange(false);
  };

  const currentTechnique = BREATHING_TECHNIQUES.find(t => t.id === selectedTechnique);

  // If it's 54321 exercise, show it directly without selection screen
  if (exerciseType === "54321") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md h-[85vh] max-h-[700px] p-0 overflow-hidden border-0 rounded-lg sm:rounded-lg" showCloseButton={false}>
          <div className="h-full overflow-hidden">
            <Grounding54321Exercise
              key={exerciseKey}
              onComplete={handleComplete}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If it's taichi exercise, show it directly without selection screen
  if (exerciseType === "taichi") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md h-[85vh] max-h-[700px] p-0 overflow-hidden border-0 rounded-lg sm:rounded-lg" showCloseButton={false}>
          <div className="h-full overflow-hidden">
            <WatermelonTaichiExercise
              key={exerciseKey}
              onComplete={handleComplete}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If it's meditation exercise, show it directly without selection screen
  if (exerciseType === "meditation") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md h-[85vh] max-h-[700px] p-0 overflow-hidden border-0 rounded-lg sm:rounded-lg" showCloseButton={false}>
          <div className="h-full overflow-hidden">
            <MindfulMeditationExercise
              key={exerciseKey}
              onComplete={handleComplete}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[85vh] max-h-[700px] p-0 overflow-hidden border-0 rounded-lg sm:rounded-lg" showCloseButton={false}>
        {!isExerciseStarted ? (
          // Selection Screen
          <div className="relative h-full flex flex-col">
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
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-8">
              {/* Title */}
              <h2 className="text-3xl font-normal mb-2 text-white">
                1 min Breathing
              </h2>
              <p className="text-base mb-8 text-center text-white/90">
                Just 60 seconds to calm your thoughts and stay grounded.
              </p>

              {/* Duck and Cloud Illustration */}
              <div className="relative w-[280px] h-[280px] mb-4 flex items-center justify-center">
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
              <div className="flex items-center justify-center gap-4 mb-8">
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Previous technique"
                >
                  <ChevronLeft className="w-6 h-6" style={{ color: "#46728C" }} />
                </button>
                <div className="text-center min-w-[200px]">
                  <p className="text-2xl font-semibold mb-2" style={{ color: "#46728C" }}>
                    {currentTechnique?.displayName}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-white/30 hover:bg-white/30"
                    style={{ 
                      backgroundColor: "rgba(70, 114, 140, 0.2)",
                      borderColor: "#46728C",
                      color: "#46728C"
                    }}
                  >
                    3 Sets
                  </Button>
                </div>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Next technique"
                >
                  <ChevronRight className="w-6 h-6" style={{ color: "#46728C" }} />
                </button>
              </div>

              {/* Begin Button */}
              <Button
                onClick={handleBegin}
                size="lg"
                className="w-full max-w-[320px] rounded-full text-lg font-semibold py-6 bg-black hover:bg-gray-900 text-white shadow-lg cursor-pointer"
              >
                Begin
              </Button>
            </div>
          </div>
        ) : (
          // Exercise Screen
          <div className="h-full overflow-hidden">
            <BreathingExercise
              key={`${selectedTechnique}-${exerciseKey}`}
              exerciseType={selectedTechnique}
              onComplete={handleComplete}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
