"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface BreathingExerciseProps {
  duration?: number; // in minutes
}

export function BreathingExercise({ duration = 1 }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [seconds, setSeconds] = useState(0);
  const [cycles, setCycles] = useState(0);

  const totalSeconds = duration * 60;
  const breathCycle = {
    inhale: 4,
    hold: 7,
    exhale: 8,
  };

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev >= totalSeconds) {
          setIsActive(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, totalSeconds]);

  useEffect(() => {
    if (!isActive) return;

    const phaseTimer = setInterval(() => {
      setPhase((currentPhase) => {
        if (currentPhase === "inhale") return "hold";
        if (currentPhase === "hold") return "exhale";
        setCycles((prev) => prev + 1);
        return "inhale";
      });
    }, phase === "inhale" ? breathCycle.inhale * 1000 : phase === "hold" ? breathCycle.hold * 1000 : breathCycle.exhale * 1000);

    return () => clearInterval(phaseTimer);
  }, [isActive, phase]);

  const handleStart = () => {
    setIsActive(true);
    setSeconds(0);
    setCycles(0);
    setPhase("inhale");
  };

  const handleStop = () => {
    setIsActive(false);
    setSeconds(0);
    setCycles(0);
    setPhase("inhale");
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "hsl(var(--primary))";
      case "hold":
        return "hsl(var(--muted))";
      case "exhale":
        return "hsl(var(--accent))";
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case "inhale":
        return 1.5;
      case "hold":
        return 1.5;
      case "exhale":
        return 0.8;
    }
  };

  const getAnimationDuration = () => {
    switch (phase) {
      case "inhale":
        return breathCycle.inhale;
      case "hold":
        return breathCycle.hold;
      case "exhale":
        return breathCycle.exhale;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8">
      {/* Breathing Animation Circle */}
      <div className="relative flex items-center justify-center w-64 h-64">
        <motion.div
          className="absolute rounded-full"
          style={{
            backgroundColor: getPhaseColor(),
            width: "120px",
            height: "120px",
          }}
          animate={{
            scale: isActive ? getCircleScale() : 1,
          }}
          transition={{
            duration: isActive ? getAnimationDuration() : 0.3,
            ease: "easeInOut",
          }}
        />
        <div className="relative z-10 text-center">
          <p className="text-2xl font-semibold text-foreground">
            {isActive ? getPhaseInstruction() : "Ready"}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center space-y-2">
        {!isActive ? (
          <>
            <h3 className="text-lg font-semibold">4-7-8 Breathing Technique</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds.
              This technique helps reduce anxiety and promotes relaxation.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-medium">
              Time: {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
            </p>
            <p className="text-sm text-muted-foreground">
              Cycles completed: {cycles}
            </p>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isActive ? (
          <Button onClick={handleStart} size="lg">
            Start Exercise
          </Button>
        ) : (
          <Button onClick={handleStop} variant="destructive" size="lg">
            Stop
          </Button>
        )}
      </div>

      {/* Progress */}
      {isActive && (
        <div className="w-full max-w-md">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(seconds / totalSeconds) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
