import { Reveal } from './primitives';
import { BadgeCheck, FileCheck, BarChart3, Cloud, ShieldCheck } from 'lucide-react';

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
