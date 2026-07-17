import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  price: string;
}

export interface PageProps {
  navigate: (path: string, state?: Record<string, unknown>) => void;
}

export type SeoCheckStatus = "pass" | "warn" | "fail";

export interface SeoCheck {
  label: string;
  status: SeoCheckStatus;
  detail: string;
  category: "content" | "technical" | "social" | "performance";
  points: number;
  earned: number;
}

export interface SeoAuditSummary {
  title: string | null;
  description: string | null;
  canonical: string | null;
  og: { title: string | null; description: string | null; image: string | null };
  headings: { h1: number; h2: number; h3: number };
  images: { total: number; missingAlt: number; emptyAlt: number };
  links: { total: number; internal: number; external: number };
  loadTime: string;
  htmlSizeKb: number;
  htmlLang: string | null;
  robots: string | null;
  viewport: string | null;
  https: boolean;
  finalUrl: string;
  wordCount: number;
  favicon: boolean;
  structuredData: boolean;
  urlHasQuery: boolean;
  urlDepth: number;
  contentRatioScore: number | null;
}

export interface SeoAuditResponse {
  url: string;
  score: number;
  overallStatus: SeoCheckStatus;
  checks: SeoCheck[];
  summary: SeoAuditSummary;
  error?: string;
}
