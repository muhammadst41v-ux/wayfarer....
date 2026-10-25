import React, { useState, useEffect, useMemo } from 'react';
import { Mountain, Compass } from 'lucide-react';
import { imageTracker } from '../utils/imageTracker';
import { resolveDestinationPhotos, PhotoCredit } from '../services/photoService';

export interface SmartImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackUrls?: string[];
  placeName?: string;
  wikipediaTitle?: string;
  destinationSlug?: string;
  alt: string;
  aspectRatio?: string; // e.g. "16/9", "16/10", "4/3", "1/1", or undefined if parent defines sizing
  containerClassName?: string;
  showCredit?: boolean;
  credit?: PhotoCredit;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  fallbackUrls = [],
  placeName,
  wikipediaTitle,
  destinationSlug,
  alt,
  aspectRatio,
  containerClassName = '',
  className = '',
  showCredit = false,
  credit: initialCredit,
  loading = 'lazy',
  crossOrigin = 'anonymous',
  onError,
  onLoad,
  ...restProps
}) => {
  // Build initial candidate list
  const initialCandidates = useMemo(() => {
    const list: string[] = [];
    if (src) list.push(src);
    fallbackUrls.forEach((u) => {
      if (u && !list.includes(u)) list.push(u);
    });
    return list;
  }, [src, fallbackUrls]);

  const [candidates, setCandidates] = useState<string[]>(initialCandidates);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAllFailed, setHasAllFailed] = useState(initialCandidates.length === 0);
  const [credit, setCredit] = useState<PhotoCredit | undefined>(initialCredit);

  // Synchronize candidates when src or fallbackUrls change
  useEffect(() => {
    const nextList: string[] = [];
    if (src) nextList.push(src);
    fallbackUrls.forEach((u) => {
      if (u && !nextList.includes(u)) nextList.push(u);
    });

    setCandidates(nextList);
    setCandidateIndex(0);
    setIsLoading(true);
    setHasAllFailed(nextList.length === 0);
  }, [src, fallbackUrls]);

  // If destinationSlug or wikipediaTitle is provided, fetch real Wikipedia/Commons photos
  useEffect(() => {
    if (!destinationSlug && !wikipediaTitle) return;

    let isMounted = true;
    resolveDestinationPhotos(destinationSlug || '', wikipediaTitle, placeName).then((resolved) => {
      if (!isMounted) return;

      setCandidates((prev) => {
        const merged = [...prev];
        if (resolved.primaryUrl && !merged.includes(resolved.primaryUrl)) {
          // If we had no candidates or current candidate is empty, put primary at front
          if (merged.length === 0) {
            merged.push(resolved.primaryUrl);
          } else {
            merged.push(resolved.primaryUrl);
          }
        }
        resolved.fallbackUrls.forEach((u) => {
          if (u && !merged.includes(u)) merged.push(u);
        });
        return merged;
      });

      if (resolved.credit) {
        setCredit(resolved.credit);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [destinationSlug, wikipediaTitle, placeName]);

  const currentUrl = candidates[candidateIndex];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (currentUrl) {
      imageTracker.recordFailure({
        url: currentUrl,
        alt: alt || placeName || 'Image',
        placeName,
        candidateIndex,
        totalCandidates: candidates.length,
      });
    }

    if (onError) {
      onError(e);
    }

    if (candidateIndex + 1 < candidates.length) {
      // Try next candidate URL in the fallback list (up to 3 alternatives)
      setCandidateIndex((prev) => prev + 1);
      setIsLoading(true);
    } else {
      // All fallback URLs exhausted, show stylized gradient placeholder
      setHasAllFailed(true);
      setIsLoading(false);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    if (onLoad) {
      onLoad(e);
    }
  };

  const displayName = placeName || alt || 'Wayfarer Expedition';

  const aspectStyle = aspectRatio
    ? {
        aspectRatio,
      }
    : undefined;

  return (
    <div
      className={`relative overflow-hidden select-none ${containerClassName}`}
      style={aspectStyle}
    >
      {/* 1. Loading Blur & Shimmer Skeleton */}
      {isLoading && !hasAllFailed && (
        <div
          className="absolute inset-0 z-10 bg-slate-900/90 flex items-center justify-center animate-pulse pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          <Compass className="w-8 h-8 text-amber-400/40 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
      )}

      {/* 2. Primary / Fallback Image Element */}
      {!hasAllFailed && currentUrl ? (
        <img
          src={currentUrl}
          alt={alt || displayName}
          loading={loading}
          crossOrigin={crossOrigin}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          {...restProps}
        />
      ) : null}

      {/* 3. Styled Gradient Placeholder (Shown if all URLs fail or no URL available) */}
      {hasAllFailed && (
        <div
          role="img"
          aria-label={alt || displayName}
          className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#0c1017] via-[#161d2b] to-[#090d14] border border-white/10 relative overflow-hidden"
        >
          {/* Subtle Topographic Rings Background Graphic */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10 pointer-events-none stroke-amber-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="32" fill="none" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="18" fill="none" strokeWidth="0.5" strokeDasharray="1 3" />
          </svg>

          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mb-3 shadow-lg z-10">
            <Mountain className="w-6 h-6 text-amber-400" />
          </div>

          {/* Place Name and Tag */}
          <div className="z-10 max-w-[85%]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 block mb-1">
              Field Dossier Archive
            </span>
            <h4 className="font-serif text-white text-base sm:text-lg font-medium leading-snug line-clamp-2">
              {displayName}
            </h4>
          </div>
        </div>
      )}

      {/* 4. Optional Credit Line for Wikimedia Commons attribution */}
      {showCredit && credit?.author && !isLoading && !hasAllFailed && (
        <div className="absolute bottom-1.5 right-1.5 z-20 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-mono text-slate-300 border border-white/10 pointer-events-none">
          📷 {credit.author} {credit.license ? `(${credit.license})` : ''}
        </div>
      )}
    </div>
  );
};
