import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { Agent, fetch } from 'undici';
import { isPrivateAddress, normalizeAuditUrl } from './seo-audit.mjs';

export class AuditError extends Error {}
const agentName = 'KalpixaSEOAnalyzer/3.0 (+https://kalpixa.com/seo-tools/)';

async function abortable(promise, signal) {
  signal.throwIfAborted();
  let abort;
  const stopped = new Promise((_, reject) => { abort = () => reject(signal.reason); signal.addEventListener('abort', abort, { once: true }); });
  try { return await Promise.race([promise, stopped]); }
  finally { signal.removeEventListener('abort', abort); }
}

export async function resolvePublicTarget(value, signal, resolveHost = lookup) {
  const url = new URL(normalizeAuditUrl(value));
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/gu, '').replace(/\.$/u, '');
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local') || hostname.endsWith('.internal')) throw new AuditError('Only public websites can be analyzed.');
  const addresses = isIP(hostname) ? [{ address: hostname, family: isIP(hostname) }] : await abortable(resolveHost(hostname, { all: true, verbatim: true }), signal);
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) throw new AuditError('Only public websites can be analyzed.');
  return { url: url.href, hostname, addresses };
}

// The actual socket uses these exact vetted addresses. There is no second DNS lookup.
export function createPinnedLookup(target) {
  return (hostname, options, callback) => {
    if (hostname.toLowerCase().replace(/\.$/u, '') !== target.hostname) return callback(new AuditError('The destination changed during connection.'));
    const family = typeof options === 'number' ? options : options.family;
    const addresses = target.addresses.filter((address) => !family || address.family === family);
    if (!addresses.length) return callback(new AuditError('No compatible public network address was found.'));
    if (options.all) callback(null, addresses);
    else callback(null, addresses[0].address, addresses[0].family);
  };
}

export async function fetchPublicDocument(value, { signal, maxBytes = 1_000_000, htmlOnly = false, resolveHost = lookup, transport = fetch, dispatcherFactory = (target) => new Agent({ connect: { lookup: createPinnedLookup(target), timeout: 5000 }, autoSelectFamily: true, maxHeaderSize: 16384 }) }) {
  let current = value;
  for (let redirect = 0; redirect <= 4; redirect += 1) {
    signal.throwIfAborted();
    const target = await resolvePublicTarget(current, signal, resolveHost);
    const dispatcher = dispatcherFactory(target);
    let response;
    try {
      response = await transport(target.url, { dispatcher, signal, redirect: 'manual', headers: { accept: htmlOnly ? 'text/html,application/xhtml+xml;q=0.9' : '*/*', 'user-agent': agentName } });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        if (redirect === 4) throw new AuditError('The website redirected too many times.');
        const location = response.headers.get('location');
        if (!location) throw new AuditError('The website returned an invalid redirect.');
        current = new URL(location, target.url).href;
        continue;
      }
      if (!response.ok) throw new AuditError(`The website returned HTTP ${response.status}.`);
      const contentType = response.headers.get('content-type') ?? '';
      if (htmlOnly && !/^(text\/html|application\/xhtml\+xml)\b/iu.test(contentType)) throw new AuditError('The URL did not return an HTML page.');
      if (Number(response.headers.get('content-length')) > maxBytes) throw new AuditError('The response exceeds the audit size limit (1 MB for HTML).');
      const chunks = [];
      let bytes = 0;
      if (response.body) {
        const reader = response.body.getReader();
        try {
          while (true) {
            const { done, value: chunk } = await reader.read();
            if (done) break;
            bytes += chunk.byteLength;
            if (bytes > maxBytes) throw new AuditError('The response exceeds the audit size limit (1 MB for HTML).');
            chunks.push(chunk);
          }
        } finally { reader.releaseLock(); }
      }
      let decoder;
      try { decoder = new TextDecoder(contentType.match(/charset=["']?([^\s;"']+)/iu)?.[1] ?? 'utf-8'); } catch { decoder = new TextDecoder(); }
      return { url: target.url, text: decoder.decode(Buffer.concat(chunks)), bytes, headers: response.headers };
    } finally {
      if (response?.body && !response.body.locked) await response.body.cancel().catch(() => {});
      await dispatcher.destroy();
    }
  }
  throw new AuditError('The audit could not be completed.');
}

export function createRateLimiter({ limit = 10, windowMs = 600_000, capacity = 1000, now = Date.now } = {}) {
  const windows = new Map();
  return (key) => {
    const time = now();
    for (const [ip, entry] of windows) if (entry.expires <= time) windows.delete(ip);
    const entry = windows.get(key);
    if (entry) { if (entry.count >= limit) return true; entry.count += 1; return false; }
    // Bound memory and fail closed while the instance is saturated.
    if (windows.size >= capacity) return true;
    windows.set(key, { count: 1, expires: time + windowMs });
    return false;
  };
}

export function validSiteSignal(document, type) {
  if (!document || /<\s*!?\s*(?:doctype\s+html|html|body)\b/iu.test(document.text)) return false;
  return type === 'robots' ? /^\s*user-agent\s*:\s*\S+/imu.test(document.text) : /<(?:urlset|sitemapindex)\b[^>]*xmlns\s*=\s*["']https?:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/iu.test(document.text);
}
