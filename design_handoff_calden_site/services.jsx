// Services — four expanded service blocks + understated "Taking over an existing project".
const { useMobile, Nav } = window.CaldenHome;
const { WIDE, READ, Arrow, Eyebrow, PageHeader, ContactCTA, PageFooter } = window.CaldenSite;

const SERVICES = [
  {
    n: '01', title: 'Websites',
    lead: 'Fast, well-built sites that work properly on a phone. Easy for your team to update, and set up so people can actually find you.',
    body: "We build the site around one job: helping a visitor decide you're worth contacting. Clear structure, quick pages, and content your team can change without calling us. Search and analytics are set up from the start, so you can see what's working and what isn't.",
    includes: ['Marketing & content sites', 'Landing pages', 'SEO groundwork', 'Analytics setup'],
  },
  {
    n: '02', title: 'Web applications',
    lead: 'Booking systems, dashboards, admin panels, internal tools. Software shaped around how your business already works, rather than forcing you to change how you work.',
    body: 'We start from the process you already run and build the screens your staff actually use and the reports you actually read. It is built to be maintained rather than to impress — so it keeps working long after launch.',
    includes: ['Booking & scheduling', 'Dashboards', 'Admin panels', 'Internal tools'],
  },
  {
    n: '03', title: 'Custom software',
    lead: "When off-the-shelf doesn't fit, we build what does — designed around your process, and built so it can grow with you.",
    body: 'Some problems have no product you can buy. We design and build the thing you actually need, keep it simple enough to run day to day, and structure it so it can change as your business does.',
    includes: ['Bespoke systems', 'Integrations', 'Data & reporting', 'APIs'],
  },
  {
    n: '04', title: 'Ongoing support',
    lead: 'Hosting, updates, changes and improvements after launch. Someone to call when something needs doing.',
    body: 'Launch is not the end of the work. We stay on to keep things running, make changes as they come up, and improve the parts that matter — so the site or system keeps earning its place.',
    includes: ['Hosting', 'Maintenance', 'Changes', 'Improvements'],
  },
];

function ServiceBlock({ s, m }) {
  return (
    <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: m ? 16 : 64, padding: m ? '36px 0' : '52px 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ flex: m ? 'none' : '0 0 300px', display: 'flex', alignItems: m ? 'center' : 'flex-start', gap: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--teal)' }}>{s.n}</span>
        <h2 style={{ margin: 0, fontSize: m ? 26 : 32, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{s.title}</h2>
      </div>
      <div style={{ flex: '1 1 0' }}>
        <p style={{ margin: 0, fontSize: m ? 17 : 19, lineHeight: 1.55, color: 'var(--ink)', fontWeight: 400, maxWidth: '60ch', textWrap: 'pretty' }}>{s.lead}</p>
        <p style={{ margin: '16px 0 0', fontSize: 16, lineHeight: 1.65, color: 'var(--text-muted)', maxWidth: '60ch', textWrap: 'pretty' }}>{s.body}</p>
        <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {s.includes.map((i) => <span key={i} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-body)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 999, padding: '5px 12px' }}>{i}</span>)}
        </div>
      </div>
    </div>
  );
}

function Takeover({ m }) {
  return (
    <section style={{ background: 'var(--surface-page)', padding: m ? '8px 0 56px' : '24px 0 96px' }}>
      <div style={{ ...READ(m) }}>
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: m ? 32 : 44 }}>
          <h2 style={{ margin: 0, fontSize: m ? 20 : 24, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink)' }}>Taking over an existing project</h2>
          <p style={{ margin: '14px 0 0', fontSize: 16, lineHeight: 1.65, color: 'var(--text-muted)', maxWidth: '64ch', textWrap: 'pretty' }}>If you have a build that stalled — a developer who stopped replying, or a project that's nearly there but not working — we can take it over. We audit what exists, tell you honestly what it needs, and finish it. Two of the projects in our work started this way.</p>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const m = useMobile();
  return (
    <>
      <Nav m={m} />
      <main>
        <PageHeader m={m} eyebrow="Services" title="What we do" lead="Web and software work leads. Everything else supports it. Here is each in more detail." />
        <section style={{ background: 'var(--surface-page)', padding: m ? '0 0 8px' : '0 0 16px' }}>
          <div style={WIDE(m)}>
            {SERVICES.map((s) => <ServiceBlock key={s.n} s={s} m={m} />)}
          </div>
        </section>
        <Takeover m={m} />
        <ContactCTA m={m} />
      </main>
      <PageFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Services />);
