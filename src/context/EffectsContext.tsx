import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

export type EffectsLevel = 'high' | 'low' | 'off';

interface EffectsContextType {
  effectsLevel: EffectsLevel;
  setEffectsLevel: (level: EffectsLevel) => void;
  fps: number;
}

const EFFECTS_STORAGE_KEY = 'wayfarer_effects_level_v1';
const EffectsContext = createContext<EffectsContextType | null>(null);

export const EffectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [effectsLevel, setEffectsLevelState] = useState<EffectsLevel>(() => {
    if (typeof window === 'undefined') return 'high';
    try {
      // Check prefers-reduced-motion first
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 'off';
      }
      const saved = localStorage.getItem(EFFECTS_STORAGE_KEY) as EffectsLevel;
      if (saved === 'high' || saved === 'low' || saved === 'off') return saved;
      return 'high';
    } catch {
      return 'high';
    }
  });

  const [fps, setFps] = useState(60);
  const lowFpsStartTimeRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  const setEffectsLevel = useCallback((level: EffectsLevel) => {
    setEffectsLevelState(level);
    try {
      localStorage.setItem(EFFECTS_STORAGE_KEY, level);
    } catch {
      // ignore
    }
  }, []);

  // Real-time FPS monitor & auto-downgrade if under 30 FPS for 3 consecutive seconds
  useEffect(() => {
    if (effectsLevel === 'off') return;

    let animId: number;

    const measureFps = (now: number) => {
      frameCountRef.current++;
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
        setFps(currentFps);
        frameCountRef.current = 0;
        lastTimeRef.current = now;

        // Check if FPS is below 30
        if (currentFps < 30) {
          if (!lowFpsStartTimeRef.current) {
            lowFpsStartTimeRef.current = now;
          } else if (now - lowFpsStartTimeRef.current >= 3000) {
            // Under 30 FPS for 3 seconds -> auto-downgrade
            if (effectsLevel === 'high') {
              console.warn('[Wayfarer Engine] Frame rate under 30 FPS for 3s. Auto-downgrading effects to Low.');
              setEffectsLevel('low');
            } else if (effectsLevel === 'low') {
              console.warn('[Wayfarer Engine] Frame rate under 30 FPS for 3s. Auto-downgrading effects to Off.');
              setEffectsLevel('off');
            }
            lowFpsStartTimeRef.current = null;
          }
        } else {
          lowFpsStartTimeRef.current = null;
        }
      }

      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, [effectsLevel, setEffectsLevel]);

  return (
    <EffectsContext.Provider value={{ effectsLevel, setEffectsLevel, fps }}>
      {children}
    </EffectsContext.Provider>
  );
};

export function useEffects() {
  const context = useContext(EffectsContext);
  if (!context) {
    throw new Error('useEffects must be used within an EffectsProvider');
  }
  return context;
}
