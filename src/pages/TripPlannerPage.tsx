import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { pakistanDestinations } from '../data/pakistan';
import { PakistanDestination, PlaceItem } from '../types';
import { useTrips } from '../context/TripContext';
import {
  Compass,
  Calendar,
  DollarSign,
  Mountain,
  MapPin,
  Clock,
  Printer,
  Share2,
  Check,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Car,
  Hotel,
  Utensils,
  Download,
  CheckSquare,
  Square,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DaySchedule {
  dayNumber: number;
  destinationSlug: string;
  destinationName: string;
  region: string;
  morning: string;
  lunch: string;
  afternoon: string;
  evening: string;
  staySuggestion: string;
  altitudeCheck?: string;
  logisticsTip?: string;
}

interface CustomRouteTemplate {
  id: string;
  name: string;
  days: number;
  tagline: string;
  difficulty: string;
  destinations: string[];
}

const PRESET_ROUTES: CustomRouteTemplate[] = [
  {
    id: 'kkh-classic',
    name: 'Karakoram Highway & Silk Road Spire',
    days: 8,
    tagline: 'From Islamabad through Hunza Valley, Passu Cones to the 4,693m Khunjerab Pass.',
    difficulty: 'Moderate',
    destinations: ['islamabad', 'naran-kaghan', 'hunza', 'fairy-meadows'],
  },
  {
    id: 'baltistan-giants',
    name: 'Skardu, Deosai Plains & K2 Gateway',
    days: 7,
    tagline: 'High-altitude cold deserts, Sheosar mirror lake, and 400-year-old Tibetan forts.',
    difficulty: 'Challenging',
    destinations: ['islamabad', 'skardu', 'deosai', 'k2-base-camp'],
  },
  {
    id: 'mughal-heritage',
    name: 'Mughal Splendor & Sufi Sacred Trail',
    days: 6,
    tagline: 'The Walled City of Lahore, blue-tiled shrines of Multan, and Cholistan Desert.',
    difficulty: 'Easy',
    destinations: ['lahore', 'multan', 'derawar-fort', 'karachi'],
  },
  {
    id: 'gandhara-swat',
    name: 'Emerald Swat Valley & Ancient Gandhara',
    days: 5,
    tagline: 'Greco-Buddhist stupas, pine-clad mountain ridges, and white-water rivers.',
    difficulty: 'Easy',
    destinations: ['islamabad', 'taxila', 'swat', 'peshawar'],
  },
];

export const TripPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useTrips();

  // Wizard Configuration State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('kkh-classic');
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([
    'islamabad',
    'naran-kaghan',
    'hunza',
    'fairy-meadows',
  ]);
  const [durationDays, setDurationDays] = useState<number>(8);
  const [travelStyle, setTravelStyle] = useState<'budget' | 'explorer' | 'luxury'>('explorer');
  const [season, setSeason] = useState<string>('summer'); // summer (Jul-Sep), spring (Apr-Jun), autumn (Oct-Nov), winter (Dec-Feb)
  const [groupSize, setGroupSize] = useState<number>(2);
  const [transportChoice, setTransportChoice] = useState<'prado' | 'hiace' | 'flight'>('prado');

  // UI state
  const [isCopied, setIsCopied] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    thermal: true,
    boots: true,
    scom: false,
    cash: false,
    evisa: true,
    sunscreen: false,
    water: false,
  });

  // Page title
  useEffect(() => {
    document.title = 'Interactive Expedition Planner | Wayfarer Pakistan';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Build a custom multi-day Pakistan itinerary: Karakoram Highway, Hunza, Skardu, Deosai, Lahore. Day-by-day logistics, cost estimator, packing checklist, and PDF export.'
      );
    }
  }, []);

  // Handle Preset Selection
  const applyPreset = (preset: CustomRouteTemplate) => {
    setSelectedTemplateId(preset.id);
    setSelectedDestinations(preset.destinations);
    setDurationDays(preset.days);
  };

  // Toggle Custom Destination
  const toggleDestination = (slug: string) => {
    setSelectedDestinations((prev) => {
      if (prev.includes(slug)) {
        if (prev.length <= 1) return prev; // keep at least 1
        return prev.filter((s) => s !== slug);
      } else {
        if (prev.length >= 6) {
          showToast('Maximum 6 destinations per expedition route.');
          return prev;
        }
        return [...prev, slug];
      }
    });
  };

  // Generate dynamic day-by-day plan based on selected destinations and days
  const generatedItinerary: DaySchedule[] = useMemo(() => {
    const matchedDests = selectedDestinations
      .map((slug) => pakistanDestinations.find((d) => d.slug === slug))
      .filter((d): d is PakistanDestination => Boolean(d));

    if (matchedDests.length === 0) return [];

    const schedule: DaySchedule[] = [];

    for (let day = 1; day <= durationDays; day++) {
      // Rotate destinations proportionally over days
      const destIndex = Math.min(
        matchedDests.length - 1,
        Math.floor(((day - 1) / durationDays) * matchedDests.length)
      );
      const curr = matchedDests[destIndex];

      let morning = `Depart for morning field scout in ${curr.name}.`;
      let lunch = `Local tasting: ${curr.localFood[0]?.name || 'Regional flatbreads & mountain tea'}.`;
      let afternoon = `Explore ${curr.highlights[0] || 'panoramic viewpoints and heritage alleys'}.`;
      let evening = `Sunset golden hour over the ridges; evening campfire briefing.`;
      let staySuggestion = curr.places?.find((p) => p.type === 'hotel')?.name || `${curr.name} Heritage Lodge`;
      let altitudeCheck = `${curr.altitude} elevation. Ensure gradual acclimatization and hydration.`;
      let logisticsTip = curr.howToReach.road
        ? `Recommended travel method: ${curr.howToReach.road.slice(0, 80)}...`
        : (curr.howToReach.air ? `Direct flight option: ${curr.howToReach.air}` : 'Scenic overland transit and local 4x4 transfers.');

      if (day === 1) {
        morning = `Arrival in gateway city (${curr.name}). Transfer to lodge and conduct expedition gear check.`;
        afternoon = `Afternoon stroll through local bazaar; obtain fresh currency notes and mountain route permits.`;
      } else if (day === durationDays) {
        afternoon = `Final souvenir shopping for dried apricots, handwoven shawls, or lapis gemstones.`;
        evening = `Farewell dinner celebration with your expedition driver and local guide.`;
      }

      schedule.push({
        dayNumber: day,
        destinationSlug: curr.slug,
        destinationName: curr.name,
        region: curr.region,
        morning,
        lunch,
        afternoon,
        evening,
        staySuggestion,
        altitudeCheck,
        logisticsTip,
      });
    }

    return schedule;
  }, [selectedDestinations, durationDays]);

  // Cost Estimator calculation
  const costBreakdown = useMemo(() => {
    // Rates per person per day based on travel style
    const styleRates = {
      budget: { stay: 22, food: 12, guide: 15, parkFees: 5 },
      explorer: { stay: 65, food: 25, guide: 28, parkFees: 10 },
      luxury: { stay: 160, food: 45, guide: 55, parkFees: 15 },
    };

    const currentRates = styleRates[travelStyle];
    const totalDays = durationDays;

    // Transport daily cost
    const transportDaily = transportChoice === 'prado' ? 85 : transportChoice === 'hiace' ? 70 : 140;

    const lodgingTotal = currentRates.stay * totalDays * groupSize;
    const foodTotal = currentRates.food * totalDays * groupSize;
    const transportTotal = transportDaily * totalDays;
    const parkFeesTotal = currentRates.parkFees * totalDays * groupSize;

    const grandTotalUSD = lodgingTotal + foodTotal + transportTotal + parkFeesTotal;
    const grandTotalPKR = Math.round(grandTotalUSD * 278.5);
    const perPersonUSD = Math.round(grandTotalUSD / groupSize);

    return {
      lodgingTotal,
      foodTotal,
      transportTotal,
      parkFeesTotal,
      grandTotalUSD,
      grandTotalPKR,
      perPersonUSD,
    };
  }, [durationDays, travelStyle, groupSize, transportChoice]);

  // Print Formatted Dossier
  const handlePrint = () => {
    window.print();
  };

  // Save to My Trips
  const handleSaveItinerary = () => {
    const itineraryPayload = {
      id: `itinerary-${Date.now()}`,
      title: `${durationDays}-Day Expedition: ${selectedDestinations.join(' · ')}`,
      createdAt: new Date().toISOString(),
      durationDays,
      travelStyle,
      destinations: selectedDestinations,
      schedule: generatedItinerary,
      estimatedCostUSD: costBreakdown.grandTotalUSD,
    };

    try {
      const existing = localStorage.getItem('wayfarer_saved_itineraries');
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem('wayfarer_saved_itineraries', JSON.stringify([itineraryPayload, ...list]));
      showToast('✓ Custom itinerary saved to your Explorer Dossier in My Trips!');
    } catch (e) {
      console.warn('Could not save itinerary to localStorage:', e);
    }
  };

  // Copy shareable link
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/planner?dest=${selectedDestinations.join(',')}&days=${durationDays}&style=${travelStyle}`;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    showToast('✓ Shareable expedition link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Inquire with scout desk
  const handleInquireWithScout = () => {
    const note = `I would like to book a ${durationDays}-day custom expedition across: ${selectedDestinations.join(
      ', '
    )} for ${groupSize} guests (${travelStyle} style). Estimated budget: $${costBreakdown.grandTotalUSD} USD.`;
    navigate(`/contact?subject=Custom+Pakistan+Expedition&notes=${encodeURIComponent(note)}`);
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Destinations', href: '/destinations' },
          { label: 'Custom Trip Architect' },
        ]}
      />

      {/* Hero Header */}
      <div className="rounded-3xl border border-white/10 bg-[#121620] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 inline-block">
            Expedition Route Architect
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
            Build Your Custom Pakistan Expedition
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Tailor a complete multi-day journey across the Karakorams, Hindu Kush, or Indus plains.
            Review day-by-day morning and evening protocols, calculate accurate cost estimates, and export a print-ready field dossier.
          </p>
        </div>
      </div>

      {/* STEP 1: PRESET ROUTE TEMPLATES */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
            Step 01 // Select or Customize Route
          </span>
          <h3 className="text-xl font-bold font-serif text-white mt-1">
            Curated Expedition Templates
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_ROUTES.map((p) => {
            const isSelected = selectedTemplateId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-[#161a25] shadow-xl scale-[1.02]'
                    : 'border-white/10 bg-[#121620] hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 mb-2">
                    <span>{p.days} Days / {p.days - 1} Nights</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                      {p.difficulty}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-serif mb-2">{p.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{p.tagline}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-500">
                    {p.destinations.length} Key Regions
                  </span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                    {isSelected ? '✓ Active Route' : 'Apply Preset'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: CUSTOM DESTINATION SELECTOR CHIPS */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#141822] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Pick Your Destinations ({selectedDestinations.length}/6 Selected)
            </span>
            <p className="text-xs text-slate-400">
              Click to add or remove destinations from your custom route.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-500">
            {selectedDestinations.length} stops in itinerary
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {pakistanDestinations.map((d) => {
            const isPicked = selectedDestinations.includes(d.slug);
            return (
              <button
                key={d.slug}
                onClick={() => toggleDestination(d.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isPicked
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <span>{isPicked ? '✓' : '+'}</span>
                <span>{d.name}</span>
                <span className="text-[10px] opacity-70">({d.altitude})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 3: TRIP PARAMETERS CONTROL GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Duration */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#121620] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Duration</span>
            <span className="text-base font-bold font-mono text-amber-400">{durationDays} Days</span>
          </div>
          <input
            type="range"
            min={3}
            max={14}
            value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>3 Days</span>
            <span>7 Days</span>
            <span>14 Days</span>
          </div>
        </div>

        {/* Travel Style */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#121620] space-y-3">
          <span className="text-xs font-mono uppercase text-slate-400 block">Travel Style</span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'budget', label: 'Budget', est: '$35/d' },
              { id: 'explorer', label: 'Explorer', est: '$85/d' },
              { id: 'luxury', label: 'Luxury', est: '$195/d' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setTravelStyle(s.id as any)}
                className={`py-2 px-1 rounded-xl text-center text-xs transition-colors ${
                  travelStyle === s.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <span className="block font-medium">{s.label}</span>
                <span className="text-[10px] opacity-75">{s.est}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Group Size */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#121620] space-y-3">
          <span className="text-xs font-mono uppercase text-slate-400 block">Travelers</span>
          <div className="flex items-center justify-between bg-[#10131a] border border-white/10 rounded-xl p-2">
            <button
              onClick={() => setGroupSize((g) => Math.max(1, g - 1))}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm"
            >
              -
            </button>
            <span className="font-mono text-sm font-bold text-amber-400">
              {groupSize} {groupSize === 1 ? 'Explorer' : 'Explorers'}
            </span>
            <button
              onClick={() => setGroupSize((g) => Math.min(12, g + 1))}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Transport Option */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#121620] space-y-3">
          <span className="text-xs font-mono uppercase text-slate-400 block">Transport Fleet</span>
          <select
            value={transportChoice}
            onChange={(e) => setTransportChoice(e.target.value as any)}
            className="w-full bg-[#10131a] border border-white/10 rounded-xl p-2.5 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-400"
          >
            <option value="prado">Toyota Prado 4x4 + Chauffeur</option>
            <option value="hiace">Toyota HiAce Minivan (Cohort)</option>
            <option value="flight">Mountain Flights + Valley Jeeps</option>
          </select>
        </div>
      </div>

      {/* STEP 4: DAY-BY-DAY ITINERARY BOARD & COST ESTIMATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Day-by-Day Timeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
                Custom Field Protocol
              </span>
              <h3 className="text-2xl font-bold font-serif text-white mt-1">
                Day-by-Day Expedition Schedule ({generatedItinerary.length} Days)
              </h3>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Print field dossier"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Print Dossier</span>
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Share link"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Share'}</span>
              </button>
              <button
                onClick={handleSaveItinerary}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Save to My Trips
              </button>
            </div>
          </div>

          {/* Schedule Cards */}
          <div className="space-y-4">
            {generatedItinerary.map((item) => {
              const isExpanded = expandedDay === item.dayNumber;
              return (
                <div
                  key={item.dayNumber}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? 'border-amber-400/50 bg-[#141822] shadow-xl'
                      : 'border-white/10 bg-[#121620] hover:border-white/20'
                  }`}
                >
                  <div
                    onClick={() => setExpandedDay(isExpanded ? null : item.dayNumber)}
                    className="p-5 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                        0{item.dayNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-white font-serif">
                            {item.destinationName}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5">
                            {item.region}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.morning}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-amber-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Day Details */}
                  {isExpanded && (
                    <div className="px-5 pb-6 pt-2 border-t border-white/5 space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                          <span className="font-mono text-[10px] uppercase text-amber-400 block">
                            Morning (09:00 - 12:30)
                          </span>
                          <p className="text-slate-200 leading-relaxed">{item.morning}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                          <span className="font-mono text-[10px] uppercase text-amber-400 block">
                            Field Lunch Tasting
                          </span>
                          <p className="text-slate-200 leading-relaxed">{item.lunch}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                          <span className="font-mono text-[10px] uppercase text-amber-400 block">
                            Afternoon Exploration
                          </span>
                          <p className="text-slate-200 leading-relaxed">{item.afternoon}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                          <span className="font-mono text-[10px] uppercase text-amber-400 block">
                            Evening & Night Stay
                          </span>
                          <p className="text-slate-200 leading-relaxed">
                            {item.evening} — Suggested: <strong>{item.staySuggestion}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Altitude check and logistics */}
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-2 text-[11px]">
                        <Mountain className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                        <div>
                          <strong>Scout Field Note:</strong> {item.altitudeCheck}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Cost Calculator & Logistics */}
        <div className="lg:col-span-4 space-y-6">
          {/* Estimated Budget Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-[#141822] shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Transparent Budget Estimator
              </span>
              <h4 className="text-2xl font-bold font-serif text-white mt-1">
                Expedition Cost Overview
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Comprehensive ground cost estimate based on verified local operator averages.
              </p>
            </div>

            <div className="space-y-3 text-xs pt-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>Accommodations ({durationDays} nights, {groupSize} pax):</span>
                <span className="font-mono text-white font-semibold">
                  ${costBreakdown.lodgingTotal}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Transport & Mountain Chauffeur:</span>
                <span className="font-mono text-white font-semibold">
                  ${costBreakdown.transportTotal}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Field Food, Chai & Dining:</span>
                <span className="font-mono text-white font-semibold">
                  ${costBreakdown.foodTotal}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>National Park & Heritage Entry Fees:</span>
                <span className="font-mono text-white font-semibold">
                  ${costBreakdown.parkFeesTotal}
                </span>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-white">Estimated Total:</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-amber-400">
                      ${costBreakdown.grandTotalUSD}
                    </span>
                    <span className="text-xs font-mono text-slate-400 ml-1">USD</span>
                  </div>
                </div>

                <div className="text-right text-xs font-mono text-slate-400">
                  ≈ ₨ {costBreakdown.grandTotalPKR.toLocaleString()} PKR (${costBreakdown.perPersonUSD} / person)
                </div>
              </div>
            </div>

            <button
              onClick={handleInquireWithScout}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <span>Inquire with Wayfarer Scout Desk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Expedition Readiness Checklist */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#121620] space-y-4">
            <h4 className="text-sm font-bold font-serif text-white">
              Essential Field Readiness Checklist
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              {[
                { id: 'evisa', label: 'Pakistan e-Visa PDF printed (2 copies)' },
                { id: 'scom', label: 'Acquire SCOM SIM for Gilgit-Baltistan' },
                { id: 'cash', label: 'Withdraw 30,000+ PKR cash for valley fuel/food' },
                { id: 'thermal', label: 'Windproof thermal jacket & base layers' },
                { id: 'boots', label: 'Sturdy broken-in hiking/trail shoes' },
                { id: 'sunscreen', label: 'High SPF sunscreen & polarized sunglasses' },
                { id: 'water', label: 'Water purification drops or insulated canteen' },
              ].map((c) => {
                const isChecked = checklist[c.id];
                return (
                  <button
                    key={c.id}
                    onClick={() =>
                      setChecklist((prev) => ({ ...prev, [c.id]: !prev[c.id] }))
                    }
                    className="flex items-center gap-2.5 w-full text-left hover:text-white transition-colors"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className={isChecked ? 'line-through text-slate-500' : ''}>
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
