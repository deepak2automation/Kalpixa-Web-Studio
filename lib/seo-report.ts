export type Check = { label: string; category: string; points: number; earned: number; status: 'pass' | 'warn' | 'fail'; detail: string };
export type Report = { score: number; checks: Check[]; summary: { finalUrl: string; title: string | null; responseTimeMs: number; htmlSizeBytes: number; wordCount: number; images: number; imagesMissingAlt: number; https: boolean; structuredData: boolean }; auditedAt: string };

const record = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const number = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const text = (value: unknown): value is string => typeof value === 'string' && value.length <= 8192;

export function isReport(value: unknown): value is Report {
  if (!record(value) || !number(value.score) || value.score > 100 || !record(value.summary)) return false;
  if (!text(value.auditedAt) || Number.isNaN(Date.parse(value.auditedAt))) return false;
  const summary = value.summary;
  if (!text(summary.finalUrl) || !(summary.title === null || text(summary.title))) return false;
  try { const url = new URL(summary.finalUrl); if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return false; } catch { return false; }
  if (!['responseTimeMs', 'htmlSizeBytes', 'wordCount', 'images', 'imagesMissingAlt'].every((key) => number(summary[key]))) return false;
  if (typeof summary.https !== 'boolean' || typeof summary.structuredData !== 'boolean') return false;
  return Array.isArray(value.checks) && value.checks.length > 0 && value.checks.length <= 100 && value.checks.every((check) =>
    record(check) && text(check.label) && text(check.detail) && ['Content', 'Technical', 'Social', 'Performance'].includes(String(check.category)) &&
    number(check.points) && check.points > 0 && number(check.earned) && check.earned <= check.points && ['pass', 'warn', 'fail'].includes(String(check.status)));
}
