import { getSite } from "@/lib/content";
import { Section } from "@/components/ui/Section";

export function WhyCalden() {
  const { homepage } = getSite();
  const { whyCalden } = homepage;

  // reveal off on the Section: each item below reveals itself individually.
  return (
    <Section surface="page" reveal={false}>
      <h2 className="t-h2 text-ink">{whyCalden.heading}</h2>
      <div className="mt-7 grid grid-cols-1 gap-7 desk:mt-11 desk:grid-cols-3 desk:gap-10">
        {whyCalden.items.map((item) => (
          <div key={item.title} className="reveal border-t-2 border-brand pt-5">
            <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-ink desk:text-[21px]">
              {item.title}
            </h3>
            <p className="t-small mt-3 text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
