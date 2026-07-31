import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Grid2X2,
  Wallet as WalletIcon,
  Receipt,
  Store,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import logoAsset from "@/assets/hotsub-logo.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { naira, rolesQuery, walletQuery } from "@/lib/hotsub";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/services", label: "Services", icon: Grid2X2 },
  { to: "/wallet", label: "Wallet", icon: WalletIcon },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/vendor", label: "Vendor", icon: Store },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string | undefined;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: wallet } = useQuery(walletQuery);
  const { data: roles } = useQuery(rolesQuery);
  const isAdmin = (roles ?? []).includes("admin");

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const links = isAdmin
    ? [...navItems, { to: "/admin", label: "Admin", icon: ShieldCheck } as const]
    : navItems;

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="inline-flex items-center rounded-xl bg-white px-2.5 py-1.5">
              <img src={logoAsset.url} alt="HotSub" className="h-7 w-auto sm:h-8" />
            </Link>
            <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 lg:inline">
              Wallet: {naira(wallet?.balance)}
            </span>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeProps={{ className: "bg-white/15 text-white" }}
                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-white/70 transition-colors hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <button
              onClick={signOut}
              className="ml-2 flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-full border border-white/20 p-2 text-white lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-white/10 bg-navy px-4 pb-4 lg:hidden">
            <p className="py-3 text-xs text-white/60">Wallet: {naira(wallet?.balance)}</p>
            <div className="grid gap-1">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "bg-white/15 text-white" }}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/75"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              <button
                onClick={signOut}
                className="mt-1 flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm text-white/80"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
