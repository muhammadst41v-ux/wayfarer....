import { ContentPack } from '../types';

export const foodContent: ContentPack = {
  brandName: 'Wayfarer Palate',
  brandKicker: 'Gastronomic Discovery Studio',
  tagline: 'Curated street food odysseys and underground culinary labs.',
  metaDescription: 'Wayfarer Palate designs small-group culinary trails, secret supper clubs, wild fermentation cellars, and midnight market expeditions across food capitals.',
  hero: {
    type: 'video-scrub',
    eyebrow: 'Heirloom Terroir & Underground Kitchens',
    title: 'Taste the real city after the guides clock out.',
    subtitle: 'We curate clandestine food odysseys led by natural winemakers, fermenters, and rogue chefs. Eat from boiling cauldrons, hidden basements, and wood-fired pits.',
    primaryCta: {
      text: 'Explore Culinary Trails',
      href: '/trips',
    },
    secondaryCta: {
      text: 'AI Menu Architect',
      href: '#ai-planner',
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-42171-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=85',
    stats: [
      { label: 'Culinary Trails', value: '24 Regions' },
      { label: 'Table Capacity', value: '8 Gastronomes' },
      { label: 'Artisan Producers', value: '140+ Purveyors' },
      { label: 'Palate Rating', value: '4.98 / 5.0' },
    ],
  },
  manifesto: {
    lead: 'Palate Manifesto',
    words: [
      'Food', 'is', 'not', 'white-tablecloth', 'pageantry', 'or', 'gilded', 'tasting',
      'spoons.', 'It', 'is', 'the', 'smoke', 'rising', 'from', 'a', 'midnight', 'clay',
      'brazier,', 'the', 'funk', 'of', 'wild', 'lacto-fermented', 'koji,', 'and', 'the',
      'generosity', 'of', 'grandmothers', 'who', 'hand-roll', 'heritage', 'dough.',
      'We', 'eat', 'where', 'living', 'culture', 'thrives.'
    ],
    author: 'Chef Mateo Cruz & Camille Laurent',
    authorRole: 'Founding Tastemakers, Wayfarer Palate',
  },
  navLinks: [
    { label: 'Trails', href: '/trips' },
    { label: 'Courses', href: '/#orbital-itinerary' },
    { label: 'Memberships', href: '/pricing' },
    { label: 'Dispatches', href: '/blog' },
    { label: 'Kitchen', href: '/about' },
  ],
  items: [
    {
      id: 'food-san-sebastian-pintxo',
      slug: 'san-sebastian-basque-cellars',
      title: 'San Sebastián: Underground Cider & Txikiteo',
      tagline: 'Basque grill masterclasses, wild cider houses, and aged beef txuleton.',
      city: 'San Sebastián',
      country: 'Spain',
      duration: '4 Days / 3 Nights',
      groupSize: '8 Gastronomes',
      price: 780,
      originalPrice: 940,
      featuredImage: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=1200&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
      ],
      category: 'Fire & Ferment',
      rating: 4.99,
      reviewCount: 52,
      difficulty: 'Relaxed',
      vibe: 'Smoky, Salty, Indulgent',
      highlights: [
        'Private txikiteo crawl through Parte Vieja back kitchens',
        'Whole-animal open charcoal grill masterclass with Etxebarri disciples',
        'Sagardotegi barrel pouring straight from 200-year-old chestnut vats',
        'Anchovy curing and Idiazabal cheese cave pairing',
      ],
      included: [
        '3 nights in a luxury coastal apartment overlooking La Concha',
        'All food, pairings, txakoli wines, and tasting menus',
        'Private transport to mountain cider houses',
        'Hand-forged Basque chef pocket knife',
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival & The Golden Anchor Pintxo Walk',
          description: 'Meet in Parte Vieja. Guided crawl sampling spider crab tartlets, kokotxas in pil-pil, and chilled sparkling Txakoli.',
          location: 'Parte Vieja',
          timeSlot: '17:00 - 23:00',
        },
        {
          day: 2,
          title: 'The Ritual of the Cider Vaults',
          description: 'Journey to Astigarraga apple orchards. Shout "Txotx!" while catching fresh cider jetting from wooden giant vats.',
          location: 'Astigarraga Mountain Orchards',
          timeSlot: '11:00 - 18:00',
        },
        {
          day: 3,
          title: 'Charcoal Grilling & Aged Txuleton',
          description: 'Hands-on live-fire meat craftsmanship learning embers management, coarse sea salt crusting, and bone marrow butter.',
          location: 'Getaria Coastline',
          timeSlot: '10:00 - 17:00',
        },
        {
          day: 4,
          title: 'Burnt Cheesecake & Departure',
          description: 'Fresh warm Basque burnt cheesecake straight from the bakery tin and personal pantry souvenir pack.',
          location: 'Calle 31 de Agosto',
          timeSlot: '10:00 - 13:00',
        },
      ],
    },
    {
      id: 'food-bangkok-night-markets',
      slug: 'bangkok-wok-alchemy-and-fermentation',
      title: 'Bangkok: Midnight Wok Alchemy & Isan Ferments',
      tagline: 'Wok hei fire mastery, canal oyster omelets, and dry-aged duck broth.',
      city: 'Bangkok',
      country: 'Thailand',
      duration: '5 Days / 4 Nights',
      groupSize: '8 Gastronomes',
      price: 640,
      originalPrice: 790,
      featuredImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
      ],
      category: 'Street Fire & Wok',
      rating: 4.97,
      reviewCount: 47,
      difficulty: 'Moderate',
      vibe: 'Pungent, Sizzling, Electric',
      highlights: [
        'Midnight tuk-tuk exploration of unmapped Yaowarat stalls',
        'Wok hei technique workshop with 50-year street veterans',
        'Clay pot fermentation workshop making pla ra and spicy relishes',
        'Secret river speakeasy cocktail tasting using Thai botanicals',
      ],
      included: [
        '4 nights at heritage riverside boutique villa',
        'All street banquets, market tastings, and drinks included',
        'Private long-tail boat food expedition on Thonburi canals',
        'Brass mortar and pestle crafted in Chiang Mai',
      ],
      itinerary: [
        {
          day: 1,
          title: 'Chinatown Smoke & Crispy Pork',
          description: 'Meet along Yaowarat Road. Crispy pork belly, rolled rice noodle soup, and ginger-infused soy milk sweets.',
          location: 'Yaowarat Chinatown',
          timeSlot: '17:30 - 23:30',
        },
        {
          day: 2,
          title: 'Canal Produce & Thonburi Kitchens',
          description: 'Long-tail boat into ancient agricultural canal communities tasting wild betel leaf wraps and pomelo salads.',
          location: 'Bang Luang Canal',
          timeSlot: '09:00 - 15:00',
        },
        {
          day: 3,
          title: 'The Physics of Wok Breath (Wok Hei)',
          description: 'Cooking on high-output blast burners under the mentorship of street noodle masters.',
          location: 'Talat Noi Old Town',
          timeSlot: '11:00 - 17:30',
        },
        {
          day: 4,
          title: 'Isan Funk & Fermented Crab',
          description: 'Exploring the complex umami worlds of fermented fish sauces, green papaya pestle pounding, and sticky rice in banana leaf.',
          location: 'Silom Subterranean Hall',
          timeSlot: '12:00 - 19:00',
        },
        {
          day: 5,
          title: 'Dawn Congee & Departure',
          description: 'Silky smooth pork congee with century egg and fresh deep-fried dough crullers.',
          location: 'Charoen Krung Road',
          timeSlot: '08:00 - 11:30',
        },
      ],
    },
  ],
  pricingPlans: [
    {
      id: 'plan-food-single',
      name: 'Single Culinary Trail',
      tagline: 'Book a seat at any upcoming international food expedition.',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Direct admission to 1 complete culinary trail with all meals included',
        'Access to private unlisted kitchens and home supper clubs',
        'Hands-on masterclasses with regional food artisans',
        'Comprehensive digital recipe archive and market guide',
      ],
      ctaText: 'Browse Trails',
      ctaHref: '/trips',
    },
    {
      id: 'plan-food-society',
      name: 'Gastronomy Society',
      tagline: 'Annual fellowship for serious food obsessives and home cooks.',
      monthlyPrice: 59,
      annualPrice: 48,
      popular: true,
      features: [
        '15% member privilege on all culinary expeditions worldwide',
        'Access to quarterly secret pop-up dinners in NYC, London & Tokyo',
        'Direct hotline to our global kitchen scout network',
        'Quarterly heirloom pantry box shipped to your home',
        'Unlimited AI Menu & Food Crawl Planner generations',
      ],
      ctaText: 'Join Society',
      ctaHref: '/pricing',
    },
  ],
  faq: [
    {
      question: 'Can you accommodate dietary restrictions or allergies?',
      answer: 'Yes! While street food environments feature bold ingredients, our scout team provides tailored alternatives for pescatarians, vegetarians, shellfish allergies, and gluten sensitivities at every single meal.',
      category: 'Dietary',
    },
    {
      question: 'Are street food vendors safe and sanitary?',
      answer: 'We exclusively patronize stalls with high food turnover, boiling or smoking temperatures, and decades of pristine reputations. In 5 years of operating food odysseys, our guest wellness rate is 99.8%.',
      category: 'Health',
    },
  ],
  testimonials: [
    {
      id: 'test-food-1',
      name: 'Clara Moreau',
      role: 'Sommelier & Writer',
      city: 'Lyon',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      quote: 'The Basque Txikiteo crawl was the most exhilarating food experience of my career. Catching naturally fermented cider straight from the barrel while eating charcoal-grilled beef was unforgettable.',
      tripTaken: 'San Sebastián: Underground Cider & Txikiteo',
      rating: 5,
    },
  ],
  orbitalItinerary: [
    {
      day: 1,
      title: 'Old Town Pintxo Baptism',
      time: '18:30',
      summary: 'Secret cellar walk & sparkling Txakoli poured from shoulder height.',
      details: 'Gather in Parte Vieja. Taste rare kokotxas in velvet pil-pil sauce and learn the unspoken etiquette of Basque taverns.',
      location: 'Parte Vieja San Sebastián',
      coordinateLabel: '43.3245° N, 1.9840° W',
      image: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=800&q=80',
    },
    {
      day: 2,
      title: 'The Roar of the Cider Vats',
      time: '12:00',
      summary: 'Traditional Sagardotegi barrel vault lunch in the hills.',
      details: 'Stand before giant chestnut casks. Catch rushing cider in your glass, followed by cod omelets and massive charcoal ribeyes.',
      location: 'Astigarraga Cider Valley',
      coordinateLabel: '43.2811° N, 1.9472° W',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    },
    {
      day: 3,
      title: 'Artisanal Anchovy Curing',
      time: '10:30',
      summary: 'Hand-filleting Cantabrian salt-cured silver fillets in Getaria.',
      details: 'Learn the delicate artisanal craft of peeling and curing anchovies with master salt fishers on the rugged coast.',
      location: 'Getaria Fishing Harbor',
      coordinateLabel: '43.3039° N, 2.2045° W',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    },
  ],
  blogPosts: [
    {
      id: 'food-post-1',
      slug: 'the-secret-of-wok-hei',
      title: 'Wok Hei: The Ephemeral Chemistry of 1000°F Carbon Steel',
      excerpt: 'Why home kitchens can never replicate street food breath, and the exact aerosolized oil droplets responsible for the smoky high.',
      content: `## The Physics of Breath

At 1,000 degrees Fahrenheit, oil vaporized in a hammered carbon steel wok catches micro-droplets of flame. This brief fractional second of vaporization transforms aromatic molecules into pure wok hei—the breath of the wok.

## The Maestro’s Wrist Flick

Watch an octogenarian street cook in Bangkok’s Talat Noi. The wok never rests on the blast burner for more than three seconds. The continuous tossing aerates searing noodles through a plume of superheated vapor.

## Carbon Steel Patina

A seasoned street wok has absorbed three decades of rendered lard, ginger oils, and scallion juices, creating a non-stick polymer layer that imparts mineral umami impossible to produce in stainless cookware.`,
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Mateo Cruz',
        role: 'Culinary Anthropologist',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'March 11, 2026',
      readTime: '6 min read',
      category: 'Culinary Science',
    },
    {
      id: 'food-post-2',
      slug: 'basque-cider-sagardotegi-tradition',
      title: 'The Jet from the Chestnut Cask: The Basque Sagardotegi Season',
      excerpt: 'Standing in rustic mountain cellars catching unfiltered natural cider straight from hundred-year-old wooden tuns.',
      content: `## The Shout of Txotx!

Between January and April in the hills of Astigarraga, apple growers open their cellar doors. When the cellar master shouts 'Txotx!', guests line up with angled glasses to catch the golden stream arching four feet through the cold air.

## Aeration and Acidity

Basque cider contains no added yeast, sugar, or carbonation. Catching it mid-flight breaks the surface tension, liberating natural carbon dioxide and aromatic esters of wild green apples.

## The Fire Companion

This sharp, acidic cider exists to cut through the rich, marbled fat of four-inch thick txuleton steaks grilled over red-hot holm oak coals.`,
      coverImage: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Camille Laurent',
        role: 'Fermentation Director',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'February 22, 2026',
      readTime: '7 min read',
      category: 'Terroir & Cellar',
    },
    {
      id: 'food-post-3',
      slug: 'wild-fermentation-lactobacillus-koji',
      title: 'Microbial Alchemy: Crafting Umami with Aspergillus Oryzae and Sea Salt',
      excerpt: 'How ancient mold spores grown on steamed barley unlock glutamic acids in heirloom grain pastes.',
      content: `## The Temple of Mold

Koji is the foundational engine of Japanese cuisine. By inoculating grains with Aspergillus oryzae under strictly controlled humidity, filamentous mycelium secretes protease and amylase enzymes that disassemble proteins into pure umami.

## The Waiting Game

Unlike modern industrial flavor enhancers, natural barrel fermentation requires seasonal patience. A genuine dark miso ages through two summers and two winters in cedar vats bound by split bamboo rings.`,
      coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Kenji Takahashi',
        role: 'Resident Culture Fellow',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'February 04, 2026',
      readTime: '8 min read',
      category: 'Fermentation',
    },
    {
      id: 'food-post-4',
      slug: 'isan-funk-som-tum-pla-ra',
      title: 'The Complexity of Funk: Northeast Thailand’s Fermented Fish Broths',
      excerpt: 'Why pla ra—mud carp fermented with roasted rice powder and salt—is the true soul of Isan cuisine.',
      content: `## Beyond Gentle Pad Thai

Travelers who stick to sweet green curries miss the visceral power of Isan food. Pla ra is fermented for six months to two years in glazed stoneware jars until the bones disintegrate into a savory paste.

## The Basalt Mortar

In street stalls across Bangkok’s railway tracks, cooks vigorously pound fiery bird’s eye chilies, raw garlic, green papaya, lime juice, and spoonfuls of pungent fermented fish broth, yielding an explosion that awakens every sensory receptor.`,
      coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Mateo Cruz',
        role: 'Culinary Anthropologist',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'January 14, 2026',
      readTime: '6 min read',
      category: 'Street Food',
    },
    {
      id: 'food-post-5',
      slug: 'cantabrian-anchovy-salting-ritual',
      title: 'Silver Fillets in Sea Salt: The Cantabrian Salt Curing Masterclass',
      excerpt: 'Inside the coastal salting sheds of Santoña where women hand-press spring anchovies under stone weights for six months.',
      content: `## The Spring Catch

Only anchovies caught in April and May possess the optimal ratio of fat and lean muscle. Within hours of landing, the heads are removed and the fish are layered circularly in wooden casks with coarse Atlantic sea salt.

## Hand-Trimming Artistry

Once cured, every fillet is rinsed in fresh spring water, dried in cotton cloths, and meticulously trimmed with small scissors to remove microscopic pin bones before being submerged in extra virgin olive oil.`,
      coverImage: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Camille Laurent',
        role: 'Fermentation Director',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'December 28, 2025',
      readTime: '7 min read',
      category: 'Marine Craft',
    },
    {
      id: 'food-post-6',
      slug: 'natural-wine-pet-nat-revolution',
      title: 'Bubbles Without Sulfur: The Petillant Naturel Underground',
      excerpt: 'Why low-intervention ancestral method sparkling wines are rewriting wine cellar lists from Paris to Tokyo.',
      content: `## The Ancestral Method

Unlike Champagne which undergoes a secondary fermentation with added sugar and yeast, Pét-Nat is bottled before its initial fermentation completes, capturing natural carbon dioxide in bottle with zero filtration or sulfur additions.`,
      coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Clara Moreau',
        role: 'Sommelier & Writer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'December 05, 2025',
      readTime: '5 min read',
      category: 'Wine & Cellar',
    },
    {
      id: 'food-post-7',
      slug: 'tacos-al-pastor-vertical-spit',
      title: 'The Vertical Spit: How Lebanese Shawarma Transformed Mexico City',
      excerpt: 'Tracing the migration of vertical rotating spits to CDMX and the alchemy of achiote, pork shoulder, and pineapple slicing.',
      content: `## Cultural Fusion in the Streets

In the 1930s, Lebanese immigrants brought vertical rotisseries to Puebla and Mexico City. Pork replaced lamb, dried chiles and vinegar replaced citrus marinades, and an essential Mexican institution was born.`,
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Mateo Cruz',
        role: 'Culinary Anthropologist',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'November 18, 2025',
      readTime: '6 min read',
      category: 'Street Food',
    },
    {
      id: 'food-post-8',
      slug: 'georgian-qvevri-orange-wines',
      title: 'Eight Millennia in Buried Clay: The Amber Qvevri Wines of Kakheti',
      excerpt: 'Why macerating white grapes on their skins inside beeswax-sealed clay amphorae produces tannins like red wine.',
      content: `## Underground Temperature Control

Buried in damp soil, Georgian qvevris maintain an unwavering 13°C natural cellar temperature. The grape skins and seeds sink to the conical bottom, clarifying the amber liquid over months of quiet subterranean rest.`,
      coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Camille Laurent',
        role: 'Fermentation Director',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'October 25, 2025',
      readTime: '7 min read',
      category: 'Terroir & Cellar',
    },
    {
      id: 'food-post-9',
      slug: 'the-secret-kissaten-toast',
      title: 'Four Inches of Milk Bread: The Precision of Kyoto Cafe Toast',
      excerpt: 'Cross-hatch scoring, clarified Hokkaido butter, and salamander broiler radiant heat in morning kissaten.',
      content: `## Architectural Bakery

A thick slab of shokupan is scored diagonally so salted butter penetrates deep into the pillowy crumb while intense radiant heat creates a crisp 1mm outer crust. Simple, unhurried, and transcendental.`,
      coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Kenji Takahashi',
        role: 'Resident Culture Fellow',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'October 02, 2025',
      readTime: '5 min read',
      category: 'Street Food',
    },
  ],
  socials: [
    { name: 'Instagram', href: 'https://instagram.com', icon: 'Instagram' },
    { name: 'TikTok', href: 'https://tiktok.com', icon: 'Share2' },
  ],
  seoKeywords: ['culinary tours', 'san sebastian food tour', 'bangkok street food crawl', 'underground supper club', 'fermentation travel'],
};
