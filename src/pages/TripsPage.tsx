import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTrips } from '../context/TripContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Search, Heart, ArrowUpDown, Compass, ChevronLeft, ChevronRight, SlidersHorizontal, Star } from 'lucide-react';
import { TiltCard } from '../components/TiltCard';
import { SmartImage } from '../components/SmartImage';

export const TripsPage: React.FC = () => {
  const { currentContent, activeCategory } = useTheme();
  const { toggleFavorite, isFavorite, openBookingModal } = useTrips();
  const allTrips = currentContent.items;

  // Document Title & Meta Tag update
  useEffect(() => {
    document.title = `${currentContent.brandName} | Expeditions & Journeys`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `Browse all curated ${activeCategory} expeditions and local dossiers by ${currentContent.brandName}.`);
    }
  }, [currentContent, activeCategory]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'duration' | 'popularity'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const itemsPerPage = 6;

  // Extract distinct categories from current content pack
  const categories = useMemo(() => {
    const set = new Set(allTrips.map((t) => t.category));
    return ['All', ...Array.from(set)];
  }, [allTrips]);

  // Simulate loading skeletons on filter or sort change for silky smooth feel
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, sortBy, maxPrice, currentPage, activeCategory]);

  // Filter & sort trips
  const filteredTrips = useMemo(() => {
    return allTrips
      .filter((trip) => {
        const matchesCategory = selectedCategory === 'All' || trip.category === selectedCategory;
        const matchesSearch =
          trip.title.toLowerCase().includes(search.toLowerCase()) ||
          trip.city.toLowerCase().includes(search.toLowerCase()) ||
          trip.country.toLowerCase().includes(search.toLowerCase()) ||
          trip.tagline.toLowerCase().includes(search.toLowerCase());
        const matchesPrice = trip.price <= maxPrice;
        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'popularity') return b.reviewCount - a.reviewCount;
        if (sortBy === 'duration') {
          const durA = parseInt(a.duration) || 0;
          const durB = parseInt(b.duration) || 0;
          return durB - durA;
        }
        return 0;
      });
  }, [allTrips, selectedCategory, search, maxPrice, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / itemsPerPage));
  const paginatedTrips = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTrips.slice(start, start + itemsPerPage);
  }, [filteredTrips, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setMaxPrice(2000);
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div className="pt-28 pb-24 px-6 sm:px-8 max-w-7xl mx-auto min-h-screen text-white">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Expeditions' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Field Catalog · {currentContent.brandKicker}
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif font-light text-white mt-2 mb-3">
          Curated Expeditions
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
          Small-group journeys led by resident scouts, architects, and masters. Every itinerary features private venue permits, local stays, and verified secret coordinates.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl bg-[#11141b] border border-white/10 shadow-xl mb-10 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by city, keyword, vibe..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Price Range Slider */}
          <div className="w-full md:w-64 flex items-center gap-3 text-xs">
            <span className="text-neutral-400 font-mono shrink-0">Max ${maxPrice}</span>
            <input
              type="range"
              min={400}
              max={2000}
              step={50}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Sort Selector */}
          <div className="w-full md:w-auto flex items-center gap-2 text-xs font-mono">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-[#171b24] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-300 focus:outline-none focus:border-amber-400"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popularity">Most Popular</option>
              <option value="duration">Longest Duration</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills (Functional interactive buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none border-t border-white/5">
          <span className="text-xs font-mono text-neutral-500 shrink-0 mr-1">Vibe:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="mb-6 flex items-center justify-between text-xs font-mono text-neutral-500">
        <span>Showing {filteredTrips.length} expeditions · Page {currentPage} of {totalPages}</span>
        {search && <span>Filtered by "{search}"</span>}
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-2xl bg-[#11151d] border border-white/10 overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-white/5" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-1/3 bg-white/10 rounded" />
                <div className="h-5 w-3/4 bg-white/10 rounded" />
                <div className="h-3 w-full bg-white/5 rounded" />
                <div className="pt-4 flex justify-between items-center border-t border-white/5">
                  <div className="h-6 w-16 bg-white/10 rounded" />
                  <div className="h-7 w-20 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : paginatedTrips.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center rounded-2xl bg-white/5 border border-white/10">
          <Compass className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-serif text-white mb-1">No matching expeditions found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
            Try adjusting your price ceiling, keyword query, or category selection to uncover more departures.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg text-xs transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Trips Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedTrips.map((trip) => {
            const favorited = isFavorite(trip.id);
            return (
              <TiltCard key={trip.id} className="rounded-2xl">
                <div
                  className="group relative flex flex-col justify-between bg-[#11151d] rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/50 transition-all duration-300 shadow-xl h-full"
                >
                {/* Image container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SmartImage
                    src={trip.featuredImage}
                    fallbackUrls={trip.fallbackUrls}
                    placeName={trip.title}
                    alt={trip.title}
                    aspectRatio="16/10"
                    className="w-full h-full object-cover filter brightness-[0.85] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11151d] via-transparent to-black/30" />

                  {/* Top badges & heart button */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="text-[11px] font-mono text-amber-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                      {trip.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(trip.id);
                      }}
                      title={favorited ? 'Remove from saved' : 'Save to bookmarks'}
                      className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                        favorited
                          ? 'bg-rose-500/80 text-white border-rose-400 scale-105'
                          : 'bg-black/50 text-white hover:bg-black/80 border-white/20'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-white' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Clean unboxed metadata with dot separators */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400 font-sans mb-2.5">
                      <span>{trip.city}, {trip.country}</span>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      <span>{trip.duration}</span>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{trip.rating}</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-serif text-white group-hover:text-amber-300 transition-colors mb-2 leading-snug">
                      <Link to={`/trips/${trip.slug}`}>
                        {trip.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                      {trip.tagline}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                        Per Person
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-serif text-white tabular-nums">
                          ${trip.price}
                        </span>
                        {trip.originalPrice && (
                          <span className="text-xs text-neutral-500 line-through tabular-nums">
                            ${trip.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/trips/${trip.slug}`}
                        className="px-3.5 py-1.5 text-xs text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        Dossier
                      </Link>
                      <button
                        onClick={() => openBookingModal(trip.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-14 flex items-center justify-center gap-2 text-xs font-mono">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 rounded-lg font-medium transition-colors ${
                currentPage === page
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
