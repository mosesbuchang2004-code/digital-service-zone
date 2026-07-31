import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { AppShell } from "@/components/app-shell";
import { categoryLabels, servicesQuery } from "@/lib/hotsub";

export const Route = createFileRoute("/_authenticated/services")({
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services } = useQuery(servicesQuery);
  const grouped = (services ?? []).reduce<Record<string, typeof services>>((acc, s) => {
    acc[s.category] = [...(acc[s.category] ?? []), s];
    return acc;
  }, {});

  return (
    <AppShell title="All services" subtitle="Pick a service to start a purchase.">
      <div className="space-y-10">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-lg font-bold text-navy">
              {categoryLabels[category] ?? category}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(items ?? []).map((s) => (
                <Link
                  key={s.slug}
                  to="/buy/$slug"
                  params={{ slug: s.slug }}
                  className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
                >
                  <p className="font-semibold text-navy">{s.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
