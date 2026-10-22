# edx — School, together

A responsive, installable education-platform concept designed around communication between South African public-school educators and families (Grades 1–8).

**Current state: interactive frontend demonstration.** All learners, teachers, schools, messages and dates are fictional. Practice changes are kept in local browser storage; there is no authentication, school data connection, message delivery or secure student-record database yet. **Do not enter real student information.**

## What the app includes

- Parent and educator demo experiences, with clearly labeled role switching
- Four primary areas: Home, Updates, Calendar and Inbox
- Homework/notice filtering, read receipts (locally only) and subject-based grouping
- Working date selection, upcoming milestones and class-event previews
- Local-only educator update creation, conversation replies and module visibility controls
- Three-step onboarding, replayable through Settings
- Responsive desktop/mobile layouts, soft gradients, Phosphor icons, Mono numerals and a reduced-motion-aware Three.js orb
- Light / dark / system theme, installable PWA manifest, generated PNG icons and basic offline application shell
- Accessible control labels, system reduced-motion support, robots/llms metadata and OpenGraph branding

## Stack

**Next.js 16 App Router**, **React 19**, **TypeScript 7**, **pnpm 12**, **oxlint**, **oxfmt**, **Motion** and **Three.js**.

```bash
corepack enable  # or install pnpm 12 manually
pnpm install
pnpm dev
pnpm check
pnpm format
```

Use Node.js 22.13+ or Node 24 LTS. Production build: `pnpm build`. Vercel should detect Next.js from `package.json`.

## Project structure

- `app/` — Next App Router, metadata, generated icons, PWA manifest and loading UI
- `src/App.tsx` — role-aware interactive frontend and screen flows
- `src/components/` — accessible visual objects and PWA service worker registration
- `src/data.ts` — deterministic demo seed, storage and date helpers
- `src/styles.css` — responsive design tokens, surfaces, states and themes
- `public/sw.js` — same-origin application-shell caching; no private API caching
- `public/llms.txt` — AI-agent discovery notes and prototype limitations

## Important safety and product boundaries

Before any school/learner onboarding, implement verified school authorization, authenticated staff and parent accounts, per-child guardian enrollment, private messaging permissions and moderation, audited consent/privacy requirements (including POPIA and children's data), audit logs, incident response, secure server-side storage, account deletion and lawful retention schedules. No open student chatrooms or national staff database should ship without verification, safeguards and school participation.

The PWA does not provide real push delivery or reliable offline synchronization yet. Browser notification permission is only a demonstration of the permission flow; do not assume it sends reminders. The low-bandwidth offline shell deliberately avoids caching real learner records.

## Next milestone

Build secure school tenancy and guardian invitation flows, subject-based assignment publishing, school-admin publishing approval and real scheduled notifications before running a real-world pilot.
