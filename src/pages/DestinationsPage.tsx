import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pakistanDestinations } from '../data/pakistan';
import { PakistanDestination, PakistanRegion, DestinationInterest } from '../types';
import { useTrips } from '../context/TripContext';
import { SmartImage } from '../components/SmartImage';
import {
  Search,
  Filter,
  MapPin,
  Mountain,
  Compass,
  ArrowRight,
  Plus,
  Check,
  Calendar,
  Sparkles,
  ArrowUpDown,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const REGIONS: ('all' | PakistanRegion)[] = [
  'all',
  'Gilgit-Baltistan',
  'Khyber Pakhtunkhwa',
  'Punjab',
  'Sindh',
  'Balochistan',
  'Azad Kashmir',
  'Islamabad',
];

const INTERESTS: { id: 'all' | DestinationInterest; label: string }[] = [
  { id: 'all', label: 'All Interests' },
  { id: 'mountains', label: 'High Mountains' },
  { id: 'culture', label: 'Living Culture' },
  { id: 'food', label: 'Gastronomy' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'history', label: 'Archaeology & History' },
  { id: 'spiritual', label: 'Sufi & Spiritual' },
  { id: 'family', label: 'Family Friendly' },
];

const SEASONS = [
  { id: 'all', label: 'All Seasons' },
  { id: 'summer', label: 'Summer Peak (Jun - Aug)' },
  { id: 'autumn', label: 'Autumn Foliage (Sep - Oct)' },
  { id: 'spring', label: 'Spring Blossom (Apr - May)' },
  { id: 'winter', label: 'Winter Mild / Snow (Nov - Mar)' },
];

const ITEMS_PER_PAGE = 9;

export const DestinationsPage: React.FC = () => {
  const { isSavedPlace, toggleSavedPlace } = useTrips();

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | PakistanRegion>('all');
  const [selectedInterest, setSelectedInterest] = useState<'all' | DestinationInterest>('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState<'all' | 'budget' | 'mid' | 'luxury'>('all');
  const [sortBy, setSortBy] = useState<'curated' | 'name' | 'altitude' | 'budget-asc' | 'budget-desc'>('curated');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Update Page Title and Meta for SEO
  useEffect(() => {
    document.title = 'Pakistan Tourist Destinations Directory | 20+ Curated Regions | Wayfarer';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Explore 20+ world-class Pakistan destinations: Hunza, Skardu, Fairy Meadows, K2 Base Camp, Lahore, Swat, and Gwadar. Verified guides, hotels, altitude data, and cultural dossiers.'
      );
    }
  }, []);

  // Filter logic
  const filteredDestinations = useMemo(() => {
    return pakistanDestinations
      .filter((dest) => {
        // Text Search
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          const matchName = dest.name.toLowerCase().includes(q);
          const matchRegion = dest.region.toLowerCase().includes(q);
          const matchDesc = dest.shortDescription.toLowerCase().includes(q);
          const matchTags = dest.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchRegion && !matchDesc && !matchTags) return false;
        }

        // Region Filter
        if (selectedRegion !== 'all' && dest.region !== selectedRegion) {
          return false;
        }

        // Interest Filter
        if (selectedInterest !== 'all' && !dest.interests.includes(selectedInterest)) {
          return false;
        }

        // Season Filter
        if (selectedSeason !== 'all') {
          if (selectedSeason === 'summer' && !dest.bestMonths.some((m) => ['June', 'July', 'August'].includes(m))) {
            return false;
          }
          if (selectedSeason === 'autumn' && !dest.bestMonths.some((m) => ['September', 'October'].includes(m))) {
            return false;
          }
          if (selectedSeason === 'spring' && !dest.bestMonths.some((m) => ['April', 'May'].includes(m))) {
            return false;
          }
          if (
            selectedSeason === 'winter' &&
            !dest.bestMonths.some((m) => ['November', 'December', 'January', 'February', 'March', 'All Year'].includes(m))
          ) {
            return false;
          }
        }

        // Budget Filter
        if (selectedBudget === 'budget' && dest.estimatedDailyBudget.budget > 25) {
          return false;
        }
        if (selectedBudget === 'mid' && (dest.estimatedDailyBudget.mid < 45 || dest.estimatedDailyBudget.mid > 85)) {
          return false;
        }
        if (selectedBudget === 'luxury' && dest.estimatedDailyBudget.luxury < 180) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'altitude') {
          const altA = parseInt(a.altitude.replace(/[^0-9]/g, ''), 10) || 0;
          const altB = parseInt(b.altitude.replace(/[^0-9]/g, ''), 10) || 0;
          return altB - altA;
        }
        if (sortBy === 'budget-asc') return a.estimatedDailyBudget.budget - b.estimatedDailyBudget.budget;
        if (sortBy === 'budget-desc') return b.estimatedDailyBudget.luxury - a.estimatedDailyBudget.luxury;
        return 0; // curated order
      });
  }, [searchTerm, selectedRegion, selectedInterest, selectedSeason, selectedBudget, sortBy]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRegion, selectedInterest, selectedSeason, selectedBudget, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE);
  const paginatedDestinations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDestinations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDestinations, currentPage]);

  return (
    <div className="min-h-screen bg-[#0b0d10] text-[#f3f4f6] pb-24">
      {/* JSON-LD Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Pakistan Tourist Destinations Directory',
            itemListElement: pakistanDestinations.map((d, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'TouristDestination',
                name: d.name,
                description: d.shortDescription,
                touristType: d.interests,
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: d.coordinates.lat,
                  longitude: d.coordinates.lng,
                },
              },
            })),
          }),
        }}
      />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-amber-500 mb-3">
              <Compass className="w-4 h-4" />
              <span>National Tourist Expeditions Dossier</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif">
              Destinations Across Pakistan
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl text-balance">
              20+ meticulously documented destinations: ancient Gandharan stupas, soaring Karakoram 8,000m summits,
              Sufi mausoleums, and hammerhead peninsulas on the Arabian Sea.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/map"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 transition-colors shadow-lg text-sm"
            >
              <MapPin className="w-4 h-4" />
              <span>Open Interactive Map</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by city, mountain, food, or tag (e.g. Hunza, Passu, Nihari)..."
                className="w-full bg-[#13171d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Region Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as any)}
                className="w-full bg-[#13171d] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Regions ({pakistanDestinations.length})</option>
                {REGIONS.filter((r) => r !== 'all').map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Interest Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value as any)}
                className="w-full bg-[#13171d] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {INTERESTS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#13171d] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="curated">Curated Order</option>
                <option value="name">Name (A-Z)</option>
                <option value="altitude">Altitude (High to Low)</option>
                <option value="budget-asc">Daily Budget (Low to High)</option>
                <option value="budget-desc">Luxury (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Badges (Season & Budget) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-medium mr-1">Season:</span>
              {SEASONS.map((season) => (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeason(season.id)}
                  className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    selectedSeason === season.id
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {season.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium mr-1">Budget:</span>
              <button
                onClick={() => setSelectedBudget('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedBudget === 'all'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedBudget('budget')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedBudget === 'budget'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                $ Budget (&le;$25)
              </button>
              <button
                onClick={() => setSelectedBudget('mid')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedBudget === 'mid'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                $$ Mid ($45-$85)
              </button>
              <button
                onClick={() => setSelectedBudget('luxury')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedBudget === 'luxury'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                $$$ Luxury ($180+)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-white/5">
          <span>
            Showing <strong className="text-white">{filteredDestinations.length}</strong> verified Pakistan regions
          </span>
          {filteredDestinations.length !== pakistanDestinations.length && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('all');
                setSelectedInterest('all');
                setSelectedSeason('all');
                setSelectedBudget('all');
              }}
              className="text-amber-400 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Empty Search Result */}
        {filteredDestinations.length === 0 && (
          <div className="py-24 text-center">
            <Compass className="w-16 h-16 text-slate-600 mx-auto stroke-1 mb-4" />
            <h3 className="text-xl font-bold text-white">No destinations matched your criteria</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
              Try broadening your search term, clearing interest filters, or exploring all seasons.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('all');
                setSelectedInterest('all');
                setSelectedSeason('all');
                setSelectedBudget('all');
              }}
              className="mt-6 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs"
            >
              Show All 20 Destinations
            </button>
          </div>
        )}

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {paginatedDestinations.map((dest) => {
            const isSaved = isSavedPlace(`dest-${dest.slug}`);

            return (
              <article
                key={dest.id}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#13171d] hover:border-amber-500/50 transition-all duration-300 shadow-md hover:shadow-2xl overflow-hidden"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                    <SmartImage
                      src={dest.heroImage}
                      destinationSlug={dest.slug}
                      wikipediaTitle={dest.wikipediaTitle}
                      fallbackUrls={dest.fallbackUrls}
                      placeName={dest.name}
                      alt={dest.name}
                      aspectRatio="16/10"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Gradient Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13171d] via-black/30 to-transparent" />

                    {/* Region Pill (unboxed contrast text) */}
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono text-amber-400">
                      {dest.region}
                    </div>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => toggleSavedPlace(`dest-${dest.slug}`, dest.name)}
                      className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
                        isSaved
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-black/40 text-white hover:bg-black/70'
                      }`}
                      title={isSaved ? 'Saved in my itinerary' : 'Save to my itinerary'}
                    >
                      {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>

                    {/* Altitude and difficulty info */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Mountain className="w-3.5 h-3.5 text-amber-400" />
                        <span>{dest.altitude}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-300">
                        Level: {dest.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold font-serif text-white group-hover:text-amber-400 transition-colors">
                      <Link to={`/destinations/${dest.slug}`}>{dest.name}</Link>
                    </h2>

                    <p className="mt-2 text-sm text-slate-300 line-clamp-3 leading-relaxed">
                      {dest.shortDescription}
                    </p>

                    {/* Highlights bullet points */}
                    <div className="mt-4 space-y-1 text-xs text-slate-400">
                      {dest.highlights.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 shrink-0">·</span>
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Metadata strip: Best Months & Daily Est */}
                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>{dest.bestMonths.slice(0, 3).join(', ')}</span>
                      </div>

                      <div className="font-mono text-amber-400 font-medium">
                        ${dest.estimatedDailyBudget.budget} - ${dest.estimatedDailyBudget.mid}/day
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="p-6 pt-0">
                  <Link
                    to={`/destinations/${dest.slug}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-semibold tracking-wide uppercase transition-all duration-300 border border-white/10 hover:border-amber-500"
                  >
                    <span>View Destination Field Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-9 h-9 rounded-xl text-xs font-semibold transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'border border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
