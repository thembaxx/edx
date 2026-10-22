# Kinlo · School, together

A mobile-first, installable school-to-home communication concept for South African public schools (Grades 1–8). The design prioritises clarity for families, time-saving flows for educators, and calm, useful navigation.

> **Demo, not a live school system.** All people, schools, conversations and student details are fictional. Local practice data is saved only in your browser. There is **no authentication, backend, remote delivery, multi-user synchronisation, or production security boundary** yet. Do not enter real learners' personal information.

## What's interactive

- Parent and educator demo perspectives, with an animated three-step onboarding tour that can be replayed in Settings.
- Shared Home, Updates, Calendar and Inbox navigation (four items on mobile with a clear active indicator).
- Subject-grouped homework, assessments, notices and school activities.
- Educator compose form: add a notice, homework or event to this browser's demo; new dated items appear on the calendar.
- Mark notices read, filter by subject, select calendar days, navigate to due dates and respond in fictional message threads.
- Modular feature visibility, System / Light / Dark theme, reduced-motion control, optional notifications permission, install guidance and reset.
- Original flat-color book-and-conversation mark, a compact school-day overview, clear list layouts and responsive phone/tablet/desktop navigation.
- Installable PWA with generated maskable and Apple touch icons, cached static shell and offline indication.
- SEO/OG metadata, `robots.txt`, `llms.txt`, semantic headings, keyboard controls and visible focus states.

## Stack

Next.js 16 App Router · React 19 · TypeScript 7 · pnpm 12 · Motion · Phosphor Icons · native web app manifest + service worker · Oxlint · Oxfmt · Vitest · Playwright + axe. Styling is custom CSS with solid colors, a consistent spacing scale, modest corner radii and semantic light/dark tokens.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format:check
pnpm exec playwright install chromium
pnpm test:e2e
pnpm check
```

Node.js 22.13+ is required by pnpm 12 (Node.js 24 recommended). The shared `public/logo.svg` vector generates the favicon, PNG install icons and social card through `scripts/generate-icons.mjs` and Sharp before dev and build. Maskable icons use an opaque background and keep the symbol inside the safe zone. Fonts are self-hosted by Next.js, including for offline use. Install Chromium once before running `pnpm check`; the browser checks run against a production server on port 3100.

## Architecture

- `src/App.tsx` — responsive application and role-aware feature flows
- `src/components/BrandMark.tsx` — shared flat-color vector identity
- `public/logo.svg` — master mark for the UI, favicon, install icons and social card
- `e2e/app.e2e.ts` — production browser, accessibility, responsive, persistence and offline smoke checks
- `src/data.ts` — fictional records, date helpers and local demo state
- `src/styles.css` — visual system, mobile bottom navigation and responsive themes
- `app/` — Next.js App Router layout, page, manifest and accessible loading fallbacks
- `app/ClientExperience.tsx` — browser-only demo shell and service worker registration
- `public/sw.js` — offline app-shell caching; no private or learner record caching
- `scripts/generate-icons.mjs` — deterministic icon generator

## Before using Kinlo in actual schools

**Not ready for real learners.** Prioritise these gates before any pilot:

1. Signed school agreements and accountable information-governance processes; POPIA review including children's personal information, lawful basis, consent/competent person where applicable, retention and data-subject requests.
2. Verified teacher accounts, approved guardian–learner linking, RBAC on every server route, tenant/school-level isolation, row-level authorisation and comprehensive auditing. Role switching in this prototype is **not** access control.
3. Secure managed database and attachments with encryption, backups, restore drills, logging, breach handling, data minimisation, moderation and a safeguarding escalation procedure. Never use localStorage for live pupil records.
4. School-controlled publishing approval, attachment scanning, teacher office hours, moderated teacher community, no unsolicited adult–child direct messages for lower grades, and school-specific communication policy.
5. Real API, school onboarding, transactional outbox with push/email/SMS fallbacks, accessibility testing, offline consistency/conflict resolution, device testing and operational support. Web push delivery and external communication are **not** implemented by asking browser notification permission.
6. Establish a clear business and employment plan before promising centralised data entry, office staffing or municipal/school integration. Never automate ingestion of private school records without authorisation.

## PWA notes

The production-only service worker caches the public demo shell and previously fetched framework assets to enable reopening previously visited pages offline. Demo submissions are local only. This does **not** provide offline-to-server synchronisation. Install support varies between Chrome, Android and iOS Safari. Use *Share → Add to Home Screen* on supported Apple devices.

## Accessibility

Large touch targets, focus-visible outlines, clear contrast, explicit labels, reduced motion, online/offline status and live feedback are included. Before launch, run real screen-reader and keyboard tests on iOS, Android and desktop.

## Acknowledgements

The interface uses solid forest green, warm neutrals and blue/teal subject accents. The original logo draws on the supplied rounded app-icon reference using flat shapes. Gradients, emoji, decorative 3D visuals, floating ornaments and oversized greetings have been removed. The name is Kinlo; the tagline is “School, together”. Existing `edx-*` browser storage keys preserve saved entries and preferences through the rename, and old edx service-worker caches retire on activation.

## Verification

`pnpm check` runs Oxlint with React and accessibility rules and a zero-warning policy, Oxfmt, TypeScript, unit tests, the Next.js production build and Playwright browser checks. CI runs the same stages and restores `.next/cache` between builds. Browser coverage includes keyboard dialogs, parent navigation and local messages, educator publishing and calendar dates, persisted preferences and module visibility, 320/768/1024/1440px layouts, WCAG contrast checks, public assets, 404 responses and offline reloads. The PWA worker is disabled during development to avoid caching development chunks.
