// Shared building blocks for Calden secondary pages. Exports to window.CaldenSite.
const { Button, Footer } = window.CaldenDigitalDesignSystem_fe8b3f;
const { ChatGlyph, WA } = window.CaldenHome;

const WIDE = (m) => ({ maxWidth: 'var(--container-max)', margin: '0 auto', padding: m ? '0 20px' : '0 64px' });
const READ = (m) => ({ maxWidth: 820, margin: '0 auto', padding: m ? '0 20px' : '0 24px' });
const Arrow = () => <span aria-hidden="true" style={{ marginLeft: 2 }}>→</span>;

function Eyebrow({ children, light }) {
  return <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: light ? 'var(--teal-on-dark)' : 'var(--teal)' }}>{children}</div>;
}
function SectionTitle({ children, style }) {
  return <h2 style={{ fontSize: 'var(--fs-h2)', lineHeight: 'var(--lh-h2)', letterSpacing: 'var(--tr-h2)', fontWeight: 600, color: 'var(--ink)', margin: 0, ...style }}>{children}</h2>;
}

function PageHeader({ m, eyebrow, title, lead }) {
  return (
    <header style={{ background: 'var(--surface-page)', padding: m ? '44px 0 40px' : '72px 0 56px' }}>
      <div style={WIDE(m)}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 style={{ margin: eyebrow ? (m ? '16px 0 0' : '20px 0 0') : 0, fontSize: m ? 36 : 58, lineHeight: 1.05, letterSpacing: '-0.022em', fontWeight: 600, color: 'var(--ink)' }}>{title}</h1>
        {lead && <p style={{ margin: m ? '18px 0 0' : '22px 0 0', maxWidth: '56ch', fontSize: m ? 17 : 21, lineHeight: 1.5, color: 'var(--text-muted)' }}>{lead}</p>}
      </div>
    </header>
  );
}

function ContactCTA({ m }) {
  return (
    <section id="contact" style={{ padding: m ? '56px 0' : '96px 0', background: 'var(--surface-sunken)', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ ...WIDE(m), textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--fs-h2)', lineHeight: 'var(--lh-h2)', letterSpacing: 'var(--tr-h2)', fontWeight: 600, color: 'var(--ink)' }}>Tell us about your project</h2>
        <p style={{ margin: m ? '16px auto 0' : '20px auto 0', maxWidth: '52ch', fontSize: m ? 16 : 18, lineHeight: 1.62, color: 'var(--text-muted)' }}>New site, a system you need built, or you're not yet sure what you need — send us a message and we'll tell you honestly whether we can help.</p>
        <div style={{ marginTop: m ? 24 : 32, display: 'flex', gap: 12, justifyContent: 'center', flexDirection: m ? 'column' : 'row', alignItems: 'center' }}>
          <Button variant="primary" size={m ? 'md' : 'lg'} href={WA} style={m ? { width: '100%', maxWidth: 340, boxSizing: 'border-box' } : {}}><ChatGlyph size={18} />Message us on WhatsApp</Button>
          <Button variant="secondary" size={m ? 'md' : 'lg'} href="mailto:hello@calden.lk" style={m ? { width: '100%', maxWidth: 340, boxSizing: 'border-box' } : {}}>hello@calden.lk</Button>
        </div>
      </div>
    </section>
  );
}

const FOOTER_COLS = [
  { title: 'Pages', links: ['Work', 'Services', 'About', 'Contact'] },
  { title: 'Contact', links: ['hello@calden.lk', 'WhatsApp'] },
];
function PageFooter() {
  return <Footer tagline="Building the digital foundation for modern businesses" columns={FOOTER_COLS} copyright="© 2026 Calden" location="Based in Sri Lanka. Working with clients locally and worldwide." />;
}

Object.assign(window, { CaldenSite: { WIDE, READ, Arrow, Eyebrow, SectionTitle, PageHeader, ContactCTA, PageFooter } });
