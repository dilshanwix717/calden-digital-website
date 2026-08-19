import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { HowWeWork } from "@/components/home/HowWeWork";
import { SelectedWork } from "@/components/home/SelectedWork";
import { StreamingBand } from "@/components/home/StreamingBand";
import { WhyCalden } from "@/components/home/WhyCalden";
import { ContactSection } from "@/components/home/ContactSection";

export default function Page() {
  return (
    <>
      <Header currentPath="/" />
      <Hero />
      <WhatWeDo />
      <HowWeWork />
      <SelectedWork />
      <StreamingBand />
      <WhyCalden />
      <ContactSection />
    </>
  );
}
