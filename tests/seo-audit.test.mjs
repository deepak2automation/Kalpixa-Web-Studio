import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeHtml, isPrivateAddress, normalizeAuditUrl } from '../lib/seo-audit.mjs';

test('normalizes a public URL and removes fragments', () => { assert.equal(normalizeAuditUrl('example.com/path#part'), 'https://example.com/path'); });
test('rejects unsupported URL credentials and ports', () => { assert.throws(() => normalizeAuditUrl('https://user:pass@example.com')); assert.throws(() => normalizeAuditUrl('https://example.com:8443')); });
test('identifies private and reserved network addresses', () => { for (const value of ['127.0.0.1', '10.1.2.3', '169.254.1.1', '172.16.0.1', '192.168.1.1', '::1', 'fd00::1']) assert.equal(isPrivateAddress(value), true, value); assert.equal(isPrivateAddress('93.184.216.34'), false); });
test('calculates a report from the returned HTML', () => {
  const words = 'useful content '.repeat(170);
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Premium Website Strategy for Growing Brands</title><meta name="description" content="A complete and practical website strategy for growing brands that need better visibility, trust, speed and qualified enquiries."><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="index, follow"><meta property="og:title" content="Title"><meta property="og:description" content="Description"><meta property="og:image" content="image.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="canonical" href="https://example.com/"><link rel="icon" href="/favicon.svg"><script type="application/ld+json">{}</script></head><body><h1>Strategy</h1><h2>Approach</h2><a href="/services">Services</a><img src="x.jpg" alt="Example">${words}</body></html>`;
  const report = analyzeHtml({ html, finalUrl: 'https://example.com/', elapsedMs: 300, contentLength: html.length, siteSignals: { robots: true, sitemap: true } });
  assert.equal(report.score, 100);
  assert.equal(report.summary.h1Count, 1);
  assert.equal(report.checks.length, 21);
});
test('reports missing fundamentals from thin HTML', () => { const report = analyzeHtml({ html: '<html><body>Hello</body></html>', finalUrl: 'http://example.com/', elapsedMs: 5000, contentLength: 31 }); assert.ok(report.score < 40); assert.ok(report.checks.some((check) => check.status === 'fail')); });
