import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Reveal — scroll-triggered fade/slide-in                             */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* useCountUp — animated number counter                                */
/* ------------------------------------------------------------------ */
export function useCountUp(target: number, duration = 2200, start = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, start]);

  return value;
}

/* ------------------------------------------------------------------ */
/* CountUp — component wrapper with in-view trigger                    */
/* ------------------------------------------------------------------ */
export function CountUp({
  value,
  suffix = '',
  prefix = '',
  duration = 2200,
  className = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [start, setStart] = useState(false);
  const count = useCountUp(value, duration, start);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStart(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Eyebrow — technical label                                          */
/* ------------------------------------------------------------------ */
export function Eyebrow({
  children,
  light = false,
  className = '',
}: {
  children: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`font-mono text-xs uppercase tracking-eyebrow font-semibold ${
        light ? 'text-vermillion' : 'text-vermillion'
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Logo — the Measured Ensō                                           */
/* ------------------------------------------------------------------ */
export function Logo({
  className = '',
  variant = 'light',
  showWord = true,
}: {
  className?: string;
  variant?: 'light' | 'dark';
  showWord?: boolean;
}) {
  const stroke = variant === 'light' ? '#FFFFFF' : '#1B1F35';
  const text = variant === 'light' ? '#FFFFFF' : '#1B1F35';
  return (
    <svg
      viewBox="0 0 440 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Jukuto"
    >
      <path
        d="M76.9 23.75 A 40 40 0 1 1 43.1 23.75"
        fill="none"
        stroke={stroke}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle cx="76.9" cy="23.75" r="7.5" fill="#ED3123" />
      {showWord && (
        <text
          x="146"
          y="61"
          dominantBaseline="central"
          fontFamily="Fraunces, Georgia, serif"
          fontWeight="600"
          fontSize="64"
          letterSpacing="0.5"
          fill={text}
        >
          Jukuto
        </text>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* CheckpointLine — the brand motif                                   */
/* ------------------------------------------------------------------ */
export function CheckpointLine({
  activeIndex = 3,
  total = 9,
  variant = 'dark',
  className = '',
}: {
  activeIndex?: number;
  total?: number;
  variant?: 'dark' | 'light';
  className?: string;
}) {
  const baseColor = variant === 'dark' ? '#1B1F35' : '#FFFFFF';
  const dimColor = variant === 'dark' ? '#B9C0CE' : 'rgba(255,255,255,0.3)';
  return (
    <svg
      viewBox={`0 0 ${total * 48} 60`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <g strokeLinecap="round">
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          return (
            <line
              key={i}
              x1={i * 48 + 20}
              y1={isActive ? 10 : 18}
              x2={i * 48 + 20}
              y2={isActive ? 50 : 42}
              stroke={isActive ? '#ED3123' : isPast ? baseColor : dimColor}
              strokeWidth={isActive ? 6 : 4}
            />
          );
        })}
      </g>
    </svg>
  );
}
