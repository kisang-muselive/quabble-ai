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

export function WellnessWelcomeCards({ onExerciseClick }: WellnessWelcomeCardsProps) {
  const exercises: WelcomeExercise[] = [
    {
      id: "breathing",
      title: "Breathing Exercise",
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
      id: "body-scan",
      title: "Body Scan",
      description: "Release tension throughout your body",
      color: "oklch(0.75 0.12 280)", // Soft purple
    },
    {
      id: "mood-tracker",
      title: "Mood Check-In",
      description: "Track how you're feeling today",
      color: "oklch(0.70 0.15 150)", // Teal
    },
    {
      id: "affirmations",
      title: "Daily Affirmations",
      description: "Boost confidence with positive words",
      color: "oklch(0.65 0.18 30)", // Golden
    },
    {
      id: "progressive-relaxation",
      title: "Progressive Relaxation",
      description: "Relax each muscle group systematically",
      color: "oklch(0.72 0.10 200)", // Soft blue
    },
    {
      id: "yoga-stretch",
      title: "Gentle Yoga",
      description: "Stretch and strengthen mindfully",
      color: "oklch(0.78 0.08 100)", // Light lime
    },
    {
      id: "journaling",
      title: "Free Journaling",
      description: "Express your thoughts on paper",
      color: "oklch(0.68 0.12 320)", // Rose
    },
    {
      id: "nature-sounds",
      title: "Nature Sounds",
      description: "Relax with calming natural ambience",
      color: "oklch(0.60 0.10 140)", // Forest green
    },
    {
      id: "visualization",
      title: "Visualization",
      description: "Imagine your peaceful safe place",
      color: "oklch(0.70 0.15 260)", // Lavender
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
      id: "self-compassion",
      title: "Self-Compassion",
      description: "Practice kindness toward yourself",
      color: "oklch(0.80 0.08 350)", // Blush pink
    },
    {
      id: "sleep-preparation",
      title: "Sleep Preparation",
      description: "Wind down for restful sleep",
      color: "oklch(0.45 0.06 240)", // Deep indigo
    },
    {
      id: "energy-boost",
      title: "Energy Boost",
      description: "Revitalize with quick exercises",
      color: "oklch(0.75 0.18 80)", // Bright yellow
    },
    {
      id: "stress-release",
      title: "Stress Release",
      description: "Let go of tension and worry",
      color: "oklch(0.68 0.14 20)", // Coral
    },
    {
      id: "mindful-eating",
      title: "Mindful Eating",
      description: "Savor your food with awareness",
      color: "oklch(0.70 0.12 90)", // Chartreuse
    },
    {
      id: "positive-memories",
      title: "Positive Memories",
      description: "Reflect on joyful moments",
      color: "oklch(0.82 0.10 60)", // Peach
    },
    {
      id: "creative-expression",
      title: "Creative Expression",
      description: "Express yourself through art",
      color: "oklch(0.72 0.16 310)", // Magenta
    },
    {
      id: "loving-kindness",
      title: "Loving-Kindness",
      description: "Send compassion to yourself and others",
      color: "oklch(0.78 0.11 10)", // Warm red
    },
    {
      id: "box-breathing",
      title: "Box Breathing",
      description: "Balance your nervous system",
      color: "oklch(0.68 0.10 180)", // Cyan
    },
    {
      id: "worry-time",
      title: "Worry Time",
      description: "Contain worries to a specific time",
      color: "oklch(0.62 0.12 250)", // Deep purple
    },
    {
      id: "power-pose",
      title: "Power Pose",
      description: "Boost confidence with body language",
      color: "oklch(0.70 0.16 45)", // Orange gold
    },
    {
      id: "music-therapy",
      title: "Music Therapy",
      description: "Heal through the power of sound",
      color: "oklch(0.68 0.14 290)", // Violet
    },
    {
      id: "cold-water",
      title: "Cold Water Reset",
      description: "Refresh with cold water exposure",
      color: "oklch(0.72 0.12 210)", // Ice blue
    },
    {
      id: "laughter-yoga",
      title: "Laughter Yoga",
      description: "Release endorphins through laughter",
      color: "oklch(0.80 0.14 70)", // Sunny yellow
    },
    {
      id: "tea-ceremony",
      title: "Mindful Tea",
      description: "Find calm in a tea ritual",
      color: "oklch(0.65 0.08 110)", // Tea green
    },
    {
      id: "boundaries",
      title: "Setting Boundaries",
      description: "Practice saying no with grace",
      color: "oklch(0.68 0.11 0)", // Red
    },
    {
      id: "anger-release",
      title: "Anger Release",
      description: "Express anger safely and healthily",
      color: "oklch(0.62 0.17 15)", // Brick red
    },
    {
      id: "future-self",
      title: "Future Self Journaling",
      description: "Connect with your future goals",
      color: "oklch(0.70 0.13 220)", // Sky blue
    },
    {
      id: "social-connection",
      title: "Social Connection",
      description: "Reach out to a friend or loved one",
      color: "oklch(0.75 0.12 340)", // Pink
    },
    {
      id: "habit-tracking",
      title: "Habit Tracker",
      description: "Build consistency day by day",
      color: "oklch(0.68 0.09 120)", // Olive
    },
    {
      id: "shadow-work",
      title: "Shadow Work",
      description: "Explore and integrate your shadow",
      color: "oklch(0.55 0.08 270)", // Deep violet
    },
    {
      id: "digital-detox",
      title: "Digital Detox",
      description: "Take a break from screens",
      color: "oklch(0.65 0.10 170)", // Aqua
    },
    {
      id: "brain-dump",
      title: "Brain Dump",
      description: "Clear mental clutter on paper",
      color: "oklch(0.72 0.13 55)", // Tangerine
    },
    {
      id: "values-alignment",
      title: "Values Check",
      description: "Align actions with core values",
      color: "oklch(0.68 0.15 300)", // Purple pink
    },
    {
      id: "forgiveness",
      title: "Forgiveness Practice",
      description: "Release resentment and move forward",
      color: "oklch(0.76 0.09 350)", // Soft pink
    },
    {
      id: "purpose-reflection",
      title: "Purpose Reflection",
      description: "Explore your life's meaning",
      color: "oklch(0.60 0.11 230)", // Royal blue
    },
    {
      id: "quick-wins",
      title: "Quick Wins",
      description: "Complete small tasks for momentum",
      color: "oklch(0.72 0.16 95)", // Lime
    },
  ];

  return (
    <div className="w-full pb-8">
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold text-center mb-6 text-foreground"
      >
        Mental Workouts
      </motion.h3>

      <div className="grid gap-2 w-full px-2 justify-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 180px))' }}>
        {exercises.map((exercise, index) => (
          <motion.button
            key={exercise.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => onExerciseClick(exercise.id)}
            className="group relative aspect-square max-w-[200px] max-h-[200px] rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Background gradient overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{ backgroundColor: exercise.color }}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-4 text-center gap-2">
              {/* Duck Logo */}
              <div className="relative w-16 h-16 mb-2">
                <Image
                  src="/quabble-duck.png"
                  alt="Quabble Duck"
                  fill
                  className="object-contain rounded-xl group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>

              {/* Title */}
              <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {exercise.title}
              </h4>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {exercise.description}
              </p>

              {/* Color accent bar at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
                style={{ backgroundColor: exercise.color }}
              />
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
