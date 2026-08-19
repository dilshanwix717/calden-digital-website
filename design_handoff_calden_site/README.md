# Handoff: Calden Digital marketing site

## Overview
A five-page marketing site for Calden Digital, a one-person software studio in Sri Lanka: Homepage, Work index, Services, About, Contact, plus one Case Study template (built out for the "Susila" project — reuse it for the other two case studies).

## About the design files
The files in this bundle are **design references built in HTML** — high-fidelity prototypes of look, copy, and behavior, not production code to copy verbatim. The task is to **recreate these designs in the target codebase's environment** (Next.js, plain React, whatever the project already uses — or your own best pick if this is a fresh build) using that stack's conventions: real components, a proper build, routing, form handling, etc. Do not ship the HTML/Babel-in-browser setup as-is; it is a prototyping shortcut, not the intended runtime.

## Fidelity
**High-fidelity.** Colors, type, spacing and copy are final (copy was supplied by the client except where marked "authored" below). Recreate pixel-close using the values in Design Tokens.

## How the prototype is wired (for reading the source, not for shipping)
- Plain React 18 + Babel-in-browser (no build step) — each page is an `.html` file that loads React/ReactDOM/Babel from a CDN, then the Calden design-system bundle (`_ds/.../_ds_bundle.js`), then one or more `.jsx` files with `<script type="text/babel">`.
- `_ds/` is the full Calden Digital design system: CSS tokens (`tokens/*.css`), global component CSS, and a bundle exposing components on `window.CaldenDigitalDesignSystem_fe8b3f` (`Button`, `Input`, `Select`, `Textarea`, `Field`, `ServiceCard`, `ProjectCard`, `ProcessStep`, `Navbar`, `Footer`). Treat `tokens/*.css` as your source of truth for design tokens; treat the component JS as a *reference implementation* of each component's markup/states, not something to import into a real app.
- `homepage-hero.jsx` defines the shared nav, hero motion, and small helpers, exporting them on `window.CaldenHome` (no design-system namespacing — just how this prototype shares code between pages without a bundler).
- `site-common.jsx` defines shared page chrome (page header, contact CTA band, footer wrapper) on `window.CaldenSite`.
- `browser-window.jsx` / `ios-frame.jsx` are device-frame components (desktop browser chrome, iPhone bezel) used only on the Susila case study's screenshots section.
- `image-slot.js` renders the dashed drag-and-drop placeholders — in the real build these are just `<img>`/`next/image` once real screenshots exist.
- Each page overrides three CSS variables in a `<style>` block to apply the chosen "mint" background palette: `--surface-page: #EEF2F1; --surface-card: #FAFBFB; --surface-sunken: #E3E9E8`. Everything else comes from the design system's own tokens.

## Screens / pages

### 1. Homepage — `Homepage hero.html` (+ `homepage-hero.jsx`, `homepage-page.jsx`)
- **Nav**: sticky, 76px desktop / 60px mobile, logo left, links right (Work/Services/About/Contact), primary button "Start a project" → Contact.html. Hamburger icon only below 820px (non-functional in the prototype — needs a real menu).
- **Hero**: full-bleed section, `min-height: min(84vh, 720px)` desktop / auto on mobile. Centered headline (58px/1.05 desktop, 30px/1.12 mobile, weight 600, -0.022em tracking), subhead below (20px/16px, muted), two buttons (primary "Start a project →", secondary "Message us on WhatsApp" with a chat glyph). Behind the text: a canvas animation of three concentric hexagon outlines rotating/breathing slowly (teal strokes at low opacity), respecting `prefers-reduced-motion`. This is a decorative canvas loop — reimplement with CSS/SVG/Canvas as convenient; exact motion isn't load-bearing.
- **What we do**: 4-column grid (1 col mobile) of `ServiceCard`-style blocks: index number (01–04), title, one paragraph. Titles: Websites, Web applications, Custom software, Ongoing support.
- **How we work**: full-width dark band (`--surface-dark`, i.e. `--ink #12312F`), gold-free — uses `--teal-on-dark #167C78` for the 5 step-number rings. Horizontal 5-step row desktop (number circle + title + description per column, thin connecting line through the circles), vertical stack with a left rail on mobile.
- **Selected work**: header row with "Selected work" + "See all work →" (desktop; link drops below cards on mobile). 3-column grid (1 col mobile) of image-led cards: 4:3 screenshot slot, title, one-paragraph summary, small uppercase meta caption (e.g. "DESIGN AND BUILD · TWO WEEKS").
- **Streaming band**: full-width, quieter — `--surface-sunken`, 1px hairline top/bottom, centered narrow column (max 820px), heading + paragraph + "See how we did it →".
- **Why Calden**: 3-column grid (1 col mobile), each item has a 2px teal top rule, bold title, one paragraph.
- **Contact section** (`id="contact"`): 2-column desktop (5fr/6fr) — left: heading, paragraph, WhatsApp + email buttons; right: form card (Name, Email, Project type select, Timeline select, Budget range select, Message textarea, Send button, "We reply within a day." hint). Mobile: single column, buttons above the form.
- **Footer**: dark `Footer` component — brand wordmark + tagline, "Pages" column (Work/Services/About/Contact), "Contact" column (hello@calden.lk, WhatsApp), bottom bar with copyright and location line.

### 2. Work index — `Work.html` (+ `work-index.jsx`)
Header (eyebrow "Selected work", h1 "Work", lead paragraph) then three large alternating media/text rows (image left+text right, then reversed, on desktop; stacked with image first on mobile) for Susila, Landora Tours, Level Up, in that order. Each row: tag pills, project title (34px/28px), one-line subtitle, full summary paragraph, a 2-column Role/Timeline fact grid, a Stack line, and "Read case study →" (Susila links to the case study file; the other two are marked "Case study coming soon" pending those templates). Ends with the shared Contact CTA band + footer.

### 3. Services — `Services.html` (+ `services.jsx`)
Header, then four expanded service rows (number + title in a fixed-width left column, lead sentence + expanded paragraph + "included" tag chips on the right), separated by hairlines. Near the foot, a small, deliberately understated block headed "Taking over an existing project" (no card, no button — just a heading and one paragraph) before the shared Contact CTA + footer.

### 4. About — `About.html` (+ `about.jsx`)
Header ("Calden is one person."), then a 2-column intro (portrait image slot 4:5 left, name "Dilshan Wickramasinghe" + role + two paragraphs right), a full-width dark band with the pull-quote "You talk to the person who builds it." + one supporting line, a "How I work" 3-column grid (Plan before build / Honest about scope / Built to last), a "Where we are based" line (Colombo, Sri Lanka), then the shared Contact CTA + footer.

### 5. Contact — `Contact.html` (+ `contact.jsx`)
2-column (5fr/6fr desktop, stacked mobile): left — eyebrow "Contact", h1 "Tell us about your project", paragraph, WhatsApp + email buttons, a location/reply-time line; right — the same form as the homepage's contact section, in a card. No footer CTA repeat (it's already the contact page); ends with the shared footer.

### 6. Case study template — `Susila case study.html` (+ `case-study.jsx`)
Long-form template: header (back link, title, one-line description), a 3-column key-facts strip (Role/Timeline/Stack) on a sunken band, a lead paragraph (summary), "The problem" and "What we built" sections in a ~760px reading column, a full-bleed dark "A decision worth explaining" band with a large pull statement, "Since then"/"Outcome" sections, a screenshots section with a desktop browser frame + phone frame (image slots), a reserved client-quote band, a Previous/Next project nav (→ Level Up / Landora Tours), the shared Contact CTA, and footer. **Reuse this file's structure for the Landora and Level Up case studies** — swap in their copy from the case-studies draft, adjust facts/stack, and point Work.html's "coming soon" links at the new files.

## Interactions & behavior
- All buttons/links are prototype anchors (`href="#"` or real relative page names like `Contact.html`) — wire up real routing.
- The hamburger nav icon below 820px has no menu behind it — needs a real mobile nav (drawer/sheet).
- Forms have no submit handler (`onSubmit` just calls `preventDefault`) — wire to real form handling/validation/email or CRM integration.
- Mobile breakpoint used throughout: `window.innerWidth < 820` (a single JS-driven breakpoint, not CSS media queries) — replace with your framework's responsive approach; the layouts only need two states (desktop / mobile), verified at 1440 and 390px.
- Hero canvas animation: continuous, decorative, `prefers-reduced-motion` disables it (freezes on first frame).

## Design tokens
Full token files are in `_ds/tokens/` — read these directly, values below are the ones actually used:
- **Backgrounds (as shipped, "mint" palette):** page `#EEF2F1`, card `#FAFBFB`, sunken `#E3E9E8`. (Design-system defaults before this override were page `#F5F2EA`, card `#FBFAF6`, sunken `#EFEBE1` — both are valid per the system; mint is the client's chosen direction.)
- **Brand:** teal `#0F5C5C` (on light), teal-on-dark `#167C78`, gold `#D4AF37` (rare accent — not used on the mint pages), ink `#12312F` (text + dark surfaces), ink-on-dark `#EDEFEE`.
- **Borders:** subtle `#CDD6D4`-family (see `tokens/colors.css` grey scale), 1px default, 2px for emphasis (step rings, why-Calden rules).
- **Type:** Outfit, weights 400/500/600. Scale in `tokens/typography.css` (h1 48/34, h2 36/28, body 17/16, etc. desktop/mobile). Headings tracked −0.01 to −0.022em.
- **Spacing:** 8px scale in `tokens/spacing.css`; section padding 96px desktop / 56px mobile; container max 1200px.
- **Radius:** 3/6/10/14px + full pill (`tokens/radius.css`). No shadows anywhere — elevation is borders + surface steps only.

## Assets
- `assets/calden-digital-horizontal.svg` — horizontal logo lockup (teal), used in the nav.
- `assets/calden-mark.svg` — the three-layer hexagon mark (not directly used in these pages, but is the shape the hero canvas animation echoes).
- All project screenshots and the About-page portrait are **unfilled placeholders** (`<image-slot>` elements) — real assets still need to be sourced and dropped in.

## Copy sourcing
- Homepage, Contact section/page copy, and the Susila case study body copy came verbatim from the client's copy documents — treat as final.
- Services page expanded paragraphs, the "Taking over an existing project" block, the Work index intro line, and all About page copy were **authored by the design assistant** (no source doc existed) in the brand's plain, no-hype voice — flag these for the client to review/approve before shipping as final copy.
- The Susila case study currently names the client ("Susila Productions") per the literal draft; the source notes said to publish anonymised ("a Sri Lankan film production company") until permission is confirmed — check with the client before launch.

## Files in this bundle
```
Homepage hero.html        homepage-hero.jsx      homepage-page.jsx
Work.html                 work-index.jsx
Services.html             services.jsx
About.html                about.jsx
Contact.html              contact.jsx
Susila case study.html    case-study.jsx
site-common.jsx           browser-window.jsx     ios-frame.jsx     image-slot.js
assets/                   _ds/  (full design system: tokens, component bundle, CSS)
```
Open any `.html` file directly in a browser to view it — no build step required for review.
