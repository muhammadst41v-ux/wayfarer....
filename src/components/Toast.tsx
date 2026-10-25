import React from 'react';
import { useTrips } from '../context/TripContext';
import { Check, Compass, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useTrips();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-[#12161f]/95 border border-amber-400/40 text-neutral-100 rounded-xl shadow-2xl backdrop-blur-md text-xs font-sans animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
        <Check className="w-3 h-3 text-amber-400" />
      </div>
      <span className="font-medium tracking-wide">{toastMessage}</span>
    </div>
  );
};
