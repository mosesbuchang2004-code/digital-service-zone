import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { fundWallet, naira, transactionsQuery, walletQuery } from "@/lib/hotsub";

export const Route = createFileRoute("/_authenticated/wallet")({
  component: WalletPage,
});

const presets = [1000, 2000, 5000, 10000, 20000, 50000];

function WalletPage() {
  const queryClient = useQueryClient();
  const { data: wallet } = useQuery(walletQuery);
  const { data: txns } = useQuery(transactionsQuery(30));
  const [amount, setAmount] = useState("2000");

  const fund = useMutation({
    mutationFn: () => fundWallet(Number(amount)),
    onSuccess: (txn) => {
      toast.success(`Wallet funded — ref ${txn.reference}`);
      queryClient.invalidateQueries();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const fundings = (txns ?? []).filter((t) => t.type === "funding");

  return (
    <AppShell title="Wallet" subtitle="Fund your wallet and review your funding history.">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl bg-gradient-navy p-6 text-white">
          <p className="text-xs uppercase tracking-widest text-white/60">Available balance</p>
          <p className="mt-3 text-4xl font-extrabold">{naira(wallet?.balance)}</p>
          <p className="mt-4 text-sm text-white/60">
            Fund instantly with card or bank transfer. Failed orders are reversed automatically.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-navy">Fund wallet</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(String(p))}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  amount === String(p)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-navy"
                }`}
              >
                {naira(p).replace(".00", "")}
              </button>
            ))}
          </div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
            inputMode="numeric"
            className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Enter amount (min ₦100)"
          />
          <button
            onClick={() => fund.mutate()}
            disabled={fund.isPending || !amount}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow disabled:opacity-70"
          >
            {fund.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Fund {amount ? naira(amount) : "wallet"}
          </button>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy">Funding history</h2>
      <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
        {fundings.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">No wallet funding yet.</p>
        )}
        {fundings.map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-semibold text-navy">{t.reference}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(t.created_at).toLocaleString("en-NG")}
              </p>
            </div>
            <p className="text-sm font-bold text-success">+{naira(t.amount)}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
