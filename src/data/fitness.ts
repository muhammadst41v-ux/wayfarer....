import { ContentPack } from '../types';

export const fitnessContent: ContentPack = {
  brandName: 'Wayfarer Kinetic',
  brandKicker: 'Urban Athletic Studio',
  tagline: 'High-performance athletic camps and recovery circuits.',
  metaDescription: 'Wayfarer Kinetic curates elite urban movement camps, altitude conditioning, and cold water recovery sanctuaries for athletes, runners, and hybrid creators.',
  hero: {
    type: 'video-scrub',
    eyebrow: 'Athletic Architecture & Human Performance',
    title: 'The body commands the ground it masters.',
    subtitle: 'We curate intensive small-squad athletic camps, sprint academies, and hydro-recovery retreats across the world’s most demanding terrain. No generic bootcamps.',
    primaryCta: {
      text: 'View Athletic Camps',
      href: '/trips',
    },
    secondaryCta: {
      text: 'AI Training Architect',
      href: '#ai-planner',
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-42171-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=85',
    stats: [
      { label: 'Conditioning Camps', value: '18 Locations' },
      { label: 'Squad Size', value: '10 Athletes' },
      { label: 'Master Coaches', value: '45 Olympians' },
      { label: 'Member Retention', value: '98.4%' },
    ],
  },
  manifesto: {
    lead: 'Kinetic Doctrine',
    words: [
      'Movement', 'is', 'not', 'repetition', 'in', 'air-conditioned', 'boxes.', 'It', 'is',
      'the', 'deliberate', 'mastery', 'of', 'gravity,', 'lactic', 'thresholds,', 'and', 'mental',
      'stillness', 'against', 'granite,', 'tarmac,', 'and', 'open', 'water.', 'We', 'train',
      'together', 'where', 'terrain', 'demands', 'complete', 'presence.'
    ],
    author: 'Coach Marcus Vance',
    authorRole: 'Head of Human Performance',
  },
  navLinks: [
    { label: 'Camps', href: '/trips' },
    { label: 'Circuits', href: '/#orbital-itinerary' },
    { label: 'Passes', href: '/pricing' },
    { label: 'Lab Dispatch', href: '/blog' },
    { label: 'Science', href: '/about' },
  ],
  items: [
    {
      id: 'fit-chamonix-altitude',
      slug: 'chamonix-vertical-skyline-camp',
      title: 'Chamonix: Vertical Trail & Alpine Oxygen Camp',
      tagline: 'Technical ridge running, glacial plunges, and VO2 max development.',
      city: 'Chamonix',
      country: 'France',
      duration: '5 Days / 4 Nights',
      groupSize: '10 Athletes',
      price: 920,
      originalPrice: 1100,
      featuredImage: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1200&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
      ],
      category: 'Alpine Endurance',
      rating: 4.98,
      reviewCount: 42,
      difficulty: 'Active',
      vibe: 'Relentless, Crisp, Alpine',
      highlights: [
        'Guided technical ridge traverse over Aiguille des Posettes',
        'Biometric lactate threshold testing with sports physiologists',
        'Glacial river cold plunge immersion protocols',
        'High-altitude alpine nutrition workshops',
      ],
      included: [
        'Alpine chalet accommodations with private cedar sauna',
        'All cable car passes and mountain safety beacons',
        'Targeted performance fueling crafted by sports nutritionists',
        'Custom Kinetic windbreaker and tracking logbook',
      ],
      itinerary: [
        {
          day: 1,
          title: 'Base Camp Assembly & Acclimatization',
          description: 'Meet at Chamonix chalet. Easy 8km river tempo run to assess cadence and baseline oxygen intake.',
          location: 'Chamonix Valley',
          timeSlot: '15:00 - 19:30',
        },
        {
          day: 2,
          title: 'Vertical Kilometer & Glacial Recovery',
          description: 'Ascend the legendary VK route with trekking poles followed by sub-10°C glacial water hydro-therapy.',
          location: 'Planpraz Face',
          timeSlot: '07:30 - 14:00',
        },
        {
          day: 3,
          title: 'Ridge Agility & Plyometrics',
          description: 'Speed-ladder drills and technical scree descent footwork at 2,200m altitude.',
          location: 'Aiguillette des Posettes',
          timeSlot: '08:30 - 15:30',
        },
        {
          day: 4,
          title: 'Long Alpine Trail Simulation',
          description: '24km sustained mountain traverse with team checkpoint pacing and electrolytes testing.',
          location: 'Grand Balcon Sud',
          timeSlot: '07:00 - 16:00',
        },
        {
          day: 5,
          title: 'Mobility Lab & Performance Debrief',
          description: 'Deep tissue mobility workshop, normatec compression sessions, and tailored training roadmap.',
          location: 'Chamonix Kinetic Lab',
          timeSlot: '09:00 - 13:00',
        },
      ],
    },
    {
      id: 'fit-tokyo-sprint',
      slug: 'tokyo-urban-track-and-recovery',
      title: 'Tokyo: Midnight Track & Hydro-Recovery Labs',
      tagline: 'Velodrome track drills, subterranean bathhouses, and biomechanical precision.',
      city: 'Tokyo',
      country: 'Japan',
      duration: '6 Days / 5 Nights',
      groupSize: '8 Athletes',
      price: 1190,
      originalPrice: 1400,
      featuredImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85',
      ],
      category: 'Speed & Biomechanics',
      rating: 4.96,
      reviewCount: 35,
      difficulty: 'Active',
      vibe: 'Fast, High-Tech, Focused',
      highlights: [
        'Midnight sprint sessions at private synthetic tracks',
        'Gait force plate analysis with Japanese track coaches',
        'Traditional Sento contrast bath recovery routines',
        'Targeted lean protein Wagyu and Izakaya fueling',
      ],
      included: [
        '5 nights at design hotel in Shibuya with private gym floor',
        'Exclusive track rental fees and high-speed video capture',
        'All sento entries and physical therapy treatments',
        'Wayfarer Kinetic custom sprint spike kit bag',
      ],
      itinerary: [
        {
          day: 1,
          title: 'Tokyo Arrival & Shinjuku Night Strides',
          description: 'Arrival and light kinetic priming run through Yoyogi Park followed by clean ramen fueling.',
          location: 'Yoyogi & Shibuya',
          timeSlot: '16:00 - 21:00',
        },
        {
          day: 2,
          title: 'Force Plate Biometrics & Sprint Form',
          description: 'Laboratory assessment of ground reaction force, stride length, and foot strike efficiency.',
          location: 'Komazawa Olympic Park',
          timeSlot: '09:00 - 15:00',
        },
        {
          day: 3,
          title: 'Velodrome Acceleration & Plyometrics',
          description: 'High-cadence interval intervals on banked wood velodrome curves and explosive box jumping.',
          location: 'Tokyo Velodrome Lab',
          timeSlot: '10:00 - 16:00',
        },
        {
          day: 4,
          title: 'Midnight Urban Track Circuit',
          description: 'High-energy floodlit 400m intervals beneath the Tokyo skyline.',
          location: 'Meguro Track',
          timeSlot: '21:00 - 23:30',
        },
        {
          day: 5,
          title: 'Subterranean Contrast Therapy',
          description: '2-hour contrast water therapy rotating between 42°C mineral hot springs and 8°C chilled tubs.',
          location: 'Daikanyama Recovery Spa',
          timeSlot: '10:00 - 15:00',
        },
        {
          day: 6,
          title: 'Final Benchmarks & Tokyo Farewell',
          description: 'Post-camp benchmark test, data export to your fitness tracker, and communal breakfast.',
          location: 'Shibuya Base',
          timeSlot: '08:30 - 12:00',
        },
      ],
    },
    {
      id: 'fit-algarve-surf-strength',
      slug: 'algarve-ocean-swell-conditioning',
      title: 'Algarve: Ocean Swell & Kettlebell Camp',
      tagline: 'Heavy carry beach sand sessions, Atlantic surf power, and sun recovery.',
      city: 'Sagres',
      country: 'Portugal',
      duration: '5 Days / 4 Nights',
      groupSize: '10 Athletes',
      price: 670,
      originalPrice: 820,
      featuredImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=85',
      ],
      category: 'Functional Power',
      rating: 4.95,
      reviewCount: 29,
      difficulty: 'Moderate',
      vibe: 'Raw, Sun-Drenched, Gritty',
      highlights: [
        'Cliffside sand dune kettlebell circuits',
        'Atlantic big swell paddle endurance training',
        'Breathwork and apnea underwater survival drills',
        'Grilled wild sea bass communal recovery dinners',
      ],
      included: [
        'Cliffside ocean villa accommodation with pool',
        'Rip Curl pro wetsuits and custom surfboards',
        'All equipment (kettlebells, sandbags, sleds)',
        'Daily organic coastal nutrition and mineral shakes',
      ],
      itinerary: [
        {
          day: 1,
          title: 'Coastal Base Arrival & Breath Assessment',
          description: 'Check-in to oceanfront villa. Sunset diaphragmatic breathwork class overlooking Atlantic cliffs.',
          location: 'Sagres Cliffs',
          timeSlot: '15:30 - 20:30',
        },
        {
          day: 2,
          title: 'Sandbag Drag & Sand Dune Sprints',
          description: 'Unstable surface training on golden dunes followed by ocean swimming intervals.',
          location: 'Praia do Amado',
          timeSlot: '08:00 - 13:00',
        },
        {
          day: 3,
          title: 'Swell Mechanics & Core Rotation',
          description: 'Paddling endurance in heavy breakers and rotational power kettlebell work.',
          location: 'Arrifana Bay',
          timeSlot: '09:00 - 16:00',
        },
        {
          day: 4,
          title: 'Apnea & Water Composure',
          description: 'Pool and ocean breath-hold safety drills to develop deep nervous system calm under stress.',
          location: 'Sagres Marine Cove',
          timeSlot: '10:00 - 15:30',
        },
        {
          day: 5,
          title: 'Sunrise Beach Workout & Departure',
          description: 'Final full-body team grinder workout on the sand followed by ocean plunge and protein feast.',
          location: 'Praia do Tonel',
          timeSlot: '07:30 - 12:00',
        },
      ],
    },
  ],
  pricingPlans: [
    {
      id: 'plan-kinetic-starter',
      name: 'Single Camp Entry',
      tagline: 'Join any single athletic camp without recurring dues.',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Direct admission to 1 athletic camp with full coaching',
        'Biometric lab analysis and video review session',
        'All specialized sports nutrition and hydration kits',
        'Physiotherapist recovery checkups on location',
      ],
      ctaText: 'Explore Camps',
      ctaHref: '/trips',
    },
    {
      id: 'plan-kinetic-pass',
      name: 'Kinetic Season Pass',
      tagline: 'Annual access for dedicated athletes aiming for peak capability.',
      monthlyPrice: 69,
      annualPrice: 55,
      popular: true,
      features: [
        '20% off all international training camps',
        'AI Training & Recovery Architect with weekly updates',
        'Private monthly online masterclasses with Olympic coaches',
        'Kinetic lab apparel pack shipped to your door quarterly',
        'Priority spots on high-demand altitude camps',
      ],
      ctaText: 'Start Season Pass',
      ctaHref: '/pricing',
    },
    {
      id: 'plan-kinetic-elite',
      name: 'Private Squad Camp',
      tagline: 'Custom private camp designed for your club or corporate team.',
      monthlyPrice: 240,
      annualPrice: 195,
      features: [
        'Private destination selection and bespoke coaching staff',
        'Comprehensive bloodwork and VO2 max lab protocol',
        'Private sports chef and customized macronutrient meal plans',
        '1-on-1 performance director assigned full-time',
      ],
      ctaText: 'Commission Squad',
      ctaHref: '/contact',
    },
  ],
  faq: [
    {
      question: 'What fitness level is required for Kinetic camps?',
      answer: 'While our camps are demanding, we scale every workout into intensity tiers. If you run regularly, lift, or practice functional fitness 3+ days a week, you will thrive. Coaches tailor load, speed, and volume to individual athlete baselines.',
      category: 'Prerequisites',
    },
    {
      question: 'Do I need specialized equipment?',
      answer: 'We provide all heavy equipment, weights, sleds, surf gear, and recovery devices (like pneumatic compression boots and massage guns). You only bring personal trail running shoes, swim gear, and comfortable apparel.',
      category: 'Equipment',
    },
    {
      question: 'How do you prevent overtraining during camps?',
      answer: 'Recovery is 50% of the curriculum. We monitor daily heart rate variability (HRV), incorporate contrast hydro-therapy, structured breathwork, and mandatory mobility sessions to ensure adaptation without breakdown.',
      category: 'Science',
    },
  ],
  testimonials: [
    {
      id: 'test-fit-1',
      name: 'Dr. Liam Thorne',
      role: 'Triathlete & ER Physician',
      city: 'Zurich',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      quote: 'The Chamonix altitude camp pushed my lactate threshold beyond anything I attained in the gym. The integration of high-altitude pacing and cold water recovery was sports science executed to perfection.',
      tripTaken: 'Chamonix: Vertical Trail & Alpine Oxygen Camp',
      rating: 5,
    },
    {
      id: 'test-fit-2',
      name: 'Maya Kowalski',
      role: 'CrossFit Competitor',
      city: 'Chicago',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      quote: 'Tokyo midnight sprints followed by deep Japanese mineral hot baths gave me the sharpest training week of my life. The coaches care deeply about posture, force vectors, and injury prevention.',
      tripTaken: 'Tokyo: Midnight Track & Hydro-Recovery Labs',
      rating: 5,
    },
  ],
  orbitalItinerary: [
    {
      day: 1,
      title: 'Biometric Baselining & Stride Audit',
      time: '14:00',
      summary: 'Lactate threshold testing & joint mobility screening.',
      details: 'Full diagnostic check to map individual metabolic zones, joint ranges of motion, and baseline sprint power before loading begins.',
      location: 'Alpine Kinetic Lab',
      coordinateLabel: '45.9237° N, 6.8694° E',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    },
    {
      day: 2,
      title: 'Vertical Elevation Loading',
      time: '08:00',
      summary: 'Sustained uphill tempo and glute-drive mechanics.',
      details: 'Conquering 1,000m vertical ascent with cadence control, breath regulation, and mid-mountain electrolyte fueling.',
      location: 'Planpraz Ridge',
      coordinateLabel: '45.9381° N, 6.8522° E',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    },
    {
      day: 3,
      title: 'Glacial Hydro-Therapy',
      time: '15:30',
      summary: 'Controlled cold immersion to flush metabolic waste.',
      details: 'Rotational 3-minute immersions in 6°C glacial snowmelt rivers with guided parasympathetic down-regulation.',
      location: 'Arve River Glacial Pools',
      coordinateLabel: '45.9189° N, 6.8741° E',
      image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    },
    {
      day: 4,
      title: 'Maximal Power Grinder',
      time: '09:00',
      summary: 'Heavy carries, sled sprints, and technical team relays.',
      details: 'High-intensity neuromuscular training simulating alpine rescue carries and sprint finishes under extreme mental fatigue.',
      location: 'Chamonix High Base',
      coordinateLabel: '45.9312° N, 6.8790° E',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=800&q=80',
    },
  ],
  blogPosts: [
    {
      id: 'fit-post-1',
      slug: 'the-science-of-cold-water-adaptation',
      title: 'Vascular Flushing: Why We Plunge into 6°C Alpine Rivers',
      excerpt: 'How acute thermal shock stimulates norepinephrine, reduces delayed muscle soreness, and re-calibrates the autonomic nervous system.',
      content: `## The Hemodynamic Squeeze

When an athlete steps into sub-7°C glacier runoff, peripheral vasoconstriction forces blood toward core vital organs. Upon exiting, powerful vasodilation occurs, flushing accumulated metabolites and inducing deep central nervous system tranquility.

## Neurochemical Cascades

Studies show immersion triggers up to a 250% increase in plasma dopamine and a 530% surge in norepinephrine, producing long-lasting mental clarity without the jitters of caffeine.

## The Chamonix Protocol

We pair three minutes of immersion with nasal diaphragmatic breathing, ensuring athletes do not hyperventilate into sympathetic overdrive.`,
      coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Dr. Hendrik Holt',
        role: 'Director of Applied Physiology',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'March 02, 2026',
      readTime: '7 min read',
      category: 'Physiology',
    },
    {
      id: 'fit-post-2',
      slug: 'altitude-training-vo2-max',
      title: 'Hypoxic Conditioning at 2,400 Meters: The Alpine Blueprint',
      excerpt: 'How training above the tree line stimulates erythropoietin and alters mitochondrial density in endurance athletes.',
      content: `## Partial Pressure and Oxygen Debt

At high altitudes, the percentage of oxygen in the air remains 20.9%, but atmospheric pressure drops dramatically. Every breath delivers fewer oxygen molecules to working alveoli.

## Mitochondrial Adaptation

Our five-day alpine camps stimulate cellular adaptations that persist for up to eight weeks post-descent, elevating sea-level power output and mental grit.`,
      coverImage: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Coach Marcus Vance',
        role: 'Head of Human Performance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'February 15, 2026',
      readTime: '6 min read',
      category: 'Endurance',
    },
    {
      id: 'fit-post-3',
      slug: 'tokyo-track-biomechanics',
      title: 'Ground Reaction Force: Analyzing Sprint Geometry on Tokyo Rubber',
      excerpt: 'High-speed 240fps video capture reveals why millimeter foot placement shifts your horizontal velocity vector.',
      content: `## Force Vectors Over Muscle Bulk

Sprint speed is not determined by how hard you push back, but by how rapidly and vertically you apply force into the ground during the 0.09-second stance phase.

## The Japanese Track Philosophy

Working with sprint technicians in Komazawa Olympic Park, we dissect foot dorsiflexion and pelvic tilt to shave tenths off 100m acceleration splits.`,
      coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Maya Kowalski',
        role: 'Biomechanics Lead',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'January 28, 2026',
      readTime: '8 min read',
      category: 'Biomechanics',
    },
    {
      id: 'fit-post-4',
      slug: 'ocean-swell-apnea-training',
      title: 'Breath-Hold Resilience: Developing Calm in Heavy Atlantic Surf',
      excerpt: 'Static and dynamic apnea protocols to downregulate nervous system fear responses when pinned beneath a set wave.',
      content: `## The Mammalian Dive Reflex

Submerging the face in cold seawater triggers instantaneous bradycardia—slowing the heartbeat and conserving arterial oxygen for cerebral micro-circulation.

## Overcoming the Carbon Dioxide Urge

The burning sensation to breathe is triggered not by lack of oxygen, but by rising carbon dioxide. Training hypercapnic tolerance builds unbreakable mental poise.`,
      coverImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Dr. Hendrik Holt',
        role: 'Director of Applied Physiology',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'January 10, 2026',
      readTime: '6 min read',
      category: 'Breathwork',
    },
    {
      id: 'fit-post-5',
      slug: 'kettlebell-sand-dune-complexes',
      title: 'Unstable Terrain Dynamics: Heavy Carries on Coastal Sand Dunes',
      excerpt: 'Why training on shifting sand recruits stabilizer musculature that rubber gym flooring leaves dormant.',
      content: `## Dissipation of Elastic Energy

On hard pavement, the Achilles tendon acts like a carbon fiber spring. On loose sand, 80% of that rebound energy disappears, forcing raw muscular recruitment.

## Sagres Coastal Grinder

Our athletes carry 32kg cast iron kettlebells up 45-degree sand embankments, building indestructible foot arches and bulletproof hip stabilizers.`,
      coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Coach Marcus Vance',
        role: 'Head of Human Performance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'December 18, 2025',
      readTime: '5 min read',
      category: 'Strength',
    },
    {
      id: 'fit-post-6',
      slug: 'heart-rate-variability-recovery',
      title: 'Decoding Your HRV: When to Attack the Ridge and When to Rest',
      excerpt: 'Measuring root-mean-square of successive differences (RMSSD) to prevent overtraining syndrome on multi-day camps.',
      content: `## The Autonomic Balance

High HRV indicates robust parasympathetic adaptability. When HRV drops by more than 1.5 standard deviations from baseline, aggressive loading causes cellular breakdown rather than adaptation.`,
      coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Dr. Liam Thorne',
        role: 'Consulting Sports Physician',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'November 29, 2025',
      readTime: '7 min read',
      category: 'Physiology',
    },
    {
      id: 'fit-post-7',
      slug: 'glycogen-replenishment-protocols',
      title: 'Targeted Carbohydrate Periodization for 30km Mountain Traverses',
      excerpt: 'Why relying on fructose alone leads to gastrointestinal distress, and how dual-source glucose/maltodextrin ratios sustain 90g/hr intake.',
      content: `## SGLT1 Transporter Saturation

The human gut can only absorb 60g of pure glucose per hour. By introducing fructose utilizing the GLUT5 pathway, absorption ceilings jump to 90-100g per hour without cramping.`,
      coverImage: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Maya Kowalski',
        role: 'Biomechanics Lead',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'November 04, 2025',
      readTime: '6 min read',
      category: 'Nutrition',
    },
    {
      id: 'fit-post-8',
      slug: 'fascial-elasticity-trail-running',
      title: 'The Tensegrity Network: Training the Collagen Matrix for Scree Descents',
      excerpt: 'Moving beyond isolated muscles to understand how the plantar fascia and thoracolumbar sheath absorb massive downhill shock.',
      content: `## Downhill Eccentric Braking

Descending 1,200 vertical meters over loose rock generates ground forces exceeding 5x body weight. Athletes who rely solely on quadriceps suffer acute fatigue within twenty minutes.`,
      coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Coach Marcus Vance',
        role: 'Head of Human Performance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'October 12, 2025',
      readTime: '8 min read',
      category: 'Biomechanics',
    },
    {
      id: 'fit-post-9',
      slug: 'circadian-sleep-optimization',
      title: 'Deep Architecture of Sleep: Cellular Rebuilding in High Alpine Chalets',
      excerpt: 'Why sub-17°C room temperatures and zero blue light amplify human growth hormone release during stage 3 non-REM sleep.',
      content: `## Thermal Regulation and Somatotropin

Deep slow-wave sleep requires core body temperature to drop approximately 1°C. In our alpine cabins, cedarwood aromatics and crisp glacial air prime the brain for maximal physical restoration.`,
      coverImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1000&q=80',
      author: {
        name: 'Dr. Liam Thorne',
        role: 'Consulting Sports Physician',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      },
      publishedAt: 'September 19, 2025',
      readTime: '5 min read',
      category: 'Recovery',
    },
  ],
  socials: [
    { name: 'Instagram', href: 'https://instagram.com', icon: 'Instagram' },
    { name: 'Strava', href: 'https://strava.com', icon: 'Activity' },
    { name: 'YouTube', href: 'https://youtube.com', icon: 'Video' },
  ],
  seoKeywords: ['athletic training camp', 'chamonix trail camp', 'altitude running camp', 'tokyo sprint camp', 'sports recovery retreat'],
};
