# Reliability upgrade — pre-deployment verification

Baseline: `6c46056b9d674a48deccd001cbbedf84bf999009` on the existing `main` branch. This release preserves the site's original content, current logo, page routes, photography, service choices and Netlify contact form identity. It is a reliability/accessibility/security upgrade, not another redesign.

## Findings and corrections

| Area | Root cause | Correction and regression evidence |
| --- | --- | --- |
| Contact delivery | A denied session-storage write could report failure after a successful POST and cleared brief. Rapid clicks had no synchronous lock. | Optional storage is isolated from delivery; synchronous duplicate guard; native confirmation navigation; failed delivery retains inputs. Browser tests cover success, denial, failure and retry. |
| Contact data | Validation silently truncated long values, flattened paragraphs and accepted punctuation-heavy phone numbers. | Shared explicit limits, length errors, preserved paragraphs, 7–15 actual phone digits, safe website schemes. Existing 12-field/six-service contract passes. |
| Analyzer accuracy | Regex-based HTML inspection misread comments, scripts, entities and unquoted attributes; any JSON-LD tag earned detection points. | Real HTML parsing; parseable typed JSON-LD; HTTP/meta noindex handling; content-aware robots/sitemap checks. No invented ranking or field-performance data. |
| Analyzer network safety | DNS validation and the actual connection could resolve different addresses; IP edge cases and unbounded work needed hardening. | DNS pinned to vetted public addresses, all redirects revalidated, private/reserved/transition ranges blocked, bounded decompressed bodies/headers/deadlines, bounded per-instance rate state. |
| Analyzer UI | Malformed successful API responses could crash rendering; pre-hydration input could be lost. | Runtime report validation, recoverable failures, actual submitted form data, duplicate-request guard and result focus. |
| Theme/accessibility | Incorrect switch selector; storage errors; low-contrast hover/dark states; WebKit could retain an inherited animated body text color. | Correct boolean selector, storage-independent switching, tested contrast colors, explicit theme text at the main content root. |
| Navigation/reveal | Mobile focus/resize dismissal gaps; intersection threshold could never be reached by very tall sections. | Escape/focus/outside/resize handling, active links and no-JavaScript fallback; first-intersection reveal with reduced-motion fallback. |
| WhatsApp | Storage failure could interrupt dragging; resize/zoom and stale click suppression needed handling. | Mouse/touch/keyboard drag, visual-viewport clamping, multitouch guard and storage-independent position updates. |
| Hero video | WebM-only playback failed in the tested WebKit environment; no explicit pause control. | Compatible MP4 from the same animation, WebM fallback, play/pause, poster on media failure, no automatic download for reduced motion/data saving. |
| Release discipline | Build alone did not establish regression coverage; mutable branding assets had immutable caches; local POST could falsely appear successful. | Netlify lint/test/build/export gate, pinned GitHub browser workflow, release revision marker, corrected cache policies, local POST rejection and proper media ranges. |

## Verified before push

- 35 unit/security tests passed. The initial baseline failed seven newly added regression cases before fixes.
- The Netlify form blueprint and React form agree on 12 fields and six service options.
- ESLint, TypeScript production build and static export validation passed.
- All 18 public pages have unique titles/descriptions; export checks cover canonicals, headings, language, JSON-LD, local links/assets and fragment targets. The confirmation page remains noindex.
- 112 browser tests passed with zero failures across desktop/tablet/mobile Chromium, Firefox and WebKit. 58 matrix entries are intentionally skipped: redundant non-critical routes outside the all-page desktop pass, and Chromium-specific touch emulation on the other two engines.
- All 18 pages are tested in light/dark themes on desktop; home, services, contact and Analyzer repeat across all five projects. Checks include automated WCAG-tagged axe scans, images, overflow, browser errors, failure states, 320/360/768/1920-pixel reflow, enlarged text, reduced motion and no-JavaScript navigation/forms.
- Actual server-handler execution fetched the public Kalpixa homepage and returned 21 live HTML checks. Method and private-network rejection passed.
- `npm audit` reported zero known vulnerabilities for the complete installed dependency tree at verification time.
- Visual review covered the preserved homepage, service layout, contact page and Analyzer. No genuine client submissions were used in fixtures.

## Production acceptance is separate

After publishing, verify the exact commit in `/release.json`, Netlify deploy state, GitHub CI result, HTTPS/security headers, media delivery, real Analyzer response and the browser suite against the live domain. Submit only one labelled QA enquiry and verify that specific record in Netlify. Email notification configuration and HTTP success do not prove inbox arrival; obtain receiving-inbox confirmation separately. Keep lead data and delivery evidence out of Git.

## Explicit boundaries

This is evidence for the tested release, not a guarantee of zero possible defects, a formal accessibility certification, a penetration test or a measured availability/SEO SLA. Device emulation is not an exhaustive physical-device lab; text enlargement is not every browser/OS zoom combination. Full manual assistive-technology testing, sustained load testing, distributed rate limiting, external-account MFA/alerting/retention and receiving-inbox confirmation are not established by these tests. See [OPERATIONS.md](OPERATIONS.md) for ownership and rollback.
