import { useState } from 'react';
import { Reveal } from './primitives';
import { Mail, Phone, MapPin, Linkedin, Check, ArrowRight } from 'lucide-react';

const industries = [
  'Automotive',
  'Tier 1 Manufacturing',
  'Aerospace',
  'Electronics',
  'Heavy Engineering',
  'Industrial Equipment',
  'Other',
];

const companySizes = [
  '1–50',
  '51–200',
  '201–1000',
  '1001–5000',
  '5000+',
];

export function Contact() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    industry: '',
    size: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const update = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    try {
      const response = await fetch('https://formspree.io/f/mqpzblwy', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.target as HTMLFormElement),
      });

      if (!response.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-cloud border border-line rounded-lg px-4 py-3 text-sm text-indigo placeholder:text-graphite/50 focus:outline-none focus:border-vermillion focus:ring-1 focus:ring-vermillion transition-colors';
  const labelClass =
    'block font-mono text-[10px] uppercase tracking-mono text-graphite font-semibold mb-2';

  return (
    <section id="contact" className="section-pad bg-white relative">
      <div className="container-max">
        <Reveal className="max-w-3xl">
          <div className="eyebrow mb-5">Contact</div>
          <h2 className="font-serif font-semibold text-indigo text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-tight">
            Let's build your
            <br />
            <span className="text-graphite">digital Dojo.</span>
          </h2>
          <p className="mt-6 text-lg text-graphite leading-relaxed max-w-2xl">
            Tell us about your training challenge. We'll come back within one
            business day with a scoped pilot proposal.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Form */}
          <Reveal className="lg:col-span-3" delay={100}>
            {submitted ? (
              <div className="bg-cloud rounded-2xl border border-line p-12 md:p-16 flex flex-col items-center justify-center text-center min-h-[500px]">
                <div className="w-16 h-16 rounded-full bg-vermillion flex items-center justify-center mb-6">
                  <Check size={28} className="text-white" />
                </div>
                <h3 className="font-serif font-semibold text-indigo text-2xl mb-3">
                  Thank you, {form.name.split(' ')[0] || 'there'}.
                </h3>
                <p className="text-graphite max-w-md">
                  Your message is on its way. A Jukuto specialist will reach out
                  within one business day to scope your pilot.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: '',
                      company: '',
                      email: '',
                      phone: '',
                      industry: '',
                      size: '',
                      message: '',
                    });
                  }}
                  className="mt-8 font-mono text-[10px] uppercase tracking-mono text-vermillion hover:text-vermillion-700 transition-colors flex items-center gap-2"
                >
                  Send another message
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-cloud rounded-2xl border border-line p-8 md:p-10 space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass} htmlFor="name">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={inputClass}
                      placeholder="Ashish Tripathi"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="company">
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                      className={inputClass}
                      placeholder="Jukuto Industries"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass} htmlFor="email">
                      Business Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className={inputClass}
                      placeholder="ashish@company.com"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="phone">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className={inputClass}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass} htmlFor="industry">
                      Industry
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={form.industry}
                      onChange={(e) => update('industry', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select industry</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="size">
                      Company Size
                    </label>
                    <select
                      id="size"
                      name="size"
                      value={form.size}
                      onChange={(e) => update('size', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select size</option>
                      {companySizes.map((s) => (
                        <option key={s} value={s}>
                          {s} employees
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your training challenge — current Dojo process, number of operators, plants, and what you'd like to improve."
                  />
                </div>

                {error && (
                  <p className="text-sm text-vermillion">
                    Something went wrong sending your message. Please try again.
                  </p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <p className="font-mono text-[10px] uppercase tracking-mono text-graphite">
                    We reply within 1 business day
                  </p>
                  <button type="submit" disabled={submitting} className="btn-primary group disabled:opacity-60">
                    {submitting ? 'Sending…' : 'Send Message'}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </form>
            )}
          </Reveal>

          {/* Company info */}
          <Reveal className="lg:col-span-2" delay={200}>
            <div className="space-y-8">
              <div className="bg-indigo-900 rounded-2xl p-8 md:p-10 relative overflow-hidden noise">
                <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full border-[30px] border-vermillion/15 pointer-events-none" />
                <div className="font-mono text-[10px] uppercase tracking-mono text-vermillion mb-5 relative">
                  Company Information
                </div>
                <div className="space-y-5 relative">
                  <a
                    href="mailto:business.triptych@gmail.com"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-vermillion transition-colors duration-300">
                      <Mail size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-mono text-white/40 mb-1">
                        Email
                      </div>
                      <div className="text-white text-sm group-hover:text-vermillion transition-colors">
                        business.triptych@gmail.com
                      </div>
                    </div>
                  </a>

                  <a href="tel:+919876543210" className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-vermillion transition-colors duration-300">
                      <Phone size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-mono text-white/40 mb-1">
                        Phone
                      </div>
                      <div className="text-white text-sm group-hover:text-vermillion transition-colors">
                        +91 98765 43210
                      </div>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-mono text-white/40 mb-1">
                        Location
                      </div>
                      <div className="text-white text-sm leading-relaxed">
                        Pune, Maharashtra
                        <br />
                        India
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-vermillion transition-colors duration-300">
                      <Linkedin size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-mono text-white/40 mb-1">
                        LinkedIn
                      </div>
                      <div className="text-white text-sm group-hover:text-vermillion transition-colors">
                        linkedin.com/company/jukuto
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Quick stats card */}
              <div className="bg-cloud rounded-2xl border border-line p-8">
                <div className="font-mono text-[10px] uppercase tracking-mono text-vermillion mb-5">
                  What to expect
                </div>
                <ul className="space-y-4">
                  {[
                    'A scoped pilot proposal within 5 business days',
                    'A custom XR module built from your SOPs',
                    'Deployment plan for your first plant',
                    'Live demo with your real production data',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-vermillion flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} className="text-white" />
                      </div>
                      <span className="text-indigo text-sm leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
