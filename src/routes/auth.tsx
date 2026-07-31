import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import logoAsset from "@/assets/hotsub-logo.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { bootstrapAccount } from "@/lib/hotsub";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in or create your HotSub account" },
      {
        name: "description",
        content:
          "Log in or open a free HotSub account to buy airtime, data, electricity tokens, cable TV and exam PINs instantly.",
      },
      { property: "og:title", content: "HotSub — Sign in or sign up" },
      {
        property: "og:description",
        content: "Create your free HotSub wallet and start topping up in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "forgot";

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{10}$/, "Enter a valid 11-digit phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Enter your password").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        navigate({ to: "/dashboard", replace: true });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    await bootstrapAccount().catch(() => undefined);
    navigate({ to: "/dashboard", replace: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "forgot") {
        const email = z.string().email().parse(form.email.trim());
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSent(email);
        toast.success("Password reset link sent");
        return;
      }

      if (mode === "signup") {
        const values = signupSchema.parse(form);
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: values.fullName, phone: values.phone },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(values.email);
          toast.success("Account created — confirm your email to continue");
          return;
        }
        await bootstrapAccount(values.fullName, values.phone);
        toast.success("Welcome to HotSub!");
        navigate({ to: "/dashboard", replace: true });
        return;
      }

      const values = loginSchema.parse(form);
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
      await bootstrapAccount().catch(() => undefined);
      toast.success("Signed in");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      const message =
        err instanceof z.ZodError
          ? (err.issues[0]?.message ?? "Please check your details")
          : err instanceof Error
            ? err.message
            : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-gradient-navy lg:grid-cols-2">
      <div className="hidden flex-col justify-between p-10 lg:flex">
        <Link to="/" className="inline-flex w-fit items-center rounded-xl bg-white px-3 py-2">
          <img src={logoAsset.url} alt="HotSub" className="h-9 w-auto" />
        </Link>
        <div>
          <h2 className="max-w-md text-4xl font-extrabold leading-tight text-white">
            One wallet for airtime, data, power, TV and exam PINs.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            Fund once, buy anything. Instant delivery, automatic reversals and receipts for every
            single transaction.
          </p>
          <ul className="mt-8 space-y-2 text-sm text-white/70">
            <li>• 20,000+ Nigerians topping up daily</li>
            <li>• Cashback and referral earnings</li>
            <li>• Vendor accounts with wholesale rates</li>
          </ul>
        </div>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} HotSub</p>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-3xl bg-card p-7 shadow-soft sm:p-9">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-navy lg:hidden"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>

          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-xl font-bold text-navy">Check your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a link to <span className="font-medium text-navy">{sent}</span>. Open it to
                continue.
              </p>
              <button
                onClick={() => {
                  setSent(null);
                  setMode("login");
                }}
                className="mt-6 text-sm font-semibold text-primary"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-navy">
                {mode === "login"
                  ? "Welcome back"
                  : mode === "signup"
                    ? "Create your free account"
                    : "Reset your password"}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in to your HotSub wallet."
                  : mode === "signup"
                    ? "It takes less than a minute to get started."
                    : "We'll email you a secure reset link."}
              </p>

              {mode !== "forgot" && (
                <>
                  <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={loading}
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-4 py-3 text-sm font-semibold text-navy transition-colors hover:bg-secondary disabled:opacity-60"
                  >
                    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2.5 24 .5 14.6.5 6.5 5.8 2.6 13.6l7.8 6.1C12.3 13.7 17.6 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v8h12.7c-.6 3-2.4 5.5-5 7.2l7.6 5.9c4.4-4.1 7.2-10.1 7.2-17z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.4 28.3A14.6 14.6 0 019.6 24c0-1.5.3-3 .8-4.3l-7.8-6.1A23.9 23.9 0 000 24c0 3.9.9 7.5 2.6 10.7l7.8-6.4z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 47.5c6.5 0 11.9-2.1 15.8-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.2 2.3-6.4 0-11.7-4.2-13.6-10.2l-7.8 6.4C6.5 42.1 14.6 47.5 24 47.5z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                  <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="h-px flex-1 bg-border" /> or use your email
                    <span className="h-px flex-1 bg-border" />
                  </div>
                </>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <>
                    <Field label="Full name">
                      <input
                        value={form.fullName}
                        onChange={set("fullName")}
                        placeholder="Chidi Okafor"
                        maxLength={80}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Phone number">
                      <input
                        value={form.phone}
                        onChange={set("phone")}
                        inputMode="numeric"
                        placeholder="08012345678"
                        maxLength={11}
                        className={inputClass}
                      />
                    </Field>
                  </>
                )}

                <Field label="Email address">
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@email.com"
                    maxLength={255}
                    className={inputClass}
                  />
                </Field>

                {mode !== "forgot" && (
                  <Field label="Password">
                    <input
                      type="password"
                      value={form.password}
                      onChange={set("password")}
                      placeholder="••••••••"
                      maxLength={72}
                      className={inputClass}
                    />
                  </Field>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow transition-transform hover:scale-[1.01] disabled:opacity-70"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mode === "login"
                    ? "Sign in"
                    : mode === "signup"
                      ? "Create account"
                      : "Send reset link"}
                </button>
              </form>

              <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
                {mode === "login" && (
                  <>
                    <p>
                      New to HotSub?{" "}
                      <button onClick={() => setMode("signup")} className="font-semibold text-primary">
                        Create an account
                      </button>
                    </p>
                    <p>
                      <button onClick={() => setMode("forgot")} className="text-xs hover:text-navy">
                        Forgot your password?
                      </button>
                    </p>
                  </>
                )}
                {mode === "signup" && (
                  <p>
                    Already have an account?{" "}
                    <button onClick={() => setMode("login")} className="font-semibold text-primary">
                      Sign in
                    </button>
                  </p>
                )}
                {mode === "forgot" && (
                  <p>
                    <button onClick={() => setMode("login")} className="font-semibold text-primary">
                      Back to sign in
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
