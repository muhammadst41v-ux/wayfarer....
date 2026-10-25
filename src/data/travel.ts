import { ContentPack } from '../types';

export const travelContent: ContentPack = {
  brandName: 'Wayfarer',
  brandKicker: 'City & Discovery Studio',
  tagline: 'Curated urban expeditions for curious minds.',
  metaDescription: 'Wayfarer designs intentional city journeys, underground architectural trails, and immersive week-long expeditions for young professionals and independent thinkers.',
  hero: {
    type: 'video-scrub',
    eyebrow: 'Architectural Odysseys & Underground Culture',
    title: 'The city opens to those who look deeper.',
    subtitle: 'We curate small-group city expeditions and secret itineraries designed for young architects, creators, and professionals under 35. No tourist buses. Zero cliché traps.',
    primaryCta: {
      text: 'Explore Curated Trips',
      href: '/trips',
    },
    secondaryCta: {
      text: 'Launch AI Trip Architect',
      href: '#ai-planner',
    },
    // Video URL documentation: Replace this URL with any direct MP4 or WebM link.
    // Recommended resolution: 1080p, 24fps, H.264, optimized for fast streaming.
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-42171-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1920&q=85',
    stats: [
      { label: 'Curated Expeditions', value: '42 Cities' },
      { label: 'Average Group Size', value: '8 Explorers' },
      { label: 'Local Scout Network', value: '180+ Insiders' },
      { label: 'Explorer Rating', value: '4.96 / 5.0' },
    ],
  },
  manifesto: {
    lead: 'Our Core Conviction',
    words: [
      'Travel', 'is', 'not', 'about', 'collecting', 'passport', 'stamps', 'or', 'posing',
      'before', 'fenced', 'monuments.', 'It', 'is', 'the', 'art', 'of', 'disappearing',
      'into', 'a', 'city’s', 'quietest', 'courtyards,', 'decoding', 'its', 'subterranean',
      'subcultures,', 'and', 'sharing', 'a', 'midnight', 'espresso', 'with', 'the', 'architects',
      'who', 'shaped', 'its', 'skyline.', 'We', 'build', 'journeys', 'for', 'the', 'unrushed.'
    ],
    author: 'Elena Vance & Kaelen Ross',
    authorRole: 'Founding Curators, Wayfarer Studio',
  },
  navLinks: [
    { label: 'Expeditions', href: '/trips' },
    { label: 'Itineraries', href: '/#orbital-itinerary' },
    { label: 'Memberships', href: '/pricing' },
    { label: 'Journal', href: '/blog' },
    { label: 'Studio', href: '/about' },
  ],
  items: [
    {
      id: 'trip-berlin-brutalism',
      slug: 'berlin-subterranean-brutalism',
      title: 'Berlin Subterranean & Brutalist Echoes',
      tagline: 'Concrete sanctuaries, cold-war bunkers, and electroacoustic acoustics.',
      city: 'Berlin',
      country: 'Germany',
      duration: '5 Days / 4 Nights',
      groupSize: '8 Explorers',
      price: 680,
      originalPrice: 850,
      featuredImage: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1587330979470-3595ac045ab0?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=1200&q=85',
      ],
      category: 'Architecture & Underground',
      rating: 4.97,
      reviewCount: 48,
      difficulty: 'Moderate',
      vibe: 'Raw, Industrial, Sonic',
      highlights: [
        'Private night access to Tempelhof hangar archive',
        'Listening session inside an abandoned cold war water tower',
        'Brutalist architectural photo walk with Bauhaus fellows',
        'Natural wine cellar pairing in Kreuzberg',
      ],
      included: [
        'Boutique loft stay at The Circus Studio',
        'All private venue access & curator passes',
        'Daily specialty coffee and breakfast banquet',
        'Wayfarer 35mm film camera loaded with Tri-X 400',
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Concrete Foundations',
          description: 'Check-in to Mitte studio loft. Evening sunset gathering atop a decommissioned flak tower followed by Georgian family dinner.',
          location: 'Humboldthain & Mitte',
          timeSlot: '16:00 - 22:30',
        },
        {
          day: 2,
          title: 'Subterranean Cold War Infrastructure',
          description: 'Special permit descent into non-public bunker systems and subterranean communications corridors guided by urban historians.',
          location: 'Gesundbrunnen Undercroft',
          timeSlot: '09:30 - 15:00',
        },
        {
          day: 3,
          title: 'Brutalist Churches & Spatial Acoustics',
          description: 'Acoustic resonance study inside St. Agnes (KÖNIG Galerie) and silent tea ceremony in a modernist courtyard.',
          location: 'Kreuzberg',
          timeSlot: '11:00 - 18:00',
        },
        {
          day: 4,
          title: 'Electroacoustic Soundscapes & Vinyl Vaults',
          description: 'Private studio session with ambient electronic producers in Neukölln, exploring bespoke modular synthesizers.',
          location: 'Neukölln Industrial Yards',
          timeSlot: '14:00 - 23:00',
        },
        {
          day: 5,
          title: 'Spree Canal Farewell & Archive Release',
          description: 'Morning flat whites along Landwehrkanal, archival print exchange, and personalized ongoing itinerary pass.',
          location: 'Landwehrkanal',
          timeSlot: '10:00 - 14:00',
        },
      ],
    },
    {
      id: 'trip-kyoto-shadows',
      slug: 'kyoto-in-praise-of-shadows',
      title: 'Kyoto: In Praise of Shadows',
      tagline: 'Centuries-old joinery, moss temples at twilight, and hidden kissaten.',
      city: 'Kyoto',
      country: 'Japan',
      duration: '7 Days / 6 Nights',
      groupSize: '6 Explorers',
      price: 1350,
      originalPrice: 1550,
      featuredImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=85',
      ],
      category: 'Tradition & Contemplation',
      rating: 4.99,
      reviewCount: 62,
      difficulty: 'Relaxed',
      vibe: 'Meditative, Cedarwood, Charcoal',
      highlights: [
        'Private dawn meditation in Daitoku-ji sub-temple',
        'Master joiner carpentry studio residency session',
        'Night stroll through Gion alleyway tea houses with an archivist',
        'Charcoal-roasted kissaten coffee cupping',
      ],
      included: [
        '6 nights in a restored 120-year-old Machiya townhouse',
        'JR Kansai regional train card preloaded',
        'Daily Kaiseki morning breakfast and 3 curated dinners',
        'Bespoke cedarwood incense and map journal',
      ],
      itinerary: [
        {
          day: 1,
          title: 'The Scent of Hinoki & Arrival',
          description: 'Meet at our private Machiya in Kamigyo ward. Evening stroll under paper lantern light and charcoal grilled robata.',
          location: 'Kamigyo Machiya',
          timeSlot: '15:00 - 21:30',
        },
        {
          day: 2,
          title: 'Zen Stone Gardens at First Light',
          description: 'Exclusive entrance before opening hours to Ryōan-ji and Koto-in moss gardens. Silence discipline and green tea.',
          location: 'Kita Ward',
          timeSlot: '06:30 - 13:00',
        },
        {
          day: 3,
          title: 'Living Crafts & Woodblock Carvers',
          description: 'Hands-on lacquer and sashimono wood joining workshop with eighth-generation artisans.',
          location: 'Nishijin Weaving Quarter',
          timeSlot: '10:00 - 17:00',
        },
        {
          day: 4,
          title: 'Mountain Soba & Forest Bathing',
          description: 'Hike through Kurama to Kibune along mountain cedar trails, culminating in cold river stone dining.',
          location: 'Mount Kurama',
          timeSlot: '08:30 - 16:30',
        },
        {
          day: 5,
          title: 'Audiophile Jazz Kissa & Vinyl Archives',
          description: 'Afternoon spent in Kyoto’s subterranean jazz bars listening to rare Blue Note pressings through vintage tube amps.',
          location: 'Kawaramachi Alleyways',
          timeSlot: '14:00 - 22:00',
        },
        {
          day: 6,
          title: 'Fermentation & Wild Sake Tasting',
          description: 'Private cellar visit to a 300-year-old sake brewery using natural yeast and cedar vats.',
          location: 'Fushimi District',
          timeSlot: '11:00 - 18:00',
        },
        {
          day: 7,
          title: 'Twilight Over the Kamo River',
          description: 'Final breakfast on the river veranda and distribution of the Kyoto ongoing secret locator index.',
          location: 'Kamo Riverbank',
          timeSlot: '09:00 - 12:30',
        },
      ],
    },
    {
      id: 'trip-lisbon-light',
      slug: 'lisbon-golden-hour-ceramic-routes',
      title: 'Lisbon: Golden Hour & Terracotta Alleys',
      tagline: 'Fado in living rooms, natural wine rooftops, and Atlantic tile ateliers.',
      city: 'Lisbon',
      country: 'Portugal',
      duration: '5 Days / 4 Nights',
      groupSize: '8 Explorers',
      price: 590,
      originalPrice: 720,
      featuredImage: 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=1200&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=85',
      ],
      category: 'Coast & Bohemian Living',
      rating: 4.94,
      reviewCount: 39,
      difficulty: 'Moderate',
      vibe: 'Luminous, Salty, Melodic',
      highlights: [
        'Unrecorded living room Fado concert in Alfama',
        'Glazed azulejo tile restoration studio masterclass',
        'Sunset sailing expedition along the Tagus estuary',
        'Natural Colares wine tasting over Atlantic cliffs',
      ],
      included: [
        '4 nights in an Alfama historic townhouse',
        'Unlimited historic tram & ferry pass',
        'All workshop materials & finished tiles shipped home',
        'Dinner at an unlisted petiscos tavern',
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in the Seven Hills',
          description: 'Check-in to Alfama residence. Sunset petiscos and Vinho Verde looking out over the red tile roofs.',
          location: 'Miradouro de Santa Luzia',
          timeSlot: '16:00 - 22:00',
        },
        {
          day: 2,
          title: 'The Ceramic Tradition',
          description: 'Hands-on tile painting with 4th-generation potters followed by exploration of abandoned industrial palaces in Marvila.',
          location: 'Marvila & Xabregas',
          timeSlot: '10:00 - 17:00',
        },
        {
          day: 3,
          title: 'Atlantic Surge: Sintra & Cabo da Roca',
          description: 'Private van excursion through mystical mist forests of Sintra, ending with coastal seafood stew in Azenhas do Mar.',
          location: 'Sintra & Coast',
          timeSlot: '09:00 - 19:00',
        },
        {
          day: 4,
          title: 'Secret Fado & Tagus Sailing',
          description: 'Afternoon private wooden sailboat charter on the river followed by late-night tavern music in Mouraria.',
          location: 'Tagus & Mouraria',
          timeSlot: '15:00 - 23:30',
        },
        {
          day: 5,
          title: 'Morning Pastéis & Departure',
          description: 'Fresh warm custard tarts from a historic monastery recipe and personal farewell.',
          location: 'Belém & Cais do Sodré',
          timeSlot: '10:00 - 13:00',
        },
      ],
    },
    {
      id: 'trip-oaxaca-mezcal',
      slug: 'oaxaca-clay-mezcal-botany',
      title: 'Oaxaca: Wild Agave & Black Clay',
      tagline: 'Pre-hispanic smoke, sacred botanical gardens, and village palenques.',
      city: 'Oaxaca',
      country: 'Mexico',
      duration: '6 Days / 5 Nights',
      groupSize: '8 Explorers',
      price: 840,
      originalPrice: 990,
      featuredImage: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=1200&q=85',
      ],
      category: 'Heritage & Culinary Alchemy',
      rating: 4.98,
      reviewCount: 54,
      difficulty: 'Active',
      vibe: 'Smoky, Earthy, Vibrant',
      highlights: [
        'Campfire mezcal distillation with maestro mezcaleros',
        'Black pottery sculpting in San Bartolo Coyotepec',
        'Private botanical garden dawn tour with ethnobotanists',
        'Mole negro culinary laboratory with traditional cook',
      ],
      included: [
        '5 nights at boutique design hotel Casa Santo Origen',
        'All private backcountry transport in 4x4 vehicles',
        'Full board meals crafted by local culinary masters',
        'Hand-blown mezcal copitas gift set',
      ],
      itinerary: [
        {
          day: 1,
          title: 'The Fragrance of Copal & Welcome',
          description: 'Check-in to boutique hotel. Evening mezcal welcome flight and tlayudas in Jalatlaco.',
          location: 'Jalatlaco',
          timeSlot: '15:00 - 22:00',
        },
        {
          day: 2,
          title: 'Agave Botany & Sierra Palenque',
          description: 'Journey to Santa Catarina Minas. Observe ancestral clay pot distillation and wild agave harvesting.',
          location: 'Santa Catarina Minas',
          timeSlot: '08:00 - 18:00',
        },
        {
          day: 3,
          title: 'The Seven Moles of Oaxaca',
          description: 'Market visit to Central de Abastos followed by 6-hour mole laboratory grinding chilies on basalt metates.',
          location: 'Etla Valley',
          timeSlot: '09:00 - 17:00',
        },
        {
          day: 4,
          title: 'Petrified Falls & Zapotec Ruins',
          description: 'Early morning swim in mineral springs at Hierve el Agua before crowds arrive. Sacred geometry at Mitla.',
          location: 'Hierve el Agua & Mitla',
          timeSlot: '06:30 - 16:30',
        },
        {
          day: 5,
          title: 'Barro Negro & Contemporary Textile Art',
          description: 'Artisan studio residency visiting cochineal dye vats and black clay burnishing workshops.',
          location: 'Teotitlán del Valle',
          timeSlot: '10:00 - 18:00',
        },
        {
          day: 6,
          title: 'Sunday Market Feast & Farewell',
          description: 'Tlacolula Sunday market feast with smoked cecina and freshly baked pan de cazuela.',
          location: 'Tlacolula',
          timeSlot: '09:00 - 14:00',
        },
      ],
    },
    {
      id: 'trip-reykjavik-geothermal',
      slug: 'reykjavik-geothermal-solitude',
      title: 'Reykjavik & the Basalt Edge',
      tagline: 'Volcanic architecture, thermal sea baths, and midnight design studios.',
      city: 'Reykjavik',
      country: 'Iceland',
      duration: '5 Days / 4 Nights',
      groupSize: '8 Explorers',
      price: 1120,
      originalPrice: 1300,
      featuredImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=1200&q=85',
      ],
      category: 'Elemental & Wilderness',
      rating: 4.93,
      reviewCount: 31,
      difficulty: 'Active',
      vibe: 'Subarctic, Ethereal, Glacial',
      highlights: [
        'Private night dip in a hidden canyon hot spring',
        'Harpa Concert Hall acoustics and glass architecture tour',
        'Volcanic lava tube descent with geologists',
        'Nordic sourdough and rye bread baked inside hot earth sand',
      ],
      included: [
        '4 nights in an architect-designed harbor loft',
        'Super-Jeep all-terrain transport',
        'All thermal spa passes and safety gear',
        'Wool knit balaclava made by local weavers',
      ],
      itinerary: [
        {
          day: 1,
          title: 'Harbor Mist & Nordic Welcome',
          description: 'Arrival at Old Harbor lofts. Smoked char, arctic herbs, and local aquavit tasting.',
          location: 'Old Harbor Reykjavik',
          timeSlot: '16:00 - 21:30',
        },
        {
          day: 2,
          title: 'Basalt Glass & Geometric Architecture',
          description: 'Exploring Guðjón Samúelsson’s volcanic brutalist monuments and modern Scandinavian micro-studios.',
          location: 'Reykjavik Downtown',
          timeSlot: '10:00 - 16:30',
        },
        {
          day: 3,
          title: 'Thermal Valley Secret Pools',
          description: 'Hike into Reykjadalur steam valley to soak in a rushing geothermal river surrounded by snow peaks.',
          location: 'Reykjadalur',
          timeSlot: '09:00 - 17:00',
        },
        {
          day: 4,
          title: 'Subterranean Lava Tubes & Sound Recording',
          description: 'Walk inside 5,000-year-old volcanic chambers and record unique cave reverberations.',
          location: 'Raufarhólshellir',
          timeSlot: '11:00 - 18:00',
        },
        {
          day: 5,
          title: 'Atlantic Sea Baths & Departure',
          description: 'Morning cold plunge into the Arctic ocean followed by cedar sauna and hot cinnamon buns.',
          location: 'Grótta Lighthouse',
          timeSlot: '09:00 - 13:00',
        },
      ],
    },
    {
      id: 'trip-montreal-nordic',
      slug: 'montreal-underground-lofts',
      title: 'Montreal: Underground Cities & Micro-Brasseries',
      tagline: 'Habitat 67 brutalism, winter subterranean corridors, and natural cidreries.',
      city: 'Montreal',
      country: 'Canada',
      duration: '4 Days / 3 Nights',
      groupSize: '8 Explorers',
      price: 490,
      originalPrice: 600,
      featuredImage: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1200&q=85',
      ],
      category: 'Architecture & Underground',
      rating: 4.91,
      reviewCount: 27,
      difficulty: 'Moderate',
      vibe: 'Cerebral, Bilingual, Cozy',
      highlights: [
        'Private access tour of Moshe Safdie’s Habitat 67 complex',
        'Subterranean RESO labyrinth exploration with city planners',
        'Mile End wood-fired bagel duel and natural cider pairing',
        'Mile-Ex industrial design loft reception',
      ],
      included: [
        '3 nights at boutique Mile End loft apartments',
        'Unlimited metro and BIXI bicycle card',
        'Guided architectural entry permits',
        'Artisan maple reduction flask',
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Mile End',
          description: 'Meet at Saint-Viateur cafe. Check into design loft. Evening pet-nat wine and cheese tasting.',
          location: 'Mile End',
          timeSlot: '15:00 - 22:00',
        },
        {
          day: 2,
          title: 'Habitat 67 & St. Lawrence Brutalism',
          description: 'Special access walkthrough inside residential units of Habitat 67 and industrial silos.',
          location: 'Cité du Havre',
          timeSlot: '10:00 - 16:30',
        },
        {
          day: 3,
          title: 'The Underground Network & Night Jazz',
          description: 'Decoding 33km of subterranean urbanism followed by secret speakeasy jazz cellar session.',
          location: 'Downtown RESO',
          timeSlot: '11:00 - 23:00',
        },
        {
          day: 4,
          title: 'Mount Royal Panorama & Farewell',
          description: 'Morning jog or stroll through Olmsted-designed parklands and warm smoked meat farewell.',
          location: 'Mount Royal',
          timeSlot: '09:30 - 13:00',
        },
      ],
    },
  ],
  pricingPlans: [
    {
      id: 'plan-explorer',
      name: 'Single Expedition',
      tagline: 'Ideal for taking your first curated journey with our scout team.',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Book any single curated expedition with zero markup',
        'Full digital pre-trip dossier and offline map layer',
        'Local host accompaniment & private venue permits',
        'Curated group of 6-8 vetted like-minded travelers',
        '24/7 on-ground emergency and concierge channel',
      ],
      ctaText: 'Browse Trips',
      ctaHref: '/trips',
    },
    {
      id: 'plan-fellowship',
      name: 'Wayfarer Fellowship',
      tagline: 'Annual membership for relentless explorers and city nomads.',
      monthlyPrice: 49,
      annualPrice: 39,
      popular: true,
      features: [
        '15% member privilege discount on all expeditions',
        'Unlimited AI Trip Planner generations with custom export',
        'Access to unlisted secret weekenders and pop-up dinners',
        'Direct chat with local city scouts in 40+ destinations',
        'Priority booking window 14 days before public release',
        'Exclusive quarterly printed architectural dispatch',
      ],
      ctaText: 'Join Fellowship',
      ctaHref: '/pricing',
    },
    {
      id: 'plan-patron',
      name: 'Private Studio Commission',
      tagline: 'Bespoke, private itineraries authored exclusively for your private circle.',
      monthlyPrice: 190,
      annualPrice: 150,
      features: [
        'Fully customized 1-on-1 itinerary design by lead curators',
        'Private key access to locked heritage sites and estates',
        'Dedicated on-site private fixer and private driver',
        'White-glove booking for flight, boutique villas and tables',
        'All Fellowship member perks included for up to 4 travelers',
      ],
      ctaText: 'Commission Studio',
      ctaHref: '/contact',
    },
  ],
  faq: [
    {
      question: 'Who travels with Wayfarer?',
      answer: 'Our groups consist predominantly of curious students, young architects, researchers, designers, engineers, and creative professionals aged 21–35. We cap group sizes at 6–10 people to ensure genuine intimacy, fluid mobility, and access to small spaces where tour buses can never enter.',
      category: 'General',
    },
    {
      question: 'How do the curated trips differ from ordinary tours?',
      answer: 'We do not do flag-waving tours, generic souvenir stops, or tourist menus. Every itinerary is authored by resident scouts (local architects, sound artists, historians, and chefs) focusing on underground culture, spatial history, and intimate living room gatherings.',
      category: 'Expeditions',
    },
    {
      question: 'Can I travel solo and join a group?',
      answer: 'Over 70% of our travelers book solo! Our vetting process ensures everyone shares an open, curious, and collaborative mindset. Room arrangements offer both private single rooms and shared twin lofts.',
      category: 'Expeditions',
    },
    {
      question: 'How does the AI Trip Planner feature work?',
      answer: 'Our AI Planner is grounded in our proprietary scouting database of over 2,400 verified local establishments, brutalist landmarks, quiet cafes, and vinyl listening rooms across 40+ cities. It builds personalized day-by-day itineraries with exact walking times and coordinate checkpoints.',
      category: 'Technology',
    },
    {
      question: 'What is your cancellation and deposit policy?',
      answer: 'You can reserve any expedition with a flexible $200 deposit. If your plans shift, your deposit is 100% transferable to any other expedition or refundable up to 30 days prior to departure.',
      category: 'Booking',
    },
  ],
  testimonials: [
    {
      id: 'test-1',
      name: 'Amara Chen',
      role: 'Urban Researcher',
      city: 'London',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      quote: 'Wayfarer ruined ordinary travel for me in the best possible way. The Berlin cold war bunker listening session opened my eyes to how spaces hold sonic memory. The people in our cohort are now lifelong friends.',
      tripTaken: 'Berlin Subterranean & Brutalist Echoes',
      rating: 5,
    },
    {
      id: 'test-2',
      name: 'Julian Navarro',
      role: 'Product Designer',
      city: 'San Francisco',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      quote: 'Sitting inside an unlisted jazz kissa in Kyoto at midnight, drinking charcoal brew while listening to Bill Evans on tube amps—it wasn’t a checklist, it was poetry. Truly curated with impeccable taste.',
      tripTaken: 'Kyoto: In Praise of Shadows',
      rating: 5,
    },
    {
      id: 'test-3',
      name: 'Sophie Dubois',
      role: 'Architectural Journalist',
      city: 'Paris',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      quote: 'The caliber of access is astounding. In Oaxaca we met maestro mezcaleros who distill in clay pots in the mountains. No tourist traps, just pure human respect and deep cultural resonance.',
      tripTaken: 'Oaxaca: Wild Agave & Black Clay',
      rating: 5,
    },
    {
      id: 'test-4',
      name: 'Marcus Lindqvist',
      role: 'Creative Technologist',
      city: 'Stockholm',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      quote: 'As a solo traveler, I was hesitant about group trips. Wayfarer felt like taking a trip with seven brilliant friends who happen to know the exact hidden door to knock on.',
      tripTaken: 'Lisbon: Golden Hour & Terracotta Alleys',
      rating: 5,
    },
  ],
  orbitalItinerary: [
    {
      day: 1,
      title: 'Arrival & Rooftop Dusk',
      time: '18:00',
      summary: 'Secret courtyard welcome & Georgian pet-nat vintage pairing.',
      details: 'Gather at our private Mitte penthouse overlooking the TV tower. Unpack field notebooks, meet your co-explorers, and enjoy a curated dinner prepared by a resident fermentation chef.',
      location: 'Mitte Rooftop Sanctuary',
      coordinateLabel: '52.5312° N, 13.3984° E',
      image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80',
    },
    {
      day: 2,
      title: 'Bunker Undercroft Access',
      time: '10:30',
      summary: 'Descending into restricted Cold War subterranean tunnels.',
      details: 'Guided with archival blueprints into sealed emergency shelter networks and abandoned acoustic chambers beneath the U-Bahn.',
      location: 'Gesundbrunnen Undercroft',
      coordinateLabel: '52.5489° N, 13.3884° E',
      image: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=800&q=80',
    },
    {
      day: 3,
      title: 'Brutalist Concrete Walk',
      time: '14:00',
      summary: 'St. Agnes acoustic resonance study & Bauhaus archives.',
      details: 'Exploring the massive monolithic concrete forms of Werner Düttmann and private viewing of architectural drafts at KÖNIG Galerie.',
      location: 'Kreuzberg Concrete Trail',
      coordinateLabel: '52.4988° N, 13.3942° E',
      image: 'https://images.unsplash.com/photo-1587330979470-3595ac045ab0?auto=format&fit=crop&w=800&q=80',
    },
    {
      day: 4,
      title: 'Sonic Lab Residency',
      time: '16:30',
      summary: 'Bespoke modular synthesizer workshop in Neukölln.',
      details: 'An intimate afternoon with electronic composers learning hands-on analog signal processing inside a converted brick brewery.',
      location: 'Neukölln Industrial Yard',
      coordinateLabel: '52.4812° N, 13.4355° E',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    },
    {
      day: 5,
      title: 'Spree Dawn & Archives',
      time: '11:00',
      summary: 'Final reflection, photo prints & continuing secret map release.',
      details: 'Morning coffee cupping by the canal, development of 35mm film rolls, and issuance of the Wayfarer alumni key.',
      location: 'Landwehrkanal Basin',
      coordinateLabel: '52.4944° N, 13.4190° E',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    },
  ],
  blogPosts: [
    {
      id: 'post-1',
      slug: 'the-acoustic-geography-of-berlin',
      title: 'The Acoustic Geography of Concrete: Recording Berlin’s Empty Sanctuaries',
      excerpt: 'Why brutalist architecture sounds fundamentally different from steel and glass, and how to listen to the echoes of Cold War vaults.',
      content: `## The Physicality of Silence

In 1968, Werner Düttmann poured thousands of cubic meters of rough-grained concrete to erect St. Agnes in Kreuzberg. Standing in its nave today, the silence is physical. Unlike modern sound-dampened drywall, dense concrete reflects low frequencies while subtly scattering higher harmonics, creating a reverberation time of nearly 4.2 seconds.

## Subterranean Cold War Vaults

Beneath the U-Bahn lines at Gesundbrunnen lie bunker networks where acoustic engineers conducted listening experiments during the partition. When footsteps hit the raw screed, sound travels along subterranean ductwork for over four hundred meters.

## The Archival Record

We brought directional condenser microphones into these spaces to document their natural resonance. What we discovered was a library of sonic ghosts: the hum of ventilation shafts tuned to low D-flat, water drops echoing like clockwork metronomes, and the distant tremor of commuter trains vibrating through monolithic floor slabs.

## How to Listen

To experience this yourself, avoid visiting during standard tourist hours. Enter at dusk, sit perfectly still for ten minutes until your nervous system recalibrates, and let the space speak.`,
      coverImage: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Elena Vance',
        role: 'Lead Architectural Scout',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'March 14, 2026',
      readTime: '6 min read',
      category: 'Spatial Essays',
    },
    {
      id: 'post-2',
      slug: 'in-search-of-kyoto-kissaten',
      title: 'In Search of the Lost Kissaten: Where Kyoto Goes to Disappear',
      excerpt: 'Tucked between wooden lattice facades, Kyoto’s century-old coffee houses serve velvet dark roasts in perpetual shadow.',
      content: `## The Threshold of Modernity

Turn left off Kawaramachi-dori down an alleyway barely wider than your shoulders, push open a heavy cedar door, and the 21st century ceases. A single vacuum tube glow illuminates rows of classical vinyl. Here, a cup of hand-dripped Nel drip brew takes fifteen minutes to prepare—and no one ever checks their phone.

## The Ritual of Darkness

In Tanizaki's seminal essay 'In Praise of Shadows', he writes that Japanese aesthetics find beauty not in the thing itself, but in the patterns of shadows and the light and darkness that one thing against another creates. The kissaten is the purest architectural expression of this ethos.

## Velvet Extraction

Master roasters age their beans for months in airtight hinoki chests, pulling dark, viscous drops through cotton flannel filters directly over heated porcelain demitasses. The resulting coffee has no bitterness—only pure cocoa, cedarwood, and smoke.

## Preserving the Unhurried Space

These sanctuaries survive not by marketing, but by discretion. As long as travelers arrive with deference and quiet footsteps, these doors will remain open.`,
      coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Kenji Takahashi',
        role: 'Resident Culture Fellow',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'February 28, 2026',
      readTime: '8 min read',
      category: 'Field Dispatches',
    },
    {
      id: 'post-3',
      slug: 'manifesto-of-the-unrushed-traveler',
      title: 'The Unrushed Traveler: Why We Ban Itinerary Overcrowding',
      excerpt: 'How packing twelve sights into a single Saturday robs cities of their poetry, and why four days in one neighborhood will change your life.',
      content: `## The Modern Tourism Malady

The industrial tourism complex treats destinations like inventory to be liquidated. Wake up at 6am, race through security checkpoints, snap a photo before the crowd pushes you along. Wayfarer was founded on the opposite premise: deep immersion, slow walking, and the courage to spend an entire afternoon reading in an unfamiliar plaza.

## The Radius Principle

When you limit your daily radius to eight hundred meters, the superficial layer melts away. You learn the baker's morning schedule, the scent of the alleyway jasmine at dusk, and the exact hour the light hits the stained glass in the corner chapel.

## Why Less is Radical

In a world addicted to frantic consumption, sitting still is an act of rebellion. Travel is not about proof of presence; it is about transformation through undivided attention.`,
      coverImage: 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Kaelen Ross',
        role: 'Co-Founder & Editor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'January 19, 2026',
      readTime: '5 min read',
      category: 'Philosophy',
    },
    {
      id: 'post-4',
      slug: 'lisbon-azulejo-tile-restoration',
      title: 'The Alchemical Glaze: Rescuing Lisbon’s 18th-Century Azulejo Ateliers',
      excerpt: 'Inside the damp riverside workshops where third-generation artisans hand-paint cobalt blue oxides on tin glazes.',
      content: `## Mineral Chemistry of Cobalt

Azulejo tiles are more than decoration; they are thermal skin and historical ledger. Before firing, the cobalt glaze appears pale pinkish grey. Only after twenty-four hours in an 1,000°C wood kiln does the deep, oceanic lapis lazuli hue reveal itself.

## The Marvila District Renaissance

While central Alfama faces commercialization, the former warehouse district of Marvila has become an incubator for preservationists reclaiming broken tile fragments from demolished baroque palacetes.

## Hands in the Clay

Our cohorts spend an afternoon mixing feldspar, kaolin, and river water before sketching historical botanical motifs with horsehair brushes.`,
      coverImage: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Sophie Dubois',
        role: 'Art Historian & Scout',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'January 05, 2026',
      readTime: '7 min read',
      category: 'Craft & Atelier',
    },
    {
      id: 'post-5',
      slug: 'oaxaca-ancestral-clay-mezcal',
      title: 'Smoke and Basalt: The Living Ancestry of Oaxacan Clay Distillation',
      excerpt: 'High in the Sierra Sur, maestro mezcaleros distill wild espadín and tobalá in earthenware pots over oak embers.',
      content: `## Beyond Industrial Agave

In Santa Catarina Minas, metal copper stills are considered a modern distortion. The village still adheres to ancestral distillation using twin clay ollas connected by bamboo reeds.

## The Biology of Fermentation

Wild airborne yeasts feast on cooked agave sugars inside pine vats, singing with bubbling effervescence under the midday sun. The result is mineral, earthy, and profound.

## Sacred Hospitality

Drinking mezcal in a palenque is not a tasting flight; it is a communion with three generations of agrarian patience.`,
      coverImage: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Mateo Cruz',
        role: 'Gastronomic Anthropologist',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'December 12, 2025',
      readTime: '6 min read',
      category: 'Terroir & Field',
    },
    {
      id: 'post-6',
      slug: 'reykjavik-subarctic-architecture',
      title: 'Basalt and Obsidian: Designing for the 64th Parallel North',
      excerpt: 'How Iceland’s volcanic landscape gave birth to an uncompromised architectural vernacular of raw aggregate and glass.',
      content: `## Guðjón Samúelsson’s Geologic Dream

When State Architect Samúelsson drafted Hallgrímskirkja and the National Theatre in the 1930s, he refused continental European neoclassical facades. Instead, he studied hexagonal basalt columns formed by cooling basaltic lava.

## Geothermal Infrastructure as Civic Center

In Reykjavik, the public heated pool is not a luxury spa; it is the town square. Heated by natural volcanic aquifers, citizens debate philosophy and politics submerged in 40°C mineral water while snow falls on their foreheads.`,
      coverImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Elena Vance',
        role: 'Lead Architectural Scout',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'November 20, 2025',
      readTime: '5 min read',
      category: 'Spatial Essays',
    },
    {
      id: 'post-7',
      slug: 'montreal-underground-urbanism',
      title: 'Thirty-Three Kilometers Beneath the Snow: Montreal’s Subterranean RESO',
      excerpt: 'An architectural investigation of the world’s largest climate-controlled pedestrian network.',
      content: `## Modernism’s Cold Weather Countermeasure

Begun in 1962 beneath Place Ville Marie by I.M. Pei, the RESO was an audacious experiment: could a northern metropolis thrive year-round beneath freezing street grade?

## The Spatial Experience of Transition

Walking through the network is an architectural cross-section of Quebec’s mid-century optimism, connecting Brutalist concrete metro chambers to sunlit modernist atriums.`,
      coverImage: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Kaelen Ross',
        role: 'Co-Founder & Editor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'October 15, 2025',
      readTime: '6 min read',
      category: 'Urbanism',
    },
    {
      id: 'post-8',
      slug: 'analog-listening-rooms-tokyo',
      title: 'Tubes, Horns, and Wax: The Japanese Audiophile Underground',
      excerpt: 'Why master sound collectors spend decades calibrating Western Electric theater horns in ninety-square-foot bars.',
      content: `## The Physicality of 78 RPM

In Tokyo’s Shibuya back-alleys, sound is not background wallpaper; it is the sole focal anchor of the room. Talking loudly is considered desecration.

## Precision Engineering

Custom tube amplifiers glow in the dim light, driving massive wooden horn speakers designed to reproduce the acoustic air around John Coltrane’s tenor saxophone as if he stood two feet away.`,
      coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Kenji Takahashi',
        role: 'Resident Culture Fellow',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'September 28, 2025',
      readTime: '7 min read',
      category: 'Acoustic Studies',
    },
    {
      id: 'post-9',
      slug: 'budapest-thermal-baths-architecture',
      title: 'Ottoman Domes and Habsburg Stucco: The Hydrotherapy of Budapest',
      excerpt: 'Tracing the thermal fault line that feeds sixteen centuries of continuous bathhouse culture along the Danube.',
      content: `## Steam Under Octagonal Cupolas

At Rudas and Király, light pierces stained glass apertures cut directly into sixteenth-century Turkish masonry. The water emerges from deep subterranean limestone caverns at natural temperatures ranging from 28°C to 42°C.

## Social Architecture of Immersion

Chess players stand chest-deep in hot mineral pools in winter snow, discussing literature and politics in an egalitarian ritual unchanged for centuries.`,
      coverImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Sophie Dubois',
        role: 'Art Historian & Scout',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'August 14, 2025',
      readTime: '5 min read',
      category: 'Field Dispatches',
    },
  ],
  socials: [
    { name: 'Instagram', href: 'https://instagram.com', icon: 'Instagram' },
    { name: 'Twitter', href: 'https://twitter.com', icon: 'Twitter' },
    { name: 'Substack', href: 'https://substack.com', icon: 'BookOpen' },
    { name: 'Spotify', href: 'https://spotify.com', icon: 'Radio' },
  ],
  seoKeywords: ['curated city travel', 'architectural expeditions', 'student travel boutique', 'underground travel studio', 'berlin brutalism tour', 'kyoto small group'],
};
