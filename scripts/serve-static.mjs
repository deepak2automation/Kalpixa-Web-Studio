import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

const root = resolve(process.cwd(), 'out');
const port = Number(process.env.PORT || 3000);
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};
const securityHeaders = {
  // This loopback-only preview is HTTP. WebKit upgrades even loopback assets when
  // upgrade-insecure-requests is present. Production retains that directive in netlify.toml.
  'Content-Security-Policy': "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data:; media-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

function safePath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const candidate = resolve(root, `.${decoded}`);
  return candidate === root || candidate.startsWith(`${root}${sep}`) ? candidate : null;
}

async function findFile(pathname) {
  const base = safePath(pathname);
  if (!base) return null;
  const candidates = pathname.endsWith('/')
    ? [join(base, 'index.html')]
    : [base, `${base}.html`, join(base, 'index.html')];
  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {}
  }
  return null;
}

createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { ...securityHeaders, Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('This local preview does not process form submissions.');
    return;
  }
  try {
    const pathname = new URL(request.url || '/', 'http://localhost').pathname;
    const file = await findFile(pathname);
    const target = file || join(root, '404.html');
    const body = await readFile(target);
    let status = file ? 200 : 404;
    let payload = body;
    const rangeHeaders = {};
    if (file && request.method === 'GET' && request.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/u.exec(request.headers.range);
      const start = match?.[1] ? Number(match[1]) : Math.max(0, body.length - Number(match?.[2]));
      const end = match?.[1] && match?.[2] ? Math.min(Number(match[2]), body.length - 1) : body.length - 1;
      if (!match || (!match[1] && !match[2]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= body.length) {
        response.writeHead(416, { ...securityHeaders, 'Content-Range': `bytes */${body.length}` });
        response.end();
        return;
      }
      status = 206;
      payload = body.subarray(start, end + 1);
      rangeHeaders['Content-Range'] = `bytes ${start}-${end}/${body.length}`;
    }
    response.writeHead(status, {
      ...securityHeaders,
      ...rangeHeaders,
      'Content-Type': types[extname(target)] || 'application/octet-stream',
      'Content-Length': payload.length,
      'Accept-Ranges': 'bytes',
    });
    response.end(request.method === 'HEAD' ? undefined : payload);
  } catch {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Internal server error');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Static production export ready at http://127.0.0.1:${port}`);
});
