# Kalpixa Digital Studio

Production Next.js rebuild of [kalpixa.com](https://kalpixa.com), deployed from the `main` branch through Netlify.

## Stack

- Next.js 16 App Router and React 19
- Netlify OpenNext adapter, detected automatically
- Netlify Forms for project enquiries, with a static form blueprint at `public/__forms.html`
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

The build command and Node version are declared in `netlify.toml`. Netlify Forms must be enabled under **Forms → Enable form detection**. After deployment, submit a real controlled enquiry and confirm it appears under the `kalpixa-project` form before considering the release complete. Configure email notifications under **Configuration → Notifications → Form submission notifications**.

The previous production commit remains available in Git history for rollback.
