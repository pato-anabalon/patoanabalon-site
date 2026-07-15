# patoanabalon.dev

Personal portfolio site for **Pato Anabalon** — Senior Software Engineer, ~18 years shipping software across banking, real estate and aviation. Currently at LATAM Airlines, aiming for Auckland, New Zealand.

Live: [patoanabalon.dev](https://patoanabalon.dev)

---

## What's inside

A 7-section single-page site with heavy motion design, bilingual (EN/ES), and a bento-style photo gallery with hand-curated sets.

| # | Section | Highlights |
|---|---|---|
| 01 | **Hero** | Boot-terminal preloader → scramble decode of the name → 6-tile grid revealed on scroll. Three.js vortex particles. |
| 02 | **About** | Line-mask reveal on H2, word-blur bios, clip-path portrait reveal, animated "→" arrow between Santiago and Auckland. |
| 03 | **Experience** | Pinned horizontal scroll track. Company cards, milestones (with scrambling year texts) and photo tiles enter cinematically as you scroll. |
| 04 | **Skills** | Pinned deck of 11 categories with crossfade. Skill cards enter with a 3D door-swing rotation (rotationY 90° → 0°). |
| 05 | **Creative** | Audiovisual work — motion graphics, video edits from Globant/LATAM years. |
| 06 | **Off-Screen** | Bento grid of 15 curated photos, 4 different sets cycled by a shuffle button, fullscreen lightbox modal. sessionStorage-persisted. |
| 07 | **Let's Talk** | Big typographic finale, navigate/follow columns, contact form with validation + injection guard + animated char counter, companies row (LATAM, Globant, Amicar, Mink, Indexa), emerald accent bottom bar. |

---

## Stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack) + **React 19**
- **TypeScript**, **Tailwind CSS v4**
- **GSAP 3.15** with Club plugins (`SplitText`, `ScrambleTextPlugin`, `ScrollTrigger`)
- **Three.js** for the hero vortex + particle fields
- **Lenis** for smooth scrolling
- **next-intl** for EN/ES localization

## Architecture

Atomic Design — everything lives under `src/components/{atoms,molecules,organisms,templates}`. Every component has a `data-testid`.

- `atoms/` — Button, Icon, SocialLink, VortexBackground, TopographicLines, Preloader
- `molecules/` — CompanyCard, MilestoneCard, MenuItem, SkillCard, Lightbox, TileSkeleton, StatCounter
- `organisms/` — one file per section (Hero, About, Experience, Skills, Creative, OffScreen, Contact) + Navbar + FullscreenMenu
- `templates/` — MainLayout (Lenis + Preloader wiring)

Content is separated from components:
- `src/lib/data/` — CV, skills, experience track, off-screen sets, social links
- `messages/{en,es}.json` — all copy through next-intl

---

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The dev server uses **Turbopack**. First cold build takes ~2s, HMR is instant.

Available scripts:
- `npm run dev` — dev server with hot reload
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint

---

## Environment variables

The site runs without any env vars in local dev — GA4 and the contact form gracefully degrade (analytics skips, contact form returns 500 with a clear log). For production these are needed:

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | client | GA4 Measurement ID (`G-XXXXXXXXXX`). Without it, `<GoogleAnalytics />` renders null and only Vercel Analytics captures events. |
| `RESEND_API_KEY` | server | Powers `/api/contact` via [Resend](https://resend.com). Without it the endpoint returns 500. The domain `patoanabalon.dev` is already verified in Resend (DKIM + SPF + DMARC). |

Both are set in Vercel Production. Pull them locally with `vercel env pull` if you need to test the full flow.

---

## Adding content

**A new photo to Off-Screen bento:**
1. Drop the file in `public/images/gallery/`
2. Edit `src/lib/data/offScreenSets.ts` — replace an existing entry in one of the 4 sets. Each entry is a tuple `[filename, labelKey?, year?]`.
3. If it's a new `labelKey`, add the caption under `offScreen.captions.<key>` in both `messages/en.json` and `messages/es.json`.

**A new translation:**
Every user-facing string lives under a namespaced key in `messages/en.json`. Mirror the key structure in `messages/es.json`. The site auto-picks the locale from the URL segment (`/en/...` or `/es/...`).

**A new section:**
1. Create `src/components/organisms/NewSection.tsx`
2. Export it from `src/components/organisms/index.ts`
3. Add its i18n block to both `messages/*.json`
4. Insert into the `main` in `src/app/[locale]/page.tsx`
5. Add to `SECTION_IDS` in `Navbar.tsx` so `useActiveSection` tracks it
6. Add a nav item to `FullscreenMenu.tsx` and to `NAV_SECTIONS` in `ContactSection.tsx`

---

## Deployment

Deployed on **Vercel** — every push to `master` builds and ships.

The canonical host is the apex `patoanabalon.dev`; `www.patoanabalon.dev` and the default `patoanabalon-site.vercel.app` alias both 308-redirect to the apex to avoid duplicate indexing. DNS lives at Namecheap.

---

## Contact

Hiring? Want to chat about the code?

- Email: [pato.anabalon@gmail.com](mailto:pato.anabalon@gmail.com)
- LinkedIn: [patricioanabalon](https://www.linkedin.com/in/patricioanabalon/)
- Instagram: [@pato.anabalon](https://www.instagram.com/pato.anabalon)
- X: [@pato_anabalon](https://x.com/pato_anabalon)

Built by Pato — everyone calls me Pato even though the passport says Patricio.
