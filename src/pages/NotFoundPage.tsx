import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Search, ArrowRight } from 'lucide-react';
import { LiquidButton } from '../components/LiquidButton';

export const NotFoundPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/trips?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="pt-36 pb-28 px-6 text-center text-white min-h-[80vh] flex flex-col items-center justify-center max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center mb-6">
        <Compass className="w-8 h-8 animate-[spin_20s_linear_infinite]" />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
        Error 404 · Coordinate Unmapped
      </span>
      <h1 className="text-4xl sm:text-6xl font-serif text-white mt-3 mb-4">
        You've Stepped Off the Grid
      </h1>
      <p className="text-sm text-neutral-400 max-w-md mx-auto mb-8 leading-relaxed">
        The coordinates you entered do not correspond to any known archive, alleyway, or field dossier in our system.
      </p>

      {/* Interactive Search Bar on 404 */}
      <form onSubmit={handleSearch} className="w-full max-w-md mb-8">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destination, city, or essay..."
            className="w-full bg-[#11141c] border border-white/15 rounded-full pl-11 pr-24 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 shadow-xl"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-full text-xs font-semibold transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Quick Destination Tags */}
      <div className="flex items-center gap-2 flex-wrap justify-center text-xs text-neutral-400 mb-8">
        <span className="font-mono text-neutral-500">Popular Coordinates:</span>
        <Link to="/trips?city=Berlin" className="text-amber-300 hover:underline">
          Berlin
        </Link>
        <span>·</span>
        <Link to="/trips?city=Kyoto" className="text-amber-300 hover:underline">
          Kyoto
        </Link>
        <span>·</span>
        <Link to="/trips?city=Lisbon" className="text-amber-300 hover:underline">
          Lisbon
        </Link>
        <span>·</span>
        <Link to="/trips?city=Oaxaca" className="text-amber-300 hover:underline">
          Oaxaca
        </Link>
      </div>

      <div className="flex items-center justify-center gap-4">
        <LiquidButton size="md" asAnchor href="/" variant="liquid">
          Return to Studio Home
        </LiquidButton>
        <Link
          to="/trips"
          className="px-5 py-2.5 text-xs text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
        >
          Browse All Expeditions
        </Link>
      </div>
    </div>
  );
};
