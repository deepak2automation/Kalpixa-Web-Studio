import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { parse } from 'parse5';

const root = resolve('out');
const failures = [];
const pages = [];
const assets = new Set();
const titles = new Set();
const descriptions = new Set();
const canonicals = new Set();

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && !['404', '_not-found'].includes(entry.name)) await walk(path);
    else if (entry.name === 'index.html') pages.push(path);
    else if (entry.name.endsWith('.css')) {
      const css = await readFile(path, 'utf8');
      for (const match of css.matchAll(/url\(["']?(\/[^)"']+)["']?\)/gu)) assets.add(match[1]);
    }
  }
}
await walk(root);
for (const path of pages) {
  const html = await readFile(path, 'utf8');
  const nodes = [];
  const pending = [parse(html)];
  while (pending.length) {
    const node = pending.pop();
    nodes.push(node);
    for (const child of node.childNodes ?? []) pending.push(child);
  }
  const attr = (node, key) => node.attrs?.find(({ name }) => name === key)?.value;
  const named = (name) => nodes.filter(({ tagName }) => tagName === name);
  const route = path.slice(root.length).split(sep).join('/').replace(/index\.html$/u, '');
  const title = named('title')[0]?.childNodes?.[0]?.value;
  const description = named('meta').find((node) => attr(node, 'name') === 'description');
  const canonical = named('link').find((node) => attr(node, 'rel') === 'canonical');
  for (const [label, value, seen] of [['title', title, titles], ['description', description && attr(description, 'content'), descriptions]]) {
    if (!value || seen.has(value)) failures.push(`${route}: missing or duplicate ${label}`);
    seen.add(value);
  }
  const canonicalUrl = canonical && attr(canonical, 'href');
  const noindex = named('meta').some((node) => attr(node, 'name') === 'robots' && /noindex/u.test(attr(node, 'content') ?? ''));
  if (!canonicalUrl) failures.push(`${route}: missing canonical`);
  else if (!noindex) {
    if (canonicals.has(canonicalUrl)) failures.push(`${route}: duplicate indexed canonical`);
    canonicals.add(canonicalUrl);
    if (new URL(canonicalUrl).pathname.replace(/\/$/u, '') !== route.replace(/\/$/u, '')) failures.push(`${route}: canonical points to another page`);
  }
  if (named('h1').length !== 1) failures.push(`${route}: expected exactly one H1`);
  if (!nodes.some((node) => attr(node, 'id') === 'main-content')) failures.push(`${route}: missing main landmark`);
  if (attr(named('html')[0], 'lang') !== 'en') failures.push(`${route}: missing document language`);
  const ids = new Set();
  for (const node of nodes) {
    const id = attr(node, 'id');
    if (id && ids.has(id)) failures.push(`${route}: duplicate id ${id}`);
    if (id) ids.add(id);
    for (const key of ['src', 'href', 'poster']) {
      const value = attr(node, key);
      if (value?.startsWith('/')) assets.add(value.split(/[?#]/u)[0]);
    }
    if (node.tagName === 'script' && attr(node, 'type') === 'application/ld+json') {
      try { JSON.parse((node.childNodes ?? []).map((child) => child.value ?? '').join('')); } catch { failures.push(`${route}: invalid JSON-LD`); }
    }
  }
  for (const node of nodes) {
    const href = attr(node, 'href');
    if (href?.startsWith('#') && !ids.has(decodeURIComponent(href.slice(1)))) failures.push(`${route}: broken anchor ${href}`);
  }
}
for (const url of assets) {
  const target = resolve(root, '.' + decodeURIComponent(url));
  if (target !== root && !target.startsWith(root + sep)) { failures.push(`Asset escapes export: ${url}`); continue; }
  try { const info = await stat(target); if (info.isDirectory()) await stat(join(target, 'index.html')); }
  catch { failures.push(`Missing local asset or page: ${url}`); }
}
assert.ok(pages.length >= 18, 'Expected the full site export');
console.log(JSON.stringify({ pages: pages.length, localAssetsAndLinks: assets.size, uniqueIndexedCanonicals: canonicals.size, failures }, null, 2));
assert.equal(failures.length, 0, 'The export must pass validation before publishing');
