import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTrips } from '../context/TripContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SmartImage } from '../components/SmartImage';
import { pakistanDestinations, pakistanPlaces } from '../data/pakistan';
import {
  Heart,
  Trash2,
  Compass,
  ArrowRight,
  Shield,
  Calendar,
  Users,
  MapPin,
  ExternalLink,
  Printer,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Mountain,
  Navigation,
} from 'lucide-react';

interface SavedCustomItinerary {
  id: string;
  title: string;
  createdAt: string;
  durationDays: number;
  travelStyle: string;
  destinations: string[];
  schedule: any[];
  estimatedCostUSD: number;
}

export const MyTripsPage: React.FC = () => {
  const { currentContent } = useTheme();
  const {
    favorites,
    toggleFavorite,
    clearAllFavorites,
    savedPlaces,
    toggleSavedPlace,
    openBookingModal,
  } = useTrips();

  const [activeTab, setActiveTab] = useState<'trips' | 'places' | 'itineraries' | 'wallet'>('itineraries');
  const [customItineraries, setCustomItineraries] = useState<SavedCustomItinerary[]>([]);

  useEffect(() => {
    document.title = `Explorer Dossier & Saved Expeditions | ${currentContent.brandName}`;
  }, [currentContent]);

  // Load saved custom itineraries from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wayfarer_saved_itineraries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCustomItineraries(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load saved custom itineraries:', e);
    }
  }, []);

  // Find all trips matching saved IDs across content packs
  const savedTrips = currentContent.items.filter((trip) => favorites.includes(trip.id));

  // Find matched places and destinations from savedPlaces array
  const matchedSavedItems = useMemo(() => {
    const items: Array<{
      id: string;
      name: string;
      type: string;
      region?: string;
      image?: string;
      href: string;
      meta?: string;
    }> = [];

    savedPlaces.forEach((spId) => {
      // Check if it's a destination (e.g. dest-hunza)
      if (spId.startsWith('dest-')) {
        const slug = spId.replace('dest-', '');
        const d = pakistanDestinations.find((dest) => dest.slug === slug);
        if (d) {
          items.push({
            id: spId,
            name: d.name,
            type: 'Destination',
            region: d.region,
            image: d.heroImage,
            href: `/destinations/${d.slug}`,
            meta: `${d.altitude} · ${d.difficulty}`,
          });
          return;
        }
      }

      // Check if it's a place item
      const place = pakistanPlaces.find((p) => p.id === spId);
      if (place) {
        items.push({
          id: spId,
          name: place.name,
          type: place.categoryLabel || place.type,
          region: place.address,
          image: place.photos[0],
          href: `/destinations/${place.destinationSlug}`,
          meta: `Rating: ${place.rating}★ · ${place.priceRangeEstimate || 'Curated'}`,
        });
      }
    });

    return items;
  }, [savedPlaces]);

  const handleDeleteItinerary = (id: string) => {
    const updated = customItineraries.filter((it) => it.id !== id);
    setCustomItineraries(updated);
    try {
      localStorage.setItem('wayfarer_saved_itineraries', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not update saved itineraries:', e);
    }
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-white space-y-10">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'My Explorer Dossier' },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Field Expedition Archive
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mt-1">
            My Explorer Dossier
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Your customized route plans, saved destinations, accommodation bookmarks, and offline travel wallet.
          </p>
        </div>

        <Link
          to="/planner"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Trip Planner</span>
        </Link>
      </div>

      {/* Dossier Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {[
          { id: 'itineraries', label: `Custom Itineraries (${customItineraries.length})` },
          { id: 'places', label: `Saved Places & Destinations (${matchedSavedItems.length})` },
          { id: 'trips', label: `Group Departures (${savedTrips.length})` },
          { id: 'wallet', label: 'Offline Field Wallet' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CUSTOM ITINERARIES */}
      {activeTab === 'itineraries' && (
        <div className="space-y-6">
          {customItineraries.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-white/5 border border-white/10 p-8 max-w-xl mx-auto space-y-4">
              <Compass className="w-12 h-12 text-amber-400 mx-auto opacity-70" />
              <h3 className="text-xl font-bold font-serif text-white">No Custom Itineraries Created Yet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use our interactive Route Architect to build tailored multi-day itineraries for the Karakoram Highway, Skardu, Deosai, or Lahore.
              </p>
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg"
              >
                <span>Build First Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customItineraries.map((it) => (
                <div
                  key={it.id}
                  className="p-6 rounded-2xl border border-white/10 bg-[#121620] space-y-4 flex flex-col justify-between hover:border-amber-400/40 transition-all shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
                      <span>{it.durationDays} Days · {it.travelStyle.toUpperCase()} TIER</span>
                      <button
                        onClick={() => handleDeleteItinerary(it.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete itinerary"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-lg font-bold font-serif text-white leading-snug">{it.title}</h4>

                    <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-300">
                      {it.destinations.map((d) => (
                        <span key={d} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 capitalize">
                          📍 {d.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Estimated Ground Cost:</span>
                      <span className="text-amber-400 font-bold">${it.estimatedCostUSD} USD</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <Link
                      to={`/planner?dest=${it.destinations.join(',')}&days=${it.durationDays}&style=${it.travelStyle}`}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
                    >
                      <span>Open in Planner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => window.print()}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs transition-colors flex items-center gap-1"
                      title="Print itinerary"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px]">Print</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED PLACES & DESTINATIONS */}
      {activeTab === 'places' && (
        <div className="space-y-6">
          {matchedSavedItems.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-white/5 border border-white/10 p-8 max-w-xl mx-auto space-y-4">
              <MapPin className="w-12 h-12 text-amber-400 mx-auto opacity-70" />
              <h3 className="text-xl font-bold font-serif text-white">No Places Saved Yet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click "+ Save to My Trips" on any destination page or lodging listing to store coordinates, booking links, and notes.
              </p>
              <Link
                to="/destinations"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg"
              >
                <span>Browse 20+ Destinations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedSavedItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-[#121620] overflow-hidden shadow-xl flex flex-col justify-between hover:border-amber-400/40 transition-all group"
                >
                  {item.image && (
                    <div className="aspect-[16/10] overflow-hidden relative bg-slate-950">
                      <SmartImage
                        src={item.image}
                        placeName={item.name}
                        alt={item.name}
                        aspectRatio="16/10"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-400 border border-white/10">
                        {item.type}
                      </div>
                      <button
                        onClick={() => toggleSavedPlace(item.id, item.name)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-red-500/80 text-white transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-base font-bold font-serif text-white group-hover:text-amber-300 transition-colors">
                        <Link to={item.href}>{item.name}</Link>
                      </h4>
                      {item.region && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.region}</p>
                      )}
                      {item.meta && (
                        <p className="text-[11px] font-mono text-amber-400/90 mt-1">{item.meta}</p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <Link
                        to={item.href}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GROUP DEPARTURES & TRIPS */}
      {activeTab === 'trips' && (
        <div className="space-y-6">
          {savedTrips.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-white/5 border border-white/10 p-8 max-w-xl mx-auto space-y-4">
              <Compass className="w-12 h-12 text-amber-400 mx-auto opacity-70" />
              <h3 className="text-xl font-bold font-serif text-white">No Group Departures Bookmarked</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore our catalog of small-cohort Karakoram highway journeys and book your spot.
              </p>
              <Link
                to="/trips"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg"
              >
                <span>View Expeditions Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {savedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="group bg-[#11141d] rounded-2xl overflow-hidden border border-white/12 shadow-xl flex flex-col justify-between hover:border-amber-400/40 transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <SmartImage
                      src={trip.featuredImage}
                      fallbackUrls={trip.fallbackUrls}
                      placeName={trip.title}
                      alt={trip.title}
                      aspectRatio="16/9"
                      className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="text-[11px] font-mono text-amber-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                        {trip.category}
                      </span>
                      <button
                        onClick={() => toggleFavorite(trip.id)}
                        className="p-2 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white transition-all"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{trip.city}, {trip.country}</span>
                        <span>·</span>
                        <span>{trip.duration}</span>
                      </div>
                      <h3 className="text-xl font-serif text-white group-hover:text-amber-300 transition-colors mb-2">
                        <Link to={`/trips/${trip.slug}`}>{trip.title}</Link>
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 mb-4">
                        {trip.tagline}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-neutral-500 block">Member Price</span>
                        <span className="text-xl font-serif text-white tabular-nums">${trip.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openBookingModal(trip.id)}
                          className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                        >
                          Enquire Spot
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: OFFLINE TRAVEL WALLET */}
      {activeTab === 'wallet' && (
        <div className="p-8 rounded-3xl border border-white/10 bg-[#141822] space-y-6 shadow-2xl">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Emergency & Logistics Pocket Card
            </span>
            <h3 className="text-2xl font-bold font-serif text-white mt-1">
              Offline Traveler Pocket Wallet
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Keep this screen accessible or take a screenshot when traveling into remote valleys with intermittent mobile reception.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
              <span className="text-amber-400 font-mono text-[10px] uppercase block">Emergency Helplines</span>
              <p className="text-white font-bold text-sm">Rescue 1122</p>
              <p className="text-white font-bold text-sm">Police: 15</p>
              <p className="text-slate-400 text-[11px]">Free from any local SIM or network</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
              <span className="text-amber-400 font-mono text-[10px] uppercase block">Internet Protocol</span>
              <p className="text-white font-bold text-sm">SCOM Network</p>
              <p className="text-slate-300 text-[11px]">Required for Gilgit-Baltistan & AJK 4G reception.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
              <span className="text-amber-400 font-mono text-[10px] uppercase block">Currency Protocol</span>
              <p className="text-white font-bold text-sm">Cash in Valleys</p>
              <p className="text-slate-300 text-[11px]">Withdraw at Islamabad or Gilgit town. Carry small PKR bills.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
              <span className="text-amber-400 font-mono text-[10px] uppercase block">Consular & Visas</span>
              <p className="text-white font-bold text-sm">NADRA e-Visa</p>
              <p className="text-slate-300 text-[11px]">Keep 2 printed hard copies in your backpack.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
