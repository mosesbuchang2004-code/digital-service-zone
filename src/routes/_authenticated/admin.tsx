import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { allVendorApplicationsQuery, naira, rolesQuery, transactionsQuery } from "@/lib/hotsub";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

function AdminPage() {
  const queryClient = useQueryClient();
  const { data: roles, isLoading } = useQuery(rolesQuery);
  const isAdmin = (roles ?? []).includes("admin");
  const { data: applications } = useQuery({
    ...allVendorApplicationsQuery,
    enabled: isAdmin,
  });
  const { data: txns } = useQuery({ ...transactionsQuery(50), enabled: isAdmin });

  const review = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const { error } = await supabase
        .from("vendor_applications")
        .update({ status, reviewed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Application updated");
      queryClient.invalidateQueries(allVendorApplicationsQuery);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <AppShell title="Admin">Loading…</AppShell>;

  if (!isAdmin) {
    return (
      <AppShell title="Admin" subtitle="Restricted area">
        <p className="text-sm text-muted-foreground">
          You don't have admin access on this account.
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell title="Admin console" subtitle="Vendor approvals and platform activity.">
      <h2 className="text-lg font-bold text-navy">Vendor applications</h2>
      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {(applications ?? []).length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">No applications yet.</p>
        )}
        {(applications ?? []).map((a) => (
          <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-semibold text-navy">{a.business_name}</p>
              <p className="text-xs text-muted-foreground">
                {a.business_phone} • {a.status}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => review.mutate({ id: a.id, status: "approved" })}
                className="rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-brand-foreground"
              >
                Approve
              </button>
              <button
                onClick={() => review.mutate({ id: a.id, status: "rejected" })}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-navy"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy">Recent platform transactions</h2>
      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {(txns ?? []).map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-4 p-4 text-sm">
            <span className="font-medium text-navy">{t.service_name ?? t.type}</span>
            <span className="text-muted-foreground">{t.reference}</span>
            <span className="font-semibold">{naira(t.amount)}</span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
