export async function purchaseService(input: {
  slug: string;
  recipient: string;
  amount: number;
  meta?: Record<string, unknown>;
}) {
  const serviceTypeMap: Record<string, string> = {
    data: "data",
    airtime: "airtime",
    electricity: "electricity",
    cable: "cabletv",
    cabletv: "cabletv",
    exam: "education",
  };

  const serviceType = serviceTypeMap[input.slug] ?? input.slug;

  const providerCode = input.meta?.provider_code;
  const packageCode = input.meta?.package_code;

  const payload: Record<string, unknown> = {
    action: "purchase",
    service_type: serviceType,
    recipient: input.recipient,
  };

  if (providerCode) {
    payload.provider_code = providerCode;
  }

  if (packageCode) {
    payload.package_code = packageCode;
  }

  if (serviceType === "airtime") {
    payload.amount = input.amount;
  }

  const { data, error } = await supabase.functions.invoke(
    "bright-processor",
    {
      body: payload,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.success) {
    throw new Error(
      data?.data?.error?.message ||
        data?.message ||
        "Purchase failed",
    );
  }

  return data;
}
