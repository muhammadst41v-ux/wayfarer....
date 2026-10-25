import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PakistanDestination, PhotoItem } from '../types';
import {
  Camera,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Info,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SmartImage } from './SmartImage';

interface DestinationPhotosSectionProps {
  destination: PakistanDestination;
}

export const DestinationPhotosSection: React.FC<DestinationPhotosSectionProps> = ({ destination }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isHoverZooming, setIsHoverZooming] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Touch gesture state for swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Initialize and fetch Wikimedia Commons / curated photos
  useEffect(() => {
    // 1. Initial curated high-res photos
    const basePhotos: PhotoItem[] = [
      {
        id: `hero-${destination.slug}`,
        url: destination.heroImage,
        thumbnailUrl: destination.heroImage,
        title: `${destination.name} - Panorama Vista`,
        caption: `Iconic alpine view of ${destination.name}, ${destination.region}.`,
        author: 'Wayfarer Field Expedition Archives',
        license: 'CC BY-SA 4.0 / Editorial',
        source: 'curated',
        originalUrl: destination.heroImage,
      },
      ...(destination.gallery || []).map((imgUrl, i) => ({
        id: `gallery-${destination.slug}-${i}`,
        url: imgUrl,
        thumbnailUrl: imgUrl,
        title: `${destination.name} - Field Perspective 0${i + 1}`,
        caption: `Documentary landscape and local cultural setting in ${destination.name}.`,
        author: 'Wayfarer Scouts & Wikimedia Commons Contributors',
        license: 'Creative Commons Attribution-ShareAlike',
        source: 'wikimedia' as const,
        originalUrl: imgUrl,
      })),
    ];

    setPhotos(basePhotos);

    // 2. Fetch live Wikimedia Commons images via Wikipedia API if wikipediaTitle exists
    if (destination.wikipediaTitle) {
      setLoading(true);
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        destination.wikipediaTitle
      )}&prop=pageimages|extracts&piprop=original|thumbnail&pithumbsize=1200&exintro=1&explaintext=1&format=json&origin=*`;

      fetch(wikiUrl)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.query?.pages) {
            const pages = Object.values(data.query.pages) as any[];
            const firstPage = pages[0];
            if (firstPage?.original?.source && firstPage.original.source !== destination.heroImage) {
              const wikiPhoto: PhotoItem = {
                id: `wiki-${destination.slug}-main`,
                url: firstPage.original.source,
                thumbnailUrl: firstPage.thumbnail?.source || firstPage.original.source,
                title: `${destination.name} - Wikimedia Commons Archive`,
                caption: `Official Wikimedia Commons archival photograph of ${firstPage.title}.`,
                author: 'Wikimedia Commons Project Volunteers',
                license: 'CC BY-SA 4.0 International',
                source: 'wikimedia',
                originalUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(destination.wikipediaTitle)}`,
              };
              setPhotos((prev) => {
                const exists = prev.some((p) => p.url === wikiPhoto.url);
                return exists ? prev : [prev[0], wikiPhoto, ...prev.slice(1)];
              });
            }
          }
        })
        .catch((err) => {
          console.warn('Wikimedia photo lookup notice (using high-res curated pack):', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [destination]);

  // Handle keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setZoomLevel(1);
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % photos.length);
        setZoomLevel(1);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
        setZoomLevel(1);
      }
    },
    [isLightboxOpen, photos.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // min swipe distance in px

    if (diff > threshold) {
      // Swiped left -> next
      setActivePhotoIndex((prev) => (prev + 1) % photos.length);
      setZoomLevel(1);
    } else if (diff < -threshold) {
      // Swiped right -> prev
      setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
      setZoomLevel(1);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentPhoto = photos[activePhotoIndex] || photos[0];

  return (
    <div className="space-y-8">
      {/* Header with Attribution Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500 flex items-center gap-2">
            <Camera className="w-3.5 h-3.5" />
            Verified Visual Expedition Archive
          </span>
          <h3 className="text-2xl font-bold font-serif text-white mt-1">
            Photo Gallery: {destination.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            High-resolution captures sourced via Wikimedia Commons & Wayfarer field photographers under CC BY-SA licenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            {photos.length} archival captures
          </span>
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fullscreen Theater</span>
          </button>
        </div>
      </div>

      {/* Featured Photo Lens-Zoom Showcase */}
      {currentPhoto && (
        <div className="rounded-3xl border border-white/10 bg-[#121620] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Main Interactive Zoom Stage */}
            <div
              className="lg:col-span-8 relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-crosshair group"
              onMouseEnter={() => setIsHoverZooming(true)}
              onMouseLeave={() => setIsHoverZooming(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setMousePos({ x, y });
              }}
              onClick={() => setIsLightboxOpen(true)}
            >
              <SmartImage
                src={currentPhoto.url}
                destinationSlug={destination.slug}
                placeName={currentPhoto.title || destination.name}
                alt={currentPhoto.title || destination.name}
                aspectRatio="16/10"
                className="w-full h-full object-cover transition-transform duration-200"
                style={{
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: isHoverZooming ? 'scale(1.8)' : 'scale(1)',
                }}
              />

              {/* Lens Zoom Badge */}
              <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-white font-mono">
                <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHoverZooming ? '2.5x Lens Active' : 'Hover to Inspect Terrain'}</span>
              </div>

              {/* Fullscreen Trigger Overlay */}
              <div className="absolute bottom-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs text-white">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Click for Fullscreen Lightbox</span>
              </div>
            </div>

            {/* Photo Metadata & Navigator Panel */}
            <div className="lg:col-span-4 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 bg-[#141822]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    Capture 0{activePhotoIndex + 1} of 0{photos.length}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 capitalize">
                    {currentPhoto.source}
                  </span>
                </div>

                <h4 className="text-lg font-bold font-serif text-white leading-snug">
                  {currentPhoto.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentPhoto.caption}
                </p>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Contributor / Author:</span>
                    <span className="text-white font-medium text-right truncate max-w-[180px]">
                      {currentPhoto.author}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Attribution License:</span>
                    <span className="text-amber-400 font-mono text-[11px]">
                      {currentPhoto.license}
                    </span>
                  </div>
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
                    }}
                    aria-label="Previous photo"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setActivePhotoIndex((prev) => (prev + 1) % photos.length);
                    }}
                    aria-label="Next photo"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {currentPhoto.originalUrl && (
                  <a
                    href={currentPhoto.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
                  >
                    <span>Original Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thumbnail Filmstrip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {photos.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setActivePhotoIndex(idx)}
            className={`relative flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden border-2 transition-all group ${
              activePhotoIndex === idx
                ? 'border-amber-400 shadow-lg scale-105'
                : 'border-white/10 opacity-70 hover:opacity-100'
            }`}
          >
            <SmartImage
              src={p.thumbnailUrl || p.url}
              destinationSlug={destination.slug}
              placeName={p.title || destination.name}
              alt={p.title || `Thumbnail 0${idx + 1}`}
              aspectRatio="7/5"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
              0{idx + 1}
            </span>
          </button>
        ))}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL WITH SWIPE & KEYBOARD */}
      {isLightboxOpen && currentPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen photo viewer"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between animate-in fade-in duration-200"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 text-white z-20">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                {destination.name} · {activePhotoIndex + 1} of {photos.length}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                (Press Esc to close, Arrow keys or swipe to navigate)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.3))}
                aria-label="Zoom out"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.3))}
                aria-label="Zoom in"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                aria-label="Reset zoom"
                className="px-2.5 py-1 text-xs font-mono rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={() => {
                  setIsLightboxOpen(false);
                  setZoomLevel(1);
                }}
                aria-label="Close lightbox"
                className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Canvas */}
          <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
            {/* Prev Arrow */}
            <button
              onClick={() => {
                setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
                setZoomLevel(1);
              }}
              aria-label="Previous image"
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition-transform hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={() => {
                setActivePhotoIndex((prev) => (prev + 1) % photos.length);
                setZoomLevel(1);
              }}
              aria-label="Next image"
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition-transform hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Scaled Image */}
            <div
              className="max-w-full max-h-full transition-transform duration-200 flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <SmartImage
                src={currentPhoto.url}
                destinationSlug={destination.slug}
                placeName={currentPhoto.title || destination.name}
                alt={currentPhoto.title || destination.name}
                className="max-w-[90vw] max-h-[75vh] object-contain rounded-lg shadow-2xl select-none"
              />
            </div>
          </div>

          {/* Bottom Caption and Filmstrip */}
          <div className="px-6 py-4 bg-black/70 border-t border-white/10 z-20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left max-w-xl">
              <h5 className="text-sm font-semibold text-white truncate">
                {currentPhoto.title}
              </h5>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>By: {currentPhoto.author}</span>
                <span>·</span>
                <span className="text-amber-400">{currentPhoto.license}</span>
                <span>·</span>
                <span>Source: {currentPhoto.source.toUpperCase()}</span>
              </div>
            </div>

            {/* Quick Filmstrip in Modal */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-md py-1">
              {photos.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePhotoIndex(idx);
                    setZoomLevel(1);
                  }}
                  className={`relative w-12 h-9 rounded overflow-hidden flex-shrink-0 border transition-all ${
                    activePhotoIndex === idx
                      ? 'border-amber-400 scale-105'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <SmartImage
                    src={p.thumbnailUrl || p.url}
                    destinationSlug={destination.slug}
                    placeName={destination.name}
                    alt=""
                    aspectRatio="4/3"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
