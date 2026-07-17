import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AuditRequest {
  url: string;
  email?: string;
}

interface SeoCheck {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
  category: "content" | "technical" | "social" | "performance";
  points: number;
  earned: number;
}

function normalizeUrl(input: string): string {
  let u = input.trim();
  if (!u) throw new Error("URL is required");
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  return u;
}

function scoreToStatus(score: number): "pass" | "warn" | "fail" {
  if (score >= 80) return "pass";
  if (score >= 50) return "warn";
  return "fail";
}

async function fetchWithTiming(url: string, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = performance.now();
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; KalpixaSEOBot/1.0; +https://kalpixa.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    const elapsed = performance.now() - start;
    const html = await res.text();
    return { res, html, elapsedMs: elapsed };
  } finally {
    clearTimeout(timer);
  }
}

// --- Regex-based HTML extractors ---

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

function extractMetaContent(html: string, name: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]*\\sname=["']${name}["'][^>]*\\scontent=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]*\\scontent=["']([^"']*)["'][^>]*\\sname=["']${name}["']`, "i"),
    new RegExp(`<meta[^>]*\\sproperty=["']${name}["'][^>]*\\scontent=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]*\\scontent=["']([^"']*)["'][^>]*\\sproperty=["']${name}["']`, "i"),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1].trim();
  }
  return null;
}

function countTags(html: string, tag: string): number {
  const re = new RegExp(`<${tag}\\b[^>]*>`, "gi");
  return (html.match(re) || []).length;
}

function getImagesInfo(html: string) {
  const imgRe = /<img\b[^>]*>/gi;
  const imgs = html.match(imgRe) || [];
  const total = imgs.length;
  let missingAlt = 0;
  let emptyAlt = 0;
  for (const img of imgs) {
    const altMatch = img.match(/\salt=["']([^"']*)["']/i);
    if (!altMatch) missingAlt++;
    else if (altMatch[1].trim() === "") emptyAlt++;
  }
  return { total, missingAlt, emptyAlt };
}

function getLinksInfo(html: string, baseUrl: string) {
  const linkRe = /<a\b[^>]*\shref=["']([^"']*)["'][^>]*>/gi;
  const uniqueHrefs = new Set<string>();
  let internal = 0;
  let external = 0;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(html)) !== null) {
    const href = m[1];
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
    uniqueHrefs.add(href);
    try {
      const resolved = new URL(href, baseUrl).href;
      const baseOrigin = new URL(baseUrl).origin;
      if (new URL(resolved).origin === baseOrigin) internal++;
      else external++;
    } catch {
      // ignore malformed
    }
  }
  return { total: uniqueHrefs.size, internal, external };
}

function extractLang(html: string): string | null {
  const m = html.match(/<html[^>]*\slang=["']([^"']*)["']/i);
  return m ? m[1].trim() : null;
}

function hasFavicon(html: string): boolean {
  return /<link\b[^>]*\srel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>/i.test(html);
}

function hasStructuredData(html: string): boolean {
  return /<script\b[^>]*\stype=["']application\/ld\+json["'][^>]*>/i.test(html);
}

function stripTags(html: string): string {
  let clean = html.replace(/<script\b[\s\S]*?<\/script>/gi, " ");
  clean = clean.replace(/<style\b[\s\S]*?<\/style>/gi, " ");
  clean = clean.replace(/<[^>]+>/g, " ");
  return clean.replace(/\s+/g, " ").trim();
}

function getUrlDepth(url: string): number {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter((p) => p.length > 0);
    return parts.length;
  } catch {
    return 0;
  }
}

function getUrlHasQuery(url: string): boolean {
  try {
    return new URL(url).search.length > 0;
  } catch {
    return false;
  }
}

function buildReport(
  url: string,
  html: string,
  res: Response,
  elapsedMs: number,
): { score: number; checks: SeoCheck[]; summary: Record<string, unknown> } {
  const checks: SeoCheck[] = [];
  const finalUrl = res.url || url;
  const isHttps = finalUrl.startsWith("https://");

  // --- TITLE ---
  const title = extractTitle(html);
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "fail";
    let detail = "No <title> tag found.";
    if (title) {
      if (title.length >= 30 && title.length <= 60) {
        earned = 10; status = "pass"; detail = `Good length (${title.length} chars).`;
      } else if (title.length > 0) {
        earned = 6; status = "warn";
        detail = `Title is ${title.length} chars. Ideal range is 30-60.`;
      }
    }
    checks.push({ label: "Title Tag", status, detail, category: "content", points: 10, earned });
  }

  // --- META DESCRIPTION ---
  const desc = extractMetaContent(html, "description");
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "fail";
    let detail = "No meta description found.";
    if (desc) {
      if (desc.length >= 70 && desc.length <= 160) {
        earned = 10; status = "pass"; detail = `Good length (${desc.length} chars).`;
      } else if (desc.length > 0) {
        earned = 6; status = "warn";
        detail = `Description is ${desc.length} chars. Ideal range is 70-160.`;
      }
    }
    checks.push({ label: "Meta Description", status, detail, category: "content", points: 10, earned });
  }

  // --- HEADINGS ---
  const h1 = countTags(html, "h1");
  const h2 = countTags(html, "h2");
  const h3 = countTags(html, "h3");
  const headings = { h1, h2, h3 };
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "fail";
    let detail = "No H1 tag found. Add one with your primary keyword.";
    if (h1 === 1) {
      earned = 8; status = "pass"; detail = `Exactly 1 H1, ${h2} H2, ${h3} H3.`;
    } else if (h1 > 1) {
      earned = 4; status = "warn"; detail = `${h1} H1 tags found. Use only one.`;
    }
    checks.push({ label: "Heading Structure", status, detail, category: "content", points: 8, earned });
  }

  // --- IMAGE ALT ---
  const imgInfo = getImagesInfo(html);
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "pass";
    let detail = "All images have alt text.";
    const problematic = imgInfo.missingAlt + imgInfo.emptyAlt;
    if (imgInfo.total === 0) {
      earned = 5; status = "pass"; detail = "No images on page.";
    } else if (problematic === 0) {
      earned = 8; status = "pass"; detail = `All ${imgInfo.total} images have alt text.`;
    } else {
      const ratio = problematic / imgInfo.total;
      earned = Math.round(8 * (1 - ratio));
      status = ratio > 0.5 ? "fail" : "warn";
      detail = `${problematic} of ${imgInfo.total} images missing alt text.`;
    }
    checks.push({ label: "Image Alt Attributes", status, detail, category: "content", points: 8, earned });
  }

  // --- CONTENT LENGTH ---
  const bodyText = stripTags(html);
  const wordCount = bodyText ? bodyText.split(/\s+/).filter(Boolean).length : 0;
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "fail";
    let detail = "";
    if (wordCount >= 300) { earned = 6; status = "pass"; detail = `${wordCount} words. Good depth for SEO.`; }
    else if (wordCount >= 100) { earned = 4; status = "warn"; detail = `${wordCount} words. Aim for 300+ for better rankings.`; }
    else if (wordCount > 0) { earned = 2; status = "fail"; detail = `Only ${wordCount} words. Thin content hurts rankings.`; }
    else { earned = 0; status = "fail"; detail = "No visible text content found."; }
    checks.push({ label: "Content Length", status, detail, category: "content", points: 6, earned });
  }

  // --- SSL / HTTPS ---
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "fail";
    let detail = "Site is not served over HTTPS.";
    if (isHttps) { earned = 8; status = "pass"; detail = "Site uses HTTPS."; }
    checks.push({ label: "SSL / HTTPS", status, detail, category: "technical", points: 8, earned });
  }

  // --- MOBILE VIEWPORT ---
  const viewport = extractMetaContent(html, "viewport");
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "fail";
    let detail = "No viewport meta tag. Page is not mobile-friendly.";
    if (viewport && /width=device-width/.test(viewport)) {
      earned = 8; status = "pass"; detail = "Viewport configured for mobile.";
    }
    checks.push({ label: "Mobile Viewport", status, detail, category: "technical", points: 8, earned });
  }

  // --- CANONICAL ---
  let canonical: string | null = null;
  {
    const m = html.match(/<link[^>]*\srel=["']canonical["'][^>]*\shref=["']([^"']*)["']/i);
    if (!m) {
      const m2 = html.match(/<link[^>]*\shref=["']([^"']*)["'][^>]*\srel=["']canonical["']/i);
      if (m2) canonical = m2[1].trim();
    } else {
      canonical = m[1].trim();
    }
  }
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "warn";
    let detail = "No canonical tag found.";
    if (canonical) { earned = 5; status = "pass"; detail = `Canonical set: ${canonical}`; }
    checks.push({ label: "Canonical URL", status, detail, category: "technical", points: 5, earned });
  }

  // --- ROBOTS META ---
  const robots = extractMetaContent(html, "robots");
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "warn";
    let detail = "No robots meta tag. Using default (index, follow).";
    if (robots) {
      if (/noindex/i.test(robots)) {
        earned = 0; status = "fail"; detail = "Page is set to noindex (not indexed by search engines).";
      } else {
        earned = 5; status = "pass"; detail = `Robots: ${robots}`;
      }
    }
    checks.push({ label: "Robots Meta", status, detail, category: "technical", points: 5, earned });
  }

  // --- FAVICON ---
  const favicon = hasFavicon(html);
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "warn";
    let detail = "No favicon found. Add one for brand consistency.";
    if (favicon) { earned = 3; status = "pass"; detail = "Favicon detected."; }
    checks.push({ label: "Favicon", status, detail, category: "technical", points: 3, earned });
  }

  // --- STRUCTURED DATA ---
  const structuredData = hasStructuredData(html);
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "warn";
    let detail = "No structured data (JSON-LD) found. Add schema for rich snippets.";
    if (structuredData) { earned = 5; status = "pass"; detail = "JSON-LD structured data detected."; }
    checks.push({ label: "Structured Data (Schema)", status, detail, category: "technical", points: 5, earned });
  }

  // --- OPEN GRAPH ---
  const ogTitle = extractMetaContent(html, "og:title");
  const ogDesc = extractMetaContent(html, "og:description");
  const ogImage = extractMetaContent(html, "og:image");
  {
    let earned = 0;
    const present = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
    let status: "pass" | "warn" | "fail" = "fail";
    let detail = "No Open Graph tags found.";
    if (present === 3) { earned = 8; status = "pass"; detail = "Complete OG tags (title, description, image)."; }
    else if (present > 0) { earned = Math.round(8 * present / 3); status = "warn"; detail = `${present}/3 OG tags present.`; }
    checks.push({ label: "Open Graph Tags", status, detail, category: "social", points: 8, earned });
  }

  // --- TWITTER CARD ---
  const twitterCard = extractMetaContent(html, "twitter:card");
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "warn";
    let detail = "No Twitter Card tags found.";
    if (twitterCard) { earned = 5; status = "pass"; detail = `Twitter card: ${twitterCard}`; }
    checks.push({ label: "Twitter Card", status, detail, category: "social", points: 5, earned });
  }

  // --- LANG ATTRIBUTE ---
  const lang = extractLang(html);
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "warn";
    let detail = "No lang attribute on <html>.";
    if (lang) { earned = 4; status = "pass"; detail = `Language: ${lang}`; }
    checks.push({ label: "HTML Lang Attribute", status, detail, category: "technical", points: 4, earned });
  }

  // --- URL STRUCTURE ---
  const urlDepth = getUrlDepth(finalUrl);
  const urlHasQuery = getUrlHasQuery(finalUrl);
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "pass";
    let detail = `URL depth: ${urlDepth} levels.`;
    if (urlDepth <= 3 && !urlHasQuery) { earned = 5; status = "pass"; detail += " Clean URL structure."; }
    else if (urlDepth <= 3 && urlHasQuery) { earned = 3; status = "warn"; detail += " Has query parameters — consider clean URLs."; }
    else { earned = 2; status = "warn"; detail += ` Deep path${urlHasQuery ? " with query params" : ""}. Consider flattening.`; }
    checks.push({ label: "URL Structure", status, detail, category: "technical", points: 5, earned });
  }

  // --- LINK STRUCTURE ---
  const links = getLinksInfo(html, finalUrl);
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "warn";
    let detail = "No internal links found.";
    if (links.internal > 0 && links.external > 0) {
      earned = 7; status = "pass"; detail = `${links.internal} internal, ${links.external} external links.`;
    } else if (links.internal > 0) {
      earned = 5; status = "pass"; detail = `${links.internal} internal links.`;
    } else if (links.total > 0) {
      earned = 3; status = "warn"; detail = `${links.external} external, 0 internal links.`;
    }
    checks.push({ label: "Link Structure", status, detail, category: "content", points: 7, earned });
  }

  // --- PERFORMANCE / LOAD TIME ---
  const loadSeconds = elapsedMs / 1000;
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "fail";
    let detail = "";
    if (loadSeconds < 1.0) { earned = 10; status = "pass"; detail = `Loaded in ${loadSeconds.toFixed(2)}s. Excellent.`; }
    else if (loadSeconds < 2.5) { earned = 7; status = "pass"; detail = `Loaded in ${loadSeconds.toFixed(2)}s. Good.`; }
    else if (loadSeconds < 4.0) { earned = 5; status = "warn"; detail = `Loaded in ${loadSeconds.toFixed(2)}s. Could be faster.`; }
    else { earned = 2; status = "fail"; detail = `Loaded in ${loadSeconds.toFixed(2)}s. Slow — needs optimization.`; }
    checks.push({ label: "Load Time", status, detail, category: "performance", points: 10, earned });
  }

  // --- HTML SIZE ---
  const htmlBytes = new TextEncoder().encode(html).length;
  const htmlKb = htmlBytes / 1024;
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "pass";
    let detail = `HTML size: ${htmlKb.toFixed(1)} KB.`;
    if (htmlKb < 100) { earned = 4; status = "pass"; }
    else if (htmlKb < 500) { earned = 3; status = "warn"; detail += " Consider minifying."; }
    else { earned = 1; status = "fail"; detail += " Very large — minify and reduce."; }
    checks.push({ label: "HTML Page Size", status, detail, category: "performance", points: 4, earned });
  }

  // --- TEXT-TO-HTML RATIO ---
  let contentRatioScore: number | null = null;
  {
    let earned = 0;
    let status: "pass" | "warn" | "fail" = "warn";
    let detail = "";
    if (htmlBytes > 0) {
      const textBytes = new TextEncoder().encode(bodyText).length;
      const ratio = (textBytes / htmlBytes) * 100;
      contentRatioScore = Math.round(ratio * 10) / 10;
      if (ratio >= 15 && ratio <= 50) { earned = 4; status = "pass"; detail = `Text-to-HTML ratio: ${contentRatioScore}%. Healthy.`; }
      else if (ratio > 0) { earned = 2; status = "warn"; detail = `Text-to-HTML ratio: ${contentRatioScore}%. Ideal is 15-50%.`; }
      else { earned = 0; status = "fail"; detail = "No visible text content relative to HTML."; }
    } else {
      detail = "Unable to calculate text-to-HTML ratio.";
    }
    checks.push({ label: "Text-to-HTML Ratio", status, detail, category: "content", points: 4, earned });
  }

  const totalPossible = checks.reduce((s, c) => s + c.points, 0);
  const totalEarned = checks.reduce((s, c) => s + c.earned, 0);
  const score = Math.round((totalEarned / totalPossible) * 100);

  const summary = {
    title: title || null,
    description: desc,
    canonical,
    og: { title: ogTitle, description: ogDesc, image: ogImage },
    headings,
    images: imgInfo,
    links,
    loadTime: `${loadSeconds.toFixed(2)}s`,
    htmlSizeKb: Math.round(htmlKb * 10) / 10,
    htmlLang: lang,
    robots: robots,
    viewport: viewport,
    https: isHttps,
    finalUrl,
    wordCount,
    favicon,
    structuredData,
    urlHasQuery,
    urlDepth,
    contentRatioScore,
  };

  return { score, checks, summary };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json() as AuditRequest;
    const targetUrl = normalizeUrl(body.url);
    const email = body.email?.trim() || null;

    let fetchResult;
    try {
      fetchResult = await fetchWithTiming(targetUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown fetch error";
      return new Response(JSON.stringify({
        error: `Could not fetch ${targetUrl}. ${message}. Check the URL and that the site is publicly accessible.`,
      }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { res, html, elapsedMs } = fetchResult;

    if (!res.ok) {
      return new Response(JSON.stringify({
        error: `Site responded with HTTP ${res.status} ${res.statusText}.`,
      }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return new Response(JSON.stringify({
        error: `URL returned non-HTML content (${contentType}). SEO analysis requires an HTML page.`,
      }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { score, checks, summary } = buildReport(targetUrl, html, res, elapsedMs);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("VITE_SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && serviceKey) {
      try {
        const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
        await admin.from("seo_audits").insert({
          url: targetUrl,
          email,
          score,
          report: { checks, summary } as unknown as Record<string, unknown>,
        });
      } catch (dbErr) {
        console.warn("Failed to persist audit:", dbErr);
      }
    }

    return new Response(JSON.stringify({
      url: targetUrl,
      score,
      checks,
      summary,
      overallStatus: scoreToStatus(score),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
