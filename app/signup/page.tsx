"use client";

import { useState, KeyboardEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

const PASSWORD_POLICY_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pwErrorMessage, setPwErrorMessage] = useState("");
  const [confirmPwErrorMessage, setConfirmPwErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    router.push("/");
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && isFormValid) {
      handleSignup();
    }
  };

  const validatePassword = (pwd: string) => {
    if (pwd.length > 0 && pwd.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (pwd.length >= 8 && !PASSWORD_POLICY_REGEX.test(pwd)) {
      return "Password must contain letters, numbers, and special characters";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPwd: string) => {
    if (confirmPwd.length > 0 && confirmPwd !== password) {
      return "Passwords do not match";
    }
    return "";
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPwErrorMessage(validatePassword(value));
    if (confirmPassword) {
      setConfirmPwErrorMessage(validateConfirmPassword(confirmPassword));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmPwErrorMessage(validateConfirmPassword(value));
  };

  const isFormValid = useMemo(() => {
    return (
      email &&
      password &&
      confirmPassword &&
      !pwErrorMessage &&
      !confirmPwErrorMessage &&
      password === confirmPassword
    );
  }, [email, password, confirmPassword, pwErrorMessage, confirmPwErrorMessage]);

  const handleSignup = async () => {
    if (!isFormValid) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // TODO: Implement actual signup API call
      // For now, this is a placeholder
      console.log("Signup attempt with:", { email, password });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // On success, redirect to main page
      router.push("/");
    } catch (error) {
      setErrorMessage("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            <h2 className="text-3xl font-bold">Create your account</h2>
            <p className="text-muted-foreground">Join Quabble and start your wellness journey</p>
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
                onChange={(e) => setEmail(e.target.value)}
                onKeyUp={handleKeyUp}
                autoFocus
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onKeyUp={handleKeyUp}
                className="h-12"
              />
              {pwErrorMessage && (
                <p className="text-xs text-destructive">{pwErrorMessage}</p>
              )}
              {!pwErrorMessage && password && (
                <p className="text-xs text-muted-foreground">
                  Must be 8+ characters with letters, numbers, and special characters
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                onKeyUp={handleKeyUp}
                className="h-12"
              />
              {confirmPwErrorMessage && (
                <p className="text-xs text-destructive">{confirmPwErrorMessage}</p>
              )}
            </div>

            {errorMessage && (
              <div className="text-sm text-destructive text-center">{errorMessage}</div>
            )}

            <Button
              onClick={handleSignup}
              disabled={!isFormValid || isLoading}
              className="w-full h-12 text-base font-semibold"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>

            <div className="text-center">
              <button
                onClick={() => router.push("/login")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Already have an account?{" "}
                <span className="font-semibold underline">Log in</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
