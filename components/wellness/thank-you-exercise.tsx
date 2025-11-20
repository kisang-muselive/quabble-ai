"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft } from "lucide-react";
import Image from "next/image";

interface ThankYouExerciseProps {
  onComplete?: () => void;
}

type ScreenType = "onboarding" | "main" | "toFrom" | "message" | "cardSelection" | "cardView";

export function ThankYouExercise({
  onComplete
}: ThankYouExerciseProps) {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("onboarding");
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [noteCount, setNoteCount] = useState(1); // Track number of notes written

  const handleStartWriting = () => {
    setCurrentScreen("toFrom");
  };

  const handleToFromNext = () => {
    if (toName.trim() && fromName.trim()) {
      setCurrentScreen("message");
    }
  };

  const handleMessageNext = () => {
    if (message.trim()) {
      setCurrentScreen("cardSelection");
    }
  };

  const handleCardSelect = (index: number) => {
    setSelectedCardIndex(index);
    setCurrentScreen("cardView");
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share card");
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    setCurrentScreen("main");
    setToName("");
    setFromName("");
    setMessage("");
    setSelectedCardIndex(0);
  };

  const handleBack = () => {
    if (currentScreen === "toFrom") {
      setCurrentScreen("main");
    } else if (currentScreen === "message") {
      setCurrentScreen("toFrom");
    } else if (currentScreen === "cardSelection") {
      setCurrentScreen("message");
    } else if (currentScreen === "cardView") {
      setCurrentScreen("cardSelection");
    }
  };

  // Onboarding Screen
  if (currentScreen === "onboarding") {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[#FAF9F3] relative">
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Close exercise"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 pb-24">
          <div className="relative w-[280px] h-[280px] mb-8 flex items-center justify-center">
            <Image
              src="/workouts/thankyou/thankyou_onboarding.svg"
              alt="Thank You Onboarding"
              width={280}
              height={280}
              className="object-contain"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex justify-center">
          <Button
            onClick={() => setCurrentScreen("main")}
            size="lg"
            className="w-full max-w-[320px] rounded-full text-lg font-semibold py-6 bg-black hover:bg-gray-900 text-white shadow-lg cursor-pointer"
          >
            Begin
          </Button>
        </div>
      </div>
    );
  }

  // Main Screen
  if (currentScreen === "main") {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[#FAF9F3] relative">
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Close exercise"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 pb-24">
          {/* Title */}
          <h2 className="text-4xl font-normal mb-4 text-gray-900 text-center">
            Thank You
          </h2>

          {/* Description */}
          <p className="text-base mb-8 text-center text-gray-700 max-w-xs">
            Write a thank you note to someone special to you.
            <br />
            Let&apos;s bring out our unspoken appreciations,
            <br />
            and spread joy and gratitude!
          </p>

          {/* Bird with letter illustration */}
          <div className="relative w-[280px] h-[280px] mb-8 flex items-center justify-center">
            <Image
              src="/workouts/thankyou/thankyou_bird_letter.svg"
              alt="Thank You Bird"
              width={280}
              height={280}
              className="object-contain"
            />
          </div>

          {/* Letters illustration */}
          <div className="relative w-[200px] h-[100px] mb-6 flex items-center justify-center">
            <Image
              src="/workouts/thankyou/letters.svg"
              alt="Letters"
              width={200}
              height={100}
              className="object-contain"
            />
          </div>

          {/* Note count */}
          <div className="flex items-center gap-2 mb-8">
            <Image
              src="/workouts/thankyou/list_icon.svg"
              alt="List"
              width={20}
              height={20}
              className="object-contain"
            />
            <p className="text-sm text-gray-600">
              {noteCount} thank you note{noteCount !== 1 ? "s" : ""} I wrote
            </p>
          </div>
        </div>

        {/* Start Writing Button */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex justify-center">
          <Button
            onClick={handleStartWriting}
            size="lg"
            className="w-full max-w-[320px] rounded-full text-lg font-semibold py-6 bg-black hover:bg-gray-900 text-white shadow-lg cursor-pointer"
          >
            Start Writing
          </Button>
        </div>
      </div>
    );
  }

  // To/From Input Screen
  if (currentScreen === "toFrom") {
    return (
      <div
        className="flex flex-col items-center justify-center h-full w-full relative"
        style={{
          backgroundImage: "url(/workouts/thankyou/thankyou_watermark.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#FAF9F3]/90" />

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

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-8 w-full max-w-md">
          <h2 className="text-2xl font-normal mb-8 text-gray-900 text-center">
            Who do you want to express your appreciation to?
          </h2>

          {/* To input */}
          <div className="w-full mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">to</span>
              </div>
              <input
                type="text"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                placeholder="Name"
                className="flex-1 px-4 py-3 text-lg border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-gray-600 text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* From input */}
          <div className="w-full mb-8">
            <div className="flex items-center gap-3">
              <div className="w-24 h-12 rounded-lg bg-gray-400 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">from</span>
              </div>
              <input
                type="text"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Your name"
                className="flex-1 px-4 py-3 text-lg border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-gray-600 text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Hummingbird illustration */}
          <div className="relative w-[120px] h-[120px] flex items-center justify-center">
            <Image
              src="/workouts/thankyou/thankyou_bird.svg"
              alt="Hummingbird"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
        </div>

        {/* Next Button */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex justify-center">
          <Button
            onClick={handleToFromNext}
            disabled={!toName.trim() || !fromName.trim()}
            size="lg"
            className={`w-full max-w-[320px] rounded-full text-lg font-semibold py-6 shadow-lg ${
              toName.trim() && fromName.trim()
                ? "bg-gray-700 hover:bg-gray-800 text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  // Message Input Screen
  if (currentScreen === "message") {
    return (
      <div
        className="flex flex-col items-center justify-center h-full w-full relative"
        style={{
          backgroundImage: "url(/workouts/thankyou/thankyou_watermark.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#FAF9F3]/90" />

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
          <h2 className="text-lg font-normal mb-6 text-gray-900">
            Write down a message expressing your gratitude.
          </h2>

          {/* Text area */}
          <div className="w-full mb-4 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hard to think of any?"
              className="w-full h-[300px] px-4 py-3 text-base border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-gray-600 text-gray-900 placeholder:text-gray-400 resize-none"
              maxLength={250}
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-400">
              {message.length}/250
            </div>
          </div>

          {/* Hummingbird illustration */}
          <div className="relative w-[100px] h-[100px] flex items-center justify-center self-end">
            <Image
              src="/workouts/thankyou/thankyou_bird.svg"
              alt="Hummingbird"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>

        {/* Next Button */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex justify-center">
          <Button
            onClick={handleMessageNext}
            disabled={!message.trim()}
            size="lg"
            className={`w-full max-w-[320px] rounded-full text-lg font-semibold py-6 shadow-lg ${
              message.trim()
                ? "bg-gray-700 hover:bg-gray-800 text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  // Card Selection Screen
  if (currentScreen === "cardSelection") {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[#FAF9F3] relative">
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
          <h2 className="text-xl font-normal mb-8 text-gray-900 text-center">
            Choose the style of the card
          </h2>

          {/* Card preview */}
          <div className="relative w-full max-w-sm mb-6">
            <div className="relative aspect-[4/3] bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src={`/workouts/thankyou/thankyou_card${selectedCardIndex + 1}@3x.png`}
                alt={`Card ${selectedCardIndex + 1}`}
                fill
                className="object-contain"
              />
              {/* Overlay text */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80">
                <div className="flex justify-between items-end text-sm">
                  <span className="text-gray-700">to. {toName}</span>
                  <span className="text-gray-700">{message || "Hello"}</span>
                  <span className="text-gray-700">from. {fromName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card selection dots */}
          <div className="flex gap-2 mb-8">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setSelectedCardIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedCardIndex === index ? "bg-gray-800" : "bg-gray-300"
                }`}
                aria-label={`Select card ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Send Button */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10 flex justify-center">
          <Button
            onClick={() => handleCardSelect(selectedCardIndex)}
            size="lg"
            className="w-full max-w-[320px] rounded-full text-lg font-semibold py-6 bg-black hover:bg-gray-900 text-white shadow-lg cursor-pointer"
          >
            Send
          </Button>
        </div>
      </div>
    );
  }

  // Card View Screen
  if (currentScreen === "cardView") {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[#FAF9F3] relative">
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Close exercise"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-8 pb-24">
          {/* Card display */}
          <div className="relative w-full max-w-sm mb-8">
            <div className="relative aspect-[4/3] bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src={`/workouts/thankyou/thankyou_card${selectedCardIndex + 1}@3x.png`}
                alt={`Card ${selectedCardIndex + 1}`}
                fill
                className="object-contain"
              />
              {/* Overlay text */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80">
                <div className="flex justify-between items-end text-sm">
                  <span className="text-gray-700">to. {toName}</span>
                  <span className="text-gray-700">{message || "Hello"}</span>
                  <span className="text-gray-700">from. {fromName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Share"
            >
              <Image
                src="/workouts/thankyou/share_icon_2.svg"
                alt="Share"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-sm text-gray-700">Share</span>
            </button>

            <button
              onClick={handleDelete}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Delete"
            >
              <Image
                src="/workouts/thankyou/trashcan_icon_warmgray015.svg"
                alt="Delete"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-sm text-gray-700">Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

