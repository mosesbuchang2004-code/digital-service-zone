import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { AppShell } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { rolesQuery, vendorApplicationQuery } from "@/lib/hotsub";

export const Route = createFileRoute("/_authenticated/vendor")({
  component: VendorPage,
});

const schema = z.object({
  business_name: z.string().trim().min(2, "Enter your business name").max(120),
  business_phone: z.string().trim().regex(/^0\d{10}$/, "Enter a valid 11-digit phone number"),
  business_address: z.string().trim().max(200).optional(),
  expected_volume: z.string().trim().max(60).optional(),
});

function VendorPage() {
  const queryClient = useQueryClient();
  const { data: application } = useQuery(vendorApplicationQuery);
  const { data: roles } = useQuery(rolesQuery);
  const isVendor = (roles ?? []).includes("vendor");
  const [form, setForm] = useState({
    business_name: "",
    business_phone: "",
    business_address: "",
    expected_volume: "",
  });

  const apply = useMutation({
    mutationFn: async () => {
      const values = schema.parse(form);
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("vendor_applications").insert({
        user_id: userData.user?.id ?? "",
        business_name: values.business_name,
        business_phone: values.business_phone,
        business_address: values.business_address ?? null,
        expected_volume: values.expected_volume ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Application submitted — we'll review it shortly");
      queryClient.invalidateQueries(vendorApplicationQuery);
    },
    onError: (err: unknown) =>
      toast.error(
        err instanceof z.ZodError
          ? (err.issues[0]?.message ?? "Check your details")
          : err instanceof Error
            ? err.message
            : "Could not submit",
      ),
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <AppShell
      title="Vendor centre"
      subtitle="Resell at wholesale rates with an agent dashboard and API access."
    >
      {isVendor && (
        <div className="mb-6 rounded-3xl bg-gradient-navy p-6 text-white">
          <p className="text-xs uppercase tracking-widest text-white/60">Vendor status</p>
          <p className="mt-2 text-2xl font-bold">Approved vendor</p>
          <p className="mt-3 text-sm text-white/65">
            Wholesale pricing is active on your account. Commissions settle instantly to your wallet.
          </p>
        </div>
      )}

      {application ? (
        <div className="max-w-2xl rounded-3xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Your application</p>
          <p className="mt-2 text-lg font-bold text-navy">{application.business_name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{application.business_phone}</p>
          <span className="mt-4 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase text-primary">
            {application.status}
          </span>
          {application.review_note && (
            <p className="mt-4 text-sm text-muted-foreground">{application.review_note}</p>
          )}
        </div>
      ) : (
        <div className="max-w-2xl space-y-4 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-navy">Apply to become a vendor</h2>
          <input
            value={form.business_name}
            onChange={set("business_name")}
            placeholder="Business name"
            maxLength={120}
            className={input}
          />
          <input
            value={form.business_phone}
            onChange={set("business_phone")}
            placeholder="Business phone (08012345678)"
            maxLength={11}
            className={input}
          />
          <input
            value={form.business_address}
            onChange={set("business_address")}
            placeholder="Business address"
            maxLength={200}
            className={input}
          />
          <input
            value={form.expected_volume}
            onChange={set("expected_volume")}
            placeholder="Expected monthly volume (e.g. ₦500,000)"
            maxLength={60}
            className={input}
          />
          <button
            onClick={() => apply.mutate()}
            disabled={apply.isPending}
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-glow disabled:opacity-70"
          >
            {apply.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit application
          </button>
        </div>
      )}
    </AppShell>
  );
}

const input =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";
