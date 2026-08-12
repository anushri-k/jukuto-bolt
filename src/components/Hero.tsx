import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, Cpu, Gauge, ShieldCheck, Activity } from 'lucide-react';
import { CheckpointLine } from './primitives';

export function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const parallax = (factor: number) => `translateY(${scrollY * factor}px)`;

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative min-h-screen w-full overflow-hidden bg-indigo-900 noise"
    >
      {/* Background image — automotive production line */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: parallax(0.3),
          transition: 'transform 0.1s linear',
        }}
      >
        <img
          src="https://images.pexels.com/photos/3827431/pexels-photo-3827431.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Automotive production line with robotic arms"
          className="w-full h-full object-cover opacity-50"
          loading="eager"
        />
        {/* Duotone indigo overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(27,31,53,0.85) 0%, rgba(27,31,53,0.6) 40%, rgba(27,31,53,0.92) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 70% 30%, rgba(43,75,255,0.15) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 20% 80%, rgba(237,49,35,0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 z-0 grid-pattern opacity-40" />

      {/* Floating glass UI panels */}
      <div
        className="absolute top-[28%] right-[6%] z-10 hidden md:block animate-float"
        style={{ transform: parallax(-0.05) }}
      >
        <div className="glass rounded-xl p-5 w-64 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] uppercase tracking-mono text-white/60">
              Operator · A-204
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-mono text-vermillion">
              <span className="w-1.5 h-1.5 rounded-full bg-vermillion animate-pulse" />
              Live
            </span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-mono text-white/50 mb-2">
            Competency Progress
          </div>
          <div className="flex items-end gap-2 mb-3">
            <span className="font-serif text-3xl font-semibold text-white">87</span>
            <span className="font-mono text-xs text-white/60 mb-1">/ 100</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-vermillion rounded-full transition-all duration-[2000ms] ease-out"
              style={{ width: mounted ? '87%' : '0%' }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-mono text-white/50">
              Checkpoint 07
            </span>
            <span className="font-mono text-[10px] text-cobalt-300">Passed</span>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[24%] right-[14%] z-10 hidden lg:block animate-float-slow"
        style={{ transform: parallax(-0.08) }}
      >
        <div className="glass rounded-xl p-5 w-56 shadow-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-cobalt/20 flex items-center justify-center">
              <Gauge size={18} className="text-cobalt-300" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-mono text-white/60">
              Cycle Time
            </span>
          </div>
          <div className="font-serif text-2xl font-semibold text-white">42.3s</div>
          <div className="font-mono text-[10px] text-white/50 mt-1">
            -18% vs. baseline
          </div>
          <div className="mt-3 flex items-end gap-1 h-8">
            {[40, 55, 35, 70, 50, 65, 45, 80, 60, 72].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-cobalt-400/60 rounded-sm transition-all duration-700"
                style={{
                  height: mounted ? `${h}%` : '0%',
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute top-[40%] left-[5%] z-10 hidden xl:block animate-float"
        style={{ transform: parallax(-0.04) }}
      >
        <div className="glass rounded-xl p-4 w-52 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={16} className="text-vermillion" />
            <span className="font-mono text-[10px] uppercase tracking-mono text-white/60">
              IATF Audit Log
            </span>
          </div>
          <div className="space-y-2">
            {['SOP-014', 'TOR-022', 'QC-007'].map((sop, i) => (
              <div key={sop} className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/70">{sop}</span>
                <span
                  className={`font-mono text-[10px] ${
                    i === 1 ? 'text-white/40' : 'text-vermillion'
                  }`}
                >
                  {i === 1 ? 'Pending' : 'Verified'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 container-max px-6 md:px-10 lg:px-16 min-h-screen flex flex-col justify-center pt-24 pb-32">
        <div
          className={`transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs uppercase tracking-eyebrow text-vermillion font-semibold">
              Immersive XR Training for Manufacturing
            </span>
            <span className="hidden md:inline-block h-px w-12 bg-vermillion/40" />
          </div>

          <h1 className="font-serif font-semibold text-white text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02] tracking-tight max-w-5xl">
            Keep the Dojo.
            <br />
            <span className="text-gradient-vermillion">Prove the Result.</span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed font-normal">
            Train operators to full competence in immersive XR before they touch a
            real production line. Measure every skill. Standardize every process.
            Scale training across every facility.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a href="#contact" className="btn-primary group">
              Book a Demo
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
            <a href="#process" className="btn-ghost group">
              <Play size={15} />
              See How It Works
            </a>
          </div>

          {/* Checkpoint motif */}
          <div className="mt-16 max-w-md">
            <CheckpointLine activeIndex={3} total={9} variant="light" className="w-full h-8" />
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-mono text-white/40">
                Checkpoint 04 of 09
              </span>
              <span className="font-mono text-[10px] uppercase tracking-mono text-vermillion">
                In Progress
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip — trust signals */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-indigo-900/60 backdrop-blur-sm">
        <div className="container-max px-6 md:px-10 lg:px-16 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-cobalt-300" />
            <span className="font-mono text-[10px] uppercase tracking-mono text-white/50">
              Trusted by Tier 1 suppliers & OEMs worldwide
            </span>
          </div>
          <div className="flex items-center gap-6 md:gap-10">
            {['IATF 16949', 'ISO 9001', 'ISO 45001', 'Audit-Ready'].map((s) => (
              <span
                key={s}
                className="font-mono text-[10px] uppercase tracking-mono text-white/40 hover:text-white/70 transition-colors"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2">
        <Activity size={14} className="text-white/30 animate-pulse" />
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
