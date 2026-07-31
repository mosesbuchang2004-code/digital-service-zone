import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Service = Tables<"services">;
export type DataPlan = Tables<"data_plans">;
export type Transaction = Tables<"transactions">;
export type Profile = Tables<"profiles">;
export type Wallet = Tables<"wallets">;
export type VendorApplication = Tables<"vendor_applications">;

export const naira = (value: number | string | null | undefined) =>
  `₦${Number(value ?? 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const categoryLabels: Record<string, string> = {
  airtime: "Airtime",
  data: "Data bundles",
  electricity: "Electricity",
  cable: "Cable TV",
  exam: "Exam PINs",
  betting: "Betting",
};

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return data as Service[];
  },
});

export const serviceQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as Service | null;
    },
  });

export const dataPlansQuery = (slug: string) =>
  queryOptions({
    queryKey: ["data-plans", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_plans")
        .select("*")
        .eq("service_slug", slug)
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as DataPlan[];
    },
  });

export const walletQuery = queryOptions({
  queryKey: ["wallet"],
  queryFn: async () => {
    const { data, error } = await supabase.from("wallets").select("*").maybeSingle();
    if (error) throw error;
    return data as Wallet | null;
  },
});

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const { data, error } = await supabase.from("profiles").select("*").maybeSingle();
    if (error) throw error;
    return data as Profile | null;
  },
});

export const rolesQuery = queryOptions({
  queryKey: ["roles"],
  queryFn: async () => {
    const { data, error } = await supabase.from("user_roles").select("role");
    if (error) throw error;
    return (data ?? []).map((r) => r.role as string);
  },
});

export const transactionsQuery = (limit = 50) =>
  queryOptions({
    queryKey: ["transactions", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Transaction[];
    },
  });

export const vendorApplicationQuery = queryOptions({
  queryKey: ["vendor-application"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("vendor_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as VendorApplication | null;
  },
});

export const allVendorApplicationsQuery = queryOptions({
  queryKey: ["vendor-applications-all"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("vendor_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as VendorApplication[];
  },
});

export async function bootstrapAccount(fullName?: string, phone?: string) {
  const args: { p_full_name?: string; p_phone?: string } = {};
  if (fullName) args.p_full_name = fullName;
  if (phone) args.p_phone = phone;
  const { error } = await supabase.rpc("bootstrap_account", args);
  if (error) throw error;
}

export async function fundWallet(amount: number) {
  const { data, error } = await supabase.rpc("fund_wallet", { p_amount: amount });
  if (error) throw error;
  return data as unknown as Transaction;
}

export async function purchaseService(input: {
  slug: string;
  recipient: string;
  amount: number;
  meta?: Record<string, unknown>;
}) {
  const { data, error } = await supabase.rpc("purchase_service", {
    p_service_slug: input.slug,
    p_recipient: input.recipient,
    p_amount: input.amount,
    p_meta: (input.meta ?? {}) as never,
  });
  if (error) throw error;
  return data as unknown as Transaction;
}
