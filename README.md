# edx · School, together

A mobile-first, installable school-to-home communication concept for South African public schools (Grades 1–8). The design prioritises clarity for families, time-saving flows for educators, and calm, useful navigation.

> **Demo, not a live school system.** All people, schools, conversations and student details are fictional. Local practice data is saved only in your browser. There is **no authentication, backend, remote delivery, multi-user synchronisation, or production security boundary** yet. Do not enter real learners' personal information.

## What's interactive

- Parent and educator demo perspectives, with an animated three-step onboarding tour that can be replayed in Settings.
- Shared Home, Updates, Calendar and Inbox navigation (four items on mobile with an animated selection pill).
- Subject-grouped homework, assessments, notices and school activities.
- Educator compose form: add a notice, homework or event to this browser's demo; new dated items appear on the calendar.
- Mark notices read, filter by subject, select calendar days, navigate to due dates and respond in fictional message threads.
- Modular feature visibility, System / Light / Dark theme, reduced-motion control, optional notifications permission, install guidance and reset.
- Interactive lazy-loaded Three.js gradient orb, CSS fallback, sensible reduced-motion handling and responsive phone/tablet/desktop layout.
- Installable PWA with generated maskable and Apple touch icons, cached static shell and offline indication.
- SEO/OG metadata, `robots.txt`, `llms.txt`, semantic headings, keyboard controls and visible focus states.

## Stack

React 19 · TypeScript · Vite · Motion · Three.js · Phosphor Icons · vite-plugin-pwa · Oxlint · Oxfmt · Vitest. Styling is custom CSS inspired by EasyUI's animated, accessible patterns and the supplied visual references. We avoid adding component packages solely for effects.

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
npm run format:check
```

Node.js 22.12+ is recommended. Icon PNGs are generated from `scripts/generate-icons.mjs` during `predev` and `prebuild` with no image generation dependency.

## Architecture

- `src/App.tsx` — responsive application and role-aware feature flows
- `src/components/Orb.tsx` — lazy Three.js visual, pointer tracking, reduced-motion fallback
- `src/data.ts` — fictional records, date helpers and local demo state
- `src/styles.css` — visual system, iOS-style bottom navigation and responsive themes
- `vite.config.ts` — Vite and offline-capable PWA configuration
- `scripts/generate-icons.mjs` — deterministic icon generator

## Before using edx in actual schools

**Not ready for real learners.** Prioritise these gates before any pilot:

1. Signed school agreements and accountable information-governance processes; POPIA review including children's personal information, lawful basis, consent/competent person where applicable, retention and data-subject requests.
2. Verified teacher accounts, approved guardian–learner linking, RBAC on every server route, tenant/school-level isolation, row-level authorisation and comprehensive auditing. Role switching in this prototype is **not** access control.
3. Secure managed database and attachments with encryption, backups, restore drills, logging, breach handling, data minimisation, moderation and a safeguarding escalation procedure. Never use localStorage for live pupil records.
4. School-controlled publishing approval, attachment scanning, teacher office hours, moderated teacher community, no unsolicited adult–child direct messages for lower grades, and school-specific communication policy.
5. Real API, school onboarding, transactional outbox with push/email/SMS fallbacks, accessibility testing, offline consistency/conflict resolution, device testing and operational support. Web push delivery and external communication are **not** implemented by asking browser notification permission.
6. Establish a clear business and employment plan before promising centralised data entry, office staffing or municipal/school integration. Never automate ingestion of private school records without authorisation.

## PWA notes

The service worker caches the static app shell and bundled assets to enable reopening previously visited pages offline. Demo submissions are local only. This does **not** provide offline-to-server synchronisation. Install support varies between Chrome, Android and iOS Safari. Use *Share → Add to Home Screen* on supported Apple devices.

## Accessibility

Large touch targets, focus-visible outlines, clear contrast, explicit labels, reduced motion, online/offline status and live feedback are included. Before launch, run real screen-reader and keyboard tests on iOS, Android and desktop.

## Acknowledgements

Visual direction inspired by the reference boards provided for this build: Mulish-inspired airy type, calm white cards, cyan/violet gradients, interactive spherical branding and pill navigation. Motion principles are influenced by [EasyUI](https://easyui.site/components/); the demo contains independently implemented patterns rather than copied licensed code. PWA theme behaviour is aligned with [web.dev theming guidance](https://web.dev/learn/design/theming).
