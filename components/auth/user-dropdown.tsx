"use client";

import { useRouter } from "next/navigation";
import { X, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";

interface UserDropdownProps {
  onClose: () => void;
}

export function UserDropdown({ onClose }: UserDropdownProps) {
  const router = useRouter();
  const { authInfo, clearAuthInfo } = useAuthStore();

  const handleProfile = () => {
    onClose();
    router.push("/profile");
  };

  const handleLogout = () => {
    clearAuthInfo();
    onClose();
    router.push("/");
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-lg p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Account</p>
          {authInfo?.username && (
            <p className="text-xs text-muted-foreground mt-1">@{authInfo.username}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1">
        <button
          onClick={handleProfile}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors text-left"
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors text-left"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
