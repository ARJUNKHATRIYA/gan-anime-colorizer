import { useState, useEffect, useRef } from "react";

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
`;

const globalStyles = `
  ${fonts}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0a0a0f;
    --paper: #f5f0e8;
    --pink: #ff2d78;
    --cyan: #00e5ff;
    --gold: #ffd60a;
    --muted: #8a8a9a;
    --card-bg: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.1);
  }
  html { scroll-behavior: smooth; }
  body { 
    font-family: 'Syne', sans-serif; 
    background: var(--ink); 
    color: var(--paper);
    overflow-x: hidden;
  }
  ::selection { background: var(--pink); color: white; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--ink); }
  ::-webkit-scrollbar-thumb { background: var(--pink); border-radius: 2px; }

  @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(3deg)} }
  @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.5);opacity:0} }
  @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes glitch1 { 0%,100%{clip-path:inset(0 0 95% 0)} 20%{clip-path:inset(30% 0 50% 0)} 40%{clip-path:inset(60% 0 20% 0)} 60%{clip-path:inset(10% 0 80% 0)} 80%{clip-path:inset(80% 0 5% 0)} }
  @keyframes glitch2 { 0%,100%{clip-path:inset(50% 0 30% 0);transform:translate(3px,0)} 20%{clip-path:inset(10% 0 70% 0);transform:translate(-3px,0)} 40%{clip-path:inset(80% 0 5% 0);transform:translate(3px,0)} 60%{clip-path:inset(5% 0 90% 0);transform:translate(-3px,0)} 80%{clip-path:inset(40% 0 45% 0);transform:translate(3px,0)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes colorShift { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
  @keyframes ripple { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(3);opacity:0} }

  .page { animation: fadeUp 0.6s ease both; }
  
  .nav-link {
    position: relative;
    color: var(--muted);
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 6px 0;
    transition: color 0.3s;
    cursor: pointer;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 0; height: 2px;
    background: var(--pink);
    transition: width 0.3s ease;
  }
  .nav-link:hover, .nav-link.active { color: var(--paper); }
  .nav-link:hover::after, .nav-link.active::after { width: 100%; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 32px;
    background: var(--pink);
    color: white;
    border: none; outline: none;
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s;
  }
  .btn-primary:hover { background: #ff0055; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,45,120,0.5); }
  .btn-primary:hover::before { transform: translateX(100%); }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 13px 31px;
    background: transparent;
    color: var(--paper);
    border: 1px solid rgba(255,255,255,0.2);
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    transition: all 0.3s;
  }
  .btn-ghost:hover { border-color: var(--cyan); color: var(--cyan); box-shadow: 0 0 20px rgba(0,229,255,0.2); }

  .card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    backdrop-filter: blur(10px);
    transition: all 0.4s ease;
  }
  .card:hover { border-color: rgba(255,45,120,0.3); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }

  .tag {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(255,45,120,0.15);
    border: 1px solid rgba(255,45,120,0.3);
    color: var(--pink);
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .mono { font-family: 'Space Mono', monospace; }

  .grid-line {
    position: absolute;
    background: rgba(255,255,255,0.03);
    pointer-events: none;
  }
`;

// ===== NOISE TEXTURE SVG =====
const NoiseBg = () => (
  <svg style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',opacity:0.03,pointerEvents:'none',zIndex:0}} xmlns="http://www.w3.org/2000/svg">
    <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    <rect width="100%" height="100%" filter="url(#noise)"/>
  </svg>
);

// ===== GRID OVERLAY =====
const GridOverlay = () => (
  <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
    {[...Array(8)].map((_,i) => (
      <div key={i} style={{position:'absolute',left:`${(i+1)*12.5}%`,top:0,bottom:0,width:'1px',background:'rgba(255,255,255,0.015)'}}/>
    ))}
    {[...Array(6)].map((_,i) => (
      <div key={i} style={{position:'absolute',top:`${(i+1)*16.67}%`,left:0,right:0,height:'1px',background:'rgba(255,255,255,0.015)'}}/>
    ))}
  </div>
);

// ===== NAV =====
const Nav = ({ page, setPage }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,zIndex:100,
      padding: scrolled ? '16px 48px' : '24px 48px',
      background: scrolled ? 'rgba(10,10,15,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      display:'flex',alignItems:'center',justifyContent:'space-between',
      transition:'all 0.4s ease',
    }}>
      {/* Logo */}
      <div onClick={() => setPage('home')} style={{cursor:'pointer',display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:36,height:36,position:'relative'}}>
          <div style={{position:'absolute',inset:0,borderRadius:'50%',background:'conic-gradient(from 0deg, #ff2d78, #00e5ff, #ff2d78)',animation:'spinSlow 4s linear infinite'}}/>
          <div style={{position:'absolute',inset:3,borderRadius:'50%',background:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{fontSize:14}}>🎨</span>
          </div>
        </div>
        <div>
          <span style={{fontWeight:800,fontSize:18,letterSpacing:'-0.02em'}}>Color</span>
          <span style={{fontWeight:800,fontSize:18,color:'var(--pink)',letterSpacing:'-0.02em'}}>GAN</span>
          <span style={{fontWeight:800,fontSize:18,letterSpacing:'-0.02em'}}>ime</span>
        </div>
      </div>

      {/* Links */}
      <div style={{display:'flex',alignItems:'center',gap:40}}>
        {['home','colorize','about'].map(p => (
          <span key={p} className={`nav-link ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>
            {p}
          </span>
        ))}
      </div>

      <button className="btn-primary" onClick={() => setPage('colorize')} style={{padding:'10px 24px',fontSize:12}}>
        <span>Try Now</span>
        <span>→</span>
      </button>
    </nav>
  );
};

// ===== HOME PAGE =====
const HomePage = ({ setPage }) => {
  const [mousePos, setMousePos] = useState({x:0.5, y:0.5});
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const fn = (e) => setMousePos({x: e.clientX/window.innerWidth, y: e.clientY/window.innerHeight});
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i += 137;
      setCounter(prev => prev < 10000 ? prev + 137 : 10000);
      if (i >= 10000) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, []);

  const orbs = [
    {x:15,y:20,size:500,color:'rgba(255,45,120,0.12)'},
    {x:75,y:60,size:600,color:'rgba(0,229,255,0.08)'},
    {x:50,y:80,size:400,color:'rgba(255,214,10,0.06)'},
  ];

  const features = [
    { icon: '⚡', label: 'Lightning Fast', desc: 'Colorize manga panels in seconds using our optimized GAN inference pipeline', accent: '#ffd60a' },
    { icon: '🎨', label: 'Smart Colors', desc: 'Context-aware AI understands character emotions and scene settings', accent: '#ff2d78' },
    { icon: '✦', label: 'High Fidelity', desc: 'Preserve every ink line, crosshatch, and artistic detail while adding vivid color', accent: '#00e5ff' },
    { icon: '◈', label: 'Community', desc: 'Join 10,000+ manga artists and enthusiasts pushing creative boundaries', accent: '#a855f7' },
  ];

  const steps = [
    { n: '01', title: 'Upload Panel', desc: 'Drop any black & white manga panel — JPG, PNG, WebP up to 10MB' },
    { n: '02', title: 'AI Processes', desc: 'Our Pix2Pix W-GAN analyzes composition, context, and artistic style' },
    { n: '03', title: 'Download Art', desc: 'Get your vibrant colorized panel in seconds, ready to share' },
  ];

  return (
    <div className="page" style={{position:'relative',minHeight:'100vh'}}>
      <style>{`
        .hero-title span { display: inline-block; }
        .glitch-wrap { position: relative; display: inline-block; }
        .glitch-wrap::before, .glitch-wrap::after {
          content: attr(data-text);
          position: absolute; top: 0; left: 0;
          color: var(--pink);
          font: inherit;
        }
        .glitch-wrap::before { animation: glitch1 3s infinite; color: var(--cyan); opacity: 0.7; }
        .glitch-wrap::after { animation: glitch2 3s infinite; color: var(--pink); opacity: 0.7; }
        .feature-card { transition: all 0.4s cubic-bezier(0.23,1,0.32,1); }
        .feature-card:hover { transform: translateY(-8px) scale(1.01); }
        .step-num {
          font-family: 'Space Mono', monospace;
          font-size: 72px;
          font-weight: 700;
          line-height: 1;
          background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .marquee-track { display: flex; width: max-content; animation: marquee 20s linear infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, var(--paper) 0%, var(--pink) 30%, var(--cyan) 60%, var(--paper) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      {/* Ambient orbs */}
      {orbs.map((o, i) => (
        <div key={i} style={{
          position:'fixed',
          left: `${o.x + (mousePos.x - 0.5) * 3}%`,
          top: `${o.y + (mousePos.y - 0.5) * 3}%`,
          width: o.size, height: o.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
          transform: 'translate(-50%,-50%)',
          transition: 'left 1s ease, top 1s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}/>
      ))}

      {/* HERO */}
      <section style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',padding:'120px 48px 80px',zIndex:1}}>
        <div style={{maxWidth:900,textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 18px',background:'rgba(255,45,120,0.1)',border:'1px solid rgba(255,45,120,0.25)',marginBottom:48}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'var(--pink)',animation:'blink 1.5s infinite'}}/>
            <span style={{fontFamily:'Space Mono',fontSize:11,color:'var(--pink)',letterSpacing:'0.15em',textTransform:'uppercase'}}>AI-Powered Manga Colorization</span>
          </div>

          <h1 className="hero-title" style={{fontSize:'clamp(52px,8vw,100px)',fontWeight:800,lineHeight:1.0,letterSpacing:'-0.04em',marginBottom:32}}>
            <span>Transform Your </span>
            <span className="shimmer-text">Manga</span>
            <br/>
            <span>Into </span>
            <span className="glitch-wrap" data-text="Living Art">Living Art</span>
          </h1>

          <p style={{fontSize:18,color:'var(--muted)',maxWidth:580,margin:'0 auto 56px',lineHeight:1.7,fontWeight:400}}>
            Breathe chromatic life into black and white panels with our revolutionary W-GAN architecture. Instant, intelligent, and artistically faithful.
          </p>

          <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap',marginBottom:80}}>
            <button className="btn-primary" onClick={() => setPage('colorize')} style={{fontSize:15,padding:'16px 40px'}}>
              Start Colorizing <span style={{fontSize:18}}>→</span>
            </button>
            <button className="btn-ghost" onClick={() => setPage('about')} style={{fontSize:15,padding:'15px 40px'}}>
              How It Works
            </button>
          </div>

          {/* Stats */}
          <div style={{display:'flex',justifyContent:'center',gap:64,flexWrap:'wrap'}}>
            {[
              { val: `${counter.toLocaleString()}+`, label: 'Panels Colorized' },
              { val: '< 3s', label: 'Processing Time' },
              { val: '97%', label: 'Satisfaction Rate' },
            ].map((s,i) => (
              <div key={i} style={{textAlign:'center'}}>
                <div style={{fontFamily:'Space Mono',fontSize:28,fontWeight:700,color:'var(--paper)',letterSpacing:'-0.02em'}}>{s.val}</div>
                <div style={{fontSize:12,color:'var(--muted)',letterSpacing:'0.1em',textTransform:'uppercase',marginTop:4}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{overflow:'hidden',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',padding:'14px 0',background:'rgba(255,45,120,0.05)'}}>
        <div className="marquee-track">
          {[...Array(3)].map((_, ri) => (
            <div key={ri} style={{display:'flex',gap:48,paddingRight:48}}>
              {['Manga Colorization','GAN Technology','Pix2Pix','Neural Networks','AI Art','Style Transfer','Computer Vision','Deep Learning'].map((t,i) => (
                <span key={i} style={{fontFamily:'Space Mono',fontSize:12,letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--muted)',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:16}}>
                  <span style={{color:'var(--pink)'}}>✦</span> {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section style={{padding:'120px 48px',position:'relative',zIndex:1}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{marginBottom:72,display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:24}}>
            <div>
              <div className="tag" style={{marginBottom:16}}>Why ColorGANime</div>
              <h2 style={{fontSize:'clamp(36px,5vw,60px)',fontWeight:800,lineHeight:1.1,letterSpacing:'-0.03em'}}>
                Built for artists,<br/>powered by science
              </h2>
            </div>
            <p style={{maxWidth:380,color:'var(--muted)',fontSize:16,lineHeight:1.7}}>
              Every pixel matters. Our model was trained on thousands of manga panels to understand the unique language of manga art.
            </p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:2}}>
            {features.map((f,i) => (
              <div key={i} className="feature-card" style={{
                padding:48,
                background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.02)',
                border:'1px solid rgba(255,255,255,0.07)',
                position:'relative',overflow:'hidden',
              }}>
                <div style={{position:'absolute',top:-20,right:-20,width:80,height:80,borderRadius:'50%',background:`radial-gradient(circle, ${f.accent}22, transparent 70%)`}}/>
                <div style={{fontSize:28,marginBottom:24,display:'inline-block',padding:12,background:`${f.accent}15`,border:`1px solid ${f.accent}30`}}>
                  {f.icon}
                </div>
                <h3 style={{fontSize:20,fontWeight:700,marginBottom:12,letterSpacing:'-0.01em'}}>{f.label}</h3>
                <p style={{color:'var(--muted)',fontSize:15,lineHeight:1.6}}>{f.desc}</p>
                <div style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg, ${f.accent}, transparent)`}}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:'120px 48px',background:'rgba(255,255,255,0.015)',position:'relative',zIndex:1,borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:80}}>
            <div className="tag" style={{marginBottom:16}}>Process</div>
            <h2 style={{fontSize:'clamp(36px,5vw,56px)',fontWeight:800,letterSpacing:'-0.03em'}}>Three steps to color</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:40,position:'relative'}}>
            {steps.map((s,i) => (
              <div key={i} style={{position:'relative'}}>
                <div className="step-num">{s.n}</div>
                <div style={{position:'absolute',top:0,left:0,width:3,height:40,background:`linear-gradient(180deg, var(--pink), transparent)`}}/>
                <h3 style={{fontSize:22,fontWeight:700,marginBottom:12,marginTop:8}}>{s.title}</h3>
                <p style={{color:'var(--muted)',fontSize:15,lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'120px 48px',textAlign:'center',position:'relative',zIndex:1}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <div style={{display:'inline-block',padding:'2px',background:'linear-gradient(135deg,var(--pink),var(--cyan))',marginBottom:48}}>
            <div style={{padding:'64px',background:'var(--ink)'}}>
              <h2 style={{fontSize:'clamp(32px,5vw,52px)',fontWeight:800,letterSpacing:'-0.03em',marginBottom:20}}>
                Ready to colorize?
              </h2>
              <p style={{color:'var(--muted)',fontSize:16,lineHeight:1.7,marginBottom:36}}>
                Join thousands of manga enthusiasts. No account needed — just upload and watch the magic happen.
              </p>
              <button className="btn-primary" onClick={() => setPage('colorize')} style={{fontSize:16,padding:'18px 48px'}}>
                Start for Free <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer setPage={setPage} />
    </div>
  );
};

// ===== COLORIZE PAGE =====
const ColorizePage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setCompareMode(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("file", image);
    try {
      setLoading(true);
      setProgress(0);
      const interval = setInterval(() => setProgress(p => Math.min(p + 7, 90)), 200);
      const response = await fetch("https://arjunkhatriya-gan-anime-colorizer.hf.space/process", {
        method: "POST",
        body: formData,
      });
      clearInterval(interval);
      setProgress(100);
      const blob = await response.blob();
      setResult(URL.createObjectURL(blob));
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleSlider = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    setSliderPos(Math.max(0, Math.min(100, x)));
  };

  return (
    <div className="page" style={{minHeight:'100vh',padding:'120px 48px 80px',position:'relative',zIndex:1}}>
      <style>{`
        .drop-zone {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .drop-zone:hover, .drop-zone.dragging {
          border-color: var(--pink) !important;
          background: rgba(255,45,120,0.05) !important;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--pink), var(--cyan));
          transition: width 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 60px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 1s linear infinite;
        }
        .result-badge {
          position: absolute;
          top: 16px; right: 16px;
          background: var(--pink);
          color: white;
          padding: 6px 14px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
      `}</style>

      <div style={{maxWidth:1100,margin:'0 auto'}}>
        {/* Header */}
        <div style={{marginBottom:64,display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:24}}>
          <div>
            <div className="tag" style={{marginBottom:16}}>AI Studio</div>
            <h1 style={{fontSize:'clamp(40px,6vw,72px)',fontWeight:800,letterSpacing:'-0.04em',lineHeight:1}}>
              Colorize<br/><span style={{color:'var(--pink)'}}>Your Manga</span>
            </h1>
          </div>
          <p style={{maxWidth:340,color:'var(--muted)',fontSize:16,lineHeight:1.7}}>
            Upload a black & white manga panel. Our W-GAN will analyze composition and apply contextually accurate colors.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,marginBottom:24}}>
          {/* Upload */}
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid var(--border)',padding:32}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
              <div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>Upload Image</div>
                <div style={{color:'var(--muted)',fontSize:13}}>PNG, JPG, JPEG, GIF, WebP · Max 10MB</div>
              </div>
              {image && (
                <button onClick={() => {setImage(null);setPreview(null);setResult(null);}} style={{background:'rgba(255,45,120,0.15)',border:'1px solid rgba(255,45,120,0.3)',color:'var(--pink)',padding:'6px 14px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'Syne,sans-serif',letterSpacing:'0.08em'}}>
                  CLEAR
                </button>
              )}
            </div>

            <div
              className={`drop-zone ${dragging ? 'dragging' : ''}`}
              style={{
                border: `2px dashed ${preview ? 'rgba(255,45,120,0.4)' : 'rgba(255,255,255,0.12)'}`,
                minHeight: 320,
                display:'flex',alignItems:'center',justifyContent:'center',
                position:'relative',overflow:'hidden',
                background: preview ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.01)',
              }}
              onDragOver={(e) => {e.preventDefault();setDragging(true);}}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !preview && fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} style={{display:'none'}}/>
              {preview ? (
                <>
                  <img src={preview} alt="preview" style={{width:'100%',height:'100%',objectFit:'contain',maxHeight:320}}/>
                  <div style={{position:'absolute',bottom:12,right:12,background:'rgba(0,0,0,0.7)',padding:'4px 10px',fontSize:11,fontFamily:'Space Mono',color:'var(--muted)'}}>
                    {image?.name?.slice(0,24)}
                  </div>
                </>
              ) : (
                <div style={{textAlign:'center',padding:32}}>
                  <div style={{fontSize:48,marginBottom:16,opacity:0.3}}>⊕</div>
                  <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>Upload Manga Panel</div>
                  <div style={{color:'var(--muted)',fontSize:13}}>Drag & drop or click to browse</div>
                </div>
              )}
            </div>

            {/* Progress bar */}
            {loading && (
              <div style={{marginTop:16}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <span style={{fontFamily:'Space Mono',fontSize:11,color:'var(--muted)'}}>PROCESSING</span>
                  <span style={{fontFamily:'Space Mono',fontSize:11,color:'var(--pink)'}}>{progress}%</span>
                </div>
                <div style={{height:3,background:'rgba(255,255,255,0.08)',overflow:'hidden'}}>
                  <div className="progress-fill" style={{width:`${progress}%`}}/>
                </div>
              </div>
            )}

            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!image || loading}
              style={{
                width:'100%',justifyContent:'center',marginTop:20,fontSize:15,padding:'16px',
                opacity: !image || loading ? 0.5 : 1,
                cursor: !image || loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <span style={{display:'inline-block',width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid white',borderRadius:'50%',animation:'spinSlow 0.8s linear infinite'}}/>
                  Colorizing...
                </>
              ) : (
                <> ⚡ Generate Colors </>
              )}
            </button>
          </div>

          {/* Result */}
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid var(--border)',padding:32}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
              <div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>Colorized Result</div>
                <div style={{color:'var(--muted)',fontSize:13}}>Your AI-colorized manga panel</div>
              </div>
              {result && (
                <div style={{display:'flex',gap:8}}>
                  <button onClick={() => setCompareMode(!compareMode)} style={{background: compareMode ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.08)',border:`1px solid ${compareMode ? 'var(--cyan)' : 'var(--border)'}`,color: compareMode ? 'var(--cyan)' : 'var(--muted)',padding:'6px 14px',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Syne,sans-serif',letterSpacing:'0.08em',transition:'all 0.3s'}}>
                    COMPARE
                  </button>
                  <a href={result} download="colorized.png" style={{background:'rgba(255,45,120,0.15)',border:'1px solid rgba(255,45,120,0.3)',color:'var(--pink)',padding:'6px 14px',fontSize:11,fontWeight:700,textDecoration:'none',fontFamily:'Syne,sans-serif',letterSpacing:'0.08em',display:'flex',alignItems:'center'}}>
                    SAVE
                  </a>
                </div>
              )}
            </div>

            <div style={{minHeight:320,background:'rgba(0,0,0,0.2)',border:'1px solid rgba(255,255,255,0.06)',position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {result ? (
                compareMode && preview ? (
                  // Slider comparison
                  <div ref={sliderRef} style={{width:'100%',height:'100%',position:'relative',cursor:'ew-resize',minHeight:320}} onMouseMove={(e) => e.buttons === 1 && handleSlider(e)} onClick={handleSlider}>
                    <img src={result} alt="colorized" style={{width:'100%',height:'100%',objectFit:'contain',position:'absolute',inset:0}}/>
                    <div style={{position:'absolute',inset:0,overflow:'hidden',width:`${sliderPos}%`}}>
                      <img src={preview} alt="original" style={{width:`${10000/sliderPos}%`,height:'100%',objectFit:'contain'}}/>
                    </div>
                    <div style={{position:'absolute',top:0,bottom:0,left:`${sliderPos}%`,width:2,background:'white',boxShadow:'0 0 10px rgba(255,255,255,0.8)'}}>
                      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:32,height:32,borderRadius:'50%',background:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'var(--ink)',fontWeight:700,boxShadow:'0 2px 10px rgba(0,0,0,0.5)'}}>
                        ↔
                      </div>
                    </div>
                    <div style={{position:'absolute',bottom:8,left:8,background:'rgba(0,0,0,0.7)',padding:'3px 8px',fontSize:10,fontFamily:'Space Mono',color:'rgba(255,255,255,0.7)'}}>ORIGINAL</div>
                    <div style={{position:'absolute',bottom:8,right:8,background:'rgba(255,45,120,0.8)',padding:'3px 8px',fontSize:10,fontFamily:'Space Mono',color:'white'}}>COLORIZED</div>
                  </div>
                ) : (
                  <>
                    <img src={result} alt="result" style={{width:'100%',maxHeight:320,objectFit:'contain'}}/>
                    <div className="result-badge">✦ AI Colorized</div>
                  </>
                )
              ) : (
                <div style={{textAlign:'center',color:'rgba(255,255,255,0.15)'}}>
                  <div style={{fontSize:48,marginBottom:12,animation: loading ? 'colorShift 2s linear infinite' : 'none'}}>✦</div>
                  <div style={{fontFamily:'Space Mono',fontSize:12,letterSpacing:'0.1em'}}>
                    {loading ? 'GENERATING...' : 'AWAITING INPUT'}
                  </div>
                </div>
              )}
            </div>

            {result && (
              <div style={{marginTop:16,padding:16,background:'rgba(0,229,255,0.05)',border:'1px solid rgba(0,229,255,0.15)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontFamily:'Space Mono',fontSize:11,color:'var(--cyan)',letterSpacing:'0.1em'}}>✓ COLORIZATION COMPLETE</span>
                  <span style={{fontFamily:'Space Mono',fontSize:11,color:'var(--muted)'}}>W-GAN · Pix2Pix</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3}}>
          {[
            { icon: '◈', tip: 'Use high contrast', desc: 'High contrast black & white panels give the best colorization results' },
            { icon: '◉', tip: 'Clean line art', desc: 'Panels with clean, defined ink lines produce more accurate colors' },
            { icon: '◎', tip: 'Standard panels', desc: 'Individual character panels work better than complex battle scenes' },
          ].map((t,i) => (
            <div key={i} style={{padding:24,background:'rgba(255,255,255,0.02)',border:'1px solid var(--border)',display:'flex',gap:16}}>
              <div style={{fontSize:20,color:'var(--pink)',flexShrink:0,fontFamily:'Space Mono'}}>{t.icon}</div>
              <div>
                <div style={{fontWeight:700,fontSize:13,marginBottom:6}}>{t.tip}</div>
                <div style={{color:'var(--muted)',fontSize:13,lineHeight:1.5}}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== ABOUT PAGE =====
const AboutPage = ({ setPage }) => {
  const tech = {
    frontend: ['Next.js 14','TypeScript','Tailwind CSS','shadcn/ui','React Hooks'],
    ai: ['PyTorch','Pix2Pix GAN','W-GAN','Computer Vision','Flask API'],
  };

  const timeline = [
    { year: '2023', event: 'Project conception — exploring GAN applications in manga art' },
    { year: '2024 Q1', event: 'Dataset curation — assembled 50,000+ manga panel pairs' },
    { year: '2024 Q3', event: 'First W-GAN model trained with style transfer techniques' },
    { year: '2025', event: 'Beta launch — 1,000 testers, 98% satisfaction' },
    { year: '2026', event: 'Public release — ColorGANime v1.0' },
  ];

  return (
    <div className="page" style={{minHeight:'100vh',padding:'120px 48px 80px',position:'relative',zIndex:1}}>
      <style>{`
        .timeline-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: var(--pink);
          flex-shrink: 0;
          position: relative;
        }
        .timeline-dot::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid rgba(255,45,120,0.3);
          animation: pulse-ring 2s ease infinite;
        }
      `}</style>

      <div style={{maxWidth:1100,margin:'0 auto'}}>
        {/* Header */}
        <div style={{marginBottom:96,maxWidth:700}}>
          <div className="tag" style={{marginBottom:20}}>About</div>
          <h1 style={{fontSize:'clamp(48px,7vw,88px)',fontWeight:800,letterSpacing:'-0.04em',lineHeight:1,marginBottom:32}}>
            Color<span style={{color:'var(--pink)'}}>GAN</span>ime
          </h1>
          <p style={{fontSize:19,color:'var(--muted)',lineHeight:1.7}}>
            Bringing color to the world of manga, one panel at a time. Built with passion at IIIT Vadodara.
          </p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,marginBottom:3}}>
          {/* Mission */}
          <div style={{padding:48,background:'rgba(255,255,255,0.03)',border:'1px solid var(--border)'}}>
            <div className="tag" style={{marginBottom:24}}>Mission</div>
            <h2 style={{fontSize:28,fontWeight:800,letterSpacing:'-0.02em',marginBottom:24,lineHeight:1.2}}>
              Art meets artificial intelligence
            </h2>
            <p style={{color:'var(--muted)',fontSize:15,lineHeight:1.8,marginBottom:20}}>
              ColorGANime was born from a passion for manga and cutting-edge AI. We believe every black and white panel holds the potential for vibrant life — and our technology makes that possible while preserving the original artist's vision.
            </p>
            <p style={{color:'var(--muted)',fontSize:15,lineHeight:1.8}}>
              Our advanced model has been trained on thousands of manga panels and their colorized counterparts, learning to understand context, character emotions, and environmental settings to apply colors that feel natural.
            </p>
          </div>

          {/* Creator */}
          <div style={{padding:48,background:'rgba(255,45,120,0.04)',border:'1px solid rgba(255,45,120,0.12)'}}>
            <div className="tag" style={{marginBottom:24}}>Creator</div>
            <div style={{display:'flex',alignItems:'flex-start',gap:20,marginBottom:32}}>
              <div style={{width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,var(--pink),var(--cyan))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>
                A
              </div>
              <div>
                <h3 style={{fontSize:22,fontWeight:800,letterSpacing:'-0.01em',marginBottom:4}}>Arjun</h3>
                <div style={{color:'var(--muted)',fontSize:13,fontFamily:'Space Mono',marginBottom:12}}>ML Engineer & Frontend Developer</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  <span style={{padding:'4px 10px',background:'rgba(255,255,255,0.06)',border:'1px solid var(--border)',fontSize:11,color:'var(--muted)',letterSpacing:'0.06em'}}>IIIT Vadodara</span>
                  <span style={{padding:'4px 10px',background:'rgba(255,255,255,0.06)',border:'1px solid var(--border)',fontSize:11,color:'var(--muted)',letterSpacing:'0.06em'}}>AI Researcher</span>
                </div>
              </div>
            </div>
            <blockquote style={{borderLeft:'2px solid var(--pink)',paddingLeft:20,color:'var(--muted)',fontSize:15,lineHeight:1.7,fontStyle:'italic'}}>
              "I wanted to see what happens when you give an AI a lifetime of manga to study and ask it to dream in color."
            </blockquote>
          </div>
        </div>

        {/* Tech */}
        <div style={{padding:48,background:'rgba(255,255,255,0.02)',border:'1px solid var(--border)',marginBottom:3}}>
          <div className="tag" style={{marginBottom:32}}>Technology Stack</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48}}>
            {Object.entries(tech).map(([cat, items]) => (
              <div key={cat}>
                <h3 style={{fontSize:13,fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--muted)',marginBottom:20}}>
                  {cat === 'frontend' ? '◈ Frontend' : '◉ AI & Backend'}
                </h3>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {items.map((item,i) => (
                    <span key={i} style={{
                      padding:'8px 16px',
                      background: cat === 'ai' ? 'rgba(255,45,120,0.1)' : 'rgba(0,229,255,0.08)',
                      border: `1px solid ${cat === 'ai' ? 'rgba(255,45,120,0.2)' : 'rgba(0,229,255,0.15)'}`,
                      color: cat === 'ai' ? 'var(--pink)' : 'var(--cyan)',
                      fontSize:13,fontWeight:600,
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Deep Dive */}
        <div style={{padding:48,background:'rgba(255,255,255,0.02)',border:'1px solid var(--border)',marginBottom:3}}>
          <div className="tag" style={{marginBottom:24}}>How The AI Works</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48}}>
            <div>
              <h3 style={{fontSize:20,fontWeight:700,marginBottom:16}}>Pix2Pix W-GAN Architecture</h3>
              <p style={{color:'var(--muted)',fontSize:15,lineHeight:1.8,marginBottom:16}}>
                Our model is based on the Wasserstein Generative Adversarial Network with Pix2Pix conditional generation — specifically adapted for manga's unique visual language with its high-contrast ink lines and expressive character designs.
              </p>
              <p style={{color:'var(--muted)',fontSize:15,lineHeight:1.8}}>
                The W-GAN's improved training stability allows us to learn nuanced color distributions without mode collapse, producing diverse yet contextually appropriate colorizations.
              </p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {[
                { label: 'Training Dataset', val: '50,000+ panel pairs' },
                { label: 'Model Architecture', val: 'U-Net Generator + PatchGAN' },
                { label: 'Training Method', val: 'Wasserstein GAN + Style Loss' },
                { label: 'Average Inference', val: '< 3 seconds' },
                { label: 'Output Resolution', val: 'Up to 1024×1024px' },
              ].map((stat,i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                  <span style={{color:'var(--muted)',fontSize:13}}>{stat.label}</span>
                  <span style={{fontFamily:'Space Mono',fontSize:13,color:'var(--cyan)'}}>{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{padding:48,background:'rgba(255,255,255,0.02)',border:'1px solid var(--border)',marginBottom:3}}>
          <div className="tag" style={{marginBottom:32}}>Timeline</div>
          <div style={{display:'flex',flexDirection:'column',gap:24}}>
            {timeline.map((t,i) => (
              <div key={i} style={{display:'flex',gap:24,alignItems:'flex-start'}}>
                <div style={{width:80,flexShrink:0}}>
                  <span style={{fontFamily:'Space Mono',fontSize:12,color:'var(--pink)',fontWeight:700}}>{t.year}</span>
                </div>
                <div style={{display:'flex',gap:16,alignItems:'flex-start',flex:1,paddingBottom:24,borderBottom: i < timeline.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none'}}>
                  <div className="timeline-dot" style={{marginTop:4}}/>
                  <p style={{color:'var(--muted)',fontSize:15,lineHeight:1.6}}>{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer + CTA */}
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:3}}>
          <div style={{padding:32,background:'rgba(255,214,10,0.04)',border:'1px solid rgba(255,214,10,0.15)'}}>
            <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.15em',color:'var(--gold)',marginBottom:12}}>⚠ DISCLAIMER</div>
            <p style={{color:'rgba(255,240,180,0.7)',fontSize:14,lineHeight:1.6}}>
              ColorGANime is a demonstration project. Please respect copyright laws and only colorize manga panels that you own or have explicit permission to modify. The creators are not liable for misuse.
            </p>
          </div>
          <div style={{padding:32,background:'rgba(255,45,120,0.06)',border:'1px solid rgba(255,45,120,0.15)',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'flex-start',gap:16}}>
            <div style={{fontSize:18,fontWeight:700}}>Try it now</div>
            <p style={{color:'var(--muted)',fontSize:13,lineHeight:1.5}}>Upload your first manga panel and see the magic.</p>
            <button className="btn-primary" onClick={() => setPage('colorize')} style={{fontSize:13,padding:'12px 24px'}}>
              Start Colorizing →
            </button>
          </div>
        </div>
      </div>

      <div style={{marginTop:80}}>
        <Footer setPage={setPage} />
      </div>
    </div>
  );
};

// ===== FOOTER =====
const Footer = ({ setPage }) => (
  <footer style={{borderTop:'1px solid var(--border)',padding:'48px',marginTop:40}}>
    <div style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:24}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:28,height:28,borderRadius:'50%',background:'conic-gradient(from 0deg, #ff2d78, #00e5ff, #ff2d78)',animation:'spinSlow 4s linear infinite',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{width:20,height:20,borderRadius:'50%',background:'var(--ink)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10}}>🎨</div>
        </div>
        <span style={{fontWeight:800,fontSize:15}}>
          Color<span style={{color:'var(--pink)'}}>GAN</span>ime
        </span>
      </div>
      <div style={{display:'flex',gap:32}}>
        {['home','colorize','about'].map(p => (
          <span key={p} className="nav-link" onClick={() => setPage(p)} style={{fontSize:12}}>
            {p}
          </span>
        ))}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,color:'var(--muted)',fontSize:13}}>
        <span>© 2026 ColorGANime · Created by</span>
        <span style={{color:'var(--paper)',fontWeight:700}}>Arjun</span>
        <span>· All rights reserved.</span>
      </div>
    </div>
  </footer>
);

// ===== APP =====
export default function App() {
  const [page, setPage] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const pages = { home: <HomePage setPage={setPage}/>, colorize: <ColorizePage/>, about: <AboutPage setPage={setPage}/> };

  return (
    <>
      <style>{globalStyles}</style>
      <NoiseBg/>
      <GridOverlay/>
      <Nav page={page} setPage={setPage}/>
      <main style={{position:'relative',zIndex:1}}>
        {pages[page]}
      </main>
    </>
  );
}