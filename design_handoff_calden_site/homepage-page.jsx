// Calden Digital homepage — sections 2–8 + page assembly. Renders into #root.
const { Button, ServiceCard, Input, Select, Textarea, Footer } = window.CaldenDigitalDesignSystem_fe8b3f;
const { useMobile, Nav, Hero, Arrow, ChatGlyph, WA } = window.CaldenHome;

const container = { maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--section-x)' };
const sectionPad = (m) => ({ padding: m ? '56px 0' : '96px 0' });

function SectionTitle({ children, style }) {
  return <h2 style={{ fontSize: 'var(--fs-h2)', lineHeight: 'var(--lh-h2)', letterSpacing: 'var(--tr-h2)', fontWeight: 600, color: 'var(--ink)', margin: 0, ...style }}>{children}</h2>;
}

/* 2. What we do */
const SERVICES = [
  { index: '01', title: 'Websites', description: 'Fast, well-built sites that work properly on a phone. Easy for your team to update, and set up so people can actually find you.' },
  { index: '02', title: 'Web applications', description: 'Booking systems, dashboards, admin panels, internal tools. Software shaped around how your business already works, rather than forcing you to change how you work.' },
  { index: '03', title: 'Custom software', description: "When off-the-shelf doesn't fit, we build what does — designed around your process, and built so it can grow with you." },
  { index: '04', title: 'Ongoing support', description: 'Hosting, updates, changes and improvements after launch. Someone to call when something needs doing.' },
];
function WhatWeDo({ m }) {
  return (
    <section style={{ ...sectionPad(m), background: 'var(--surface-page)' }}>
      <div style={container}>
        <SectionTitle>What we do</SectionTitle>
        <div style={{ marginTop: m ? 28 : 44, display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(4, 1fr)', gap: m ? 12 : 20 }}>
          {SERVICES.map((s) => <ServiceCard key={s.index} index={s.index} title={s.title} description={s.description} />)}
        </div>
      </div>
    </section>
  );
}

/* 3. How we work — weighted dark band with a horizontal stepper */
const PROCESS = [
  { n: '1', title: 'Understand the business', desc: "We start with a conversation about what your business actually does and where it's losing time or customers. Not a feature list — the problem underneath it." },
  { n: '2', title: 'Plan and scope', desc: "We map out what needs building and why, then put it in writing: what you're getting, how long it takes, what it costs. Nothing starts until that's agreed." },
  { n: '3', title: 'Design', desc: 'We design the structure and the interface before writing code. You see it, comment on it, and change it while changing it is still cheap.' },
  { n: '4', title: 'Build', desc: "Regular progress you can look at and respond to. No disappearing for six weeks and hoping it's what you wanted." },
  { n: '5', title: 'Launch and after', desc: "Deployment, handover, training your team if needed — and support once it's live." },
];
function StepNum({ children }) {
  return <div style={{ width: 48, height: 48, flex: 'none', display: 'grid', placeItems: 'center', borderRadius: 999, border: '2px solid var(--teal-on-dark)', color: 'var(--ink-on-dark)', fontWeight: 600, fontSize: 18, background: 'var(--surface-dark)', position: 'relative', zIndex: 1 }}>{children}</div>;
}
function HowWeWork({ m }) {
  return (
    <section style={{ ...sectionPad(m), background: 'var(--surface-dark)' }}>
      <div style={container}>
        <SectionTitle style={{ color: 'var(--ink-on-dark)' }}>How we work</SectionTitle>
        <p style={{ margin: m ? '14px 0 0' : '16px 0 0', maxWidth: '52ch', fontSize: m ? 16 : 18, lineHeight: 1.6, color: 'rgba(237,239,238,0.72)' }}>We plan before we build. Every project moves through the same five steps.</p>
        {m ? (
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 28, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 23, top: 24, bottom: 24, width: 2, background: 'var(--border-on-dark)' }} />
            {PROCESS.map((p) => (
              <div key={p.n} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 18, alignItems: 'start', position: 'relative' }}>
                <StepNum>{p.n}</StepNum>
                <div style={{ paddingTop: 4 }}>
                  <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink-on-dark)' }}>{p.title}</h3>
                  <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.6, color: 'rgba(237,239,238,0.66)' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 56, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '10%', right: '10%', top: 24, height: 2, background: 'var(--border-on-dark)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, position: 'relative' }}>
              {PROCESS.map((p) => (
                <div key={p.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <StepNum>{p.n}</StepNum>
                  <h3 style={{ margin: '22px 0 0', fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink-on-dark)' }}>{p.title}</h3>
                  <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.6, color: 'rgba(237,239,238,0.66)' }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* 4. Selected work — image-led cards */
const WORK = [
  { id: 'landora', title: 'Landora Tours — travel site', summary: 'Seventeen itineraries, thirty-plus experiences, an interactive island map, and multi-language support. Designed and built in two weeks.', meta: 'Design and build · two weeks' },
  { id: 'susila', title: 'Susila — streaming platform', summary: "A film streaming platform whose video delivery wasn't working. We rebuilt it around adaptive playback, added live streaming, and took it to launch.", meta: 'One developer · one month' },
  { id: 'salon', title: 'Salon management platform', summary: 'A booking and management system days from its deadline with unresolved defects. We audited the system end to end, found what was breaking it, and delivered on schedule.', meta: 'Audit and delivery · shipped on time' },
];
function WorkCard({ item }) {
  return (
    <a className="cd-card cd-project" href="#" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="cd-project__media">
        <image-slot id={`work-${item.id}`} shape="rect" placeholder={`${item.title.split(' — ')[0]} screenshot`}></image-slot>
      </div>
      <div className="cd-project__body">
        <h3 className="cd-project__title">{item.title}</h3>
        <p className="cd-project__summary">{item.summary}</p>
        <span style={{ marginTop: 4, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500, color: 'var(--text-subtle)' }}>{item.meta}</span>
      </div>
    </a>
  );
}
function SelectedWork({ m }) {
  return (
    <section style={{ ...sectionPad(m), background: 'var(--surface-page)' }}>
      <div style={container}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <SectionTitle>Selected work</SectionTitle>
          {!m && <a href="#" style={{ fontSize: 15, fontWeight: 600, color: 'var(--teal)', textDecoration: 'none' }}>See all work<Arrow /></a>}
        </div>
        <div style={{ marginTop: m ? 28 : 44, display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, 1fr)', gap: m ? 16 : 24 }}>
          {WORK.map((w) => <WorkCard key={w.id} item={w} />)}
        </div>
        {m && <a href="#" style={{ display: 'inline-block', marginTop: 24, fontSize: 15, fontWeight: 600, color: 'var(--teal)', textDecoration: 'none' }}>See all work<Arrow /></a>}
      </div>
    </section>
  );
}

/* 5. Streaming band — quieter, sunken */
function Streaming({ m }) {
  return (
    <section style={{ padding: m ? '48px 0' : '80px 0', background: 'var(--surface-sunken)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ ...container, maxWidth: 820, textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: m ? 26 : 32, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink)' }}>We've built streaming platforms</h2>
        <p style={{ margin: m ? '16px auto 0' : '20px auto 0', maxWidth: '62ch', fontSize: m ? 16 : 18, lineHeight: 1.62, color: 'var(--text-muted)' }}>Video is one of the harder things to get right — it has to adapt to the viewer's connection, and it has to do it without an infrastructure bill that sinks the business. We've delivered video-on-demand and live streaming for two media companies, on two different commercial models.</p>
        <a href="#" style={{ display: 'inline-block', marginTop: m ? 20 : 24, fontSize: 15, fontWeight: 600, color: 'var(--teal)', textDecoration: 'none' }}>See how we did it<Arrow /></a>
      </div>
    </section>
  );
}

/* 6. Why Calden */
const WHY = [
  { title: 'You talk to the person building it', desc: 'No account managers, no handover to someone junior. The person who plans your project is the person who builds it.' },
  { title: 'We plan before we build', desc: "Every project starts with understanding the business and agreeing a scope in writing. You know what you're getting before anything is made." },
  { title: 'Built properly, so it can grow', desc: 'Custom code rather than a template with the logo swapped. Your site does what your business needs — and it can be changed as your business changes.' },
];
function WhyCalden({ m }) {
  return (
    <section style={{ ...sectionPad(m), background: 'var(--surface-page)' }}>
      <div style={container}>
        <SectionTitle>Why Calden</SectionTitle>
        <div style={{ marginTop: m ? 28 : 44, display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, 1fr)', gap: m ? 28 : 40 }}>
          {WHY.map((w) => (
            <div key={w.title} style={{ borderTop: '2px solid var(--teal)', paddingTop: 20 }}>
              <h3 style={{ margin: 0, fontSize: m ? 19 : 21, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>{w.title}</h3>
              <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: 1.62, color: 'var(--text-muted)' }}>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 7. Contact */
const PROJECT_TYPES = ['Website', 'Web application', 'Custom software', 'Ongoing support', 'Not sure yet'];
const TIMELINES = ['As soon as possible', 'Within 1–3 months', '3–6 months', 'Flexible'];
const BUDGETS = ['Under $2,000', '$2,000 – $5,000', '$5,000 – $10,000', '$10,000+', 'Not sure yet'];
function Contact({ m }) {
  return (
    <section id="contact" style={{ ...sectionPad(m), background: 'var(--surface-sunken)' }}>
      <div style={{ ...container, display: 'grid', gridTemplateColumns: m ? '1fr' : '5fr 6fr', gap: m ? 32 : 64, alignItems: 'start' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 'var(--fs-h2)', lineHeight: 'var(--lh-h2)', letterSpacing: 'var(--tr-h2)', fontWeight: 600, color: 'var(--ink)' }}>Tell us about your project</h2>
          <p style={{ margin: m ? '16px 0 0' : '20px 0 0', maxWidth: '48ch', fontSize: m ? 16 : 18, lineHeight: 1.62, color: 'var(--text-muted)' }}>New site, a system you need built, or you're not yet sure what you need — send us a message and we'll tell you honestly whether we can help.</p>
          <div style={{ marginTop: m ? 24 : 32, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <Button variant="primary" size={m ? 'md' : 'lg'} href={WA} style={m ? { width: '100%', boxSizing: 'border-box' } : {}}><ChatGlyph size={18} />Message us on WhatsApp</Button>
            <Button variant="secondary" size={m ? 'md' : 'lg'} href="mailto:hello@calden.lk" style={m ? { width: '100%', boxSizing: 'border-box' } : {}}>hello@calden.lk</Button>
          </div>
        </div>
        <form className="cd-card" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: m ? 20 : 32, display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: 18 }}>
            <Input label="Name" name="name" placeholder="Your name" />
            <Input label="Email" name="email" type="email" placeholder="you@company.com" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: 18 }}>
            <Select label="Project type" options={PROJECT_TYPES} placeholder="Select one" />
            <Select label="Timeline" options={TIMELINES} placeholder="Select one" />
          </div>
          <Select label="Budget range" options={BUDGETS} placeholder="Select a range" />
          <Textarea label="Message" name="message" placeholder="A few lines about what you need." />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
            <Button variant="primary" size="md" type="submit">Send message<Arrow /></Button>
            <span style={{ fontSize: 14, color: 'var(--text-subtle)' }}>We reply within a day.</span>
          </div>
        </form>
      </div>
    </section>
  );
}

/* 8. Footer */
const FOOTER_COLS = [
  { title: 'Pages', links: ['Work', 'Services', 'About', 'Contact'] },
  { title: 'Contact', links: ['hello@calden.lk', 'WhatsApp'] },
];

function HomePage() {
  const m = useMobile();
  return (
    <>
      <Nav m={m} />
      <main>
        <Hero m={m} />
        <WhatWeDo m={m} />
        <HowWeWork m={m} />
        <SelectedWork m={m} />
        <Streaming m={m} />
        <WhyCalden m={m} />
        <Contact m={m} />
      </main>
      <Footer
        tagline="Building the digital foundation for modern businesses"
        columns={FOOTER_COLS}
        copyright="© 2026 Calden"
        location="Based in Sri Lanka. Working with clients locally and worldwide."
      />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<HomePage />);
