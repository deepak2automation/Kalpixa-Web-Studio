# Kalpixa Digital Studio

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
npm run lint
npx tsc --noEmit
npm run build
npm run start
npm run verify:runtime
```

`verify:runtime` checks the running server at `http://localhost:3000` by default. Set `VERIFY_BASE_URL` to validate the deployed site.

## Netlify configuration

The build command, publish directory and Node version are declared in `netlify.toml`. Netlify Forms must be enabled under **Forms → Enable form detection**. The production form deliberately retains the stable name `contact` because the authenticated email notification is attached to that form. After deployment, submit a controlled enquiry, confirm it appears under `contact`, verify the email hook remains enabled, and delete only the QA record.

The previous production commit remains available in Git history for rollback.
