// About — honest and personal. Calden is one person: Dilshan Wickramasinghe.
const { useMobile, Nav } = window.CaldenHome;
const { WIDE, READ, PageHeader, ContactCTA, PageFooter } = window.CaldenSite;

const PRINCIPLES = [
  { t: 'Plan before build', d: "Every project starts with understanding your business and agreeing a scope in writing. You know what you're getting before anything is made." },
  { t: 'Honest about scope', d: "If something isn't worth building, or isn't something I can do well, I'll say so. A clear no is worth more than a vague yes." },
  { t: 'Built to last', d: 'Custom code, kept simple, and structured so it can change as your business changes.' },
];

function About() {
  const m = useMobile();
  const p = (m2) => ({ fontSize: m2 ? 16 : 18, lineHeight: 1.72, color: 'var(--text-body)', margin: '18px 0 0', textWrap: 'pretty' });
  return (
    <>
      <Nav m={m} />
      <main>
        <PageHeader m={m} eyebrow="About" title="Calden is one person." lead="I design and build websites and software for businesses — from the first conversation through to launch and beyond." />

        <section style={{ background: 'var(--surface-page)', padding: m ? '8px 0 48px' : '16px 0 80px' }}>
          <div style={{ ...WIDE(m), display: 'grid', gridTemplateColumns: m ? '1fr' : '5fr 6fr', gap: m ? 28 : 64, alignItems: 'center' }}>
            <div style={{ width: '100%', aspectRatio: '4 / 5', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflow: 'hidden', background: 'var(--surface-sunken)' }}>
              <image-slot id="about-portrait" shape="rect" placeholder="Photograph of Dilshan"></image-slot>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: m ? 26 : 34, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>Dilshan Wickramasinghe</h2>
              <p style={{ margin: '6px 0 0', fontSize: 15, letterSpacing: '0.02em', color: 'var(--teal)', fontWeight: 500 }}>Developer &amp; founder, Calden Digital</p>
              <p style={p(m)}>Calden Digital is one person. I started it to do software properly for businesses that had been let down by templates, by agencies that hand you to someone junior, or by developers who stopped replying halfway through.</p>
              <p style={p(m)}>I work across the whole thing — understanding the problem, designing the solution, writing the code, and staying on after launch. Because it's one person, nothing gets lost in a handover, and you always know who you're talking to.</p>
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--surface-dark)', padding: m ? '56px 0' : '88px 0' }}>
          <div style={{ ...READ(m), textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: m ? 28 : 44, lineHeight: 1.12, letterSpacing: '-0.02em', fontWeight: 600, color: 'var(--ink-on-dark)', textWrap: 'balance' }}>You talk to the person who builds it.</p>
            <p style={{ margin: m ? '18px auto 0' : '22px auto 0', maxWidth: '48ch', fontSize: m ? 16 : 18, lineHeight: 1.6, color: 'rgba(237,239,238,0.72)' }}>No account managers. No handover. The person who plans your project is the person who builds it.</p>
          </div>
        </section>

        <section style={{ background: 'var(--surface-page)', padding: m ? '56px 0' : '96px 0' }}>
          <div style={WIDE(m)}>
            <h2 style={{ margin: 0, fontSize: 'var(--fs-h2)', lineHeight: 'var(--lh-h2)', letterSpacing: 'var(--tr-h2)', fontWeight: 600, color: 'var(--ink)' }}>How I work</h2>
            <div style={{ marginTop: m ? 28 : 44, display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, 1fr)', gap: m ? 28 : 40 }}>
              {PRINCIPLES.map((x) => (
                <div key={x.t} style={{ borderTop: '2px solid var(--teal)', paddingTop: 20 }}>
                  <h3 style={{ margin: 0, fontSize: m ? 19 : 21, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>{x.t}</h3>
                  <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: 1.62, color: 'var(--text-muted)' }}>{x.d}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: m ? 44 : 64, borderTop: '1px solid var(--border-subtle)', paddingTop: m ? 32 : 44 }}>
              <h2 style={{ margin: 0, fontSize: m ? 20 : 24, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink)' }}>Where we are based</h2>
              <p style={{ margin: '14px 0 0', fontSize: m ? 17 : 19, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: '52ch' }}>Based in Colombo, Sri Lanka. Working with clients here and abroad.</p>
            </div>
          </div>
        </section>

        <ContactCTA m={m} />
      </main>
      <PageFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<About />);
