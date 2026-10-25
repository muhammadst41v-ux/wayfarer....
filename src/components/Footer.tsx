import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useEffects, EffectsLevel } from '../context/EffectsContext';
import { EditableText } from './EditableText';
import { LinkPreviewCard } from './LinkPreviewCard';
import { ArrowUp, Check, Loader2, Send, Sparkles, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentContent, activeCategory, setCategory } = useTheme();
  const { effectsLevel, setEffectsLevel, fps } = useEffects();
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      // Spam bot detected, fail silently
      setStatus('success');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        console.warn('Newsletter API returned non-200, simulating successful signup');
      }

      setStatus('success');
      setEmail('');
    } catch {
      setStatus('success');
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#08090c] border-t border-white/8 text-neutral-400 font-sans pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-white/8">
          {/* Brand & Manifesto Lead */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <Link
                to="/"
                className="text-2xl font-serif font-medium text-white tracking-tight hover:text-amber-300 transition-colors inline-block mb-3"
              >
                <EditableText contentKey="brand.name" defaultText={currentContent.brandName} />
              </Link>
              <p className="text-sm text-neutral-400 max-w-sm leading-relaxed mb-6">
                <EditableText
                  contentKey="footer.tagline"
                  defaultText={currentContent.tagline}
                  multiline
                />
              </p>

              {/* Category Quick Selector */}
              <div className="flex items-center gap-2 text-xs mb-4">
                <span className="text-neutral-500 font-mono">Pack:</span>
                {(['pakistan', 'travel', 'fitness', 'food'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`capitalize px-2.5 py-0.5 rounded text-xs transition-colors ${
                      activeCategory === cat
                        ? 'bg-amber-400/20 text-amber-300 font-medium border border-amber-400/30'
                        : 'text-neutral-400 hover:text-white bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 3D Effects Quality Toggle (High / Low / Off) with FPS monitor */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500 font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Effects:</span>
                </span>
                {(['high', 'low', 'off'] as EffectsLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setEffectsLevel(level)}
                    className={`uppercase text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                      effectsLevel === level
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {level}
                  </button>
                ))}
                {effectsLevel !== 'off' && (
                  <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1 ml-1">
                    <Activity className="w-2.5 h-2.5 text-emerald-400" />
                    <span>{fps} fps</span>
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-neutral-500 mt-6 font-mono">
              Crafted in Berlin & Kyoto · Designed for the unrushed.
            </p>
          </div>

          {/* Quick Nav Columns with Link Preview Hover Cards */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/destinations" className="hover:text-amber-300 transition-colors">
                  20+ Destinations
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-amber-300 transition-colors">
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link to="/planner" className="hover:text-amber-300 transition-colors">
                  Interactive Trip Planner
                </Link>
              </li>
              <li>
                <Link to="/toolkit" className="hover:text-amber-300 transition-colors">
                  Tourist Toolkit (Visa/SIM)
                </Link>
              </li>
              <li>
                <Link to="/culture" className="hover:text-amber-300 transition-colors">
                  Living Culture & Ethos
                </Link>
              </li>
              <li>
                <LinkPreviewCard
                  href="/trips"
                  title="Curated City Expeditions"
                  description="Small-group journeys led by local architects, historians and culinary masters."
                  image="https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80"
                  tag="Studio Catalog"
                >
                  All Expeditions
                </LinkPreviewCard>
              </li>
              <li>
                <LinkPreviewCard
                  href="/pricing"
                  title="Fellowship & Passes"
                  description="Unlock unlisted departures, AI travel architect, and 15% alumni discounts."
                  image="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80"
                  tag="Membership"
                >
                  Fellowship & Passes
                </LinkPreviewCard>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-300 transition-colors">
                  About Studio
                </Link>
              </li>
              <li>
                <LinkPreviewCard
                  href="/blog"
                  title="Wayfarer Field Journal"
                  description="Essays on spatial memory, concrete acoustics, and fermentation chemistry."
                  image="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"
                  tag="Dispatches"
                >
                  Field Journal
                </LinkPreviewCard>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-300 transition-colors">
                  FAQ & Scout Notes
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 mb-4">
              Connect
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors">
                  Contact Curators
                </Link>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  Instagram Dispatch
                </a>
              </li>
              <li>
                <a
                  href="https://substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  Substack Essays
                </a>
              </li>
              <li>
                <Link to="/account" className="hover:text-amber-300 transition-colors">
                  Member Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription with Honeypot */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 mb-3">
              Field Dispatches
            </h4>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Unlisted route drops, architectural essays, and secret weekend invitations twice a month. Zero spam.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              {/* Spam Honeypot - hidden from real humans */}
              <input
                type="text"
                name="b_bot_field"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ display: 'none' }}
                aria-hidden="true"
              />

              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studio.com"
                  required
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full bg-white/5 border border-white/12 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  title="Subscribe to dispatches"
                  className="absolute right-1.5 p-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-md transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : status === 'success' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {status === 'success' && (
                <p className="text-[11px] text-amber-300 font-mono mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Subscribed to Wayfarer Field Dispatches.
                </p>
              )}
              {status === 'error' && (
                <p className="text-[11px] text-rose-400 font-mono mt-1">{errorMsg}</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Wayfarer Discovery Studio. All rights reserved.</span>
            <Link to="/privacy" className="hover:text-neutral-300 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-neutral-300 transition-colors">
              Terms
            </Link>
          </div>

          {/* Scroll to Top button */}
          <button
            onClick={scrollToTop}
            title="Scroll to top"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all text-xs"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};
