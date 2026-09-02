import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { HowWeWork } from "@/components/home/HowWeWork";
import { SelectedWork } from "@/components/home/SelectedWork";
import { CapabilityBand } from "@/components/home/CapabilityBand";
import { WhyCalden } from "@/components/home/WhyCalden";
import { ContactSection } from "@/components/home/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSite } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { organizationAndLocalBusinessJsonLd } from "@/lib/seo-json-ld";

/**
 * absoluteTitle: true — the homepage's title is seo.defaultTitle used
 * whole, NOT run through the "%s — Calden Digital" template (that would
 * double up the brand name). See BUILD-PLAN §Phase 8 pitfalls.
 */
export function generateMetadata(): Metadata {
  const { seo } = getSite();
  return buildMetadata({
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    path: "/",
    absoluteTitle: true,
  });
}

export default function Page() {
  const jsonLd = organizationAndLocalBusinessJsonLd();
  return (
    <>
      <JsonLd data={jsonLd} />
      <Header currentPath="/" />
      <Hero />
      <WhatWeDo />
      <HowWeWork />
      <SelectedWork />
      <CapabilityBand />
      <WhyCalden />
      <ContactSection />
    </>
  );
}
