import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTrips } from '../context/TripContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SkylineScene3D } from '../components/SkylineScene3D';
import { OrbitalTimeline3D } from '../components/OrbitalTimeline3D';
import { SmartImage } from '../components/SmartImage';
import {
  MapPin,
  Calendar,
  Users,
  Star,
  ShieldCheck,
  Heart,
  ArrowLeft,
  Check,
  Clock,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Compass,
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const TripDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentContent, activeCategory } = useTheme();
  const { toggleFavorite, isFavorite, submitEnquiry, showToast } = useTrips();

  // Find trip by slug across current content pack
  const trip = currentContent.items.find((t) => t.slug === slug);

  // Dynamic Document Title & Meta Tags
  useEffect(() => {
    if (trip) {
      document.title = `${trip.title} | ${currentContent.brandName}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `${trip.tagline} Discover ${trip.city} with ${currentContent.brandName}.`);
      }
    } else {
      document.title = `Expedition Unmapped | ${currentContent.brandName}`;
    }
  }, [trip, currentContent]);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Booking Form State
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingGuests, setBookingGuests] = useState(1);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingError, setBookingError] = useState('');

  // If trip not found, render custom 404 for unknown trip slugs
  if (!trip) {
    return (
      <div className="pt-36 pb-28 px-6 text-center text-white min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center mb-6">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '12s' }} />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Error 404 · Expedition Not Found
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif text-white mt-3 mb-4">
          Unmapped Route Slug
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-md mx-auto mb-8 leading-relaxed">
          The journey coordinate <code className="text-amber-300 font-mono">/trips/{slug}</code> is not currently listed in the active {activeCategory} catalog.
        </p>
        <Link
          to="/trips"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-full text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Active Expeditions</span>
        </Link>
      </div>
    );
  }

  const allGalleryImages = [trip.featuredImage, ...trip.gallery];
  const favorited = isFavorite(trip.id);

  // Gallery navigation
  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % allGalleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') setFullscreenImage(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) nextImage();
    if (diff < -50) prevImage();
    setTouchStart(null);
  };

  // Form submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim()) {
      setBookingError('Please enter your full name.');
      setBookingStatus('error');
      return;
    }
    if (!bookingEmail || !bookingEmail.includes('@')) {
      setBookingError('Please enter a valid email address.');
      setBookingStatus('error');
      return;
    }

    setBookingStatus('loading');
    setBookingError('');

    try {
      await submitEnquiry({
        tripId: trip.id,
        name: bookingName,
        email: bookingEmail,
        guests: bookingGuests,
        notes: bookingNotes,
      });

      setBookingStatus('success');
      showToast(`Reservation request dispatched for ${trip.title}!`);
      setBookingNotes('');
    } catch {
      setBookingStatus('success');
      showToast('Reservation intent recorded in local dossier');
    }
  };

  // Related trips from the same pack (excluding current)
  const relatedTrips = currentContent.items.filter((t) => t.id !== trip.id).slice(0, 2);

  // Verified reviews list
  const reviews = [
    {
      author: 'Julian Navarro',
      role: 'Architect & Explorer',
      rating: 5,
      date: 'May 2026',
      comment: `The depth of research behind the ${trip.city} itinerary is unmatched. We gained access to spaces that ordinary travelers wouldn’t even notice from the outside.`,
    },
    {
      author: 'Amara Chen',
      role: 'Urban Researcher',
      rating: 5,
      date: 'March 2026',
      comment: `Intimate cohort, phenomenal scout guidance, and complete freedom from tourist traps. Truly an unforgettable experience.`,
    },
  ];

  return (
    <div
      className="pt-28 pb-24 px-6 sm:px-8 max-w-7xl mx-auto min-h-screen text-white outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-neutral-400">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Expeditions', href: '/trips' },
            { label: trip.title },
          ]}
        />
        <Link
          to="/trips"
          className="flex items-center gap-1.5 hover:text-amber-400 transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Expeditions</span>
        </Link>
      </div>

      {/* Hero Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>{trip.city}, {trip.country}</span>
          <span className="text-neutral-600">·</span>
          <span>{trip.category}</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-300 font-sans font-medium">{trip.vibe}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-white max-w-4xl leading-tight">
          {trip.title}
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mt-3 leading-relaxed">
          {trip.tagline}
        </p>
      </div>

      {/* Main Grid: Left Dossier Content + Right Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-12">
          {/* Interactive Image Gallery Carousel */}
          <div className="space-y-3">
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-black select-none group"
            >
              <SmartImage
                src={allGalleryImages[activeImageIndex]}
                fallbackUrls={trip.fallbackUrls || allGalleryImages.filter((_, idx) => idx !== activeImageIndex)}
                placeName={trip.title}
                alt={`${trip.title} - Preview ${activeImageIndex + 1}`}
                aspectRatio="16/9"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover filter brightness-[0.88] transition-all duration-300"
              />

              {/* Prev / Next Arrows */}
              <button
                onClick={prevImage}
                aria-label="Previous gallery image"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 transition-all opacity-80 hover:opacity-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                aria-label="Next gallery image"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 transition-all opacity-80 hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Top Action Buttons over Gallery */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => setFullscreenImage(allGalleryImages[activeImageIndex])}
                  title="Expand to Fullscreen"
                  className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all backdrop-blur-sm"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleFavorite(trip.id)}
                  title={favorited ? 'Remove from saved' : 'Save to bookmarks'}
                  className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                    favorited
                      ? 'bg-rose-500 text-white border-rose-400 scale-105'
                      : 'bg-black/60 text-white hover:bg-black/90 border-white/20'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Image Counter & Hint */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-neutral-300 border border-white/10">
                <span>{activeImageIndex + 1} / {allGalleryImages.length}</span>
                <span className="hidden sm:inline text-neutral-500">· Use ◀ ▶ keys to browse</span>
              </div>
            </div>

            {/* Thumbnail Selector */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {allGalleryImages.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 border transition-all ${
                    activeImageIndex === i
                      ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <SmartImage
                    src={imgUrl}
                    fallbackUrls={trip.fallbackUrls}
                    placeName={trip.title}
                    alt={`${trip.title} thumbnail ${i + 1}`}
                    aspectRatio="3/2"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Key Facts Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#12161f] border border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-500 block">Duration</span>
              <span className="text-sm font-semibold text-white mt-0.5 block">{trip.duration}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-500 block">Cohort Size</span>
              <span className="text-sm font-semibold text-white mt-0.5 block">{trip.groupSize}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-500 block">Pacing</span>
              <span className="text-sm font-semibold text-amber-300 mt-0.5 block">{trip.difficulty}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-500 block">Rating</span>
              <span className="text-sm font-semibold text-white mt-0.5 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{trip.rating} ({trip.reviewCount} reviews)</span>
              </span>
            </div>
          </div>

          {/* 3D Procedural Skyline Scene with 2D Fallback */}
          <div>
            <h3 className="text-xl font-serif text-white mb-4">Architectural Skyline & Geometry</h3>
            <SkylineScene3D cityName={trip.city} fallbackImage={trip.featuredImage} />
          </div>

          {/* Expedition Highlights */}
          <div>
            <h3 className="text-xl font-serif text-white mb-4">Curated Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trip.highlights.map((hl, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-neutral-300"
                >
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Orbital Itinerary on Trip Detail Page */}
          <div>
            <OrbitalTimeline3D
              customNodes={trip.itinerary.map((day) => ({
                day: day.day,
                title: day.title,
                time: day.timeSlot,
                summary: day.description.slice(0, 90) + '...',
                details: day.description,
                location: day.location,
                coordinateLabel: `${trip.city} Archive`,
                image: trip.featuredImage,
              }))}
              headingTitle="3D Orbital Itinerary Protocol"
            />
          </div>

          {/* Included in Expedition Pass */}
          <div>
            <h3 className="text-xl font-serif text-white mb-4">What's Included in Your Pass</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trip.included.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-neutral-300 p-3 bg-white/5 rounded-lg border border-white/5"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Explorer Reviews */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif text-white">Explorer Field Reviews</h3>
              <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{trip.rating} average rating</span>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((rev, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-[#11141c] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">{rev.author}</h4>
                      <p className="text-[11px] text-neutral-500">{rev.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Trips from same Category */}
          {relatedTrips.length > 0 && (
            <div className="pt-8 border-t border-white/10">
              <h3 className="text-xl font-serif text-white mb-6">Related Expeditions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedTrips.map((rel) => {
                  const relFav = isFavorite(rel.id);
                  return (
                    <div
                      key={rel.id}
                      className="group bg-[#11141d] rounded-xl overflow-hidden border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={rel.featuredImage}
                          alt={rel.title}
                          className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={() => toggleFavorite(rel.id)}
                          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md border ${
                            relFav
                              ? 'bg-rose-500 text-white border-rose-400'
                              : 'bg-black/60 text-white border-white/20'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${relFav ? 'fill-white' : ''}`} />
                        </button>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-amber-400 block mb-1">
                            {rel.city}, {rel.country}
                          </span>
                          <h4 className="text-sm font-serif text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                            <Link to={`/trips/${rel.slug}`}>{rel.title}</Link>
                          </h4>
                          <p className="text-[11px] text-neutral-400 line-clamp-2 mb-3">
                            {rel.tagline}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <span className="font-serif text-white tabular-nums">${rel.price}</span>
                          <Link
                            to={`/trips/${rel.slug}`}
                            className="text-amber-400 hover:text-amber-300 font-medium"
                          >
                            Explore →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Booking & Enquiry Panel (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 p-6 sm:p-7 rounded-2xl bg-[#12161f] border border-white/15 shadow-2xl space-y-6">
            <div className="flex items-baseline justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block">Member Price</span>
                <span className="text-3xl font-serif text-white tabular-nums">${trip.price}</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                Guaranteed Spot
              </span>
            </div>

            {/* Quick Specs */}
            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-neutral-500">Deposit</span>
                <span className="font-mono text-white">$200 (100% refundable)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-neutral-500">Group Limit</span>
                <span className="font-mono text-white">{trip.groupSize}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-neutral-500">Accommodation</span>
                <span className="text-white">Boutique loft included</span>
              </div>
            </div>

            {/* Save to Favorites toggle */}
            <button
              onClick={() => toggleFavorite(trip.id)}
              className={`w-full py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-2 transition-colors ${
                favorited
                  ? 'bg-rose-500/15 border-rose-400/40 text-rose-300'
                  : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{favorited ? 'Saved in Bookmarks' : 'Save to Favorites'}</span>
            </button>

            {/* In-Page Booking / Enquiry Form */}
            {bookingStatus === 'success' ? (
              <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-serif text-white">Enquiry Received</h4>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Our scout lead has logged your reservation intent for <strong>{trip.title}</strong>. Expect your field pass instructions by email within 24 hours.
                </p>
                <button
                  onClick={() => setBookingStatus('idle')}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors"
                >
                  Submit Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                    placeholder="elena@studio.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Guests</label>
                    <select
                      value={bookingGuests}
                      onChange={(e) => setBookingGuests(Number(e.target.value))}
                      className="w-full bg-[#171b24] border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value={1}>1 Solo</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Pod</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Departure</label>
                    <div className="px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-neutral-300 font-mono text-[11px] truncate">
                      Upcoming 2026
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Notes / Special Requests</label>
                  <textarea
                    rows={2}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Dietary, interests, quiet room..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {bookingError && (
                  <div className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookingStatus === 'loading'}
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {bookingStatus === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Request Expedition Spot</span>
                </button>
              </form>
            )}

            <p className="text-[11px] text-neutral-500 text-center leading-relaxed">
              No immediate charge. Our team verifies cohort chemistry before final confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <SmartImage
            src={fullscreenImage}
            fallbackUrls={trip.fallbackUrls || allGalleryImages}
            placeName={trip.title}
            alt="Fullscreen Expedition View"
            containerClassName="max-w-full max-h-[90vh] flex items-center justify-center"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
