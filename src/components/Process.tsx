import { Reveal, CountUp } from './primitives';
import {
  Search,
  Boxes,
  Send,
  Gauge,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Analyze Current Training',
    description:
      'We map your existing Dojo curriculum, SOPs, and competency criteria — and identify where XR delivers the highest return.',
    tag: 'Phase 01',
  },
  {
    icon: Boxes,
    title: 'Build XR Modules',
    description:
      'Our team builds immersive modules from your real line data — digital twins, real procedures, real checkpoints.',
    tag: 'Phase 02',
  },
  {
    icon: Send,
    title: 'Deploy Across Plants',
    description:
      'Roll out to one line, one plant, or fifty. Cloud-based, multi-language, with SSO to your existing systems.',
    tag: 'Phase 03',
  },
  {
    icon: Gauge,
    title: 'Measure Competency',
    description:
      'Every run is scored. Every checkpoint is logged. Competency data flows to your dashboard and your LMS.',
    tag: 'Phase 04',
  },
  {
    icon: RefreshCw,
    title: 'Continuous Improvement',
    description:
      'Identify competency drift, update modules as procedures evolve, and re-baseline against new standards.',
    tag: 'Phase 05',
  },
];

const stats = [
  { value: 75, suffix: '%', label: 'Higher Knowledge Retention', sub: 'vs. classroom training' },
  { value: 4, suffix: 'x', label: 'Faster Learning', sub: 'than traditional methods' },
  { value: 60, suffix: '%', label: 'Reduced Training Cost', sub: 'across deployed plants' },
  { value: 40, suffix: '%', label: 'Faster Onboarding', sub: 'from hire to line-ready' },
];

export function Process() {
  return (
    <>
      {/* How It Works */}
      <section id="process" className="section-pad bg-indigo-900 noise relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        {/* Decorative ring */}
        <div className="absolute -right-60 top-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-[80px] border-vermillion/5 pointer-events-none" />

        <div className="container-max relative z-10">
          <Reveal className="max-w-3xl">
            <div className="eyebrow mb-5">How It Works</div>
            <h2 className="font-serif font-semibold text-white text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-tight">
              From analysis to mastery,
              <br />
              <span className="text-gradient">in five phases.</span>
            </h2>
            <p className="mt-6 text-lg text-white/60 leading-relaxed max-w-2xl">
              A structured engagement model that meets manufacturing leaders
              where they are — and takes them where they need to be.
            </p>
          </Reveal>

          {/* Timeline */}
          <div className="mt-20 relative">
            {/* Vertical line for mobile / horizontal for desktop */}
            <div className="absolute left-0 right-0 top-[60px] h-px bg-gradient-to-r from-vermillion/0 via-vermillion/40 to-vermillion/0 hidden lg:block" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Reveal
                    key={s.title}
                    delay={i * 120}
                    className="relative group"
                  >
                    {/* Node */}
                    <div className="flex items-center lg:flex-col lg:items-start gap-5 lg:gap-0">
                      <div className="relative shrink-0">
                        <div className="w-[120px] h-[120px] rounded-full border border-white/10 flex items-center justify-center bg-indigo-800/60 group-hover:border-vermillion/40 transition-colors duration-500">
                          <Icon
                            size={28}
                            strokeWidth={1.5}
                            className="text-white/70 group-hover:text-vermillion transition-colors duration-500"
                          />
                        </div>
                        {/* Vermillion checkpoint dot */}
                        <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-3 rounded-full bg-vermillion ring-4 ring-indigo-900 group-hover:scale-125 transition-transform duration-500" />
                      </div>

                      <div className="lg:mt-8 lg:pb-0">
                        <div className="font-mono text-[10px] uppercase tracking-mono text-vermillion mb-2">
                          {s.tag}
                        </div>
                        <h3 className="font-serif font-semibold text-white text-xl mb-3 leading-snug">
                          {s.title}
                        </h3>
                        <p className="text-white/50 text-sm leading-relaxed">
                          {s.description}
                        </p>
                      </div>
                    </div>

                    {/* Arrow between steps (desktop) */}
                    {i < steps.length - 1 && (
                      <div className="hidden lg:flex items-center justify-center mt-4">
                        <ArrowRight
                          size={16}
                          className="text-vermillion/30"
                        />
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why XR Works — Stats */}
      <section className="section-pad bg-white relative">
        <div className="container-max">
          <Reveal className="max-w-3xl">
            <div className="eyebrow mb-5">Why XR Works</div>
            <h2 className="font-serif font-semibold text-indigo text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-tight">
              The numbers speak.
              <br />
              <span className="text-graphite">The evidence is clear.</span>
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line rounded-2xl overflow-hidden border border-line">
            {stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 100}
                className="bg-white p-10 md:p-12 group hover:bg-cloud transition-colors duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-vermillion origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <div className="font-serif font-semibold text-indigo text-[clamp(3rem,5vw,4.5rem)] leading-none tracking-tight">
                  <CountUp value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-5 font-serif font-semibold text-indigo text-lg leading-snug">
                  {s.label}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-mono text-graphite">
                  {s.sub}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="mt-10">
            <p className="font-mono text-[10px] uppercase tracking-mono text-graphite max-w-2xl">
              * Based on aggregated data from Jukuto deployments across automotive,
              aerospace, and heavy engineering customers, 2024–2026.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
