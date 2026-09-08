# Kalpixa Web Studio

Production Next.js rebuild of [kalpixa.com](https://kalpixa.com), deployed from the `main` branch through Netlify.

## Stack

- Next.js 16 App Router and React 19
- Deterministic Next.js static export published directly from `out`, plus an isolated Netlify Function for live SEO audits
- Netlify Forms for project enquiries, with a static form blueprint at `public/__forms.html`
- Real-time SEO analysis for public HTTP/HTTPS pages with private-network blocking, redirect validation, timeouts and response-size limits
- Server-rendered metadata, structured data, sitemap, robots, manifest, security headers and a real 404
- Responsive custom CSS with semantic structure, keyboard focus and reduced-motion support

## Commands

```bash
npm ci
npm run release:check
npx playwright install chromium firefox webkit
npm run test:browser
npm run start
npm run verify:runtime
npm run verify:function
```

Use Node 22.13 or later in the maintained Node 22 line. `release:check` runs lint, unit/security tests, the form contract, the production build (including TypeScript), and export validation. `verify:runtime` checks the running server at `http://127.0.0.1:3000`. Set `VERIFY_BASE_URL` to validate a deployed site. On Windows, the browser suite uses installed Google Chrome for Chromium projects; Firefox and WebKit use isolated Playwright installations. On Linux it uses Playwright Chromium.

Browser tests start their own static server on port 4173. Form and Analyzer response fixtures are intercepted locally: they do **not** send real enquiries and do **not** prove email delivery. The preview server explicitly rejects POST requests instead of incorrectly returning a successful HTML response.

## Netlify configuration

The build command, publish directory and Node version are declared in `netlify.toml`. Netlify runs `release:check` before publishing; failed checks prevent that build from replacing production. Node 22 receives its current patch release at build time. GitHub Actions also runs the browser suite on pushes to `main` and pull requests. The GitHub workflow is an additional check, not a branch-protection rule or an automatic prerequisite to a Netlify Git deployment. Run all browser tests locally **before pushing directly to main**.

Netlify Forms must be enabled under **Forms → Enable form detection**. The form name stays `contact`, with the same 12 fields and six service options, to preserve the existing integration. After deployment, send one clearly labelled controlled enquiry using an inbox you control. Confirm its presence in Netlify's Verified submissions (also check Spam) and confirm the email notification arrives. A 2xx POST or confirmation page alone does not prove persistence or email delivery. Do not delete genuine enquiries during verification.

The previous production commit remains available in Git history for rollback.

See [the operations runbook](docs/OPERATIONS.md) for release, rollback, monitoring and service boundaries.
