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
            <div
              key={entry.id}
              className="absolute z-10"
              style={{
                left: `50%`,
                top: `${entry.y}px`,
                transform: `translate(calc(-50% + ${entry.x - 190}px), -50%) rotate(${entry.rotation}deg)`,
              }}
            >
              <Image
                src={`/workouts/gratitudejar/gratitudejar_${entry.ornament}@3x.png`}
                alt={entry.ornament}
                width={46}
                height={46}
                className="object-contain"
              />
            </div>
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
  const [gratitudeCount, setGratitudeCount] = useState(2);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([
    // Initial ornaments - positioned at the bottom of the jar
    { id: "1", ornament: "heart", text: "", x: 140, y: 380, rotation: 15 },
    { id: "2", ornament: "fish", text: "", x: 230, y: 378, rotation: -20 },
  ]);

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

      // Fill horizontally first (3 ornaments per row), then stack upward
      const ornamentsPerRow = 3;
      const rowIndex = Math.floor(currentCount / ornamentsPerRow);
      const columnIndex = currentCount % ornamentsPerRow;

      // Calculate X position based on column (left, center, right)
      let baseX: number;
      if (columnIndex === 0) {
        baseX = 130 + Math.random() * 35; // Left: 130-165
      } else if (columnIndex === 1) {
        baseX = 172 + Math.random() * 35; // Center: 172-207
      } else {
        baseX = 215 + Math.random() * 35; // Right: 215-250
      }

      const randomRotation = Math.random() * 40 - 20; // Random rotation -20 to 20 degrees

      // Calculate Y position - stack upward by row
      // Jar height is 520px, 20% from top is 104px, so limit is y >= 104
      // Start at bottom (380) and go up by 35px per row
      const minY = 104; // 20% from top of 520px jar
      const stackY = Math.max(minY, 380 - (rowIndex * 35));

      const entry: GratitudeEntry = {
        id: Date.now().toString(),
        ornament: selectedOrnament,
        text: gratitudeText,
        x: baseX,
        y: stackY,
        rotation: randomRotation
      };

      // Add entry immediately
      setGratitudeEntries(prev => [...prev, entry]);
      setGratitudeCount(prev => prev + 1);
      setGratitudeText("");
      setSelectedOrnament(null);
      setCurrentScreen("main");
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
            {gratitudeEntries.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="absolute z-10"
                style={{
                  left: `50%`,
                  top: `${entry.y}px`,
                  transform: `translate(calc(-50% + ${entry.x - 190}px), -50%) rotate(${entry.rotation}deg)`,
                }}
              >
                <Image
                  src={`/workouts/gratitudejar/gratitudejar_${entry.ornament}@3x.png`}
                  alt={entry.ornament}
                  width={46}
                  height={46}
                  className="object-contain"
                />
              </div>
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

          <p className="text-sm text-gray-600 text-center">
            Hard to think of any?
          </p>
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
          {/* Selected ornament icons at the top */}
          <div className="flex items-center gap-2 mb-6 w-full">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedOrnament === "fish" ? "bg-gray-200" : "bg-transparent"}`}>
              <Image
                src={`/workouts/gratitudejar/gratitudejar_fish${selectedOrnament === "fish" ? "@3x" : "_disabled@3x"}.png`}
                alt="Fish"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedOrnament === "heart" ? "bg-gray-200" : "bg-transparent"}`}>
              <Image
                src={`/workouts/gratitudejar/gratitudejar_heart${selectedOrnament === "heart" ? "@3x" : "_disabled@3x"}.png`}
                alt="Heart"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedOrnament === "leaf" ? "bg-gray-200" : "bg-transparent"}`}>
              <Image
                src={`/workouts/gratitudejar/gratitudejar_leaf${selectedOrnament === "leaf" ? "@3x" : "_disabled@3x"}.png`}
                alt="Leaf"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="flex-1 text-right text-sm text-gray-600">
              Hard to think of any?
            </span>
          </div>

          <h2 className="text-lg font-normal mb-6 text-gray-900 w-full">
            What are you grateful for today?
          </h2>

          {/* Text area */}
          <div className="w-full mb-4">
            <textarea
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              placeholder=""
              className="w-full h-[300px] px-4 py-3 text-base border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-gray-600 text-gray-900 placeholder:text-gray-400 resize-none"
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
