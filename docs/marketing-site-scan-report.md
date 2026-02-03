# Marketing Site Scan Report

## Site map of marketing routes
- `/` → `app/(marketing)/page.tsx`
- `/about` → `app/(marketing)/about/page.tsx`
- `/blog` → `app/(marketing)/blog/page.tsx`
- `/blog/[slug]` → `app/(marketing)/blog/[slug]/page.tsx`
- `/community` → `app/(marketing)/community/page.tsx`
- `/connect` → `app/(marketing)/connect/page.tsx`
- `/experience` → `app/(marketing)/experience/page.tsx`
- `/how-it-works` → `app/(marketing)/how-it-works/page.tsx`
- `/learn` → `app/(marketing)/learn/page.tsx`
- `/login` → `app/(marketing)/login/page.tsx`
- `/membership` → `app/(marketing)/membership/page.tsx`
- `/plan` → `app/(marketing)/plan/page.tsx`
- `/reflect` → `app/(marketing)/reflect/page.tsx`
- `/request-invite` → `app/(marketing)/request-invite/page.tsx`
- `/signup` → `app/(marketing)/signup/page.tsx`
- `/thank-you` → `app/(marketing)/thank-you/page.tsx`
- `/verify` → `app/(marketing)/verify/page.tsx`
- `/verify-invite` → `app/(marketing)/verify-invite/page.tsx`
- `/waitlist` → `app/(marketing)/waitlist/page.tsx`

*Marketing layout bootstraps every route above with `components/marketing/MarketingLayout`, which wraps `Navbar`, a subtle gradient background, and (unless explicitly hidden) `MarketingFooter` within `MarketingContainer` spacing.*

> **Hero image registry:** All marketing hero backgrounds must reference the centralized constants exported from `lib/heroImages.ts` (`heroMarketingSignature`, `horizontalRibbon`, `rightRibbonHero`, `upperLowerRibbonHero`) rather than hardcoding `/assets/images/heroes/*` paths; any legacy mentions below are retained for historical context only.

### /
**File(s):** `app/(marketing)/page.tsx`
**Purpose (inferred):** Anchor landing page that narrates each pillar, surfaces the invite-code gate, and funnels everyone toward `Request an Invite` or `How it Works` before gifting additional context.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `MarketingHero` breakout (min-h 85vh) with centered headline, supporting paragraph, and stacked CTAs inside a `max-w-[90%] md:max-w-[560px]` wrapper.  
  2. Invite-code card (`marketing-card` inside `MarketingContent`) with headline, supporting labels, a horizontal form (`md:flex-row md:items-end`), and a secondary continue button before the feature grid.  
  3. Density: hero + CTA card keep two high-priority actions above the fold while the remaining sections are ordered below to avoid crowding the hero.
- **Hero:**
  - Component: `MarketingHero` (breakout route flagged in `MarketingLayout`).
  - Heading text: “A new way to prep for baby - and parenthood.”
  - Subhead text: “Think less spiraling, more steady steps. We help you learn, plan, connect, and reflect — with a real human mentor…” (exact supportingText string).  
  - CTA(s): Primary “Request an Invite” (`marketing-btn-primary` with uppercase `tracking-[0.35em]`), secondary “How it works (without the overwhelm)”.  
  - Hero image (desktop): `heroMarketingSignature` (lib/heroImages.ts, resolves to `/assets/images/heroes/hero-marketing-signature.png`) rendered via `<img>` with `width={1536}`/`height={1024}` and `object-cover`.  
  - Max width / spacing: hero section spans `w-screen` via negative margins, uses `py-24 md:py-32`, background `#FBF7F4`, and hero copy zones are padded with `px-6 md:px-12`.
- **Sections below fold (ordered):**
  - Invite-only reminder → `marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8` with uppercase labels, a `marketing-form` inside `space-y-3`, and responsive `md:flex-row` inputs.  
  - Pillar feature narratives → iteration over `featureBlocks`, each `article` with `max-w-[90%] md:max-w-[640px]`, `space-y-6`, `font-serif` headlines, and `Image` previews sized via `sizes="(min-width: 768px) 520px, 90vw"`.  
  - Partner logos → `PartnerLogoCarousel` inside gradient card, marquee track using fetched `/api/logos` assets, `overflow-hidden rounded-[32px]`.  
  - “Why it feels loud” messaging → gradient `marketing-card` with `space-y-6` text blocks.  
  - “What makes this different” with four stacked items (each `marketing-card bg-white/80 p-5`) arranged vertically with `space-y-8`.  
  - “About TMBC” philosophy grid → `grid gap-4 md:grid-cols-3`, cards `rounded-[28px] border... bg-[var(--tmbc-ivory)]/80`.  
  - “What this is not” → gradient background plus `grid md:grid-cols-3`, cards styled like ivory tiles.  
  - “Member to mentor” endcap → centered `font-serif` heading, `system-language` claim, `px-10` layout, followed by supporting paragraph.  
  - “What this gives you” list → `ul space-y-4` in `max-w-[680px]` text and `text-xs` disclosure.  
  - “This is for you / may not be for you” → `grid gap-8 md:grid-cols-2` pair of `marketing-card` lists.
- **Footer/Endcap:** `MarketingFooter` (multi-column link list plus `©`, `Privacy`, `Terms`) is visible because `/` is not in `hideFooterRoutes`; a final footer-centric CTA repeats “Request an Invite” above the footer.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Breakout hero collapses to single-column copy (max-w 90%) with CTAs stacked via the `flex` container being `flex-col` before `md`.  
  2. Invite-code card retains full width (`max-w-[90%]`) and vertical stacking; form inputs span `w-full h-14`.  
  3. Remaining sections (feature stories, carousel, philosophy grids) follow as single-column stacks due to the default `grid-cols-1` and `space-y-*` wrappers.
- **Hero behavior:**
  - Does image swap to mobile portrait? Yes; `MarketingHero` adds a `<source media="(max-width: 768px)" srcSet="/assets/images/heroes/hero-marketing-signature-mobile.png" />` before the desktop `<img>`, which is the mobile adaption of the `heroMarketingSignature` art (see `lib/heroImages.ts`).  
  - Typography changes: copy maintains the same `hero-headline` / `hero-supporting` classes but shrinks to single column text; `max-w-[90%]` ensures the serif headline stays centered.  
  - CTA stacking: container is `flex` with `gap-4` but at mobile width the `Link`s render full-width since `marketing-btn` defaults to `w-full` and `sm:w-auto`.
- **Sections below fold:**
  - All `grid gap-4 md:grid-cols-*` layouts collapse to single-column stacks (the `md:` breakpoints do not apply, so each `marketing-card` takes `w-full`).  
  - Partner carousel still renders but its `partner-logo-track` uses `flex` with `gap-10` and `overflow-hidden` (no additional responsive classes).  
- **Navigation behavior:**
  - Header is the sticky `Navbar` (shrinks `py` once scrolled 40px, drop-down for the Experience group, `bg-[var(--tmbc-ivory)]/80 backdrop-blur-xl`).  
  - Mobile menu toggles via the three-line button; when open it renders `mobileNav` links (`Request Invite` marked `marketing-btn-primary`, `Login` as text).  
  - Footer remains visible because `/` is not hidden by `MarketingLayout`; no sticky elements beyond the header.

#### Components + Styling Notes
- **Top-level component tree:** `HomePage` → `Suspense` → `MarketingHero` + `RibbonDivider` + `MarketingContent` → repeated `sections` → `PartnerLogoCarousel` → `RibbonDivider` → final `footer` CTA → `MarketingFooter`.  
- **Repeated primitives:** `marketing-section`, `marketing-card`, `font-serif` headings, `marketing-btn` variants, `RibbonDivider`, `CTARibbon` (only used later) keep spacing and typography consistent.  
- **Risk flags:** Partner logos rely on a `/api/logos` fetch that renders nothing if the endpoint is slow, leaving the marquee visually empty; the invite code form depends on `/api/invite/validate` which can delay navigation since it lives above the fold.

### /about
**File(s):** `app/(marketing)/about/page.tsx`
**Purpose (inferred):** Humanize TMBC’s values, explain the invite-only philosophy, and direct visitors toward requesting access or understanding how the experience works.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `MarketingHero` with the signature hero artwork and a `RibbonDivider` that acts as a visual break.  
  2. Rounded `marketing-section` (bg-white/80, `border-[var(--tmbc-mauve)]/30`, `shadow-[0_30px_90px...]`) containing the “Why Taylor-Made Baby Co.” copy in `font-serif`.  
  3. Pair of editorial grids that alternate text and `MarketingImage` to showcase calm household scenes.
- **Hero:**
  - Component: `MarketingHero` (breakout hero with `shouldBreakoutHero`).
  - Heading text: “Why Taylor-Made Baby Co.”
  - Subhead text: “We guide you through each season with calm clarity, mentor-led pacing, and intentional next steps.”
  - CTA(s): Primary “Request Your Invite”, secondary “How it works (gently)”.
  - Hero image (desktop): `heroMarketingSignature` (lib/heroImages.ts).  
  - Max width / spacing: hero copy uses `max-w-[90%] md:max-w-[560px]`, `px-6 md:px-12`, `py-24 md:py-32`, while the background stretches `w-screen` via negative margins.
- **Sections below fold (ordered):**
  - “About” introduction card → `space-y-3 rounded-[48px] border bg-white/80 px-10 py-20 md:py-32` with `font-serif` heading and tone-setting paragraph.  
  - Editorial pairing → `grid gap-6 md:grid-cols-2` featuring `MarketingImage` (variant `editorial`, `aspectRatio="4/3"`, `maxWidth={520}`) alongside copy about calm spaces; spacing includes `my-12 md:my-16`.  
  - Second editorial pairing → same grid but swapped copy/image order, same padding.  
  - `RibbonDivider` (margin `my-32`).  
  - Philosophy grid → `grid gap-4 md:grid-cols-3`, each card `rounded-[28px] border... bg-white/80 p-5` with uppercase label (`text-[0.65rem] uppercase tracking-[0.35em]`).  
  - Another `RibbonDivider`.  
  - “Who it is for” grid → `grid gap-4 md:grid-cols-3`, cards `bg-[var(--tmbc-ivory)]/80` with `text-base` descriptions.  
  - Editorial photo block → `MarketingImage` (`variant="editorial"`, `aspectRatio="4/5"`, `maxWidth={520}`) inside `rounded-[32px] border... bg-white/80`.  
  - `CTARibbon` closing the page with `tone="strong"` copy (headline “Invite-only, with care”).
- **Footer/Endcap:** `MarketingFooter` remains visible; the page doubles down on `Request Your Invite` inside `CTARibbon` but no footer-level CTAs beyond the global links.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Breakout hero shrinks to single-column copy with center-aligned text; `MarketingHero` CTAs stack vertically.  
  2. Intro card and editorial grids collapse `md:grid-cols-2` into single-column stacks because no `md:` rules apply.  
  3. Subsequent grids turn into full-width cards (`grid-cols-1`) with `space-y-6` spacing and `px-8` padding.
- **Hero behavior:**
  - Does image swap to mobile portrait? Yes; `<source media="(max-width: 768px)" srcSet="/assets/images/heroes/hero-marketing-signature-mobile.png" />` provides a compressed background before the desktop `<img>` and aligns with `heroMarketingSignature`.  
  - Typography stays serif but the `max-w-[90%]` wrapper keeps lines short.  
  - CTA stacking uses the same `marketing-btn` defaults (`w-full sm:w-auto`) so buttons remain full-width on a 390px device.
- **Sections below fold:**
  - `grid gap-*` structures collapse, so every `MarketingImage` card spans full width; the half-width `md:grid-cols-2` states revert to single-column, maintaining `py-20`.  
  - The `CTARibbon` stays full-width but reduces its horizontal padding to match the column constraint.
- **Navigation behavior:**
  - Sticky `Navbar` continues to shrink on scroll, experience dropdown is still accessible via hover even though mobile users rely on the hamburger, and the mobile menu lists `Request Invite` as a purple pill plus `Login`.  
  - Footer is present because `/about` is not a hide route; no additional sticky modules appear.

#### Components + Styling Notes
- **Top-level component tree:** `AboutPage` → hero + `div.space-y-12` → editorial `sections` → `RibbonDivider`s → philosophy grids → `CTARibbon` → `MarketingFooter`.  
- **Repeated primitives:** `marketing-section` wrappers, `MarketingImage` (with placeholder asset metadata), `font-serif` for headings, `tracking-[0.5em]` uppercase labels, and the gradient/pale background tokens keep the page consistent.  
- **Risk flags:** All `MarketingImage` instances use `assetPath="TBD"`, meaning the visual placeholders may remain if the CMS assets are not wired; the page also duplicates the same hero copy as `/`, so there is limited differentiation unless new copy is provided.

### /blog
**File(s):** `app/(marketing)/blog/page.tsx`
**Purpose (inferred):** Present the Taylor-Made Journal with a featured story and grid of public posts that can funnel curious visitors into the invite flow.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `MarketingHero` with ribbon background, `RibbonDivider` immediately below, and (after the divider) the featured-post slot inside `MarketingContent`.  
  2. Featured story article (two-column card with `MarketingImage` hero and copy pane) anchored by a `Read the story` CTA.
  3. Secondary grid of remaining posts under the featured article.
- **Hero:**
  - Component: `MarketingHero` (breakout governed by `MarketingLayout`).
  - Heading text: “Clear thinking for pregnancy and early parenthood.”
  - Subhead text: `heroSupportingText` (text block with “Taylor-Made Journal” label and body about real conversations).  
  - CTA(s): Primary “Request an Invite”, secondary “How the journal works”.  
  - Hero image (desktop): `/assets/images/ribbons/section-background-soft-ribbon.png`.  
  - Max width / spacing: hero uses `w-screen`, `py-24 md:py-32`, and the copy sits in `max-w-[90%] md:max-w-[560px]`; `MarketingContent` adds `px-4 md:px-10 lg:px-16`.
- **Sections below fold (ordered):**
  - Featured story → `article mx-auto grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-[var(--tmbc-ivory)]/60 bg-tmIvory` with `sm:grid-cols-[1.1fr_0.9fr]`.  
    - Left column: `MarketingImage variant="hero-editorial" aspectRatio="4/3" maxWidth={920}` (padding `py-20 md:py-32`).  
    - Right column: meta tags, price, `h2` using `font-playfair`, excerpt, and `Link` CTA using `marketing-btn-secondary`.  
  - Other posts grid → `div.grid grid-cols-1 gap-6 md:grid-cols-2`, each `article` is a `marketing-card` with `MarketingImage`, `tags` chips (`rounded-full border`), `font-playfair` title, excerpt, and a “Read more” link below a top border.  
  - Fallback block → If API returns no posts, `MarketingContent` renders a centered message (`text-center text-base text-opacity-70`).
- **Footer/Endcap:** Marketing footer (same as base) plus no additional hero-level CTA because the page is a journal archive.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Ribbon hero and divider still occupy most of the viewport.  
  2. Featured card stacks (image on top, copy below).  
  3. Grid of other posts also becomes single column with wide cards.
- **Hero behavior:**
  - Does image swap to mobile portrait? Yes; `MarketingHero` adds `<source media="(max-width: 768px)" srcSet="/assets/images/ribbons/section-background-soft-ribbon-mobile.png" />`.  
  - Typography: `font-playfair` titles shrink to 2xl/3xl but remain legible inside `max-w` wrappers.  
  - CTA stacking: buttons appear stacked because the hero’s internal `flex` defaults to column on small screens.
- **Sections below fold:**
  - `sm:grid-cols-[1.1fr_0.9fr]` resolves to `grid-cols-1`, so the featured card image sits atop the copy; `MarketingImage` retains `w-full`.  
  - Secondary cards fill the width of the screen (the default `grid` is single column) and maintain `space-y-4` between elements.
- **Navigation behavior:**
  - Sticky `Navbar` persists, drop-down still present via hover on desktop, and mobile menu exposes `Request Invite` and `Login`.  
  - Footer remains (route is not hidden) and no sticky elements beyond the header.

#### Components + Styling Notes
- **Top-level component tree:** `BlogMarketingPage` → `MarketingHero` → `RibbonDivider` → `MarketingContent` → featured article card + other posts grid.  
- **Repeated primitives:** `MarketingImage`, `marketing-card`, `marketing-btn-secondary`, `font-playfair` headings, `rounded-2xl border` wrappers, `Link` CTAs that navigate to `/blog/${slug}`.  
- **Risk flags:** HTTP fetch in `fetchPublicPosts` is skipped during `build` (`SHOULD_SKIP_PUBLIC_BLOG_FETCH`) so filling the grid depends on runtime API success; if `/api/blog/public` is down, the page defaults to a minimal “check back soon” message, leaving the marketing funnel without new content.

### /blog/[slug]
**File(s):** `app/(marketing)/blog/[slug]/page.tsx`
**Purpose (inferred):** Render an individual journal article with hero art, metadata, share links, highlights, and an invite CTA at the end.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `MarketingImage` hero tile inside a `rounded-[40px] border border-tmMauve/40 bg-white/90` container with `MarketingImage` (variant `hero-editorial`, `aspectRatio="16/9"`, `maxWidth={960}`); `h1`, excerpt, tag chips, and metadata sit below the image.  
  2. `RibbonDivider`? (No actual `RibbonDivider` but the hero card is followed by the story grid with a left-hand `aside` once the article begins.)
  3. The rest of the layout is a `grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,240px)_1fr]` pairing a TOC/share aside with the article body.
- **Hero:**
  - Component: Custom hero block (no `MarketingHero`).
  - Heading text: dynamic `post.title` inside `font-playfair`, `text-3xl sm:text-4xl md:text-5xl`.  
  - Subhead text: excerpt (italic) plus `Taylor-Made Journal` label and supporting copy.  
  - CTA(s): none inside hero, but there is a CTA block below the article that points to `/request-invite`.  
  - Hero image (desktop): `MarketingImage` with placeholder metadata, rendered via `VisualPlaceholder`.  
  - Max width / spacing: hero container uses `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`, `space-y-12`, and the image block has `rounded-[40px]` plus `shadow-editorial`.
- **Sections below fold (ordered):**
  - Grid layout → `lg:grid-cols-[minmax(0,240px)_1fr]`, left column holds the “Table of Contents” (`ul` with `a` anchors) and share buttons, right column contains the article.  
  - Article column → `BlogContentRenderer` inside `rounded-[32px] border border-tmMauve/30 bg-white/95 p-8 shadow-soft`, followed by `BlogHighlightSection`, `BlogAffiliateEndCard`, and a gold-accent quote block (`border-l-4 border-tmGold/60`).  
  - CTA strip → gradient card (`border border-tmGold/40 bg-gradient-to-r from-tmMauve/70 via-tmBlush/70 to-tmIvory p-8 text-white`) with `Link` to `/request-invite`.  
  - Back-link → simple `Link` to `/blog` with uppercase tracking.
- **Footer/Endcap:** `MarketingFooter` is present because `/blog/[slug]` is not listed among hide routes.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Hero card collapses naturally with image on top and metadata below (`space-y-4`).  
  2. The `lg:grid-cols` layout reduces to a single column, so the TOC/share block stacks above the article body.  
  3. CTA card and back-link follow the article.
- **Hero behavior:**
  - Does image swap to mobile portrait? Not applicable; there is a single `<VisualPlaceholder>` image that scales responsively with `w-full h-auto`.  
  - Typography: `font-playfair` headings shrink but the serif style persists and `text-3xl` reduces to focus on readability.  
  - CTA stacking: the CTA card already runs full-width and retains `text-center` alignment across breakpoints.
- **Sections below fold:**
  - Grid-to-stack transition occurs because only `lg:grid-cols-[minmax(0,240px)_1fr]` is defined; under 1024px the aside sits above the body, and `space-y-8` keeps consistent spacing.  
  - Share buttons and TOC items shrink to `text-xs uppercase` but remain tappable via `Link`s.
- **Navigation behavior:**
  - Sticky header + mobile menu behave the same as other marketing routes; the drop-down remains accessible on desktop, and the hamburger shows the invite button in the mobile menu.  
  - Footer remains visible since no layout rule hides it.

#### Components + Styling Notes
- **Top-level component tree:** `BlogArticlePage` → hero `section` → `grid (aside + article column)` → `BlogContentRenderer` → `BlogHighlightSection` → `BlogAffiliateEndCard` → CTA gradient card → `MarketingFooter`.  
- **Repeated primitives:** `Rounded cards`, `border-tmMauve`, `text-[0.65rem] uppercase tracking` labels, `Link`s with `tracking-[0.5em]`, `share` buttons with `rounded-full border`, and `BlogContentRenderer` handles the bulk of article rendering (including headings/blocks).  
- **Risk flags:** Both `fetch` helpers (`fetchPublicPosts`, `fetchPublicPost`) silently return empty arrays when the API rejects, so a 404 or network failure results in `notFound()` or an empty grid; `BlogAffiliateEndCard` and `BlogHighlightSection` depend on data that may be missing, but the layout still renders blank placeholders.

### /community
**File(s):** `app/(marketing)/community/page.tsx`
**Purpose (inferred):** Describe the invite-only Community “village,” spotlight mentoring rituals, and nudge people toward experience or membership pathways.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. Rounded `marketing-section` with `bg-white/70`, `border`, and `shadow` containing the headline “You don't have to Google this alone,” body copy, and two CTAs (`Request Invite`, `Explore Experience`).  
  2. “Community modes” section with `grid gap-4 md:grid-cols-2`.  
  3. Testimonial-style cards and trust signals follow below.
- **Hero:**
  - Component: none; the top section doubles as a hero card but uses a standard `marketing-section`.  
  - Heading text: “You don't have to Google this alone.”  
  - Subhead text: “We built a village that feels like a salon, not a feed…”  
  - CTA(s): Primary “Request Invite”, secondary “Explore Experience” (both `marketing-btn` variants).  
  - Hero image: N/A (no background art).  
  - Max width / spacing: top card uses `px-10 py-20 md:py-32`, `max-w-screen-xl`, and `space-y-3` spacing while keeping text centered.
- **Sections below fold (ordered):**
  - Community modes grid → `grid gap-4 md:grid-cols-2`, each card `group rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-6` with `transition hover:-translate-y-1`.  
  - Mentor/member card trio → `grid gap-6 lg:grid-cols-3`, each uses `rounded-[32px] border`, `bg-[var(--tmbc-ivory)]/80`, and small `text-[0.65rem] uppercase` labels with body copy.  
  - Trust signals section → `rounded-[48px] border... bg-gradient-to-br` with `ul` bullet list and two CTA buttons (`Membership`, `Request Invite`).
- **Footer/Endcap:** Marketing footer is present; there is no dedicated footer CTA beyond the trust signals CTAs.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Top card stacks text and buttons vertically; `flex-col` and `gap-3` keep CTAs large (full-width).  
  2. Community modes grid collapses to a single column (`grid-cols-1`) with each card spanning the width due to `grid gap-4`.  
  3. Trust signals remain vertically stacked with `space-y-2` list items.
- **Hero behavior:** N/A — the page relies on a text-first module instead of `MarketingHero`.  
- **Sections below fold:**
  - `grid gap-4 md:grid-cols-2` becomes `grid-cols-1`, so cards stack, and `space-y-6` between the mentor/member trio keeps breathing room.  
  - `CTARibbon` is absent; the trust signals card still spans full width and maintains `text-sm uppercase` typography.
- **Navigation behavior:**
  - Sticky `Navbar` + mobile menu same as elsewhere; no hero-specific nav adjustments.  
  - Footer is visible because `/community` is not a hidden route.

#### Components + Styling Notes
- **Top-level component tree:** `CommunityPage` → `section` hero-card → `section` community-modes → `section` mentor/member cards → `section` trust signals → `MarketingFooter`.  
- **Repeated primitives:** `marketing-card`, `rounded-[32px]/[48px]`, `text-xs uppercase tracking-[0.35em]` labels, `grid gap-4`, and `marketing-btn` CTAs.  
- **Risk flags:** No hero imagery makes this feel visually lighter than other pillar pages; the experience depends on text-heavy cards alone and may not sufficiently differentiate the community offering.

### /connect
**File(s):** `app/(marketing)/connect/page.tsx`
**Purpose (inferred):** Highlight the Connect pillar—mentor-moderated rooms, circles, and follow-ups—and invite visitors to request an invite or learn more about the experience.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `MarketingHero` with soft ribbon art plus CTA buttons.  
  2. `RibbonDivider`.  
  3. `MarketingContent` begins with a simple `marketing-card` block titled “Connect” and text about the pillar.
- **Hero:**
  - Component: `MarketingHero` (breakout because `/connect` is listed in `breakoutHeroRoutes`).
  - Heading text: “You’re not meant to do this alone.”
  - Subhead text: “A supportive community of parents, mentors, and professionals…” etc.  
  - CTA(s): Primary “Request Your Invite”, secondary “How It Works (quietly)”.  
  - Hero image (desktop): `/assets/images/ribbons/section-background-soft-ribbon.png`.  
  - Max width / spacing: hero copy uses `max-w-[90%] md:max-w-[560px]`, `px-6 md:px-12`, and the `picture` background stretches via `w-screen`.
- **Sections below fold (ordered):**
  - “Connect” intro card → `marketing-card mb-24` with uppercase label and quiet supporting sentence.  
  - “How it supports parents” grid → `grid gap-4 md:grid-cols-3`, each card features an uppercase title (tracking `[0.35em]`) and descriptive paragraph inside `marketing-card bg-[var(--tmbc-ivory)]/80 p-5`.  
  - Soft statement section → `marketing-card bg-white/80 px-8 py-20` with a single reassuring sentence.  
  - `CTARibbon` (tone “medium”, headline “A calm circle is waiting”, button “Request Your Invite”).  
  - A placeholder comment notes the pillar needs more content (no visible UI change but indicates future work).
- **Footer/Endcap:** The marketing footer sits at the bottom because `/connect` is not in `hideFooterRoutes`.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Hero collapses to centered copy with stacked CTAs (buttons use `marketing-btn` default `w-full`).  
  2. Intro card remains full width via `px-8`.  
  3. The `md:grid-cols-3` grid collapses to a single column due to the absence of `lg` breakpoints, so each benefit card spans the width.
- **Hero behavior:**
  - Does image swap to mobile portrait? Yes; `/connect` appears in `MarketingHero`’s `MOBILE_HERO_SOURCES`, so a `<source media="(max-width: 768px)" srcSet="/assets/images/ribbons/section-background-soft-ribbon-mobile.png" />` serves the mobile hero.  
  - Typography remains `font-serif`, and the hero’s `space-y-6` ensures vertical breathing.  
  - CTA stacking defaults to column because `marketing-btn` applied width to small screens.
- **Sections below fold:**
  - `MarketingContent` keeps `px-4 md:px-10 lg:px-16`, so the grid cards stack with `space-y-6` and `w-full`.  
  - The `CTARibbon` still spans the width and retains its overlay gradient.
- **Navigation behavior:**
  - Navbar sticky + mobile menu as usual; experience dropdown still accessible via hover on desktop, and mobile menu lists `Experience` plus `Request Invite`/`Login`.  
  - Footer present, no extra sticky nav elements.

#### Components + Styling Notes
- **Top-level component tree:** `ConnectPage` → `MarketingHero` + `RibbonDivider` + `MarketingContent` → intro card → grid → statement card → `CTARibbon` → `MarketingFooter`.  
- **Repeated primitives:** `marketing-card`, `grid gap-4 md:grid-cols-3`, `text-[0.65rem] uppercase tracking-[0.35em]` labels, `marketing-btn` for CTAs, `CTARibbon` for bottom CTA, `RibbonDivider` for visual breathing.  
- **Risk flags:** Page currently lacks imagery and relies on short text blocks plus a TODO comment (“Expand Connect pillar…”), so it feels skeletal compared to other pillars and may underrepresent the Connect experience visually.

### /experience
**File(s):** `app/(marketing)/experience/page.tsx`
**Purpose (inferred):** Outline what visiting the experience feels like—learn, plan, connect, reflect rhythms—before inviting visitors to request an invite or continue exploring.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. Hero-like `marketing-section` (rounded, border, `bg-white/80`, `px-10 py-20 md:py-32`) with `font-serif` headline, a paragraph, a `MarketingImage` preview, and two CTAs (`Request Your Invite`, `The Experience`).  
  2. A quiet filler card (`marketing-section ... bg-white/80`) that emphasizes a calm pause.  
  3. `RibbonDivider` as a visual reset before the pillars.
- **Hero:**
  - Component: None (`ExperiencePage` builds a hero-like module manually).  
  - Heading text: “The Taylor-Made Experience.”  
  - Subhead text: “A calm, guided journey…” (paragraph).  
  - CTA(s): Primary – “Request Your Invite” (rounded button), Secondary – “The Experience” (secondary).  
  - Hero image (desktop): `MarketingImage` variant `hero-editorial` with `maxWidth={520}` inside `my-12 md:my-16`.  
  - Max width / spacing: hero section uses `max-w-screen-xl px-10 md:px-10`, `space-y-3`, and the CTA row uses `flex-col sm:flex-row gap-3`.
- **Sections below fold (ordered):**
  - Pillars grid → `grid gap-6 md:grid-cols-2` for Learn/Plan/Connect/Reflect, each card `rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-6 shadow-[0_18px_60px...]` containing a `MarketingImage` (`aspectRatio="4/3"`, `maxWidth={200}`) and copy.  
  - Quiet section → `rounded-[48px] border bg-white/80 px-8 py-20 md:py-32` with a single sentence.  
  - Philosophy grid → `grid gap-4 md:grid-cols-3`, each card `rounded-[28px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-5`.  
  - `CTARibbon` (headline “A calmer way to prepare”, tone “medium”).
- **Footer/Endcap:** Standard `MarketingFooter` since `/experience` is not hidden.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Manual hero card stacks the headline, paragraph, image, and CTAs vertically (row becomes column due to `flex-col`).  
  2. The filler card appears right below; `px-8` ensures margin.  
  3. Pillars grid collapses to `grid-cols-1` so each pillar’s card spans the screen width with `space-y-6` between elements.
- **Hero behavior:** N/A (no `MarketingHero`).  
- **Sections below fold:**
  - Pillar cards maintain `pt-6` but are now single-column, so `MarketingImage` sits above text.  
  - Philosophy grid collapses to single column because `md:grid-cols-3` is disabled at small widths.  
  - `CTARibbon` remains full-width and keeps overlay gradient via `bg` classes.
- **Navigation behavior:**
  - Sticky header + mobile menu as usual; the Experience route is part of the Experience dropdown, so the hover menu stays highlighted when you are on `/experience`.  
  - Footer remains present.

#### Components + Styling Notes
- **Top-level component tree:** `ExperiencePage` → hero block + `MarketingImage` + CTA row → filler card → `RibbonDivider` → pillars grid → filler card → philosophy grid → `CTARibbon` → `MarketingFooter`.  
- **Repeated primitives:** `rounded-[48px]/[32px]` panels, `MarketingImage` placeholders, `font-serif` headings, `text-[0.65rem] uppercase tracking-[0.35em]`, and `marketing-card` style shadows.  
- **Risk flags:** The page still carries a TODO comment (“Expand Experience pillar…”), so the current structure is text-heavy with placeholder imagery (`assetPath="TBD"`), offering little beyond copy that describes the experience in general terms.

### /how-it-works
**File(s):** `app/(marketing)/how-it-works/page.tsx`
**Purpose (inferred):** Articulate four guided steps (share context → meet mentor → plan → reflect) and set expectations about mentorship pacing.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `MarketingHero` (signature art), followed by `RibbonDivider`.  
  2. `MarketingContent` begins with a centered “How it works” badge card.  
  3. Step-by-step grid explaining the rhythm.
- **Hero:**
  - Component: `MarketingHero`.  
  - Heading text: “Baby prep, minus the spiral.”
  - Subhead text: “We guide you through pregnancy and early parenting in the right order…”  
  - CTA(s): Primary “Request Your Invite”, secondary “The Experience”.  
  - Hero image (desktop): `heroMarketingSignature` (lib/heroImages.ts).  
  - Max width / spacing: hero copy uses `max-w-[90%] md:max-w-[560px]`, `px-6 md:px-12`, `py-24 md:py-32`, and `picture` backgrounds stretch to `w-screen`.
- **Sections below fold (ordered):**
  - “How it works” grid → `marketing-card bg-[var(--tmbc-ivory)]/90 px-8 text-center` with uppercase badge.  
  - Steps grid → `marketing-section marketing-card space-y-6 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 px-8 py-20 md:py-32` containing `grid gap-6 md:grid-cols-2`; each card has `marketing-card bg-white/80 p-6`, uppercase heading, summary, and `text-[0.65rem] tracking-[0.35em]`.  
  - Expectations grid → `marketing-card bg-white/80 px-8 py-20 md:py-32`, `grid gap-4 md:grid-cols-3` with `marketing-card bg-[var(--tmbc-ivory)]/80 p-5`.  
  - `CTARibbon` (headline “Ready for a calmer path?” tone `medium`).
- **Footer/Endcap:** Standard `MarketingFooter`.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Hero collapsed; text center, CTAs vertical.  
  2. Badge card shrinks with `px-8`.  
  3. Steps and expectation grids stack because `md:grid-cols-*` do not apply.
- **Hero behavior:**
  - Does image swap to mobile portrait? Yes; `/how-it-works` is mapped to the mobile adaptation of `heroMarketingSignature` (lib/heroImages.ts).
  - Typography stays `font-serif` and the hero `flex` container centers copy; `max-w-[90%]` keeps line lengths short.  
  - CTAs stack via `marketing-btn` default `w-full` on small screens.
- **Sections below fold:**
  - Steps grid becomes a vertical list with cards full-width; `space-y-4` between them keeps spacing uniform.  
  - Expectation cards also stack and maintain `px-8 py-20`.  
- **Navigation behavior:**
  - Sticky header and mobile menu (with Experience dropdown) behave as usual, and the footer remains visible because this route is not hidden.

#### Components + Styling Notes
- **Top-level component tree:** `HowItWorksPage` → `MarketingHero` → `RibbonDivider` → step grid → expectation grid → `CTARibbon` → `MarketingFooter`.  
- **Repeated primitives:** `marketing-card`, `grid gap-4`, `text-xs uppercase tracking`, `font-serif`, `MarketingHero`, and `CTARibbon`.  
- **Risk flags:** The steps and expectations use textual cards without illustrative imagery, so the flow relies entirely on copy and the gradient card to signal pacing; there’s no visual hero beyond the top and no dynamic data, which could feel static if the copy isn’t refreshed.

### /learn
**File(s):** `app/(marketing)/learn/page.tsx`
**Purpose (inferred):** Promote the Learn pillar, including classroom-style modules and mentor-backed clarity, and invite visitors to request an invite.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `MarketingHero` with the learning flow artwork.  
  2. `ModuleSpotlightCard` (rounded, includes an image preview and CTA “Continue Module”).  
  3. `RibbonDivider` before the rest of the content.
- **Hero:**
  - Component: `MarketingHero`.  
  - Heading text: “Learn what matters for pregnancy and baby.”
  - Subhead text: “Clear, practical guidance … without the pressure to master everything at once.”
  - CTA(s): Primary “Request Your Invite”, secondary “How It Works (gently)”.  
  - Hero image (desktop): `/assets/images/ribbons/section-background-learning-flow.png`.  
  - Max width / spacing: hero uses `max-w-[90%] md:max-w-[560px]`, `py-24 md:py-32`, and `px-6 md:px-12` with full-width background.
- **Sections below fold (ordered):**
  - “Learn” intro card → `bg-[var(--tmbc-ivory)]/90 px-8 text-center`, calling itself a gentle divider.  
  - Soft editorial card → `marketing-card bg-white/80 px-8 py-20` with a short paragraph.  
  - Benefits grid → `grid gap-4 md:grid-cols-3`, each card `marketing-card bg-[var(--tmbc-ivory)]/80 p-5` with uppercase label and description (tracking `[0.35em]`).  
  - Relationship card → `marketing-card bg-white/80 px-8 py-20` with `system-language` and context paragraph.  
  - `CTARibbon` (tone `soft`, headline “Ready to learn with calm?”).
- **Footer/Endcap:** Standard `MarketingFooter` since `/learn` is not hidden.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Learning hero stays centered; CTAs stack vertically.  
  2. Module spotlight card spans the width, and the `Image` preview uses `w-full`.  
  3. Divider card and benefits stack in single column with `space-y-6`.
- **Hero behavior:**
  - Does image swap to mobile portrait? Yes; `/learn` gets `/assets/images/ribbons/section-background-learning-flow-mobile.png` via `MarketingHero`.  
  - Typography uses `max-w-[90%]` wrappers; `marketing-btn` ensures CTAs are full-width.  
  - Module spotlight’s `button` stretches full width since `bg-[#C8A1B4]` button uses `w-full`.
- **Sections below fold:**
  - Grid `md:grid-cols-3` collapses to `grid-cols-1` so each benefit card sits under the previous one.  
  - Relationship card retains `px-8 py-20` and text remains small with uppercase micro copy.  
- **Navigation behavior:**
  - Sticky header + mobile menu unchanged; `/learn` is part of the Experience dropdown, so “Experience” menu stays active.  
  - Footer is present.

#### Components + Styling Notes
- **Top-level component tree:** `LearnPage` → `MarketingHero` → `ModuleSpotlightCard` → `RibbonDivider` → `MarketingContent` → grid sections → `CTARibbon` → `MarketingFooter`.  
- **Repeated primitives:** `marketing-card`, `text-[0.65rem] uppercase tracking`, `grid gap-4 md:grid-cols-3`, `MarketingImage`, `marketing-btn`/`button` styling taken from `ModuleSpotlightCard`.  
- **Risk flags:** ModuleSpotlightCard is static and hardcoded to a single “Car Seat Masterclass,” so the Learn page lacks dynamic content and relies entirely on this placeholder to illustrate the module system.

### /login
**File(s):** `app/(marketing)/login/page.tsx`, `components/auth/LoginForm.tsx`
**Purpose (inferred):** Offer a centered login form for returning members, with quick links back to the marketing flow or invite request.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `main` fills the viewport (`min-h-screen`) with `flex items-center justify-center`, `bg-ivory`, and `px-4`.  
  2. `LoginForm` renders a `max-w-md` card (`rounded-[2rem] border bg-white/80 backdrop-blur p-8 sm:p-10 shadow`) containing the form and links.  
  3. The form occupies the entire card; there are no additional sections below.
- **Hero:** N/A (no marketing hero component; the login card is the single focus).  
- **Sections below fold (ordered):**
  - Login card → `p` label, `font-serif` h1, body text, `marketing-form` with two `input`s, error message placeholder, `marketing-btn-primary` “Login”, and inline links to `/request-invite` and `/` in a flex row.  
- **Footer/Endcap:** Omitted (`MarketingLayout` hides the footer for `/login`).

#### Mobile (≤390px)
- **Above the fold structure:**
  1. The `main` container keeps centering, and the card spans almost the full width due to `px-4`.  
  2. Inputs stack with `marketing-form` as a vertical column; `marketing-btn` fills the card width.  
- **Hero behavior:** N/A.  
- **Sections below fold:** The card is the sole section; there is no additional content to collapse.  
- **Navigation behavior:**  
  - Sticky `Navbar` still appears atop the page; the login card sits beneath it.  
  - No marketing footer appears, so navigation relies entirely on the header and the links inside the card.

#### Components + Styling Notes
- **Top-level component tree:** `LoginPage` → `main` flex container → `LoginForm` → `div.rounded card` → `form.marketing-form`.  
- **Repeated primitives:** `marketing-form`, `marketing-input` styles supply consistent spacing, `marketing-btn-primary` for the submit button, uppercase `tracking` for the auxiliary links.  
- **Risk flags:** The login card is the only content on the route, so if the auth API (`login`) fails or is rate limited, the user has no additional marketing context; the page also hides the footer, removing secondary navigation.

### /membership
**File(s):** `app/(marketing)/membership/page.tsx`
**Purpose (inferred):** Explain the membership pathway (learn → plan → connect), highlight mentor capabilities, and reinforce the invite-only gating.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `MarketingHero` with membership hero art, `RibbonDivider`, and `MarketingContent` following.  
  2. `membership` intro `marketing-card` with label and editorial text.  
  3. Mentor capability + platform support grid.
- **Hero:**
  - Component: `MarketingHero` (breakout).  
  - Heading text: “Start as a member. Grow into a mentor.”
  - Subhead text: “Membership gives you guided baby prep…”  
  - CTA(s): Primary “Request an Invite” (soft variant), secondary “How mentorship works”.  
  - Hero image (desktop): `/assets/images/ribbons/section-background-soft-ribbon.png`.  
  - Max width / spacing: hero copy sits inside `max-w-[90%] md:max-w-[560px]`, `px-6 md:px-12`, `py-24 md:py-32`.
- **Sections below fold (ordered):**
  - Membership intro divider → `marketing-card mb-24` with `tracking-[0.5em]` label and descriptive text.  
  - Mentor/platform grid → `grid gap-4 md:grid-cols-2`, each card `marketing-card bg-[var(--tmbc-ivory)]/80 p-6` listing bullet points.  
  - Invite-only clarification → `marketing-card space-y-5 bg-white/80 px-8 py-20` with `ul` of reasons and a CTA row linking back to `/request-invite`.  
  - `CTARibbon` not present (invites handled in the membership card itself) but the page ends after the invite reasons section.
- **Footer/Endcap:** Marketing footer is shown since the route is not hidden.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Hero collapses to single-column, CTAs stack, and the `MarketingHero` mobile swap (`/assets/images/ribbons/section-background-soft-ribbon-mobile.png`).  
  2. Intro card uses `px-8` for spacing.  
  3. Mentor/platform grid becomes a single column due to `md:grid-cols-2` collapsing.
- **Hero behavior:**
  - Does image swap to mobile portrait? Yes; `/membership` is mapped to the soft ribbon mobile image via `MarketingHero`.  
  - Typography remains serif and `hero-cta` ensures buttons lack multi-column layout.  
  - CTA stacking is vertical because `marketing-btn` defaults to `w-full` on small screens.
- **Sections below fold:**
  - Each `marketing-card` takes up `w-full` and keeps `space-y-4` or `space-y-3` inside.  
  - Invite reason list retains `text-sm uppercase` with bullet points and the CTA row flexes between `flex-col` and `sm:flex-row` depending on width.
- **Navigation behavior:**
  - Sticky `Navbar` and mobile menu behave as usual; the footer remains visible.  
  - The primary invite CTA stays within the invite-only clarification section and duplicates the top hero CTA in effect.

#### Components + Styling Notes
- **Top-level component tree:** `MembershipPage` → `MarketingHero` → `RibbonDivider` → intro card → mentor/platform grid → invite reasons list → `MarketingFooter`.  
- **Repeated primitives:** `marketing-card`, `font-serif`, `marketing-btn-primary` variants, `grid gap-4 md:grid-cols-2`, `tracking-[0.35em]` labels, and consistent `bg-[var(--tmbc-ivory)]/80` textures.  
- **Risk flags:** The page lists static bullet points for mentor capabilities and platform support without visuals—if the text becomes stale, the membership experience may feel underdeveloped; both lists are hard-coded and could diverge from active program offerings.

### /plan
**File(s):** `app/(marketing)/plan/page.tsx`
**Purpose (inferred):** Present the planning pillar, showcasing mentor note-taking, registry support, and steady pacing, then encourage invite requests.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `MarketingHero` with the plan art, `RibbonDivider`, and `MarketingContent` wrapping the rest.  
  2. A mellow card labeling “Plan” as a calm divider.  
  3. Benefit grid (two columns) explaining the planning support.
- **Hero:**
  - Component: `MarketingHero`.  
  - Heading text: “Plan for baby — with someone in your corner.”
  - Subhead text: “From registries to real-life logistics…”  
  - CTA(s): Primary “Request Your Invite”, secondary “How It Works (no rush)”.  
  - Hero image (desktop): `/assets/images/ribbons/section-background-soft-ribbon.png`.  
  - Max width / spacing: hero copy uses `max-w-[90%] md:max-w-[560px]`, `px-6 md:px-12`, `py-24 md:py-32`.
- **Sections below fold (ordered):**
  - Divider card → `marketing-card bg-[var(--tmbc-ivory)]/90 px-8` with micro copy.  
  - Benefit grid → `grid gap-4 md:grid-cols-2`, each card `marketing-card bg-[var(--tmbc-ivory)]/80 p-5` with uppercase label.  
  - `CTARibbon` (tone `medium`, headline “Plan with a steady guide”).
- **Footer/Endcap:** `MarketingFooter` is present.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Hero copy center, CTAs stacked, and the image loads the mobile variant (`section-background-soft-ribbon-mobile`).  
  2. Divider card and benefit cards stack vertically due to `md:grid-cols-2` collapsing.  
- **Hero behavior:**
  - Does image swap to mobile portrait? Yes (via `MarketingHero`).  
  - Typography remains `font-serif` and the CTA row is `flex-col` on small widths.  
  - Primary CTA is still in `marketing-btn` style and spans the width.
- **Sections below fold:**
  - Each benefit card is full-width with `space-y-4` internal spacing; the card copy uses `text-sm text-[var(--tmbc-charcoal)]/text-opacity` classes.  
  - `CTARibbon` still spans the width and retains its gradient overlay.
- **Navigation behavior:**
  - Sticky header and mobile menu show the hero state; the footer remains visible.

#### Components + Styling Notes
- **Top-level component tree:** `PlanPage` → `MarketingHero` → `RibbonDivider` → divider card → benefits grid → `CTARibbon` → `MarketingFooter`.  
- **Repeated primitives:** `marketing-card`, `grid gap-4`, `font-serif`, `text-[0.65rem] uppercase tracking`, `marketing-btn` CTAs, gradients (via `CTARibbon`).  
- **Risk flags:** The page leans heavily on text lists without unique visuals; the cards reiterate phrases already used on the Learn hero, offering little new context before the invite CTA.

### /reflect
**File(s):** `app/(marketing)/reflect/page.tsx`
**Purpose (inferred):** Describe the Reflect pillar (private journaling, keepsakes) and invite visitors to request an invite with calm reassurance.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `MarketingHero` (soft ribbon art) plus `RibbonDivider`.  
  2. Divider card announcing Reflect and its quiet tone.  
  3. Gradient card explaining keepsake philosophy.
- **Hero:**
  - Component: `MarketingHero`.  
  - Heading text: “A quiet place for the early days.”
  - Subhead text: “Capture thoughts, moments, and memories…”  
  - CTA(s): Primary “Request Your Invite”, secondary “How It Works (softly)”.  
  - Hero image (desktop): `/assets/images/ribbons/section-background-soft-ribbon.png`.  
  - Max width / spacing: Hero copy sits inside `max-w-[90%] md:max-w-[560px]`, `px-6 md:px-12`, while the background uses `py-24 md:py-32` and `w-screen`. 
- **Sections below fold (ordered):**
  - Reflect divider → `marketing-card bg-[var(--tmbc-ivory)]/90 px-8` with text.  
  - Gradient explanation card → `marketing-section marketing-card space-y-6 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 px-8 py-20 md:py-32` with paragraphs and `max-w-[680px]`.  
  - Keepsake detail card → `marketing-section bg-transparent px-8 py-20` with a single sentence to maintain cadence.  
  - Benefits grid → `marketing-card bg-white/80 px-8 py-20` with `grid gap-8 md:grid-cols-3`, cards `marketing-card bg-[var(--tmbc-ivory)]/80 p-4`.  
  - `CTARibbon` (tone `soft`, headline “Keep the story with care”).
- **Footer/Endcap:** Standard marketing footer.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Hero collapses to centered copy with stacked CTAs; mobile hero image used via `MarketingHero`.  
  2. Divider and gradient cards stack vertically.  
  3. Benefits grid becomes single column but retains `space-y-4` between cards.
- **Hero behavior:**
  - Does image swap to mobile portrait? Yes; `/reflect` shares the `section-background-soft-ribbon-mobile.png` path.  
  - Typography uses `max-w-[90%]` for copy; hero CTA buttons default to `w-full`.  
  - The gradient card’s paragraphs are stacked with `space-y-7` to keep readability.
- **Sections below fold:**
  - The `md:grid-cols-3` grid stacks, so each card spans the width.  
  - The keepake detail card remains `max-w-[680px]` but the section width shrinks to device width.
- **Navigation behavior:**
  - Sticky header + mobile menu as elsewhere; the hero remains anchored at the top of the page.  
  - Footer visible because `/reflect` isn’t hidden.

#### Components + Styling Notes
- **Top-level component tree:** `ReflectPage` → `MarketingHero` → `RibbonDivider` → divider + gradient cards → benefits grid → `CTARibbon` → `MarketingFooter`.  
- **Repeated primitives:** Ombre gradients (`bg-gradient-to-b`), `marketing-card`, `font-serif` headings, `system-language` class text, `grid gap-8 md:grid-cols-3`, `marketing-btn` CTAs.  
- **Risk flags:** The Reflect pillar currently doubles the same `section-background-soft-ribbon` art as other pillars, which dilutes differentiation; the page also leans heavily on text (lots of paragraphs) without additional imagery to convey intimacy.

### /request-invite
**File(s):** `app/(marketing)/request-invite/page.tsx`
**Purpose (inferred):** Collect invite requests via a guarded form so guests can apply for membership.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. Single `section` containing a centered card (`max-w-lg`, `rounded-[32px]`, `border`, `shadow`, `bg-white/90`).  
  2. Card includes page label, `font-serif` heading, explanatory paragraph, and the invite form.  
  3. Form fields and submit button fill the card; there are no additional sections below.
- **Hero:** N/A (the card is the hero by default).  
- **Sections below fold (ordered):**
  - Invite form card → uses `marketing-form` with field labels and `marketing-input`s for `name`, `email`, `due date`, `city`, and `referral source`; the submit button uses `marketing-btn marketing-btn-primary` and toggles text to “Sending...” when `loading`.  
  - Error handling: an error message appears within the form when the API rejects.  
  - There is no additional navigation or CTA beneath the form.
- **Footer/Endcap:** Footer is hidden (`MarketingLayout.hideFooterRoutes` includes `/request-invite`).

#### Mobile (≤390px)
- **Above the fold structure:**
  1. The card fills the width thanks to `mx-auto max-w-[90%]` and `px-8`.  
  2. Inputs stack vertically with `gap-4` inside `marketing-form`; each field uses `w-full min-h-[56px]`.  
- **Hero behavior:** N/A.  
- **Sections below fold:** N/A (form is the only block).  
- **Navigation behavior:**
  - Sticky header is still present; the footer is intentionally hidden to keep the request form focused.  
  - The user must rely on the header or in-form links for navigation.

#### Components + Styling Notes
- **Top-level component tree:** `RequestInvitePage` → `div.space-y-10` → `section.marketing-section` → card → `form.marketing-form`.  
- **Repeated primitives:** `marketing-form`, `marketing-input`, `marketing-btn-primary`, uppercase `tracking-[0.35em]`, `rounded-[32px]` card styling, and text colors referencing `var(--tmbc-charcoal)`.  
- **Risk flags:** The entire route depends on `onboardingApi.requestInvite`; if that service rejects or the code is invalid, the user is shown a generic error but has no secondary path to proceed (no inline CTA back to `How it Works`).

### /signup
**File(s):** `app/(marketing)/signup/page.tsx`
**Purpose (inferred):** Let invite holders create their TMBC + MyRegistry account via a full signup form guarded by codes.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `SignupForm` is wrapped in `Suspense` but renders a single `section` with a `max-w-xl` card (`rounded-[32px] border... bg-white/90 p-8`).  
  2. The card contains label text, heading, description, and either an invite warning (if no `code` query) or the `marketing-form` fields.  
  3. Fields include name, email, password, city/state/country (3-column grid), registry type select, and a submit button.
- **Hero:** N/A.
- **Sections below fold (ordered):**
  - Signup card → `text-xs uppercase` label, `font-serif` h1, paragraph, optional invite warning (red callout).  
  - Form → `grid grid-cols-1 gap-4 md:grid-cols-2` for name fields, single-column email/password, `grid grid-cols-1 gap-4 md:grid-cols-3` for location, and selectors; `marketing-input` styling on each field.  
  - Submit area → `marketing-btn marketing-btn-primary` with uppercase tracking, error text in red if API rejects.
- **Footer/Endcap:** Footer remains visible because `/signup` is not hidden.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Card spans `max-w-[90%]` and `p-8`.  
  2. The `grid` for name fields collapses to single column, so all fields stack vertically.  
- **Hero behavior:** Not applicable.  
- **Sections below fold:** No additional sections beyond the card; the affiliation `form` is the only block.  
- **Navigation behavior:** Sticky header still there, and the footer remains accessible below the card.

#### Components + Styling Notes
- **Top-level component tree:** `SignupPage` → `Suspense` → `SignupForm` → `section.marketing-section` → card → `form.space-y-5`.  
- **Repeated primitives:** `marketing-form`, `marketing-input`, uppercase `tracking-[0.3em]` labels, `grid` combos for responsiveness, and the `marketing-btn-primary`.  
- **Risk flags:** The form enforces an invite code (shows a warning if missing), but after submission it posts to `/auth/register` and immediately redirects via `routeForRole`; any backend delay leaves the form blocked with no additional guidance or CTA back to marketing content.

### /thank-you
**File(s):** `app/(marketing)/thank-you/page.tsx`, `components/PageSection.tsx`
**Purpose (inferred):** Confirm invite submissions and offer CTAs to the journal or membership pages while the request is being processed.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `PageSection` renders a `min-h-[60vh]` column that centers a thank-you message, `font-serif` heading, and paragraph.  
  2. A CTA row (`flex sm:flex-row`) offers buttons to `/blog` and `/membership`.  
  3. No additional sections exist beyond this confirmation block.
- **Hero:** N/A.
- **Sections below fold (ordered):**
  - Thank-you card → `PageSection` applies `max-w-screen-xl px-6 py-12 sm:py-16`, inner `div` uses `max-w-screen-xl flex flex-col items-center gap-6 text-center`.  
  - CTA row → `Link`s styled as `marketing-btn-secondary` and `marketing-btn-primary` with uppercase `tracking-[0.35em]`.  
- **Footer/Endcap:** Hidden (per `MarketingLayout.hideFooterRoutes`).

#### Mobile (≤390px)
- **Above the fold structure:**
  1. The confirmation content retains center alignment with `space-y-6`.  
  2. CTA buttons stack because the flex row becomes `flex-col` at small widths (the markup already sets `flex-col gap-3`).
- **Hero behavior:** N/A.
- **Sections below fold:** No extra sections exist; the page is intentionally minimal.  
- **Navigation behavior:** Header visible, footer hidden, so navigation back to marketing content depends on the hero nav or CTAs inside the card.

#### Components + Styling Notes
- **Top-level component tree:** `ThankYouPage` → `div.bg-[#FFFAF8]` → `PageSection` → centered column → CTA buttons.  
- **Repeated primitives:** `marketing-btn` variants for CTAs, `font-serif` heading, uppercase tracking on buttons, and `text-xs` microcopy.  
- **Risk flags:** Without a footer, the user has only two exit paths (blog or membership); if those pages are down, there’s no fallback guidance or copy telling them when to expect a reply.

### /verify
**File(s):** `app/(marketing)/verify/page.tsx`
**Purpose (inferred):** Let invitees verify their email and code to continue into the curated onboarding journey.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `Suspense` wraps `VerifyContent`, which renders a `section` with a centered `max-w-md` card (`rounded-[32px] border bg-white/90 p-8 shadow`).  
  2. Card contains `font-serif` heading, paragraph, and the invite verification form.  
  3. Form includes email + code inputs, error banner placeholder, and CTA button.
- **Hero:** N/A.
- **Sections below fold (ordered):**
  - Invitation verification card → `marketing-form` with `label`s, `marketing-input` fields for email and invite code, and `marketing-btn-primary` “Continue” button.  
  - Error message appears inside the form (`text-red-600`) when `inviteFlowApi.verifyInvite` rejects.  
- **Footer/Endcap:** `MarketingFooter` is visible because `/verify` is not hidden.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. The card spans `max-w-[90%]` and the form fields stack vertically.  
  2. Inputs use `w-full` and the button stretches to the card width.
- **Hero behavior:** N/A.
- **Sections below fold:** No other sections beyond the card.  
- **Navigation behavior:** Sticky header remains; the footer is available for navigation to other marketing pages.

#### Components + Styling Notes
- **Top-level component tree:** `VerifyPage` → `Suspense` → `VerifyContent` → `section.marketing-section` → card → `form.marketing-form`.  
- **Repeated primitives:** `marketing-form`, `marketing-input`, `marketing-btn-primary`, uppercase `tracking`, and `rounded-[32px]` card styling.  
- **Risk flags:** The submit handler pushes `/create-profile` with the token returned from `inviteFlowApi.verifyInvite`; if that API fails or returns `null`, the user only sees a generic “Invalid email or invite code” error with no guidance for next steps.

### /verify-invite
**File(s):** `app/(marketing)/verify-invite/page.tsx`
**Purpose (inferred):** Alternate entry point for invite verification; identical to `/verify` but with slightly different copy.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. `Suspense` wraps `VerifyContent` that renders a `max-w-md` card with heading “Verify your invitation.”  
  2. Paragraph explains that the concierge note provided the code.  
  3. Form contains email + invite code fields plus the `Continue` button.
- **Hero:** N/A.
- **Sections below fold (ordered):**
  - Verification card → `marketing-form`, `marketing-input` fields, `marketing-btn-primary` button with loading state, and inline error messaging.  
- **Footer/Endcap:** Marketing footer is shown.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. Card uses `max-w-[90%]`, `px-8`, and fields stack vertically.  
  2. Button stretches the width and the error message (if present) sits between inputs and the button.
- **Hero behavior:** Not applicable.  
- **Sections below fold:** No additional sections beyond the form card.  
- **Navigation behavior:** Sticky header present; the footer is available.

#### Components + Styling Notes
- **Top-level component tree:** `VerifyInvitePage` → `Suspense` → `VerifyContent` → card → form.  
- **Repeated primitives:** `marketing-form`, `marketing-input`, `marketing-btn-primary`, uppercase `tracking`, and `rounded-[32px]` styling.  
- **Risk flags:** Because the page duplicates `/verify`, any shared bug in `inviteFlowApi.verifyInvite` affects both routes; the user sees a generic error when the backend rejects without a path to escalate.

### /waitlist
**File(s):** `app/(marketing)/waitlist/page.tsx`
**Purpose (inferred):** Reassure visitors that requests are reviewed carefully and point them to invite validation if they already have a code.

#### Desktop (≥1024px)
- **Above the fold structure:**
  1. Single `marketing-section` card (`max-w-3xl`, `rounded-[32px]`, `border`, `bg-white/90`, `shadow`) with headline, paragraph, and a two-column grid outlining expectations and what to do if they need a code.  
  2. The two cards each contain a `h2` (text-2xl) and supporting list/paragraph plus an `Link` CTA.  
  3. No additional sections below.
- **Hero:** N/A.
- **Sections below fold (ordered):**
  - Waitlist information → `grid gap-4 md:grid-cols-2` with two `rounded-[28px] border... bg-white/70 p-6` cards; first card lists “What to expect” bullet items, second card contains “Need a code?” text and the `Request Invite` CTA.  
- **Footer/Endcap:** Marketing footer appears below the card.

#### Mobile (≤390px)
- **Above the fold structure:**
  1. The card spans `max-w-[90%]` and stacks the two columns vertically because `md:grid-cols-2` doesn’t apply.  
  2. Each bullet list and `Link` CTA sits within a full-width card.  
- **Hero behavior:** N/A.
- **Sections below fold:** None beyond the card.  
- **Navigation behavior:** Sticky header and footer remain as normal.

#### Components + Styling Notes
- **Top-level component tree:** `WaitlistPage` → `section.marketing-section` → card → `grid` with two inner cards → `MarketingFooter`.  
- **Repeated primitives:** `rounded-[28px]`, `border`, `text-2xl font-serif`, `text-[0.65rem] uppercase tracking`, and `marketing-btn marketing-btn-primary` for the “Return to Invite Page” link.  
- **Risk flags:** The page is purely informational with no CTA beyond the single invite link; if the invite page is down, there’s no fallback path for visitors already on the waitlist.

## Global consistency audit
- **Typography:** `font-serif` (and `font-playfair` inside the journal) anchor almost every heading, while body text relies on the system sans (no explicit class). Microcopy uses `text-[0.6rem]-text-[0.75rem] uppercase tracking-[0.3em–0.5em]` utility chains (`text-[0.65rem] uppercase tracking-[0.35em]`, `system-language`) and the `greatVibes` logotype in the `Navbar`.  
- **Color usage:** Tailwind utilities frequently reference `var(--tmbc-*)` tokens defined in `styles/globals.css` (`--tmbc-blush`, `--tmbc-mauve`, `--tmbc-ivory`, `--tmbc-gold`, `--tmbc-charcoal`). Cards and text use `bg-[var(--tmbc-ivory)]`, `bg-[var(--tmbc-blush)]/60`, `text-[var(--tmbc-charcoal)]`, `border-[var(--tmbc-mauve)]/30`, and even `bg-gradient-to-b` combos that blend blush/ivory/gold.  
- **Button styles:** The shared `.marketing-btn` base sets `inline-flex items-center justify-center w-full sm:w-auto min-h-[44px] px-6 py-3 text-base font-semibold tracking-wide rounded-2xl`. Variations include `marketing-btn-primary` (blush→mauve gradient, charcoal text, goldish shadow), `secondary` (white/clear background + charcoal border), `primary-medium` (textured gradient with extra shadow), and `primary-soft` (border with transparent blush). The `Navbar`’s persistent Request Invite pill also echoes these styles with its own gradient/border and uppercase tracking.  
- **Card styles:** Cards regularly use `rounded-[32px]` or `rounded-[48px]`, `border border-[var(--tmbc-mauve)]/30`, and layered shadows such as `shadow-[0_25px_70px_rgba(199,166,199,0.25)]` or `shadow-editorial`. Grid containers (`grid gap-4 md:grid-cols-*`) wrap these cards, and `marketing-section` wrappers pull in consistent `px-8 py-20 md:py-32` padding. Gradient cards (e.g., CTARibbon, `bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60`) reuse the same radius/shadow vocabulary.

## Flow audit
- **Top-level route rhythm:** The sticky `Navbar` exposes the primary marketing routes (`About`, `How It Works`, `Membership`, `Blog`) plus an “Experience” dropdown (`Learn`, `Plan`, `Connect`, `Reflect`) and a persistent `Request Invite` pill/`,Login` link; this means visitors can reach every pillar from every page without extra CTAs.  
- **CTA consistency:** “Request an Invite” is the primary CTA on every `MarketingHero`, the majority of `CTARibbon`s, and most section-level cards (community, membership, plan, reflect, plan, learn, how-it-works, close-of-home, blog featured cards). Secondary CTAs point to other contextual paths (e.g., `How it works`, `The Experience`, `Explore Experience`, `Read the Journal`). Individual blog posts add share + invite CTAs, and `thank-you` funnels visitors back to `/blog` or `/membership` for lingering engagement.  
- **Dead ends:** `/request-invite` and `/thank-you` are single-card dead ends (footer hidden, no in-layout nav beyond header); `/login`, `/signup`, `/verify`, and `/verify-invite` drop users into auth flows with no marketing CTA beyond header links; `/waitlist` only links back to `/request-invite`; `/experience` and `/community` are text-heavy with only one CTA (Invite or Explore) per section, so they rely entirely on the header or the “Request Invite” button for the next action.

## Hero system audit
- `MarketingHero` is treated as the authoritative hero when `MarketingLayout.shouldBreakoutHero` returns true; it stretches via negative margins, stays at `min-h-[85vh]`, and anchors every hero page listed below.  
- Desktop hero + mobile swap list:
  - `/` → hero image `/assets/images/heroes/hero-marketing-signature.png` and mobile portrait `/assets/images/heroes/hero-marketing-signature-mobile.png`.  
  - `/about` → same image pair as `/`.  
  - `/how-it-works` → desktop `/assets/images/heroes/hero-marketing-signature.png`, mobile `/assets/images/heroes/hero-marketing-signature-mobile.png`.  
  - `/learn` → desktop `/assets/images/ribbons/section-background-learning-flow.png`, mobile `/assets/images/ribbons/section-background-learning-flow-mobile.png`.  
  - `/plan`, `/connect`, `/reflect`, `/membership`, and `/blog` → all use `/assets/images/ribbons/section-background-soft-ribbon.png` on desktop and `/assets/images/ribbons/section-background-soft-ribbon-mobile.png` on mobile per `MOBILE_HERO_SOURCES`.  
- Routes without `MarketingHero` (`/experience`, `/community`, `/login`, `/request-invite`, `/signup`, `/thank-you`, `/verify`, `/verify-invite`, `/waitlist`, `/blog/[slug]`) use stacked cards or forms; they therefore rely on in-layout cards and CTARibbon blocks for hierarchy and offer no mobile hero swap.  
- The mobile swap logic is centralized in `MarketingHero.tsx` (via the `<picture>` element), so any missing entry in `MOBILE_HERO_SOURCES` would mean the desktop background persists on mobile for that route; the current map covers every route that uses `MarketingHero`.
