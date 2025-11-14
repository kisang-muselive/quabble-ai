"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export interface WelcomeExercise {
  id: string;
  title: string;
  description: string;
  hasPlayButton?: boolean;
  isAppOnly?: boolean;
}

interface WellnessWelcomeCardsProps {
  onExerciseClick: (exerciseId: string) => void;
}

// Map exercise IDs to icon filenames
const getIconPath = (exerciseId: string): string | null => {
  const iconMap: Record<string, string> = {
    "breathing": "/icons/workout-icon_1-minute-breathing.png",
    "grounding-54321": "/icons/workout-icon_54321.png",
    "yoga-stretch": "/icons/workout-icon_watermelon-tai-chi.png",
    "bamboo-forest": "/icons/workout-icon_bamboo-forest.png",
    "self-compassion": "/icons/workout-icon_dear-self.png",
    "mood-tracker": "/icons/workout-icon_mood-diary.png",
    "gratitude": "/icons/workout-icon_gratitude-jar.png",
    "meditation": "/icons/workout-icon_meditation.png",
    "proud-dandelion": "/icons/workout-icon_proud-dandelion.png",
    "mindful-eating": "/icons/workout-icon_mindful-eating.png",
    "moonlight": "/icons/workout-icon_moonlight.png",
    "thank-you": "/icons/workout-icon_thank-you.png",
    "visualization": "/icons/workout-icon_safe-place.png",
    "pleasant-activities": "/icons/workout-icon_pleasant-activities.png",
    "walking-meditation": "/icons/workout-icon_outdoor-walk.png",
    "future-self": "/icons/workout-icon_smart-goals.png",
    "worry-time": "/icons/workout-icon_worry-box.png",
    "treasure-box": "/icons/workout-icon_treasure-box.png",
  };
  return iconMap[exerciseId] || null;
};

export function WellnessWelcomeCards({ onExerciseClick }: WellnessWelcomeCardsProps) {
  const exercises: WelcomeExercise[] = [
    {
      id: "breathing",
      title: "1 min Breathing",
      description: "One-minute fun breathing exercise to relax",
      hasPlayButton: true,
    },
    {
      id: "grounding-54321",
      title: "54321",
      description: "Practice this simple and effective grounding method regularly to manage stress and anxiety better",
      hasPlayButton: true,
    },
    {
      id: "yoga-stretch",
      title: "Watermelon Tai-Chi",
      description: "Fun Tai-chi movements to follow for mind and body balance",
      hasPlayButton: true,
    },
    {
      id: "bamboo-forest",
      title: "Bamboo Forest",
      description: "Safe place for anonymous sharing and connecting with others",
      isAppOnly: true,
    },
    {
      id: "self-compassion",
      title: "Dear Self",
      description: "Write a kind letter to your past, present or future self and practice self-compassion with others",
      isAppOnly: true,
    },
    {
      id: "mood-tracker",
      title: "Mood Diary",
      description: "Simple, effective mood tracking to recognize patterns and triggers",
      isAppOnly: true,
    },
    {
      id: "gratitude",
      title: "Gratitude Jar",
      description: "Daily gratitude diary to appreciate little things in life",
      isAppOnly: true,
    },
    {
      id: "meditation",
      title: "Meditation",
      description: "Three-minute guided meditation to relax and focus",
      isAppOnly: true,
    },
    {
      id: "proud-dandelion",
      title: "Proud Dandelion",
      description: "Write down one thing about yourself you're proud of",
      isAppOnly: true,
    },
    {
      id: "mindful-eating",
      title: "Mindful Eating",
      description: "Build a healthier, more positive connection with food that benefits both your body and mind",
      isAppOnly: true,
    },
    {
      id: "moonlight",
      title: "Moonlight",
      description: "Build your nightly routine and enjoy better sleep",
      isAppOnly: true,
    },
    {
      id: "thank-you",
      title: "Thank You",
      description: "Send a thank you note to someone special and spread joy",
      isAppOnly: true,
    },
    {
      id: "visualization",
      title: "Safe Place",
      description: "Follow the writing guide and create a safe place for your mental sanctuary.",
      isAppOnly: true,
    },
    {
      id: "pleasant-activities",
      title: "Pleasant Activities",
      description: "Planning and engaging in activities that bring you joy",
      isAppOnly: true,
    },
    {
      id: "walking-meditation",
      title: "Outdoor Walk",
      description: "Go for a walk and record it for physical and mental well-being",
      isAppOnly: true,
    },
    {
      id: "future-self",
      title: "SMART Goals",
      description: "Turn your dreams into achievable, focused steps and follow up with daily habits",
      isAppOnly: true,
    },
    {
      id: "worry-time",
      title: "Worry Box",
      description: "Stress reducing tool for managing worries wisely",
      isAppOnly: true,
    },
    {
      id: "treasure-box",
      title: "Treasure Box",
      description: "Capture joyful moments in life and revisit them when you need a smile",
      isAppOnly: true,
    },
  ];

  return (
    <div className="w-full pb-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mb-12 px-4"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left side - Text content */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-normal text-foreground">
              Mind Workouts
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Quabble's Mind Workout is a daily mental health exercise you can complete in just a few minutes. It fills the gaps between therapy sessions and is designed, based on scientific evidence, to ease stress, anxiety, and low mood. Simply put, it's a short daily workout for your mind.
            </p>
          </div>

          {/* Right side - Hero image */}
          <div className="flex items-center justify-center">
            <Image
              src="/hero-image.png"
              alt="Mind Workouts illustration"
              width={600}
              height={400}
              className="object-contain w-full h-auto"
              priority
            />
          </div>
        </div>
      </motion.section>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold text-center mb-6 text-foreground"
      >
        Choose a workout to boost your mental health
      </motion.h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full px-4 max-w-4xl mx-auto">
        {exercises.map((exercise, index) => (
          <motion.button
            key={exercise.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onExerciseClick(exercise.id)}
            className="group relative w-full flex flex-col rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden p-4"
          >
            {/* Badge in top right corner */}
            <div className="absolute top-3 right-3 z-10">
              {exercise.hasPlayButton && (
                <div className="w-6 h-6 flex items-center justify-center">
                  <Image
                    src="/icons/play.png"
                    alt="Play"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              )}
              {exercise.isAppOnly && (
                <span className="text-[10px] font-medium text-muted-foreground bg-accent/50 px-2 py-0.5 rounded-full">
                  Quabble app only
                </span>
              )}
            </div>

            {/* Icon at top left */}
            <div className="flex items-start justify-start mb-3 h-12">
              {getIconPath(exercise.id) ? (
                <Image
                  src={getIconPath(exercise.id)!}
                  alt={exercise.title}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-muted" />
              )}
            </div>

            {/* Title */}
            <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-2 text-left">
              {exercise.title}
            </h4>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-snug text-left">
              {exercise.description}
            </p>
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
