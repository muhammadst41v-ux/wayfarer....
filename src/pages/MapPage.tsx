import React, { useEffect } from 'react';
import { InteractiveMap } from '../components/InteractiveMap';
import { Compass, MapPin, Layers, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MapPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Interactive Map Explorer | Wayfarer Pakistan';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore Pakistan interactively: 20+ destinations, hotels, verified restaurants, attractions, ATMs, hospitals, and mountain vehicle rentals on an interactive map.'
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0d10] text-[#f3f4f6] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 mb-2">
              <Compass className="w-4 h-4" />
              <span>National Cartographic Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-white tracking-tight">
              Interactive Explorer: Pakistan
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl text-balance">
              Click any pin to inspect verified details, check estimated nightly rates, get directions on Google Maps,
              or add places directly to your personal trip itinerary.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/destinations"
              className="px-4 py-2 rounded-xl border border-white/15 hover:border-amber-500 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              Browse 20+ Regional Dossiers
            </Link>
          </div>
        </div>

        {/* Map Container */}
        <div className="mt-6">
          <InteractiveMap height="calc(100vh - 280px)" initialZoom={6} />
        </div>

        {/* Help / Guidance footnote */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 p-4 rounded-xl bg-[#13171d] border border-white/5">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Use the top-left toggle bar to filter between Hotels, Restaurants, Attractions, Rentals, Hospitals, ATMs, and Airports.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-500">CartoDB Voyager / OpenStreetMap Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
