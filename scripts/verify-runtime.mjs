const base = process.env.VERIFY_BASE_URL || 'http://localhost:3000';
const routes = ['/','/about','/accessibility','/contact','/cookies','/insights','/insights/website-brief','/privacy','/security','/seo-tools','/services','/services/care','/services/seo','/services/websites','/terms','/thank-you','/work'];
const pages = await Promise.all(routes.map(async (path) => [path, await (await fetch(base + path)).text()]));
const titles = new Map(), descriptions = new Map(), links = new Set(), failures = [];
for (const [path, html] of pages) {
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="(.*?)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="(.*?)"/)?.[1];
  if (!title || !description || !canonical) failures.push(`${path}: missing metadata`);
  if ((html.match(/<h1\b/g) || []).length !== 1) failures.push(`${path}: must contain exactly one h1`);
  if (!html.includes('<main id="main-content"')) failures.push(`${path}: main landmark missing`);
  if (!html.includes('<html lang="en"')) failures.push(`${path}: document language missing`);
  if (/coming soon|coming next|lorem ipsum|\bTODO\b/i.test(html)) failures.push(`${path}: unfinished copy found`);
  if (/href="#"/i.test(html)) failures.push(`${path}: placeholder link found`);
  if (path === '/thank-you' && !html.includes('noindex')) failures.push(`${path}: confirmation page must be noindex`);
  if (titles.has(title)) failures.push(`${path}: duplicate title with ${titles.get(title)}`);
  if (descriptions.has(description)) failures.push(`${path}: duplicate description with ${descriptions.get(description)}`);
  titles.set(title, path); descriptions.set(description, path);
  for (const match of html.matchAll(/href="([^"#?]+)[^"]*"/g)) if (match[1].startsWith('/')) links.add(match[1]);
}
for (const link of links) { const response = await fetch(base + link); if (response.status >= 400) failures.push(`${link}: ${response.status}`); }
const missing = await fetch(base + '/definitely-missing-kalpixa-page');
if (missing.status !== 404 || !(await missing.text()).includes('does not lead anywhere useful')) failures.push('custom 404 failed');
console.log(JSON.stringify({ pages: pages.length, uniqueTitles: titles.size, uniqueDescriptions: descriptions.size, internalLinks: links.size, failures }, null, 2));
if (failures.length) process.exitCode = 1;
