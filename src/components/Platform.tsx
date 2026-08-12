import { Reveal } from './primitives';
import {
  Glasses,
  Smartphone,
  Layers,
  BarChart3,
  GraduationCap,
  Languages,
  BrainCircuit,
  Box,
  Lock,
  Cloud,
  LineChart,
  type LucideIcon,
} from 'lucide-react';

const features: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Glasses, title: 'VR Support', description: 'Full immersion for complex assembly and spatial procedures.' },
  { icon: Smartphone, title: 'AR Support', description: 'Overlay guidance on real equipment, on the real floor.' },
  { icon: Layers, title: 'MR Support', description: 'Blend physical and digital — interact with real tools in virtual space.' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Per-operator, per-module, per-plant competency analytics in real time.' },
  { icon: GraduationCap, title: 'LMS Integration', description: 'Connect to your existing LMS — SCORM, xAPI, and SSO ready.' },
  { icon: Languages, title: 'Multi-language', description: 'Train in 20+ languages with localized content and voice guidance.' },
  { icon: BrainCircuit, title: 'AI Assessment', description: 'Objective competency scoring — no trainer bias, no guesswork.' },
  { icon: Box, title: 'Digital Twin Support', description: 'Train on exact replicas of your machines, lines, and stations.' },
  { icon: Lock, title: 'Enterprise Security', description: 'SOC 2 Type II, ISO 27001, and GDPR compliant by design.' },
  { icon: Cloud, title: 'Cloud Deployment', description: 'Roll out across plants without on-prem hardware or IT overhead.' },
  { icon: LineChart, title: 'Performance Tracking', description: 'Cycle time, error rate, and competency drift — tracked continuously.' },
];

export function Platform() {
  return (
    <section id="platform" className="section-pad bg-white relative">
      <div className="container-max">
        <Reveal className="max-w-3xl">
          <div className="eyebrow mb-5">Platform Features</div>
          <h2 className="font-serif font-semibold text-indigo text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-tight">
            One platform.
            <br />
            <span className="text-graphite">Every layer of training.</span>
          </h2>
          <p className="mt-6 text-lg text-graphite leading-relaxed max-w-2xl">
            From the headset to the boardroom — Jukuto covers the full stack of
            immersive training infrastructure.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line rounded-2xl overflow-hidden border border-line">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal
                key={f.title}
                delay={(i % 4) * 80}
                className="group bg-white p-7 md:p-8 card-hover hover:bg-cloud relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-12 h-1 bg-vermillion origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <div className="w-11 h-11 rounded-lg bg-indigo-900 flex items-center justify-center mb-5 group-hover:bg-vermillion transition-colors duration-300">
                  <Icon size={20} strokeWidth={1.75} className="text-white" />
                </div>
                <h3 className="font-serif font-semibold text-indigo text-lg mb-2">
                  {f.title}
                </h3>
                <p className="text-graphite text-sm leading-relaxed">
                  {f.description}
                </p>
              </Reveal>
            );
          })}

          {/* CTA cell to fill the grid (11 items → 12 cells with CTA) */}
          <Reveal
            delay={80}
            className="bg-indigo-900 p-7 md:p-8 flex flex-col justify-between group hover:bg-indigo-800 transition-colors duration-300 cursor-pointer"
          >
            <div>
              <div className="font-mono text-[10px] uppercase tracking-mono text-vermillion mb-3">
                + More
              </div>
              <h3 className="font-serif font-semibold text-white text-lg mb-2">
                Custom Modules
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Build any procedure from your SOPs with our module studio.
              </p>
            </div>
            <a
              href="#contact"
              className="mt-5 font-mono text-[10px] uppercase tracking-mono text-white/70 group-hover:text-vermillion transition-colors flex items-center gap-2"
            >
              Talk to us
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
