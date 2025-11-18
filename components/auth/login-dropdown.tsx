"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LoginDropdownProps {
  onClose: () => void;
}

export function LoginDropdown({ onClose }: LoginDropdownProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  const handleSignup = () => {
    onClose();
    router.push("/signup");
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-lg p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Log in to Quabble</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSignup}
          variant="outline"
          size="sm"
          className="flex-1 font-semibold"
        >
          Sign up
        </Button>
        <Button
          onClick={handleLogin}
          size="sm"
          className="flex-1 font-semibold bg-muted text-foreground hover:bg-muted/80"
        >
          Log in
        </Button>
      </div>
    </div>
  );
}
