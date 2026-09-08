import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProjectForm } from '../lib/form-validation.mjs';
import { analyzeHtml, isPrivateAddress, normalizeAuditUrl } from '../lib/seo-audit.mjs';

const enquiry = { name: 'Example Client', email: 'client@example.com', service: 'Website & Platform', message: 'Please preserve the details of my website project.', consent: 'yes' };

test('rejects excessive input instead of silently truncating a project brief', () => {
  const result = validateProjectForm({ ...enquiry, name: 'a'.repeat(101), message: 'a'.repeat(3001) });
  assert.ok(result.errors.name);
  assert.ok(result.errors.message);
});
test('preserves paragraphs in the submitted project brief', () => {
  const message = 'First project requirement.\n\nSecond project requirement.';
  assert.equal(validateProjectForm({ ...enquiry, message }).data.message, message);
});
test('requires real digits in an optional phone number', () => {
  assert.ok(validateProjectForm({ ...enquiry, phone: '+-------' }).errors.phone);
});
test('rejects non-web schemes rather than treating the scheme as a hostname', () => {
  for (const url of ['ftp://example.com/', 'file:///etc/passwd', 'javascript:alert(1)', '//example.com']) assert.throws(() => normalizeAuditUrl(url), url);
  assert.ok(validateProjectForm({ ...enquiry, website: 'ftp://example.com/' }).errors.website);
});
test('blocks alternate IPv6 representations and transition addresses', () => {
  for (const address of ['0:0:0:0:0:0:0:1', '0:0:0:0:0:ffff:7f00:1', '64:ff9b::7f00:1', '2002:7f00:1::']) assert.equal(isPrivateAddress(address), true, address);
  assert.equal(isPrivateAddress('2606:4700:4700::1111'), false);
});
test('parses HTML attributes and entities without counting commented or scripted markup', () => {
  const html = '<html lang=en><head><title>Strategy &amp; Growth</title><meta name=description content="A real description"><script>const example = "<h1>Not a heading</h1>";</script></head><body><!-- <h1>Not a heading</h1><img src=x> --><h1>Actual heading</h1><p>Real body text.</p></body></html>';
  const { summary } = analyzeHtml({ html, finalUrl: 'https://example.com/', elapsedMs: 100 });
  assert.equal(summary.h1Count, 1);
  assert.equal(summary.images, 0);
  assert.equal(summary.language, 'en');
  assert.equal(summary.description, 'A real description');
  assert.equal(summary.title, 'Strategy & Growth');
});
test('does not award structured-data points for malformed or empty JSON-LD', () => {
  for (const data of ['not JSON', '{}', '[]', 'null']) {
    const report = analyzeHtml({ html: `<script type="application/ld+json">${data}</script>`, finalUrl: 'https://example.com/', elapsedMs: 100 });
    assert.equal(report.summary.structuredData, false, data);
  }
});
