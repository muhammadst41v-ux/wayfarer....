import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { PlaceItem, PakistanDestination } from '../types';
import { pakistanDestinations, pakistanPlaces } from '../data/pakistan';
import { useTrips } from '../context/TripContext';
import {
  MapPin,
  Hotel,
  Utensils,
  Landmark,
  Cross,
  CreditCard,
  Plane,
  Navigation,
  Plus,
  Check,
  Star,
  ExternalLink,
  Phone,
  Layers,
  Car,
  Compass,
} from 'lucide-react';

export type MapLayerFilter = 'all' | 'destinations' | 'hotel' | 'restaurant' | 'attraction' | 'hospital' | 'atm' | 'airport' | 'rent';

interface InteractiveMapProps {
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  destinationSlug?: string;
  height?: string;
  interactive?: boolean;
  selectedPlaceId?: string | null;
  onSelectPlace?: (place: PlaceItem | null) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  initialCenter,
  initialZoom = 6,
  destinationSlug,
  height = '600px',
  interactive = true,
  selectedPlaceId,
  onSelectPlace,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const { isSavedPlace, toggleSavedPlace } = useTrips();

  const [activeLayer, setActiveLayer] = useState<MapLayerFilter>('all');
  const [activePlace, setActivePlace] = useState<PlaceItem | null>(null);

  // Determine destinations to display
  const targetDestination = useMemo(() => {
    if (!destinationSlug) return null;
    return pakistanDestinations.find((d) => d.slug === destinationSlug) || null;
  }, [destinationSlug]);

  // Aggregate places based on scope
  const availablePlaces = useMemo<PlaceItem[]>(() => {
    let places = pakistanPlaces;
    if (destinationSlug) {
      places = places.filter((p) => p.destinationSlug === destinationSlug);
    }
    return places;
  }, [destinationSlug]);

  // Filtered items based on active layer toggle
  const visiblePlaces = useMemo(() => {
    if (activeLayer === 'all') return availablePlaces;
    if (activeLayer === 'hotel') {
      return availablePlaces.filter((p) => ['hotel', 'guesthouse', 'hostel', 'camping', 'homestay'].includes(p.type));
    }
    if (activeLayer === 'restaurant') {
      return availablePlaces.filter((p) => p.type === 'restaurant');
    }
    if (activeLayer === 'attraction') {
      return availablePlaces.filter((p) => p.type === 'attraction');
    }
    if (activeLayer === 'hospital') {
      return availablePlaces.filter((p) => p.type === 'hospital');
    }
    if (activeLayer === 'atm') {
      return availablePlaces.filter((p) => p.type === 'atm');
    }
    if (activeLayer === 'airport') {
      return availablePlaces.filter((p) => p.type === 'airport');
    }
    if (activeLayer === 'rent') {
      return availablePlaces.filter((p) => ['apartment', 'car_rental', 'bike_rental'].includes(p.type));
    }
    return availablePlaces;
  }, [activeLayer, availablePlaces]);

  // Calculate default center
  const defaultCenter = useMemo(() => {
    if (initialCenter) return initialCenter;
    if (targetDestination) return targetDestination.coordinates;
    return { lat: 31.8, lng: 72.5 }; // Geometric center of Pakistan
  }, [initialCenter, targetDestination]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [defaultCenter.lat, defaultCenter.lng],
        zoom: targetDestination ? (initialZoom > 8 ? initialZoom : 10) : initialZoom,
        zoomControl: false,
        attributionControl: false,
        dragging: interactive,
        scrollWheelZoom: interactive ? 'center' : false,
      });

      // CartoDB Dark Matter / Voyager tiles for ultra-modern aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add quiet attribution control bottom right
      L.control
        .attribution({
          position: 'bottomright',
          prefix: '<span class="text-[10px] text-slate-500">© OpenStreetMap · CartoDB · Wayfarer</span>',
        })
        .addTo(map);

      // Add refined Zoom Control
      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync center if destination or prop changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      const currentZoom = targetDestination ? 10 : initialZoom;
      mapInstanceRef.current.setView([defaultCenter.lat, defaultCenter.lng], currentZoom, {
        animate: true,
      });
    }
  }, [defaultCenter, initialZoom, targetDestination]);

  // Helper to generate custom SVG marker icons
  const createMarkerIcon = (type: string, isHighlighted: boolean) => {
    let bgColor = '#f59e0b'; // amber
    let iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

    if (['hotel', 'guesthouse', 'hostel', 'camping', 'homestay'].includes(type)) {
      bgColor = '#10b981'; // emerald
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>`;
    } else if (type === 'restaurant') {
      bgColor = '#f97316'; // orange
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M9 2v12"/><path d="M6 2v12"/><circle cx="18" cy="17" r="4"/><path d="M18 14v6"/></svg>`;
    } else if (type === 'attraction' || type === 'destination') {
      bgColor = '#f59e0b'; // amber gold
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`;
    } else if (type === 'hospital') {
      bgColor = '#ef4444'; // red
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>`;
    } else if (type === 'atm') {
      bgColor = '#06b6d4'; // cyan
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`;
    } else if (type === 'airport') {
      bgColor = '#8b5cf6'; // purple
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`;
    } else if (type === 'car_rental' || type === 'bike_rental') {
      bgColor = '#3b82f6'; // blue
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`;
    }

    const size = isHighlighted ? 38 : 30;
    const ring = isHighlighted ? 'ring-4 ring-amber-400 ring-offset-2' : 'shadow-lg';

    return L.divIcon({
      className: 'custom-pin-marker',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${bgColor};
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          border: 2px solid #ffffff;
          transition: transform 0.2s ease;
          cursor: pointer;
        " class="${ring}">
          ${iconSvg}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Re-draw markers on map when items or active layer changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. If we are on national view and 'destinations' layer or 'all' is active, render destination macro pins
    if (!destinationSlug && (activeLayer === 'all' || activeLayer === 'destinations')) {
      pakistanDestinations.forEach((dest) => {
        const marker = L.marker([dest.coordinates.lat, dest.coordinates.lng], {
          icon: createMarkerIcon('destination', false),
          title: dest.name,
        });

        marker.on('click', () => {
          // Wrap destination as a pseudo PlaceItem for the card
          const placeRepresentation: PlaceItem = {
            id: `dest-card-${dest.id}`,
            name: dest.name,
            destinationSlug: dest.slug,
            type: 'attraction',
            categoryLabel: `${dest.region} · ${dest.altitude}`,
            rating: 4.9,
            reviewCount: 320,
            priceLevel: 2,
            priceRangeEstimate: `$${dest.estimatedDailyBudget.budget} - $${dest.estimatedDailyBudget.mid} / day (est.)`,
            address: `${dest.name}, ${dest.region}, Pakistan`,
            coordinates: dest.coordinates,
            photos: [dest.heroImage, ...(dest.gallery || [])],
            source: 'curated',
            bookingLinks: {
              googleMaps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.name + ' Pakistan')}`,
            },
          };
          setActivePlace(placeRepresentation);
          onSelectPlace?.(placeRepresentation);
          mapInstanceRef.current?.panTo([dest.coordinates.lat, dest.coordinates.lng]);
        });

        marker.addTo(markersLayerRef.current!);
      });
    }

    // 2. Render all visible places (hotels, restaurants, hospitals, ATMs, rentals)
    visiblePlaces.forEach((place) => {
      const isSelected = selectedPlaceId === place.id || activePlace?.id === place.id;
      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
        icon: createMarkerIcon(place.type, isSelected),
        title: place.name,
      });

      marker.on('click', () => {
        setActivePlace(place);
        onSelectPlace?.(place);
        mapInstanceRef.current?.panTo([place.coordinates.lat, place.coordinates.lng]);
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [visiblePlaces, activeLayer, destinationSlug, selectedPlaceId, activePlace]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-[#0b0d10] shadow-xl">
      {/* Layer Toggles Floating Bar */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-white/95 dark:bg-[#13171d]/95 backdrop-blur-md border border-slate-200/70 dark:border-white/10 shadow-lg text-xs font-medium max-w-[calc(100%-4rem)] sm:max-w-none overflow-x-auto">
        <button
          onClick={() => setActiveLayer('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeLayer === 'all'
              ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Layers</span>
        </button>

        {!destinationSlug && (
          <button
            onClick={() => setActiveLayer('destinations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeLayer === 'destinations'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>20+ Destinations</span>
          </button>
        )}

        <button
          onClick={() => setActiveLayer('hotel')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeLayer === 'hotel'
              ? 'bg-emerald-500 text-white font-semibold shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Hotel className="w-3.5 h-3.5" />
          <span>Stays & Hotels</span>
        </button>

        <button
          onClick={() => setActiveLayer('restaurant')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeLayer === 'restaurant'
              ? 'bg-orange-500 text-white font-semibold shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Restaurants</span>
        </button>

        <button
          onClick={() => setActiveLayer('attraction')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeLayer === 'attraction'
              ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Attractions</span>
        </button>

        <button
          onClick={() => setActiveLayer('rent')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeLayer === 'rent'
              ? 'bg-blue-500 text-white font-semibold shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Rentals & 4x4</span>
        </button>

        <button
          onClick={() => setActiveLayer('hospital')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeLayer === 'hospital'
              ? 'bg-rose-500 text-white font-semibold shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Cross className="w-3.5 h-3.5" />
          <span>Hospitals</span>
        </button>

        <button
          onClick={() => setActiveLayer('atm')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeLayer === 'atm'
              ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>ATMs</span>
        </button>

        <button
          onClick={() => setActiveLayer('airport')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeLayer === 'airport'
              ? 'bg-purple-500 text-white font-semibold shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>Airports</span>
        </button>
      </div>

      {/* The Leaflet Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />

      {/* Selected Marker Detail Card (floating bottom-left) */}
      {activePlace && (
        <div className="absolute bottom-6 left-6 z-[1000] w-[calc(100%-3rem)] max-w-sm rounded-xl bg-white/95 dark:bg-[#13171d]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-2xl p-4 transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono tracking-wider uppercase text-amber-600 dark:text-amber-400">
                {activePlace.categoryLabel || activePlace.type}
              </span>
              <h4 className="text-base font-semibold text-slate-900 dark:text-white mt-0.5 leading-snug">
                {activePlace.name}
              </h4>
            </div>

            <button
              onClick={() => setActivePlace(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-md"
              aria-label="Close detail card"
            >
              ✕
            </button>
          </div>

          {activePlace.photos && activePlace.photos.length > 0 && (
            <div className="mt-2.5 relative h-32 rounded-lg overflow-hidden bg-slate-900">
              <img
                src={activePlace.photos[0]}
                alt={activePlace.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80';
                  } else {
                    target.style.display = 'none';
                  }
                }}
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-white text-[11px]">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{activePlace.rating}</span>
                <span className="text-slate-300">({activePlace.reviewCount})</span>
              </div>
            </div>
          )}

          <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span className="truncate">{activePlace.address}</span>
            </div>

            {activePlace.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <a
                  href={`tel:${activePlace.phone}`}
                  className="hover:text-amber-500 transition-colors"
                >
                  {activePlace.phone}
                </a>
              </div>
            )}

            {activePlace.priceRangeEstimate && (
              <div className="text-[11px] text-amber-600 dark:text-amber-400/90 font-medium pt-1">
                Estimated: {activePlace.priceRangeEstimate}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activePlace.coordinates.lat},${activePlace.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>

            <button
              onClick={() => toggleSavedPlace(activePlace.id, activePlace.name)}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center ${
                isSavedPlace(activePlace.id)
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 dark:text-amber-400'
                  : 'border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:border-amber-500'
              }`}
              title={isSavedPlace(activePlace.id) ? 'Saved in my trip plan' : 'Add to my trip'}
            >
              {isSavedPlace(activePlace.id) ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>

            {activePlace.website && (
              <a
                href={activePlace.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-xs font-medium border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:border-amber-500 transition-colors"
                title="Visit website"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
