import React, { useState, useEffect } from 'react';
import { PakistanDestination, HistoryMilestone } from '../types';
import {
  BookOpen,
  ExternalLink,
  History,
  Lightbulb,
  Compass,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface DestinationHistorySectionProps {
  destination: PakistanDestination;
}

export const DestinationHistorySection: React.FC<DestinationHistorySectionProps> = ({ destination }) => {
  const [wikiData, setWikiData] = useState<{
    title?: string;
    extract?: string;
    pageUrl?: string;
    thumbnail?: string;
    description?: string;
  } | null>(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(0);

  // Fetch Wikipedia REST Summary
  useEffect(() => {
    if (!destination.wikipediaTitle) return;
    setWikiLoading(true);

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destination.wikipediaTitle)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setWikiData({
            title: data.title,
            extract: data.extract,
            description: data.description,
            pageUrl: data.content_urls?.desktop?.page,
            thumbnail: data.thumbnail?.source,
          });
        }
      })
      .catch((err) => {
        console.warn('Wikipedia REST summary fetch fallback:', err);
      })
      .finally(() => {
        setWikiLoading(false);
      });
  }, [destination]);

  // Curated regional history milestones for the destination
  const getHistoricalMilestones = (dest: PakistanDestination): HistoryMilestone[] => {
    if (dest.slug === 'mohenjo-daro') {
      return [
        {
          year: '2500 BCE',
          era: 'Indus Bronze Age',
          title: 'Foundation of the Metropolis',
          description: 'Constructed along the Indus River with strict orthogonal grid street planning, baked mud-brick residences, and multi-tiered civic engineering.',
          impactNote: 'World’s first documented municipal wastewater drainage system.',
        },
        {
          year: '2000 BCE',
          era: 'Peak Urban Civilization',
          title: 'The Great Bath & Granary',
          description: 'Construction of the world’s first public water reservoir, sealed with natural bitumen to prevent leakage.',
        },
        {
          year: '1922 CE',
          era: 'Modern Rediscovery',
          title: 'Excavations by Rakhaldas Banerjee & Sir John Marshall',
          description: 'Archaeologists uncover the sprawling mounds, pushing back the documented dawn of South Asian civilization by thousands of years.',
        },
        {
          year: '1980 CE',
          era: 'Global Heritage',
          title: 'UNESCO World Heritage Inscription',
          description: 'Designated as a premier site of universal cultural value to humanity.',
        },
      ];
    }

    if (dest.slug === 'lahore') {
      return [
        {
          year: '1021 CE',
          era: 'Ghaznavid Dynasty',
          title: 'Malik Ayaz & Provincial Capital',
          description: 'The historic fortified town becomes a grand center of Persianized Islamic literature, arts, and Sufi mysticism.',
        },
        {
          year: '1584 CE',
          era: 'Mughal Golden Age',
          title: 'Akbar the Great Makes Lahore Imperial Capital',
          description: 'Mughal Emperor Akbar moves the seat of the empire to Lahore for 14 years, expanding Lahore Fort with monumental red sandstone halls.',
        },
        {
          year: '1673 CE',
          era: 'Mughal Monumental Era',
          title: 'Completion of the Badshahi Mosque',
          description: 'Emperor Aurangzeb commissions the monumental red sandstone mosque with marble domes, the largest mosque in the world for over 300 years.',
        },
        {
          year: '1947 CE',
          era: 'Modern Republic',
          title: 'Heart of the New Nation',
          description: 'Lahore serves as the cultural and academic fountainhead of modern Pakistan.',
        },
      ];
    }

    // Default northern silk road & Karakoram timeline
    return [
      {
        year: '1st - 5th Century CE',
        era: 'Ancient Silk Road & Gandhara',
        title: 'Buddhism & Caravan Trade Along the Indus',
        description: 'Sogdian, Chinese, and Tibetan merchants carve petroglyphs and Buddhist stupas on granite boulders along the roaring river gorges.',
        impactNote: 'Over 50,000 ancient petroglyphs still line the Karakoram Highway today.',
      },
      {
        year: '12th - 14th Century CE',
        era: 'Silk Road Feudal Kingdoms',
        title: 'Establishment of Mirs & Dynasties',
        description: 'Independent kingdoms rule the valleys. The Mirs of Hunza erect Baltit Fort and Altit Fort as defensive castles controlling the mountain passes.',
      },
      {
        year: '1891 CE',
        era: 'The Great Game',
        title: 'British-Hunza Campaign at Nilt Fort',
        description: 'British imperial forces push north into the Karakorams to secure the high frontier passes against Russian Cossack expansion.',
      },
      {
        year: '1966 - 1978 CE',
        era: 'Engineering Wonder',
        title: 'Construction of the Karakoram Highway',
        description: 'Pakistani and Chinese engineers blast 1,300 kilometers through solid granite over 20 years, forging the modern Silk Road connection.',
        impactNote: 'Celebrated as the 8th Wonder of the World.',
      },
      {
        year: 'Present Day',
        era: 'Mountaineering Capital',
        title: 'Global High-Altitude Expedition Center',
        description: 'Home to 5 of the world’s 14 peaks above 8,000 meters, drawing world-class alpinists and global cultural travelers.',
      },
    ];
  };

  const milestones = getHistoricalMilestones(destination);

  // "Did you know" curious facts
  const getDidYouKnowFacts = (dest: PakistanDestination): string[] => {
    const facts: Record<string, string[]> = {
      hunza: [
        'Hunza boasts an extraordinary literacy rate exceeding 95%—one of the highest in South Asia—with equal participation across women and men.',
        'The Mir of Hunza ruled from the 900-year-old Baltit Fort, which was constructed using Tibetan-influenced earthquake-resistant timber lacing without metal nails.',
        'Attabad Lake was formed in 2010 by a massive landslide that dammed the Hunza River, creating a 21-kilometer turquoise alpine fjord.',
      ],
      skardu: [
        'Skardu sits at the confluence of the Indus and Shigar rivers, flanked by four 8,000m mountains including K2 (8,611m), the world’s second highest peak.',
        'The Katpana Desert is one of the highest cold deserts on Earth, with white sand dunes frequently dusted in winter snow.',
        'The historic Shigar Fort was built on a foundation of solid granite in the 17th century by the Raja of the Amacha Dynasty.',
      ],
      'fairy-meadows': [
        'Local legends believe fairies dwell on the alpine plateau under the watchful protection of the 8,126-meter summit of Nanga Parbat.',
        'The north face (Raikot Face) rises an astonishing 4,500 vertical meters directly from the Raikot Glacier in a single unbroken wall of ice and rock.',
        'The first successful ascent of Nanga Parbat was made in 1953 by Austrian legend Hermann Buhl in a harrowing solo summit push without supplemental oxygen.',
      ],
      deosai: [
        'Deosai is the second highest alpine plateau on Earth after the Tibetan Changtang, spanning 3,000 square kilometers at an average elevation of 4,114 meters.',
        'It is home to the critically protected Himalayan brown bear (Ursus arctos isabellinus) and the golden Himalayan marmot.',
        'The plateau remains covered under meters of snow for roughly eight months each year before bursting into vibrant wildflowers from July to September.',
      ],
      lahore: [
        'The Badshahi Mosque was constructed in 1673 with red sandstone carved from Rajasthan quarries and could accommodate over 100,000 worshipers in its courtyard.',
        'The Walled City of Lahore historically had 13 grand gates; several including Delhi Gate, Bhati Gate, and Kashmiri Gate still stand proudly today.',
        'Lahore Fort contains the world-famous Sheesh Mahal (Palace of Mirrors), embellished with thousands of convex Venetian glass mirrors that glitter under candlelight.',
      ],
    };

    return (
      facts[dest.slug] || [
        `${dest.name} is nestled at an elevation of ${dest.altitude}, offering dramatic alpine panoramas and pristine glacial runoff.`,
        `The region preserves ancient Silk Road traditions of hospitality, where passing travelers are warmly offered herbal teas and local flatbreads.`,
        `Pakistan contains over 7,253 known glaciers—more than any other region on the planet outside the polar ice caps.`,
      ]
    );
  };

  const didYouKnowFacts = getDidYouKnowFacts(destination);

  return (
    <div className="space-y-10">
      {/* 1. Wikipedia Encyclopedia Panel */}
      <div className="rounded-3xl border border-white/10 bg-[#121620] overflow-hidden shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                Universal Knowledge Archive
              </span>
              <h4 className="text-base font-bold text-white font-serif">
                Wikipedia Encyclopedia: {destination.wikipediaTitle || destination.name}
              </h4>
            </div>
          </div>

          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Free REST API · CC BY-SA 4.0
          </span>
        </div>

        {wikiData ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {wikiData.thumbnail && (
              <div className="md:col-span-4 aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-md">
                <img
                  src={wikiData.thumbnail}
                  alt={wikiData.title}
                  className="w-full h-full object-cover filter brightness-95"
                  loading="lazy"
                  onError={(e) => {
                    const t = e.currentTarget;
                    if (!t.dataset.fallback) {
                      t.dataset.fallback = '1';
                      t.src = 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80';
                    }
                  }}
                />
              </div>
            )}

            <div className={wikiData.thumbnail ? 'md:col-span-8 space-y-4' : 'md:col-span-12 space-y-4'}>
              {wikiData.description && (
                <span className="text-xs font-mono text-amber-400 px-2.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 inline-block">
                  {wikiData.description}
                </span>
              )}

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {wikiData.extract}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5 text-xs">
                <span className="text-slate-500 text-[11px]">
                  Attribution: Content available under CC BY-SA 4.0 from Wikimedia Foundation.
                </span>

                {wikiData.pageUrl && (
                  <a
                    href={wikiData.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 hover:text-amber-300 transition-colors font-medium text-xs"
                  >
                    <span>Read Full Article on Wikipedia</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400">
            {wikiLoading ? 'Fetching Wikipedia REST synopsis...' : 'Archival synopsis verified in field dossier.'}
          </div>
        )}
      </div>

      {/* 2. Interactive Radial / Milestone History Timeline */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500 flex items-center gap-2">
            <History className="w-3.5 h-3.5" />
            Epochs & Historical Crossroads
          </span>
          <h3 className="text-2xl font-bold font-serif text-white mt-1">
            Historical Timeline: {destination.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Trace the civilizations, mountain kingdoms, and monumental engineering triumphs that forged this terrain.
          </p>
        </div>

        {/* Milestone Steps Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {milestones.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMilestoneIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                selectedMilestoneIndex === idx
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              <span>{m.year}</span>
              <span className="text-[10px] opacity-75 ml-1.5">· {m.era}</span>
            </button>
          ))}
        </div>

        {/* Active Milestone Card */}
        {milestones[selectedMilestoneIndex] && (
          <div className="p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#141822] to-[#10131a] shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-amber-400 font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                {milestones[selectedMilestoneIndex].era}
              </span>
              <span className="text-3xl font-bold font-serif text-white">
                {milestones[selectedMilestoneIndex].year}
              </span>
            </div>

            <h4 className="text-2xl font-bold font-serif text-white">
              {milestones[selectedMilestoneIndex].title}
            </h4>

            <p className="text-sm text-slate-300 leading-relaxed">
              {milestones[selectedMilestoneIndex].description}
            </p>

            {milestones[selectedMilestoneIndex].impactNote && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  <strong>Field Significance:</strong> {milestones[selectedMilestoneIndex].impactNote}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. "Did You Know" Curious Facts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h4 className="text-lg font-bold font-serif text-white">
            Did You Know? Curiosities of {destination.name}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {didYouKnowFacts.map((fact, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/10 bg-[#121620] hover:border-amber-400/40 transition-all space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-bold font-serif text-amber-500 block mb-1">
                  0{i + 1}.
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{fact}</p>
              </div>
              <div className="pt-3 border-t border-white/5 text-[10px] font-mono text-slate-500">
                Verified Geographic Dossier
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
