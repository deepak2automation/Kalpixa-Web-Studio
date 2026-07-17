import { SeoAuditResponse } from "../types";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seo-analyze`;

export async function runSeoAudit(url: string, email?: string): Promise<SeoAuditResponse> {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ url, email }),
  });

  const data = await res.json().catch(() => ({} as SeoAuditResponse));

  if (!res.ok) {
    const message =
      (data as { error?: string }).error ||
      `Audit failed with status ${res.status}. Please try again.`;
    throw new Error(message);
  }

  if (!data || typeof data.score !== "number" || !Array.isArray(data.checks)) {
    throw new Error("Received an invalid audit response. Please try again.");
  }

  return data as SeoAuditResponse;
}
