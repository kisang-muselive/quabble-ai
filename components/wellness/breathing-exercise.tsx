"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Lottie from "lottie-react";
import Image from "next/image";

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
  phaseDurations: number[]; // duration in seconds for each phase
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
    totalDuration: 48,
    totalCycles: 3,
    breatheStatus: ["INHALE", "HOLD", "EXHALE", "HOLD"],
    phaseDurations: [4, 4, 4, 4],
    cycleDuration: 16,
    tickMarks: [5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45],
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
    audioCountdown: "/workouts/breeding_count.mp3",
    totalDuration: 57,
    totalCycles: 3,
    breatheStatus: ["INHALE", "HOLD", "EXHALE"],
    phaseDurations: [4, 7, 8],
    cycleDuration: 19,
    tickMarks: [5, 12, 20, 24, 31, 39, 43, 50],
    getPhaseAtSecond: (second: number) => {
      const cyclePosition = second % 19;
      if (cyclePosition < 4) return 0; // INHALE
      if (cyclePosition < 11) return 1; // HOLD (4-11 = 7 seconds)
      return 2; // EXHALE (11-19 = 8 seconds)
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
    totalDuration: 45,
    totalCycles: 3,
    breatheStatus: ["INHALE", "HOLD", "EXHALE"],
    phaseDurations: [5, 5, 5],
    cycleDuration: 15,
    tickMarks: [6, 11, 16, 21, 26, 31, 36, 41],
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
  const [readyDots, setReadyDots] = useState([false, false, false]);
  const [isCompleted, setIsCompleted] = useState(false);
  const startTimeRef = useRef<number>(0);

  // Audio refs
  const audioGuideRef = useRef<HTMLAudioElement | null>(null);
  const audioCountdownRef = useRef<HTMLAudioElement | null>(null);

  // Lottie animation refs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gaugeLottieRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const duckLottieRef = useRef<any>(null);
  const [gaugeTotalFrames, setGaugeTotalFrames] = useState<number>(0);
  const currentFrameRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const targetFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

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

  // Auto-start countdown when component mounts
  useEffect(() => {
    // Start countdown automatically when component mounts
    setIsCountingDown(true);
  }, []);

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
      // Set start time for smooth animation progress tracking
      startTimeRef.current = performance.now();

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
      // Exercise complete - show completion screen
      setBreathingStarted(false);
      setIsCompleted(true);
      audioGuideRef.current?.pause();
      return;
    }

    const timer = setInterval(() => {
      setCurrentSecond((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [breathingStarted, currentSecond, config.totalDuration, onComplete]);

  // Update gauge and duck animations to match breathing phases
  useEffect(() => {
    if (!gaugeLottieRef.current || gaugeTotalFrames === 0) return;

    if (!breathingStarted) {
      // Reset to frame 0 when exercise hasn't started
      currentFrameRef.current = 0;
      targetFrameRef.current = 0;
      lastTimeRef.current = 0;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      const gaugeAnimation = gaugeLottieRef.current;
      if (gaugeAnimation.stop) gaugeAnimation.stop();
      if (gaugeAnimation.goToAndStop) {
        gaugeAnimation.goToAndStop(0, true);
      }
      // Reset duck animation
      if (duckLottieRef.current) {
        const duckAnimation = duckLottieRef.current;
        if (duckAnimation.stop) duckAnimation.stop();
        if (duckAnimation.setSpeed) duckAnimation.setSpeed(1);
      }
      return;
    }

    // Use requestAnimationFrame for smooth 60fps updates with phase-based progress
    const animateProgress = (currentTime: number) => {
      if (!gaugeLottieRef.current || !breathingStarted || !startTimeRef.current) {
        animationFrameRef.current = null;
        return;
      }

      // Calculate real-time elapsed milliseconds since breathing started
      const elapsedMs = currentTime - startTimeRef.current;
      const elapsedSeconds = elapsedMs / 1000;

      // Check if exercise is complete
      if (elapsedSeconds >= config.totalDuration) {
        // Set to final frame
        const finalFrame = gaugeTotalFrames - 1;
        currentFrameRef.current = finalFrame;
        const gaugeAnimation = gaugeLottieRef.current;
        if (gaugeAnimation.goToAndStop) {
          gaugeAnimation.goToAndStop(finalFrame, true);
        }
        animationFrameRef.current = null;
        return;
      }

      // Calculate progress based on breathing phases
      let progress = 0;
      
      if (exerciseType === "box") {
        // Box breathing: each 4-second phase should complete 25% of the circle
        // Phase 0 (INHALE 0-4s): 0-25%
        // Phase 1 (HOLD 4-8s): 25-50%
        // Phase 2 (EXHALE 8-12s): 50-75%
        // Phase 3 (HOLD 12-16s): 75-100%
        // Then repeats for next cycle
        
        const cyclePosition = elapsedSeconds % config.cycleDuration; // 0-16 seconds within current cycle
        const phaseIndex = config.getPhaseAtSecond(Math.floor(elapsedSeconds));
        const phasePosition = cyclePosition % 4; // Position within current 4-second phase (0-4)
        
        // Each phase moves 25% of the circle
        // Base progress from phase index (0, 0.25, 0.5, 0.75)
        const phaseBaseProgress = phaseIndex / 4;
        // Progress within the current phase (0-1, scaled to 25% of circle)
        const phaseTimeProgress = phasePosition / 4;
        
        // Total progress: phase base + phase time progress
        // This makes each phase complete 25% of the circle
        progress = (phaseBaseProgress + phaseTimeProgress / 4);
        
        // Keep progress between 0 and 1 (it will naturally wrap due to modulo)
        progress = progress % 1;
      } else if (exerciseType === "478") {
        // 4-7-8 breathing: phase-based progress
        // Phase 0 (INHALE 0-4s): 0-21.05% (4/19)
        // Phase 1 (HOLD 4-11s): 21.05%-57.89% (7/19)
        // Phase 2 (EXHALE 11-19s): 57.89%-100% (8/19)
        
        const cyclePosition = elapsedSeconds % config.cycleDuration; // 0-19 seconds within current cycle
        
        // Determine phase based on continuous time (not floored)
        let phaseIndex: number;
        let phaseStartTime: number;
        let phaseDuration: number;
        
        if (cyclePosition < 4) {
          // INHALE: 0-4s
          phaseIndex = 0;
          phaseStartTime = 0;
          phaseDuration = 4;
        } else if (cyclePosition < 11) {
          // HOLD: 4-11s
          phaseIndex = 1;
          phaseStartTime = 4;
          phaseDuration = 7;
        } else {
          // EXHALE: 11-19s
          phaseIndex = 2;
          phaseStartTime = 11;
          phaseDuration = 8;
        }
        
        // Calculate base progress (sum of previous phases)
        const phaseDurations = [4, 7, 8];
        const totalCycleDuration = 19;
        let phaseBaseProgress = 0;
        for (let i = 0; i < phaseIndex; i++) {
          phaseBaseProgress += phaseDurations[i] / totalCycleDuration;
        }
        
        // Calculate progress within current phase (0 to 1)
        const timeInPhase = cyclePosition - phaseStartTime;
        const phaseTimeProgress = Math.max(0, Math.min(timeInPhase, phaseDuration)) / phaseDuration;
        
        // Total progress: base + (current phase progress * phase duration ratio)
        progress = phaseBaseProgress + (phaseTimeProgress * phaseDuration / totalCycleDuration);
        
        // Keep progress between 0 and 1
        progress = progress % 1;
      } else if (exerciseType === "555") {
        // 5-5-5 breathing: phase-based progress
        // Phase 0 (INHALE 0-5s): 0-33.33% (5/15)
        // Phase 1 (HOLD 5-10s): 33.33%-66.67% (5/15)
        // Phase 2 (EXHALE 10-15s): 66.67%-100% (5/15)

        const cyclePosition = elapsedSeconds % config.cycleDuration; // 0-15 seconds within current cycle

        // Determine phase based on continuous time
        let phaseIndex: number;
        let phaseStartTime: number;
        let phaseDuration: number;

        if (cyclePosition < 5) {
          // INHALE: 0-5s
          phaseIndex = 0;
          phaseStartTime = 0;
          phaseDuration = 5;
        } else if (cyclePosition < 10) {
          // HOLD: 5-10s
          phaseIndex = 1;
          phaseStartTime = 5;
          phaseDuration = 5;
        } else {
          // EXHALE: 10-15s
          phaseIndex = 2;
          phaseStartTime = 10;
          phaseDuration = 5;
        }

        // Calculate base progress (sum of previous phases)
        const phaseDurations = [5, 5, 5];
        const totalCycleDuration = 15;
        let phaseBaseProgress = 0;
        for (let i = 0; i < phaseIndex; i++) {
          phaseBaseProgress += phaseDurations[i] / totalCycleDuration;
        }

        // Calculate progress within current phase (0 to 1)
        const timeInPhase = cyclePosition - phaseStartTime;
        const phaseTimeProgress = Math.max(0, Math.min(timeInPhase, phaseDuration)) / phaseDuration;

        // Total progress: base + (current phase progress * phase duration ratio)
        progress = phaseBaseProgress + (phaseTimeProgress * phaseDuration / totalCycleDuration);

        // Keep progress between 0 and 1
        progress = progress % 1;
      } else {
        // For other breathing types, use linear progress
        progress = elapsedSeconds / config.totalDuration;
      }

      const targetFrame = Math.min(progress * gaugeTotalFrames, gaugeTotalFrames - 1);
      currentFrameRef.current = targetFrame;

      // Update gauge animation
      const gaugeAnimation = gaugeLottieRef.current;
      if (gaugeAnimation.goToAndStop) {
        gaugeAnimation.goToAndStop(targetFrame, true);
      }

      // Control duck animation - restart at each cycle and keep it playing
      if (duckLottieRef.current) {
        const duckAnimation = duckLottieRef.current;

        // Get current cycle
        const currentCycle = Math.floor(elapsedSeconds / config.cycleDuration);

        // Store the last cycle we were on (using a custom property)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (duckAnimation as any)._lastCycle === 'undefined') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (duckAnimation as any)._lastCycle = currentCycle;
        }

        // If we're in a new cycle, restart the duck animation
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (currentCycle !== (duckAnimation as any)._lastCycle) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (duckAnimation as any)._lastCycle = currentCycle;
          if (duckAnimation.goToAndPlay) {
            duckAnimation.goToAndPlay(0, true);
          }
        }

        // Ensure duck animation is playing
        if (duckAnimation.isPaused && duckAnimation.play) {
          duckAnimation.play();
        } else if (!duckAnimation.isPaused && duckAnimation.play) {
          // Make sure it's playing
          duckAnimation.play();
        }
      }

      // Continue animating at 60fps
      animationFrameRef.current = requestAnimationFrame(animateProgress);
    };

    // Start animation if not already running
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animateProgress);
    }

    // Cleanup on unmount or when breathing stops
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [breathingStarted, config.totalDuration, config.totalCycles, config.cycleDuration, gaugeTotalFrames, exerciseType, config]);

  const handleRestart = () => {
    setIsCompleted(false);
    setCountdownPhase(3);
    setReadyDots([false, false, false]);
    setCurrentSecond(0);
    setIsCountingDown(true);
    setAnimate(true);
    startTimeRef.current = 0;
    currentFrameRef.current = 0;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (gaugeLottieRef.current && gaugeLottieRef.current.goToAndStop) {
      gaugeLottieRef.current.goToAndStop(0, true);
    }
  };

  // Get current phase and cycle
  const getCurrentPhaseIndex = () => {
    if (!breathingStarted) return 0;
    return config.getPhaseAtSecond(currentSecond);
  };

  const getCurrentCycle = () => {
    if (!breathingStarted) return 1;
    return Math.floor(currentSecond / config.cycleDuration) + 1;
  };

  const getCurrentPhaseText = () => {
    const phaseIdx = getCurrentPhaseIndex();
    return config.breatheStatus[phaseIdx];
  };

  const isActive = isCountingDown || breathingStarted;

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full space-y-6 py-6 px-4 relative"
      style={{
        backgroundImage: `url(${config.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Semi-transparent overlay - full coverage */}
      <div className="absolute inset-0 bg-white/70 w-full h-full" />

      {/* Close button */}
      <button
        onClick={onComplete}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Close exercise"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Completion Screen */}
      {isCompleted ? (
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
          <h2 className="text-4xl font-bold text-foreground mb-2">Well done</h2>
          <p className="text-lg text-muted-foreground mb-8">Wishing you a perfect day!</p>

          <div className="mb-8">
            <Image
              src="/workouts/breathing/breathing_duck.svg"
              alt="Duck"
              width={223}
              height={176}
            />
          </div>

          <Button
            onClick={handleRestart}
            size="lg"
            className="min-w-[200px] bg-primary hover:bg-primary/90"
          >
            Start again
          </Button>
        </div>
      ) : (
        /* Exercise Content */
        <div className="relative z-10 flex flex-col items-center h-full w-full pt-4">
        {/* Phase Instruction - White, smaller, less spacing */}
        <div className="text-center h-[32px] flex flex-col justify-center items-center mb-2">
          {isCountingDown && (
            <div className="flex justify-center gap-2 h-[32px] items-center">
              {readyDots.map((active, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0.3 }}
                  animate={{
                    scale: active ? 1.2 : 0.8,
                    opacity: active ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-4 h-4 rounded-full bg-white"
                  style={{
                    opacity: active ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
          )}

          {breathingStarted && (
            <motion.p
              key={getCurrentPhaseText()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-semibold text-white h-[32px] flex items-center"
            >
              {getCurrentPhaseText()}
            </motion.p>
          )}

          {!isActive && (
            <p className="text-2xl font-semibold text-white h-[32px] flex items-center">Ready to Begin</p>
          )}
        </div>

        {/* Lottie Animations Container */}
        <div className="relative flex items-center justify-center w-[375px] h-[375px]">
          {/* Semi-transparent white circle background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[269px] h-[269px] rounded-full bg-white/30" />
          </div>

          {/* Duck Animation - Clipped to circular background */}
          {duckAnimationData && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[269px] h-[269px] rounded-full overflow-hidden">
                <Lottie
                  lottieRef={duckLottieRef}
                  animationData={duckAnimationData}
                  loop={true}
                  autoplay={breathingStarted}
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
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        {/* Sets indicator - Below circular progress */}
        {(isCountingDown || breathingStarted) && (
          <div className="text-center mb-1">
            <p className="text-lg font-semibold" style={{ color: "#46728C" }}>
              {breathingStarted ? `${getCurrentCycle()}/${config.totalCycles}` : `0/${config.totalCycles}`}
            </p>
          </div>
        )}

        {/* Exercise name */}
        {(isCountingDown || breathingStarted) && (
          <div className="text-center mb-6">
            <p className="text-xl font-semibold" style={{ color: "#46728C" }}>
              {exerciseType === "box" ? "Box breathing" : config.name}
            </p>
          </div>
        )}

        {/* Phase information columns - For all breathing exercises */}
        {(isCountingDown || breathingStarted) && (
          <div className="flex justify-center gap-4 w-full max-w-md px-4">
            {config.breatheStatus.map((phase, index) => {
              // Get duration for each phase using phaseDurations
              const duration = `${config.phaseDurations[index]}s`;

              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <p className="text-lg font-semibold mb-1" style={{ color: "#46728C" }}>{duration}</p>
                  <p className="text-sm capitalize" style={{ color: "#46728C" }}>{phase.toLowerCase()}</p>
                </div>
              );
            })}
          </div>
        )}
        </div>
      )}
    </div>
  );
}
