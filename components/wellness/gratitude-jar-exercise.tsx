"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface GratitudeJarExerciseProps {
  onComplete?: () => void;
}

type ScreenType = "main" | "ornamentSelection" | "journalInput" | "jarView";
type OrnamentType = "fish" | "heart" | "leaf";

interface GratitudeEntry {
  id: string;
  ornament: OrnamentType;
  text: string;
  x: number;
  y: number;
  rotation: number;
  isNew?: boolean;
}

interface JarViewProps {
  gratitudeEntries: GratitudeEntry[];
  gratitudeCount: number;
  onComplete?: () => void;
  onWriteAnother: () => void;
  onBackToJar: () => void;
}

function JarView({
  gratitudeEntries,
  gratitudeCount,
  onComplete,
  onWriteAnother,
  onBackToJar,
}: JarViewProps) {

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full relative"
      style={{
        backgroundImage: "url(/workouts/gratitudejar/gratitudejar_bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#6B9283]/20" />

      <button
        onClick={onComplete}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
        aria-label="Close exercise"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Jar with ornaments */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-8 pb-32">
        <div className="relative w-[380px] h-[520px] mx-auto mt-40">
          {/* Jar SVG */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/workouts/gratitudejar/gratitude_jar.svg"
              alt="Gratitude Jar"
              width={380}
              height={520}
              className="object-contain relative z-20 pointer-events-none"
            />
          </div>

          {/* Render ornaments */}
          {gratitudeEntries.map((entry) => (
            <motion.div
              key={entry.id}
              className="absolute z-10"
              style={{
                left: `${entry.x}px`,
                top: `${entry.y}px`,
                transform: `translate(-50%, -50%) rotate(${entry.rotation}deg)`,
              }}
              initial={entry.isNew ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
              animate={entry.isNew ? {
                opacity: 1,
                scale: 1,
                filter: [
                  "brightness(1) drop-shadow(0 0 0px rgba(255,215,0,0))",
                  "brightness(1.5) drop-shadow(0 0 15px rgba(255,215,0,0.8))",
                  "brightness(1.3) drop-shadow(0 0 10px rgba(255,215,0,0.6))",
                  "brightness(1) drop-shadow(0 0 0px rgba(255,215,0,0))",
                ]
              } : { opacity: 1, scale: 1 }}
              transition={entry.isNew ? {
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 },
                filter: { duration: 3, times: [0, 0.3, 0.7, 1] }
              } : {}}
            >
              <Image
                src={`/workouts/gratitudejar/gratitudejar_${entry.ornament}@3x.png`}
                alt={entry.ornament}
                width={46}
                height={46}
                className="object-contain"
              />
            </motion.div>
          ))}
        </div>

        {/* Count badge */}
        <div className="absolute bottom-20 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
            <span className="text-2xl font-semibold text-gray-800">{gratitudeCount}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex flex-col gap-3">
        <Button
          onClick={onWriteAnother}
          size="lg"
          className="w-full max-w-[320px] mx-auto rounded-full text-lg font-semibold py-6 bg-black hover:bg-gray-900 text-white shadow-lg cursor-pointer"
        >
          Write Another
        </Button>
        <Button
          onClick={onBackToJar}
          size="lg"
          variant="outline"
          className="w-full max-w-[320px] mx-auto rounded-full text-lg font-semibold py-6 bg-white/80 hover:bg-white text-gray-800 shadow-lg cursor-pointer"
        >
          Back to Jar
        </Button>
      </div>
    </div>
  );
}

export function GratitudeJarExercise({
  onComplete
}: GratitudeJarExerciseProps) {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("main");
  const [selectedOrnament, setSelectedOrnament] = useState<OrnamentType | null>(null);
  const [gratitudeText, setGratitudeText] = useState("");
  const [gratitudeCount, setGratitudeCount] = useState(0);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);

  const handleStartWriting = () => {
    setCurrentScreen("ornamentSelection");
  };

  const handleOrnamentSelect = (ornament: OrnamentType) => {
    setSelectedOrnament(ornament);
    setCurrentScreen("journalInput");
  };

  const handleJournalSubmit = () => {
    if (gratitudeText.trim() && selectedOrnament) {
      const currentCount = gratitudeEntries.length;

      // Fill horizontally first (4 ornaments per row), then stack upward
      const ornamentsPerRow = 4;
      const rowIndex = Math.floor(currentCount / ornamentsPerRow);
      const columnIndex = currentCount % ornamentsPerRow;

      // Calculate X position based on column (spread across jar width)
      // Jar is 380px wide, center is at 190px, but shifted left slightly
      // Spread ornaments with smaller width (reduced from 130 to 80)
      const jarCenter = 175; // Shifted left from 190 to 175
      const maxOffset = 80; // Maximum offset from center (reduced for smaller spread)
      const minOffset = -80; // Minimum offset from center (reduced for smaller spread)
      const totalSpread = maxOffset - minOffset; // 160px total spread
      const columnSpacing = totalSpread / (ornamentsPerRow - 1); // Space between columns
      
      // Calculate offset from center for this column
      const baseOffset = minOffset + (columnIndex * columnSpacing);
      const randomOffset = Math.random() * 15 - 7.5; // -7.5 to +7.5px random variation
      const finalOffset = baseOffset + randomOffset;
      
      // Store as absolute position (center + offset)
      const baseX = jarCenter + finalOffset;

      const randomRotation = Math.random() * 40 - 20; // Random rotation -20 to 20 degrees

      // Calculate Y position - stack upward by row
      // Jar height is 520px, 20% from top is 104px, so limit is y >= 104
      // Start higher (at 340 instead of 380) and go up by 40px per row
      const minY = 104; // 20% from top of 520px jar
      const stackY = Math.max(minY, 340 - (rowIndex * 40));

      const entry: GratitudeEntry = {
        id: Date.now().toString(),
        ornament: selectedOrnament,
        text: gratitudeText,
        x: baseX,
        y: stackY,
        rotation: randomRotation,
        isNew: true
      };

      // Add entry immediately
      setGratitudeEntries(prev => [...prev, entry]);
      setGratitudeCount(prev => prev + 1);
      setGratitudeText("");
      setSelectedOrnament(null);
      setCurrentScreen("main");

      // Remove the "isNew" flag after animation completes (3 seconds)
      setTimeout(() => {
        setGratitudeEntries(prev =>
          prev.map(e => e.id === entry.id ? { ...e, isNew: false } : e)
        );
      }, 3000);
    }
  };

  const handleWriteAnother = () => {
    setGratitudeText("");
    setSelectedOrnament(null);
    setCurrentScreen("ornamentSelection");
  };

  const handleBack = () => {
    if (currentScreen === "ornamentSelection") {
      setCurrentScreen("main");
    } else if (currentScreen === "journalInput") {
      setCurrentScreen("ornamentSelection");
    } else if (currentScreen === "jarView") {
      setCurrentScreen("main");
    }
  };

  // Main Screen
  if (currentScreen === "main") {
    return (
      <div
        className="flex flex-col items-center justify-center h-full w-full relative"
        style={{
          backgroundImage: "url(/workouts/gratitudejar/gratitudejar_bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#6B9283]/20" />

        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Close exercise"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Title and Description */}
        <div className="absolute top-[10%] left-0 right-0 z-10 flex flex-col items-center px-6">
          <h2 className="text-4xl font-normal mb-4 text-white text-center">
            Gratitude Jar
          </h2>
          <p className="text-base mb-8 text-center text-white max-w-md leading-relaxed">
            Take a moment to reflect on grateful moments every day. Let&apos;s bring positivity into our lives with gratitude journaling!
          </p>
        </div>

        {/* Jar with ornaments */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-8 pb-32">
          <div className="relative w-[380px] h-[520px] mx-auto mt-40">
            {/* Jar SVG - centered */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/workouts/gratitudejar/gratitude_jar.svg"
                alt="Gratitude Jar"
                width={380}
                height={520}
                className="object-contain relative z-20 pointer-events-none"
              />
            </div>

            {/* Static ornaments inside the jar */}
            {gratitudeEntries.map((entry) => (
              <motion.div
                key={entry.id}
                className="absolute z-10"
                style={{
                  left: `${entry.x}px`,
                  top: `${entry.y}px`,
                  transform: `translate(-50%, -50%) rotate(${entry.rotation}deg)`,
                }}
                initial={entry.isNew ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
                animate={entry.isNew ? {
                  opacity: 1,
                  scale: 1,
                  filter: [
                    "brightness(1) drop-shadow(0 0 0px rgba(255,215,0,0))",
                    "brightness(1.5) drop-shadow(0 0 15px rgba(255,215,0,0.8))",
                    "brightness(1.3) drop-shadow(0 0 10px rgba(255,215,0,0.6))",
                    "brightness(1) drop-shadow(0 0 0px rgba(255,215,0,0))",
                  ]
                } : { opacity: 1, scale: 1 }}
                transition={entry.isNew ? {
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                  filter: { duration: 3, times: [0, 0.3, 0.7, 1] }
                } : {}}
              >
                <Image
                  src={`/workouts/gratitudejar/gratitudejar_${entry.ornament}@3x.png`}
                  alt={entry.ornament}
                  width={46}
                  height={46}
                  className="object-contain"
                />
              </motion.div>
            ))}
          </div>

          {/* Count badge */}
          <div className="absolute bottom-20 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
              <span className="text-2xl font-semibold text-gray-800">{gratitudeCount}</span>
            </div>
          </div>
        </div>

        {/* Write Gratitude Button */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex justify-center">
          <Button
            onClick={handleStartWriting}
            size="lg"
            className="w-full max-w-[320px] rounded-full text-lg font-semibold py-6 bg-black hover:bg-gray-900 text-white shadow-lg cursor-pointer"
          >
            Write Gratitude
          </Button>
        </div>
      </div>
    );
  }

  // Ornament Selection Screen
  if (currentScreen === "ornamentSelection") {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full relative bg-[#F5F1E8]">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Close exercise"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-8 pb-24">
          <h2 className="text-xl font-normal mb-12 text-gray-900 text-center">
            Choose an ornament
          </h2>

          {/* Ornament options */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOrnamentSelect("fish")}
              className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
            >
              <Image
                src="/workouts/gratitudejar/gratitudejar_fish@3x.png"
                alt="Fish ornament"
                width={80}
                height={80}
                className="object-contain"
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOrnamentSelect("heart")}
              className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
            >
              <Image
                src="/workouts/gratitudejar/gratitudejar_heart@3x.png"
                alt="Heart ornament"
                width={80}
                height={80}
                className="object-contain"
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOrnamentSelect("leaf")}
              className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
            >
              <Image
                src="/workouts/gratitudejar/gratitudejar_leaf@3x.png"
                alt="Leaf ornament"
                width={80}
                height={80}
                className="object-contain"
              />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Journal Input Screen
  if (currentScreen === "journalInput") {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full relative bg-[#F5F1E8]">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Close exercise"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        <div className="relative z-10 flex flex-col items-start justify-start flex-1 px-6 py-8 w-full max-w-md pt-20">
          {/* Selected ornament icon at the top */}
          {selectedOrnament && (
            <div className="mb-6 w-full flex justify-start">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <Image
                  src={`/workouts/gratitudejar/gratitudejar_${selectedOrnament}@3x.png`}
                  alt={selectedOrnament}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </div>
          )}

          <h2 className="text-lg font-normal mb-6 text-gray-900 w-full">
            What are you grateful for today?
          </h2>

          {/* Text area */}
          <div className="w-full mb-4">
            <textarea
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              placeholder=""
              className="w-full h-[300px] px-4 py-3 text-base border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-gray-600 text-gray-900 placeholder:text-gray-400 resize-none"
              autoFocus
            />
          </div>
        </div>

        {/* Done Button */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex justify-center">
          <Button
            onClick={handleJournalSubmit}
            disabled={!gratitudeText.trim()}
            size="lg"
            className={`w-full max-w-[320px] rounded-full text-lg font-semibold py-6 shadow-lg ${
              gratitudeText.trim()
                ? "bg-gray-700 hover:bg-gray-800 text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  // Jar View Screen
  if (currentScreen === "jarView") {
    return (
      <JarView
        gratitudeEntries={gratitudeEntries}
        gratitudeCount={gratitudeCount}
        onComplete={onComplete}
        onWriteAnother={handleWriteAnother}
        onBackToJar={() => setCurrentScreen("main")}
      />
    );
  }

  return null;
}
