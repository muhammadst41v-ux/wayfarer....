import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SmartImage } from '../components/SmartImage';
import {
  Sparkles,
  HeartHandshake,
  Utensils,
  Music,
  Palette,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const CulturePage: React.FC = () => {
  const { currentContent } = useTheme();
  const [activeZone, setActiveZone] = useState<string>('gilgit-baltistan');

  useEffect(() => {
    document.title = 'Cultural Heritage, Etiquette & Traditions | Wayfarer Pakistan';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Discover Pakistan’s living cultural heritage: ancient civilizations, regional textiles, music, hospitality protocols, and culinary traditions.'
      );
    }
  }, []);

  const culturalZones = [
    {
      id: 'gilgit-baltistan',
      name: 'Gilgit-Baltistan & The High Karakorams',
      title: 'Himalayan Kingdoms & Polyglot Valleys',
      peoples: 'Burusho, Balti, Shina, Wakhi',
      languages: 'Burushaski (language isolate), Shina, Balti (archaic Tibetic)',
      attire: 'Rolled wool Pakol caps, embroidered pillbox caps with peacock feathers, handspun pattu wool coats.',
      cuisine: 'Buckwheat cakes, fresh sun-dried apricots, cold-pressed kernel oil, savory mutton Chapshuro flatbreads, and tumuro herbal mountain tea.',
      livingTradition: 'Traditional free-style polo matches played atop Shandur Pass (3,700m) without referees, accompanied by thunderous dhol and surnai flutes.',
      image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'khyber-pakhtunkhwa',
      name: 'Khyber Pakhtunkhwa & The Hindu Kush',
      title: 'Pashtunwali & The Sacred Code of Melmastia',
      peoples: 'Pashtuns, Kalash, Khowar, Kohistani',
      languages: 'Pashto, Kalasha, Khowar',
      attire: 'Classic flowing Shalwar Kameez, Peshawari chappal leather sandals, and woolen shawls.',
      cuisine: 'Peshawari Chapli Kebabs, Shinwari Karahi cooked in natural mutton fat with rock salt and green tomatoes, slow-steamed Dum Pukht, and green cardamom Kahwa.',
      livingTradition: 'Melmastia—an ancient inviolable code of hospitality where any traveler seeking shelter is protected and honored above all else.',
      image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'punjab',
      name: 'Punjab & The Grand Trunk Road',
      title: 'Mughal Splendor & Sufi Mysticism',
      peoples: 'Punjabi',
      languages: 'Punjabi, Urdu, Saraiki',
      attire: 'Embroidered Kurta, Phulkari silk shawls, and vibrant Khussa leather shoes.',
      cuisine: '12-hour slow-simmered beef shank Nihari, spiced Haleem, tandoori stuffed naan, butter chicken, and thick sweetened yogurt lassi.',
      livingTradition: 'Thursday evening Sufi Dhamaal gatherings at centuries-old shrines, with ecstasy-inducing dhol drumming and devotional poetry.',
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'sindh',
      name: 'Sindh & The Indus Delta',
      title: 'Indus Cradle & Sufi Devotion',
      peoples: 'Sindhi',
      languages: 'Sindhi, Urdu',
      attire: 'Ajrak natural-dyed block-printed shawls and mirror-worked Sindhi topis.',
      cuisine: 'Sindhi Biryani with dried plums and potatoes, spicy fried fish with pomegranate chutney, and rich saffron Falooda.',
      livingTradition: '5,000 years of unbroken textile craftsmanship rooted in Mohenjo-daro and the mystic poetry of Shah Abdul Latif Bhittai.',
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'balochistan',
      name: 'Balochistan & The Makran Coast',
      title: 'Nomadic Desert Sovereigns & Ancient Coastlines',
      peoples: 'Baloch, Brahui, Pashtun',
      languages: 'Balochi, Brahui (Dravidian isolate)',
      attire: 'Voluminous gathered shalwars (Ghehr-daar) and intricate needlework mirror-stitch dresses.',
      cuisine: 'Balochi Sajji—whole skewered lamb or chicken slow-roasted around wood coals—and Kaak stone bread baked directly on river rocks.',
      livingTradition: 'Epic oral poetry recounting tribal genealogies accompanied by the soothing drone of the suroz and doneli double-flute.',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const currentZone = culturalZones.find((z) => z.id === activeZone) || culturalZones[0];

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Culture & Heritage' },
        ]}
      />

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#121620] shadow-2xl p-8 sm:p-14">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 inline-block">
            Civilizations of the Indus & Karakorams
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight leading-tight">
            Culture, Society & Living Traditions of Pakistan
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Spanning Bronze Age cities, Greco-Buddhist stupas, royal Mughal courts, and autonomous high-altitude alpine clans,
            Pakistan represents one of humanity’s richest cultural crossroads.
          </p>
        </div>
      </div>

      {/* Cultural Spheres Interactive Section */}
      <div className="space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
            Regional Ethnography
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
            Explore Pakistan’s Cultural Spheres
          </h2>
        </div>

        {/* Zone Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {culturalZones.map((z) => (
            <button
              key={z.id}
              onClick={() => setActiveZone(z.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeZone === z.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              {z.name}
            </button>
          ))}
        </div>

        {/* Selected Zone Deep Dive Card */}
        <div className="rounded-3xl border border-white/10 bg-[#141822] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-slate-950">
            <SmartImage
              src={currentZone.image}
              placeName={currentZone.name}
              alt={currentZone.name}
              aspectRatio="4/3"
              className="w-full h-full object-cover filter brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                  Cultural Realm
                </span>
                <h3 className="text-xl font-bold font-serif text-white">{currentZone.name}</h3>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Ethos & Heritage
                </span>
                <h4 className="text-2xl font-bold font-serif text-white mt-1">
                  {currentZone.title}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Peoples:</span>
                  <span className="text-white font-medium">{currentZone.peoples}</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Languages:</span>
                  <span className="text-amber-300 font-mono">{currentZone.languages}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-300 leading-relaxed">
                <div>
                  <strong className="text-white block font-sans mb-0.5">Traditional Attire:</strong>
                  <span>{currentZone.attire}</span>
                </div>
                <div>
                  <strong className="text-white block font-sans mb-0.5">Culinary Heritage:</strong>
                  <span>{currentZone.cuisine}</span>
                </div>
                <div>
                  <strong className="text-white block font-sans mb-0.5">Living Traditions:</strong>
                  <span>{currentZone.livingTradition}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <Link
                to="/destinations"
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
              >
                <span>View Expeditions in this Region</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Traveler Etiquette Protocol Section */}
      <div className="p-8 sm:p-12 rounded-3xl border border-amber-500/30 bg-[#121620] space-y-8 shadow-2xl">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Field Etiquette
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
            Traveler Etiquette & Cultural Respect
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Foreign travelers who respect local customs will experience genuine warmth and overwhelming hospitality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="p-6 rounded-2xl border border-white/10 bg-[#151924] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              01
            </div>
            <h4 className="text-sm font-bold text-white">Dress Sensibly & Modestly</h4>
            <p className="leading-relaxed">
              Keep shoulders and knees covered in public areas. Loose cotton or linen clothing is ideal.
              Carrying a lightweight scarf is recommended for entering mosques or traditional rural homes.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#151924] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              02
            </div>
            <h4 className="text-sm font-bold text-white">Accepting Hospitality & Chai</h4>
            <p className="leading-relaxed">
              Sharing tea (Chai) is the foundation of Pakistani hospitality. Accepting even a small cup
              shows respect. If you must decline, place your hand over your heart and say "Shukriya" (Thank you).
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#151924] space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              03
            </div>
            <h4 className="text-sm font-bold text-white">Photography Protocol</h4>
            <p className="leading-relaxed">
              Always ask politely before taking portraits of individuals, especially women in traditional communities.
              Refrain from photographing military checkpoints, bridges, and government installations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
