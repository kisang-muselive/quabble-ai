"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BreathingExercise } from "./breathing-exercise";

interface WellnessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseType?: "breathing" | "meditation";
  duration?: number;
}

export function WellnessModal({
  open,
  onOpenChange,
  exerciseType = "breathing",
  duration = 1,
}: WellnessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mental Wellness Exercise</DialogTitle>
          <DialogDescription>
            Take a moment to focus on your well-being
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {exerciseType === "breathing" && <BreathingExercise duration={duration} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
