## Book Sales Page — Concise Execution Plan

### Best choice
- **Developer path (Next.js 14 + Tailwind + shadcn/ui + Vercel + Lemon Squeezy/Stripe)**. Use the no‑code path (Framer) only if you must launch same‑day without owning code.

## Execution timeline

### Day 0 — Setup
- **Create accounts**: Vercel, GitHub, Lemon Squeezy (or Stripe), ConvertKit, Plausible.
- **Bootstrap app**: Next.js 14 (App Router) + TypeScript + Tailwind; add `shadcn/ui` + Radix.
- **Infra**: Init repo, first deploy to Vercel, connect domain/DNS.
- **Baseline**: Add `Plausible` analytics and `next-seo` config.

### Day 1 — Content and UI
- **Copy**: Finalize headline, bullets, pricing, FAQ with AI passes.
- **Sections**: Hero, social proof, inside‑the‑book, preview, pricing/formats, author, FAQ, CTA, footer.
- **Quality**: Mobile‑first, accessible (contrast, focus states, alt text), optimized images.

### Day 2 — Payments, email, tracking
- **Checkout**:
  - Prefer **Lemon Squeezy** for digital: include LS script and `BuyButton` with product ID.
  - Or **Stripe Checkout** via `/api/checkout` with price ID and success/cancel URLs.
- **Email**: ConvertKit form for “free sample chapter” + 3‑email automation.
- **Analytics events** (Plausible): `cta_click`, `checkout_start`, `purchase_success`, `sample_download`.

### Day 2.5 — SEO and metadata
- **SEO**: Titles (< 60 chars) and descriptions (< 160 chars) via `next-seo`.
- **Schema**: JSON‑LD for `Book` and `Product`; validate with Google Rich Results.
- **Social**: Dynamic OG image using Vercel OG (cover, title, optional rating).

### Day 3 — QA and launch
- **QA**: Mobile/desktop checks, keyboard nav, 404/500 pages, Lighthouse > 90.
- **E2E**: Test checkout and email flows.
- **Launch**: Point domain, publish on Vercel, announce.

## Week 2 — Iteration
- **A/B tests** (GrowthBook/PostHog): headline, hero image, price anchoring, social proof.
- **Content**: Add testimonials, refine copy, expand FAQs.
- **Optional AI Q&A**: Vercel AI SDK + OpenAI, answers only from approved excerpts.

## Deliverables checklist
- **Deployed site** on Vercel with custom domain
- **Complete responsive page** with all sections and accessibility basics
- **Working checkout** (Lemon Squeezy or Stripe)
- **Email capture + automation** (ConvertKit)
- **Analytics events + dashboard** (Plausible)
- **SEO + JSON‑LD + validated OG image**
- **Launch notes** and iteration plan

## Fastest no‑code alternative (if speed is critical)
- **Framer** landing template + **Lemon Squeezy** embed + **Plausible** + **ConvertKit**.
- Migrate to the developer stack later to own code and add custom features.


.env file

# frontend/.env (or .env.local)
REACT_APP_OPENROUTER_API_KEY=YOUR_API_KEY
REACT_APP_OPENROUTER_MODEL=openai/gpt-oss-20b:free
REACT_APP_BACKEND_URL=http://localhost:8000
