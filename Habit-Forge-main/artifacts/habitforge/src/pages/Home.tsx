import { Link } from "wouter";
import { motion } from "framer-motion";
import NeonHabitLogo from "../components/NeonHabitLogo";

const PARTICLES = [
  { size:2.5, top:"7%",  left:"6%",  delay:"0s",   dur:"7s",  op:0.7,  color:"#c4b5fd" },
  { size:2,   top:"14%", left:"87%", delay:"1.3s", dur:"9s",  op:0.55, color:"#8b5cf6" },
  { size:3.5, top:"71%", left:"5%",  delay:"0.4s", dur:"8s",  op:0.5,  color:"#e879f9" },
  { size:2,   top:"79%", left:"84%", delay:"2.1s", dur:"10s", op:0.6,  color:"#c4b5fd" },
  { size:3,   top:"34%", left:"93%", delay:"0.8s", dur:"7s",  op:0.45, color:"#a78bfa" },
  { size:2,   top:"54%", left:"9%",  delay:"1.9s", dur:"8s",  op:0.58, color:"#c4b5fd" },
  { size:1.5, top:"11%", left:"54%", delay:"2.6s", dur:"9s",  op:0.4,  color:"#e879f9" },
  { size:2.5, top:"89%", left:"41%", delay:"0.2s", dur:"7s",  op:0.65, color:"#c4b5fd" },
  { size:3.5, top:"26%", left:"18%", delay:"3.1s", dur:"11s", op:0.35, color:"#8b5cf6" },
  { size:2,   top:"64%", left:"68%", delay:"1.5s", dur:"8s",  op:0.55, color:"#c4b5fd" },
  { size:2,   top:"42%", left:"3%",  delay:"2.3s", dur:"9s",  op:0.45, color:"#e879f9" },
  { size:2.5, top:"92%", left:"75%", delay:"0.7s", dur:"8s",  op:0.5,  color:"#8b5cf6" },
  { size:2,   top:"19%", left:"31%", delay:"2.0s", dur:"10s", op:0.35, color:"#c4b5fd" },
  { size:1,   top:"57%", left:"51%", delay:"3.5s", dur:"6s",  op:0.48, color:"#f0abfc" },
  { size:2,   top:"76%", left:"25%", delay:"1.0s", dur:"9s",  op:0.4,  color:"#c084fc" },
  { size:2.5, top:"5%",  left:"69%", delay:"2.8s", dur:"8s",  op:0.52, color:"#a855f7" },
  { size:1,   top:"39%", left:"79%", delay:"1.2s", dur:"7s",  op:0.62, color:"#e879f9" },
  { size:2,   top:"96%", left:"57%", delay:"0.3s", dur:"11s", op:0.38, color:"#c4b5fd" },
  { size:1.5, top:"82%", left:"14%", delay:"1.7s", dur:"7.5s",op:0.55, color:"#e879f9" },
  { size:2,   top:"31%", left:"61%", delay:"3.3s", dur:"8s",  op:0.45, color:"#8b5cf6" },
];

const SPARKS = [
  { angle:22,  r:130, dur:"3.4s", delay:"0s",   color:"#e879f9" },
  { angle:88,  r:133, dur:"4.2s", delay:"0.8s", color:"#c4b5fd" },
  { angle:152, r:131, dur:"3.8s", delay:"1.6s", color:"#e879f9" },
  { angle:218, r:132, dur:"4.6s", delay:"0.4s", color:"#c4b5fd" },
  { angle:288, r:130, dur:"3.2s", delay:"2.2s", color:"#f0abfc" },
  { angle:340, r:132, dur:"5.0s", delay:"1.0s", color:"#c4b5fd" },
];

export default function Home() {
  return (
    <div style={{
      position:"relative", minHeight:"100vh",
      background:"#030009",
      overflow:"hidden",
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>

      <style>{`
        @keyframes hf-spin     { to { transform:rotate(360deg);  } }
        @keyframes hf-spin-rev { to { transform:rotate(-360deg); } }
        @keyframes hf-float {
          0%,100% { transform:translateY(0) scale(1);      }
          50%     { transform:translateY(-13px) scale(1.013); }
        }
        @keyframes hf-particle {
          0%,100% { transform:translateY(0) scale(1);      opacity:var(--p-op); }
          33%     { transform:translateY(-20px) scale(1.5); opacity:calc(var(--p-op)*1.8); }
          66%     { transform:translateY(10px) scale(0.75); opacity:calc(var(--p-op)*0.5); }
        }
        @keyframes hf-badge-glow {
          0%,100% { box-shadow:0 0 55px 16px rgba(80,20,170,0.50),0 0 110px 38px rgba(100,30,200,0.20),inset 0 0 32px rgba(80,20,170,0.14); }
          50%     { box-shadow:0 0 90px 28px rgba(80,20,170,0.80),0 0 180px 68px rgba(100,30,200,0.35),inset 0 0 55px rgba(80,20,170,0.24); }
        }
        @keyframes hf-floor {
          0%,100% { opacity:0.45; } 50% { opacity:0.9; }
        }
        @keyframes hf-shimmer {
          0%   { background-position:-500% center; }
          100% { background-position: 500% center; }
        }
        @keyframes hf-spark {
          0%   { opacity:0;   transform:scale(0.3); }
          25%  { opacity:1;   transform:scale(1.6); }
          70%  { opacity:0.9; transform:scale(1.0); }
          100% { opacity:0;   transform:scale(0.2); }
        }
        @keyframes hf-grid {
          0%   { transform:translateY(0); }
          100% { transform:translateY(60px); }
        }
        @keyframes hf-fog {
          0%,100% { transform:translateX(-10%); opacity:0.09; }
          50%     { transform:translateX(10%);  opacity:0.17; }
        }
        @keyframes hf-lens {
          0%,100% { opacity:0; transform:scale(0.5); }
          45%,55% { opacity:0.72; transform:scale(1.35); }
        }
        @keyframes hf-arrow {
          0%,100% { transform:translateX(0); }
          50%     { transform:translateX(5px); }
        }
        @keyframes hf-ring-spin-glow {
          0%,100% { opacity:0.92; }
          50%     { opacity:1;    }
        }
        @keyframes hf-entrance {
          0%   { opacity:0; transform:translateY(24px) scale(0.9); filter:blur(8px); }
          100% { opacity:1; transform:translateY(0)    scale(1);   filter:blur(0);   }
        }
        @keyframes hf-energy {
          0%,100% { transform:translateX(-50%) scaleX(1);    opacity:0.30; }
          50%     { transform:translateX(-50%) scaleX(1.12); opacity:0.65; }
        }
        @keyframes hf-halo {
          0%,100% { opacity:0.18; } 50% { opacity:0.45; }
        }
        @keyframes hf-ring-outer-pulse {
          0%,100% { r:131; opacity:0.7; }
          50%     { r:133; opacity:1;   }
        }
        @keyframes hf-stroke-dash {
          0%   { stroke-dashoffset:0; }
          100% { stroke-dashoffset:-824; }
        }

        .hf-btn {
          transition:transform .28s cubic-bezier(.34,1.56,.64,1),
                     box-shadow .28s ease, border-color .28s ease, background .28s ease;
          position:relative; overflow:hidden;
        }
        .hf-btn::before {
          content:''; position:absolute; inset:0; border-radius:16px;
          background:linear-gradient(105deg,transparent 25%,rgba(240,215,255,.17) 50%,transparent 75%);
          transform:translateX(-120%); transition:transform .55s ease;
        }
        .hf-btn:hover::before  { transform:translateX(120%); }
        .hf-btn:hover {
          transform:scale(1.07) translateY(-3px) !important;
          box-shadow:0 0 65px 22px rgba(80,20,170,.95),0 0 140px 44px rgba(120,40,220,.45),0 10px 40px rgba(0,0,0,.5) !important;
          border-color:rgba(240,175,255,.98) !important;
          background:rgba(14,4,40,.88) !important;
        }
        .hf-btn:active { transform:scale(0.96) !important; }
        .hf-btn:hover .hf-arr { animation:hf-arrow .5s ease-in-out infinite; }

        .hf-shimmer {
          background-image:linear-gradient(90deg,
            #6d28d9 0%,#9333ea 20%,#f3e8ff 36%,#f0abfc 50%,
            #9333ea 64%,#6d28d9 80%,#a855f7 100%
          );
          background-size:280% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:hf-shimmer 5s linear infinite;
          filter:drop-shadow(0 0 30px rgba(160,80,240,1)) drop-shadow(0 0 65px rgba(200,40,220,.6));
        }
      `}</style>

      {/* ── Background nebula ─────────────────────────────── */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 95% 85% at 50% 18%, #1d0445 0%, #0a0121 40%, #020008 68%, #010004 100%)" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 55% 50% at 50% 36%, rgba(85,25,175,0.30) 0%, rgba(65,18,148,0.10) 50%, transparent 78%)" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 28% 24% at 50% 40%, rgba(155,75,235,0.18) 0%, transparent 65%)" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"48%", pointerEvents:"none",
        background:"linear-gradient(to bottom, transparent, rgba(1,0,5,.94))" }} />

      {/* ── Grid ─────────────────────────────────────────── */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden",
        maskImage:"radial-gradient(ellipse 70% 70% at 50% 46%, black 0%, transparent 68%)",
        WebkitMaskImage:"radial-gradient(ellipse 70% 70% at 50% 46%, black 0%, transparent 68%)",
      }}>
        <div style={{
          position:"absolute", inset:"-70px 0 0 0",
          backgroundImage:`linear-gradient(rgba(100,55,205,.055) 1px,transparent 1px),
                           linear-gradient(90deg,rgba(100,55,205,.055) 1px,transparent 1px)`,
          backgroundSize:"56px 56px", animation:"hf-grid 5s linear infinite",
        }} />
      </div>

      {/* ── Fog ──────────────────────────────────────────── */}
      <div style={{
        position:"absolute", top:"10%", left:"-8%", width:"116%", height:"56%", pointerEvents:"none",
        background:"radial-gradient(ellipse 70% 46% at 50% 50%, rgba(82,25,175,.15) 0%, transparent 70%)",
        filter:"blur(55px)", animation:"hf-fog 14s ease-in-out infinite",
      }} />

      {/* ── Lens flares ──────────────────────────────────── */}
      <div style={{ position:"absolute", top:"6%", right:"10%", width:130, height:130, borderRadius:"50%", pointerEvents:"none",
        background:"radial-gradient(circle, rgba(232,121,249,.42) 0%, rgba(168,85,247,.22) 40%, transparent 70%)",
        filter:"blur(12px)", animation:"hf-lens 8s ease-in-out infinite" }} />
      <div style={{ position:"absolute", top:"12%", right:"20%", width:46, height:46, borderRadius:"50%", pointerEvents:"none",
        background:"radial-gradient(circle, rgba(196,181,253,.58) 0%, transparent 70%)",
        filter:"blur(6px)", animation:"hf-lens 8s ease-in-out infinite .5s" }} />
      <div style={{ position:"absolute", bottom:"17%", left:"7%", width:92, height:92, borderRadius:"50%", pointerEvents:"none",
        background:"radial-gradient(circle, rgba(139,92,246,.38) 0%, transparent 70%)",
        filter:"blur(14px)", animation:"hf-lens 11s ease-in-out infinite 2.2s" }} />

      {/* ── Particles ────────────────────────────────────── */}
      {PARTICLES.map((p, i) => (
        <div key={i} style={{
          position:"absolute", top:p.top, left:p.left,
          width:p.size, height:p.size, borderRadius:"50%",
          background:p.color,
          boxShadow:`0 0 ${p.size*4}px ${p.size*2}px ${p.color}cc`,
          // @ts-ignore
          "--p-op":p.op, opacity:p.op,
          animation:`hf-particle ${p.dur} ${p.delay} ease-in-out infinite`,
          pointerEvents:"none",
        }} />
      ))}

      {/* ── CONTENT ──────────────────────────────────────── */}
      <div style={{
        position:"relative", zIndex:1,
        display:"flex", flexDirection:"column",
        alignItems:"center", textAlign:"center",
        width:"100%", maxWidth:510,
        padding:"clamp(28px,4vh,52px) 24px clamp(32px,5vh,60px)",
        animation:"hf-entrance .9s cubic-bezier(.16,1,.3,1) both",
      }}>

        {/* ── Logo + Ring ─────────────────────────────────── */}
        <div style={{
          position:"relative",
          width:"min(255px,38vw)", height:"min(255px,38vw)",
          display:"flex", alignItems:"center", justifyContent:"center",
          marginBottom:18, flexShrink:0,
        }}>
          {/* SVG Neon Ring */}
          <svg
            style={{
              position:"absolute", inset:0,
              width:"100%", height:"100%",
              animation:"hf-spin 10s linear infinite",
              overflow:"visible",
            }}
            viewBox="0 0 280 280"
          >
            <defs>
              {/* Main bright gradient arc */}
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="objectBoundingBox">
                <stop offset="0%"   stopColor="#4c1d95" />
                <stop offset="18%"  stopColor="#6d28d9" />
                <stop offset="35%"  stopColor="#9333ea" />
                <stop offset="50%"  stopColor="#c026d3" />
                <stop offset="62%"  stopColor="#e879f9" />
                <stop offset="75%"  stopColor="#c084fc" />
                <stop offset="88%"  stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              {/* Glow filter */}
              <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur1"/>
                <feGaussianBlur stdDeviation="12" result="blur2"/>
                <feMerge>
                  <feMergeNode in="blur2"/>
                  <feMergeNode in="blur1"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="ringGlowSoft" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="18" result="blur"/>
                <feMerge><feMergeNode in="blur"/></feMerge>
              </filter>
            </defs>

            {/* Outer soft bloom */}
            <circle cx="140" cy="140" r="131" fill="none"
              stroke="url(#ringGrad)" strokeWidth="22" strokeOpacity="0.40"
              filter="url(#ringGlowSoft)"
              strokeDasharray="600 224" strokeDashoffset="0"
            />
            {/* Main bright ring */}
            <circle cx="140" cy="140" r="131" fill="none"
              stroke="url(#ringGrad)" strokeWidth="5"
              filter="url(#ringGlow)"
              strokeDasharray="680 144" strokeDashoffset="0"
            />
            {/* Highlight shimmer arc */}
            <circle cx="140" cy="140" r="131" fill="none"
              stroke="rgba(255,240,255,0.55)" strokeWidth="2"
              strokeDasharray="160 664"
              strokeDashoffset="-80"
              strokeLinecap="round"
            />
            {/* Inner thin accent */}
            <circle cx="140" cy="140" r="116" fill="none"
              stroke="rgba(196,181,253,0.22)" strokeWidth="1"
              strokeDasharray="90 640" strokeDashoffset="200"
            />
          </svg>

          {/* Counter-spin ring SVG */}
          <svg style={{
            position:"absolute", inset:0,
            width:"100%", height:"100%",
            animation:"hf-spin-rev 24s linear infinite",
            overflow:"visible",
          }} viewBox="0 0 280 280">
            <circle cx="140" cy="140" r="116" fill="none"
              stroke="rgba(232,121,249,0.30)" strokeWidth="1"
              strokeDasharray="55 388"
              strokeLinecap="round"
            />
          </svg>

          {/* Orbiting sparks — fixed positions, parent spins */}
          <div style={{ position:"absolute", inset:0, animation:"hf-spin 10s linear infinite", pointerEvents:"none" }}>
            {SPARKS.map((s, i) => {
              const rad = (s.angle * Math.PI) / 180;
              const size = "clamp(230px,40vw,280px)";
              const half = 140;
              const cx = half + Math.cos(rad) * s.r;
              const cy = half + Math.sin(rad) * s.r;
              const pct = (cx / 280) * 100;
              const pctY = (cy / 280) * 100;
              return (
                <div key={i} style={{
                  position:"absolute",
                  left:`${pct}%`, top:`${pctY}%`,
                  width:6, height:6, borderRadius:"50%",
                  transform:"translate(-50%,-50%)",
                  background:s.color,
                  boxShadow:`0 0 8px 3px ${s.color}dd`,
                  animation:`hf-spark ${s.dur} ${s.delay} ease-in-out infinite`,
                }} />
              );
            })}
          </div>

          {/* Far ambient halo */}
          <div style={{
            position:"absolute", inset:-46, borderRadius:"50%", pointerEvents:"none",
            background:"radial-gradient(circle, transparent 46%, rgba(82,22,178,.20) 62%, rgba(130,60,220,.08) 78%, transparent 90%)",
            animation:"hf-halo 5.5s ease-in-out infinite",
          }} />

          {/* Badge glow orb */}
          <div style={{
            position:"absolute", width:"72%", height:"72%",
            borderRadius:"50%", pointerEvents:"none",
            background:"radial-gradient(circle, rgba(80,20,165,.48) 0%, rgba(65,15,140,.22) 52%, transparent 76%)",
            filter:"blur(28px)", zIndex:1,
          }} />

          {/* Glass badge */}
          <motion.div
            animate={{ y:[0,-13,0], scale:[1,1.013,1] }}
            transition={{ duration:4.5, repeat:Infinity, ease:"easeInOut" }}
            style={{
              width:"74%", height:"74%", borderRadius:"50%",
              background:"radial-gradient(circle at 33% 30%, rgba(55,16,96,.95) 0%, rgba(5,1,16,.98) 100%)",
              border:"1.5px solid rgba(130,80,230,.60)",
              backdropFilter:"blur(24px)",
              display:"flex", alignItems:"center", justifyContent:"center",
              animation:"hf-badge-glow 4s ease-in-out infinite",
              position:"relative", zIndex:2,
              boxShadow:"inset 0 1.5px 0 rgba(255,255,255,.12), inset 0 -1px 0 rgba(0,0,0,.55), 0 0 0 1px rgba(0,0,0,.42)",
              flexShrink:0,
            }}
          >
            <div style={{
              position:"absolute", top:"13%", left:"17%", width:"40%", height:"26%",
              borderRadius:"50%", pointerEvents:"none",
              background:"radial-gradient(ellipse, rgba(255,255,255,.08) 0%, transparent 100%)",
              transform:"rotate(-18deg)",
            }} />
            <NeonHabitLogo size={Math.round(280 * 0.74 * 0.64)} />
          </motion.div>
        </div>

        {/* ── Title ─────────────────────────────────────────── */}
        <motion.h1
          initial={{ opacity:0, y:20, scale:0.95 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:.65, delay:.1, ease:[.16,1,.3,1] }}
          style={{
            fontSize:"clamp(46px,11vw,80px)",
            fontWeight:900, fontStyle:"italic",
            letterSpacing:"-0.025em",
            margin:"0 0 10px", lineHeight:1, userSelect:"none",
            display:"flex", alignItems:"baseline", justifyContent:"center",
          }}
        >
          <span style={{
            color:"#ede9fe",
            textShadow:"0 0 40px rgba(196,181,253,.72),0 0 82px rgba(139,92,246,.38),0 2px 0 rgba(0,0,0,.65)",
          }}>Habit</span>
          <span className="hf-shimmer">Forge</span>
        </motion.h1>

        {/* ── Divider ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity:0, scaleX:0 }}
          animate={{ opacity:1, scaleX:1 }}
          transition={{ duration:.45, delay:.2, ease:[.16,1,.3,1] }}
          style={{ display:"flex", alignItems:"center", gap:13, marginBottom:13 }}
        >
          <div style={{ width:60, height:1, background:"linear-gradient(to right,transparent,rgba(160,80,240,.78))" }} />
          <span style={{ color:"#c084fc", fontSize:13, filter:"drop-shadow(0 0 8px rgba(192,132,252,1))", lineHeight:1 }}>✦</span>
          <div style={{ width:60, height:1, background:"linear-gradient(to left,transparent,rgba(160,80,240,.78))" }} />
        </motion.div>

        {/* ── Tagline ──────────────────────────────────────── */}
        <motion.p
          initial={{ opacity:0, y:14 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:.55, delay:.28, ease:[.16,1,.3,1] }}
          style={{
            fontSize:11, letterSpacing:"0.23em", textTransform:"uppercase",
            color:"#7968a2", margin:"0 0 clamp(28px,4vh,42px)",
            textShadow:"0 0 22px rgba(130,70,220,.40)", fontWeight:500,
          }}
        >
          Consistency Today.&nbsp;&nbsp;&nbsp;Transformation Tomorrow.
        </motion.p>

        {/* ── LOGIN button ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity:0, y:14, scale:.92 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:.55, delay:.38, ease:[.16,1,.3,1] }}
          style={{ position:"relative" }}
        >
          <div style={{
            position:"absolute", bottom:-18, left:"50%",
            width:210, height:18, borderRadius:"50%", pointerEvents:"none",
            background:"radial-gradient(ellipse, rgba(82,22,178,.60) 0%, rgba(65,18,148,.24) 50%, transparent 76%)",
            filter:"blur(10px)", animation:"hf-energy 3.8s ease-in-out infinite",
          }} />
          <div style={{
            position:"absolute", bottom:-26, left:"50%",
            width:300, height:14, borderRadius:"50%", pointerEvents:"none",
            background:"radial-gradient(ellipse, rgba(130,60,220,.24) 0%, transparent 76%)",
            filter:"blur(14px)", animation:"hf-floor 5s ease-in-out infinite .7s",
          }} />

          <Link href="/sign-in">
            <button className="hf-btn" style={{
              display:"flex", alignItems:"center", justifyContent:"center",
              gap:20,
              background:"rgba(5,1,16,.72)",
              border:"1.5px solid rgba(130,80,230,.68)",
              borderRadius:16, padding:"17px 56px",
              cursor:"pointer", color:"#f0eaff",
              fontSize:14, fontWeight:700,
              letterSpacing:"0.30em", textTransform:"uppercase",
              backdropFilter:"blur(22px)",
              boxShadow:"0 0 36px 8px rgba(80,20,170,.52),0 0 82px 22px rgba(100,38,210,.22),inset 0 1px 0 rgba(255,255,255,.10),inset 0 0 28px rgba(80,20,170,.14)",
              minWidth:255, fontFamily:"Inter,system-ui,sans-serif",
            }}>
              <span style={{ color:"#ddd6fe", fontSize:19, lineHeight:1, filter:"drop-shadow(0 0 10px rgba(221,214,254,.95))", flexShrink:0 }}>✦</span>
              <span>LOGIN</span>
              <span className="hf-arr" style={{
                color:"#ddd6fe", fontSize:21, lineHeight:1,
                filter:"drop-shadow(0 0 10px rgba(221,214,254,.95))", flexShrink:0,
                display:"inline-block",
              }}>→</span>
            </button>
          </Link>
        </motion.div>
      </div>

      {/* ── Floor energy lines ────────────────────────────── */}
      <div style={{
        position:"absolute", bottom:"9%", left:"50%",
        width:440, height:24, borderRadius:"50%", pointerEvents:"none",
        background:"radial-gradient(ellipse, rgba(130,60,220,.62) 0%, rgba(100,38,200,.28) 42%, transparent 76%)",
        filter:"blur(13px)", animation:"hf-energy 3.4s ease-in-out infinite",
      }} />
      <div style={{
        position:"absolute", bottom:"10.5%", left:"50%", transform:"translateX(-50%)",
        width:208, height:2, borderRadius:2, pointerEvents:"none",
        background:"linear-gradient(90deg,transparent,rgba(216,180,254,.94),transparent)",
        filter:"blur(1.5px)", animation:"hf-floor 3.4s ease-in-out infinite",
      }} />
      <div style={{
        position:"absolute", bottom:"6%", left:"50%", transform:"translateX(-50%)",
        width:285, height:17, borderRadius:"50%", pointerEvents:"none",
        background:"radial-gradient(ellipse, rgba(160,85,240,.26) 0%, transparent 76%)",
        filter:"blur(16px)", animation:"hf-floor 5s ease-in-out infinite 1.1s",
      }} />

      {/* ── HUD corner accents ────────────────────────────── */}
      {([
        { top:0, left:0, rot:"0deg" },
        { top:0, right:0, rot:"90deg" },
        { bottom:0, right:0, rot:"180deg" },
        { bottom:0, left:0, rot:"270deg" },
      ] as const).map((pos, i) => (
        <div key={i} style={{ position:"absolute", ...pos, width:70, height:70, pointerEvents:"none", opacity:0.40, zIndex:0 }}>
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none" style={{ transform:`rotate(${pos.rot})` }}>
            <path d="M0 35 L0 4 Q0 0 4 0 L35 0" stroke="rgba(130,80,230,.60)" strokeWidth="1" fill="none"/>
            <path d="M0 17 L0 4 Q0 0 4 0 L17 0" stroke="rgba(232,121,249,.38)" strokeWidth=".75" fill="none"/>
            <circle cx="0" cy="0" r="2.5" fill="rgba(130,80,230,.68)" />
          </svg>
        </div>
      ))}

    </div>
  );
}
