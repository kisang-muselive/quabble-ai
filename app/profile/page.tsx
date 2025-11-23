"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const router = useRouter();
  const { authInfo, isAuthenticated, loadAuthFromStorage } = useAuthStore();

  useEffect(() => {
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  useEffect(() => {
    if (!isAuthenticated || !authInfo) {
      router.push("/");
    }
  }, [isAuthenticated, authInfo, router]);

  const handleBack = () => {
    router.push("/");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (!isAuthenticated || !authInfo) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-semibold">Quabble</h1>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Profile</h2>
            <p className="text-muted-foreground">Your account information</p>
          </div>

          <div className="space-y-6">
            {/* User Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Information</h3>
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Username</label>
                    <p className="text-base font-semibold">@{authInfo.username || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-base">{authInfo.email || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                    <p className="text-base">{authInfo.id || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <p className="text-base">{authInfo.number || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Profile Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile Details</h3>
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Avatar Type</label>
                    <p className="text-base">{authInfo.avatarType}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Timezone</label>
                    <p className="text-base">{authInfo.timezone || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Closeness</label>
                    <p className="text-base capitalize">{authInfo.closeness || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">User Type</label>
                    <p className="text-base capitalize">{authInfo.userType || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Activity Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Activity</h3>
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Hearts</label>
                    <p className="text-base">{authInfo.heart || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Total Hearts</label>
                    <p className="text-base">{authInfo.totalHeart || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Subscription & Status Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Subscription & Status</h3>
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Subscription Status</label>
                    <p className="text-base">
                      {authInfo.isSubscribe ? (
                        <span className="text-green-600 font-semibold">Active</span>
                      ) : (
                        <span className="text-muted-foreground">Not subscribed</span>
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                    <p className="text-base">
                      {authInfo.isExist ? (
                        <span className="text-green-600 font-semibold">Active</span>
                      ) : (
                        <span className="text-muted-foreground">Inactive</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Metadata Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Metadata</h3>
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">UUID</label>
                    <p className="text-base font-mono text-sm break-all">{authInfo.uuid || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Created At</label>
                    <p className="text-base">{formatDate(authInfo.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

