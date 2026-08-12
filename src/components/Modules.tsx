import { Reveal } from './primitives';
import {
  Boxes,
  Settings,
  ShieldAlert,
  Wrench,
  Search,
  Siren,
  ClipboardList,
  Hammer,
} from 'lucide-react';

const modules = [
  {
    icon: Boxes,
    title: 'Assembly Simulation',
    description:
      'Full build sequences rehearsed in VR — torque order, fastener positions, and station handoffs.',
    accent: '#ED3123',
  },
  {
    icon: Settings,
    title: 'Machine Operation',
    description:
      'Learn machine setup, changeover, and operation with real HMI replicas and fault scenarios.',
    accent: '#2B4BFF',
  },
  {
    icon: ShieldAlert,
    title: 'Safety Training',
    description:
      'LOTO, PPE, emergency stops, and hazard recognition — practiced until they become reflex.',
    accent: '#ED3123',
  },
  {
    icon: Wrench,
    title: 'Maintenance Procedures',
    description:
      'Preventive and corrective maintenance on digital twins — with every step logged and timed.',
    accent: '#2B4BFF',
  },
  {
    icon: Search,
    title: 'Quality Inspection',
    description:
      'Train the eye — visual defect detection, measurement, and SPC decision-making under real conditions.',
    accent: '#ED3123',
  },
  {
    icon: Siren,
    title: 'Emergency Response',
    description:
      'Fire, chemical, and evacuation drills rehearsed safely, with response times measured per operator.',
    accent: '#2B4BFF',
  },
  {
    icon: ClipboardList,
    title: 'SOP Training',
    description:
      'Every standard work procedure — step-by-step, in-context, with competency checkpoints built in.',
    accent: '#ED3123',
  },
  {
    icon: Hammer,
    title: 'Tool Handling',
    description:
      'Correct tool selection, use, and torque application — trained without wasting a single fastener.',
    accent: '#2B4BFF',
  },
];

export function Modules() {
  return (
    <section id="modules" className="section-pad bg-cloud relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern-dark opacity-60" />

      <div className="container-max relative z-10">
        <Reveal className="max-w-3xl">
          <div className="eyebrow mb-5">XR Training Modules</div>
          <h2 className="font-serif font-semibold text-indigo text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-tight">
            Every procedure,
            <br />
            <span className="text-graphite">rehearsed to mastery.</span>
          </h2>
          <p className="mt-6 text-lg text-graphite leading-relaxed max-w-2xl">
            A modular library that mirrors your real production line. Deploy what
            you need — add modules as your training scope grows.
          </p>
        </Reveal>

        {/* Horizontal scroll cards */}
        <div className="mt-16 -mx-6 md:mx-0">
          <div className="flex gap-5 overflow-x-auto px-6 md:px-0 pb-6 snap-x snap-mandatory scrollbar-thin">
            {modules.map((m, i) => {
              const Icon = m.icon;
              const isVermillion = m.accent === '#ED3123';
              return (
                <Reveal
                  key={m.title}
                  delay={i * 60}
                  className="snap-start shrink-0"
                >
                  <div className="group w-[320px] md:w-[360px] bg-white rounded-2xl border border-line overflow-hidden card-hover hover:shadow-[0_20px_50px_-20px_rgba(27,31,53,0.2)] hover:border-vermillion/30">
                    {/* 3D-style illustration header */}
                    <div
                      className="relative h-44 overflow-hidden"
                      style={{
                        background: isVermillion
                          ? 'linear-gradient(135deg, #1B1F35 0%, #2A2F44 100%)'
                          : 'linear-gradient(135deg, #1B1F35 0%, #1F2647 100%)',
                      }}
                    >
                      {/* Decorative grid */}
                      <div className="absolute inset-0 grid-pattern opacity-30" />

                      {/* Isometric cube illustration */}
                      <svg
                        viewBox="0 0 200 160"
                        className="absolute inset-0 w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Isometric platform */}
                        <g transform="translate(100 80)">
                          <polygon
                            points="-50,20 0,45 50,20 0,-5"
                            fill="rgba(255,255,255,0.04)"
                            stroke={m.accent}
                            strokeWidth="1"
                            opacity="0.5"
                          />
                          <polygon
                            points="-50,20 0,45 50,20 50,-30 0,-55 -50,-30"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                          />
                          {/* Vertical lines */}
                          <line x1="-50" y1="20" x2="-50" y2="-30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                          <line x1="0" y1="45" x2="0" y2="-5" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                          <line x1="50" y1="20" x2="50" y2="-30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                          {/* Accent checkpoint */}
                          <circle cx="0" cy="-5" r="4" fill={m.accent} className="animate-pulse" />
                          <circle cx="0" cy="-5" r="10" fill="none" stroke={m.accent} strokeWidth="1" opacity="0.4" />
                        </g>
                      </svg>

                      {/* Floating icon */}
                      <div className="absolute top-5 right-5">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                          style={{ background: `${m.accent}20` }}
                        >
                          <Icon size={18} strokeWidth={1.75} style={{ color: m.accent }} />
                        </div>
                      </div>

                      {/* Module number */}
                      <div className="absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-mono text-white/40">
                        Module 0{i + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-serif font-semibold text-indigo text-xl mb-2">
                        {m.title}
                      </h3>
                      <p className="text-graphite text-sm leading-relaxed">
                        {m.description}
                      </p>
                      <div
                        className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-mono transition-colors"
                        style={{ color: m.accent }}
                      >
                        Explore module
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
