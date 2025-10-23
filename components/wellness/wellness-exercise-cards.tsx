"use client";

import { motion } from "framer-motion";
import { Heart, Wind, BookHeart, Brain, Smile, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface WellnessExercise {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  duration: string;
}

interface WellnessExerciseCardsProps {
  onExerciseClick: (exerciseId: string) => void;
}

export function WellnessExerciseCards({ onExerciseClick }: WellnessExerciseCardsProps) {
  const exercises: WellnessExercise[] = [
    {
      id: "breathing",
      title: "Breathing Exercise",
      description: "Calm your mind with guided breathing",
      icon: <Wind className="w-5 h-5" />,
      color: "oklch(0.68 0.14 50)", // Warm orange
      duration: "1 min",
    },
    {
      id: "gratitude",
      title: "Gratitude Journal",
      description: "Reflect on what you're grateful for",
      icon: <BookHeart className="w-5 h-5" />,
      color: "oklch(0.88 0.06 60)", // Soft peach
      duration: "3 min",
    },
    {
      id: "meditation",
      title: "Mindful Meditation",
      description: "Find peace in the present moment",
      icon: <Brain className="w-5 h-5" />,
      color: "oklch(0.52 0.08 145)", // Sage green
      duration: "5 min",
    },
    {
      id: "body-scan",
      title: "Body Scan",
      description: "Release tension throughout your body",
      icon: <Heart className="w-5 h-5" />,
      color: "oklch(0.75 0.12 280)", // Soft purple
      duration: "4 min",
    },
    {
      id: "mood-tracker",
      title: "Mood Check-In",
      description: "Track how you're feeling today",
      icon: <Smile className="w-5 h-5" />,
      color: "oklch(0.70 0.15 150)", // Teal
      duration: "2 min",
    },
    {
      id: "affirmations",
      title: "Daily Affirmations",
      description: "Boost confidence with positive words",
      icon: <Sparkles className="w-5 h-5" />,
      color: "oklch(0.65 0.18 30)", // Golden
      duration: "2 min",
    },
  ];

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2 px-1">
        <div className="h-8 w-1 rounded-full bg-primary" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Mental Wellness Gym
          </h3>
          <p className="text-xs text-muted-foreground">
            Choose an exercise to practice
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {exercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant="outline"
              onClick={() => onExerciseClick(exercise.id)}
              className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:border-primary/50 hover:bg-accent/50 transition-colors group"
            >
              <div className="flex items-center gap-3 w-full">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
                  style={{
                    backgroundColor: exercise.color + "20",
                    color: exercise.color,
                  }}
                >
                  {exercise.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {exercise.title}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {exercise.description}
                  </div>
                </div>
                <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  {exercise.duration}
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center pt-2">
        Regular practice helps build mental resilience 💪
      </p>
    </div>
  );
}
