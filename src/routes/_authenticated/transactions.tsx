import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { AppShell } from "@/components/app-shell";
import { naira, transactionsQuery } from "@/lib/hotsub";

export const Route = createFileRoute("/_authenticated/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  const { data: txns } = useQuery(transactionsQuery(100));

  return (
    <AppShell title="Transactions" subtitle="Every purchase, funding and reversal on your account.">
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(txns ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-muted-foreground">
                  No transactions yet.
                </td>
              </tr>
            )}
            {(txns ?? []).map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 font-medium text-navy">{t.reference}</td>
                <td className="px-4 py-3">{t.service_name ?? t.type}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.recipient ?? "—"}</td>
                <td className="px-4 py-3 font-semibold">{naira(t.amount)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(t.created_at).toLocaleString("en-NG")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
