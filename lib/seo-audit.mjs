import { isIP } from 'node:net';

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2]?.trim() ?? '';
};
const tags = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];
const meta = (html, key) => {
  for (const tag of tags(html, 'meta')) {
    if ([attr(tag, 'name'), attr(tag, 'property')].some((value) => value.toLowerCase() === key.toLowerCase())) return attr(tag, 'content');
  }
  return '';
};
const link = (html, rel) => tags(html, 'link').find((tag) => attr(tag, 'rel').toLowerCase().split(/\s+/u).includes(rel)) ?? '';
const text = (html) => html.replace(/<script\b[\s\S]*?<\/script>/giu, ' ').replace(/<style\b[\s\S]*?<\/style>/giu, ' ').replace(/<[^>]+>/gu, ' ').replace(/&(?:nbsp|amp|quot|lt|gt);/giu, ' ').replace(/\s+/gu, ' ').trim();

export function normalizeAuditUrl(input) {
  if (typeof input !== 'string' || !input.trim()) throw new Error('Enter a website URL.');
  if (input.length > 2048) throw new Error('The URL is too long.');
  const candidate = /^https?:\/\//iu.test(input.trim()) ? input.trim() : `https://${input.trim()}`;
  let url;
  try { url = new URL(candidate); } catch { throw new Error('Enter a valid public website URL.'); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP and HTTPS websites can be analyzed.');
  if (url.username || url.password) throw new Error('URLs containing credentials are not supported.');
  if (url.port && !((url.protocol === 'http:' && url.port === '80') || (url.protocol === 'https:' && url.port === '443'))) throw new Error('Only standard website ports are supported.');
  url.hash = '';
  return url.href;
}

export function isPrivateAddress(address) {
  const value = address.toLowerCase().split('%')[0];
  if (isIP(value) === 4) {
    const numeric = value.split('.').reduce((total, part) => ((total << 8) | Number(part)) >>> 0, 0);
    const inCidr = (base, prefix) => {
      const baseNumber = base.split('.').reduce((total, part) => ((total << 8) | Number(part)) >>> 0, 0);
      const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
      return (numeric & mask) === (baseNumber & mask);
    };
    return [['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.0.0.0',24],['192.0.2.0',24],['192.88.99.0',24],['192.168.0.0',16],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',4],['240.0.0.0',4]].some(([base,prefix]) => inCidr(base, prefix));
  }
  if (isIP(value) === 6) {
    if (value === '::' || value === '::1' || value.startsWith('fc') || value.startsWith('fd') || /^fe[89ab]/u.test(value) || value.startsWith('ff') || value.startsWith('2001:db8:')) return true;
    const mapped = value.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/u);
    if (mapped) return isPrivateAddress(mapped[1]);
    const mappedHex = value.match(/^::ffff:([\da-f]{1,4}):([\da-f]{1,4})$/u);
    if (mappedHex) { const numeric = (Number.parseInt(mappedHex[1], 16) << 16) | Number.parseInt(mappedHex[2], 16); return isPrivateAddress([numeric >>> 24, (numeric >>> 16) & 255, (numeric >>> 8) & 255, numeric & 255].join('.')); }
    return false;
  }
  return true;
}

export function analyzeHtml({ html, finalUrl, elapsedMs, contentLength, siteSignals = {} }) {
  const checks = [];
  const add = (label, category, points, earned, detail) => checks.push({ label, category, points, earned, status: earned === points ? 'pass' : earned === 0 ? 'fail' : 'warn', detail });
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/iu)?.[1]?.replace(/\s+/gu, ' ').trim() ?? '';
  const description = meta(html, 'description');
  const h1Count = tags(html, 'h1').length;
  const h2Count = tags(html, 'h2').length;
  const h3Count = tags(html, 'h3').length;
  const images = tags(html, 'img');
  const imagesMissingAlt = images.filter((tag) => !/\salt\s*=/iu.test(tag)).length;
  const visibleText = text(html);
  const wordCount = visibleText ? visibleText.split(/\s+/u).length : 0;
  const viewport = meta(html, 'viewport');
  const canonicalTag = link(html, 'canonical');
  const canonical = attr(canonicalTag, 'href');
  const robots = meta(html, 'robots');
  const ogFound = ['og:title', 'og:description', 'og:image'].filter((key) => meta(html, key)).length;
  const structuredData = /<script\b[^>]*type\s*=\s*(["'])application\/ld\+json\1[^>]*>/iu.test(html);
  const language = html.match(/<html\b[^>]*\slang\s*=\s*(["'])(.*?)\1/iu)?.[2] ?? '';
  const size = contentLength || new TextEncoder().encode(html).length;
  const favicon = Boolean(link(html, 'icon') || link(html, 'shortcut'));
  const charset = meta(html, 'charset') || tags(html, 'meta').map((tag) => attr(tag, 'charset')).find(Boolean) || '';
  const twitterCard = meta(html, 'twitter:card');
  const anchors = tags(html, 'a').map((tag) => attr(tag, 'href')).filter(Boolean);
  const pageOrigin = new URL(finalUrl).origin;
  let internalLinks = 0;
  let externalLinks = 0;
  for (const href of new Set(anchors)) {
    try { const target = new URL(href, finalUrl); if (!['http:', 'https:'].includes(target.protocol)) continue; if (target.origin === pageOrigin) internalLinks += 1; else externalLinks += 1; } catch { /* malformed links are ignored */ }
  }

  add('Title tag', 'Content', 10, !title ? 0 : title.length >= 30 && title.length <= 60 ? 10 : 6, !title ? 'No title tag was found.' : `${title.length} characters; the recommended range is 30–60.`);
  add('Meta description', 'Content', 10, !description ? 0 : description.length >= 70 && description.length <= 160 ? 10 : 6, !description ? 'No meta description was found.' : `${description.length} characters; the recommended range is 70–160.`);
  add('Primary heading', 'Content', 8, h1Count === 1 ? 8 : h1Count > 1 ? 4 : 0, h1Count === 1 ? 'One H1 was found.' : `${h1Count} H1 elements were found; use one clear primary heading.`);
  add('Heading structure', 'Content', 5, h2Count > 0 ? 5 : h3Count > 0 ? 2 : 0, `${h1Count} H1, ${h2Count} H2 and ${h3Count} H3 elements were found.`);
  add('Image alt attributes', 'Content', 7, imagesMissingAlt === 0 ? 7 : Math.max(0, Math.round(7 * (1 - imagesMissingAlt / images.length))), images.length ? `${imagesMissingAlt} of ${images.length} images are missing an alt attribute.` : 'No image elements were found.');
  add('Content depth', 'Content', 6, wordCount >= 300 ? 6 : wordCount >= 100 ? 4 : wordCount > 0 ? 2 : 0, `${wordCount} visible words were detected.`);
  add('HTTPS', 'Technical', 8, finalUrl.startsWith('https://') ? 8 : 0, finalUrl.startsWith('https://') ? 'The final page uses HTTPS.' : 'The final page does not use HTTPS.');
  add('Mobile viewport', 'Technical', 7, /width\s*=\s*device-width/iu.test(viewport) ? 7 : 0, viewport ? `Viewport: ${viewport}` : 'No mobile viewport meta tag was found.');
  add('Canonical URL', 'Technical', 5, canonical ? 5 : 0, canonical ? `Canonical: ${canonical}` : 'No canonical link was found.');
  add('Indexing directive', 'Technical', 5, /noindex/iu.test(robots) ? 0 : robots ? 5 : 3, /noindex/iu.test(robots) ? 'The page contains a noindex directive.' : robots ? `Robots: ${robots}` : 'No robots meta tag was found; browsers use the default index/follow behavior.');
  add('Open Graph metadata', 'Social', 7, Math.round(7 * ogFound / 3), `${ogFound} of 3 core Open Graph properties were found.`);
  add('Structured data', 'Technical', 5, structuredData ? 5 : 0, structuredData ? 'JSON-LD structured data was detected.' : 'No JSON-LD structured data was detected.');
  add('Document language', 'Technical', 4, language ? 4 : 0, language ? `Document language: ${language}` : 'No language attribute was found on the HTML element.');
  add('Server response time', 'Performance', 8, elapsedMs < 1000 ? 8 : elapsedMs < 2500 ? 6 : elapsedMs < 4000 ? 3 : 0, `The HTML response completed in ${(elapsedMs / 1000).toFixed(2)} seconds from the audit region.`);
  add('HTML document size', 'Performance', 5, size < 100000 ? 5 : size < 500000 ? 3 : 0, `The HTML response was ${(size / 1024).toFixed(1)} KB.`);
  add('Character encoding', 'Technical', 2, charset ? 2 : 0, charset ? `Character encoding: ${charset}` : 'No explicit character encoding was detected.');
  add('Favicon', 'Technical', 3, favicon ? 3 : 0, favicon ? 'A favicon link was detected.' : 'No favicon link was detected.');
  add('Twitter card', 'Social', 3, twitterCard ? 3 : 0, twitterCard ? `Twitter card: ${twitterCard}` : 'No Twitter card metadata was detected.');
  add('Internal link structure', 'Content', 4, internalLinks > 0 ? 4 : 0, `${internalLinks} unique internal and ${externalLinks} unique external HTTP links were detected.`);
  add('robots.txt', 'Technical', 4, siteSignals.robots === true ? 4 : 0, siteSignals.robots === true ? 'A reachable robots.txt file was found.' : 'No reachable robots.txt file was confirmed.');
  add('XML sitemap', 'Technical', 4, siteSignals.sitemap === true ? 4 : 0, siteSignals.sitemap === true ? 'A reachable /sitemap.xml file was found.' : 'No reachable /sitemap.xml file was confirmed.');

  const totalPoints = checks.reduce((total, check) => total + check.points, 0);
  const earnedPoints = checks.reduce((total, check) => total + check.earned, 0);

  return {
    score: Math.max(0, Math.min(100, Math.round(earnedPoints / totalPoints * 100))),
    checks,
    summary: { finalUrl, title: title || null, description: description || null, h1Count, h2Count, h3Count, images: images.length, imagesMissingAlt, wordCount, responseTimeMs: elapsedMs, htmlSizeBytes: size, https: finalUrl.startsWith('https://'), canonical: canonical || null, language: language || null, structuredData, favicon, twitterCard: twitterCard || null, internalLinks, externalLinks, robots: siteSignals.robots === true, sitemap: siteSignals.sitemap === true },
    auditedAt: new Date().toISOString(),
  };
}
