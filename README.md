# Ali Haider — Portfolio

Personal portfolio for **Ali Haider**, AI & Full-Stack Developer. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Design

Dark, instrument-like aesthetic: warm amber (`#E8823C`) on a green-undertoned ink (`#0B100E`). Type pairing is **Bricolage Grotesque** (display) + **Instrument Sans** (body) + **JetBrains Mono** (labels/data). The hero background is a live embedding-space canvas — points drift and draw edges to their nearest neighbors while a roaming "query" point retrieves its k-nearest, mirroring how a RAG system actually works.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Web3Forms key
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Public Web3Forms access key that powers the contact form. Safe to expose in the browser. |

`.env.local` is already set up locally. See `.env.example` for the template.

## ⚠️ Before you deploy — Web3Forms domain

The Web3Forms account is currently set to allow **localhost** for testing. The contact form will **not** send from your live site until you update the allowed domain:

1. Go to your [Web3Forms dashboard](https://web3forms.com).
2. Open the settings for access key `bbd1278c-…` (the "Contact" form).
3. Add your live Vercel URL (e.g. `your-project.vercel.app`, and your custom domain if you add one) to the **allowed domains**.

Spam protection: the form uses a hidden honeypot field (`botcheck`) plus the domain allow-list above.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel (it auto-detects Next.js — no config needed).
3. In **Project Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_WEB3FORMS_KEY` = your Web3Forms access key
4. Deploy.
5. **Don't forget** the Web3Forms domain step above, or the contact form will fail silently on the live site.

## Editing content

All copy — bio, projects, skills, links — lives in [`lib/content.ts`](lib/content.ts). Edit there; components read from it. Project media placeholders are ready to swap for real screenshots or demo GIFs inside `components/Projects.tsx` (`MediaFrame`).

## Accessibility & performance

- Respects `prefers-reduced-motion` (animations and the canvas fall back to static).
- Visible keyboard focus rings, semantic landmarks, `aria-live` form status.
- Fonts self-hosted via `next/font`; page is statically prerendered.
