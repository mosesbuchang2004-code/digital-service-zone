import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import logoAsset from "@/assets/hotsub-logo.asset.json";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new HotSub password" },
      { name: "description", content: "Choose a new password for your HotSub account." },
      { property: "og:title", content: "Reset your HotSub password" },
      { property: "og:description", content: "Choose a new password for your HotSub account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const value = z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(72)
        .parse(password);
      if (value !== confirm) throw new Error("Passwords do not match");
      const { error } = await supabase.auth.updateUser({ password: value });
      if (error) throw error;
      toast.success("Password updated");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      const message =
        err instanceof z.ZodError
          ? (err.issues[0]?.message ?? "Invalid password")
          : err instanceof Error
            ? err.message
            : "Could not update password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-navy px-4">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-soft">
        <span className="inline-flex items-center rounded-xl bg-white px-2.5 py-1.5">
          <img src={logoAsset.url} alt="HotSub" className="h-8 w-auto" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-navy">Set a new password</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Choose a strong password you haven't used before.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            maxLength={72}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            maxLength={72}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow disabled:opacity-70"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}
