"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface RoutineCheckinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBreathingExerciseClick: () => void;
}

const feelings = [
  { emoji: "😊", label: "Happy", color: "oklch(0.80 0.14 70)" },
  { emoji: "😌", label: "Calm", color: "oklch(0.72 0.10 200)" },
  { emoji: "😔", label: "Sad", color: "oklch(0.68 0.14 240)" },
  { emoji: "😰", label: "Anxious", color: "oklch(0.65 0.15 30)" },
  { emoji: "😤", label: "Frustrated", color: "oklch(0.68 0.17 15)" },
  { emoji: "😴", label: "Tired", color: "oklch(0.60 0.06 240)" },
  { emoji: "😃", label: "Excited", color: "oklch(0.75 0.18 80)" },
  { emoji: "😢", label: "Overwhelmed", color: "oklch(0.62 0.12 250)" },
];

export function RoutineCheckinModal({
  open,
  onOpenChange,
  onBreathingExerciseClick,
}: RoutineCheckinModalProps) {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const handleBreathingClick = () => {
    onOpenChange(false); // Close the routine check-in modal
    onBreathingExerciseClick(); // Open the breathing exercise
    // Reset state
    setSelectedFeeling(null);
    setDescription("");
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when modal closes
      setSelectedFeeling(null);
      setDescription("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Routine Check-in</DialogTitle>
          <DialogDescription>
            Take a moment to reflect on your day
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Question */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-lg font-medium text-foreground mb-4">
              How was your day?
            </p>
            
            {/* Feeling Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {feelings.map((feeling, index) => (
                <motion.button
                  key={feeling.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => setSelectedFeeling(feeling.label)}
                  className={`relative flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedFeeling === feeling.label
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
                  }`}
                >
                  <span className="text-3xl">{feeling.emoji}</span>
                  <span className="text-xs font-medium text-foreground">
                    {feeling.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tell us more (optional)
              </label>
              <Input
                placeholder="What made your day this way?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
              />
            </div>
          </motion.div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Take a moment
              </span>
            </div>
          </div>

          {/* Breathing Exercise Card */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleBreathingClick}
            className="group relative w-full rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden p-6"
          >
            {/* Background gradient overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{ backgroundColor: "oklch(0.68 0.14 50)" }}
            />

            {/* Content */}
            <div className="relative flex items-center gap-4">
              {/* Duck Logo */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/quabble-duck.png"
                  alt="Quabble Duck"
                  fill
                  className="object-contain rounded-lg group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>

              {/* Title */}
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                  Breathing Exercise
                </h4>
              </div>

              {/* Arrow indicator */}
              <div className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>

            {/* Color accent bar at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
              style={{ backgroundColor: "oklch(0.68 0.14 50)" }}
            />
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

