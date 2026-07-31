import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery, rolesQuery } from "@/lib/hotsub";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery(profileQuery);
  const { data: roles } = useQuery(rolesQuery);
  const [fullName, setFullName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName ?? profile?.full_name ?? null,
          phone: phone ?? profile?.phone ?? null,
        })
        .eq("id", profile?.id ?? "");
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries(profileQuery);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <AppShell title="Profile" subtitle="Manage your account details.">
      <div className="grid max-w-2xl gap-4 rounded-3xl border border-border bg-card p-6">
        <Row label="Email">
          <p className="text-sm text-muted-foreground">{profile?.email ?? "—"}</p>
        </Row>
        <Row label="Account type">
          <p className="text-sm text-muted-foreground">{(roles ?? ["user"]).join(", ")}</p>
        </Row>
        <Row label="Referral code">
          <p className="text-sm font-semibold text-navy">{profile?.referral_code ?? "—"}</p>
        </Row>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Full name
          </span>
          <input
            value={fullName ?? profile?.full_name ?? ""}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={80}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Phone number
          </span>
          <input
            value={phone ?? profile?.phone ?? ""}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={11}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="mt-2 w-fit rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-glow disabled:opacity-70"
        >
          Save changes
        </button>
      </div>
    </AppShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
