"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import api, { ApiError, CustomApiErrorType } from "@/lib/api";
import { API_ROUTE } from "@/lib/constants";

const ANDROID_PACKAGE = "com.museLIVE.quabbleapp";
const ANDROID_PLAY_URL = "https://play.google.com/store/apps/details?id=com.museLIVE.quabbleapp";
const IOS_APP_STORE_URL = "https://apps.apple.com/app/id6445948886";
const IOS_APP_SCHEME = "quabbleapp://";

function CongratsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const processToken = async () => {
      const token = searchParams.get("token");
      console.log("Congrats page - token:", token);

      if (!token) {
        console.error("No token provided");
        setErrorMessage("No verification token provided");
        setIsValidToken(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.post(API_ROUTE.EMAIL_SIGNUP_VERIFY, {
          token: token,
        });

        console.log("Verify success:", data);
        setIsValidToken(true);
        setErrorMessage("");
      } catch (err) {
        const { response } = err as ApiError<CustomApiErrorType>;
        console.error("Verify failed:", response);
        setIsValidToken(false);

        switch (response?.status) {
          case 400:
            setErrorMessage("Invalid verification token");
            break;
          case 500:
            setErrorMessage("System error. Please try again.");
            break;
          default:
            setErrorMessage("Failed to verify email. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    processToken();
  }, [searchParams]);

  const openQuabbleApp = () => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    if (isAndroid) {
      const intentUrl = `intent://open/#Intent;scheme=quabbleapp;package=${ANDROID_PACKAGE};S.browser_fallback_url=${encodeURIComponent(
        ANDROID_PLAY_URL
      )};end`;
      window.location.href = intentUrl;
      return;
    }

    if (isIOS) {
      const fallbackTimer = setTimeout(() => {
        window.location.href = IOS_APP_STORE_URL;
      }, 1200);

      const clearAll = () => {
        clearTimeout(fallbackTimer);
        document.removeEventListener("visibilitychange", handleVisibility);
        window.removeEventListener("pagehide", handlePageHide);
        window.removeEventListener("blur", handleBlur);
      };

      const handleVisibility = () => {
        if (document.hidden) {
          clearAll();
        }
      };
      const handlePageHide = () => {
        clearAll();
      };
      const handleBlur = () => {
        clearAll();
      };

      document.addEventListener("visibilitychange", handleVisibility);
      window.addEventListener("pagehide", handlePageHide);
      window.addEventListener("blur", handleBlur);

      window.location.href = IOS_APP_SCHEME;
      return;
    }

    // Desktop fallback
    window.location.href = "https://quabble.app/";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="text-center space-y-6">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
          <h2 className="text-2xl font-bold">Verifying your email...</h2>
          <p className="text-muted-foreground">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-6">
                <XCircle className="h-16 w-16 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Verification Failed</h2>
              <p className="text-muted-foreground">
                {errorMessage || "Invalid or expired verification link"}
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                The verification link may have expired or is invalid.
              </p>
              <p className="text-sm text-muted-foreground">
                Please try signing up again or contact support.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={() => router.push("/signup")}
                className="w-full h-12 text-base font-semibold"
              >
                Try signing up again
              </Button>
              <Button
                onClick={() => router.push("/login")}
                variant="outline"
                className="w-full h-12 text-base font-semibold"
              >
                Go to login
              </Button>
            </div>

            <div className="pt-8">
              <p className="text-xs text-muted-foreground">
                Need help? Contact us at{" "}
                <a
                  href="mailto:quabble@muse.live"
                  className="underline hover:text-foreground"
                >
                  quabble@muse.live
                </a>
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-muted-foreground">
          <p>&copy; 2024 Quabble. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-500/10 p-6">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Welcome to Quabble!</h2>
            <p className="text-muted-foreground">Your email has been verified successfully</p>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Your account is now active and ready to use.
            </p>
            <p className="text-sm text-muted-foreground">
              Please log in to continue your wellness journey.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              onClick={openQuabbleApp}
              className="w-full h-12 text-base font-semibold"
            >
              Open Quabble App
            </Button>
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="w-full h-12 text-base font-semibold"
            >
              Continue to login
            </Button>
          </div>

          <div className="pt-8">
            <p className="text-xs text-muted-foreground">
              Need help? Contact us at{" "}
              <a
                href="mailto:quabble@muse.live"
                className="underline hover:text-foreground"
              >
                quabble@muse.live
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground">
        <p>&copy; 2024 Quabble. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function CongratsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
          <div className="text-center space-y-6">
            <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
            <h2 className="text-2xl font-bold">Loading...</h2>
          </div>
        </div>
      }
    >
      <CongratsContent />
    </Suspense>
  );
}
