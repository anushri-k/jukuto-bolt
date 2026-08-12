import { useState } from 'react';
import { Reveal } from './primitives';
import { ArrowUpRight, Car, Factory, Plane, Cpu, HardHat, Wrench } from 'lucide-react';

const industries = [
  {
    icon: Car,
    name: 'Automotive',
    description:
      'From tier assembly to powertrain — train every station, every SOP, every safety protocol before the line moves.',
    image:
      'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    stat: '42% faster onboarding',
  },
  {
    icon: Factory,
    name: 'Tier 1 Manufacturing',
    description:
      'Supplier readiness at scale. Standardize training across plants and prove competency to every OEM you serve.',
    image:
      'https://images.pexels.com/photos/3827431/pexels-photo-3827431.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    stat: 'Zero line downtime',
  },
  {
    icon: Plane,
    name: 'Aerospace',
    description:
      'Precision procedures, safety-critical assemblies, and maintenance protocols — rehearsed to mastery in XR.',
    image:
      'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    stat: '100% audit traceability',
  },
  {
    icon: Cpu,
    name: 'Electronics',
    description:
      'Cleanroom protocols, ESD handling, and micro-assembly — trained without wasting a single component.',
    image:
      'https://images.pexels.com/photos/5083406/pexels-photo-5083406.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    stat: '60% reduced scrap',
  },
  {
    icon: HardHat,
    name: 'Heavy Engineering',
    description:
      'Lifting, rigging, confined space, and hazardous-environment procedures — rehearsed safely, measured precisely.',
    image:
      'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    stat: '75% higher retention',
  },
  {
    icon: Wrench,
    name: 'Industrial Equipment',
    description:
      'Complex maintenance and commissioning procedures — practiced on digital twins before the service call.',
    image:
      'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
    stat: '4x faster learning',
  },
];

export function Industries() {
  const [active, setActive] = useState(0);

  return (
    <section id="industries" className="section-pad bg-indigo-900 noise relative overflow-hidden">
      {/* Decorative vermillion ring */}
      <div className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full border-[60px] border-vermillion/10 pointer-events-none" />
      <div className="absolute -left-32 -bottom-32 w-[400px] h-[400px] rounded-full border-[40px] border-cobalt/10 pointer-events-none" />

      <div className="container-max relative z-10">
        <Reveal className="max-w-3xl">
          <div className="eyebrow mb-5">Industries</div>
          <h2 className="font-serif font-semibold text-white text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-tight">
            Built for the floor.
            <br />
            <span className="text-gradient">Proven across industries.</span>
          </h2>
          <p className="mt-6 text-lg text-white/60 leading-relaxed max-w-2xl">
            From automotive assembly to aerospace maintenance — Jukuto adapts to
            your processes, your SOPs, and your audit requirements.
          </p>
        </Reveal>

        {/* Interactive grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            const isActive = active === i;
            return (
              <Reveal
                key={ind.name}
                delay={i * 80}
                className="group"
              >
                <button
                  onMouseEnter={() => setActive(i)}
                  className="relative w-full text-left rounded-2xl overflow-hidden border border-white/10 bg-indigo-800/40 card-hover hover:border-vermillion/40 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] h-[420px] block"
                >
                  {/* Image */}
                  <div className="absolute inset-0">
                    <img
                      src={ind.image}
                      alt={ind.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-70"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/70 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-7">
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-lg glass flex items-center justify-center group-hover:bg-vermillion transition-colors duration-300">
                        <Icon
                          size={20}
                          strokeWidth={1.75}
                          className="text-white group-hover:text-white"
                        />
                      </div>
                      <ArrowUpRight
                        size={18}
                        className="text-white/30 group-hover:text-vermillion transition-colors duration-300"
                      />
                    </div>

                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-mono text-vermillion mb-3">
                        {ind.stat}
                      </div>
                      <h3 className="font-serif font-semibold text-white text-2xl mb-2">
                        {ind.name}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {ind.description}
                      </p>
                    </div>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-vermillion" />
                  )}
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
