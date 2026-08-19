// Contact — WhatsApp/email prominent + full intake form.
const { Button, Input, Select, Textarea } = window.CaldenDigitalDesignSystem_fe8b3f;
const { useMobile, Nav, ChatGlyph, WA, Arrow } = window.CaldenHome;
const { WIDE, PageFooter } = window.CaldenSite;

const PROJECT_TYPES = ['Website', 'Web application', 'Custom software', 'Ongoing support', 'Not sure yet'];
const TIMELINES = ['As soon as possible', 'Within 1–3 months', '3–6 months', 'Flexible'];
const BUDGETS = ['Under $2,000', '$2,000 – $5,000', '$5,000 – $10,000', '$10,000+', 'Not sure yet'];

function Contact() {
  const m = useMobile();
  return (
    <>
      <Nav m={m} />
      <main style={{ background: 'var(--surface-page)' }}>
        <section style={{ padding: m ? '44px 0 56px' : '72px 0 96px' }}>
          <div style={{ ...WIDE(m), display: 'grid', gridTemplateColumns: m ? '1fr' : '5fr 6fr', gap: m ? 32 : 64, alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--teal)' }}>Contact</div>
              <h1 style={{ margin: m ? '16px 0 0' : '20px 0 0', fontSize: m ? 34 : 52, lineHeight: 1.06, letterSpacing: '-0.022em', fontWeight: 600, color: 'var(--ink)' }}>Tell us about your project</h1>
              <p style={{ margin: m ? '16px 0 0' : '20px 0 0', maxWidth: '48ch', fontSize: m ? 16 : 18, lineHeight: 1.62, color: 'var(--text-muted)' }}>New site, a system you need built, or you're not yet sure what you need — send us a message and we'll tell you honestly whether we can help.</p>
              <div style={{ marginTop: m ? 24 : 32, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
                <Button variant="primary" size={m ? 'md' : 'lg'} href={WA} style={m ? { width: '100%', boxSizing: 'border-box' } : {}}><ChatGlyph size={18} />Message us on WhatsApp</Button>
                <Button variant="secondary" size={m ? 'md' : 'lg'} href="mailto:hello@calden.lk" style={m ? { width: '100%', boxSizing: 'border-box' } : {}}>hello@calden.lk</Button>
              </div>
              <p style={{ marginTop: 24, fontSize: 15, lineHeight: 1.6, color: 'var(--text-subtle)', maxWidth: '44ch' }}>Based in Sri Lanka, working with clients locally and worldwide. We reply within a day.</p>
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
      </main>
      <PageFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Contact />);
