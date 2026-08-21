import { Section } from "@/components/ui/Section";

/**
 * Thin, named wrapper around `<Section surface="band">` for the three
 * full-bleed dark bands (homepage "How we work", About pull-quote,
 * case-study "A decision worth explaining"). Exists so those three call
 * sites read as "this is a band" rather than repeating the surface prop,
 * and so the dark-mode hairline behaviour has one place to change.
 */
export function BandSection({
  id,
  reveal,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  reveal?: boolean;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Section
      surface="band"
      id={id}
      reveal={reveal}
      className={className}
      containerClassName={containerClassName}
    >
      {children}
    </Section>
  );
}
