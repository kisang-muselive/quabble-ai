"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";

interface WatermelonTaichiExerciseProps {
  onComplete?: () => void;
}

export function WatermelonTaichiExercise({ onComplete }: WatermelonTaichiExerciseProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoComplete, setIsVideoComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleBegin = () => {
    setShowVideo(true);
  };

  const handleVideoEnd = () => {
    setIsVideoComplete(true);
  };

  const handleFinish = () => {
    onComplete?.();
  };

  // Reset state when component mounts
  useEffect(() => {
    setShowVideo(false);
    setIsVideoComplete(false);
  }, []);

  // Handle video playback
  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [showVideo]);

  if (showVideo) {
    return (
      <div className="relative h-full w-full bg-black">
        {/* Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onEnded={handleVideoEnd}
          playsInline
        >
          <source src="/workouts/watermelon-taichi/taichi-duck-video-720.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Close button */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Close exercise"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Completion overlay - shown when video ends */}
        {isVideoComplete && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-between bg-black/40 px-6 py-8">
            {/* Title and Subtitle at top */}
            <div className="flex flex-col items-center justify-center pt-8">
              <h2 className="text-4xl font-semibold mb-4 text-white">
                Awesome!
              </h2>
              <p className="text-base text-center text-white max-w-xs">
                Let's keep building our mind and body harmony!
              </p>
            </div>

            {/* Finish Button at bottom */}
            <div className="w-full max-w-[320px] pb-6">
              <Button
                onClick={handleFinish}
                size="lg"
                className="w-full rounded-full text-lg font-semibold py-6 bg-gray-800 hover:bg-gray-900 text-white shadow-lg cursor-pointer"
              >
                Finish Tai Chi
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Initial screen
  return (
    <div className="relative h-full flex flex-col bg-[#FAF9F3]">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/workouts/watermelon-taichi/watermelontaichi_bg.jpg)"
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Close button */}
      <button
        onClick={onComplete}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
        aria-label="Close exercise"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-8 pb-24">
        {/* Title */}
        <h2 className="text-4xl font-normal mb-4 text-gray-900">
          Watermelon Tai Chi
        </h2>
        {/* Description */}
        <p className="text-base mb-8 text-center text-gray-700 max-w-xs">
          Follow the gentle movements of the duck to boost your balance and focus, and feel the tranquility
        </p>

        {/* Center image */}
        <div className="relative w-[280px] h-[280px] mt-8 mb-12 flex items-center justify-center">
          <Image
            src="/workouts/watermelon-taichi/watermelontaichi.png"
            alt="Watermelon Tai Chi"
            width={280}
            height={280}
            className="object-contain"
          />
        </div>

        {/* Learn Tai Chi Button */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex justify-center">
          <Button
            onClick={handleBegin}
            size="lg"
            className="w-full max-w-[320px] rounded-full text-lg font-semibold py-6 bg-gray-800 hover:bg-gray-900 text-white shadow-lg cursor-pointer"
          >
            Learn Tai Chi
          </Button>
        </div>
      </div>
    </div>
  );
}

