/**
 * The brand's one accepted textual glyph for links/CTAs — a plain "→", never
 * an SVG or an emoji. See design_handoff_calden_site/_ds/.../readme.md
 * "Iconography".
 */
export function Arrow() {
  return (
    <span aria-hidden="true" className="ml-0.5">
      →
    </span>
  );
}
