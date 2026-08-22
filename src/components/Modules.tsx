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
    image: 'https://images.unsplash.com/photo-1717386255773-1e3037c81788?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    icon: Settings,
    title: 'Machine Operation',
    description:
      'Learn machine setup, changeover, and operation with real HMI replicas and fault scenarios.',
    accent: '#2B4BFF',
    image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    icon: ShieldAlert,
    title: 'Safety Training',
    description:
      'LOTO, PPE, emergency stops, and hazard recognition — practiced until they become reflex.',
    accent: '#ED3123',
    image: 'https://images.unsplash.com/photo-1528953030358-b0c7de371f1f?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    icon: Wrench,
    title: 'Maintenance Procedures',
    description:
      'Preventive and corrective maintenance on digital twins — with every step logged and timed.',
    accent: '#2B4BFF',
    image: 'https://images.unsplash.com/photo-1624027492684-327af1fb7559?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    icon: Search,
    title: 'Quality Inspection',
    description:
      'Train the eye — visual defect detection, measurement, and SPC decision-making under real conditions.',
    accent: '#ED3123',
    image: 'https://images.unsplash.com/photo-1700727448686-b314cb5f9948?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    icon: Siren,
    title: 'Emergency Response',
    description:
      'Fire, chemical, and evacuation drills rehearsed safely, with response times measured per operator.',
    accent: '#2B4BFF',
    image: 'https://images.unsplash.com/photo-1576707995936-a6cffe26ef7b?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    icon: ClipboardList,
    title: 'SOP Training',
    description:
      'Every standard work procedure — step-by-step, in-context, with competency checkpoints built in.',
    accent: '#ED3123',
    image: 'https://images.unsplash.com/photo-1758599668338-4c55a3bd0ce0?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    icon: Hammer,
    title: 'Tool Handling',
    description:
      'Correct tool selection, use, and torque application — trained without wasting a single fastener.',
    accent: '#2B4BFF',
    image: 'https://images.unsplash.com/photo-1631396327032-6f0c196973d4?auto=format&fit=crop&w=800&h=600&q=80',
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
                    {/* Photo header */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={m.image}
                        alt={m.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: isVermillion
                            ? 'linear-gradient(135deg, rgba(27,31,53,0.85) 0%, rgba(42,47,68,0.55) 100%)'
                            : 'linear-gradient(135deg, rgba(27,31,53,0.85) 0%, rgba(31,38,71,0.55) 100%)',
                        }}
                      />

                      {/* Decorative grid */}
                      <div className="absolute inset-0 grid-pattern opacity-20" />

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
