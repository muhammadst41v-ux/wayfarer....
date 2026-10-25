import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, ChevronRight, Maximize2, X, Box, Layers, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SmartImage } from './SmartImage';

export const LensGallery: React.FC = () => {
  const { currentContent } = useTheme();
  const trips = currentContent.items;

  // Curated imagery from expeditions
  const galleryImages = trips.flatMap((t) =>
    t.gallery.map((url, i) => ({
      url,
      caption: `${t.title} · ${t.city}`,
      tag: t.category,
      tripSlug: t.slug,
      city: t.city,
      fallbackUrls: t.fallbackUrls,
    }))
  ).slice(0, 8);

  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [is3DMode, setIs3DMode] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setIsReducedMotion(true);
      setIs3DMode(false);
    }
  }, []);

  const total = galleryImages.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape' && fullscreenImage) setFullscreenImage(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 40) nextSlide();
    if (diff < -40) prevSlide();
    setTouchStart(null);
  };

  return (
    <section
      className="relative py-28 px-6 sm:px-8 bg-[#080a0d] text-white overflow-hidden border-t border-white/8 select-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Expedition visual archive"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Visual Spatial Archive
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10">
                {is3DMode ? '3D Cylinder Perspective' : '2D Optical Lens'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-white">
              Curated Field Gallery
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* 3D vs 2D Mode Switcher */}
            {!isReducedMotion && (
              <button
                onClick={() => setIs3DMode(!is3DMode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 border border-white/10 transition-colors"
                title="Toggle between 3D Spatial Carousel and 2D Lens View"
              >
                {is3DMode ? (
                  <>
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Switch to 2D</span>
                  </>
                ) : (
                  <>
                    <Box className="w-3.5 h-3.5 text-amber-400" />
                    <span>Switch to 3D</span>
                  </>
                )}
              </button>
            )}

            <span className="text-xs font-mono text-neutral-400 mr-1">
              {activeIndex + 1} / {total}
            </span>

            <button
              onClick={prevSlide}
              aria-label="Previous image"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next image"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MODE A: 3D CYLINDER PERSPECTIVE CAROUSEL */}
        {/* ------------------------------------------------------------- */}
        {is3DMode && !isReducedMotion ? (
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full h-[360px] sm:h-[480px] overflow-hidden flex items-center justify-center [perspective:1200px]"
          >
            <div className="relative w-full max-w-lg h-[260px] sm:h-[340px] [transform-style:preserve-3d]">
              {galleryImages.map((img, idx) => {
                // Calculate distance in indices from active
                let offset = idx - activeIndex;
                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                const isCenter = offset === 0;
                const isAdjacent = Math.abs(offset) <= 2;

                if (!isAdjacent) return null;

                // 3D parameters
                const rotateY = offset * 36; // degrees
                const translateX = offset * 220; // px
                const translateZ = isCenter ? 0 : -Math.abs(offset) * 160; // px depth
                const opacity = isCenter ? 1 : Math.max(0.2, 0.85 - Math.abs(offset) * 0.35);
                const scale = isCenter ? 1 : 0.85;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!isCenter) setActiveIndex(idx);
                    }}
                    style={{
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity,
                      zIndex: 20 - Math.abs(offset),
                    }}
                    className={`absolute inset-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border transition-all duration-500 ease-out cursor-pointer ${
                      isCenter
                        ? 'border-amber-400/80 ring-2 ring-amber-400/30'
                        : 'border-white/10 hover:border-white/30 filter brightness-[0.7]'
                    }`}
                  >
                    <SmartImage
                      src={img.url}
                      fallbackUrls={img.fallbackUrls}
                      placeName={img.city}
                      alt={img.caption}
                      crossOrigin="anonymous"
                      aspectRatio="16/10"
                      className="w-full h-full object-cover filter brightness-[0.88]"
                    />

                    {/* Gradient Overlay & Info for active card */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-amber-300 tracking-wider block">
                            {img.tag} · {img.city}
                          </span>
                          <h4 className="text-sm sm:text-base font-serif text-white line-clamp-1">
                            {img.caption}
                          </h4>
                        </div>
                        {isCenter && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFullscreenImage(img.url);
                            }}
                            title="Expand Fullscreen"
                            className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-colors"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* MODE B: 2D OPTICAL LENS VIEWPORT (REDUCED MOTION / 2D MODE)   */
          /* ------------------------------------------------------------- */
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-neutral-950 group"
          >
            {galleryImages.map((img, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    isCurrent
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <SmartImage
                    src={img.url}
                    fallbackUrls={img.fallbackUrls}
                    placeName={img.city}
                    alt={img.caption}
                    crossOrigin="anonymous"
                    aspectRatio="21/9"
                    className="w-full h-full object-cover filter brightness-[0.88] transition-transform duration-1000 group-hover:scale-105"
                  />

                  {/* Optical circular vignette */}
                  <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(8,10,13,0.75)_100%)] pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Scrim and info */}
                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase text-amber-300 tracking-wider block mb-1">
                        {img.tag} · {img.city}
                      </span>
                      <h3 className="text-lg sm:text-2xl font-serif text-white">
                        {img.caption}
                      </h3>
                    </div>

                    <button
                      onClick={() => setFullscreenImage(img.url)}
                      title="Expand full screen"
                      className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all backdrop-blur-sm"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Thumbnail Navigation Strip */}
        <div className="flex items-center gap-2.5 mt-5 overflow-x-auto pb-2 scrollbar-none justify-center">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-16 sm:w-20 h-11 sm:h-14 rounded-lg overflow-hidden shrink-0 border transition-all ${
                idx === activeIndex
                  ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                  : 'border-white/10 opacity-50 hover:opacity-100'
              }`}
            >
              <SmartImage
                src={img.url}
                fallbackUrls={img.fallbackUrls}
                placeName={img.city}
                alt=""
                crossOrigin="anonymous"
                aspectRatio="16/10"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <SmartImage
            src={fullscreenImage}
            placeName="Expedition View"
            alt="Fullscreen capture"
            crossOrigin="anonymous"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </section>
  );
};
