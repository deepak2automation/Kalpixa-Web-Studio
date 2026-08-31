import assert from 'node:assert/strict';
import { handler } from '../netlify/functions/seo-audit.mjs';

const event = (httpMethod, url, ip) => ({ httpMethod, headers: { 'x-nf-client-connection-ip': ip }, body: url === undefined ? undefined : JSON.stringify({ url }) });

const methodResponse = await handler(event('GET', undefined, '198.51.100.10'));
assert.equal(methodResponse.statusCode, 405);

const privateResponse = await handler(event('POST', 'http://127.0.0.1/', '198.51.100.11'));
assert.equal(privateResponse.statusCode, 422);
assert.match(JSON.parse(privateResponse.body).error, /public websites/u);

const liveResponse = await handler(event('POST', 'https://kalpixa.com/', '198.51.100.12'));
assert.equal(liveResponse.statusCode, 200, liveResponse.body);
const report = JSON.parse(liveResponse.body);
assert.equal(report.checks.length, 21);
assert.ok(report.score >= 0 && report.score <= 100);
assert.equal(new URL(report.summary.finalUrl).hostname, 'kalpixa.com');
assert.ok(report.summary.title);

console.log(JSON.stringify({ methodGuard: methodResponse.statusCode, privateNetworkGuard: privateResponse.statusCode, liveAudit: { status: liveResponse.statusCode, score: report.score, checks: report.checks.length, finalUrl: report.summary.finalUrl, responseTimeMs: report.summary.responseTimeMs, robots: report.summary.robots, sitemap: report.summary.sitemap } }, null, 2));
