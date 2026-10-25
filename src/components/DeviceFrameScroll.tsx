import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { MapPin, Sparkles, Clock, Compass, Shield, ArrowRight } from 'lucide-react';
import { SmartImage } from './SmartImage';

export const DeviceFrameScroll: React.FC = () => {
  const { currentContent } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When the top of container enters viewport until it's centered
      const start = windowHeight * 0.9;
      const end = windowHeight * 0.25;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3D rotation calculation: begins tilted at 18deg, flattens to 0deg
  const rotateX = 18 * (1 - scrollProgress);
  const scale = 0.9 + 0.1 * scrollProgress;
  const shadowOpacity = 0.2 + 0.3 * scrollProgress;

  const sampleTrip = currentContent.items[0];

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32 px-6 sm:px-8 bg-[#0b0d10] overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <div className="max-w-6xl mx-auto text-center mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Curator Interface
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-light text-white mt-2 mb-4">
          The Field Architect
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
          Every Wayfarer journey arrives with an encrypted digital field dossier, live coordinate bookmarks, and direct contact with local curators.
        </p>
      </div>

      {/* Tilted 3D Device Frame */}
      <div
        className="max-w-5xl mx-auto rounded-2xl border border-white/15 bg-[#12161f] shadow-2xl overflow-hidden transition-transform duration-100 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) scale(${scale})`,
          boxShadow: `0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, ${shadowOpacity * 0.15})`,
        }}
      >
        {/* Mock Browser/App Header */}
        <div className="px-5 py-3.5 bg-[#0f1218] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 font-mono text-[11px] text-neutral-400 hidden sm:inline">
              wayfarer-dossier://{sampleTrip.city.toLowerCase()}-secret-access
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Alumni Key Verified</span>
          </div>
        </div>

        {/* Mock Dossier Dashboard Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-neutral-200">
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{sampleTrip.city}, {sampleTrip.country}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-white hover:text-amber-300 transition-colors mb-3">
                <Link to={`/trips/${sampleTrip.slug}`}>
                  {sampleTrip.title}
                </Link>
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                {sampleTrip.tagline}
              </p>

              <div className="space-y-3 border-t border-white/10 pt-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Group Size</span>
                  <span className="font-mono text-neutral-200">{sampleTrip.groupSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Duration</span>
                  <span className="font-mono text-neutral-200">{sampleTrip.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Vibe Signature</span>
                  <span className="text-amber-300 font-mono">{sampleTrip.vibe}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">Member Price</span>
                <span className="text-xl font-serif text-white tabular-nums">${sampleTrip.price}</span>
              </div>
              <Link
                to={`/trips/${sampleTrip.slug}`}
                className="px-3.5 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs rounded-lg font-mono flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>View Full Dossier</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col gap-4">
            <Link
              to={`/trips/${sampleTrip.slug}`}
              className="relative rounded-xl overflow-hidden aspect-[16/9] border border-white/10 group block"
            >
              <SmartImage
                src={sampleTrip.featuredImage}
                fallbackUrls={sampleTrip.fallbackUrls}
                placeName={sampleTrip.title}
                alt={sampleTrip.title}
                aspectRatio="16/9"
                className="w-full h-full object-cover filter brightness-[0.82] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-mono text-amber-300 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Day 2: Restricted Vault Access
              </div>
            </Link>

            {/* Quick mini-itinerary preview inside device */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <span className="text-neutral-500 text-[10px] font-mono block">09:30 CET</span>
                <span className="text-white font-medium block truncate">Subterranean descent</span>
                <span className="text-neutral-400 text-[11px] mt-1 block">Private historian guide</span>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <span className="text-neutral-500 text-[10px] font-mono block">16:00 CET</span>
                <span className="text-white font-medium block truncate">Modular sound studio</span>
                <span className="text-neutral-400 text-[11px] mt-1 block">Analog synth workshop</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
