import test from 'node:test';
import assert from 'node:assert/strict';
import { createPinnedLookup, createRateLimiter, fetchPublicDocument, resolvePublicTarget, validSiteSignal } from '../lib/public-fetch.mjs';
import { createHandler } from '../netlify/functions/seo-audit.mjs';
import { isReport } from '../lib/seo-report.ts';

const signal = () => AbortSignal.timeout(2000);
const publicDns = async () => [{ address: '93.184.216.34', family: 4 }];
const dispatcherFactory = () => ({ destroy: async () => {} });
const document = { url: 'https://example.com/', text: '<html lang=en><title>Example</title><h1>Example</h1></html>', bytes: 68, headers: new Headers() };
const event = (url = 'example.com') => ({ httpMethod: 'POST', headers: { 'x-nf-client-connection-ip': '198.51.100.1' }, body: JSON.stringify({ url }) });

test('rejects a mixed public/private DNS answer before any connection', async () => {
  await assert.rejects(resolvePublicTarget('https://example.com', signal(), async () => [{ address: '93.184.216.34', family: 4 }, { address: '10.0.0.1', family: 4 }]), /public websites/u);
});
test('normalizes literal IPv6 and blocks loopback without asking DNS', async () => {
  let dns = 0;
  const resolve = async () => { dns += 1; return []; };
  await assert.rejects(resolvePublicTarget('http://[::1]', signal(), resolve), /public websites/u);
  const target = await resolvePublicTarget('https://[2606:4700:4700::1111]', signal(), resolve);
  assert.equal(target.addresses[0].family, 6);
  assert.equal(dns, 0);
});
test('pins the exact validated address and rejects hostname substitution', async () => {
  let calls = 0;
  const target = await resolvePublicTarget('https://example.com', signal(), async () => { calls += 1; return [{ address: calls === 1 ? '93.184.216.34' : '127.0.0.1', family: 4 }]; });
  const lookup = createPinnedLookup(target);
  lookup('example.com', { all: true }, (error, addresses) => { assert.ifError(error); assert.deepEqual(addresses, target.addresses); });
  lookup('evil.example', {}, (error) => assert.match(error.message, /destination changed/u));
  assert.equal(calls, 1);
});
test('DNS waiting is covered by the abort deadline', async () => {
  const controller = new AbortController();
  const task = resolvePublicTarget('https://example.com', controller.signal, () => new Promise(() => {}));
  controller.abort(new Error('deadline reached'));
  await assert.rejects(task, /deadline reached/u);
});
test('redirects cannot escape into a private network and response bodies are cancelled', async () => {
  let calls = 0;
  let cancelled = false;
  await assert.rejects(fetchPublicDocument('https://example.com', { signal: signal(), resolveHost: publicDns, dispatcherFactory, transport: async () => {
    calls += 1;
    return new Response(new ReadableStream({ cancel() { cancelled = true; } }), { status: 302, headers: { location: 'http://127.0.0.1/' } });
  } }), /public websites/u);
  assert.equal(calls, 1);
  assert.equal(cancelled, true);
});
test('caps redirect chains and validates every redirected URL', async () => {
  let calls = 0;
  await assert.rejects(fetchPublicDocument('https://example.com', { signal: signal(), resolveHost: publicDns, dispatcherFactory, transport: async () => { calls += 1; return new Response(null, { status: 302, headers: { location: '/again' } }); } }), /too many/u);
  assert.equal(calls, 5);
});
test('rejects non-HTML, HTTP errors and bodies exceeding the byte limit', async () => {
  for (const [response, pattern] of [[new Response('{}', { headers: { 'content-type': 'application/json' } }), /HTML/u], [new Response('Missing', { status: 404 }), /HTTP 404/u], [new Response('123456789', { headers: { 'content-type': 'text/html' } }), /size limit/u]]) {
    await assert.rejects(fetchPublicDocument('https://example.com', { signal: signal(), resolveHost: publicDns, dispatcherFactory, htmlOnly: true, maxBytes: 8, transport: async () => response }), pattern);
  }
});
test('reads the returned document and destroys its dispatcher', async () => {
  let destroyed = false;
  const result = await fetchPublicDocument('https://example.com', { signal: signal(), resolveHost: publicDns, dispatcherFactory: () => ({ destroy: async () => { destroyed = true; } }), htmlOnly: true, transport: async () => new Response('<html>é</html>', { headers: { 'content-type': 'text/html; charset=utf-8' } }) });
  assert.equal(result.text, '<html>é</html>');
  assert.equal(result.bytes, 15);
  assert.equal(destroyed, true);
});
test('does not treat a soft-404 HTML page as robots or a sitemap', () => {
  assert.equal(validSiteSignal({ text: '<html><body>Welcome</body></html>' }, 'robots'), false);
  assert.equal(validSiteSignal({ text: '<html><body>Welcome</body></html>' }, 'sitemap'), false);
  assert.equal(validSiteSignal({ text: 'User-agent: *\nAllow: /' }, 'robots'), true);
  assert.equal(validSiteSignal({ text: '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>' }, 'sitemap'), true);
});
test('rate-limit state is bounded and expires without recording rejected requests', () => {
  let now = 0;
  const limited = createRateLimiter({ limit: 2, capacity: 2, windowMs: 10, now: () => now });
  assert.equal(limited('a'), false); assert.equal(limited('a'), false);
  for (let i = 0; i < 100; i += 1) assert.equal(limited('a'), true);
  assert.equal(limited('b'), false); assert.equal(limited('c'), true);
  now = 11;
  assert.equal(limited('c'), false);
});
test('handler rejects malformed bodies, methods and unsupported URLs', async () => {
  const handler = createHandler({ rateLimited: () => false });
  assert.equal((await handler({ httpMethod: 'GET' })).statusCode, 405);
  for (const body of ['null', '{}', '{', JSON.stringify({ url: 'ftp://example.com' }), 'x'.repeat(4097)]) assert.equal((await handler({ ...event(), body })).statusCode, 400);
});
test('handler returns a real report and honors HTTP-level noindex', async () => {
  const handler = createHandler({ fetchDocument: async (url) => ({ ...document, url, headers: new Headers({ 'x-robots-tag': 'noindex' }) }) });
  const response = await handler(event());
  const report = JSON.parse(response.body);
  assert.equal(response.statusCode, 200);
  assert.equal(isReport(report), true);
  assert.equal(report.summary.robots, false);
  assert.equal(report.checks.find((check) => check.label === 'Indexing directive').earned, 0);
});
test('handler provides bounded rate-limit and timeout failures without internal details', async () => {
  assert.equal((await createHandler({ rateLimited: () => true })(event())).statusCode, 429);
  const handler = createHandler({ timeoutMs: 5, fetchDocument: (_, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true })) });
  assert.equal((await handler(event())).statusCode, 504);
  const failure = await createHandler({ fetchDocument: async () => { throw new Error('Internal secret system path'); } })(event());
  assert.equal(failure.statusCode, 422);
  assert.doesNotMatch(failure.body, /secret/u);
});
test('client report guard rejects malformed and dangerous success payloads', () => {
  for (const payload of [null, {}, [], { score: 100, summary: {} }, { score: NaN, checks: [] }]) assert.equal(isReport(payload), false);
});
