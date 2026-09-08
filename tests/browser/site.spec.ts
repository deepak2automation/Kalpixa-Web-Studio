import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { analyzeHtml } from '../../lib/seo-audit.mjs';

const routes = ['/', '/about/', '/accessibility/', '/contact/', '/cookies/', '/image-credits/', '/insights/', '/insights/website-brief/', '/privacy/', '/security/', '/seo-tools/', '/services/', '/services/care/', '/services/seo/', '/services/websites/', '/terms/', '/thank-you/', '/work/'];
async function setTheme(page: Page, theme: string) {
  if (await page.locator('html').getAttribute('data-theme') !== theme) await page.getByRole('switch').click();
  await expect(page.locator('body')).toHaveCSS('color', theme === 'dark' ? 'rgb(238, 246, 248)' : 'rgb(11, 16, 32)');
}

const criticalRoutes = ['/', '/services/', '/contact/', '/seo-tools/'];

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  // Check after every test, including failure-handling tests.
  (page as Page & { runtimeErrors: string[] }).runtimeErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as Page & { runtimeErrors: string[] }).runtimeErrors, 'uncaught browser errors').toEqual([]);
});

for (const route of routes) {
  test(`route, responsive layout, assets and accessibility: ${route}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop' && !criticalRoutes.includes(route), 'All routes run on desktop; key journeys also run across devices and engines.');
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h1')).toBeVisible();
    for (const theme of ['light', 'dark']) {
      await setTheme(page, theme);
      if (route === '/seo-tools/') await expect(page.locator('.seo-search > label')).toHaveCSS('color', theme === 'dark' ? 'rgb(238, 246, 248)' : 'rgb(11, 16, 32)');
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
      for (const image of await page.locator('main img').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(scan.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })), `${route} in ${theme}`).toEqual([]);
    }
    if (criticalRoutes.includes(route)) await page.screenshot({ path: testInfo.outputPath('verified-page.png'), fullPage: true });
  });
}

test('theme works with blocked storage and its thumb follows the switch state', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); }; });
  await page.goto('/');
  const toggle = page.getByRole('switch');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', 'true');
  await expect.poll(() => page.locator('.theme-toggle-thumb').evaluate((node) => getComputedStyle(node).transform)).not.toBe('none');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
});

test('mobile navigation closes on Escape, restores focus and marks the active route', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/services/');
  const button = page.getByRole('button', { name: 'Open navigation' });
  await button.click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Services' })).toHaveAttribute('aria-current', 'page');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await button.click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});

test('very tall service sections become visible when motion is enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 650 });
  await page.goto('/services/');
  for (const section of await page.locator('main > section').all()) {
    await section.evaluate((node) => node.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await expect(section).toHaveCSS('opacity', '1');
  }
});

test('WhatsApp supports drag, keyboard movement and resize when storage is denied', async ({ page, context }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); }; });
  await page.goto('/');
  const control = page.locator('.floating-whatsapp');
  await expect(control).toHaveAttribute('style', /left/u);
  const before = (await control.boundingBox())!;
  await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2);
  await page.mouse.down();
  await page.mouse.move(before.x - 90, before.y - 140, { steps: 10 });
  await page.mouse.up();
  const after = (await control.boundingBox())!;
  expect(after.x).toBeLessThan(before.x - 30);
  expect(context.pages()).toHaveLength(1);
  await control.focus();
  await page.keyboard.press('ArrowLeft');
  expect((await control.boundingBox())!.x).toBeLessThan(after.x);
  await page.keyboard.press('Home');
  await page.setViewportSize({ width: 320, height: 240 });
  await expect.poll(async () => { const box = (await control.boundingBox())!; return box.x >= 0 && box.y >= 0 && box.x + box.width <= 320 && box.y + box.height <= 240; }).toBe(true);
});

test('touch drag repositions WhatsApp without opening a chat', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Uses the Chromium touch-input protocol; mouse and keyboard run in every engine.');
  await page.goto('/');
  const control = page.locator('.floating-whatsapp');
  await expect(control).toHaveAttribute('style', /left/u);
  const box = (await control.boundingBox())!;
  const session = await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + 25, y: box.y + 25 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x - 80, y: box.y - 120 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(async () => (await control.boundingBox())!.x).toBeLessThan(box.x - 30);
  expect(context.pages()).toHaveLength(1);
});

async function fillBrief(page: Page) {
  await page.locator('[name="name"]').fill('Release Verification');
  await page.locator('[name="email"]').fill('verification@example.com');
  await page.locator('[name="message"]').fill('A controlled browser regression test. No real enquiry is submitted.\n\nKeep this paragraph intact.');
  await page.locator('[name="consent"]').check();
}

test('contact validation focuses the first invalid field', async ({ page }) => {
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Send Project Brief' }).click();
  await expect(page.locator('[name="name"]')).toBeFocused();
  await expect(page.locator('#name-error')).toBeVisible();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('highlighted fields');
});

test('successful contact submission survives blocked session storage and prevents duplicates', async ({ page }) => {
  let submissions = 0;
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); }; });
  await page.route('**/', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    submissions += 1;
    const body = new URLSearchParams(route.request().postData()!);
    expect(body.get('form-name')).toBe('contact');
    expect(body.get('message')).toContain('\n\n');
    await route.fulfill({ status: 200, contentType: 'text/html', body: 'Controlled Netlify response fixture' });
  });
  await page.goto('/contact/');
  await fillBrief(page);
  await page.locator('form.contact-form').evaluate((form) => { (form as HTMLFormElement).requestSubmit(); (form as HTMLFormElement).requestSubmit(); });
  await expect(page).toHaveURL(/\/thank-you\//u);
  expect(submissions).toBe(1);
});

test('contact delivery failure preserves the brief and permits retry', async ({ page }) => {
  await page.route('**/', (route) => route.request().method() === 'POST' ? route.fulfill({ status: 503, body: 'Unavailable' }) : route.continue());
  await page.goto('/contact/');
  await fillBrief(page);
  await page.getByRole('button', { name: 'Send Project Brief' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('could not confirm delivery');
  await expect(page.locator('[name="name"]')).toHaveValue('Release Verification');
  await expect(page.getByRole('button', { name: 'Send Project Brief' })).toBeEnabled();
});

test('malformed SEO success response produces a recoverable error instead of crashing', async ({ page }) => {
  await page.route('**/.netlify/functions/seo-audit', (route) => route.fulfill({ json: {} }));
  await page.goto('/seo-tools/');
  await page.getByLabel('Website URL').fill('example.com');
  await page.getByRole('button', { name: 'Analyze', exact: true }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('incomplete report');
  await expect(page.getByRole('button', { name: 'Analyze', exact: true })).toBeEnabled();
});

test('SEO rate-limit errors leave the application usable', async ({ page }) => {
  await page.route('**/.netlify/functions/seo-audit', (route) => route.fulfill({ status: 429, json: { error: 'Audit limit reached. Please wait.' } }));
  await page.goto('/seo-tools/');
  await page.getByLabel('Website URL').fill('example.com');
  await page.getByRole('button', { name: 'Analyze', exact: true }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Audit limit reached');
});

test('a valid SEO report is announced, rendered safely and can be reset', async ({ page }) => {
  const report = analyzeHtml({ html: '<html lang=en><title>Example website</title><h1>A real report fixture</h1><p>Useful content</p></html>', finalUrl: 'https://example.com/', elapsedMs: 123, contentLength: 120 });
  await page.route('**/.netlify/functions/seo-audit', (route) => route.fulfill({ json: report }));
  await page.goto('/seo-tools/');
  await page.getByLabel('Website URL').fill('example.com');
  await page.getByRole('button', { name: 'Analyze', exact: true }).click();
  await expect(page.locator('.audit-overview h2')).toBeFocused();
  await expect(page.locator('.audit-check')).toHaveCount(21);
  for (const theme of ['light', 'dark']) {
    await setTheme(page, theme);
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(scan.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }))).toEqual([]);
  }
  await page.getByRole('button', { name: 'Analyze another site' }).click();
  await expect(page.getByLabel('Website URL')).toBeFocused();
  await expect(page.locator('.audit-report')).toHaveCount(0);
});

test('validation errors stay readable in both themes', async ({ page }) => {
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Send Project Brief' }).click();
  for (const theme of ['light', 'dark']) {
    await setTheme(page, theme);
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(scan.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }))).toEqual([]);
  }
});

test('critical pages reflow at narrow widths and enlarged text', async ({ page }) => {
  for (const route of criticalRoutes) {
    await page.goto(route);
    for (const width of [320, 360, 768, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${route} at ${width}px`).toBe(true);
    }
    await page.setViewportSize({ width: 640, height: 900 });
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${route} with 200% text`).toBe(true);
  }
});

test('hero animation can be played and paused explicitly', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const video = page.locator('.hero-motion-source');
  await expect(video).toHaveAttribute('src', /hero-motion\.(mp4|webm)$/u);
  if (!await video.evaluate((node) => (node as HTMLVideoElement).canPlayType('video/webm') || (node as HTMLVideoElement).canPlayType('video/mp4'))) {
    await expect(video).toHaveAttribute('data-unavailable', 'true');
    await expect(page.locator('.hero-motion-control')).toHaveCount(0);
    await expect(page.locator('.hero-cinematic')).toHaveCSS('background-image', /hero-motion-poster/u);
    return;
  }
  if (await video.evaluate((node) => (node as HTMLVideoElement).paused)) await page.getByRole('button', { name: 'Play background animation' }).click();
  await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  await page.getByRole('button', { name: 'Pause background animation' }).click();
  expect(await video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(true);
});

test('reduced motion does not download or play the hero video', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/');
  await expect(page.locator('.hero-motion-source')).not.toHaveAttribute('src');
  expect(requests.some((url) => /\/hero-motion\.(mp4|webm)$/u.test(url))).toBe(false);
});

test('navigation and required contact fields remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: process.env.VERIFY_BASE_URL || 'http://127.0.0.1:4173', viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto('/contact/');
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('form.contact-form')).not.toHaveAttribute('novalidate');
  await expect(page.locator('[name="email"]')).toHaveAttribute('required', '');
  await expect(page.locator('.contact-form')).toHaveAttribute('action', '/thank-you/');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Services' })).toBeVisible();
  await context.close();
});
