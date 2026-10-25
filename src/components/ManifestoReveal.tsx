import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { EditableText } from './EditableText';

export const ManifestoReveal: React.FC = () => {
  const { currentContent } = useTheme();
  const manifesto = currentContent.manifesto;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress while container traverses viewport
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.15;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalWords = manifesto.words.length;
  const activeWordCount = Math.floor(scrollProgress * (totalWords + 4));

  return (
    <section
      id="manifesto-section"
      ref={containerRef}
      className="relative py-28 md:py-36 bg-[#0b0d10] border-t border-b border-white/8 text-white px-6 sm:px-8 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-[1px] w-8 bg-amber-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            <EditableText contentKey="manifesto.lead" defaultText={manifesto.lead} />
          </span>
        </div>

        {/* Word-by-Word Reveal */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-light leading-[1.35] tracking-tight mb-10 select-none">
          {manifesto.words.map((word, index) => {
            const isRevealed = index < activeWordCount;
            return (
              <span
                key={index}
                className={`inline-block mr-[0.28em] transition-all duration-300 ${
                  isRevealed
                    ? 'text-white opacity-100 translate-y-0 scale-100'
                    : 'text-neutral-700 opacity-25 translate-y-1 scale-[0.98]'
                }`}
              >
                {word}
              </span>
            );
          })}
        </h2>

        {/* Attribution */}
        <div className="flex items-center gap-4 pt-6 border-t border-white/10 text-xs font-sans text-neutral-400">
          <div>
            <div className="text-sm font-medium text-neutral-200">
              <EditableText contentKey="manifesto.author" defaultText={manifesto.author} />
            </div>
            <div className="text-neutral-500">
              <EditableText contentKey="manifesto.authorRole" defaultText={manifesto.authorRole} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
