/**
 * Minimal reimplementation of the handoff's ios-frame.jsx (127 lines of
 * prototype scaffolding) — a rounded bezel with a notch, clipping its
 * children.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden rounded-[32px] border-[6px] border-line bg-surface">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 z-[1] h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-line"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
