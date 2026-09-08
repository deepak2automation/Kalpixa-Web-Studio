import { parse } from 'parse5';
import ipaddr from 'ipaddr.js';

const attr = (tag, name) => tag?.attrs?.find((item) => item.name === name)?.value.trim() ?? '';
const tags = (document, name) => document.elements.get(name) ?? [];
const meta = (document, key) => {
  for (const tag of tags(document, 'meta')) {
    if ([attr(tag, 'name'), attr(tag, 'property')].some((value) => value.toLowerCase() === key.toLowerCase())) return attr(tag, 'content');
  }
  return '';
};
const link = (document, rel) => tags(document, 'link').find((tag) => attr(tag, 'rel').toLowerCase().split(/\s+/u).includes(rel));
const nodeText = (node) => (node?.childNodes ?? []).filter((child) => child.nodeName === '#text').map((child) => child.value).join('').trim();
function readDocument(source) {
  const elements = new Map();
  const words = [];
  const stack = [{ node: parse(source), excluded: false }];
  while (stack.length) {
    const { node, excluded } = stack.pop();
    if (node.tagName) {
      const group = elements.get(node.tagName) ?? [];
      group.push(node);
      elements.set(node.tagName, group);
    }
    const hidden = excluded || ['head', 'script', 'style', 'template', 'noscript'].includes(node.tagName) || node.attrs?.some((item) => item.name === 'hidden');
    if (!hidden && node.nodeName === '#text') words.push(node.value);
    for (const child of [...(node.childNodes ?? [])].reverse()) stack.push({ node: child, excluded: hidden });
  }
  return { elements, text: words.join(' ').replace(/\s+/gu, ' ').trim() };
}
function hasStructuredData(value) {
  const stack = [value];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) { for (const child of item) stack.push(child); }
    else if (item && typeof item === 'object') {
      if (typeof item['@type'] === 'string' && item['@type'].trim()) return true;
      if (Array.isArray(item['@type']) && item['@type'].some((type) => typeof type === 'string' && type.trim())) return true;
      if (Array.isArray(item['@graph'])) for (const child of item['@graph']) stack.push(child);
    }
  }
  return false;
}

export function normalizeAuditUrl(input) {
  if (typeof input !== 'string' || !input.trim()) throw new Error('Enter a website URL.');
  if (input.length > 2048) throw new Error('The URL is too long.');
  if (/^(?!https?:\/\/)[a-z][a-z\d+.-]*:/iu.test(input.trim()) || input.trim().startsWith('//')) throw new Error('Only HTTP and HTTPS websites can be analyzed.');
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
  if (typeof address !== 'string' || address.includes('%') || !ipaddr.isValid(address)) return true;
  const parsed = ipaddr.parse(address);
  if (parsed.range() !== 'unicast') return true;
  // Only ordinary global-unicast IPv6; mapped, NAT64 and transition ranges fail closed.
  return parsed.kind() === 'ipv6' && !parsed.match(ipaddr.parse('2000::'), 3);
}

export function analyzeHtml({ html, finalUrl, elapsedMs, contentLength, siteSignals = {} }) {
  const source = html;
  html = readDocument(source);
  const checks = [];
  const add = (label, category, points, earned, detail) => checks.push({ label, category, points, earned, status: earned === points ? 'pass' : earned === 0 ? 'fail' : 'warn', detail });
  const title = nodeText(tags(html, 'title')[0]).replace(/\s+/gu, ' ');
  const description = meta(html, 'description');
  const h1Count = tags(html, 'h1').length;
  const h2Count = tags(html, 'h2').length;
  const h3Count = tags(html, 'h3').length;
  const images = tags(html, 'img');
  const imagesMissingAlt = images.filter((tag) => !tag.attrs.some((item) => item.name === 'alt')).length;
  const visibleText = html.text;
  const wordCount = visibleText ? visibleText.split(/\s+/u).length : 0;
  const viewport = meta(html, 'viewport');
  const canonicalTag = link(html, 'canonical');
  let canonical = attr(canonicalTag, 'href');
  try { if (!['http:', 'https:'].includes(new URL(canonical, finalUrl).protocol)) canonical = ''; } catch { canonical = ''; }
  const robots = meta(html, 'robots');
  const ogFound = ['og:title', 'og:description', 'og:image'].filter((key) => meta(html, key)).length;
  const structuredData = tags(html, 'script').some((node) => {
    if (attr(node, 'type').toLowerCase() !== 'application/ld+json') return false;
    try { return hasStructuredData(JSON.parse(nodeText(node))); } catch { return false; }
  });
  const language = attr(tags(html, 'html')[0], 'lang');
  const size = contentLength ?? new TextEncoder().encode(source).length;
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
  add('Content depth', 'Content', 6, wordCount >= 300 ? 6 : wordCount >= 100 ? 4 : wordCount > 0 ? 2 : 0, `${wordCount} body-text words were detected in the HTML; rendered visibility is not evaluated.`);
  add('HTTPS', 'Technical', 8, finalUrl.startsWith('https://') ? 8 : 0, finalUrl.startsWith('https://') ? 'The final page uses HTTPS.' : 'The final page does not use HTTPS.');
  add('Mobile viewport', 'Technical', 7, /width\s*=\s*device-width/iu.test(viewport) ? 7 : 0, viewport ? `Viewport: ${viewport}` : 'No mobile viewport meta tag was found.');
  add('Canonical URL', 'Technical', 5, canonical ? 5 : 0, canonical ? `Canonical: ${canonical}` : 'No canonical link was found.');
  add('Indexing directive', 'Technical', 5, /(?:noindex|\bnone\b)/iu.test(robots) ? 0 : robots ? 5 : 3, /(?:noindex|\bnone\b)/iu.test(robots) ? 'The page contains a noindex directive.' : robots ? `Robots: ${robots}` : 'No robots meta tag was found; search crawlers default to index/follow unless other directives apply.');
  add('Open Graph metadata', 'Social', 7, Math.round(7 * ogFound / 3), `${ogFound} of 3 core Open Graph properties were found.`);
  add('Structured data', 'Technical', 5, structuredData ? 5 : 0, structuredData ? 'Parseable JSON-LD with a type was detected; schema validity and rich-result eligibility are not evaluated.' : 'No parseable, typed JSON-LD was detected.');
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
