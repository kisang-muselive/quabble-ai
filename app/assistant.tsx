"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
import { Separator } from "@/components/ui/separator";
import { WellnessProvider, useWellness } from "@/components/wellness/wellness-provider";
import { WellnessModal } from "@/components/wellness/wellness-modal";
import { RoutineCheckinModal } from "@/components/wellness/routine-checkin-modal";
import { AppOnlyModal } from "@/components/wellness/app-only-modal";
import { Button } from "@/components/ui/button";
import { ClipboardCheck } from "lucide-react";

const AssistantContent = () => {
  const {
    isWellnessModalOpen,
    currentExerciseId,
    closeWellnessModal,
    openWellnessModal,
    isRoutineCheckinModalOpen,
    openRoutineCheckinModal,
    closeRoutineCheckinModal,
    isAppOnlyModalOpen,
    appOnlyExerciseId,
    appOnlyTitle,
    appOnlyDescription,
    closeAppOnlyModal,
  } = useWellness();

  const handleBreathingExercise = () => {
    openWellnessModal("breathing");
  };

  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <div className="flex h-dvh w-full pr-0.5">
          <ThreadListSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              {/* Original left sidebar toggle - commented out */}
              {/* <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-4" />
              </div> */}

              {/* Center - Quabble text only (without icon) */}
              <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                {/* <Image
                  src="/quabble-duck.png"
                  alt="Quabble"
                  width={32}
                  height={32}
                  priority
                  className="rounded-lg"
                /> */}
                <span className="text-2xl font-semibold">Quabble</span>
              </div>

              {/* Right side - iOS and Android download badges */}
              <div className="ml-auto flex items-center gap-3">
                <a
                  href="https://apps.apple.com/us/app/quabble-daily-mental-health/id6445948886"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block hover:opacity-80 transition-opacity h-8"
                >
                  <img
                    src="/appstore.png"
                    alt="Download on the App Store"
                    className="h-8 w-auto object-contain"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.museLIVE.quabbleapp&hl=en_US"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block hover:opacity-80 transition-opacity h-8"
                >
                  <img
                    src="/google.png"
                    alt="Get it on Google Play"
                    className="h-8 w-auto object-contain"
                  />
                </a>
              </div>

              {/* Original Routine Check-in button - commented out */}
              {/* <div className="ml-auto">
                <Button
                  onClick={openRoutineCheckinModal}
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Routine Check-in
                </Button>
              </div> */}
            </header>
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <RoutineCheckinModal
        open={isRoutineCheckinModalOpen}
        onOpenChange={closeRoutineCheckinModal}
        onBreathingExerciseClick={handleBreathingExercise}
      />
      <WellnessModal
        open={isWellnessModalOpen}
        onOpenChange={closeWellnessModal}
        exerciseId={currentExerciseId}
      />
      <AppOnlyModal
        open={isAppOnlyModalOpen}
        onOpenChange={closeAppOnlyModal}
        exerciseId={appOnlyExerciseId}
        title={appOnlyTitle}
        description={appOnlyDescription}
      />
    </>
  );
};

export const Assistant = () => {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <WellnessProvider>
        <AssistantContent />
      </WellnessProvider>
    </AssistantRuntimeProvider>
  );
};
