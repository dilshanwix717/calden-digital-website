// Nav + Hero for the Calden Digital homepage. Exports building blocks; does not render.
const { Button } = window.CaldenDigitalDesignSystem_fe8b3f;

const LOGO = 'assets/calden-digital-horizontal.svg';
const LINKS = [['Work', 'Work.html'], ['Services', 'Services.html'], ['About', 'About.html'], ['Contact', 'Contact.html']];
const HEADLINE = 'We design and build websites, web apps and custom software.';
const SUBHEAD = 'A software studio in Sri Lanka. We work through the whole process — understanding what your business needs, designing it, and building it properly.';
const WA = 'https://wa.me/?text=Hi%20Calden%20%E2%80%94%20I%27d%20like%20to%20talk%20about%20a%20project.';

function useMobile() {
  const [m, setM] = React.useState(() => window.innerWidth < 820);
  React.useEffect(() => {
    const on = () => setM(window.innerWidth < 820);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return m;
}

function ChatGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.4 9.5 9.5 0 0 1-4-.9L3 20l1.3-4.3A8.38 8.38 0 0 1 3.5 11 8.5 8.5 0 0 1 12 3a8.38 8.38 0 0 1 8.5 8.5Z" />
    </svg>
  );
}
function Hamburger() {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}
const Arrow = () => <span aria-hidden="true" style={{ marginLeft: 2 }}>→</span>;
const BrandImg = ({ h = 30 }) => <a href="Homepage%20hero.html" aria-label="Calden Digital home" style={{ display: 'flex', flex: 'none' }}><img src={LOGO} alt="Calden Digital" style={{ height: h, width: 'auto', display: 'block' }} /></a>;

function Nav({ m }) {
  return (
    <nav style={{ height: m ? 60 : 76, flex: 'none', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: m ? '0 20px' : '0 64px', gap: 'var(--space-6)', position: 'sticky', top: 0, zIndex: 20, background: 'var(--surface-page)' }}>
      <BrandImg h={m ? 26 : 30} />
      <span style={{ flex: 1 }} />
      {m ? <Hamburger /> : (
        <>
          <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
            {LINKS.map(([l, h]) => <a key={l} href={h} style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.005em', color: 'var(--text-body)', textDecoration: 'none' }}>{l}</a>)}
          </div>
          <Button variant="primary" size="sm" href="Contact.html">Start a project</Button>
        </>
      )}
    </nav>
  );
}

function HeroText({ m }) {
  const size = m ? 'md' : 'lg';
  const wrap = m ? { display: 'flex', flexDirection: 'column', gap: 10, width: '100%' } : { display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' };
  const fw = m ? { width: '100%', boxSizing: 'border-box' } : {};
  return (
    <>
      <h1 style={{ fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-0.022em', textWrap: 'pretty', fontSize: m ? 30 : 58, lineHeight: m ? 1.12 : 1.05, maxWidth: m ? '100%' : '17ch' }}>{HEADLINE}</h1>
      <p style={{ fontWeight: 400, color: 'var(--text-muted)', margin: m ? '16px 0 0' : '22px 0 0', lineHeight: 1.6, fontSize: m ? 16 : 20, maxWidth: m ? '100%' : '58ch' }}>{SUBHEAD}</p>
      <div style={{ marginTop: m ? 22 : 32, width: m ? '100%' : 'auto', display: 'flex', justifyContent: 'center' }}>
        <div style={wrap}>
          <Button variant="primary" size={size} href="#contact" style={fw}>Start a project<Arrow /></Button>
          <Button variant="secondary" size={size} href={WA} style={fw}><ChatGlyph size={m ? 17 : 18} />Message us on WhatsApp</Button>
        </div>
      </div>
    </>
  );
}

/* Quiet motion — three-layer mark as slow breathing line-art, teal on warm */
function HexMotion() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d');
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf, running = true;
    function hex(cx, cy, r, rot, color, alpha, lw) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = rot + (-Math.PI / 2) + i * Math.PI / 3;
        const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke();
    }
    function frame(t) {
      const dpr = window.devicePixelRatio || 1;
      const w = cv.clientWidth, h = cv.clientHeight;
      if (!w || !h) { raf = requestAnimationFrame(frame); return; }
      if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.46;
      const R = Math.min(w, h) * 0.52;
      const s = reduce ? 1 : 1 + 0.03 * Math.sin(t / 2600);
      const rot = reduce ? 0 : t / 14000;
      hex(cx, cy, R * s, rot, '#0F5C5C', 0.10, 2);
      hex(cx, cy, R * 0.72 * s, -rot * 1.1, '#0F5C5C', 0.11, 2);
      hex(cx, cy, R * 0.46 * s, rot * 0.8, '#167C78', 0.16, 2);
      ctx.globalAlpha = 1;
      if (running && !reduce) raf = requestAnimationFrame(frame);
    }
    frame(0);
    if (!reduce) raf = requestAnimationFrame(frame);
    return () => { running = false; cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true" />;
}

function Hero({ m }) {
  return (
    <section style={{ position: 'relative', display: 'flex', minHeight: m ? 'auto' : 'min(84vh, 720px)' }}>
      <HexMotion />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: m ? '56px 20px 64px' : '80px 64px' }}>
        <div style={{ maxWidth: m ? '100%' : 760 }}><HeroText m={m} /></div>
      </div>
    </section>
  );
}

Object.assign(window, { CaldenHome: { useMobile, Nav, Hero, Arrow, ChatGlyph, WA } });
