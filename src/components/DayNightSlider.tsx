import React, { useState, useRef, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

export const DayNightSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const dayImage =
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85'; // Daylight Tokyo/Kyoto temple
  const nightImage =
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=85'; // Night neon city twilight

  const handleMove = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <section className="relative py-28 px-6 sm:px-8 bg-[#0b0d10] text-white overflow-hidden border-t border-white/8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Dichotomy of Space
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-white mt-2 mb-3">
            Daylight vs Subterranean Night
          </h2>
          <p className="text-sm text-neutral-400">
            Drag the divider or use arrow keys to reveal how cities invert their soul once the sun drops.
          </p>
        </div>

        {/* Comparison Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="slider"
          aria-valuenow={Math.round(sliderPosition)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Day vs Night comparison slider"
          className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-white/15 cursor-ew-resize select-none focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {/* Night Image (Base Layer - Right Side) */}
          <img
            src={nightImage}
            alt="Nighttime Metropolis"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.9]"
            loading="lazy"
          />

          {/* Night Label */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-mono text-cyan-300 border border-cyan-400/30">
            <Moon className="w-3.5 h-3.5" />
            <span>23:00 Subterranean</span>
          </div>

          {/* Day Image (Clipped Layer - Left Side) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={dayImage}
              alt="Daylight Architecture"
              className="absolute inset-0 w-full h-full object-cover max-w-none filter brightness-[0.95]"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                height: '100%',
              }}
              loading="lazy"
            />
            {/* Day Label */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-mono text-amber-300 border border-amber-400/30">
              <Sun className="w-3.5 h-3.5" />
              <span>11:00 Architectural</span>
            </div>
          </div>

          {/* Dividing Vertical Line and Draggable Handle */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-neutral-900 border-2 border-white shadow-xl flex items-center justify-center pointer-events-auto cursor-ew-resize hover:scale-110 transition-transform"
            >
              <div className="flex items-center gap-0.5 text-white text-[10px] font-mono">
                <span>◀</span>
                <span>▶</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtitle instructions */}
        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>Kyoto Gion District & Neo-Tokyo Skyline</span>
          <span className="hidden sm:inline">Use Arrow keys ◄ ► when focused to slide</span>
        </div>
      </div>
    </section>
  );
};
