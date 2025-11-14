"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import Image from "next/image";

interface AppOnlyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseId?: string;
  title?: string;
  description?: string;
}

// Map exercise IDs to card image paths
const getCardImagePath = (exerciseId: string): string | null => {
  const cardMap: Record<string, string> = {
    "bamboo-forest": "/cards/workout_bamboo-forest-N-mcIxnx.png",
    "self-compassion": "/cards/workout_dear-self-mhNbGeJC.avif",
    "mood-tracker": "/cards/workout_mood-diary-QXMpAtVS.avif",
    "gratitude": "/cards/workout_gratitude-jar-Dq9qFQnx.avif",
    "meditation": "/cards/workout_mindful-meditation-CIeadvMj.avif",
    "proud-dandelion": "/cards/workout_proud-dandelion-DC5KWuXh.png",
    "mindful-eating": "/cards/workout_mindful-eating-myRmkkU5.png",
    "moonlight": "/cards/workout_moonlight-EMfTmwj6.avif",
    "thank-you": "/cards/workout_thank-you-Dk937mN6.avif",
    "visualization": "/cards/workout_safe-place-CiTGwIKO.avif",
    "walking-meditation": "/cards/workout_outdoor-walk-CpUdl6dh.avif",
    "future-self": "/cards/workout_smart-goals-CsKNCryL.png",
    "worry-time": "/cards/workout_worry-box-BZAt6_Fl.avif",
    "treasure-box": "/cards/workout_treasure-box-DheQDuiV.avif",
  };
  return cardMap[exerciseId] || null;
};

export function AppOnlyModal({
  open,
  onOpenChange,
  exerciseId,
  title,
  description,
}: AppOnlyModalProps) {
  const cardImagePath = exerciseId ? getCardImagePath(exerciseId) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[85vh] max-h-[700px] p-0 overflow-hidden border-0 rounded-lg sm:rounded-lg" showCloseButton={false}>
        <div className="relative h-full flex flex-col bg-white">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-8 pb-24">
            {/* Card Image */}
            {cardImagePath && (
              <div className="relative w-full max-w-[320px] mb-6 flex items-center justify-center">
                <Image
                  src={cardImagePath}
                  alt={title || "Workout"}
                  width={320}
                  height={320}
                  className="object-contain rounded-lg"
                />
              </div>
            )}

            {/* Title */}
            {title && (
              <h2 className="text-3xl font-normal mb-2 text-gray-900 text-center">
                {title}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p className="text-base mb-8 text-center text-gray-600">
                {description}
              </p>
            )}
          </div>

          {/* iOS and Android Buttons - Fixed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10">
            <div className="flex flex-row items-center justify-center gap-0.5 w-full max-w-[320px] mx-auto">
              <a
                href="https://apps.apple.com/us/app/quabble-daily-mental-health/id6445948886"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity flex-1"
              >
                <img
                  src="/appstore.png"
                  alt="Download on the App Store"
                  className="h-10 w-auto object-contain mx-auto"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.museLIVE.quabbleapp&hl=en_US"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity flex-1"
              >
                <img
                  src="/google.png"
                  alt="Get it on Google Play"
                  className="h-10 w-auto object-contain mx-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

