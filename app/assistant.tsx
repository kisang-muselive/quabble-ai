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
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Image from "next/image";

const AssistantContent = () => {
  const { isWellnessModalOpen, closeWellnessModal, openWellnessModal } = useWellness();

  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <div className="flex h-dvh w-full pr-0.5">
          <ThreadListSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-4" />
              </div>
              <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                <Image
                  src="/quabble-duck.png"
                  alt="Quabble"
                  width={32}
                  height={32}
                  priority
                  className="rounded-lg"
                />
                <span className="text-lg font-semibold">Quabble</span>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={openWellnessModal}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Wellness
                </Button>
              </div>
            </header>
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <WellnessModal
        open={isWellnessModalOpen}
        onOpenChange={closeWellnessModal}
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
