import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Search, Compass, BookOpen, MapPin, DollarSign, HelpCircle, ArrowRight, X, Clock, Trash2 } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Pages' | 'Destinations' | 'Expeditions' | 'Articles' | 'FAQ' | 'Recent';
  href: string;
  icon: any;
}

const RECENT_SEARCHES_KEY = 'wayfarer_recent_searches_v1';

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { currentContent } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : ['Hunza Valley', 'Skardu K2', 'Lahore Fort', 'Deosai'];
    } catch {
      return ['Hunza Valley', 'Skardu K2', 'Lahore Fort', 'Deosai'];
    }
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Build full catalog of searchable items
  const allItems: SearchItem[] = useMemo(() => {
    return [
      // Pages
      { id: 'page-destinations', title: 'Pakistan Destinations Directory', subtitle: 'Browse all 20+ regions across Karakorams & Silk Road', category: 'Pages', href: '/destinations', icon: Compass },
      { id: 'page-map', title: 'National Interactive Map', subtitle: 'Interactive layers: hotels, food, attractions, hospitals, ATMs', category: 'Pages', href: '/map', icon: MapPin },
      { id: 'page-planner', title: 'Custom Expedition Route Planner', subtitle: 'Day-by-day scheduler, cost estimator in USD/PKR, and field dossier', category: 'Pages', href: '/planner', icon: Compass },
      { id: 'page-trips', title: 'Curated Expeditions Catalog', subtitle: 'Browse all upcoming small-cohort journeys', category: 'Pages', href: '/trips', icon: Compass },
      { id: 'page-pricing', title: 'Memberships & Fellowship Passes', subtitle: 'Annual dues, monthly plans, and group commissions', category: 'Pages', href: '/pricing', icon: DollarSign },
      { id: 'page-about', title: 'Studio Philosophy & Scouting Crew', subtitle: 'Our story, values, team bios, and manifesto', category: 'Pages', href: '/about', icon: Compass },
      { id: 'page-blog', title: 'Field Journal & Spatial Essays', subtitle: 'Dispatches on acoustic geography and living crafts', category: 'Pages', href: '/blog', icon: BookOpen },
      { id: 'page-faq', title: 'FAQ & Scout Knowledge Base', subtitle: 'Group sizes, vetting, cancellation guarantees', category: 'Pages', href: '/faq', icon: HelpCircle },
      { id: 'page-contact', title: 'Contact Studio Curators', subtitle: 'Direct line to Berlin HQ and regional scout desks', category: 'Pages', href: '/contact', icon: MapPin },
      { id: 'page-toolkit', title: 'Tourist Toolkit (Visa, SIM, Helplines)', subtitle: 'e-Visa portal, emergency 1122, SCOM SIM guide, currency converter, and Urdu phrasebook', category: 'Pages', href: '/toolkit', icon: HelpCircle },
      { id: 'page-culture', title: 'Culture, Society & Living Traditions', subtitle: 'Regional ethnography, etiquette, traditional clothing, and music', category: 'Pages', href: '/culture', icon: BookOpen },
      { id: 'page-mytrips', title: 'My Saved Expeditions & Bookmarks', subtitle: 'Protected explorer archive and saved itineraries', category: 'Pages', href: '/my-trips', icon: Compass },
      { id: 'page-account', title: 'Explorer Account & Credentials', subtitle: 'Edit heraldry colors, view past reservations', category: 'Pages', href: '/account', icon: Compass },

      // Destinations
      ...(currentContent.destinations || []).map((dest) => ({
        id: `dest-${dest.id}`,
        title: dest.name,
        subtitle: `${dest.region} · ${dest.altitude} · ${dest.shortDescription.slice(0, 65)}...`,
        category: 'Destinations' as const,
        href: `/destinations/${dest.slug}`,
        icon: MapPin,
      })),

      // Trips
      ...currentContent.items.map((trip) => ({
        id: `trip-${trip.id}`,
        title: trip.title,
        subtitle: `${trip.city}, ${trip.country} · ${trip.duration} · $${trip.price}`,
        category: 'Expeditions' as const,
        href: `/trips/${trip.slug}`,
        icon: MapPin,
      })),

      // Blog Articles
      ...currentContent.blogPosts.map((post) => ({
        id: `post-${post.id}`,
        title: post.title,
        subtitle: `${post.category} · ${post.readTime}`,
        category: 'Articles' as const,
        href: `/blog/${post.slug}`,
        icon: BookOpen,
      })),

      // FAQ Questions
      ...currentContent.faq.map((item, idx) => ({
        id: `faq-${idx}`,
        title: item.question,
        subtitle: item.answer.slice(0, 75) + '...',
        category: 'FAQ' as const,
        href: '/faq',
        icon: HelpCircle,
      })),
    ];
  }, [currentContent]);

  // Filter items matching query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return allItems.filter((item) => item.category === 'Pages').slice(0, 5);
    }
    const q = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  // Group items by category
  const groupedResults = useMemo(() => {
    const map = new Map<string, SearchItem[]>();
    filteredItems.forEach((item) => {
      if (!map.has(item.category)) {
        map.set(item.category, []);
      }
      map.get(item.category)!.push(item);
    });
    return Array.from(map.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  }, [filteredItems]);

  // Flattened for arrow keyboard navigation
  const flatSelectable = useMemo(() => {
    return filteredItems;
  }, [filteredItems]);

  const handleSelect = (item: SearchItem) => {
    // Save to recent searches
    if (query.trim()) {
      setRecentSearches((prev) => {
        const updated = [query.trim(), ...prev.filter((q) => q.toLowerCase() !== query.trim().toLowerCase())].slice(0, 5);
        try {
          localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }
    onClose();
    navigate(item.href);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  const handleClearRecents = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatSelectable.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatSelectable.length) % Math.max(1, flatSelectable.length));
    } else if (e.key === 'Enter' && flatSelectable[selectedIndex]) {
      e.preventDefault();
      handleSelect(flatSelectable[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-2xl bg-[#11141b] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 shrink-0">
          <Search className="w-4 h-4 text-amber-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search expeditions, cities, essays, topics, or FAQs..."
            className="w-full bg-transparent text-white placeholder-neutral-500 text-sm outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Searches Pills when query is empty */}
        {!query.trim() && recentSearches.length > 0 && (
          <div className="p-3 bg-white/5 border-b border-white/5 flex items-center justify-between text-xs text-neutral-400 shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="font-mono text-[10px] text-neutral-500 uppercase shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Recent:
              </span>
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentClick(term)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] shrink-0 border border-white/5 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
            <button
              onClick={handleClearRecents}
              title="Clear recent searches"
              className="text-[10px] font-mono text-neutral-500 hover:text-rose-400 shrink-0 ml-2"
            >
              Clear
            </button>
          </div>
        )}

        {/* Grouped Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {flatSelectable.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              <Compass className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p>No matching destinations, articles, or knowledge base entries found.</p>
              <p className="text-neutral-500 text-[11px] mt-1">Try querying a city name (Berlin, Kyoto, Lisbon), or topic (brutalism, wine, kissaten).</p>
            </div>
          ) : (
            groupedResults.map((group) => (
              <div key={group.category} className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 px-2 py-1">
                  {group.category}
                </div>
                {group.items.map((item) => {
                  const globalIdx = flatSelectable.findIndex((fi) => fi.id === item.id);
                  const isSelected = globalIdx === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-xs ${
                        isSelected
                          ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                          : 'text-neutral-300 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate mr-3">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <div className="truncate">
                          <h4 className="font-medium text-white truncate text-xs">{item.title}</h4>
                          {item.subtitle && (
                            <p className="text-[10px] text-neutral-400 truncate mt-0.5">{item.subtitle}</p>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-[#0c0e13] flex items-center justify-between text-[11px] font-mono text-neutral-500 shrink-0">
          <div className="flex items-center gap-3">
            <span>↑ ↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <span>{flatSelectable.length} results</span>
        </div>
      </div>
    </div>
  );
};
