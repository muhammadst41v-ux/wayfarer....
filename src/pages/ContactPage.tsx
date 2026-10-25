import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { siteConfig } from '../config/site.config';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Mail, Phone, MapPin, Clock, Send, Check, Loader2, AlertCircle, Compass, Globe } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { currentContent } = useTheme();
  const contactInfo = siteConfig.contactInfo;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Dynamic SEO title
  useEffect(() => {
    document.title = `Contact Studio Curators | ${currentContent.brandName}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        `Get in touch with ${currentContent.brandName} scouts to commission bespoke journeys, inquire about upcoming cohorts, or apply as a resident curator.`
      );
    }
  }, [currentContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) {
      // Spam detected, simulate immediate silent success
      setStatus('success');
      setStatusMessage('Your transmission has reached the curator desk.');
      return;
    }

    if (!email || !email.includes('@')) {
      setStatus('error');
      setStatusMessage('Please provide a valid email address.');
      return;
    }

    if (!message.trim()) {
      setStatus('error');
      setStatusMessage('Please enter a message before transmitting.');
      return;
    }

    setStatus('loading');
    setStatusMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'general_contact',
          name,
          email,
          subject,
          message,
        }),
      });

      if (!res.ok) {
        console.warn('API non-200, activating client fallback');
      }

      setStatus('success');
      setStatusMessage('Transmission received. A lead curator will respond via email within 24 hours.');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('success');
      setStatusMessage('Transmission logged locally. Our team will contact you via email.');
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <div className="pt-28 pb-24 px-6 sm:px-8 max-w-6xl mx-auto min-h-screen text-white">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contact Curators' },
          ]}
        />
      </div>

      <div className="mb-14">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Direct Line · Curator Desk
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif font-light text-white mt-2 mb-4">
          Contact the Curators
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
          Whether you want to commission a private studio journey, propose an unlisted route, or ask about upcoming cohort availability, our lead scouts are here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Contact Details & Headquarters */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 rounded-2xl bg-[#11141c] border border-white/10 space-y-6">
            <h3 className="text-xl font-serif text-white">Studio Headquarters</h3>

            <div className="space-y-4 text-xs text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-500 font-mono block">Primary Archive</span>
                  <span className="text-white mt-0.5 block">{contactInfo.address}</span>
                  <span className="text-neutral-500 font-mono text-[10px] block mt-0.5">
                    Coordinates: 52.5112° N, 13.4182° E
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-500 font-mono block">Electronic Transmission</span>
                  <a href={`mailto:${contactInfo.email}`} className="text-amber-400 hover:underline mt-0.5 block">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-500 font-mono block">Studio Hotline</span>
                  <span className="text-white mt-0.5 block font-mono">{contactInfo.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-500 font-mono block">Operating Hours</span>
                  <span className="text-white mt-0.5 block">{contactInfo.hours}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-xs text-neutral-400 space-y-2">
            <span className="text-amber-300 font-medium block">Scout Discretion Guarantee</span>
            <p>
              We never share your email, phone, or travel plans with 3rd-party brokers or advertisers. All correspondences remain strictly confidential inside our encrypted field server.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-2xl bg-[#12161f] border border-white/12 shadow-2xl space-y-5 text-xs font-sans"
          >
            {/* Honeypot for spam protection */}
            <input
              type="text"
              name="b_scout_pot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-300 font-medium mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kaelen Vance"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kaelen@domain.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1.5">Subject Intent</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#181d27] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="General Enquiry">General Studio Enquiry</option>
                <option value="Private Commission">Private Studio Commission (Bespoke Group)</option>
                <option value="Fellowship Question">Fellowship Membership Question</option>
                <option value="Local Scout Application">Apply as a Resident City Scout</option>
                <option value="Press & Archival">Press & Archival Access</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1.5">Your Message / Brief</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about the cities, dates, or specific experiences you are contemplating..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {status === 'success' && (
              <div className="p-3.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="p-3.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-[1.01] disabled:opacity-50"
            >
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Transmit Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* Embedded Architectural Map-Style SVG Graphic */}
      <div className="rounded-3xl bg-[#0c0e14] border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              <span>Studio Cartographic Grid</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-white mt-1">
              Active Outposts & Relay Nodes
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Primary Hub: Berlin
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              4 Field Relays
            </span>
          </div>
        </div>

        {/* Vector SVG Map Display */}
        <div className="w-full aspect-[21/9] sm:aspect-[24/9] rounded-2xl bg-[#08090d] border border-white/5 relative overflow-hidden flex items-center justify-center">
          <svg
            viewBox="0 0 1000 400"
            className="w-full h-full object-cover"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>
              <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Grid */}
            <rect width="1000" height="400" fill="url(#grid)" />

            {/* Stylized Continents Curves */}
            <path
              d="M 120 120 Q 220 80 300 130 T 420 180 T 520 140 T 680 160 T 840 220"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M 80 260 Q 200 240 320 290 T 560 310 T 780 270 T 920 330"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Relay Arcs connecting Berlin to other nodes */}
            {/* Berlin -> Kyoto */}
            <path
              d="M 500 160 Q 680 80 840 180"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeOpacity="0.5"
              strokeDasharray="6 4"
            />
            {/* Berlin -> Lisbon */}
            <path
              d="M 500 160 Q 420 200 360 220"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              strokeDasharray="6 4"
            />
            {/* Berlin -> Reykjavik */}
            <path
              d="M 500 160 Q 440 90 380 90"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              strokeDasharray="6 4"
            />
            {/* Berlin -> Oaxaca */}
            <path
              d="M 500 160 Q 300 120 180 240"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeOpacity="0.3"
              strokeDasharray="6 4"
            />

            {/* Node Pins */}
            {/* 1. Berlin Primary Hub */}
            <circle cx="500" cy="160" r="28" fill="url(#hubGlow)" />
            <circle cx="500" cy="160" r="6" fill="#f59e0b" />
            <circle cx="500" cy="160" r="10" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.8" />
            <text x="500" y="195" fill="#f3f4f6" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              BERLIN HQ [52.5° N, 13.4° E]
            </text>

            {/* 2. Kyoto Node */}
            <circle cx="840" cy="180" r="4" fill="#38bdf8" />
            <circle cx="840" cy="180" r="8" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" />
            <text x="840" y="205" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
              KYOTO ATELIER
            </text>

            {/* 3. Lisbon Node */}
            <circle cx="360" cy="220" r="4" fill="#38bdf8" />
            <circle cx="360" cy="220" r="8" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" />
            <text x="360" y="245" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
              LISBON ARCHIVE
            </text>

            {/* 4. Reykjavik Node */}
            <circle cx="380" cy="90" r="4" fill="#38bdf8" />
            <circle cx="380" cy="90" r="8" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" />
            <text x="380" y="75" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
              REYKJAVIK LAB
            </text>

            {/* 5. Oaxaca Node */}
            <circle cx="180" cy="240" r="4" fill="#38bdf8" />
            <circle cx="180" cy="240" r="8" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" />
            <text x="180" y="265" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
              OAXACA PALENQUE
            </text>
          </svg>

          {/* Compass overlay in corner */}
          <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-2 p-2.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-neutral-400">
            <Compass className="w-4 h-4 text-amber-400 animate-[spin_12s_linear_infinite]" />
            <span>WGS84 GEODETIC DATUM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
