// Work index — three larger, detailed project cards. Order: Susila, Landora, Level Up.
const { useMobile, Nav } = window.CaldenHome;
const { WIDE, Arrow, PageHeader, ContactCTA, PageFooter } = window.CaldenSite;

const PROJECTS = [
  {
    id: 'susila', tags: ['Web app', 'Streaming'],
    title: 'Susila', subtitle: 'Rebuilding the streaming layer of a Sinhala film platform',
    summary: "Susila Productions had a subscription streaming platform that had already been built — and the streaming itself didn't work properly. We were brought in to fix the part that mattered most. We rebuilt video delivery around adaptive streaming, added live broadcast, and integrated recurring subscription billing.",
    role: 'Sole developer on the rebuild', timeline: 'Roughly one month, part-time',
    stack: 'React · Node.js · MongoDB · HLS · Stripe', href: 'Susila case study.html',
  },
  {
    id: 'landora', tags: ['Website', 'Multi-language'],
    title: 'Landora Tours', subtitle: 'Full content site for a Sri Lankan tour operator',
    summary: 'Landora Tours design private journeys across Sri Lanka for travellers from Europe, Australia and Asia. Almost all of their enquiries begin with a stranger abroad deciding whether this company looks trustworthy. We designed and built the entire site — seventeen itineraries, thirty-plus experiences, destination guides, an interactive island map, and a journal — with enquiry routed straight to WhatsApp.',
    role: 'Design and build from scratch', timeline: 'Two weeks',
    stack: 'Next.js · Tailwind CSS · Vercel', href: '#',
  },
  {
    id: 'levelup', tags: ['Rescue', 'Web app'],
    title: 'Level Up', subtitle: 'Inherited a salon management platform mid-flight and shipped it on deadline',
    summary: 'A salon management SaaS was days from delivery with defects the original developers hadn\u2019t been able to resolve. We came in cold, audited the entire system end to end, found three real bugs — including one that silently broke appointment editing for every user — fixed them, and delivered on the original date.',
    role: 'Audit and delivery', timeline: '3–5 days, against a fixed deadline',
    stack: 'Next.js · TypeScript · Supabase · Zod', href: '#',
  },
];

function Fact({ k, v }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-subtle)' }}>{k}</div>
      <div style={{ marginTop: 4, fontSize: 14, color: 'var(--text-body)', lineHeight: 1.45 }}>{v}</div>
    </div>
  );
}

function ProjectRow({ p, i, m }) {
  const reverse = !m && i % 2 === 1;
  const media = (
    <a href={p.href} style={{ display: 'block', flex: m ? 'none' : '1 1 0', width: m ? '100%' : undefined }}>
      <div className="cd-project__media" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', aspectRatio: '16 / 10' }}>
        <image-slot id={`work-${p.id}`} shape="rect" placeholder={`${p.title} — cover screenshot`}></image-slot>
      </div>
    </a>
  );
  const body = (
    <div style={{ flex: m ? 'none' : '1 1 0', width: m ? '100%' : undefined, display: 'flex', flexDirection: 'column', gap: 0, justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {p.tags.map((t) => <span key={t} className="cd-tag">{t}</span>)}
      </div>
      <h2 style={{ margin: '16px 0 0', fontSize: m ? 28 : 34, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{p.title}</h2>
      <p style={{ margin: '8px 0 0', fontSize: m ? 17 : 19, lineHeight: 1.4, color: 'var(--text-muted)', fontWeight: 400 }}>{p.subtitle}</p>
      <p style={{ margin: '18px 0 0', fontSize: 16, lineHeight: 1.62, color: 'var(--text-body)', maxWidth: '58ch', textWrap: 'pretty' }}>{p.summary}</p>
      <div style={{ margin: '22px 0 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 440 }}>
        <Fact k="Role" v={p.role} />
        <Fact k="Timeline" v={p.timeline} />
      </div>
      <div style={{ marginTop: 14 }}><Fact k="Stack" v={p.stack} /></div>
      <div style={{ marginTop: 24 }}>
        <a href={p.href} style={{ fontSize: 15, fontWeight: 600, color: 'var(--teal)', textDecoration: 'none' }}>{p.href === '#' ? 'Case study coming soon' : <>Read case study<Arrow /></>}</a>
      </div>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: m ? 'column' : (reverse ? 'row-reverse' : 'row'), gap: m ? 24 : 64, alignItems: 'stretch' }}>
      {media}{body}
    </div>
  );
}

function WorkIndex() {
  const m = useMobile();
  return (
    <>
      <Nav m={m} />
      <main>
        <PageHeader m={m} eyebrow="Selected work" title="Work" lead="Websites, web applications and custom software for businesses in Sri Lanka and abroad. Three we can talk about in detail." />
        <section style={{ background: 'var(--surface-page)', padding: m ? '8px 0 56px' : '16px 0 96px' }}>
          <div style={{ ...WIDE(m), display: 'flex', flexDirection: 'column', gap: m ? 56 : 104 }}>
            {PROJECTS.map((p, i) => <ProjectRow key={p.id} p={p} i={i} m={m} />)}
          </div>
        </section>
        <ContactCTA m={m} />
      </main>
      <PageFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<WorkIndex />);
