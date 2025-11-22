"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import api, { ApiError, CustomApiErrorType, setAccessToken } from "@/lib/api";
import { API_ROUTE, STORAGE_KEY } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    router.push("/");
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && email && password) {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Get user's timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Try password signin endpoint
      const { data } = await api.post(API_ROUTE.PW_SIGNIN, {
        email: email,
        password: password,
        identifier: "quabble:mobile",
        timezone: timezone,
      });

      console.log("Login success:", data);

      // Store auth info
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
      }

      if (data?.refreshToken && typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY.REFRESH_TOKEN, data.refreshToken);
      }

      if (data?.email && typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY.EMAIL, data.email);
      }

      // Redirect to main page on success
      router.push("/");
    } catch (err) {
      const { response } = err as ApiError<CustomApiErrorType>;
      console.error("Login failed:", response);

      switch (response?.status) {
        case 400:
          setErrorMessage("Invalid email or password");
          break;
        case 401:
          setErrorMessage("Invalid email or password");
          break;
        case 404:
          setErrorMessage("Email not found. Please sign up first.");
          break;
        case 403:
          setErrorMessage("You haven't been verified yet. Please check your email.");
          break;
        case 500:
          setErrorMessage("System error. Please try again.");
          break;
        default:
          setErrorMessage("Failed to login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    alert("Forgot password feature coming soon. Please contact quabble@muse.live for assistance.");
  };

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
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground">Log in to your Quabble account</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
                onKeyUp={handleKeyUp}
                autoFocus
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <button
                  onClick={handleForgotPassword}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                onKeyUp={handleKeyUp}
                className="h-12"
              />
            </div>

            {errorMessage && (
              <div className="text-sm text-destructive text-center bg-destructive/10 p-3 rounded-md">
                {errorMessage}
              </div>
            )}

            <Button
              onClick={handleLogin}
              disabled={!email || !password || isLoading}
              className="w-full h-12 text-base font-semibold"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>

            <div className="text-center">
              <button
                onClick={() => router.push("/signup")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Don&apos;t have an account?{" "}
                <span className="font-semibold underline">Sign up</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
