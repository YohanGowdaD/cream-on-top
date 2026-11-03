# Cream on Top by Neha Gupta

A complete boutique cake studio website built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide, React Hook Form, and Zod.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. On Windows PowerShell with script execution restricted, use `npm.cmd` in place of `npm`.

```sh
npm run typecheck
npm run build
npm start
```

## Launch configuration

Copy `.env.example` to `.env.local` and supply the real business details. The central configuration is `src/config/business.ts`.

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: the verified business WhatsApp number with country code, digits only. **Intentionally empty as a clearly marked placeholder.** Until supplied, the enquiry form offers a copy action and the real Instagram profile. No fabricated number is linked. Rebuild after configuring it.
- `NEXT_PUBLIC_SITE_URL`: the final HTTPS website origin. This is the **canonical URL placeholder**. Until configured, canonical metadata is omitted and the proposal is marked `noindex`. Set the real domain and rebuild before launch.

The bakery schema includes only supplied details: name, founder, Bangalore/India, and Instagram. Add a street address, telephone, hours, or other business information only when verified. No prices, delivery radius, payment terms, or unsupported ratings are invented.

## Enquiry journey

Required fields are validated with React Hook Form and Zod. Celebration dates use Bangalore's calendar date. Customers can select up to three JPG/PNG/WebP reference images, up to 5 MB each, and preview/remove them locally.

Submitting prepares a formatted enquiry on the current device. **There is no database, email delivery, upload service, or background submission.** With a configured number, the WhatsApp button opens a prefilled message. Images must be attached manually in the conversation; WhatsApp URL links cannot transfer local files. Without a number, copy the prepared message and send it using the real Instagram profile. The interface explains these states.

The WhatsApp conversation and a quote do not confirm an order. Order confirmation is handled directly with the bakery.

## Brand photography

Cake and founder imagery uses the user's photographs in `reference-assets/new_assets/`, including the pastel princess hero, founder portrait, studio photographs, and new gallery designs. Images are optimized as WebP, and the gallery contains twelve real creations. The two wedding photographs retain their earlier supplied screenshot sources because the new folder has no matching replacements. See [ASSET_SOURCES.md](ASSET_SOURCES.md) for exact sources and crop coordinates. The eight-year badge is a historical milestone.

The Instagram section is a curated local gallery linking to the actual profile; it does not claim a live API integration. Testimonials are the three supplied reviews.

Cormorant Garamond and DM Sans are self-hosted in `src/fonts/`; no external font requests are needed when viewing the website. The download helper in `scripts/download-fonts.py` is only a development utility.

## Motion and interactions

The hero uses a staged headline entrance, a framed photo reveal, and subtle pointer and scroll depth. Section photography reveals as it enters the viewport; navigation tracks the active section and reading progress. Gallery and review transitions support touch swipes, and the enquiry form shows progress based on valid required details.

Animations respect the device's reduced-motion preference, keep server-rendered content readable, and preserve native scrolling. The shared preference hook avoids hydration mismatches. See the [recorded hero animation](artifacts/hero-animation.gif) for a preview captured from the running site.

## Browser checks

Start the application at port 3000, then run:

```sh
npm run test:e2e
```

The Playwright configuration uses installed Google Chrome. It covers filters, collection navigation, lightbox controls and keyboard access, testimonials, mobile navigation, form validation, local reference previews, and draft generation. Browser screenshots are saved under `artifacts/` during visual review.

Verification completed: production build and TypeScript passed, and all 26 Playwright checks passed. These include touch swipes, active navigation, valid enquiry progress, keyboard interactions, and hydration checks under both motion preferences. Visual review at 1440px, 1024px, 768px, 390px, and 360px found no horizontal overflow, broken visible images, hidden sections, or browser console errors. See `artifacts/visual-report.json` and the desktop/mobile screenshots for the recorded review.

## Structure

`src/app/` contains routing, metadata, and global styling; `src/components/` contains the thirteen sections and shared interactions; `src/data/` holds gallery and testimonial content; `src/lib/enquiry.ts` owns validation and WhatsApp formatting; `src/config/business.ts` holds verified business information and launch configuration.

Designed for 360px mobile through desktop screens, with reduced-motion support, focus states, accessible dialogs, and lazy-loaded images below the hero.

Body copy and form inputs use at least 16px text; navigation, buttons, labels, and compact notes use larger readable sizes. Phone layouts reflow the header, gallery, form, and footer to accommodate the text instead of shrinking it.
