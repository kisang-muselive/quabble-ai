"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Grounding54321ExerciseProps {
  onComplete?: () => void;
}

type SenseType = "see" | "touch" | "hear" | "smell" | "taste";

interface SenseConfig {
  type: SenseType;
  count: number;
  label: string;
  instruction: string;
  icon: string;
  color: string;
  example: string;
}

const SENSES: SenseConfig[] = [
  {
    type: "see",
    count: 5,
    label: "5 things you can see",
    instruction: "look around and find five objects you see",
    icon: "/workouts/54321/fivefourthreetwoone_action_eye.svg",
    color: "#9BAC7F", // see color
    example: "Poster on the wall",
  },
  {
    type: "touch",
    count: 4,
    label: "4 things you can touch",
    instruction: "feel four different textures around you",
    icon: "/workouts/54321/fivefourthreetwoone_action_hand.svg",
    color: "#D1B079", // touch color
    example: "The warm mug in your hands",
  },
  {
    type: "hear",
    count: 3,
    label: "3 things you can hear",
    instruction: "listen carefully for three sounds",
    icon: "/workouts/54321/fivefourthreetwoone_action_ear.svg",
    color: "#A3B982", // hear color
    example: "Ticking of a clock",
  },
  {
    type: "smell",
    count: 2,
    label: "2 things you can smell",
    instruction: "notice two different scents",
    icon: "/workouts/54321/fivefourthreetwoone_action_nose.svg",
    color: "#A695B2", // smell color
    example: "Fresh air from outside",
  },
  {
    type: "taste",
    count: 1,
    label: "1 thing you can taste",
    instruction: "identify one taste in your mouth",
    icon: "/workouts/54321/fivefourthreetwoone_action_mouth.svg",
    color: "#CE9392", // taste color
    example: "the fruit on my plate",
  },
];

export function Grounding54321Exercise({
  onComplete
}: Grounding54321ExerciseProps) {
  const [currentSenseIndex, setCurrentSenseIndex] = useState(0);
  const [completedCounts, setCompletedCounts] = useState<number[]>([0, 0, 0, 0, 0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  const [isWriteMode, setIsWriteMode] = useState(false);
  const [textInputs, setTextInputs] = useState<string[][]>([[], [], [], [], []]);

  const currentSense = SENSES[currentSenseIndex];
  // Progress for current sense only - each sense completes a full circle
  // In write mode, count filled text inputs; otherwise use button clicks
  const getCurrentProgress = () => {
    if (isWriteMode) {
      const filledInputs = textInputs[currentSenseIndex].filter(text => text.trim().length > 0).length;
      return currentSense.count > 0 ? filledInputs / currentSense.count : 0;
    }
    return currentSense.count > 0 ? completedCounts[currentSenseIndex] / currentSense.count : 0;
  };
  const progress = getCurrentProgress();

  useEffect(() => {
    // Check if all senses are completed
    const allCompleted = SENSES.every((sense, index) => 
      completedCounts[index] >= sense.count
    );
    if (allCompleted && !isCompleted) {
      setIsCompleted(true);
    }
  }, [completedCounts, isCompleted]);

  const handleNumberClick = useCallback((number: number) => {
    setCompletedCounts((prevCounts) => {
      if (prevCounts[currentSenseIndex] < currentSense.count) {
        const newCounts = [...prevCounts];
        newCounts[currentSenseIndex] = Math.min(
          newCounts[currentSenseIndex] + 1,
          currentSense.count
        );
        return newCounts;
      }
      return prevCounts;
    });
  }, [currentSenseIndex, currentSense.count]);

  const handleNext = useCallback(() => {
    if (currentSenseIndex < SENSES.length - 1) {
      setCurrentSenseIndex(currentSenseIndex + 1);
      // Keep write mode active - don't reset it
    }
  }, [currentSenseIndex]);

  const handleTextInputChange = (index: number, value: string) => {
    const newInputs = [...textInputs];
    if (!newInputs[currentSenseIndex]) {
      newInputs[currentSenseIndex] = [];
    }
    newInputs[currentSenseIndex] = [...newInputs[currentSenseIndex]];
    newInputs[currentSenseIndex][index] = value;
    setTextInputs(newInputs);

    // Update completed count based on filled inputs
    const filledCount = newInputs[currentSenseIndex].filter(text => text.trim().length > 0).length;
    setCompletedCounts(prev => {
      const newCounts = [...prev];
      newCounts[currentSenseIndex] = Math.min(filledCount, currentSense.count);
      return newCounts;
    });
  };

  const handleRestart = () => {
    setCurrentSenseIndex(0);
    setCompletedCounts([0, 0, 0, 0, 0]);
    setIsCompleted(false);
    setShowInitialScreen(true);
  };

  // Handle Enter key for initial screen
  useEffect(() => {
    if (!showInitialScreen) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setShowInitialScreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showInitialScreen]);

  // Handle Enter key for exercise screen
  useEffect(() => {
    if (showInitialScreen || isCompleted) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't handle Enter if user is typing in an input field
      if ((e.target as HTMLElement)?.tagName === "INPUT") {
        return;
      }
      
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        // If current sense is complete, go to next sense
        if (completedCounts[currentSenseIndex] >= currentSense.count) {
          if (currentSenseIndex < SENSES.length - 1) {
            handleNext();
          }
        } else {
          // Otherwise, click the next number button (only in button mode)
          if (!isWriteMode) {
            const nextNumber = completedCounts[currentSenseIndex] + 1;
            if (nextNumber <= currentSense.count) {
              handleNumberClick(nextNumber);
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showInitialScreen, isCompleted, currentSenseIndex, completedCounts, currentSense.count, handleNext, handleNumberClick, isWriteMode]);

  // Handle Enter key for completion screen
  useEffect(() => {
    if (!isCompleted) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onComplete?.();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isCompleted, onComplete]);

  if (showInitialScreen) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[#FAF9F3] relative">
        {/* Close button */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Close exercise"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 pb-24">
          {/* Title */}
          <h2 className="text-4xl font-normal mb-4 text-gray-900">
            54321
          </h2>
          
          {/* Description */}
          <p className="text-base mb-8 text-center text-gray-700 max-w-xs">
            Lets practice this simple but effective grounding method regularly to manage stress and anxiety better.
          </p>

          {/* Main Illustration */}
          <div className="relative w-[280px] h-[280px] mt-8 mb-12 flex items-center justify-center">
            <Image
              src="/workouts/54321/fivefourthreetwoone_main.svg"
              alt="54321 Grounding"
              width={280}
              height={280}
              className="object-contain"
            />
          </div>
        </div>

        {/* Begin Button - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex justify-center">
          <Button
            onClick={() => setShowInitialScreen(false)}
            size="lg"
            className="w-full max-w-[320px] rounded-full text-lg font-semibold py-6 bg-black hover:bg-gray-900 text-white shadow-lg cursor-pointer"
          >
            Begin
          </Button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[#FAF9F3] relative">
        {/* Close button */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Close exercise"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 pb-24">
          {/* Title */}
          <h2 className="text-4xl font-normal mb-4 text-gray-900">
            Well done!
          </h2>
          
          {/* Description */}
          <p className="text-base mb-8 text-center text-gray-700 max-w-xs">
            Every practice strengthens your ability to <span className="text-orange-600 font-semibold">stay centered</span> in challenging situations.
          </p>

          {/* Sleep Duck Illustration */}
          <div className="relative w-[280px] h-[280px] mt-8 mb-12 flex items-center justify-center">
            <Image
              src="/workouts/54321/sleep_duck.svg"
              alt="Well done"
              width={280}
              height={280}
              className="object-contain"
            />
          </div>
        </div>

        {/* Finish Button - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex justify-center">
          <Button
            onClick={onComplete}
            size="lg"
            className="w-full max-w-[320px] rounded-full text-lg font-semibold py-6 bg-gray-800 hover:bg-gray-900 text-white shadow-lg cursor-pointer"
          >
            Finish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#FAF9F3] relative">
      {/* Close button */}
      <button
        onClick={onComplete}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
        aria-label="Close exercise"
      >
        <X className="w-6 h-6 text-gray-800" />
      </button>

      <div className={`flex flex-col items-center ${isWriteMode ? "justify-start" : "justify-center"} flex-1 px-6 ${isWriteMode ? "pt-12 pb-24" : "pt-12 pb-24"} w-full`}>
        {/* Circular Progress Bar */}
        <div className={`relative mb-6 flex items-center justify-center ${isWriteMode ? "w-[200px] h-[200px]" : "w-[350px] h-[350px]"}`}>
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#E0E0E0"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={currentSense.color}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          
          {/* Center content */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center ${isWriteMode ? "px-4 py-4" : "px-8 py-8"}`}>
            <div className={isWriteMode ? "mb-2" : "mb-4"}>
              <Image
                src={currentSense.icon}
                alt={currentSense.type}
                width={isWriteMode ? 50 : 80}
                height={isWriteMode ? 50 : 80}
                className="object-contain"
                style={{ 
                  filter: "brightness(0) saturate(100%) invert(48%) sepia(6%) saturate(800%) hue-rotate(5deg) brightness(96%) contrast(92%)"
                }}
              />
            </div>
            <h3 className={`font-normal text-gray-900 text-center ${isWriteMode ? "text-lg px-2" : "text-2xl mb-2 px-6"}`}>
              {currentSense.label}
            </h3>
            {!isWriteMode && (
              <p className="text-base text-orange-600 text-center px-6">
                {currentSense.instruction}
              </p>
            )}
          </div>
        </div>

        {!isWriteMode ? (
          <>
            {/* Example text */}
            <p className="text-sm text-gray-500 mb-4 text-center">
              ex) {currentSense.example}
            </p>
            
            {/* Number buttons */}
            <div className="flex gap-2 mb-6">
              {Array.from({ length: currentSense.count }, (_, i) => i + 1).map((num) => {
                const isCompleted = num <= completedCounts[currentSenseIndex];
                return (
                  <button
                    key={num}
                    onClick={() => handleNumberClick(num)}
                    className={`w-12 h-16 rounded-full font-semibold transition-all cursor-pointer ${
                      isCompleted
                        ? "text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                    style={isCompleted ? { backgroundColor: "#E4914C" } : { backgroundColor: "#E5E4D7" }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Instruction text */}
            <p className="text-sm text-gray-500 mb-2 text-center">
              Tap the button for each object<span className="hidden md:inline"> <span className="text-orange-600 font-semibold">(or Press Enter)</span></span>
            </p>
            <p 
              className={`text-sm text-orange-600 underline mb-4 text-center cursor-pointer ${currentSenseIndex === 0 ? "" : "invisible"}`}
              onClick={() => setIsWriteMode(true)}
            >
              or write your answers
            </p>
          </>
        ) : (
          <>
            {/* Text input fields */}
            <div className="w-full max-w-md space-y-3 mb-6">
              {Array.from({ length: currentSense.count }, (_, i) => i).map((index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E5E4D7] text-gray-600 font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={textInputs[currentSenseIndex]?.[index] || ""}
                    onChange={(e) => handleTextInputChange(index, e.target.value)}
                    placeholder={index === 0 ? `ex) ${currentSense.example}` : ""}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-[#FAF9F3] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Next button - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex justify-center">
        <Button
          onClick={handleNext}
          size="lg"
          disabled={completedCounts[currentSenseIndex] < currentSense.count}
          className={`w-full max-w-[320px] rounded-full text-lg font-semibold py-6 shadow-lg ${
            completedCounts[currentSenseIndex] >= currentSense.count
              ? "bg-gray-700 hover:bg-gray-800 text-white cursor-pointer"
              : "bg-[#BBB8A6] text-white cursor-not-allowed opacity-60"
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

