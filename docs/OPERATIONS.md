# Release and operations runbook

## Release procedure

1. Work on the existing `main` branch as requested by the owner. Check `git status` and remote HEAD first; preserve any unrelated changes.
2. Run `npm ci`, `npm run release:check`, and `npm run test:browser`. Review screenshots for home, services, contact and Analyzer. Exercise mouse, touch, keyboard, light/dark themes and reduced motion. Do not substitute a development build for the static production export.
3. Run `npm run verify:function` with internet access. This executes the actual server handler against Kalpixa's public homepage plus method/private-address rejection checks. It is not a load test.
4. Review `git diff --check` and the complete diff. Record the previous production commit and the test evidence. Check for published dependency vulnerabilities with `npm audit`; investigate findings instead of using a blind forced upgrade.
5. Push the verified commit to `main`. Confirm the Netlify build and function packaging complete. Verify the deployed revision, not just the domain returning HTTP 200.
6. Run `VERIFY_BASE_URL=https://kalpixa.com npm run verify:runtime` (PowerShell: set `$env:VERIFY_BASE_URL` first). Verify HTTPS, headers, missing-page 404, all public routes, assets and metadata. Run the browser suite against production; its form/API fixtures are intercepted and do not create enquiries.
7. Test the live Analyzer once and perform one labelled contact submission. Check that specific submission in Netlify and the receiving inbox. Check the spam queue before reporting loss. Retain the delivery evidence privately, not in Git.

## Rollback

If a production regression is found, use Netlify's **Publish deploy** action on the recorded last known-good deploy. This is an atomic site rollback. Then reconcile Git with a reviewed revert of the specific bad commit(s); do not force-push, reset main or revert unrelated user changes. Confirm the function version, contact form integration and static assets after rollback. Keep the previous deploy available until the replacement is verified.

## What the Analyzer can and cannot do

- It fetches public HTTP/HTTPS pages on standard ports, validates every destination/redirect and pins validated DNS addresses to the actual connection. Private, loopback, link-local, reserved, mapped and transition IP ranges are intentionally blocked.
- Four redirects, a 12-second overall deadline, a 1 MB decompressed HTML limit, a 16 KB response-header limit, and smaller bounded robots/sitemap probes prevent unbounded work. Unsupported content, invalid TLS, blocked bots, authenticated sites and unavailable origins produce recoverable errors rather than invented reports.
- It parses returned HTML, decodes entities and ignores markup inside comments/scripts. JSON-LD must parse and contain a type before it earns detection points. This does not validate a complete schema or establish rich-result eligibility.
- robots.txt and the conventional `/sitemap.xml` path are checked for recognizable content; a successful HTML fallback is not counted as either. Alternative sitemap locations, CSS visibility, JavaScript-rendered content, backlinks, ranking, field Core Web Vitals and search-engine indexation are outside this snapshot.
- The score is a weighted heuristic, not an SEO certification or ranking guarantee. Title/description length and word-count thresholds are editorial heuristics, not search-engine requirements.
- The in-memory limiter bounds requests per client/instance and caps its own memory. It is **not a distributed quota** across Netlify instances and cannot prevent distributed abuse. For material traffic, configure a plan-supported edge rate limit/shared quota and cost alerts, with explicit owner approval for any paid service.

## Forms and privacy

Client validation improves usability; it is not a security boundary against handcrafted requests. Netlify performs form ingestion and spam filtering. Keep access to submissions restricted and review Netlify account MFA, member access, retention and notification settings. This repository does not provision or certify those account controls.

Never log full briefs or contact details in public diagnostics. Do not submit passwords, payment details or sensitive personal data. Do not add analytics, trackers or third-party email providers without reviewing consent, privacy disclosures and the integration's actual data flow.

## Monitoring and ownership

For ongoing operation, assign an owner to uptime/5xx alerts, Netlify function failures and usage/cost limits, the `contact` inbox, the spam queue, dependency updates and periodic accessibility checks. Review Search Console and Bing Webmaster crawl/indexing reports using the agency's verified accounts. None of these external account settings is proven enabled by a successful website build.

Before promising an availability SLA, establish measured traffic, an incident-response owner, alert routing and a tested recovery objective. No website can be guaranteed defect-free across all future devices, third-party failures, content changes and infrastructure conditions.

## Reference documentation

- [Netlify form setup](https://docs.netlify.com/manage/forms/setup/)
- [Netlify form notifications](https://docs.netlify.com/manage/forms/notifications/)
- [Netlify spam filtering](https://docs.netlify.com/manage/forms/spam-filters/)
- [Playwright accessibility testing and its limits](https://playwright.dev/docs/accessibility-testing)
- [Undici connection options](https://github.com/nodejs/undici/blob/main/docs/docs/api/Client.md)
