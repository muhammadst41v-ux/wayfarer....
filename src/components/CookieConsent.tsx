import React, { useState, useEffect } from 'react';

const COOKIE_STORAGE_KEY = 'wayfarer_cookie_consent_v1';

export const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (!consent) {
        // Show after a brief delay for polite arrival
        const timer = setTimeout(() => setShow(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, 'accepted');
    } catch {
      // ignore
    }
    setShow(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, 'declined');
    } catch {
      // ignore
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 z-40 max-w-sm p-4 bg-[#12151c]/95 border border-white/12 rounded-xl shadow-2xl backdrop-blur-md text-xs text-neutral-300 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">Private & Unrushed</span>
          <span className="text-[10px] font-mono text-amber-400">Strict Privacy</span>
        </div>
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          We use strictly essential local storage to remember your itinerary bookmarks, theme preferences, and custom edits. Zero cross-site tracking.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg text-center transition-colors"
          >
            Acknowledge
          </button>
          <button
            onClick={handleDecline}
            className="py-1.5 px-3 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-lg transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};
