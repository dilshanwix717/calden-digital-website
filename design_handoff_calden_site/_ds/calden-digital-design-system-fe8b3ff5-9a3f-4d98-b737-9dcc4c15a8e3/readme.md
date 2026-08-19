# Calden Digital — Design System

Calden Digital is a software studio in Sri Lanka (Colombo) that **plans, designs
and builds custom websites and software** for businesses. Development work leads;
photography, social media and marketing attach as add-ons. The brand feel is
**professional, precise and calm — a studio that plans before it builds.**
Restraint over decoration, generous whitespace.

- **Tagline (permanent):** Building the digital foundation for modern businesses
- **Hero / about:** Modernising businesses through design and technology
- **Long-form bio:** Designing modern, reliable and user-friendly websites and
  software for businesses

## Sources provided
- `uploads/calden-brand-notes.md` — brand asset & rules note (colours, type, logo rules, messaging).
- `uploads/calden-mark.svg` → `assets/calden-mark.svg` — the three-layer symbol.
- `uploads/calden-digital-horizontal-allteal (1).svg` → `assets/calden-digital-horizontal.svg` — horizontal lockup.

The brand note references further logo files (stacked, one-line, dark variants,
favicon) that were **not** supplied. See *Iconography* and *Caveats*.

---

## CONTENT FUNDAMENTALS
- **Voice:** calm, precise, plain-spoken. Confident without hype. Short declarative
  sentences. Says what the studio does, not how amazing it is.
- **Person:** "we" for the studio, "you / your" for the client. Not "I".
- **Casing:** sentence case for headings and buttons ("Start a project", not
  "Start A Project"). ALL-CAPS only for the logo descriptor (DIGITAL) and small
  tracked eyebrows/captions.
- **Punctuation:** minimal. Em dashes for asides. No exclamation marks.
- **Emoji:** never.
- **Positioning in copy:** lead with web + software; frame photography / social /
  marketing as add-ons.
- **Example phrasing:** "We plan, design and build custom websites and software."
  · "A studio that plans before it builds." · "Web and software work leads.
  Everything else supports it."

## VISUAL FOUNDATIONS
- **Colour:** primary teal `#0F5C5C` on light; lighter teal `#167C78` reserved for
  dark backgrounds only; accent gold `#D4AF37` used *rarely*, for emphasis (never a
  button fill); ink `#12312F` for text. Backgrounds are **warm off-white, never pure
  white** (`#F5F2EA` page, `#FBFAF6` cards, `#EFEBE1` sunken). Neutral greys are
  tinted slightly toward teal, not pure grey.
- **Type:** Outfit throughout — SemiBold (600) headings, Regular (400) body; Medium
  (500) for labels. Headings tracked slightly tight (−0.01 to −0.022em). Body at a
  comfortable 65–75ch measure. Full scale: display / h1 / h2 / h3 / body-lg / body /
  small / caption, with desktop + mobile sizes (see `tokens/typography.css`).
- **Spacing:** 8px base scale (4px half-step). Section padding 96px desktop / 56px
  mobile; container max 1200px.
- **Backgrounds:** flat warm colour fields only. No images behind text, no
  full-bleed photography as decoration, no repeating patterns, no textures, **no
  gradients**.
- **Borders:** hairline 1px in teal-tinted grey (`--border-subtle/default/strong`).
  2px only for emphasis (focus ring, process-step ring). No heavy borders.
- **Shadows:** **none.** Elevation is expressed with borders and warm surface steps,
  never drop shadows, glows or glassmorphism.
- **Corner radii:** small and precise — 3 / 6 / 10 / 14px, plus a full pill for tags.
  No large soft-blob rounding.
- **Cards:** warm surface, 1px subtle border, small radius, flat. Hover deepens the
  border (and turns a linked title teal); no lift, no shadow.
- **Animation:** calm and short. 120–320ms, ease `cubic-bezier(0.2,0,0,1)`. Fades and
  small colour/border transitions only — no bounce, no scale-pop.
- **Hover / press:** buttons darken the teal on hover, darken further on active;
  secondary fills a faint teal wash; text links underline. No opacity fades for
  primary actions. Links use teal → darkened teal.
- **Focus:** 2px solid teal outline, 3px offset (or a 3px teal ring on fields).
- **Imagery vibe:** if photography is used it should be natural and calm (not
  saturated, not heavily filtered). No 3D shapes, no stock illustration.

## ICONOGRAPHY
- The brand ships **no icon set** of its own. The only supplied vector assets are the
  logo lockup and the three-layer mark (`assets/`).
- Approach: sparing, functional line icons. Where components need a glyph (the select
  chevron, card arrow) they are drawn as **inline 1.6px-stroke SVG / a bare `→`**,
  matching a light, precise line style — no filled or duotone icons.
- **Emoji / unicode as icons:** never used decoratively. A plain `→` arrow is the one
  accepted textual glyph (links, CTAs).
- **Recommended set for extension:** if a fuller icon library is needed, use
  **Lucide** (1.5–2px stroke, rounded joins) from CDN — it matches the existing line
  weight. This is a *recommendation*, not a supplied asset; flag when introduced.
- The logo must never be recoloured, stretched, rotated, or given effects. Keep clear
  space of at least the height of the "C" on all sides. Below ~28px use the two-layer
  favicon (not supplied — see Caveats).

---

## Components
Reusable primitives under `components/` (namespace exposed on `window` — run
`check_design_system` for the exact name):

- **Button** (`components/buttons/`) — primary / secondary / text; sizes sm·md·lg; hover, active, focus, disabled.
- **Input**, **Select**, **Textarea**, **Field** (`components/forms/`) — labelled fields with hint / error states; `Field` is the shared label+control+message wrapper.
- **Card** family (`components/cards/`) — **ProjectCard**, **ServiceCard**, **ProcessStep**.
- **Navbar**, **Footer** (`components/navigation/`) — site header and dark footer.

## UI kits
- **`ui_kits/website/`** — the Calden Digital marketing site: Home (hero, services,
  selected work, process, CTA), Work index, and a Contact form. Interactive
  click-through composing the components above.

## Foundations (Design System tab cards)
`foundations/` — Colours (brand, neutral, surfaces, semantic), Type (headings, body,
weights), Spacing (scale, section padding, radii), Brand (logo, clear space, voice).

## File index
- `styles.css` — global entry (import list only).
- `tokens/` — `colors.css`, `fonts.css`, `typography.css`, `spacing.css`, `radius.css`.
- `assets/` — `calden-mark.svg`, `calden-digital-horizontal.svg`.
- `components/`, `ui_kits/`, `foundations/` — as above.
- `thumbnail.html` — homepage tile. `SKILL.md` — Agent-Skill wrapper.

## Caveats
- **Fonts** load from the Google Fonts CDN (Outfit — the brand's real typeface, not a
  substitution). No local binaries are bundled.
- **Missing logo assets:** stacked, one-line, both dark variants, and the favicon were
  not supplied. On dark surfaces (footer) the wordmark is set as type in `#EDEFEE`
  per the brand's "wordmark on dark" rule. Please supply the dark lockups + favicon.
- No icon library was supplied; Lucide is recommended for extension (see Iconography).
