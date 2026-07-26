# Playwright QA Test Notes

This file documents the Playwright setup and the website issues fixed after the initial test run.

## Article: Week02

## Setup Added

- Installed `@playwright/test` as a dev dependency.
- Added `playwright.config.js` with Chromium, Firefox, and WebKit projects.
- Added `tests/static-server.cjs` so Playwright can serve the static HTML site locally.
- Added `tests/qa-requirements.spec.js` to cover the PDF QA checklist.
- Added `scripts/run-playwright.sh` and the `npm run playwright` script.

## How To Run

Run the full Playwright suite:

```bash
npm test
```

Run through the wrapper script:

```bash
npm run playwright
```

List tests without running browsers:

```bash
npm run playwright -- --list
```

Run one browser project:

```bash
npm run playwright -- --project=chromium
```

## Tests Covered

The Playwright suite checks:

- Internal and external links resolve without 404s.
- Links and assets do not use local filesystem paths.
- The theme toggle is visible, labeled, and persists a selected theme.
- Form requirements are marked not applicable because the site currently has no forms.
- Same-origin assets load without broken responses.
- Layouts do not overlap, clip, or create horizontal scrolling at 375px, 768px, and 1440px.
- Pages include SEO basics: title, meta description, `main`, `nav`, `footer`, and one `h1`.
- Baseline accessibility expectations: image alt text when images exist, no skipped heading levels, and labeled controls.
- Text contrast meets the WCAG AA 4.5:1 threshold in the active theme.

## Initial Failures

After Playwright installation, setup, and the first full run, the remaining failures were caused by website issues:

- The landing page linked to `week03`, `week04`, `week05`, and `week06`, but those pages did not exist. Playwright correctly reported 404 failures for those links.
- The landing page created horizontal overflow at the 375px mobile breakpoint. The main source was the landing hero title extending just outside the viewport in browser layout.

## Fixes Applied

### Removed unused links

In `index.html`, the inactive Week 03-06 header links and archive cards were removed. The landing page now links only to the existing Week 02 page.

### Fixed mobile overflow

In `week02/styles.css`, the landing page hero styles were adjusted:

- Added `min-width: 0` and bounded `max-width` on the landing hero title and intro copy.
- Added a mobile overflow guard for `html` and `body`.
- Reduced the landing hero title size only on narrow screens so `Skateboard` fits at 375px in Chromium, Firefox, and WebKit.

These changes did not alter the color tokens. The existing contrast ratios remain above WCAG AA, and the Playwright contrast checks pass.

## Verification After Fixes

Commands run after the fixes:

```bash
npm test
npm run validate:html
npx eslint index.html week02/styles.css
```

Result:

- `npm test`: 48 passed.
- `npm run validate:html`: passed.
- `npx eslint index.html week02/styles.css`: passed.
- WCAG AA contrast proxy checks passed in Playwright.
