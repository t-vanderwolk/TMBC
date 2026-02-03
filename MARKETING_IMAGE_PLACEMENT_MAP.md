# MARKETING_IMAGE_PLACEMENT_MAP.md

## Homepage

### A) Page Summary
- **Route:** `/`
- **File path(s):** `app/(marketing)/page.tsx`
- **Primary components used:** `MarketingLayout` (provides the ivory base and blush-to-transparent gradient overlay plus `MarketingNav`/`MarketingFooter`), hero section markup with background `next/image`, pillar cards, the “How It Works” steps grid, partner logo grid, and the final CTA section with the invite-flow preview.

### B) Image Placement Table
| Section Name | Component / File | Image Source | Render Method | Props | Layout Rules | Responsive Behavior | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hero | `app/(marketing)/page.tsx` → top hero section | `heroMarketingSignature` (see `lib/heroImages.ts`) | `next/image` | `fill`, `priority`, `sizes="100vw"`, `alt="Taylor-Made Baby Co. marketing hero"` | Container is `section.relative.w-screen` with `overflow-hidden` and padded text area on the left; image spans entire section with `className="h-full w-full object-fill"`; `MarketingLayout` adds a blush→transparent gradient overlay behind everything. | `fill` makes the image cover every breakpoint but `object-fill` distorts/crops on narrow widths; hero height driven by section top/bottom padding, so vertical crop occurs as viewport shrinks. | Replace: `homepagehero.png` (swap in the new hero asset and convert to `object-contain`/right-aligned frame to respect the hero rules). |
| How It Works step previews | `app/(marketing)/page.tsx` → card preview `<img>` inside the grid | `/images/marketing/step-learn.png` (Step 01), `/images/marketing/step-plan.png` (Step 02), `/images/marketing/step-connect.png` (Step 03), `/images/marketing/step-reflect.png` (Step 04) | `<img>` | no explicit width/height, classes `absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]` | Each card sits in a `grid` column; image lives inside `relative aspect-[9/19] overflow-hidden rounded-xl bg-neutral-50` so it is centered. | Image container scales naturally across breakpoints; `object-contain` keeps full image visible with white padding, so cropping risk is minimal. | Replace: `step-learn.png`, `step-plan.png`, `step-connect.png`, `step-reflect.png` (prepare updated preview graphics for each step card). |
| Partner logos | `app/(marketing)/page.tsx` → trusted-by grid | `/api/logos/baby-quip-logo.svg`, `/api/logos/angelbliss-logo.avif`, `/api/logos/babyshusher-logo.png`, `/api/logos/bellalunatoys.png`, `/api/logos/ergobabylogo.png`, `/api/logos/happiestbaby-logo.png`, `/api/logos/mustela-logo.png`, `/api/logos/tommee-tippee-logo.png` | `<img>` | `loading="lazy"`, `className="mx-auto max-h-10 w-auto opacity-80"`, `alt` pulled from `partnerLogos` array | Logos are centered inside `div` cells within a `grid` (`grid-cols-4 lg:grid-cols-8`, gap adjustments); each logo sits on a white rounded card. | Grid collapses responsively: columns shrink from 8 to 4 and rows wrap on mobile; `max-h-10` keeps logos same height so no cropping. | Keep (partner logos are third-party assets served from `/api/logos`, no new replacements needed unless partner set changes). |
| Invite flow preview | `app/(marketing)/page.tsx` → final CTA section | `/images/marketing/envelope.png` | `next/image` | `fill`, `sizes="100vw"`, `alt="Invite-only onboarding process from request to mentorship and guided experience"` | Image sits inside `div.relative.aspect-[16/10]` nested in `div.w-full.max-w-[520px]` that is right-aligned on large screens (`flex` container with `lg:justify-end`); `className="h-full w-full object-cover"` enforces cover. | `fill` keeps the preview filling the card at all breakpoints, but `object-cover` crops the image on narrower widths. |

### C) Visual Page Outline (Image-First)
- Hero (full-width background image, text block left over, image spans entire viewport) → uses `heroMarketingSignature` (refer to `lib/heroImages.ts`)<br>
- Section: Pillar cards (no central image, just text cards)<br>
- Section: Service description card (no image)<br>
- Section: How It Works (each card includes a centered preview image at the bottom) → uses the four `step-*.png` previews<br>
- Section: Quote panel (text only)<br>
- Section: Partner logos (grid of eight logos, centered inside cards) → uses `/api/logos/*`<br>
- Section: Final CTA (image on right, text on left) → uses `/images/marketing/envelope.png`

### D) Hard Findings
- Hero image uses `object-fill` within a full-bleed `<section>`, so the art is stretched/cropped at narrow breakpoints and warps compared to the hero rules (object should be `contain` and right-aligned with whitespace on the left). The `MarketingLayout` gradient overlay also introduces a blush tint atop the hero, which conflicts with the “no overlays/dimming” requirement.
- The invite-flow preview relies on `object-cover`, which crops the image on smaller widths; any new asset needs to be framed with safe-area margins or swapped to `object-contain` to keep the entire graphic visible.

## About page

### A) Page Summary
- **Route:** `/about`
- **File path(s):** `app/(marketing)/about/page.tsx`
- **Primary components used:** `MarketingLayout` (same gradient backdrop with nav/footer), the “Why Taylor-Made Baby Co.” hero/text split, and a series of text-first sections (problem cards, philosophy cards, operating system dots, and FAQ cards). The only image is the hero art inside the intro section.

### B) Image Placement Table
| Section Name | Component / File | Image Source | Render Method | Props | Layout Rules | Responsive Behavior | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hero art | `app/(marketing)/about/page.tsx` → intro section | `/images/marketing/hero-marketing-signature.png` | `<img>` | `className="h-full w-full object-cover"`, `alt="Taylor-Made Baby Co. hero art"` | Wrapped in `div.rounded-[32px].overflow-hidden.bg-white/60` inside an `lg:grid` column; image sits inside `div.aspect-[21/9]` so it is a wide banner on the right side of the hero (text left). | Aspect ratio keeps the banner wide on desktop; on small screens the stack puts the hero image below the text but still spans the column width, and `object-cover` crops the art vertically. | Replace: `hero-marketing-signature.png` (refresh the hero art and consider swapping to `next/image` with `object-contain` so the artwork is never cropped). |

### C) Visual Page Outline (Image-First)
- Hero (image on the right side of the intro, text on the left) → uses `/images/marketing/hero-marketing-signature.png`<br>
- Problem cards (text only)<br>
- Philosophy cards grid (text only)<br>
- “What we actually do” steps (text only)<br>
- “Made for / Not our lane” split cards (text only)<br>
- Values list (text only)<br>
- Tiny FAQ accordions (text only)<br>
- Final CTA card (text only)

### D) Hard Findings
- The hero art is an `<img>` with `object-cover`, so the wide artwork gets cropped on narrower screens and cannot be right-aligned (it currently just fills the card). It also bypasses `next/image`, so it misses priority loading & responsive srcsets; consider swapping to `Image` + `object-contain` to honor the hero rules.
- The `MarketingLayout` gradient overlay still sits behind the hero and tints the art, meaning there is a subtle blush seam on top of the “no overlays/dimming” rule; if the hero graphic needs clarity, the gradient might need adjustment for the `/about` hero only.
