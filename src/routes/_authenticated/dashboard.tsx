import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Plus, Wallet as WalletIcon } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import {
  categoryLabels,
  naira,
  profileQuery,
  servicesQuery,
  transactionsQuery,
  walletQuery,
} from "@/lib/hotsub";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: wallet } = useQuery(walletQuery);
  const { data: profile } = useQuery(profileQuery);
  const { data: services } = useQuery(servicesQuery);
  const { data: txns } = useQuery(transactionsQuery(6));

  const quick = (services ?? []).slice(0, 8);

  return (
    <AppShell
      title={`Hello ${profile?.full_name?.split(" ")[0] ?? "there"} 👋`}
      subtitle="Your HotSub wallet and services at a glance."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl bg-gradient-navy p-6 text-white lg:col-span-2">
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
            <WalletIcon className="h-4 w-4" /> Wallet balance
          </p>
          <p className="mt-3 text-4xl font-extrabold">{naira(wallet?.balance)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/wallet"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-glow"
            >
              <Plus className="h-4 w-4" /> Fund wallet
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Buy a service <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Referral code</p>
          <p className="mt-2 text-2xl font-bold text-navy">{profile?.referral_code ?? "—"}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Share your code and earn a commission on every transaction your referrals make.
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy">Quick top-up</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quick.map((s) => (
          <Link
            key={s.slug}
            to="/buy/$slug"
            params={{ slug: s.slug }}
            className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {categoryLabels[s.category] ?? s.category}
            </p>
            <p className="mt-2 font-semibold text-navy">{s.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-bold text-navy">Recent transactions</h2>
        <Link to="/transactions" className="text-sm font-semibold text-primary">
          View all
        </Link>
      </div>
      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {(txns ?? []).length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">No transactions yet.</p>
        )}
        {(txns ?? []).map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy">
                {t.service_name ?? t.type}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {t.recipient ? `${t.recipient} • ` : ""}
                {new Date(t.created_at).toLocaleString("en-NG")}
              </p>
            </div>
            <p
              className={`shrink-0 text-sm font-bold ${
                t.type === "funding" ? "text-success" : "text-navy"
              }`}
            >
              {t.type === "funding" ? "+" : "-"}
              {naira(t.amount)}
            </p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
