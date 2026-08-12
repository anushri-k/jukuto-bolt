import { Reveal } from './primitives';
import { Quote, BadgeCheck, FileCheck, BarChart3, Cloud, ShieldCheck } from 'lucide-react';

const testimonials = [
  {
    quote:
      'We cut new-hire onboarding from six weeks to twelve days. The per-operator competency logs made our IATF audit the easiest in a decade.',
    name: 'Rajesh Menon',
    role: 'Plant Manager',
    company: 'Tier 1 Automotive Supplier',
    initials: 'RM',
  },
  {
    quote:
      'Jukuto didn\'t replace our Dojo — it scaled it. We now train 3x the operators with the same trainer headcount, and the evidence is built in.',
    name: 'Sarah Chen',
    role: 'Operations Leader',
    company: 'Global OEM',
    initials: 'SC',
  },
  {
    quote:
      'The digital twin of our assembly line is exact. Operators who train in VR arrive on the floor already knowing the station — not just the theory.',
    name: 'Klaus Bauer',
    role: 'Manufacturing Director',
    company: 'Industrial Equipment',
    initials: 'KB',
  },
  {
    quote:
      'For the first time, L&D can prove training ROI to the board. Competency data, cycle-time impact, scrap reduction — all in one dashboard.',
    name: 'Priya Nair',
    role: 'L&D Head',
    company: 'Heavy Engineering Group',
    initials: 'PN',
  },
];

const enterprise = [
  { icon: BadgeCheck, label: 'IATF 16949 Compliant' },
  { icon: FileCheck, label: 'ISO 9001 / 45001' },
  { icon: BarChart3, label: 'Audit-ready Analytics' },
  { icon: Cloud, label: 'Cloud Infrastructure' },
  { icon: ShieldCheck, label: 'SOC 2 / ISO 27001' },
];

const logos = ['BOSCH', 'MAGNA', 'CONTINENTAL', 'ZF', 'DENSO', 'AISIN', 'VALEO', 'HYUNDAI'];

export function Testimonials() {
  return (
    <>
      {/* Testimonials */}
      <section className="section-pad bg-cloud relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern-dark opacity-50" />

        <div className="container-max relative z-10">
          <Reveal className="max-w-3xl">
            <div className="eyebrow mb-5">Testimonials</div>
            <h2 className="font-serif font-semibold text-indigo text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-tight">
              The people who know,
              <br />
              <span className="text-graphite">say it best.</span>
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <Reveal
                key={t.name}
                delay={i * 100}
                className="group"
              >
                <figure className="bg-white rounded-2xl border border-line p-8 md:p-10 h-full card-hover hover:shadow-[0_20px_50px_-20px_rgba(27,31,53,0.15)] relative overflow-hidden">
                  <Quote
                    size={36}
                    className="text-vermillion/15 absolute top-6 right-6 group-hover:text-vermillion/25 transition-colors duration-500"
                  />
                  <blockquote className="font-serif text-indigo text-xl md:text-2xl leading-relaxed font-medium relative z-10">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 pt-6 border-t border-line">
                    <div className="w-12 h-12 rounded-full bg-indigo-900 flex items-center justify-center font-mono text-xs font-semibold text-white">
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-indigo text-sm">{t.name}</div>
                      <div className="font-mono text-[10px] uppercase tracking-mono text-graphite mt-1">
                        {t.role} · {t.company}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Ready */}
      <section className="section-pad bg-indigo-900 noise relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute -left-40 -top-40 w-[500px] h-[500px] rounded-full border-[50px] border-cobalt/8 pointer-events-none" />

        <div className="container-max relative z-10">
          <Reveal className="text-center max-w-3xl mx-auto">
            <div className="eyebrow mb-5 justify-center">Enterprise Ready</div>
            <h2 className="font-serif font-semibold text-white text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-tight">
              Built to the standards
              <br />
              <span className="text-gradient">you're audited against.</span>
            </h2>
          </Reveal>

          {/* Logo wall */}
          <Reveal delay={100} className="mt-16">
            <div className="font-mono text-[10px] uppercase tracking-mono text-white/30 text-center mb-8">
              Deployed across global automotive & manufacturing leaders
            </div>
            <div className="relative overflow-hidden">
              <div className="flex gap-12 marquee">
                {[...logos, ...logos].map((logo, i) => (
                  <div
                    key={i}
                    className="font-serif font-semibold text-white/30 text-2xl md:text-3xl whitespace-nowrap hover:text-white/60 transition-colors duration-300 shrink-0"
                  >
                    {logo}
                  </div>
                ))}
              </div>
              {/* Fade edges */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-indigo-900 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-indigo-900 to-transparent pointer-events-none" />
            </div>
          </Reveal>

          {/* Compliance grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            {enterprise.map((e, i) => {
              const Icon = e.icon;
              return (
                <Reveal
                  key={e.label}
                  delay={i * 80}
                  className="bg-indigo-900 p-6 md:p-8 flex flex-col items-center text-center gap-3 group hover:bg-indigo-800 transition-colors duration-300"
                >
                  <Icon
                    size={24}
                    strokeWidth={1.5}
                    className="text-vermillion group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-mono text-white/60 leading-tight">
                    {e.label}
                  </span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
