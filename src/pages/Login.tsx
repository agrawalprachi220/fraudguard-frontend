import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { isSupabaseConfigured, supabase } from "@/services/supabase";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldAlert,
  Activity,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

type Mode = "signin" | "signup";

function friendlyError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }
  if (m.includes("email not confirmed")) {
    return "Please confirm your email address first, then sign in.";
  }
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "An account with this email already exists. Please sign in.";
  }
  if (m.includes("password should be at least")) {
    return "Password must be at least 6 characters.";
  }
  if (m.includes("rate limit")) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }
  if (m.includes("failed to fetch") || m.includes("network")) {
    return "Unable to reach the authentication server. Check your internet connection.";
  }
  return "Something went wrong. Please try again.";
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<Mode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const isSignup = mode === "signup";

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setInfo(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!supabase) {
      setError(
        "Authentication is not configured. Add the Supabase URL and key to the environment variables."
      );
      return;
    }

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isSignup && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName.trim() || email.split("@")[0] },
          },
        });

        if (signUpError) {
          setError(friendlyError(signUpError.message));
          return;
        }

        // If email confirmation is off, Supabase returns a session right away.
        if (data.session) {
          onLogin();
          return;
        }

        setInfo(
          "Account created. Please check your email to confirm your address, then sign in."
        );
        setMode("signin");
        setPassword("");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(friendlyError(signInError.message));
          return;
        }

        onLogin();
      }
    } catch {
      setError("Unable to reach the authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError(null);
    setInfo(null);

    if (!supabase) {
      setError("Authentication is not configured.");
      return;
    }

    if (!email) {
      setError("Enter your email above, then click Forgot Password.");
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: window.location.origin }
      );

      if (resetError) {
        setError(friendlyError(resetError.message));
        return;
      }

      setInfo("Password reset link sent. Please check your email.");
    } catch {
      setError("Unable to send the reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left branding panel */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-grid p-12 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-10 bottom-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              FraudGuard AI
            </span>
            <p className="text-xs text-muted-foreground">
              AI-Powered Credit Card Fraud Detection
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground">
            Protect Every Transaction With{" "}
            <span className="text-gradient">AI</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Advanced machine learning models analyze transaction patterns in
            real time to detect and prevent fraudulent credit card activity
            before it impacts your customers.
          </p>

          <div className="mt-8 space-y-3">
            {[
              { icon: ShieldCheck, text: "Real-time fraud probability scoring" },
              { icon: Activity, text: "ML-powered transaction analysis" },
              { icon: ShieldAlert, text: "Instant risk classification & alerts" },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {f.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground">
          © 2026 FraudGuard AI · Machine Learning Fraud Detection System
        </div>
      </div>

      {/* Right login form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">
              FraudGuard AI
            </span>
          </div>

          <Card className="glass-card border-border p-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSignup
                ? "Create an account to start analyzing transactions."
                : "Sign in to access the fraud detection dashboard."}
            </p>

            {!isSupabaseConfigured && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2.5">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <p className="text-xs text-muted-foreground">
                  Supabase is not configured. Add VITE_SUPABASE_URL and
                  VITE_SUPABASE_PUBLISHABLE_KEY to enable sign in.
                </p>
              </div>
            )}

            {info && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <p className="text-xs text-muted-foreground" role="status">
                  {info}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-9"
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9"
                    autoComplete={isSignup ? "new-password" : "current-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-destructive" role="alert">
                  {error}
                </p>
              )}

              {!isSignup && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="text-xs text-primary hover:underline disabled:opacity-50"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20"
              >
                {loading ? (
                  isSignup ? (
                    "Creating account..."
                  ) : (
                    "Signing in..."
                  )
                ) : (
                  <>
                    {isSignup ? "Create Account" : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <Separator className="my-5" />

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => switchMode(isSignup ? "signin" : "signup")}
            >
              {isSignup ? "Back to Sign In" : "Create Account"}
            </Button>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to the Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
