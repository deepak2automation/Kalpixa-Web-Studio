import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { analyzeHtml, isPrivateAddress, normalizeAuditUrl } from '../../lib/seo-audit.mjs';

const MAX_HTML_BYTES = 1_000_000;
const MAX_REDIRECTS = 4;
const TIMEOUT_MS = 12_000;
const requestWindows = new Map();

const json = (statusCode, body, extraHeaders = {}) => ({ statusCode, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extraHeaders }, body: JSON.stringify(body) });

async function assertPublicUrl(value) {
  const normalized = normalizeAuditUrl(value);
  const url = new URL(normalized);
  const hostname = url.hostname.toLowerCase().replace(/\.$/u, '');
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local')) throw new Error('Only public websites can be analyzed.');
  const addresses = isIP(hostname) ? [{ address: hostname }] : await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) throw new Error('Only public websites can be analyzed.');
  return normalized;
}

async function readHtml(response) {
  if (!response.body) return '';
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let result = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_HTML_BYTES) { await reader.cancel(); throw new Error('The HTML response is larger than the 1 MB audit limit.'); }
    result += decoder.decode(value, { stream: true });
  }
  return result + decoder.decode();
}

function rateLimited(event) {
  const ip = event.headers?.['x-nf-client-connection-ip'] || event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const active = (requestWindows.get(ip) || []).filter((time) => now - time < 10 * 60_000);
  active.push(now);
  requestWindows.set(ip, active);
  if (requestWindows.size > 500) for (const [key, values] of requestWindows) if (!values.some((time) => now - time < 10 * 60_000)) requestWindows.delete(key);
  return active.length > 10;
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' }, { allow: 'POST' });
  if (rateLimited(event)) return json(429, { error: 'Audit limit reached. Please wait a few minutes and try again.' }, { 'retry-after': '600' });
  if (!event.body || event.body.length > 4096) return json(400, { error: 'A valid URL is required.' });

  let submitted;
  try { submitted = JSON.parse(event.body).url; } catch { return json(400, { error: 'The request body is invalid.' }); }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const started = Date.now();
  try {
    let current = await assertPublicUrl(submitted);
    let response;
    for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
      response = await fetch(current, { redirect: 'manual', signal: controller.signal, headers: { accept: 'text/html,application/xhtml+xml;q=0.9', 'user-agent': 'KalpixaSEOAnalyzer/2.0 (+https://kalpixa.com/seo-tools/)' } });
      if (![301, 302, 303, 307, 308].includes(response.status)) break;
      if (redirects === MAX_REDIRECTS) throw new Error('The website redirected too many times.');
      const location = response.headers.get('location');
      if (!location) throw new Error('The website returned an invalid redirect.');
      current = await assertPublicUrl(new URL(location, current).href);
    }
    if (!response?.ok) throw new Error(`The website returned HTTP ${response?.status ?? 'unknown'}.`);
    const contentType = response.headers.get('content-type') || '';
    if (!/text\/html|application\/xhtml\+xml/iu.test(contentType)) throw new Error('The URL did not return an HTML page.');
    const declaredSize = Number(response.headers.get('content-length') || 0);
    if (declaredSize > MAX_HTML_BYTES) throw new Error('The HTML response is larger than the 1 MB audit limit.');
    const html = await readHtml(response);
    const htmlElapsedMs = Date.now() - started;
    const origin = new URL(response.url || current).origin;
    const [robotsResponse, sitemapResponse] = await Promise.allSettled([
      fetch(new URL('/robots.txt', origin), { redirect: 'manual', signal: controller.signal, headers: { 'user-agent': 'KalpixaSEOAnalyzer/2.0 (+https://kalpixa.com/seo-tools/)' } }),
      fetch(new URL('/sitemap.xml', origin), { redirect: 'manual', signal: controller.signal, headers: { 'user-agent': 'KalpixaSEOAnalyzer/2.0 (+https://kalpixa.com/seo-tools/)' } }),
    ]);
    const siteSignals = {
      robots: robotsResponse.status === 'fulfilled' && robotsResponse.value.ok,
      sitemap: sitemapResponse.status === 'fulfilled' && sitemapResponse.value.ok,
    };
    return json(200, analyzeHtml({ html, finalUrl: response.url || current, elapsedMs: htmlElapsedMs, contentLength: new TextEncoder().encode(html).length, siteSignals }));
  } catch (error) {
    const timedOut = controller.signal.aborted;
    const message = timedOut ? 'The website did not respond within 12 seconds.' : error instanceof Error ? error.message : 'The audit could not be completed.';
    return json(timedOut ? 504 : 422, { error: message });
  } finally { clearTimeout(timer); }
};
