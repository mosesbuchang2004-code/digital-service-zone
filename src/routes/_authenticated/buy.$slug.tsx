import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import {
  dataPlansQuery,
  naira,
  purchaseService,
  serviceQuery,
  walletQuery,
} from "@/lib/hotsub";

export const Route = createFileRoute("/_authenticated/buy/$slug")({
  component: BuyPage,
});

function BuyPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: service, isLoading } = useQuery(serviceQuery(slug));
  const { data: plans } = useQuery(dataPlansQuery(slug));
  const { data: wallet } = useQuery(walletQuery);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [planId, setPlanId] = useState<string | null>(null);

  const buy = useMutation({
    mutationFn: () => {
      const plan = (plans ?? []).find((p) => p.id === planId);
      return purchaseService({
        slug,
        recipient,
        amount: plan ? Number(plan.price) : Number(amount),
        meta: plan ? { plan: plan.name, validity: plan.validity } : {},
      });
    },
    onSuccess: (txn) => {
      toast.success(
        txn.token ? `Delivered — token ${txn.token}` : `Successful — ref ${txn.reference}`,
      );
      queryClient.invalidateQueries();
      navigate({ to: "/transactions" });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <AppShell title="Loading service…">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </AppShell>
    );
  }

  if (!service) {
    return (
      <AppShell title="Service unavailable" subtitle="This service could not be found.">
        <p className="text-sm text-muted-foreground">Please pick another service.</p>
      </AppShell>
    );
  }

  const hasPlans = (plans ?? []).length > 0;

  return (
    <AppShell title={service.name} subtitle={service.description ?? undefined}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-3xl border border-border bg-card p-6">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {service.input_label}
            </span>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              maxLength={60}
              placeholder={service.input_label}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>

          {hasPlans ? (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Choose a bundle
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(plans ?? []).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlanId(p.id)}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      planId === p.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <p className="text-sm font-semibold text-navy">
                      {p.network} {p.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.validity} • {naira(p.price)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6">
              {(service.fixed_amounts ?? []).length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {(service.fixed_amounts ?? []).map((a) => (
                    <button
                      key={String(a)}
                      onClick={() => setAmount(String(a))}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        amount === String(a)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-navy"
                      }`}
                    >
                      {naira(a).replace(".00", "")}
                    </button>
                  ))}
                </div>
              )}
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                inputMode="numeric"
                placeholder={`Amount (${naira(service.min_amount).replace(".00", "")} – ${naira(
                  service.max_amount,
                ).replace(".00", "")})`}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
          )}

          <button
            onClick={() => buy.mutate()}
            disabled={buy.isPending || !recipient || (hasPlans ? !planId : !amount)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow disabled:opacity-60"
          >
            {buy.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirm purchase
          </button>
        </div>

        <aside className="rounded-3xl bg-gradient-navy p-6 text-white">
          <p className="text-xs uppercase tracking-widest text-white/60">Wallet balance</p>
          <p className="mt-2 text-3xl font-extrabold">{naira(wallet?.balance)}</p>
          <p className="mt-4 text-sm text-white/60">
            {Number(service.discount_percent) > 0
              ? `You save ${service.discount_percent}% on every ${service.name} purchase.`
              : "Delivery is instant and receipts are saved to your history."}
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
