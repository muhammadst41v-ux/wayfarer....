import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { EditableText } from '../components/EditableText';
import { LiquidButton } from '../components/LiquidButton';
import { DayNightSlider } from '../components/DayNightSlider';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SmartImage } from '../components/SmartImage';
import { ShieldCheck, Compass, Heart, Users, MapPin, Award, Sparkles } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  location: string;
  avatar: string;
  bio: string;
}

export const AboutPage: React.FC = () => {
  const { currentContent } = useTheme();

  // Dynamic SEO title
  useEffect(() => {
    document.title = `About Our Studio & Scouts | ${currentContent.brandName}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        `Meet the scouts and philosophy behind ${currentContent.brandName}. Small-group curated city expeditions and architectural field archives.`
      );
    }
  }, [currentContent]);

  // Animated Stat Counter Component
  const StatCounter: React.FC<{ end: number; suffix?: string; label: string }> = ({
    end,
    suffix = '',
    label,
  }) => {
    const [count, setCount] = useState(0);
    const elementRef = useRef<HTMLDivElement | null>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            let start = 0;
            const duration = 1500;
            const stepTime = 25;
            const steps = duration / stepTime;
            const increment = end / steps;

            const timer = setInterval(() => {
              start += increment;
              if (start >= end) {
                setCount(end);
                clearInterval(timer);
              } else {
                setCount(Math.floor(start));
              }
            }, stepTime);
          }
        },
        { threshold: 0.3 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }, [end, hasAnimated]);

    return (
      <div ref={elementRef} className="p-6 rounded-2xl bg-[#11141c] border border-white/10 text-center">
        <div className="text-3xl sm:text-5xl font-serif text-amber-400 font-medium tabular-nums mb-1">
          {count}
          {suffix}
        </div>
        <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">{label}</div>
      </div>
    );
  };

  const teamMembers: TeamMember[] = [
    {
      name: 'Elena Vance',
      role: 'Co-Founder & Lead Architectural Scout',
      location: 'Berlin & Lisbon',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Trained at the Bauhaus-Universität Weimar. Elena maps cold-war acoustics, brutalist facades, and secret atrium listening rooms.',
    },
    {
      name: 'Kenji Takahashi',
      role: 'Director of Cultural Heritage',
      location: 'Kyoto & Tokyo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Lifelong kissaten archivist and vinyl preservationist. Kenji unlocks access to century-old master workshops and unlisted tea gardens.',
    },
    {
      name: 'Mateo Cruz',
      role: 'Gastronomic Anthropologist',
      location: 'Oaxaca & Mexico City',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'Researches wild agave distillation and street-level food chemistry. Mateo curates our subterranean dinner circuits and harvest tables.',
    },
    {
      name: 'Sophie Dubois',
      role: 'Curatorial Operations Lead',
      location: 'Paris & Montreal',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      bio: 'Manages small-cohort matching and vetting. Sophie ensures every cohort feels like a private dinner party of like-minded creators.',
    },
  ];

  return (
    <div className="pt-28 pb-24 px-6 sm:px-8 max-w-6xl mx-auto min-h-screen text-white">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'About the Studio' },
          ]}
        />
      </div>

      {/* Editorial Header */}
      <div className="mb-14">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Studio Philosophy & Origin
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif font-light text-white mt-2 mb-6">
          Architects of the Unrushed
        </h1>
        <p className="text-base sm:text-xl text-neutral-300 font-sans leading-relaxed max-w-3xl">
          Wayfarer was born out of frustration with industrialized tourism. We design small-group expeditions that treat cities as living architectural and cultural archives rather than theme parks.
        </p>
      </div>

      {/* Visual Canvas Banner */}
      <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-16 relative">
        <SmartImage
          src="https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1600&q=85"
          fallbackUrls={[
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Passu_Cathedrals.jpg/1280px-Passu_Cathedrals.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Baltit_Fort%2C_Karimabad.jpg/1280px-Baltit_Fort%2C_Karimabad.jpg'
          ]}
          placeName="Karakoram Range, Pakistan"
          alt="Wayfarer Field Scouting"
          aspectRatio="21/9"
          className="w-full h-full object-cover filter brightness-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-8">
          <div>
            <span className="text-xs font-mono text-amber-300 uppercase block mb-1">
              Field Scout Archive #418
            </span>
            <p className="text-sm font-serif text-white">
              Mapping subterranean acoustics and living ateliers across Western Europe and Japan.
            </p>
          </div>
        </div>
      </div>

      {/* Animated Stats Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-20">
        <StatCounter end={14} suffix="+" label="Cities Mapped" />
        <StatCounter end={2400} suffix="+" label="Scout Coordinates" />
        <StatCounter end={98} suffix="%" label="Solo Traveler Match" />
        <StatCounter end={0} label="Mass Bus Tours" />
      </div>

      {/* Mission & Story Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
            The Mission
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif text-white mb-4">
            Slow Observation as Resistance
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
            <p>
              When tourism becomes industrial, cities lose their texture. Independent bookshops turn into souvenir chains, historic coffee rooms get replaced by identical corporate lobbies, and travelers hurry through ten sights a day just to take photos.
            </p>
            <p>
              We believe genuine discovery requires restraint. When you limit your cohort to 6–10 travelers and your walking radius to 800 meters per day, the superficial tourist haze dissolves. You learn how the morning light cuts through an unmarked alleyway, the scent of fresh sourdough, and the stories of the craftsmen who keep the neighborhood alive.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#121620] border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase">
            <Sparkles className="w-4 h-4" />
            <span>The Wayfarer Creed</span>
          </div>
          <blockquote className="font-serif text-lg sm:text-xl text-neutral-200 italic leading-snug">
            "We do not visit cities to take proof of presence. We visit to listen to their echoes, learn their crafts, and return home permanently recalibrated."
          </blockquote>
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <span>Berlin Headquarters</span>
            <span className="font-mono">Est. 2024</span>
          </div>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="mb-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Ethos & Discipline
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white mt-2">
            Our Four Unbreakable Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-[#12161f] border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">01. Small Cohorts, Unmatched Access</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Large tour buses cannot park in narrow alleys, and unlisted jazz kissas will not seat 40 strangers. By capping every cohort at 6–10 explorers, we slide seamlessly into the secret rhythm of neighborhoods.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#12161f] border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">02. Resident Curators Only</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every route is authored by resident architects, vinyl collectors, master fermenters, and historians living in that city. We pay our scouts above-market stipends and reinvest in local independent culture.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#12161f] border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">03. Zero Generic Tourist Traps</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              If a venue is in a mass-market top-ten blog or sells plastic souvenirs, it is strictly banned from our dossiers. We prioritize places that hold memory, soul, and uncompromising craftsmanship.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#12161f] border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">04. Intentional Companionship</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Over 70% of Wayfarer explorers join solo. Our travelers are architects, programmers, writers, and curious thinkers aged 21–35 who value thoughtful conversation over drunken pub crawls.
            </p>
          </div>
        </div>
      </div>

      {/* Day vs Night Image Comparison Slider Section */}
      <div className="mb-24">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Spatial Observation
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white mt-2">
            The Two Lives of the City: Day vs Night
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Slide horizontally to observe how natural daylight reveals architectural geometry while dusk unlocks subterranean culture.
          </p>
        </div>

        <DayNightSlider />
      </div>

      {/* Team Cards Grid */}
      <div className="mb-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            The Scouts
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white mt-2">
            Curators & Field Directors
          </h2>
          <p className="text-xs text-neutral-400 mt-2">
            Architects, cultural anthropologists, and researchers authoring every Wayfarer expedition.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="group bg-[#11141c] rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <SmartImage
                  src={member.avatar}
                  placeName={member.name}
                  alt={member.name}
                  aspectRatio="4/5"
                  className="w-full h-full object-cover filter brightness-[0.9] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-white/10">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{member.location}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-serif text-white mb-1 group-hover:text-amber-300 transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-[11px] font-mono text-amber-400 mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Founder Statement Callout */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#131722] to-[#0e1117] border border-white/15 text-center max-w-3xl mx-auto shadow-2xl">
        <h3 className="text-2xl sm:text-3xl font-serif text-white mb-3">Ready to Walk with Us?</h3>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg mx-auto mb-6">
          Explore upcoming departures or commission a bespoke private itinerary designed for your private creative circle.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <LiquidButton size="md" asAnchor href="/trips">
            Browse Expeditions
          </LiquidButton>
          <LiquidButton size="md" variant="outline" asAnchor href="/contact">
            Speak to a Curator
          </LiquidButton>
        </div>
      </div>
    </div>
  );
};
