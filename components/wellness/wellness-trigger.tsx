"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface WellnessTriggerProps {
  onClick: () => void;
}

export function WellnessTrigger({ onClick }: WellnessTriggerProps) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <Sparkles className="h-5 w-5 text-primary" />
      <div className="flex-1">
        <p className="text-sm font-medium">Try a breathing exercise</p>
        <p className="text-xs text-muted-foreground">
          Take a moment to relax and calm your mind
        </p>
      </div>
      <Button onClick={onClick} size="sm" variant="default">
        Start
      </Button>
    </div>
  );
}
