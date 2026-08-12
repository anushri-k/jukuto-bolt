import { Reveal } from './primitives';
import {
  GraduationCap,
  Zap,
  TrendingDown,
  ShieldOff,
  ClipboardCheck,
  Building2,
} from 'lucide-react';

const cards = [
  {
    icon: GraduationCap,
    title: 'Digital Dojo Philosophy',
    description:
      'We preserve the master-apprentice method — training to mastery before touching a real part — and add the one thing the physical Dojo never could: measurable proof.',
    accent: 'vermillion',
  },
  {
    icon: Zap,
    title: 'Faster Workforce Readiness',
    description:
      'Operators reach line-ready competence in days, not weeks. Repetition without risk, on demand, across every shift and every site.',
    accent: 'cobalt',
  },
  {
    icon: TrendingDown,
    title: 'Reduced Training Cost',
    description:
      'Zero scrapped parts. Zero blocked stations. Zero travel for trainers. One module trains thousands, with per-operator evidence built in.',
    accent: 'vermillion',
  },
  {
    icon: ShieldOff,
    title: 'Zero Production Downtime',
    description:
      'Training happens off-line, in XR. The real line keeps running. No station idle time, no material waste, no scheduling conflicts.',
    accent: 'cobalt',
  },
  {
    icon: ClipboardCheck,
    title: 'Audit-ready Competency Records',
    description:
      'Every run is logged. Every checkpoint is timestamped. Hand your IATF auditor per-operator evidence a physical Dojo cannot produce.',
    accent: 'vermillion',
  },
  {
    icon: Building2,
    title: 'Enterprise Scale Deployment',
    description:
      'Roll out across plants, regions, and languages from a single cloud platform. Standardize the method. Localize the content.',
    accent: 'cobalt',
  },
];

export function WhyJukuto() {
  return (
    <section id="why" className="section-pad bg-white relative">
      <div className="container-max">
        <Reveal className="max-w-3xl">
          <div className="eyebrow mb-5">Why Jukuto</div>
          <h2 className="font-serif font-semibold text-indigo text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-tight">
            The manufacturing Dojo,
            <br />
            <span className="text-graphite">re-engineered for proof.</span>
          </h2>
          <p className="mt-6 text-lg text-graphite leading-relaxed max-w-2xl">
            Six principles that make Jukuto the credible choice for OEM executives,
            plant managers, and industrial training leaders.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line rounded-2xl overflow-hidden border border-line">
          {cards.map((c, i) => {
            const Icon = c.icon;
            const isVermillion = c.accent === 'vermillion';
            return (
              <Reveal
                key={c.title}
                delay={i * 80}
                className="group bg-white p-8 md:p-10 card-hover hover:shadow-none relative overflow-hidden"
              >
                {/* Hover accent bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${
                    isVermillion ? 'bg-vermillion' : 'bg-cobalt'
                  }`}
                />
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300 ${
                    isVermillion
                      ? 'bg-vermillion-50 text-vermillion group-hover:bg-vermillion group-hover:text-white'
                      : 'bg-cobalt-50 text-cobalt group-hover:bg-cobalt group-hover:text-white'
                  }`}
                >
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="font-serif font-semibold text-indigo text-xl mb-3 leading-snug">
                  {c.title}
                </h3>
                <p className="text-graphite text-[15px] leading-relaxed">
                  {c.description}
                </p>
                <div className="mt-6 font-mono text-[10px] uppercase tracking-mono text-indigo-200 group-hover:text-vermillion transition-colors">
                  0{i + 1} / 06
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
