import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Star, Quote } from 'lucide-react';

export const TestimonialColumns: React.FC = () => {
  const { currentContent } = useTheme();
  const testimonials = currentContent.testimonials;
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  // Split testimonials into two columns
  const col1 = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const col2 = testimonials.slice(Math.ceil(testimonials.length / 2));

  // Duplicate for seamless infinite loop
  const loopCol1 = [...col1, ...col1];
  const loopCol2 = [...col2, ...col2];

  return (
    <section className="relative py-28 px-6 sm:px-8 bg-[#090b0e] text-white overflow-hidden border-t border-white/8">
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Explorer Testimonials
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-light text-white mt-2 mb-4">
          Voices from the Field
        </h2>
        <p className="text-sm text-neutral-400 max-w-xl mx-auto">
          Unfiltered reflections from researchers, designers, and curious minds who have traveled with Wayfarer.
        </p>
      </div>

      {reducedMotion ? (
        // Static Grid fallback for reduced motion
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-[#12161f] border border-white/10 shadow-lg text-left"
            >
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-sans">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-sm font-medium text-white">{t.name}</h4>
                  <p className="text-xs text-neutral-500">{t.role} · {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Auto-scrolling Columns with pause on hover
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative max-w-5xl mx-auto h-[480px] overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
        >
          {/* Column 1 - scrolls upward */}
          <div
            className={`flex flex-col gap-6 ${isPaused ? '' : 'animate-scroll-up'}`}
            style={{
              animation: isPaused ? 'none' : 'scrollUp 28s linear infinite',
            }}
          >
            {loopCol1.map((t, idx) => (
              <div
                key={`${t.id}-${idx}`}
                className="p-6 rounded-2xl bg-[#12161f] border border-white/10 shadow-lg text-left transition-all hover:border-amber-400/40"
              >
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-sans">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  <div>
                    <h4 className="text-sm font-medium text-white">{t.name}</h4>
                    <p className="text-xs text-neutral-500">{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Column 2 - scrolls upward with slight offset or inverted */}
          <div
            className={`hidden md:flex flex-col gap-6 ${isPaused ? '' : 'animate-scroll-up-delayed'}`}
            style={{
              animation: isPaused ? 'none' : 'scrollUp 34s linear infinite',
            }}
          >
            {loopCol2.map((t, idx) => (
              <div
                key={`${t.id}-${idx}`}
                className="p-6 rounded-2xl bg-[#12161f] border border-white/10 shadow-lg text-left transition-all hover:border-amber-400/40"
              >
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-sans">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  <div>
                    <h4 className="text-sm font-medium text-white">{t.name}</h4>
                    <p className="text-xs text-neutral-500">{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keyframe animation styling */}
      <style>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </section>
  );
};
