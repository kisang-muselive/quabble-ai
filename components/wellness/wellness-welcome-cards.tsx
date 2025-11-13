"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export interface WelcomeExercise {
  id: string;
  title: string;
  description: string;
  color: string;
}

interface WellnessWelcomeCardsProps {
  onExerciseClick: (exerciseId: string) => void;
}

// Map exercise IDs to card image filenames
const getCardImage = (exerciseId: string): string | null => {
  const imageMap: Record<string, string> = {
    "breathing": "/cards/workout_1-minute-breathing-Bb1sU9WV.avif",
    "gratitude": "/cards/workout_gratitude-jar-Dq9qFQnx.avif",
    "meditation": "/cards/workout_mindful-meditation-CIeadvMj.avif",
    "mood-tracker": "/cards/workout_mood-diary-QXMpAtVS.avif",
    "grounding-54321": "/cards/workout_54321-DErEv4vm.avif",
    "walking-meditation": "/cards/workout_outdoor-walk-CpUdl6dh.avif",
    "visualization": "/cards/workout_safe-place-CiTGwIKO.avif",
    "mindful-eating": "/cards/workout_mindful-eating-myRmkkU5.png",
    "worry-time": "/cards/workout_worry-box-BZAt6_Fl.avif",
    "yoga-stretch": "/cards/workout_watermelon-taichi-OdwK31rb.avif",
    "self-compassion": "/cards/workout_dear-self-mhNbGeJC.avif",
    "future-self": "/cards/workout_smart-goals-CsKNCryL.png",
    "box-breathing": "/cards/workout_1-minute-breathing-Bb1sU9WV.avif",
    "555-breathing": "/cards/workout_1-minute-breathing-Bb1sU9WV.avif",
  };
  return imageMap[exerciseId] || null;
};

export function WellnessWelcomeCards({ onExerciseClick }: WellnessWelcomeCardsProps) {
  const exercises: WelcomeExercise[] = [
    {
      id: "breathing",
      title: "1 Minute Breathing",
      description: "Calm your mind with guided breathing",
      color: "oklch(0.68 0.14 50)", // Warm orange
    },
    {
      id: "gratitude",
      title: "Gratitude Journal",
      description: "Reflect on what you're grateful for",
      color: "oklch(0.88 0.06 60)", // Soft peach
    },
    {
      id: "meditation",
      title: "Mindful Meditation",
      description: "Find peace in the present moment",
      color: "oklch(0.52 0.08 145)", // Sage green
    },
    {
      id: "mood-tracker",
      title: "Mood Diary",
      description: "Track how you're feeling today",
      color: "oklch(0.70 0.15 150)", // Teal
    },
    {
      id: "grounding-54321",
      title: "5-4-3-2-1 Grounding",
      description: "Ground yourself in the present",
      color: "oklch(0.65 0.11 40)", // Amber
    },
    {
      id: "walking-meditation",
      title: "Walking Meditation",
      description: "Find mindfulness in movement",
      color: "oklch(0.75 0.09 160)", // Mint
    },
    {
      id: "visualization",
      title: "Safe Place",
      description: "Imagine your peaceful safe place",
      color: "oklch(0.70 0.15 260)", // Lavender
    },
    {
      id: "mindful-eating",
      title: "Mindful Eating",
      description: "Savor your food with awareness",
      color: "oklch(0.70 0.12 90)", // Chartreuse
    },
    {
      id: "worry-time",
      title: "Worry Box",
      description: "Contain worries to a specific time",
      color: "oklch(0.62 0.12 250)", // Deep purple
    },
    {
      id: "yoga-stretch",
      title: "Watermelon Taichi",
      description: "Stretch and strengthen mindfully",
      color: "oklch(0.78 0.08 100)", // Light lime
    },
    {
      id: "self-compassion",
      title: "Dear Self",
      description: "Practice kindness toward yourself",
      color: "oklch(0.80 0.08 350)", // Blush pink
    },
    {
      id: "future-self",
      title: "Smart Goals",
      description: "Connect with your future goals",
      color: "oklch(0.70 0.13 220)", // Sky blue
    },
    {
      id: "box-breathing",
      title: "Box Breathing",
      description: "Balance your nervous system",
      color: "oklch(0.68 0.10 180)", // Cyan
    },
    {
      id: "555-breathing",
      title: "5-5-5 Breathing",
      description: "Equal breath intervals for balance",
      color: "oklch(0.70 0.12 190)", // Soft teal
    },
  ];

  return (
    <div className="w-full pb-8">
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold text-center mb-6 text-foreground"
      >
        Choose a workout to boost your mental health
      </motion.h3>

      <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(140px,180px))] gap-2 w-full px-2 justify-center">
        {exercises.map((exercise, index) => (
          <motion.button
            key={exercise.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => onExerciseClick(exercise.id)}
            className="group relative w-full flex flex-col rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Card Image */}
            {getCardImage(exercise.id) ? (
              <div className="relative w-full aspect-[1024/788] overflow-hidden bg-card">
                <img
                  src={getCardImage(exercise.id)!}
                  alt={exercise.title}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div 
                className="relative w-full aspect-[1024/788]"
                style={{ backgroundColor: exercise.color + "20" }}
              />
            )}

            {/* Content below image */}
            <div className="flex flex-col items-center justify-center p-3 text-center gap-1.5">
              {/* Title */}
              <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors break-words w-full">
                {exercise.title}
              </h4>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-snug break-words w-full">
                {exercise.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-muted-foreground text-center mt-6"
      >
        Click any card to start your wellness practice
      </motion.p>
    </div>
  );
}
