import { Logo } from './primitives';
import { Linkedin, Twitter, Github } from 'lucide-react';

const nav = [
  { label: 'Why Jukuto', href: '#why' },
  { label: 'Industries', href: '#industries' },
  { label: 'Modules', href: '#modules' },
  { label: 'Platform', href: '#platform' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

const legal = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Security', href: '#' },
  { label: 'Cookie Policy', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-ink noise relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="container-max relative z-10 px-6 md:px-10 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <Logo className="h-8 w-auto" variant="light" />
            <p className="mt-6 text-white/50 text-sm leading-relaxed max-w-sm">
              The digital evolution of the manufacturing Dojo — immersive XR
              training, built to be measured. Reliable. Precise. Modern. Classic.
            </p>
            <div className="mt-6 font-mono text-[10px] uppercase tracking-mono text-white/30">
              jukuto.xr@gmail.com · jukuto.in
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-mono text-vermillion mb-5">
              Navigation
            </div>
            <ul className="space-y-3">
              {nav.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-white/60 text-sm hover:text-white transition-colors duration-300"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <div className="font-mono text-[10px] uppercase tracking-mono text-vermillion mb-5">
              Legal
            </div>
            <ul className="space-y-3">
              {legal.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-white/60 text-sm hover:text-white transition-colors duration-300"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <div className="font-mono text-[10px] uppercase tracking-mono text-vermillion mb-5">
              Connect
            </div>
            <div className="flex gap-3">
              {[
                { icon: Linkedin, href: 'https://www.linkedin.com/company/jukuto', label: 'LinkedIn' },
                { icon: Twitter, href: 'https://www.twitter.com', label: 'Twitter' },
                { icon: Github, href: 'https://www.github.com', label: 'GitHub' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-vermillion hover:bg-vermillion transition-all duration-300"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-[10px] uppercase tracking-mono text-white/30">
            © {new Date().getFullYear()} Jukuto. All rights reserved.
          </div>
          <div className="font-mono text-[10px] uppercase tracking-mono text-white/30">
            Keep the Dojo. Prove the Result.
          </div>
        </div>
      </div>
    </footer>
  );
}
