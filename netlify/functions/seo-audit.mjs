import { analyzeHtml, normalizeAuditUrl } from '../../lib/seo-audit.mjs';
import { AuditError, createRateLimiter, fetchPublicDocument, validSiteSignal } from '../../lib/public-fetch.mjs';

const json = (statusCode, body, extraHeaders = {}) => ({ statusCode, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extraHeaders }, body: JSON.stringify(body) });

export function createHandler({ fetchDocument = fetchPublicDocument, rateLimited = createRateLimiter(), timeoutMs = 12_000 } = {}) {
  return async (event) => {
    if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' }, { allow: 'POST' });
    const ip = String(event.headers?.['x-nf-client-connection-ip'] || 'unknown').slice(0, 80);
    if (rateLimited(ip)) return json(429, { error: 'Audit limit reached. Please wait a few minutes and try again.' }, { 'retry-after': '600' });
    if (!event.body || event.isBase64Encoded || Buffer.byteLength(event.body, 'utf8') > 4096) return json(400, { error: 'A valid URL is required.' });
    let submitted;
    try { submitted = normalizeAuditUrl(JSON.parse(event.body)?.url); }
    catch (error) { return json(400, { error: error instanceof SyntaxError ? 'The request body is invalid.' : error.message }); }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const started = Date.now();
    try {
      const document = await fetchDocument(submitted, { signal: controller.signal, htmlOnly: true });
      const elapsedMs = Date.now() - started;
      const origin = new URL(document.url).origin;
      const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(3000)]);
      const signals = await Promise.allSettled(['robots.txt', 'sitemap.xml'].map((path) =>
        fetchDocument(new URL('/' + path, origin).href, { signal, maxBytes: 200_000 })));
      const siteSignals = {
        robots: signals[0].status === 'fulfilled' && validSiteSignal(signals[0].value, 'robots'),
        sitemap: signals[1].status === 'fulfilled' && validSiteSignal(signals[1].value, 'sitemap'),
      };
      const report = analyzeHtml({ html: document.text, finalUrl: document.url, elapsedMs, contentLength: document.bytes, siteSignals });
      // HTTP-level noindex is as important as the HTML meta directive.
      const robotsHeader = document.headers?.get('x-robots-tag') ?? '';
      if (/\b(?:noindex|none)\b/iu.test(robotsHeader)) {
        const check = report.checks.find((item) => item.label === 'Indexing directive');
        check.earned = 0;
        check.status = 'fail';
        check.detail = 'The server returned an X-Robots-Tag noindex directive.';
        report.score = Math.round(100 * report.checks.reduce((sum, item) => sum + item.earned, 0) / report.checks.reduce((sum, item) => sum + item.points, 0));
      }
      return json(200, report);
    } catch (error) {
      const timedOut = controller.signal.aborted;
      const message = timedOut ? 'The website did not respond within 12 seconds.' : error instanceof AuditError ? error.message : 'The public website could not be reached securely. Check the address and try again.';
      return json(timedOut ? 504 : 422, { error: message });
    } finally { clearTimeout(timer); }
  };
}

export const handler = createHandler();
