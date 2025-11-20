"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Headphones, Volume2 } from "lucide-react";
import Lottie from "lottie-react";
import Image from "next/image";

interface MindfulMeditationExerciseProps {
  onComplete?: () => void;
}

type SoundType = "music" | "voice" | "rain" | "wave";

interface SoundConfig {
  id: SoundType;
  label: string;
  icon: string;
}

const SOUNDS: SoundConfig[] = [
  {
    id: "music",
    label: "Music",
    icon: "/workouts/meditation/meditation_music_icon.svg",
  },
  {
    id: "voice",
    label: "Voice",
    icon: "/workouts/meditation/meditation_voice_icon.svg",
  },
  {
    id: "rain",
    label: "Rain",
    icon: "/workouts/meditation/meditation_rain_icon.svg",
  },
  {
    id: "wave",
    label: "Wave",
    icon: "/workouts/meditation/meditation_wave_icon.svg",
  },
];

const MEDITATION_DURATION = 180; // 5 seconds for testing

export function MindfulMeditationExercise({
  onComplete
}: MindfulMeditationExerciseProps) {
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  const [meditationStarted, setMeditationStarted] = useState(false);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundType>("music");
  const startTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lottie animation refs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sparkleLottieRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fireLottieRef = useRef<any>(null);
  const [sparkleAnimationData, setSparkleAnimationData] = useState<object | null>(null);
  const [fireAnimationData, setFireAnimationData] = useState<object | null>(null);

  // Audio file mapping
  const audioFileMap: Record<SoundType, string> = {
    music: "/workouts/meditation/music.mp3",
    rain: "/workouts/meditation/rain.mp3",
    voice: "/workouts/meditation/voice.mp3",
    wave: "/workouts/meditation/wave.mp3",
  };

  // Load Lottie animation data
  useEffect(() => {
    fetch("/workouts/meditation/meditation-sparkle.json")
      .then((res) => res.json())
      .then((data) => setSparkleAnimationData(data))
      .catch((err) => console.error("Failed to load sparkle animation:", err));

    fetch("/workouts/meditation/meditation-fire.json")
      .then((res) => res.json())
      .then((data) => setFireAnimationData(data))
      .catch((err) => console.error("Failed to load fire animation:", err));
  }, []);

  // Main meditation timer
  useEffect(() => {
    if (!meditationStarted) return;

    if (currentSecond >= MEDITATION_DURATION) {
      // Meditation complete
      setMeditationStarted(false);
      setIsCompleted(true);
      // Stop audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    const timer = setInterval(() => {
      setCurrentSecond((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [meditationStarted, currentSecond]);

  const handleSoundToggle = (soundId: SoundType) => {
    setSelectedSound(soundId);
  };

  const handleBegin = () => {
    setShowInitialScreen(false);
    setMeditationStarted(true);
    startTimeRef.current = performance.now();

    // Play selected audio if available
    if (selectedSound && audioFileMap[selectedSound]) {
      audioRef.current = new Audio(audioFileMap[selectedSound]);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5; // Set volume to 50%
      audioRef.current.play().catch((err) => {
        console.error("Failed to play audio:", err);
      });
    }
  };

  const handleRestart = () => {
    setIsCompleted(false);
    setCurrentSecond(0);
    setMeditationStarted(false);
    setShowInitialScreen(true);
    setSelectedSound("music");
    startTimeRef.current = 0;
    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Handle close with audio cleanup
  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    onComplete?.();
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Initial Screen
  if (showInitialScreen) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full w-full relative"
        style={{
          backgroundImage: "url(/workouts/meditation/meditation_bg.jpg)",
          backgroundSize: "110% auto",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Close exercise"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Title and Description - positioned to match completion screen */}
        <div className="absolute top-[10%] left-0 right-0 z-10 flex flex-col items-center px-6">
          <h2 className="text-3xl font-normal mb-4 text-white text-center">
            Mindful Meditation
          </h2>
          <p className="text-base mb-8 text-center text-white/90 max-w-xs">
            Welcome to the 3 minute breathing space. Let&apos;s create a space of calmness and serenity.
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-8 pb-24">
          {/* Glowing object preview */}
          <div className="relative w-[200px] h-[200px] mb-3 flex items-center justify-center">
            {sparkleAnimationData && (
              <Lottie
                lottieRef={sparkleLottieRef}
                animationData={sparkleAnimationData}
                loop={true}
                autoplay={true}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </div>

          {/* Audio instruction message */}
          <div className="flex flex-col items-center justify-center gap-2 mb-3">
            <div className="flex items-center justify-center gap-3">
              <Headphones className="w-5 h-5 text-white" />
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <p className="text-base md:text-lg text-center text-white/90 max-w-xs px-4 font-medium">
              Put on your headphones and turn the volume up
            </p>
          </div>

          {/* Sound selection icons */}
          <div className="flex gap-4 mb-4">
            {SOUNDS.map((sound) => {
              const isSelected = selectedSound === sound.id;
              return (
                <button
                  key={sound.id}
                  onClick={() => handleSoundToggle(sound.id)}
                  className={`flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    isSelected ? "opacity-100" : "opacity-50"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-white/30 border-2 border-white"
                        : "bg-white/10 border-2 border-white/30"
                    }`}
                  >
                    <Image
                      src={sound.icon}
                      alt={sound.label}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm text-white">{sound.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Begin Button - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex justify-center">
          <Button
            onClick={handleBegin}
            size="lg"
            className="w-full max-w-[320px] rounded-full text-lg font-semibold py-6 bg-black hover:bg-gray-900 text-white shadow-lg cursor-pointer"
          >
            Begin Meditation
          </Button>
        </div>
      </div>
    );
  }

  // Completion Screen
  if (isCompleted) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full w-full relative"
        style={{
          backgroundImage: "url(/workouts/meditation/meditation_bg.jpg)",
          backgroundSize: "110% auto",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30 z-10" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Close exercise"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Title and Description - positioned to match initial screen */}
        <div className="absolute top-[10%] left-0 right-0 z-10 flex flex-col items-center px-6">
          <h2 className="text-3xl font-normal mb-4 text-white text-center">
            Well done on completing your meditation.
          </h2>
          <p className="text-base mb-8 text-center text-white/90 max-w-xs">
            Take a moment to appreciate yourself.
          </p>
        </div>

        {/* Sparkle and Fire animations combined */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-8">
          <div className="relative w-[420px] h-[380px] flex items-center justify-center">
            {/* Fire animation */}
            {fireAnimationData && (
              <Lottie
                lottieRef={fireLottieRef}
                animationData={fireAnimationData}
                loop={true}
                autoplay={true}
                style={{ width: "100%", height: "100%", position: "absolute" }}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              />
            )}
            {/* Sparkle animation on top */}
            {sparkleAnimationData && (
              <Lottie
                lottieRef={sparkleLottieRef}
                animationData={sparkleAnimationData}
                loop={true}
                autoplay={true}
                style={{ width: "100%", height: "100%", position: "absolute" }}
              />
            )}
          </div>
        </div>

        {/* Character on water - positioned from bottom */}
        <div className="absolute bottom-[20%] left-0 right-0 z-10 flex items-center justify-center">
          <div className="relative w-[80px] h-[80px] flex items-center justify-center">
            <Image
              src="/workouts/meditation/lying_pea.png"
              alt="Well done"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>

        {/* Start again Button - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex justify-center">
          <Button
            onClick={handleRestart}
            size="lg"
            className="w-full max-w-[320px] rounded-full text-lg font-semibold py-6 bg-black hover:bg-gray-900 text-white shadow-lg cursor-pointer"
          >
            Start again
          </Button>
        </div>
      </div>
    );
  }

  // Meditation Timer Screen
  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full relative"
      style={{
        backgroundImage: "url(/workouts/meditation/meditation_bg.jpg)",
        backgroundSize: "110% auto",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
        aria-label="Close exercise"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Timer display */}
      <div className="absolute top-16 left-0 right-0 z-20 flex justify-center">
        <p className="text-white text-lg font-semibold">
          {formatTime(currentSecond)} / {formatTime(MEDITATION_DURATION)}
        </p>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-8">
        {/* Sparkle and Fire animations combined */}
        <div className="relative w-[420px] h-[380px] flex items-center justify-center">
          {/* Fire animation */}
          {fireAnimationData && (
            <Lottie
              lottieRef={fireLottieRef}
              animationData={fireAnimationData}
              loop={true}
              autoplay={true}
              style={{ width: "100%", height: "100%", position: "absolute" }}
              rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            />
          )}
          {/* Sparkle animation on top */}
          {sparkleAnimationData && (
            <Lottie
              lottieRef={sparkleLottieRef}
              animationData={sparkleAnimationData}
              loop={true}
              autoplay={true}
              style={{ width: "100%", height: "100%", position: "absolute" }}
            />
          )}
        </div>

        {/* Character on water - positioned from bottom */}
        <div className="absolute bottom-[20%] left-0 right-0 z-10 flex items-center justify-center">
          <div className="relative w-[80px] h-[80px] flex items-center justify-center">
            <Image
              src="/workouts/meditation/meditation_avatar@3x.png"
              alt="Meditation character"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

