import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PakistanDestination, CultureItem } from '../types';
import {
  Utensils,
  Sparkles,
  Users,
  MessageSquare,
  ShieldAlert,
  Palette,
  Music,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';

interface DestinationCultureSectionProps {
  destination: PakistanDestination;
}

export const DestinationCultureSection: React.FC<DestinationCultureSectionProps> = ({ destination }) => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  // Region-aware cultural datasets
  const getRegionalCulture = (dest: PakistanDestination): CultureItem[] => {
    const isGB = dest.region === 'Gilgit-Baltistan';
    const isKP = dest.region === 'Khyber Pakhtunkhwa';
    const isPunjab = dest.region === 'Punjab' || dest.region === 'Islamabad';
    const isSindh = dest.region === 'Sindh';
    const isBalochistan = dest.region === 'Balochistan';

    return [
      {
        type: 'food',
        title: 'Gastronomy & Culinary Rituals',
        subtitle: isGB ? 'Apricot Oils, Buckwheat & Sun-dried Meats' : isPunjab ? 'Slow-cooked Mughal Gravies & Clay Ovens' : 'Wood-fire Roasts & Coastal Spices',
        description: isGB
          ? 'Diet shaped by high altitude. Staple whole grains include buckwheat and barley. Savor hot Chapshuro (meat pastry) with apricot seed oil and wild mountain tumuro thyme tea.'
          : isKP
          ? 'Pashtun cuisine values purity of meat. Shinwari and Namkeen Karahi are seasoned simply with coarse rock salt, green chillies, and beef/mutton fat, roasted in iron woks.'
          : isPunjab
          ? 'Centuries of royal Mughal indulgence: 12-hour simmered beef Nihari, spiced Haleem, stuffed Parathas, and rich creamy buffalo lassi.'
          : 'Rich aromatic Biryanis, seafood spiced with cumin and tamarind, and sweet saffron Falooda.',
        highlights: dest.localFood.map((f) => `${f.name}: ${f.description}`),
      },
      {
        type: 'clothing',
        title: 'Traditional Attire & Textiles',
        subtitle: isGB ? 'Pakol Wool Caps & Embroidered Caps' : isSindh ? 'Ajrak Block-print & Sindhi Topi' : 'Shalwar Kameez & Silk Chaddars',
        description: isGB
          ? 'Men wear the rolled woollen Pakol cap, often decorated with a peacock feather or wildflower. Women embroider intricate geometric pillbox hats worn under silk veils.'
          : isSindh
          ? 'Sindhi Ajrak—a block-printed cotton shawl using ancient indigo and madder red dyes traced back to Mohenjo-daro—paired with mirror-worked Sindhi topis.'
          : 'The national Shalwar Kameez: loose, breezy trousers and a long tunic. Travelers are welcomed warmly when wearing local attire, which is both comfortable and culturally appreciated.',
        highlights: [
          'Modest silhouette covering shoulders and knees',
          'Pure woven sheep wool and pashmina shawls for alpine evenings',
          'Intricate cross-stitch hand embroidery unique to each valley clan',
        ],
      },
      {
        type: 'festivals',
        title: 'Festivals & Living Celebrations',
        subtitle: isGB ? 'Shandur High-Altitude Polo & Ginani Harvest' : isKP ? 'Chilam Joshi Spring Festival' : 'Urs Sufi Gatherings & Mela Chiraghan',
        description: isGB
          ? 'The Shandur Polo Festival (held at 3,700m atop Shandur Pass) is the world’s highest polo tournament played under traditional free-style rules with zero referees.'
          : isKP && dest.slug.includes('kalash')
          ? 'Chilam Joshi in May celebrates spring with sacred ring dances, chanting, and gratitude ceremonies honoring nature spirits in the Kalash valleys.'
          : 'Spring blossom celebrations in the north, Sufi Urs festivals with devotional qawwali in Punjab and Sindh, and national Independence Day festivities on August 14.',
        highlights: [
          'Harvest festivals (Ginani) celebrating first wheat reaping with traditional music',
          'Community polo matches accompanied by live dhol (drums) and suranai flutes',
          'Spiritual shrine gatherings featuring ecstatic mystical poetry',
        ],
      },
      {
        type: 'languages',
        title: 'Linguistic Heritage & Polyglot Valleys',
        subtitle: isGB ? 'Burushaski, Shina, Balti & Wakhi' : isKP ? 'Pashto & Khowar' : 'Urdu, Punjabi, Sindhi & Balochi',
        description: isGB
          ? 'Gilgit-Baltistan is a linguistic wonderland. Burushaski is a world-renowned language isolate with no known linguistic relatives on Earth. Shina and Balti (an archaic Tibetic language) are spoken across neighboring ridges.'
          : 'Urdu is the national lingua franca understood everywhere. English is widely spoken in hotels, restaurants, government offices, and by licensed tour operators.',
        highlights: [
          'Burushaski: World language isolate spoken in Hunza and Nagar',
          'Balti: Archaic Tibetan dialect spoken in Skardu and Shigar',
          'Urdu & English: Seamlessly understood across all tourist hubs',
        ],
      },
      {
        type: 'etiquette',
        title: 'Social Etiquette & Mehmaan-Nawazi',
        subtitle: 'The Sacred Law of Hospitality',
        description:
          'Hospitality (Mehmaan-nawazi in Urdu, Melmastia among Pashtuns) is deeply revered. A guest is viewed as a blessing. Locals will often invite travelers for chai, refuse payment for small favors, and go to extraordinary lengths to assist visitors.',
        highlights: [
          'Saying "Assalam-o-Alaikum" (Peace be upon you) with a hand on the heart opens every door.',
          'Always remove footwear before stepping into homes or onto carpeted mosque courtyards.',
          'Politely accept when offered a cup of chai; sharing tea is a bond of mutual respect.',
          'Ask for permission before photographing individuals, especially women in traditional villages.',
        ],
      },
      {
        type: 'crafts',
        title: 'Artisanship & Ancient Handicrafts',
        subtitle: isGB ? 'Walnut Woodcarving & Gemstone Cutting' : isPunjab ? 'Blue Pottery & Brass Metalwork' : 'Camel Skin Lamps & Ajrak Weaving',
        description: isGB
          ? 'Hunza and Baltistan are renowned for exquisite walnut wood furniture, raw ruby and emerald mining, and handspun sheep-wool pattu cloth.'
          : 'Centuries of artisanal guilds: Multani blue ceramics, Peshawar copper samovars, Lahore glazed terracotta, and hand-knotted Silk Road carpets.',
        highlights: [
          'Gems & Minerals: Aquamarines, emeralds, and lapis mined directly in northern granite fissures',
          'Carved Walnut Wood: Master joinery created without a single metal nail',
          'Handmade Wool Shawls: Incredibly soft pashmina and sheep wool blankets',
        ],
      },
      {
        type: 'music',
        title: 'Music, Folk Instruments & Poetry',
        subtitle: 'Rubab, Surnai, Damama & Mystical Qawwali',
        description:
          'Music in Pakistan spans from the ancient Tibetan rhythms of Skardu’s damama drums to the mesmerizing multi-part vocal harmonies of Qawwali made famous worldwide by Nusrat Fateh Ali Khan.',
        highlights: [
          'Rubab: The soulful 18-stringed lute of the frontier valleys',
          'Qawwali: 700-year-old Sufi devotional music celebrating divine ecstasy',
          'Folk Shina Dance: Circular sword and scarf dances performed at weddings and polo victories',
        ],
      },
    ];
  };

  const cultureItems = getRegionalCulture(destination);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Living Traditions & Ethos
          </span>
          <h3 className="text-2xl font-bold font-serif text-white mt-1">
            Culture, Society & Heritage: {destination.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Discover the living social customs, culinary rites, festivals, and artisanal knowledge of {destination.region}.
          </p>
        </div>

        <Link
          to="/culture"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-colors shrink-0"
        >
          <span>Pakistan Cultural Map</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cultural Dossier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cultureItems.map((item, index) => {
          const isExpanded = activeCard === item.type;
          return (
            <div
              key={item.type}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isExpanded
                  ? 'border-amber-400 bg-[#161a25] shadow-2xl scale-[1.02]'
                  : 'border-white/10 bg-[#121620] hover:border-white/20'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    Facet 0{index + 1} · {item.type}
                  </span>
                  <button
                    onClick={() => setActiveCard(isExpanded ? null : item.type)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>

                <h4 className="text-base font-bold text-white font-serif">{item.title}</h4>
                {item.subtitle && (
                  <p className="text-[11px] font-mono text-slate-400">{item.subtitle}</p>
                )}

                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                {/* Highlights List */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Field Notes & Highlights
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hospitality Code of Honor Banner */}
      <div className="p-8 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.06] via-transparent to-amber-500/[0.03] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white font-serif">
              Mehmaan-Nawazi: The Traveler’s Sacred Welcome
            </h4>
            <p className="text-xs text-slate-400">
              Foreign tourists are universally greeted as honored guests. Embracing small cultural customs creates unforgettable lifelong friendships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
