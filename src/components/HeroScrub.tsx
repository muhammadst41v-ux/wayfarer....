import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { LiquidButton } from './LiquidButton';
import { EditableText } from './EditableText';
import { ChevronDown, FastForward } from 'lucide-react';
import { SmartImage } from './SmartImage';

interface HeroScrubProps {
  onUnlockScroll?: () => void;
}

export const HeroScrub: React.FC<HeroScrubProps> = ({ onUnlockScroll }) => {
  const { currentContent } = useTheme();
  const hero = currentContent.hero;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scrubbing state
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isLocked, setIsLocked] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);

  // References for smooth animation loop (LERP)
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const isLockedRef = useRef(true);
  const animFrameRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setHasReducedMotion(true);
      setIsLocked(false);
      isLockedRef.current = false;
      targetProgressRef.current = 1;
      currentProgressRef.current = 1;
      setProgress(1);
    }
  }, []);

  // iOS Safari kickstart & metadata preparation
  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasReducedMotion) return;

    const handleLoadedMetadata = () => {
      setIsVideoReady(true);
      // Kickstart video to unlock frame seeking on iOS Safari
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            video.pause();
            video.currentTime = 0;
          })
          .catch(() => {
            // Autoplay policy fallback: video remains ready for currentTime assignment
            video.currentTime = 0;
          });
      }
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [hasReducedMotion, hero.videoUrl]);

  // Unlock function
  const unlockScroll = useCallback(() => {
    setIsLocked(false);
    isLockedRef.current = false;
    targetProgressRef.current = 1;
    currentProgressRef.current = 1;
    setProgress(1);
    if (onUnlockScroll) onUnlockScroll();
  }, [onUnlockScroll]);

  // Smooth LERP loop for updating video currentTime
  useEffect(() => {
    const updateLoop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentProgressRef.current += diff * 0.12; // Smooth 12% ease-out
        const clamped = Math.max(0, Math.min(1, currentProgressRef.current));
        setProgress(clamped);

        const video = videoRef.current;
        if (video && video.duration) {
          video.currentTime = clamped * video.duration;
        }

        // When reached end, unlock
        if (clamped >= 0.99 && isLockedRef.current) {
          unlockScroll();
        }
      }
      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [unlockScroll]);

  // Wheel and Touch listeners with passive: false to lock scroll until scrub progress = 1
  useEffect(() => {
    if (hasReducedMotion) return;

    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      // If we are at the top and scrolling up, lock again if desired
      if (window.scrollY <= 2 && e.deltaY < 0 && !isLockedRef.current) {
        // Can optionally allow relocking when back at top
      }

      if (!isLockedRef.current) {
        // If at the very top of the page and scrolling up, re-lock
        if (window.scrollY <= 2 && e.deltaY < 0) {
          setIsLocked(true);
          isLockedRef.current = true;
          targetProgressRef.current = 0.95;
          e.preventDefault();
        }
        return;
      }

      // We are locked: prevent window scroll and advance scrub progress
      e.preventDefault();
      const sensitivity = 0.0018;
      targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + e.deltaY * sensitivity));

      if (targetProgressRef.current >= 1) {
        unlockScroll();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLockedRef.current) {
        if (window.scrollY <= 2 && e.touches[0].clientY > touchStartY) {
          // Re-lock at very top when pulling down
          setIsLocked(true);
          isLockedRef.current = true;
          targetProgressRef.current = 0.95;
          e.preventDefault();
        }
        return;
      }

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      e.preventDefault();
      const touchSensitivity = 0.0035;
      targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + deltaY * touchSensitivity));

      if (targetProgressRef.current >= 1) {
        unlockScroll();
      }
    };

    const handleScroll = () => {
      if (window.scrollY <= 2 && targetProgressRef.current >= 1) {
        // At the top
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = '';
    };
  }, [hasReducedMotion, unlockScroll]);

  // Handle Skip Intro
  const handleSkipIntro = () => {
    targetProgressRef.current = 1;
    unlockScroll();
    const targetElem = document.getElementById('manifesto-section');
    if (targetElem) {
      targetElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[640px] max-h-[1100px] flex items-center justify-center overflow-hidden select-none bg-neutral-950"
      aria-label="City discovery showcase"
    >
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {!hasReducedMotion ? (
          <video
            ref={videoRef}
            src={hero.videoUrl}
            poster={hero.posterUrl}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover transform scale-105 filter brightness-[0.72] contrast-[1.08] transition-opacity duration-700 ease-out"
          />
        ) : (
          <SmartImage
            src={hero.posterUrl}
            destinationSlug="hunza"
            placeName="Hunza Valley, Pakistan"
            alt="Wayfarer Backdrop"
            className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05]"
          />
        )}

        {/* Cinematic Vignette & Gradient Scrim */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-black/45 to-[#0b0d10]/70 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,13,16,0.85)_100%)] pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Floating Scrub Progress Indicator */}
      {!hasReducedMotion && (
        <div className="absolute top-24 right-6 sm:right-10 z-20 flex items-center gap-3 bg-neutral-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono text-neutral-300 shadow-xl">
          <span className="text-[11px] uppercase tracking-wider text-amber-400">
            {isLocked ? 'Scroll to explore' : 'City unlocked'}
          </span>
          <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-75 rounded-full"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="tabular-nums text-neutral-200">{Math.round(progress * 100)}%</span>
        </div>
      )}

      {/* Skip Intro Button */}
      {isLocked && !hasReducedMotion && (
        <button
          onClick={handleSkipIntro}
          className="absolute bottom-10 right-6 sm:right-10 z-20 flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 rounded-full transition-all duration-200 hover:scale-105"
        >
          <span>Skip intro</span>
          <FastForward className="w-3.5 h-3.5 text-amber-400" />
        </button>
      )}

      {/* Hero Editorial Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center justify-center pt-16 pb-12">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-6 text-xs font-mono tracking-widest uppercase text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <EditableText contentKey="hero.eyebrow" defaultText={hero.eyebrow} />
        </div>

        {/* Marquee Headline */}
        <h1
          style={{ textWrap: 'balance' }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-white mb-6 max-w-4xl leading-[1.08]"
        >
          <EditableText contentKey="hero.title" defaultText={hero.title} />
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-300/90 font-sans max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          <EditableText
            contentKey="hero.subtitle"
            defaultText={hero.subtitle}
            multiline
          />
        </p>

        {/* Primary & Secondary Action Block */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <LiquidButton
            size="lg"
            asAnchor
            href={hero.primaryCta.href}
            variant="liquid"
          >
            <EditableText
              contentKey="hero.primaryCta.text"
              defaultText={hero.primaryCta.text}
            />
          </LiquidButton>

          <LiquidButton
            size="lg"
            asAnchor
            href={hero.secondaryCta.href}
            variant="outline"
          >
            <EditableText
              contentKey="hero.secondaryCta.text"
              defaultText={hero.secondaryCta.text}
            />
          </LiquidButton>
        </div>

        {/* Quantitative Proof Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-14 pt-8 border-t border-white/10 w-full max-w-4xl">
          {hero.stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <span className="text-xl sm:text-2xl font-serif text-amber-300 tabular-nums">
                <EditableText contentKey={`hero.stats.${idx}.value`} defaultText={stat.value} />
              </span>
              <span className="text-xs text-neutral-400 font-sans mt-0.5">
                <EditableText contentKey={`hero.stats.${idx}.label`} defaultText={stat.label} />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator prompt */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-neutral-400 transition-opacity duration-300 pointer-events-none ${
          progress > 0.9 ? 'opacity-20' : 'opacity-80'
        }`}
      >
        <span className="text-[11px] font-mono tracking-wider uppercase">
          {isLocked ? 'Scroll wheel to advance' : 'Scroll down'}
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-amber-400" />
      </div>

      {/* Linear Scrub Progress Line at Bottom Edge */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10 z-30">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 transition-all duration-75"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </section>
  );
};
