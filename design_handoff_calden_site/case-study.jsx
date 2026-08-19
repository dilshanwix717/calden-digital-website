// Susila case study — long-form template. Reuses homepage Nav/Footer + device frames.
const { Button, Footer } = window.CaldenDigitalDesignSystem_fe8b3f;
const { useMobile, Nav, Arrow, ChatGlyph, WA } = window.CaldenHome;
const { ChromeWindow } = window;
const { IOSDevice } = window;

const RC = (m) => ({ maxWidth: 760, margin: '0 auto', padding: m ? '0 20px' : '0 24px' });
const WIDE = (m) => ({ maxWidth: 'var(--container-max)', margin: '0 auto', padding: m ? '0 20px' : '0 64px' });

function Mono({ children }) {
  return <code style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.9em', background: 'var(--surface-sunken)', padding: '1px 6px', borderRadius: 4 }}>{children}</code>;
}

function H2({ children, light }) {
  return <h2 style={{ fontSize: 'var(--fs-h2)', lineHeight: 'var(--lh-h2)', letterSpacing: 'var(--tr-h2)', fontWeight: 600, color: light ? 'var(--ink-on-dark)' : 'var(--ink)', margin: 0 }}>{children}</h2>;
}
const bodyP = (m) => ({ fontSize: m ? 16 : 18, lineHeight: 1.72, color: 'var(--text-body)', margin: '18px 0 0', textWrap: 'pretty' });

/* ---- Header ---- */
function Header({ m }) {
  return (
    <header style={{ padding: m ? '40px 0 32px' : '64px 0 44px', background: 'var(--surface-page)' }}>
      <div style={RC(m)}>
        <a href="#" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }}>← Work</a>
        <h1 style={{ margin: m ? '20px 0 0' : '24px 0 0', fontSize: m ? 34 : 54, lineHeight: 1.06, letterSpacing: '-0.022em', fontWeight: 600, color: 'var(--ink)' }}>Susila</h1>
        <p style={{ margin: '16px 0 0', fontSize: m ? 18 : 22, lineHeight: 1.4, color: 'var(--text-muted)', fontWeight: 400, maxWidth: '32ch' }}>Rebuilding the streaming layer of a Sinhala film platform</p>
      </div>
    </header>
  );
}

/* ---- Key facts strip ---- */
const FACTS = [
  ['Role', 'Sole developer on the rebuild. Brought in after the original team, working across the web client, the Node.js API, and the React admin panel.'],
  ['Timeline', 'Roughly one month, part-time.'],
  ['Stack', 'React, Vite, SCSS · Node.js REST API · MongoDB · HLS playback with Vimeo as origin · Stripe for recurring subscriptions · Firebase Cloud Messaging · deployed to AWS with GitHub-triggered CI/CD'],
];
function Facts({ m }) {
  return (
    <section style={{ background: 'var(--surface-sunken)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: m ? '32px 0' : '40px 0' }}>
      <div style={{ ...WIDE(m), display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr 1.6fr', gap: m ? 24 : 48 }}>
        {FACTS.map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--teal)' }}>{k}</div>
            <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.6, color: 'var(--text-body)' }}>{v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---- Body part 1 ---- */
function BodyTop({ m }) {
  return (
    <article style={{ padding: m ? '48px 0 0' : '80px 0 0', background: 'var(--surface-page)' }}>
      <div style={RC(m)}>
        <p style={{ fontSize: m ? 19 : 23, lineHeight: 1.55, color: 'var(--ink)', margin: 0, fontWeight: 400, letterSpacing: '-0.01em', textWrap: 'pretty' }}>
          Susila Productions had a subscription streaming platform that had already been built — and the streaming itself didn't work properly. We were brought in to fix the part that mattered most. We rebuilt video delivery around adaptive streaming, added live broadcast, and integrated recurring subscription billing.
        </p>

        <div style={{ marginTop: m ? 48 : 72 }}>
          <H2>The problem</H2>
          <p style={bodyP(m)}>The platform existed. Audiences could sign up. But the video layer had been built in a way that couldn't scale or serve viewers well.</p>
          <p style={bodyP(m)}>Each film had been uploaded to Vimeo as <strong>separate files per quality</strong>, and playback ran through Vimeo's own embedded player. Two consequences followed. Viewers were locked to whichever quality they landed on — no adapting when a mobile connection dropped, so the video stalled instead of stepping down. And the platform had no real control over the playback experience, because the player belonged to someone else.</p>
          <p style={bodyP(m)}>For a service whose entire product is video, on an audience largely watching over mobile data in Sri Lanka, that's not a rough edge. That's the product not working.</p>
        </div>

        <div style={{ marginTop: m ? 48 : 72 }}>
          <H2>What we built</H2>
          <p style={bodyP(m)}><strong>Adaptive streaming playback.</strong> We moved delivery onto <strong>HLS</strong> — pulling <Mono>.m3u8</Mono> manifests from Vimeo and playing them through a player built into the platform itself rather than a third-party embed. The playback engine is built on hls.js, which handles manifest parsing and adaptive bitrate switching; the player, its interface, and everything around it — controls, states, error handling, integration with the platform's entitlement checks — we built ourselves, working from the HLS specification and Vimeo's API documentation.</p>
          <p style={bodyP(m)}>The result: instead of a fixed file per quality, the stream steps up and down automatically with the viewer's connection. A weak signal softens the picture for a moment rather than stopping the film.</p>
          <p style={bodyP(m)}><strong>Live streaming.</strong> Vimeo Live integrated directly into the platform, alongside the on-demand catalogue — a capability it hadn't had before.</p>
          <p style={bodyP(m)}><strong>Subscription billing.</strong> Stripe integrated for recurring subscriptions, with entitlement checks tying an active subscription to what a viewer can watch.</p>
          <p style={bodyP(m)}>Alongside this we worked across the web client, the Node.js API, and the React admin panel used to manage the catalogue and subscribers.</p>
        </div>
      </div>
    </article>
  );
}

/* ---- The decision — distinct dark band ---- */
function Decision({ m }) {
  const p = { fontSize: m ? 16 : 18, lineHeight: 1.72, color: 'rgba(237,239,238,0.82)', margin: '18px 0 0', textWrap: 'pretty' };
  return (
    <section style={{ background: 'var(--surface-dark)', padding: m ? '56px 0' : '96px 0', margin: m ? '48px 0 0' : '80px 0 0' }}>
      <div style={RC(m)}>
        <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--teal-on-dark)' }}>A decision worth explaining</div>
        <p style={{ margin: m ? '18px 0 0' : '22px 0 0', fontSize: m ? 28 : 40, lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 600, color: 'var(--ink-on-dark)' }}>Keep Vimeo. Change how we use it.</p>
        <p style={p}>The obvious move when video delivery is broken is to take control of it — self-host, run your own transcoding, serve from your own CDN. It's also how you turn a fixable problem into an unbounded infrastructure bill. Transcoding is compute-heavy, storage grows forever, and bandwidth is the largest recurring cost in any streaming business.</p>
        <p style={p}>The actual problem wasn't Vimeo. Vimeo was already doing the expensive work — transcoding and CDN delivery — and doing it well. The problem was that the platform was consuming it in the least useful way: one static file per quality, played through someone else's embed.</p>
        <p style={p}>So we kept the origin and changed the consumption. Pulling the HLS manifests and playing them in our own player kept transcoding and bandwidth costs predictable, while moving playback control back inside the product — adaptive quality, and a player that behaves the way the platform needs it to.</p>
        <p style={p}>The trade-off is a continued dependency on a third party for the most critical part of the product. For a company running its first streaming service, that's the right trade: predictable monthly cost instead of an infrastructure project, with the budget going into the product.</p>
      </div>
    </section>
  );
}

/* ---- Body part 2 ---- */
function BodyBottom({ m }) {
  return (
    <article style={{ padding: m ? '48px 0 0' : '80px 0 0', background: 'var(--surface-page)' }}>
      <div style={RC(m)}>
        <H2>Since then</H2>
        <p style={bodyP(m)}>We've since built the same architecture for a second client — a video-on-demand service using one-time purchase rather than subscription, where a customer buys a title and can stream it indefinitely. Same delivery approach, different commercial model.</p>
        <div style={{ marginTop: m ? 48 : 72 }}>
          <H2>Outcome</H2>
          <p style={bodyP(m)}>The platform went live. It hadn't been deployed before this work — adaptive playback, live streaming and recurring subscriptions all shipped as part of taking it to launch.</p>
          <p style={bodyP(m)}>Handed over to the client on completion.</p>
        </div>
      </div>
    </article>
  );
}

/* ---- Screenshots in device frames ---- */
function Shots({ m }) {
  return (
    <section style={{ padding: m ? '56px 0' : '96px 0', background: 'var(--surface-page)' }}>
      <div style={WIDE(m)}>
        <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--teal)' }}>Screens</div>
        <div style={{ marginTop: m ? 28 : 44, display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: m ? 'center' : 'flex-start', gap: m ? 40 : 56, justifyContent: 'center' }}>
          <div style={{ width: m ? '100%' : 640, maxWidth: '100%' }}>
            <ChromeWindow width={m ? 320 : 640} height={m ? 210 : 420} url="susila.lk/watch">
              <image-slot id="cs-susila-desktop" shape="rect" placeholder="Player — desktop screenshot"></image-slot>
            </ChromeWindow>
            <p style={{ margin: '14px 2px 0', fontSize: 13, color: 'var(--text-subtle)' }}>The custom HLS player — desktop</p>
          </div>
          {(() => {
            const ph = m ? 0.6 : 0.66;
            return (
              <div style={{ width: 402 * ph, flex: 'none' }}>
                <div style={{ position: 'relative', width: 402 * ph, height: 780 * ph }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 402, height: 780, transform: `scale(${ph})`, transformOrigin: 'top left' }}>
                    <IOSDevice width={402} height={780}>
                      <image-slot id="cs-susila-mobile" shape="rect" placeholder="Browse / home — mobile screenshot"></image-slot>
                    </IOSDevice>
                  </div>
                </div>
                <p style={{ margin: '14px 2px 0', fontSize: 13, color: 'var(--text-subtle)' }}>Browse — mobile</p>
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}

/* ---- Reserved client quote ---- */
function Quote({ m }) {
  return (
    <section style={{ padding: m ? '56px 0' : '96px 0', background: 'var(--surface-sunken)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ ...RC(m), textAlign: 'center' }}>
        <div aria-hidden="true" style={{ fontSize: m ? 56 : 80, lineHeight: 0.6, color: 'var(--teal)', fontWeight: 700 }}>“</div>
        <p style={{ margin: m ? '20px 0 0' : '28px 0 0', fontSize: m ? 20 : 27, lineHeight: 1.45, letterSpacing: '-0.015em', color: 'var(--grey-400)', fontWeight: 400 }}>Space reserved for a client quote from Susila Productions.</p>
        <p style={{ margin: '20px 0 0', fontSize: 14, color: 'var(--text-subtle)', letterSpacing: '0.02em' }}>— Susila Productions</p>
      </div>
    </section>
  );
}

/* ---- Prev / next ---- */
const NAV_ITEMS = [
  { dir: 'Previous', title: 'Level Up', desc: 'Inherited a salon management platform mid-flight and shipped it on deadline' },
  { dir: 'Next', title: 'Landora Tours', desc: 'Full content site for a Sri Lankan tour operator' },
];
function PrevNext({ m }) {
  return (
    <section style={{ padding: m ? '40px 0' : '56px 0', background: 'var(--surface-page)' }}>
      <div style={{ ...WIDE(m), display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? 12 : 24 }}>
        {NAV_ITEMS.map((it) => (
          <a key={it.dir} href="#" className="cd-card" style={{ display: 'block', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: m ? 20 : 28, textDecoration: 'none', textAlign: it.dir === 'Next' && !m ? 'right' : 'left' }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--teal)' }}>{it.dir === 'Next' ? <>{it.dir} →</> : <>← {it.dir}</>}</span>
            <h3 style={{ margin: '10px 0 0', fontSize: m ? 20 : 24, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink)' }}>{it.title}</h3>
            <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.5, color: 'var(--text-muted)' }}>{it.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---- Contact CTA ---- */
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

function CaseStudy() {
  const m = useMobile();
  return (
    <>
      <Nav m={m} />
      <main>
        <Header m={m} />
        <Facts m={m} />
        <BodyTop m={m} />
        <Decision m={m} />
        <BodyBottom m={m} />
        <Shots m={m} />
        <Quote m={m} />
        <PrevNext m={m} />
        <ContactCTA m={m} />
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

ReactDOM.createRoot(document.getElementById('root')).render(<CaseStudy />);
