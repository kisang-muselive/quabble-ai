"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

export type BreathingExerciseType = "box" | "478" | "555";

interface BreathingExerciseProps {
  exerciseType?: BreathingExerciseType;
  onComplete?: () => void;
}

interface ExerciseConfig {
  id: BreathingExerciseType;
  name: string;
  description: string;
  background: string;
  duckAnimation: string;
  gaugeAnimation: string;
  audioGuide: string;
  audioCountdown: string;
  totalDuration: number; // in seconds
  totalCycles: number;
  breatheStatus: string[];
  cycleDuration: number; // total seconds per cycle
  tickMarks: number[]; // seconds when text changes
  getPhaseAtSecond: (second: number) => number; // returns phase index
}

const EXERCISE_CONFIGS: Record<BreathingExerciseType, ExerciseConfig> = {
  box: {
    id: "box",
    name: "Box Breathing",
    description: "4-4-4-4 pattern to balance your nervous system",
    background: "/workouts/breathing/breathing_bg.jpg",
    duckAnimation: "/workouts/breathing/breathing_duck.json",
    gaugeAnimation: "/workouts/breathing/breathing_gauge.json",
    audioGuide: "/workouts/breathing/box_breathing.mp3",
    audioCountdown: "/workouts/breathing/breathing_count.mp3",
    totalDuration: 64,
    totalCycles: 4,
    breatheStatus: ["INHALE", "HOLD", "EXHALE", "HOLD"],
    cycleDuration: 16,
    tickMarks: [5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61],
    getPhaseAtSecond: (second: number) => {
      const cyclePosition = second % 16;
      if (cyclePosition < 4) return 0; // INHALE
      if (cyclePosition < 8) return 1; // HOLD
      if (cyclePosition < 12) return 2; // EXHALE
      return 3; // HOLD
    },
  },
  "478": {
    id: "478",
    name: "4-7-8 Breathing",
    description: "Calm your mind with this relaxing pattern",
    background: "/workouts/breathing/breathing_bg_478.jpg",
    duckAnimation: "/workouts/breathing/breathing_duck_478.json",
    gaugeAnimation: "/workouts/breathing/breathing_gauge_478.json",
    audioGuide: "/workouts/breathing/breathing478.mp3",
    audioCountdown: "/workouts/breathing/breathing_count.mp3",
    totalDuration: 57,
    totalCycles: 3,
    breatheStatus: ["INHALE", "HOLD", "EXHALE"],
    cycleDuration: 19,
    tickMarks: [5, 12, 20, 24, 31, 39, 43, 50],
    getPhaseAtSecond: (second: number) => {
      const cyclePosition = second % 19;
      if (cyclePosition < 4) return 0; // INHALE
      if (cyclePosition < 11) return 1; // HOLD
      return 2; // EXHALE
    },
  },
  "555": {
    id: "555",
    name: "5-5-5 Breathing",
    description: "Find balance with equal breath intervals",
    background: "/workouts/breathing/breathing_bg_555.jpg",
    duckAnimation: "/workouts/breathing/breathing_duck_555.json",
    gaugeAnimation: "/workouts/breathing/breathing_gauge_555.json",
    audioGuide: "/workouts/breathing/breathing555.mp3",
    audioCountdown: "/workouts/breathing/breathing_count.mp3",
    totalDuration: 60,
    totalCycles: 4,
    breatheStatus: ["INHALE", "HOLD", "EXHALE"],
    cycleDuration: 15,
    tickMarks: [6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56],
    getPhaseAtSecond: (second: number) => {
      const cyclePosition = second % 15;
      if (cyclePosition < 5) return 0; // INHALE
      if (cyclePosition < 10) return 1; // HOLD
      return 2; // EXHALE
    },
  },
};

export function BreathingExercise({
  exerciseType = "478",
  onComplete
}: BreathingExerciseProps) {
  const config = EXERCISE_CONFIGS[exerciseType];

  // State management
  const [countdownPhase, setCountdownPhase] = useState<number>(3); // 3, 2, 1, then 0
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [breathingStarted, setBreathingStarted] = useState(false);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [readyDots, setReadyDots] = useState([false, false, false]);

  // Audio refs
  const audioGuideRef = useRef<HTMLAudioElement | null>(null);
  const audioCountdownRef = useRef<HTMLAudioElement | null>(null);

  // Lottie animation refs
  const gaugeLottieRef = useRef<any>(null);
  const [gaugeTotalFrames, setGaugeTotalFrames] = useState<number>(0);

  // Lottie animation data
  const [duckAnimationData, setDuckAnimationData] = useState<object | null>(null);
  const [gaugeAnimationData, setGaugeAnimationData] = useState<object | null>(null);

  // Load Lottie animation data
  useEffect(() => {
    fetch(config.duckAnimation)
      .then((res) => res.json())
      .then((data) => setDuckAnimationData(data))
      .catch((err) => console.error("Failed to load duck animation:", err));

    fetch(config.gaugeAnimation)
      .then((res) => res.json())
      .then((data) => {
        setGaugeAnimationData(data);
        // Store total frames for progress calculation
        // Lottie JSON format: 'op' is total frames, 'fr' is frame rate, 'h' is height (sometimes used for duration)
        if (data.op && typeof data.op === 'number') {
          setGaugeTotalFrames(data.op);
        } else if (data.fr && typeof data.fr === 'number') {
          // Calculate total frames from frame rate and duration
          // If 'op' is not available, try to calculate from other properties
          const frameRate = data.fr;
          const duration = data.op || (data.h ? data.h / frameRate : 0);
          if (duration > 0) {
            setGaugeTotalFrames(Math.floor(duration * frameRate));
          }
        }
      })
      .catch((err) => console.error("Failed to load gauge animation:", err));
  }, [config]);

  // Preload audio
  useEffect(() => {
    try {
      audioGuideRef.current = new Audio(config.audioGuide);
      audioCountdownRef.current = new Audio(config.audioCountdown);

      // Set up error handlers to gracefully handle missing audio files
      audioGuideRef.current.onerror = () => {
        console.warn("Audio guide file not found or failed to load");
      };
      audioCountdownRef.current.onerror = () => {
        console.warn("Countdown audio file not found or failed to load");
      };
    } catch (err) {
      console.error("Failed to initialize audio:", err);
    }

    return () => {
      audioGuideRef.current?.pause();
      audioCountdownRef.current?.pause();
    };
  }, [config]);

  // Countdown phase logic
  useEffect(() => {
    if (!isCountingDown) return;

    if (countdownPhase > 0) {
      const timer = setTimeout(() => {
        setCountdownPhase(countdownPhase - 1);
        setReadyDots((prev) => {
          const newDots = [...prev];
          newDots[3 - countdownPhase] = true;
          return newDots;
        });

        // Play countdown audio
        if (audioCountdownRef.current) {
          audioCountdownRef.current.currentTime = 0;
          audioCountdownRef.current.play().catch(() => {
            // Silently handle audio play errors
          });
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // Countdown finished, start breathing
      setIsCountingDown(false);
      setBreathingStarted(true);

      // Start audio guide after 1 second
      setTimeout(() => {
        if (audioGuideRef.current) {
          audioGuideRef.current.play().catch(() => {
            // Silently handle audio play errors
          });
        }
      }, 1000);
    }
  }, [isCountingDown, countdownPhase]);

  // Main breathing timer
  useEffect(() => {
    if (!breathingStarted) return;

    if (currentSecond >= config.totalDuration) {
      // Exercise complete
      setBreathingStarted(false);
      audioGuideRef.current?.pause();
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setCurrentSecond((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [breathingStarted, currentSecond, config.totalDuration, onComplete]);

  // Update gauge animation progress based on exercise progress
  useEffect(() => {
    if (!gaugeLottieRef.current || gaugeTotalFrames === 0) return;

    if (!breathingStarted) {
      // Reset to frame 0 when exercise hasn't started
      if (gaugeLottieRef.current.goToAndStop) {
        gaugeLottieRef.current.goToAndStop(0, true);
      }
      return;
    }

    const progress = currentSecond / config.totalDuration;
    const targetFrame = Math.min(Math.floor(progress * gaugeTotalFrames), gaugeTotalFrames - 1);
    
    if (gaugeLottieRef.current.goToAndStop) {
      gaugeLottieRef.current.goToAndStop(targetFrame, true);
    } else if (gaugeLottieRef.current.playSegments) {
      // Alternative method if goToAndStop doesn't work
      const segment = [0, targetFrame];
      gaugeLottieRef.current.playSegments(segment, true);
    }
  }, [breathingStarted, currentSecond, config.totalDuration, gaugeTotalFrames]);

  const handleStart = () => {
    setCountdownPhase(3);
    setReadyDots([false, false, false]);
    setCurrentSecond(0);
    setIsCountingDown(true);
    setAnimate(true);
    // Reset gauge animation to start
    if (gaugeLottieRef.current && gaugeLottieRef.current.goToAndStop) {
      gaugeLottieRef.current.goToAndStop(0, true);
    }
  };

  const handleStop = () => {
    setIsCountingDown(false);
    setBreathingStarted(false);
    setCountdownPhase(3);
    setCurrentSecond(0);
    setReadyDots([false, false, false]);
    setAnimate(false);

    audioGuideRef.current?.pause();
    audioCountdownRef.current?.pause();
    if (audioGuideRef.current) audioGuideRef.current.currentTime = 0;
    if (audioCountdownRef.current) audioCountdownRef.current.currentTime = 0;
  };

  // Get current phase and cycle
  const getCurrentPhaseIndex = () => {
    if (!breathingStarted) return 0;
    return config.getPhaseAtSecond(currentSecond);
  };

  const getCurrentCycle = () => {
    if (!breathingStarted) return 0;
    return Math.floor(currentSecond / config.cycleDuration);
  };

  const getCurrentPhaseText = () => {
    const phaseIdx = getCurrentPhaseIndex();
    return config.breatheStatus[phaseIdx];
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "INHALE":
        return "oklch(0.68 0.14 50)"; // Warm orange
      case "HOLD":
        return "oklch(0.88 0.06 60)"; // Soft peach
      case "EXHALE":
        return "oklch(0.52 0.08 145)"; // Sage green
      default:
        return "oklch(0.68 0.14 50)";
    }
  };

  const isActive = isCountingDown || breathingStarted;

  return (
    <div
      className="flex flex-col items-center justify-center h-[600px] space-y-6 py-6 px-4 relative"
      style={{
        backgroundImage: `url(${config.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Lottie Animations Container */}
        <div className="relative flex items-center justify-center w-[375px] h-[375px]">
          {/* Semi-transparent white circle background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[269px] h-[269px] rounded-full bg-white/30" />
          </div>

          {/* Duck Animation */}
          {duckAnimationData && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[269px] h-[269px]">
                <Lottie
                  animationData={duckAnimationData}
                  loop={true}
                  autoplay={animate}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          )}

          {/* Gauge Animation (overlays duck) */}
          {gaugeAnimationData && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[375px] h-[375px]">
                <Lottie
                  lottieRef={gaugeLottieRef}
                  animationData={gaugeAnimationData}
                  loop={false}
                  autoplay={false}
                  style={{ width: "100%", height: "100%" }}
                  onDOMLoaded={() => {
                    // Get total frames when animation DOM is loaded
                    // The ref gives access to the lottie-web animation instance
                    if (gaugeLottieRef.current) {
                      const animation = gaugeLottieRef.current;
                      
                      // Try multiple ways to get total frames
                      if (animation.totalFrames) {
                        setGaugeTotalFrames(animation.totalFrames);
                      } else if (animation.renderer && animation.renderer.totalFrames) {
                        setGaugeTotalFrames(animation.renderer.totalFrames);
                      } else if (gaugeAnimationData && typeof gaugeAnimationData === 'object') {
                        // Fallback: get from animation data
                        const data = gaugeAnimationData as any;
                        if (data.op && typeof data.op === 'number') {
                          setGaugeTotalFrames(data.op);
                        }
                      }
                      
                      // Reset to frame 0 initially
                      if (animation.goToAndStop) {
                        animation.goToAndStop(0, true);
                      } else if (animation.setSpeed) {
                        // Alternative: stop at frame 0
                        animation.setSpeed(0);
                        animation.goToAndPlay(0, true);
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Phase Instruction */}
        <div className="text-center space-y-2">
          {isCountingDown && (
            <>
              <p className="text-2xl font-semibold text-foreground">Get Ready</p>
              <div className="flex justify-center gap-2 mt-4">
                {readyDots.map((active, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0.3 }}
                    animate={{
                      scale: active ? 1.2 : 0.8,
                      opacity: active ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: active
                        ? getPhaseColor(config.breatheStatus[0])
                        : "#ccc",
                    }}
                  />
                ))}
              </div>
              <p className="text-6xl font-bold mt-4" style={{ color: getPhaseColor(config.breatheStatus[0]) }}>
                {countdownPhase}
              </p>
            </>
          )}

          {breathingStarted && (
            <>
              <motion.p
                key={getCurrentPhaseText()}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold"
                style={{ color: getPhaseColor(getCurrentPhaseText()) }}
              >
                {getCurrentPhaseText()}
              </motion.p>

              {/* Tick marks indicator */}
              {config.tickMarks.includes(currentSecond) && (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-muted-foreground"
                >
                  •
                </motion.div>
              )}
            </>
          )}

          {!isActive && (
            <p className="text-3xl font-semibold text-foreground">Ready to Begin</p>
          )}
        </div>

        {/* Instructions or Stats */}
        <div className="text-center space-y-2 max-w-md">
          {!isActive ? (
            <>
              <h3 className="text-xl font-semibold text-foreground">{config.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {config.description}
              </p>
            </>
          ) : (
            <div className="flex justify-center gap-8 text-sm">
              <div>
                <p className="text-muted-foreground">Time</p>
                <p className="text-xl font-semibold">
                  {Math.floor(currentSecond / 60)}:{(currentSecond % 60).toString().padStart(2, "0")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Cycles</p>
                <p className="text-xl font-semibold">{getCurrentCycle()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Progress</p>
                <p className="text-xl font-semibold">
                  {Math.round((currentSecond / config.totalDuration) * 100)}%
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
    </div>
  );
}
