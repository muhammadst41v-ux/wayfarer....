import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { pakistanDestinations } from '../data/pakistan';
import { PakistanDestination, PlaceItem } from '../types';
import { useTrips } from '../context/TripContext';
import { InteractiveMap } from '../components/InteractiveMap';
import { StaySection } from '../components/StaySection';
import { DestinationPhotosSection } from '../components/DestinationPhotosSection';
import { DestinationVideosSection } from '../components/DestinationVideosSection';
import { DestinationCultureSection } from '../components/DestinationCultureSection';
import { DestinationHistorySection } from '../components/DestinationHistorySection';
import { DestinationReviewsSection } from '../components/DestinationReviewsSection';
import { SmartImage } from '../components/SmartImage';
import {
  MapPin,
  Mountain,
  Compass,
  Calendar,
  ShieldCheck,
  Plane,
  Navigation,
  Plus,
  Check,
  Star,
  ExternalLink,
  ChevronLeft,
  Sun,
  CloudRain,
  Thermometer,
  BookOpen,
  Play,
  Heart,
  Share2,
  Utensils,
  Camera,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';

type DetailTab =
  | 'overview'
  | 'map'
  | 'stay'
  | 'eat'
  | 'things-to-do'
  | 'photos'
  | 'videos'
  | 'culture'
  | 'history'
  | 'weather'
  | 'reviews'
  | 'plan';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isSavedPlace, toggleSavedPlace, showToast } = useTrips();

  const destination: PakistanDestination | undefined = useMemo(() => {
    return pakistanDestinations.find((d) => d.slug === slug);
  }, [slug]);

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Wikipedia REST summary state
  const [wikiData, setWikiData] = useState<{
    title?: string;
    extract?: string;
    pageUrl?: string;
    thumbnail?: string;
  } | null>(null);

  // Open-Meteo weather state
  const [weatherData, setWeatherData] = useState<{
    temperature?: number;
    weatherCode?: number;
    windspeed?: number;
    dailyMax?: number[];
    dailyMin?: number[];
    dailyDates?: string[];
  } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Update Page Title and Meta for SEO
  useEffect(() => {
    if (destination) {
      document.title = `${destination.name} Tourist Guide & Dossier | Wayfarer Pakistan`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', destination.shortDescription);
      }
    }
  }, [destination]);

  // Fetch Wikipedia Summary
  useEffect(() => {
    if (!destination?.wikipediaTitle) return;

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destination.wikipediaTitle)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setWikiData({
            title: data.title,
            extract: data.extract,
            pageUrl: data.content_urls?.desktop?.page,
            thumbnail: data.thumbnail?.source,
          });
        }
      })
      .catch((err) => {
        console.warn('Wikipedia REST fetch skipped/fallback:', err);
      });
  }, [destination]);

  // Fetch Open-Meteo Weather
  useEffect(() => {
    if (!destination) return;
    setWeatherLoading(true);

    const { lat, lng } = destination.coordinates;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.current_weather) {
          setWeatherData({
            temperature: data.current_weather.temperature,
            weatherCode: data.current_weather.weathercode,
            windspeed: data.current_weather.windspeed,
            dailyMax: data.daily?.temperature_2m_max,
            dailyMin: data.daily?.temperature_2m_min,
            dailyDates: data.daily?.time,
          });
        }
        setWeatherLoading(false);
      })
      .catch((err) => {
        console.warn('Weather fetch fallback:', err);
        setWeatherLoading(false);
      });
  }, [destination]);

  if (!destination) {
    return (
      <div className="min-h-screen pt-36 pb-24 px-6 max-w-3xl mx-auto text-center">
        <Compass className="w-16 h-16 text-slate-500 mx-auto stroke-1 mb-4" />
        <h2 className="text-3xl font-bold font-serif text-white">Destination Dossier Not Found</h2>
        <p className="mt-3 text-slate-400">
          We could not locate this destination in our field archives. Explore our catalog of 20+ verified Pakistan regions.
        </p>
        <Link
          to="/destinations"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to All Destinations</span>
        </Link>
      </div>
    );
  }

  const isSaved = isSavedPlace(`dest-${destination.slug}`);

  return (
    <div className="min-h-screen bg-[#0b0d10] text-[#f3f4f6] pb-24">
      {/* JSON-LD Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TouristDestination',
            name: destination.name,
            description: destination.longDescription,
            touristType: destination.interests,
            containedInPlace: {
              '@type': 'AdministrativeArea',
              name: destination.region,
              containedInPlace: {
                '@type': 'Country',
                name: 'Pakistan',
              },
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: destination.coordinates.lat,
              longitude: destination.coordinates.lng,
            },
          }),
        }}
      />

      {/* Hero Header Banner */}
      <section className="relative pt-24 pb-12 lg:pb-16 overflow-hidden">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0 z-0">
          <SmartImage
            src={destination.heroImage}
            destinationSlug={destination.slug}
            wikipediaTitle={destination.wikipediaTitle}
            fallbackUrls={destination.fallbackUrls}
            placeName={destination.name}
            alt={destination.name}
            className="w-full h-full object-cover object-center filter brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/70 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-6">
            <Link to="/" className="hover:text-amber-400 transition-colors">
              Wayfarer
            </Link>
            <span>/</span>
            <Link to="/destinations" className="hover:text-amber-400 transition-colors">
              Destinations
            </Link>
            <span>/</span>
            <span className="text-amber-400">{destination.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-amber-400 mb-3">
                <span className="px-2.5 py-1 rounded bg-black/50 backdrop-blur-sm border border-amber-500/20">
                  {destination.region}
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Mountain className="w-3.5 h-3.5 text-amber-400" />
                  {destination.altitude}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-300">Difficulty: {destination.difficulty}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white tracking-tight leading-tight">
                {destination.name}
              </h1>

              <p className="mt-4 text-base md:text-lg text-slate-200 leading-relaxed max-w-2xl text-balance">
                {destination.shortDescription}
              </p>

              {/* Tags strip (unboxed clean typography) */}
              <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                {destination.tags.map((tag, i) => (
                  <React.Fragment key={i}>
                    <span>#{tag}</span>
                    {i < destination.tags.length - 1 && <span className="text-slate-600">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => toggleSavedPlace(`dest-${destination.slug}`, destination.name)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-lg ${
                  isSaved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md'
                }`}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isSaved ? 'In Your Itinerary' : 'Add to My Trip'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('plan');
                  const el = document.getElementById('tabs-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Plan This Place</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Tab Navigation Bar */}
      <div id="tabs-section" className="sticky top-16 z-40 bg-[#0b0d10]/95 backdrop-blur-md border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <div className="flex items-center gap-1 py-3 text-xs font-medium whitespace-nowrap min-w-max">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'map', label: 'Interactive Map' },
              { id: 'stay', label: 'Stay & Hotels' },
              { id: 'eat', label: 'Local Food' },
              { id: 'things-to-do', label: 'Highlights' },
              { id: 'photos', label: 'Photos & Gallery' },
              { id: 'videos', label: 'Videos & Vlogs' },
              { id: 'culture', label: 'Culture & Etiquette' },
              { id: 'history', label: 'History & Timeline' },
              { id: 'weather', label: 'Weather & Seasons' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'plan', label: 'Plan & Expeditions' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DetailTab)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tabbed Content Area */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Long narrative & Field Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
                    Field Narrative & Geography
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-white mt-1">
                    About {destination.name}
                  </h3>
                  <p className="mt-4 text-base text-slate-300 leading-relaxed">
                    {destination.longDescription}
                  </p>
                </div>

                {/* Wikipedia summary box */}
                {wikiData && (
                  <div className="p-5 rounded-2xl border border-white/10 bg-[#13171d]/80 text-xs text-slate-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-amber-500" />
                        Wikipedia Field Synopsis: {wikiData.title}
                      </span>
                      {wikiData.pageUrl && (
                        <a
                          href={wikiData.pageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          Read full article on Wikipedia
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="leading-relaxed text-slate-400">{wikiData.extract}</p>
                    <div className="text-[10px] text-slate-500 pt-1">
                      Text available under Creative Commons Attribution-ShareAlike 4.0 License.
                    </div>
                  </div>
                )}

                {/* Practical Logistics Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="p-5 rounded-xl border border-white/5 bg-[#13171d] space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                      <Plane className="w-4 h-4" />
                      <span>How to Reach by Air</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {destination.howToReach.air || 'Connected via Islamabad/Lahore domestic flight approaches.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-white/5 bg-[#13171d] space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                      <Navigation className="w-4 h-4" />
                      <span>Road & Highway Transit</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {destination.howToReach.road || 'Scenic highway journey with certified local drivers.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-white/5 bg-[#13171d] space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Permits & Entry Status</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {destination.permitsNeeded}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-white/5 bg-[#13171d] space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                      <Info className="w-4 h-4" />
                      <span>Safety & Altitude Notes</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {destination.safetyNotes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Quick Cards */}
              <div className="lg:col-span-4 space-y-6">
                {/* Daily Budget Card */}
                <div className="p-6 rounded-2xl border border-white/10 bg-[#13171d]">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
                    Estimated Daily Budget (USD)
                  </span>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs text-slate-400">Budget Traveler</span>
                      <span className="text-sm font-mono font-semibold text-white">
                        ${destination.estimatedDailyBudget.budget} / day
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs text-slate-400">Mid-Range (Private 4x4)</span>
                      <span className="text-sm font-mono font-semibold text-amber-400">
                        ${destination.estimatedDailyBudget.mid} / day
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Luxury / Palace Lodges</span>
                      <span className="text-sm font-mono font-semibold text-white">
                        ${destination.estimatedDailyBudget.luxury} / day
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-4 leading-normal">
                    *Covers food, lodging, transport shares, and standard park entrance fees.
                  </p>
                </div>

                {/* Best Season Card */}
                <div className="p-6 rounded-2xl border border-white/10 bg-[#13171d]">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
                    Best Visiting Months
                  </span>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
                      (month) => {
                        const isOptimal = destination.bestMonths.some((m) =>
                          m.toLowerCase().startsWith(month.toLowerCase()) || m === 'All Year'
                        );
                        return (
                          <span
                            key={month}
                            className={`px-2.5 py-1 rounded text-xs font-mono font-medium ${
                              isOptimal
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                                : 'bg-white/5 text-slate-600'
                            }`}
                          >
                            {month}
                          </span>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Quick Map Preview */}
                <div className="p-6 rounded-2xl border border-white/10 bg-[#13171d] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
                      Geographic Coordinates
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {destination.coordinates.lat.toFixed(4)}° N, {destination.coordinates.lng.toFixed(4)}° E
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    <span>View on Full Interactive Map</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MAP */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
                Satellite & Cartographic Exploration
              </span>
              <h3 className="text-2xl font-bold font-serif text-white mt-1">
                Regional Map of {destination.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Toggle layers to view hotels, verified restaurants, hospitals, ATMs, and scenic viewpoints around {destination.name}.
              </p>
            </div>

            <InteractiveMap
              destinationSlug={destination.slug}
              initialCenter={destination.coordinates}
              initialZoom={10}
              height="650px"
            />
          </div>
        )}

        {/* TAB: STAY */}
        {activeTab === 'stay' && (
          <StaySection destinationSlug={destination.slug} destinationName={destination.name} />
        )}

        {/* TAB: EAT / FOOD */}
        {activeTab === 'eat' && (
          <div className="space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
                Gastronomy & Local Produce
              </span>
              <h3 className="text-2xl font-bold font-serif text-white mt-1">
                Local Food & Specialities in {destination.name}
              </h3>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Every valley in Pakistan carries distinct culinary traditions refined over centuries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destination.localFood.map((dish, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-white/10 bg-[#13171d] hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-white font-serif">{dish.name}</h4>
                  </div>
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">{dish.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: THINGS TO DO */}
        {activeTab === 'things-to-do' && (
          <div className="space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
                Curated Field Itineraries
              </span>
              <h3 className="text-2xl font-bold font-serif text-white mt-1">
                Top Experiences & Sights in {destination.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-white/10 bg-[#13171d] hover:border-amber-500/50 transition-all space-y-3"
                >
                  <span className="text-2xl font-bold font-serif text-amber-500">0{idx + 1}.</span>
                  <h4 className="text-base font-semibold text-white">{highlight}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Verified by Wayfarer mountain guides and foreign alumni expeditions.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PHOTOS & GALLERY */}
        {activeTab === 'photos' && (
          <DestinationPhotosSection destination={destination} />
        )}

        {/* TAB: VIDEOS */}
        {activeTab === 'videos' && (
          <DestinationVideosSection destination={destination} />
        )}

        {/* TAB: CULTURE & ETIQUETTE */}
        {activeTab === 'culture' && (
          <DestinationCultureSection destination={destination} />
        )}

        {/* TAB: HISTORY & TIMELINE */}
        {activeTab === 'history' && (
          <DestinationHistorySection destination={destination} />
        )}

        {/* TAB: WEATHER */}
        {activeTab === 'weather' && (
          <div className="space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
                Open-Meteo High-Resolution Live Forecast
              </span>
              <h3 className="text-2xl font-bold font-serif text-white mt-1">
                Weather in {destination.name}
              </h3>
            </div>

            {weatherData ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Current temperature card */}
                <div className="md:col-span-4 p-8 rounded-2xl border border-white/10 bg-[#13171d] flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase">Live Weather</span>
                    <div className="text-5xl font-bold font-mono text-white mt-3 flex items-center gap-2">
                      <Thermometer className="w-10 h-10 text-amber-500" />
                      <span>{weatherData.temperature}°C</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Wind: {weatherData.windspeed} km/h · Altitude: {destination.altitude}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/5 text-[11px] text-slate-500">
                    Source: Open-Meteo API (Keyless Real-Time Satellite Model)
                  </div>
                </div>

                {/* 7-day outlook */}
                <div className="md:col-span-8 p-8 rounded-2xl border border-white/10 bg-[#13171d]">
                  <h4 className="text-sm font-semibold text-white mb-4">
                    Daily Temperature Outlook
                  </h4>
                  {weatherData.dailyDates && weatherData.dailyMax ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                      {weatherData.dailyDates.slice(0, 7).map((date, idx) => (
                        <div
                          key={date}
                          className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center space-y-1"
                        >
                          <span className="text-[10px] font-mono text-slate-400 block">
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className="text-sm font-bold text-white block">
                            {weatherData.dailyMax?.[idx]}°
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {weatherData.dailyMin?.[idx]}°
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Weekly outlook loading...</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-white/10 bg-[#13171d] text-center text-xs text-slate-400">
                {weatherLoading ? 'Connecting to Open-Meteo...' : 'Seasonal mountain conditions active.'}
              </div>
            )}
          </div>
        )}

        {/* TAB: REVIEWS */}
        {activeTab === 'reviews' && (
          <DestinationReviewsSection destination={destination} />
        )}

        {/* TAB: PLAN THIS PLACE */}
        {activeTab === 'plan' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-8 md:p-12 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#13171d] to-[#1a202c] shadow-2xl space-y-6">
              <div className="max-w-2xl">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
                  Custom Tailored Journey
                </span>
                <h3 className="text-3xl font-bold font-serif text-white mt-1">
                  Plan Your Journey to {destination.name}
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Craft a multi-day itinerary including {destination.name}, private 4x4 Prado transport, boutique heritage lodging,
                  and local certified guides.
                </p>
              </div>

              {/* Quick Logistics & Budget Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-amber-400 block">
                    Daily Budget Estimates:
                  </span>
                  <div className="space-y-0.5 text-slate-300">
                    <div>Budget: <strong className="text-white">${destination.estimatedDailyBudget.budget} / day</strong></div>
                    <div>Mid-Range: <strong className="text-white">${destination.estimatedDailyBudget.mid} / day</strong></div>
                    <div>Luxury: <strong className="text-white">${destination.estimatedDailyBudget.luxury} / day</strong></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-amber-400 block">
                    Permits & Checkpoints:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {destination.permitsNeeded}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-amber-400 block">
                    Transit Method:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {destination.howToReach.air
                      ? `Flight: ${destination.howToReach.air}`
                      : destination.howToReach.road
                        ? `Road: ${destination.howToReach.road.slice(0, 90)}...`
                        : 'Road or scenic overland transfer.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                <Link
                  to={`/planner`}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Interactive Trip Planner</span>
                </Link>

                <button
                  onClick={() => {
                    toggleSavedPlace(`dest-${destination.slug}`, destination.name);
                  }}
                  className="px-6 py-3.5 rounded-xl border border-white/20 text-white font-semibold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
                >
                  {isSaved ? '✓ Saved in My Itinerary' : '+ Save to My Trips'}
                </button>

                <Link
                  to="/contact"
                  className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 font-semibold text-xs uppercase tracking-wider transition-colors"
                >
                  Inquire with Wayfarer Scout Desk
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
