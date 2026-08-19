/** WhatsApp chat bubble. Path from design_handoff_calden_site/homepage-hero.jsx. */
export function ChatGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ flex: "none" }}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.4 9.5 9.5 0 0 1-4-.9L3 20l1.3-4.3A8.38 8.38 0 0 1 3.5 11 8.5 8.5 0 0 1 12 3a8.38 8.38 0 0 1 8.5 8.5Z" />
    </svg>
  );
}
