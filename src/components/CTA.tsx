import { Reveal } from './primitives';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="relative bg-vermillion overflow-hidden noise">
      {/* Decorative ring */}
      <div className="absolute -right-40 -top-60 w-[700px] h-[700px] rounded-full border-[80px] border-white/10 pointer-events-none" />
      <div className="absolute -left-32 -bottom-32 w-[400px] h-[400px] rounded-full border-[40px] border-white/5 pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="container-max relative z-10 px-6 md:px-10 lg:px-16 py-24 md:py-36">
        <Reveal className="max-w-4xl">
          <div className="font-mono text-xs uppercase tracking-eyebrow text-white/70 font-semibold mb-6">
            The Final Step
          </div>
          <h2 className="font-serif font-semibold text-white text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] tracking-tight">
            Train to Mastery.
            <br />
            Measure Every Skill.
          </h2>
          <p className="mt-8 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            See how Jukuto can deploy across your plants in weeks — not quarters.
            Book a pilot and we'll build a module from your own SOPs.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 bg-white text-vermillion font-semibold text-sm px-8 py-4 rounded-md transition-all duration-300 hover:bg-indigo-900 hover:text-white hover:-translate-y-0.5"
            >
              Book a Demo
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
            <a
              href="#process"
              className="inline-flex items-center gap-2 bg-transparent border border-white/30 text-white font-semibold text-sm px-8 py-4 rounded-md transition-all duration-300 hover:border-white hover:bg-white/10 hover:-translate-y-0.5"
            >
              See the Process
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
