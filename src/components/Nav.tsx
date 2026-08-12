import { useEffect, useState } from 'react';
import { Logo } from './primitives';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Why Jukuto', href: '#why' },
  { label: 'Industries', href: '#industries' },
  { label: 'Modules', href: '#modules' },
  { label: 'Platform', href: '#platform' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-indigo-900/80 backdrop-blur-xl border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="container-max px-6 md:px-10 lg:px-16 flex items-center justify-between">
        <a href="#top" className="flex items-center" aria-label="Jukuto home">
          <Logo className="h-7 md:h-8 w-auto" variant="light" />
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-mono text-white/70 hover:text-white transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href="#contact"
            className="font-semibold text-sm text-white/80 hover:text-white transition-colors"
          >
            Sign in
          </a>
          <a href="#contact" className="btn-primary">
            Book a Demo
          </a>
        </div>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-6 bg-indigo-900/95 backdrop-blur-xl border-t border-white/10 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-mono text-sm uppercase tracking-mono text-white/80 hover:text-vermillion transition-colors py-2"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn-primary mt-2 self-start"
          >
            Book a Demo
          </a>
        </div>
      </div>
    </header>
  );
}
