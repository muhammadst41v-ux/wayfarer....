import React, { useState, useEffect, useMemo } from 'react';
import { PlaceItem } from '../types';
import { useTrips } from '../context/TripContext';
import {
  Hotel,
  Car,
  Star,
  MapPin,
  Phone,
  ExternalLink,
  Plus,
  Check,
  Filter,
  ArrowUpDown,
  Building2,
  Compass,
} from 'lucide-react';

interface StaySectionProps {
  destinationSlug: string;
  destinationName: string;
}

export const StaySection: React.FC<StaySectionProps> = ({ destinationSlug, destinationName }) => {
  const { isSavedPlace, toggleSavedPlace } = useTrips();

  const [activeTab, setActiveTab] = useState<'stay' | 'rent'>('stay');
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting state
  const [selectedType, setSelectedType] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedPriceLevel, setSelectedPriceLevel] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'price-asc' | 'price-desc'>('rating');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const queryType = activeTab === 'stay' ? 'stay' : 'rent';

    fetch(`/api/places?destination=${encodeURIComponent(destinationSlug)}&type=${queryType}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to retrieve places');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setPlaces(data.places || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Stay fetch fallback activated:', err);
          setError('Live places unavailable. Displaying local verified catalog.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [destinationSlug, activeTab]);

  // Filter and sort items
  const filteredPlaces = useMemo(() => {
    return places
      .filter((item) => {
        if (selectedType !== 'all' && item.type !== selectedType) {
          return false;
        }
        if (minRating > 0 && item.rating < minRating) {
          return false;
        }
        if (selectedPriceLevel !== 'all' && item.priceLevel !== selectedPriceLevel) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
        if (sortBy === 'price-asc') return a.priceLevel - b.priceLevel;
        if (sortBy === 'price-desc') return b.priceLevel - a.priceLevel;
        return 0;
      });
  }, [places, selectedType, minRating, selectedPriceLevel, sortBy]);

  return (
    <div className="space-y-8">
      {/* Tab Switcher & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono tracking-wider uppercase text-amber-500">
            Accommodations & Transit Dossier
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Where to Stay & Transport in {destinationName}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-2xl">
            Curated mountain resorts, heritage palaces, scenic glamping, and verified 4x4 mountain vehicle providers.
            Real-time rates are partner estimates; book directly through verified channels below.
          </p>
        </div>

        {/* Segmented Tab Control */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#13171d] border border-slate-200 dark:border-white/10 shrink-0">
          <button
            onClick={() => {
              setActiveTab('stay');
              setSelectedType('all');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'stay'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Hotel className="w-4 h-4 text-emerald-500" />
            <span>Hotels & Stays</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('rent');
              setSelectedType('all');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'rent'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Car className="w-4 h-4 text-blue-500" />
            <span>Rent: 4x4, Bikes & Lofts</span>
          </button>
        </div>
      </div>

      {/* Filter and Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 rounded-xl bg-slate-50 dark:bg-[#13171d]/60 border border-slate-200 dark:border-white/10 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by:</span>
          </div>

          {activeTab === 'stay' ? (
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white dark:bg-[#0b0d10] border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">All Stay Types</option>
              <option value="hotel">Hotels & Resorts</option>
              <option value="guesthouse">Guesthouses</option>
              <option value="camping">Camping & Glamping</option>
              <option value="hostel">Hostels</option>
            </select>
          ) : (
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white dark:bg-[#0b0d10] border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">All Rental Types</option>
              <option value="car_rental">4x4 Mountain Jeeps & SUVs</option>
              <option value="bike_rental">Trail Motorbikes</option>
              <option value="apartment">Serviced Apartments & Lofts</option>
            </select>
          )}

          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="bg-white dark:bg-[#0b0d10] border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value={0}>Any Rating</option>
            <option value={4.0}>4.0+ Stars</option>
            <option value={4.5}>4.5+ Stars</option>
            <option value={4.8}>4.8+ Stars</option>
          </select>

          <select
            value={selectedPriceLevel}
            onChange={(e) => setSelectedPriceLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-white dark:bg-[#0b0d10] border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Any Price</option>
            <option value={1}>$ Budget</option>
            <option value={2}>$$ Moderate</option>
            <option value={3}>$$$ Upscale</option>
            <option value={4}>$$$$ Luxury</option>
          </select>
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white dark:bg-[#0b0d10] border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-[#13171d] p-5 space-y-4 animate-pulse"
            >
              <div className="w-full h-44 rounded-xl bg-slate-800" />
              <div className="h-5 w-3/4 bg-slate-800 rounded" />
              <div className="h-4 w-1/2 bg-slate-800 rounded" />
              <div className="h-8 w-full bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPlaces.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#13171d]/40">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto stroke-1" />
          <h4 className="text-base font-semibold text-slate-900 dark:text-white mt-4">
            No matching accommodations or rentals found
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Try adjusting your filters or search terms. Our concierge team also coordinates direct mountain homestays.
          </p>
          <button
            onClick={() => {
              setSelectedType('all');
              setMinRating(0);
              setSelectedPriceLevel('all');
            }}
            className="mt-4 px-4 py-2 rounded-lg text-xs font-medium bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Grid of Places */}
      {!loading && filteredPlaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => {
            const saved = isSavedPlace(place.id);
            const priceSigns = '$'.repeat(place.priceLevel);

            return (
              <div
                key={place.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#13171d] hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    {place.photos && place.photos.length > 0 ? (
                      <img
                        src={place.photos[0]}
                        alt={place.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const t = e.currentTarget;
                          if (!t.dataset.fallback) {
                            t.dataset.fallback = '1';
                            t.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
                          } else {
                            t.style.display = 'none';
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-600">
                        <Compass className="w-10 h-10 stroke-1" />
                      </div>
                    )}

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => toggleSavedPlace(place.id, place.name)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                        saved
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-black/40 text-white hover:bg-black/70'
                      }`}
                      title={saved ? 'Remove from My Trips' : 'Add to My Trips'}
                    >
                      {saved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>

                    {/* Source label */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-mono text-slate-200 uppercase tracking-wider">
                      {place.source === 'google' ? 'Google Places' : 'Wayfarer Verified'}
                    </div>

                    {/* Rating badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-sm text-white text-xs font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{place.rating.toFixed(1)}</span>
                      <span className="text-slate-300">({place.reviewCount})</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        {place.categoryLabel || place.type}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                        {priceSigns}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-amber-500 transition-colors">
                      {place.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                      <span className="truncate">{place.address}</span>
                    </div>

                    {/* Estimated Nightly / Daily Range */}
                    <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                        Estimated Nightly Range
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-amber-300">
                        {place.priceRangeEstimate}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        *Subject to seasonal altitude & demand
                      </span>
                    </div>

                    {/* Amenities list (unboxed clean typography) */}
                    {place.amenities && place.amenities.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {place.amenities.slice(0, 3).map((amenity, idx) => (
                          <React.Fragment key={idx}>
                            <span>{amenity}</span>
                            {idx < 2 && idx < place.amenities!.length - 1 && (
                              <span className="text-slate-300 dark:text-slate-600">·</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Outbound Booking & Direction Links */}
                <div className="p-5 pt-0 border-t border-slate-100 dark:border-white/5 mt-4">
                  <div className="flex items-center gap-2 pt-4">
                    <a
                      href={place.bookingLinks.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                    >
                      <span>Check Price</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {place.bookingLinks.bookingCom && (
                      <a
                        href={place.bookingLinks.bookingCom}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-lg text-xs font-medium border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:border-amber-500 transition-colors"
                        title="Book via Booking.com partner"
                      >
                        Booking
                      </a>
                    )}

                    {place.phone && (
                      <a
                        href={`tel:${place.phone}`}
                        className="p-2 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/15 hover:border-amber-500 transition-colors"
                        title={`Call ${place.phone}`}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
