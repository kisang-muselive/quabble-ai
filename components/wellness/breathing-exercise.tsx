"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

interface BreathingExerciseProps {
  duration?: number; // in minutes
}

export function BreathingExercise({ duration = 1 }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [cycles, setCycles] = useState(0);

  const totalSeconds = duration * 60;
  const breathCycle = {
    inhale: 4,
    hold: 7,
    exhale: 8,
  };

  // Update phase progress for smooth animation
  useEffect(() => {
    if (!isActive) {
      setPhaseProgress(0);
      return;
    }

    const phaseDuration = breathCycle[phase];
    const interval = 50; // Update every 50ms for smooth progress
    let elapsed = 0;

    const progressTimer = setInterval(() => {
      elapsed += interval;
      const progress = Math.min((elapsed / (phaseDuration * 1000)) * 100, 100);
      setPhaseProgress(progress);
    }, interval);

    return () => clearInterval(progressTimer);
  }, [isActive, phase]);

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

    const phaseDuration = breathCycle[phase];
    const phaseTimer = setTimeout(() => {
      setPhase((currentPhase) => {
        if (currentPhase === "inhale") return "hold";
        if (currentPhase === "hold") return "exhale";
        setCycles((prev) => prev + 1);
        return "inhale";
      });
      setPhaseProgress(0);
    }, phaseDuration * 1000);

    return () => clearTimeout(phaseTimer);
  }, [isActive, phase]);

  const handleStart = () => {
    setIsActive(true);
    setSeconds(0);
    setCycles(0);
    setPhase("inhale");
    setPhaseProgress(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setSeconds(0);
    setCycles(0);
    setPhase("inhale");
    setPhaseProgress(0);
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

  const getPhaseDescription = () => {
    switch (phase) {
      case "inhale":
        return `${breathCycle.inhale} seconds`;
      case "hold":
        return `${breathCycle.hold} seconds`;
      case "exhale":
        return `${breathCycle.exhale} seconds`;
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "oklch(0.68 0.14 50)"; // Warm orange
      case "hold":
        return "oklch(0.88 0.06 60)"; // Soft peach
      case "exhale":
        return "oklch(0.52 0.08 145)"; // Sage green
    }
  };

  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (phaseProgress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-6 px-4">
      {/* Circular Progress with Duck */}
      <div className="relative flex items-center justify-center">
        {/* Background circle */}
        <svg className="transform -rotate-90" width="320" height="320">
          <circle
            cx="160"
            cy="160"
            r={radius}
            stroke="oklch(0.88 0.015 70)"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="160"
            cy="160"
            r={radius}
            stroke={getPhaseColor()}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </svg>

        {/* Duck image in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: isActive
                ? phase === "inhale"
                  ? 1.15
                  : phase === "hold"
                  ? 1.15
                  : 0.95
                : 1,
            }}
            transition={{
              duration: isActive ? breathCycle[phase] : 0.3,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/quabble-duck.png"
              alt="Quabble Duck"
              width={160}
              height={160}
              className="rounded-full"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* Phase Instruction */}
      <div className="text-center space-y-1">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold"
          style={{ color: getPhaseColor() }}
        >
          {isActive ? getPhaseInstruction() : "Ready to Begin"}
        </motion.p>
        {isActive && (
          <p className="text-lg text-muted-foreground">
            {getPhaseDescription()}
          </p>
        )}
      </div>

      {/* Instructions or Stats */}
      <div className="text-center space-y-2 max-w-md">
        {!isActive ? (
          <>
            <h3 className="text-xl font-semibold text-foreground">
              4-7-8 Breathing Technique
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A calming breathing exercise to help reduce anxiety and promote relaxation.
              Follow the circle as it guides you through each phase.
            </p>
          </>
        ) : (
          <div className="flex justify-center gap-8 text-sm">
            <div>
              <p className="text-muted-foreground">Time</p>
              <p className="text-xl font-semibold">
                {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Cycles</p>
              <p className="text-xl font-semibold">{cycles}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Progress</p>
              <p className="text-xl font-semibold">
                {Math.round((seconds / totalSeconds) * 100)}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isActive ? (
          <Button
            onClick={handleStart}
            size="lg"
            className="min-w-[200px] bg-primary hover:bg-primary/90"
          >
            Start Exercise
          </Button>
        ) : (
          <Button
            onClick={handleStop}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            Stop
          </Button>
        )}
      </div>
    </div>
  );
}
