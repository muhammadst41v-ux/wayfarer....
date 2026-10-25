export type SiteCategory = 'travel' | 'fitness' | 'food' | 'pakistan';
export type ThemePreset = 'cinematic-amber' | 'clean-light' | 'bold-neon';

export type PakistanRegion =
  | 'Gilgit-Baltistan'
  | 'Khyber Pakhtunkhwa'
  | 'Punjab'
  | 'Sindh'
  | 'Balochistan'
  | 'Azad Kashmir'
  | 'Islamabad';

export type DestinationInterest =
  | 'mountains'
  | 'culture'
  | 'food'
  | 'adventure'
  | 'history'
  | 'spiritual'
  | 'family';

export interface DestinationFood {
  name: string;
  description: string;
}

export interface PlaceItem {
  id: string;
  name: string;
  destinationSlug: string;
  type:
    | 'hotel'
    | 'guesthouse'
    | 'hostel'
    | 'camping'
    | 'homestay'
    | 'apartment'
    | 'car_rental'
    | 'bike_rental'
    | 'restaurant'
    | 'attraction'
    | 'hospital'
    | 'atm'
    | 'airport';
  categoryLabel?: string;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4; // $, $$, $$$, $$$$
  priceRangeEstimate: string; // e.g. "$35 - $65 / night (est.)"
  address: string;
  phone?: string;
  website?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities?: string[];
  photos: string[];
  photoAttribution?: string;
  source: 'curated' | 'google' | 'osm';
  openingHours?: string;
  bookingLinks: {
    googleMaps: string;
    bookingCom?: string;
    agoda?: string;
  };
}

export interface PakistanDestination {
  id: string;
  slug: string;
  name: string;
  region: PakistanRegion;
  coordinates: {
    lat: number;
    lng: number;
  };
  shortDescription: string;
  longDescription: string;
  bestMonths: string[];
  altitude: string;
  difficulty: 'Relaxed' | 'Moderate' | 'Challenging' | 'Expert';
  howToReach: {
    air?: string;
    road?: string;
    train?: string;
  };
  permitsNeeded: string;
  safetyNotes: string;
  estimatedDailyBudget: {
    budget: number;
    mid: number;
    luxury: number;
  };
  interests: DestinationInterest[];
  tags: string[];
  highlights: string[];
  localFood: DestinationFood[];
  localCultureNotes: string[];
  curatedYouTubeVideoIds: string[];
  wikipediaTitle: string;
  heroImage: string;
  gallery: string[];
  fallbackUrls?: string[];
  places?: PlaceItem[];
}

export interface NavLink {
  label: string;
  href: string;
  badge?: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface TripItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  city: string;
  country: string;
  duration: string; // e.g. "4 Days / 3 Nights"
  groupSize: string; // e.g. "6-12 Explorers"
  price: number; // e.g. 420
  originalPrice?: number;
  featuredImage: string;
  gallery: string[];
  fallbackUrls?: string[];
  category: string; // e.g. "Architecture & Underground", "Night Markets"
  rating: number;
  reviewCount: number;
  difficulty: 'Relaxed' | 'Moderate' | 'Active';
  vibe: string;
  highlights: string[];
  included: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    location: string;
    timeSlot: string;
  }[];
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  city: string;
  avatar: string;
  quote: string;
  tripTaken: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  category: string;
  destinationSlug?: string;
  articleType?: 'guide' | 'vlog' | 'photo_story' | 'culinary' | 'trek_journal' | 'cultural';
}

export interface PhotoItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  caption?: string;
  author?: string;
  license?: string;
  source: 'google' | 'wikimedia' | 'unsplash' | 'curated';
  originalUrl?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: 'guide' | 'vlog' | 'drone' | 'food';
  duration?: string;
  channelTitle?: string;
  publishedAt?: string;
}

export interface UserReview {
  id: string;
  destinationSlug: string;
  authorName: string;
  authorLocation?: string;
  authorAvatar?: string;
  rating: number;
  text: string;
  date: string;
  photoUrl?: string;
  helpfulCount: number;
  verified?: boolean;
}

export interface HistoryMilestone {
  year: string;
  era: string;
  title: string;
  description: string;
  impactNote?: string;
}

export interface CultureItem {
  type: 'food' | 'clothing' | 'festivals' | 'languages' | 'etiquette' | 'crafts' | 'music';
  title: string;
  subtitle?: string;
  description: string;
  highlights?: string[];
  image?: string;
}

export interface ItineraryNode {
  day: number;
  title: string;
  time: string;
  summary: string;
  details: string;
  location: string;
  coordinateLabel: string;
  image: string;
  fallbackUrls?: string[];
}

export interface ContentPack {
  brandName: string;
  brandKicker: string;
  tagline: string;
  metaDescription: string;
  hero: {
    type: 'video-scrub' | 'scroll-expansion';
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: { text: string; href: string };
    secondaryCta: { text: string; href: string };
    videoUrl: string;
    posterUrl: string;
    stats: { label: string; value: string }[];
  };
  manifesto: {
    lead: string;
    words: string[];
    author: string;
    authorRole: string;
  };
  navLinks: NavLink[];
  items: TripItem[];
  pricingPlans: PricingPlan[];
  faq: FAQItem[];
  testimonials: TestimonialItem[];
  orbitalItinerary: ItineraryNode[];
  blogPosts: BlogPost[];
  socials: SocialLink[];
  seoKeywords: string[];
  destinations?: PakistanDestination[];
}
