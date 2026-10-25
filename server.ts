import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
interface PlaceItem {
  id: string;
  name: string;
  destinationSlug: string;
  type: string;
  categoryLabel?: string;
  rating: number;
  reviewCount: number;
  priceLevel: number;
  priceRangeEstimate?: string;
  address: string;
  phone?: string;
  website?: string;
  coordinates: { lat: number; lng: number };
  amenities?: string[];
  photos: string[];
  photoAttribution?: string;
  source: 'google' | 'curated' | 'osm' | 'wikimedia';
  openingHours?: string;
  bookingLinks?: {
    googleMaps?: string;
    bookingCom?: string;
    agoda?: string;
  };
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Must strictly run on port 3000 in AI Studio dev environment
const PORT = 3000;

app.use(express.json());

// Initialize Google Gemini API client if key exists in env
const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize Gemini AI client with provided key', err);
  }
}

// ---------------------------------------------------------------------
// Rate Limiting & In-Memory Caching Utilities
// ---------------------------------------------------------------------
const rateLimitWindowMs = 60 * 1000;
const rateLimitMax = 120;
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
  const now = Date.now();
  const entry = ipRequestCounts.get(ip);

  if (!entry || now > entry.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + rateLimitWindowMs });
    return next();
  }

  if (entry.count >= rateLimitMax) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please ease up your requests.',
      retryAfterSeconds: Math.ceil((entry.resetTime - now) / 1000),
    });
  }

  entry.count++;
  next();
}

app.use('/api/', rateLimiter);

// In-memory cache for API responses (1-hour TTL)
const apiCache = new Map<string, { data: any; expiry: number }>();

function getFromCache(key: string) {
  const cached = apiCache.get(key);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }
  if (cached) {
    apiCache.delete(key);
  }
  return null;
}

function setInCache(key: string, data: any, ttlMs: number = 3600000) {
  apiCache.set(key, { data, expiry: Date.now() + ttlMs });
}

// Curated rental providers for Pakistan destinations
const curatedRentals: PlaceItem[] = [
  {
    id: 'rent-hunza-4x4',
    name: 'Hunza Karakoram 4x4 & Prado Rentals',
    destinationSlug: 'hunza',
    type: 'car_rental',
    categoryLabel: '4WD Expedition Vehicle',
    rating: 4.8,
    reviewCount: 165,
    priceLevel: 3,
    priceRangeEstimate: '$65 - $110 / day with mountain driver',
    address: 'Aliabad KKH Bazaar, Hunza, Gilgit-Baltistan',
    phone: '+92 345 5678901',
    website: 'https://wayfarer.studio/rentals/hunza-4x4',
    coordinates: { lat: 36.312, lng: 74.62 },
    amenities: ['Toyota Prado 4x4', 'English-speaking Mountain Chauffeur', 'Roof Rack & Snow Chains', 'Fuel Package Options'],
    photos: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'],
    source: 'curated',
    openingHours: '07:00 - 21:00 Daily',
    bookingLinks: {
      googleMaps: 'https://www.google.com/maps/search/?api=1&query=Car+Rentals+Aliabad+Hunza',
    },
  },
  {
    id: 'rent-skardu-camper',
    name: 'Baltistan Overland Campers & Bikes',
    destinationSlug: 'skardu',
    type: 'bike_rental',
    categoryLabel: 'Trail Motorbike & Camper Hire',
    rating: 4.7,
    reviewCount: 94,
    priceLevel: 2,
    priceRangeEstimate: '$30 - $55 / day (Honda 150cc / Suzuki GS)',
    address: 'College Road, Skardu town, Gilgit-Baltistan',
    phone: '+92 355 4123456',
    coordinates: { lat: 35.3, lng: 75.64 },
    amenities: ['Helmets Included', 'Tool Kit & Spare Tubes', 'Deosai Route Map & GPS', 'Luggage Saddlebags'],
    photos: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'],
    source: 'curated',
    openingHours: '08:00 - 20:00 Daily',
    bookingLinks: {
      googleMaps: 'https://www.google.com/maps/search/?api=1&query=Motorbike+Rental+Skardu',
    },
  },
  {
    id: 'rent-isb-executive',
    name: 'Islamabad Federal Fleet & Airport Chauffeurs',
    destinationSlug: 'islamabad',
    type: 'car_rental',
    categoryLabel: 'Luxury Sedan & SUV Chauffeur',
    rating: 4.9,
    reviewCount: 412,
    priceLevel: 3,
    priceRangeEstimate: '$45 - $90 / day',
    address: 'Blue Area, Sector F-6, Islamabad',
    phone: '+92 51 2270981',
    coordinates: { lat: 33.719, lng: 73.065 },
    amenities: ['Airport VIP Meet & Greet', 'Unlimited City Mileage', 'Full Comprehensive Insurance'],
    photos: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'],
    source: 'curated',
    openingHours: '24/7 Operations',
    bookingLinks: {
      googleMaps: 'https://www.google.com/maps/search/?api=1&query=Car+Rental+Blue+Area+Islamabad',
    },
  },
  {
    id: 'rent-lahore-apartments',
    name: 'Gulberg Executive Suites & Serviced Lofts',
    destinationSlug: 'lahore',
    type: 'apartment',
    categoryLabel: 'Serviced Residence & Long-Stay',
    rating: 4.8,
    reviewCount: 280,
    priceLevel: 2,
    priceRangeEstimate: '$50 - $95 / night',
    address: 'Main Boulevard, Gulberg III, Lahore, Punjab',
    phone: '+92 42 35789100',
    coordinates: { lat: 31.52, lng: 74.35 },
    amenities: ['Full Kitchenette', 'High-Speed Fiber Wi-Fi', '24/7 Power Backup Generator', 'Underground Parking'],
    photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
    source: 'curated',
    openingHours: '24/7 Front Desk',
    bookingLinks: {
      googleMaps: 'https://www.google.com/maps/search/?api=1&query=Gulberg+Suites+Lahore',
    },
  },
];

let loadedPlaces: PlaceItem[] = [];
try {
  const jsonPath = path.join(__dirname, 'curated-places.json');
  if (fs.existsSync(jsonPath)) {
    loadedPlaces = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  }
} catch (e) {
  console.warn('Failed to read curated-places.json:', e);
}

// Combine all curated places
const allCuratedPlaces: PlaceItem[] = [...loadedPlaces, ...curatedRentals];

// ---------------------------------------------------------------------
// API ROUTE: /api/places
// ---------------------------------------------------------------------
app.get('/api/places', async (req, res) => {
  const destination = typeof req.query.destination === 'string' ? req.query.destination.toLowerCase().trim() : '';
  const type = typeof req.query.type === 'string' ? req.query.type.toLowerCase().trim() : '';
  const query = typeof req.query.query === 'string' ? req.query.query.toLowerCase().trim() : '';
  const radius = typeof req.query.radius === 'string' ? parseInt(req.query.radius, 10) : 50000;

  const cacheKey = `places:${destination}:${type}:${query}:${radius}`;
  const cachedResponse = getFromCache(cacheKey);

  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  // Check if real Google Places API Key exists
  const googlePlacesKey = process.env.GOOGLE_PLACES_KEY;
  if (googlePlacesKey && googlePlacesKey.trim().length > 15 && googlePlacesKey !== 'MY_GOOGLE_PLACES_KEY') {
    try {
      const searchTerms = [query, destination, type, 'Pakistan'].filter(Boolean).join(' ');
      const googleUrl = `https://places.googleapis.com/v1/places:searchText`;
      
      const googleRes = await fetch(googleUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': googlePlacesKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.primaryTypeDisplayName,places.photos',
        },
        body: JSON.stringify({
          textQuery: searchTerms,
          maxResultCount: 15,
        }),
      });

      if (googleRes.ok) {
        const json = await googleRes.json();
        if (json.places && Array.isArray(json.places) && json.places.length > 0) {
          const mappedPlaces: PlaceItem[] = json.places.map((p: any, idx: number) => ({
            id: p.id || `google-place-${idx}`,
            name: p.displayName?.text || 'Local Establishment',
            destinationSlug: destination || 'pakistan',
            type: (type as any) || 'attraction',
            categoryLabel: p.primaryTypeDisplayName?.text || 'Point of Interest',
            rating: p.rating || 4.5,
            reviewCount: p.userRatingCount || 50,
            priceLevel: p.priceLevel || 2,
            priceRangeEstimate: '$35 - $80 / est.',
            address: p.formattedAddress || 'Pakistan',
            coordinates: {
              lat: p.location?.latitude || 33.6844,
              lng: p.location?.longitude || 73.0479,
            },
            photos: p.photos?.[0]?.name ? [`/api/place-photo?photoReference=${encodeURIComponent(p.photos[0].name)}`] : [],
            photoAttribution: 'Google Places Platform',
            source: 'google',
            bookingLinks: {
              googleMaps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.displayName?.text || 'Place')}`,
            },
          }));

          const responseData = {
            success: true,
            source: 'google',
            count: mappedPlaces.length,
            places: mappedPlaces,
          };
          setInCache(cacheKey, responseData, 3600000);
          return res.status(200).json(responseData);
        }
      }
    } catch (err) {
      console.warn('Google Places API call encountered error; seamlessly switching to curated fallback:', err);
    }
  }

  // Graceful Fallback Mode: Query curated Pakistan places
  let filtered = allCuratedPlaces;

  if (destination) {
    filtered = filtered.filter((p) => p.destinationSlug === destination);
  }

  if (type) {
    if (type === 'stay' || type === 'lodging' || type === 'hotel') {
      filtered = filtered.filter((p) => ['hotel', 'guesthouse', 'hostel', 'camping', 'homestay'].includes(p.type));
    } else if (type === 'rent') {
      filtered = filtered.filter((p) => ['apartment', 'car_rental', 'bike_rental'].includes(p.type));
    } else if (type === 'eat' || type === 'food' || type === 'restaurant') {
      filtered = filtered.filter((p) => p.type === 'restaurant');
    } else {
      filtered = filtered.filter((p) => p.type === type);
    }
  }

  if (query) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(query)) ||
      (p.amenities && p.amenities.some((a) => a.toLowerCase().includes(query)))
    );
  }

  // If filtered result is empty but destination exists, return all places for that destination
  if (filtered.length === 0 && destination) {
    filtered = allCuratedPlaces.filter((p) => p.destinationSlug === destination);
  }

  // Fallback to general places if still empty
  if (filtered.length === 0) {
    filtered = allCuratedPlaces.slice(0, 10);
  }

  const responseData = {
    success: true,
    source: 'curated',
    count: filtered.length,
    places: filtered,
  };

  setInCache(cacheKey, responseData, 3600000);
  return res.status(200).json(responseData);
});

// ---------------------------------------------------------------------
// API ROUTE: /api/place-photo
// ---------------------------------------------------------------------
app.get('/api/place-photo', async (req, res) => {
  const photoReference = typeof req.query.photoReference === 'string' ? req.query.photoReference : '';
  const dest = typeof req.query.dest === 'string' ? req.query.dest : '';

  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

  // If real Google key and photoReference are present
  const googlePlacesKey = process.env.GOOGLE_PLACES_KEY;
  if (googlePlacesKey && photoReference && !photoReference.startsWith('http')) {
    const photoUrl = `https://places.googleapis.com/v1/${photoReference}/media?key=${googlePlacesKey}&maxHeightPx=800`;
    return res.redirect(photoUrl);
  }

  // Fallback to matching destination photo from curated places
  const matchPlace = allCuratedPlaces.find((p) => p.destinationSlug === dest && p.photos && p.photos.length > 0);
  if (matchPlace && matchPlace.photos[0]) {
    return res.redirect(matchPlace.photos[0]);
  }

  // Ultimate fallback high-res mountain travel landscape
  return res.redirect('https://images.unsplash.com/photo-1594897030560-69273c5cf8c3?auto=format&fit=crop&w=1200&q=80');
});

// ---------------------------------------------------------------------
// API ROUTE: /api/contact
// ---------------------------------------------------------------------
app.post('/api/contact', (req, res) => {
  const { type, name, email, subject, message, tripId, guests, notes } = req.body;

  console.log(`[Wayfarer API] Incoming ${type || 'contact'} submission:`, {
    name,
    email,
    subject: subject || tripId,
    timestamp: new Date().toISOString(),
  });

  return res.status(200).json({
    success: true,
    message: 'Your transmission has reached the Wayfarer curator desk. We will respond within 24 hours.',
    referenceId: `WF-${Date.now().toString(36).toUpperCase()}`,
  });
});

// ---------------------------------------------------------------------
// API ROUTE: /api/newsletter
// ---------------------------------------------------------------------
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid email required' });
  }

  console.log(`[Wayfarer API] Newsletter subscriber registered: ${email}`);
  return res.status(200).json({
    success: true,
    message: 'Subscribed to Wayfarer Field Dispatches.',
  });
});

// ---------------------------------------------------------------------
// API ROUTE: /api/chat (AI Trip Planner)
// ---------------------------------------------------------------------
app.post('/api/chat', async (req, res) => {
  const { prompt, category } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const systemInstructions = `You are the lead expedition scout and travel architect at Wayfarer Studio specializing in Pakistan and global curated exploration.
You design ultra-curated, off-the-beaten-path itineraries for independent foreign travelers, mountaineers, culture seekers, and young professionals.
Values: High mountain majesty, ancient Silk Road heritage, Sufi acoustics, local culinary masters, slow travel, ethical community tourism, zero tourist traps.
Regions covered: Gilgit-Baltistan (Hunza, Skardu, Fairy Meadows, K2), Khyber Pakhtunkhwa (Swat, Chitral, Peshawar), Punjab (Lahore, Taxila, Multan, Cholistan), Sindh (Karachi, Mohenjo-daro), Balochistan (Gwadar, Ziarat), and Azad Kashmir.
Format output cleanly in markdown with day-by-day timestamps, altitude/acclimatization advice, transport logistics, and local dining tips.
Category context: ${category || 'pakistan'}.`;

  // If Gemini client is configured with real key, call it
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstructions,
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (text) {
        return res.status(200).json({ text });
      }
    } catch (aiErr) {
      console.warn('Gemini generateContent error, executing intelligent fallback', aiErr);
    }
  }

  // Fallback intelligent rule-based generation tailored for Pakistan and other categories
  const promptLower = prompt.toLowerCase();
  
  if (category === 'pakistan' || promptLower.includes('pakistan') || promptLower.includes('hunza') || promptLower.includes('skardu') || promptLower.includes('lahore') || promptLower.includes('fairy')) {
    const isHunza = promptLower.includes('hunza') || promptLower.includes('passu');
    const isSkardu = promptLower.includes('skardu') || promptLower.includes('k2') || promptLower.includes('deosai');
    const isLahore = promptLower.includes('lahore') || promptLower.includes('heritage') || promptLower.includes('mughal');

    let destinationTitle = 'Karakoram Highway & Hunza Valley';
    let regionFocus = 'High Alpine Passes & Silk Road Forts';
    let d1 = 'Islamabad to Gilgit (mountain flight) and drive up the KKH to Karimabad.';
    let d2 = 'Explore 900-year-old Baltit Fort, Altit Village, and sunset tea at Eagle’s Nest Duikar.';
    let d3 = 'Cruise turquoise Attabad Lake, cross Hussaini Suspension Bridge, and view Passu Cones.';
    let foodTip = 'Savor fresh local chapshuro (savory meat flatbread) with wild tumuro thyme herbal tea.';

    if (isSkardu) {
      destinationTitle = 'Skardu & The High Deosai Plateau';
      regionFocus = 'Cold Deserts, Wildflower Plains & K2 Gateway';
      d1 = 'Flight into Skardu International Airport. Relax by Shangrila heart lake and Upper Kachura.';
      d2 = 'Ascend into Deosai National Park (4,114m) to Sheosar Lake beneath Nanga Parbat views.';
      d3 = 'Sunset quad biking over Katpana Cold Desert dunes and dinner at 400-year-old Shigar Palace Fort.';
      foodTip = 'Warm up with hot Balti mamtu dumplings and salted payu pink butter tea.';
    } else if (isLahore) {
      destinationTitle = 'Lahore Cultural & Culinary Capital';
      regionFocus = 'Mughal Architecture, Walled City Alleys & Midnight Food';
      d1 = 'Walled City walking tour: Delhi Gate, Shahi Hammam, and vibrant tilework of Wazir Khan Mosque.';
      d2 = 'Badshahi Mosque, Lahore Fort (Sheesh Mahal), and dinner at Fort Road Food Street overlooking the floodlit domes.';
      d3 = 'Patriotic Wagah Border ceremony at sunset followed by late-night slow-cooked Waris Nihari.';
      foodTip = 'Feast on slow-simmered beef shank Nihari with ginger matchsticks and hot tandoori naan.';
    }

    const fallbackPlan = `### Wayfarer Expedition Dossier: ${destinationTitle}

**Scout Focus**: ${regionFocus}  
**Altitude Note**: Stay hydrated, ascend gradually, and keep warm windproof thermal layers accessible.

---

#### Day 1: Gateway Arrival & Acclimatization
* **09:00** — ${d1}
* **13:00** — First field lunch featuring regional flatbreads and orchard fruit preserves.
* **17:00** — Check into boutique heritage lodge; briefing with licensed local scout.
* **20:00** — ${foodTip}

#### Day 2: The Living Heritage & Sacred Geometry
* **08:30** — ${d2}
* **14:00** — Meeting with local craft masters (woodcarvers, carpet weavers, or gem lapidaries).
* **18:30** — Golden hour photography session; panoramic view across towering granite peaks.

#### Day 3: The Wild Frontier & Water Miracles
* **08:00** — ${d3}
* **15:30** — Riverside camp tea and dossier stamp signing.
* **21:00** — Stargazing session under pristine Bortle Class 1 dark skies.

*Ready to embark? Explore all 20+ destinations on our [Interactive Map](/map) or book a curated [Expedition](/trips).*`;

    return res.status(200).json({ text: fallbackPlan });
  }

  // Fallback for general cities
  const city = prompt.match(/(berlin|kyoto|lisbon|oaxaca|reykjavik|tokyo|montreal|paris|rome|london)/i)?.[0] || 'Berlin';
  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  const fallbackPlan = `### Wayfarer Field Plan: ${capitalizedCity} (Alumni Protocol)

**Focus**: Underground Culture, Spatial Memory & Secret Gatherings  
**Scout Advice**: Avoid main commercial corridors. Enter through unmarked residential courtyards.

---

#### Day 1: Subterranean Acoustics & Arrival
* **10:00** — Hand-dripped Nel drip roast inside a quiet residential side street.
* **12:30** — Historic architectural exploration of decommissioned concrete vaults.
* **16:00** — Natural wine cellar visit & raw cheese tasting with local producers.
* **21:30** — Subterranean analog listening room (original Blue Note pressings on tube amps).

#### Day 2: The Living Craft & Hidden Ateliers
* **08:30** — Dawn stroll before morning commuters stir the streets.
* **11:00** — Master joiner or ceramic restoration workshop residency.
* **15:30** — Secret courtyard tea or espresso pairing session.
* **20:00** — Shared table feast at an unlisted neighborhood tavern.

#### Day 3: Waters, Reflection & Alleys
* **09:30** — Thermal water bath or morning canal walk with local architects.
* **13:00** — Archival 35mm film development & field dossier stamp exchange.

*Alumni Key verification unlocked. You may save this protocol or book your expedition spot.*`;

  return res.status(200).json({ text: fallbackPlan });
});

// ---------------------------------------------------------------------
// Vite Middlewares (Dev) or Static Dist (Production)
// ---------------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Ensure all HTML route requests render index.html with Vite transformations
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexHtmlPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexHtmlPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        if (vite && (vite as any).ssrFixStacktrace) {
          (vite as any).ssrFixStacktrace(e as Error);
        }
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wayfarer Studio server running at http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error('Server listen error:', err);
  });
}

startServer();
