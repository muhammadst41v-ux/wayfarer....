import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTrips } from '../context/TripContext';
import { Heart, ArrowRight } from 'lucide-react';
import { TiltCard } from './TiltCard';
import { SmartImage } from './SmartImage';

export const FeaturedTrips: React.FC = () => {
  const { currentContent } = useTheme();
  const { toggleFavorite, isFavorite, openBookingModal } = useTrips();
  const trips = currentContent.items.slice(0, 3);

  return (
    <section className="relative py-28 px-6 sm:px-8 bg-[#0b0d10] text-white border-t border-white/8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Curated Departures
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-white mt-2">
              Featured Expeditions
            </h2>
          </div>
          <Link
            to="/trips"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>View all 42 city journeys</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trips.map((trip) => {
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
                    fallbackUrls={trip.fallbackUrls || (trip.gallery.length > 0 ? trip.gallery : undefined)}
                    placeName={trip.title}
                    alt={trip.title}
                    aspectRatio="16/10"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover filter brightness-[0.85] transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11151d] via-transparent to-black/30 pointer-events-none" />

                  {/* Top bar over image */}
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
                      title={favorited ? 'Remove from saved' : 'Save trip'}
                      className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                        favorited
                          ? 'bg-rose-500/80 text-white border-rose-400'
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
                      <span>{trip.groupSize}</span>
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
                        From
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
                        Details
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
      </div>
    </section>
  );
};
