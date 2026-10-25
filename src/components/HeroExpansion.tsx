import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { LiquidButton } from './LiquidButton';
import { EditableText } from './EditableText';
import { SmartImage } from './SmartImage';

export const HeroExpansion: React.FC = () => {
  const { currentContent } = useTheme();
  const hero = currentContent.hero;
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 500;
      setScrollProgress(Math.min(1, Math.max(0, scrollY / maxScroll)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scale from 85% to 100% on scroll
  const scale = 0.88 + scrollProgress * 0.12;
  const borderRadius = 28 - scrollProgress * 28;

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden bg-neutral-950">
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-6 text-xs font-mono tracking-widest uppercase text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <EditableText contentKey="hero.eyebrow" defaultText={hero.eyebrow} />
        </div>

        <h1
          style={{ textWrap: 'balance' }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-white mb-6 leading-[1.08]"
        >
          <EditableText contentKey="hero.title" defaultText={hero.title} />
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-8 font-sans leading-relaxed">
          <EditableText contentKey="hero.subtitle" defaultText={hero.subtitle} multiline />
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <LiquidButton size="lg" asAnchor href={hero.primaryCta.href} variant="liquid">
            <EditableText contentKey="hero.primaryCta.text" defaultText={hero.primaryCta.text} />
          </LiquidButton>
          <LiquidButton size="lg" asAnchor href={hero.secondaryCta.href} variant="outline">
            <EditableText contentKey="hero.secondaryCta.text" defaultText={hero.secondaryCta.text} />
          </LiquidButton>
        </div>
      </div>

      {/* Expanding Visual Canvas */}
      <div
        className="w-full max-w-6xl aspect-[16/9] sm:aspect-[21/9] overflow-hidden shadow-2xl border border-white/10 transition-transform duration-300 ease-out relative"
        style={{
          transform: `scale(${scale})`,
          borderRadius: `${borderRadius}px`,
        }}
      >
        <SmartImage
          src={hero.posterUrl}
          destinationSlug="hunza"
          placeName="Hunza Valley, Pakistan"
          alt="Wayfarer Pakistan Landscape"
          aspectRatio="21/9"
          className="w-full h-full object-cover filter brightness-[0.78]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Proof strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10 w-full max-w-4xl text-center">
        {hero.stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="text-xl font-serif text-amber-300 tabular-nums">{stat.value}</span>
            <span className="text-xs text-neutral-400 font-sans mt-0.5">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
