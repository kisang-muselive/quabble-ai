"use client";

import { useState, KeyboardEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail } from "lucide-react";
import api, { ApiError, CustomApiErrorType } from "@/lib/api";
import { API_ROUTE, PASSWORD_POLICY_REGEX, CALLBACK_URL } from "@/lib/constants";
import { getTimezone } from "@/lib/utils/timezone";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pwErrorMessage, setPwErrorMessage] = useState("");
  const [confirmPwErrorMessage, setConfirmPwErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Rate limiting
  const MAX_ACTION_CLICKS = 5;
  const ACTION_WINDOW_MS = 60 * 1000;
  const COOLDOWN_MS = 60 * 1000;
  const [actionClicks, setActionClicks] = useState<number[]>([]);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const isRateLimited = cooldownUntil !== null && Date.now() < cooldownUntil;

  const rateLimitGuard = () => {
    const now = Date.now();
    if (cooldownUntil && now < cooldownUntil) {
      alert(`Too many attempts. Please wait ${Math.ceil((cooldownUntil - now) / 1000)} seconds.`);
      return false;
    }
    const recent = actionClicks.filter((t) => now - t < ACTION_WINDOW_MS);
    if (recent.length >= MAX_ACTION_CLICKS) {
      setCooldownUntil(now + COOLDOWN_MS);
      alert("Too many attempts. Please wait 1 minute.");
      return false;
    }
    setActionClicks([...recent, now]);
    return true;
  };

  const handleBack = () => {
    if (emailSent) {
      setEmailSent(false);
      setErrorMessage("");
    } else {
      router.push("/");
    }
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      email &&
      emailRegex.test(email) &&
      password &&
      confirmPassword &&
      !pwErrorMessage &&
      !confirmPwErrorMessage &&
      password === confirmPassword
    );
  }, [email, password, confirmPassword, pwErrorMessage, confirmPwErrorMessage]);

  const handleSignup = async () => {
    if (!isFormValid || !rateLimitGuard()) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return setErrorMessage("Please enter a valid email.");
    }

    if (password.length < 8) {
      return setPwErrorMessage("Password must be at least 8 characters");
    }

    if (!PASSWORD_POLICY_REGEX.test(password)) {
      return setPwErrorMessage("Use at least 8 characters with letters, numbers, and special characters.");
    }

    if (password !== confirmPassword) {
      return setConfirmPwErrorMessage("Passwords do not match");
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const { data } = await api.post(API_ROUTE.EMAIL_REGISTER_V2, {
        identifier: "quabble:web",
        email: email,
        password: password,
        callback: CALLBACK_URL,
        timezone: getTimezone(),
        configId: 0,
      });

      console.log("Signup success:", data);
      setPwErrorMessage("");
      setEmailSent(true);
    } catch (err) {
      const { response } = err as ApiError<CustomApiErrorType>;
      console.error("Signup failed:", response);

      switch (response?.status) {
        case 400:
          setErrorMessage("Email already registered.");
          break;
        case 500:
          setErrorMessage("System error. Please try again.");
          break;
        default:
          setErrorMessage("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!rateLimitGuard()) return;

    setIsLoading(true);

    try {
      const { data } = await api.post(API_ROUTE.EMAIL_REGISTER_V2, {
        identifier: "quabble:web",
        email: email,
        password: password,
        callback: CALLBACK_URL,
        timezone: getTimezone(),
        configId: 0,
      });

      console.log("Resend success:", data);
      alert("Verification email has been resent!");
    } catch (err) {
      const { response } = err as ApiError<CustomApiErrorType>;
      console.error("Resend failed:", response);

      switch (response?.status) {
        case 400:
          alert("Invalid email address");
          break;
        case 500:
          alert("System error. Please try again.");
          break;
        default:
          alert("Failed to resend email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
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

        {/* Main Content - Email Sent */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Check your email</h2>
              <p className="text-muted-foreground">
                We&apos;ve sent a verification link to
              </p>
              <p className="font-semibold text-foreground break-all">{email}</p>
            </div>

            <div className="flex justify-center py-8">
              <div className="rounded-full bg-primary/10 p-6">
                <Mail className="h-16 w-16 text-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the link in the email to complete your signup.
              </p>
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder.
              </p>

              <div className="pt-4">
                <button
                  onClick={handleResendEmail}
                  disabled={isLoading || isRateLimited}
                  className="text-sm text-primary hover:underline font-semibold disabled:opacity-50"
                >
                  Resend verification email
                </button>
              </div>
            </div>

            <div className="pt-8">
              <p className="text-xs text-muted-foreground">
                Need help? Contact us at{" "}
                <a href="mailto:quabble@muse.live" className="underline hover:text-foreground">
                  quabble@muse.live
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    );
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

            <div className="text-xs text-muted-foreground text-center pt-2">
              By signing up, you agree to our{" "}
              <a href="https://quabble.app/terms/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="https://quabble.app/privacy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                Privacy Policy
              </a>
            </div>

            <Button
              onClick={handleSignup}
              disabled={!isFormValid || isLoading || isRateLimited}
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
