import { z } from "zod";

/**
 * Every schema for /content. This file is the single source of truth for the
 * shape of site copy — lib/content.ts imports from here and nowhere else
 * defines a content shape.
 *
 * These schemas run at build time only (module-scope parse in lib/content.ts
 * and lib/mdx.ts, plus scripts/validate-content.ts). None of this file is
 * imported by a client component, so its size does not count against the
 * First Load JS budget. The contact form's client-side schema in Phase 7 is
 * separate and deliberately uses zod/mini for that reason.
 */

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

/** alt is required but may be "" for decorative images — omitting the key is
 * an error, so a missing alt can never ship silently. */
const ImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

/** /path, mailto:, or the "whatsapp" sentinel resolved by lib/whatsapp.ts. */
const NavHrefSchema = z.union([
  z.string().startsWith("/"),
  z.string().startsWith("mailto:"),
  z.literal("whatsapp"),
]);

const NavLinkSchema = z.object({
  label: z.string().min(1),
  href: NavHrefSchema,
});

// ---------------------------------------------------------------------------
// site.json
// ---------------------------------------------------------------------------

const HomepageWhyItemSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

const PageHeaderSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  lead: z.string().nullable(),
});

const ContactFormOptionsSchema = z.object({
  projectTypes: z.array(z.string().min(1)).min(1),
  timelines: z.array(z.string().min(1)).min(1),
  budgets: z.array(z.string().min(1)).min(1),
  labels: z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    projectType: z.string().min(1),
    timeline: z.string().min(1),
    budget: z.string().min(1),
    message: z.string().min(1),
  }),
  placeholders: z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    projectType: z.string().min(1),
    timeline: z.string().min(1),
    budget: z.string().min(1),
    message: z.string().min(1),
  }),
  submitLabel: z.string().min(1),
  replyHint: z.string().min(1),
  successHeading: z.string().min(1),
  successBody: z.string().min(1),
  errorMessage: z.string().min(1),
  rateLimitMessage: z.string().min(1),
});

const PrivacySectionSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
});

export const SiteSchema = z.object({
  company: z.object({
    name: z.string().min(1),
    shortName: z.string().min(1),
    tagline: z.string().min(1),
    description: z.string().min(1),
    foundedYear: z.number().int(),
  }),
  contact: z.object({
    email: z.email(),
    replyTime: z.string().min(1),
    locationShort: z.string().min(1),
    locationLong: z.string().min(1),
    contactPageNote: z.string().min(1),
  }),
  whatsapp: z.object({
    // E.164 digits, no leading zero, no "+", no spaces — the wa.me URL format
    // requires exactly this.
    number: z.string().regex(/^[1-9]\d{7,14}$/, "must be E.164 digits with no +, spaces or leading zero"),
    defaultMessage: z.string().min(1),
    label: z.string().min(1),
  }),
  socials: z.array(z.object({ label: z.string().min(1), href: z.string().url() })),
  hero: z.object({
    headline: z.string().min(1),
    subhead: z.string().min(1),
    primaryCta: NavLinkSchema,
    video: z.object({
      enabled: z.boolean(),
      poster: ImageSchema,
      sources: z.object({
        mobile: z.object({ src: z.string().min(1), type: z.string().min(1), maxWidth: z.number().int().positive() }),
        desktop: z.object({ src: z.string().min(1), type: z.string().min(1) }),
      }),
      scrimOpacity: z.number().min(0).max(1),
    }),
  }),
  homepage: z.object({
    whatWeDo: z.object({ heading: z.string().min(1) }),
    selectedWork: z.object({
      heading: z.string().min(1),
      seeAllLabel: z.string().min(1),
      seeAllHref: z.string().startsWith("/"),
    }),
    streaming: z.object({
      heading: z.string().min(1),
      body: z.string().min(1),
      linkLabel: z.string().min(1),
      linkHref: z.string().startsWith("/"),
    }),
    whyCalden: z.object({
      heading: z.string().min(1),
      items: z.array(HomepageWhyItemSchema).min(1),
    }),
    contact: z.object({ heading: z.string().min(1), body: z.string().min(1) }),
  }),
  pageHeaders: z.object({
    work: PageHeaderSchema,
    services: PageHeaderSchema,
    about: PageHeaderSchema,
    contact: PageHeaderSchema,
    privacy: PageHeaderSchema,
  }),
  contactCta: z.object({ heading: z.string().min(1), body: z.string().min(1) }),
  servicesPage: z.object({
    takeover: z.object({ heading: z.string().min(1), body: z.string().min(1) }),
  }),
  aboutPage: z.object({
    portrait: ImageSchema,
    name: z.string().min(1),
    role: z.string().min(1),
    bio: z.array(z.string().min(1)).min(1),
    pullQuote: z.object({ statement: z.string().min(1), support: z.string().min(1) }),
    howIWork: z.object({
      heading: z.string().min(1),
      items: z.array(HomepageWhyItemSchema).min(1),
    }),
    location: z.object({ heading: z.string().min(1), body: z.string().min(1) }),
  }),
  contactForm: ContactFormOptionsSchema,
  notFound: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
    homeLabel: z.string().min(1),
    workLabel: z.string().min(1),
  }),
  privacy: z.object({
    lastUpdated: z.iso.date(),
    sections: z.array(PrivacySectionSchema).min(1),
  }),
  seo: z
    .object({
      siteUrl: z.url(),
      defaultTitle: z.string().min(1),
      titleTemplate: z.string().includes("%s"),
      defaultDescription: z.string().min(1),
      defaultOgImage: ImageSchema,
      twitterHandle: z.string().nullable(),
    })
    // sitemap.ts concatenates paths onto siteUrl; a trailing slash would
    // produce double slashes.
    .refine((s) => !s.siteUrl.endsWith("/"), {
      error: "seo.siteUrl must not end with a trailing slash",
      path: ["siteUrl"],
    }),
  analytics: z.object({ plausibleDomain: z.string().nullable() }),
  copyright: z.string().min(1),
});
export type Site = z.infer<typeof SiteSchema>;

// ---------------------------------------------------------------------------
// navigation.json
// ---------------------------------------------------------------------------

export const NavigationSchema = z.object({
  primary: z.array(NavLinkSchema).min(1),
  navCta: NavLinkSchema,
  footerColumns: z
    .array(
      z.object({
        title: z.string().min(1),
        links: z.array(NavLinkSchema).min(1),
      }),
    )
    .min(1),
  legal: z.array(NavLinkSchema),
});
export type Navigation = z.infer<typeof NavigationSchema>;

// ---------------------------------------------------------------------------
// services.json — exactly four blocks
// ---------------------------------------------------------------------------

export const ServiceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  index: z.string().regex(/^\d{2}$/),
  title: z.string().min(1),
  lead: z.string().min(1),
  body: z.string().min(1),
  includes: z.array(z.string().min(1)).min(1),
});
export const ServicesSchema = z.array(ServiceSchema).length(4);
export type Service = z.infer<typeof ServiceSchema>;

// ---------------------------------------------------------------------------
// process.json — exactly five steps
// ---------------------------------------------------------------------------

export const ProcessSchema = z.object({
  heading: z.string().min(1),
  intro: z.string().min(1),
  steps: z
    .array(
      z.object({
        step: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .length(5),
});
export type Process = z.infer<typeof ProcessSchema>;

// ---------------------------------------------------------------------------
// projects.json
// ---------------------------------------------------------------------------

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  displayOrder: z.number().int().positive(),
  featured: z.boolean(),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  cardTitle: z.string().min(1),
  cardSummary: z.string().min(1),
  cardMeta: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  role: z.string().min(1),
  timeline: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  cover: ImageSchema,
});

export const ProjectsSchema = z.array(ProjectSchema).superRefine((projects, ctx) => {
  const orders = new Map<number, number>();
  const slugs = new Map<string, number>();
  projects.forEach((p, i) => {
    if (orders.has(p.displayOrder)) {
      ctx.addIssue({
        code: "custom",
        message: `displayOrder ${p.displayOrder} is used by both "${projects[orders.get(p.displayOrder)!]!.slug}" and "${p.slug}" — every project needs a unique displayOrder`,
        path: [i, "displayOrder"],
      });
    } else {
      orders.set(p.displayOrder, i);
    }
    if (slugs.has(p.slug)) {
      ctx.addIssue({
        code: "custom",
        message: `slug "${p.slug}" is used more than once`,
        path: [i, "slug"],
      });
    } else {
      slugs.set(p.slug, i);
    }
  });
});
export type Project = z.infer<typeof ProjectSchema>;

// ---------------------------------------------------------------------------
// case-studies/*.mdx frontmatter
// ---------------------------------------------------------------------------

const ScreenSchema = z.object({
  frame: z.enum(["browser", "phone"]),
  url: z.string().min(1).optional(),
  image: ImageSchema,
  caption: z.string().min(1),
});

export const CaseStudyFrontmatterSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  summary: z.string().min(1),
  facts: z.object({
    role: z.string().min(1),
    timeline: z.string().min(1),
    stack: z.string().min(1),
  }),
  decision: z.object({
    eyebrow: z.string().nullable(),
    statement: z.string().nullable(),
  }),
  screens: z.array(ScreenSchema),
  quote: z.object({
    text: z.string().nullable(),
    attribution: z.string().min(1),
  }),
  anonymised: z.boolean(),
  draft: z.boolean(),
  publishedAt: z.iso.date(),
  updatedAt: z.iso.date(),
  ogImage: ImageSchema.nullable(),
});
export type CaseStudyFrontmatter = z.infer<typeof CaseStudyFrontmatterSchema>;
