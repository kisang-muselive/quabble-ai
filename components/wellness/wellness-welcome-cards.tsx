"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useWellness } from "./wellness-provider";

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
  const { openAppOnlyModal } = useWellness();

  const handleExerciseClick = (exercise: WelcomeExercise) => {
    if (exercise.isAppOnly) {
      openAppOnlyModal(exercise.id, exercise.title, exercise.description);
    } else {
      onExerciseClick(exercise.id);
    }
  };

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
      id: "meditation",
      title: "Meditation",
      description: "Three-minute guided meditation to relax and focus",
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
      hasPlayButton: true,
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
              Quabble&apos;s Mind Workout is a daily mental health exercise you can complete in just a few minutes. It fills the gaps between therapy sessions and is designed, based on scientific evidence, to ease stress, anxiety, and low mood. Simply put, it&apos;s a short daily workout for your mind.
            </p>

            {/* App Download Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://apps.apple.com/us/app/quabble-daily-mental-health/id6445948886"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <img
                  src="/appstore.png"
                  alt="Download on the App Store"
                  className="h-10 w-auto object-contain"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.museLIVE.quabbleapp&hl=en_US"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <img
                  src="/google.png"
                  alt="Get it on Google Play"
                  className="h-10 w-auto object-contain"
                />
              </a>
            </div>
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

      {/* Available on Web Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full mb-12 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-normal text-foreground mb-6">Available on Web</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {/* 1 min Breathing Card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => onExerciseClick("breathing")}
              className="group relative w-full flex flex-col rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden p-4 cursor-pointer"
            >
              {/* Badge in top right corner */}
              <div className="absolute top-3 right-3 z-10">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/icons/play.png"
                    alt="Play"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Icon at top left */}
              <div className="flex items-start justify-start mb-3 h-12">
                <Image
                  src="/icons/workout-icon_1-minute-breathing.png"
                  alt="1 min Breathing"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-2 text-left">
                1 min Breathing
              </h4>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-snug text-left">
                One-minute fun breathing exercise to relax
              </p>
            </motion.button>

            {/* 54321 Card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              onClick={() => onExerciseClick("grounding-54321")}
              className="group relative w-full flex flex-col rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden p-4 cursor-pointer"
            >
              {/* Badge in top right corner */}
              <div className="absolute top-3 right-3 z-10">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/icons/play.png"
                    alt="Play"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Icon at top left */}
              <div className="flex items-start justify-start mb-3 h-12">
                <Image
                  src="/icons/workout-icon_54321.png"
                  alt="54321"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-2 text-left">
                54321
              </h4>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-snug text-left">
                Practice this simple and effective grounding method regularly to manage stress and anxiety better
              </p>
            </motion.button>

            {/* Watermelon Tai-Chi Card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => onExerciseClick("yoga-stretch")}
              className="group relative w-full flex flex-col rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden p-4 cursor-pointer"
            >
              {/* Badge in top right corner */}
              <div className="absolute top-3 right-3 z-10">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/icons/play.png"
                    alt="Play"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Icon at top left */}
              <div className="flex items-start justify-start mb-3 h-12">
                <Image
                  src="/icons/workout-icon_watermelon-tai-chi.png"
                  alt="Watermelon Tai-Chi"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-2 text-left">
                Watermelon Tai-Chi
              </h4>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-snug text-left">
                Fun Tai-chi movements to follow for mind and body balance
              </p>
            </motion.button>

            {/* Meditation Card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 }}
              onClick={() => onExerciseClick("meditation")}
              className="group relative w-full flex flex-col rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden p-4 cursor-pointer"
            >
              {/* Badge in top right corner */}
              <div className="absolute top-3 right-3 z-10">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/icons/play.png"
                    alt="Play"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Icon at top left */}
              <div className="flex items-start justify-start mb-3 h-12">
                <Image
                  src="/icons/workout-icon_meditation.png"
                  alt="Meditation"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-2 text-left">
                Meditation
              </h4>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-snug text-left">
                Three-minute guided meditation to relax and focus
              </p>
            </motion.button>

            {/* Thank You Card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => onExerciseClick("thank-you")}
              className="group relative w-full flex flex-col rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden p-4 cursor-pointer"
            >
              {/* Badge in top right corner */}
              <div className="absolute top-3 right-3 z-10">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/icons/play.png"
                    alt="Play"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Icon at top left */}
              <div className="flex items-start justify-start mb-3 h-12">
                <Image
                  src="/icons/workout-icon_thank-you.png"
                  alt="Thank You"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-2 text-left">
                Thank You
              </h4>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-snug text-left">
                Send a thank you note to someone special and spread joy
              </p>
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* All MindWorkouts Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full mb-12 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-3 mb-6">
            <Image
              src="/icons/mobile-icon.png"
              alt="Mobile"
              width={40}
              height={40}
              className="object-contain"
            />
            <h2 className="text-lg font-normal text-foreground">
              All Mind Workouts in Quabble App
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {exercises.map((exercise, index) => (
          <motion.button
            key={exercise.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleExerciseClick(exercise)}
            className="group relative w-full flex flex-col rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden p-4 cursor-pointer"
          >
            {/* Badge in top right corner */}
            <div className="absolute top-3 right-3 z-10">
              {exercise.hasPlayButton && (
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/icons/play.png"
                    alt="Play"
                    width={32}
                    height={32}
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
        </div>
      </motion.section>
    </div>
  );
}
