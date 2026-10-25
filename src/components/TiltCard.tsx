import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useEffects } from '../context/EffectsContext';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt degrees (default 10)
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', maxTilt = 10 }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { effectsLevel } = useEffects();
  const [transform, setTransform] = useState('');
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (effectsLevel === 'off') return;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = ((y - centerY) / centerY) * -maxTilt;
      const tiltY = ((x - centerX) / centerX) * maxTilt;

      setTransform(`perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);

      // Dynamic glare effect
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: effectsLevel === 'high' ? 0.25 : 0.1,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(245, 158, 11, 0.4) 0%, transparent 60%)`,
      });
    },
    [effectsLevel, maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0 });
  }, []);

  // Gyroscope tilt on mobile devices if supported
  useEffect(() => {
    if (effectsLevel === 'off' || typeof window === 'undefined') return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      // Clamp gamma (-30 to 30) and beta (20 to 60 standard holding angle)
      const gamma = Math.min(25, Math.max(-25, e.gamma));
      const beta = Math.min(25, Math.max(-25, e.beta - 45));

      const tiltY = (gamma / 25) * (maxTilt * 0.7);
      const tiltX = -(beta / 25) * (maxTilt * 0.7);

      setTransform(`perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [effectsLevel, maxTilt]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: effectsLevel === 'off' ? 'none' : transform,
        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      {/* Glare Overlay */}
      {effectsLevel !== 'off' && (
        <div
          className="absolute inset-0 pointer-events-none rounded-inherit z-30 transition-opacity duration-300"
          style={glareStyle}
        />
      )}
      {children}
    </div>
  );
};
