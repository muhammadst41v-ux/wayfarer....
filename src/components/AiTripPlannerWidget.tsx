import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, X, Send, Bot, User, Copy, Check, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  tripLinks?: { title: string; slug: string; city: string }[];
}

const CHAT_STORAGE_KEY = 'wayfarer_ai_chat_history_v1';

export const AiTripPlannerWidget: React.FC = () => {
  const { currentContent, activeCategory } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getInitialGreeting = useCallback((): string => {
    if (activeCategory === 'pakistan') {
      return `Salam & Welcome. I am your Wayfarer Pakistan Expedition Scout. Which valleys or historical cities are you drawn to (e.g. Hunza, Skardu, Fairy Meadows, Lahore, Swat), how many days do you have, and what is your travel style?`;
    } else if (activeCategory === 'travel') {
      return `Greetings. I am the Wayfarer Studio Architect. Tell me: Which city are you contemplating (e.g. Berlin, Kyoto, Lisbon, Oaxaca), how many days do you have, what is your budget, and what spaces move you?`;
    } else if (activeCategory === 'fitness') {
      return `Kinetic Architect online. Which terrain do you wish to train on (e.g. Chamonix alpine trails, Tokyo sprint track, Sagres surf dunes), what is your timeline and physical focus?`;
    } else {
      return `Palate Scout online. Which gastronomic terroir are you craving (e.g. San Sebastián cider taverns, Bangkok night woks, Oaxaca smoke valleys), and what is your timeline and budget?`;
    }
  }, [activeCategory]);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'msg-0',
        sender: 'ai',
        text: 'Greetings. I am the Wayfarer Studio Architect. Tell me: Which city are you drawn to, how many days do you have, and what kind of spaces move you?',
        timestamp: 'Just now',
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Save messages to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Clear chat history handler
  const handleClearChat = () => {
    const greeting: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: getInitialGreeting(),
      timestamp: 'Just now',
    };
    setMessages([greeting]);
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify([greeting]));
    } catch {
      // ignore
    }
  };

  // Rule-based local intelligent planner fallback reading budget, days, interests, and city
  const generateLocalPlan = (prompt: string): { text: string; tripLinks: { title: string; slug: string; city: string }[] } => {
    const p = prompt.toLowerCase();

    // 1. Parse city
    const availableTrips = currentContent.items;
    let matchedTrip = availableTrips.find((t) =>
      p.includes(t.city.toLowerCase()) || p.includes(t.title.toLowerCase())
    );

    if (!matchedTrip) {
      if (p.includes('berlin') || p.includes('germany')) matchedTrip = availableTrips[0];
      else if (p.includes('kyoto') || p.includes('japan') || p.includes('tokyo')) matchedTrip = availableTrips[1] || availableTrips[0];
      else if (p.includes('lisbon') || p.includes('portugal') || p.includes('sagres')) matchedTrip = availableTrips[2] || availableTrips[0];
      else matchedTrip = availableTrips[0];
    }

    const city = matchedTrip.city;

    // 2. Parse days (default 3)
    let days = 3;
    const daysMatch = p.match(/(\d+)\s*(day|days|night|nights)/);
    if (daysMatch) {
      days = Math.min(7, Math.max(1, parseInt(daysMatch[1])));
    } else if (p.includes('weekend') || p.includes('two')) {
      days = 2;
    } else if (p.includes('week') || p.includes('seven')) {
      days = 5;
    }

    // 3. Parse budget
    let budgetLabel = 'Moderate / Student Studio Budget (€250–€400)';
    if (p.includes('cheap') || p.includes('low') || p.includes('student') || p.includes('under') || p.includes('100') || p.includes('200')) {
      budgetLabel = 'Under €250 (Curated Accessible & Street-Grade)';
    } else if (p.includes('luxury') || p.includes('premium') || p.includes('high') || p.includes('fellowship')) {
      budgetLabel = 'Patron Tier (€600+) with Private Atelier Access';
    }

    // 4. Parse interests
    const interests: string[] = [];
    if (p.includes('arch') || p.includes('concrete') || p.includes('brutal')) interests.push('Brutalist Architecture & Spatial Memory');
    if (p.includes('sound') || p.includes('music') || p.includes('jazz') || p.includes('vinyl') || p.includes('techno')) interests.push('Subterranean Acoustic Sanctuaries');
    if (p.includes('coffee') || p.includes('cafe') || p.includes('kissaten')) interests.push('Historic Nel Drip & Dark Roasts');
    if (p.includes('wine') || p.includes('drink') || p.includes('ferment') || p.includes('food')) interests.push('Low-Intervention Natural Fermentation');
    if (p.includes('trail') || p.includes('run') || p.includes('hike') || p.includes('cold') || p.includes('fitness')) interests.push('High-Elevation Kinetic Conditioning');
    if (interests.length === 0) interests.push('Neighborhood Immersion & Unlisted Courtyards');

    const tripLinks = [
      { title: matchedTrip.title, slug: matchedTrip.slug, city: matchedTrip.city },
      ...availableTrips
        .filter((t) => t.id !== matchedTrip!.id)
        .slice(0, 1)
        .map((t) => ({ title: t.title, slug: t.slug, city: t.city })),
    ];

    const itineraryDays = Array.from({ length: days }, (_, i) => {
      const dayNum = i + 1;
      if (dayNum === 1) {
        return `#### Day 1: Threshold & Spatial Orientation
* **09:30** — Slow Nel-drip or single-origin cupping at an unlisted courtyard atelier.
* **11:00** — Walking observation of ${matchedTrip.highlights[0] || 'historic concrete structures'}.
* **15:30** — Exploration of residential side alleys within an 800m radius of base camp.
* **20:30** — Intimate supper at a neighborhood family kitchen; natural wine or local tea pairing.`;
      } else if (dayNum === 2) {
        return `#### Day 2: Deep Archives & Subterranean Culture
* **08:30** — Dawn architectural light capture before commercial traffic begins.
* **11:00** — Curated entry into private artisan workshops (${matchedTrip.highlights[1] || 'ceramic or vinyl archives'}).
* **16:00** — Acoustic testing in decommissioned vaults or quiet garden courtyards.
* **21:30** — Listening room session on vacuum tube amplifiers.`;
      } else if (dayNum === 3) {
        return `#### Day 3: Water, Atmosphere & The Living Craft
* **10:00** — Morning geothermal water immersion or riverbank architectural walk.
* **13:30** — Communal market tasting or fermentation cellar inspection.
* **17:00** — Field journal entry synthesis & 35mm film stamp issuance.`;
      } else {
        return `#### Day ${dayNum}: Independent Field Commission
* **09:00** — Scout-prescribed wandering route with unlisted geocoordinate clues.
* **14:00** — Open afternoon with resident historians and fellow cohort explorers.
* **19:00** — Farewell table feast and issuance of alumni key.`;
      }
    }).join('\n\n');

    const text = `### Wayfarer Protocol: ${city} (${days} Days)

**Target Budget**: ${budgetLabel}
**Primary Focus**: ${interests.join(' · ')}
**Scout Advice**: Avoid major tourist avenues between 11:00 and 15:00. Enter venues through unmarked courtyard passageways.

---

${itineraryDays}

---
*Recommended matching expedition from our catalog below:*`;

    return { text, tripLinks };
  };

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input;
    if (!textToSend.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    const aiMsgId = `ai-${Date.now()}`;
    const placeholderAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: 'Consulting 2,400+ scout coordinates and field archives...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, placeholderAiMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          category: activeCategory,
        }),
      });

      if (!response.ok) {
        throw new Error('API unavailable');
      }

      const data = await response.json();
      const reply = data.text || generateLocalPlan(textToSend).text;
      const links = generateLocalPlan(textToSend).tripLinks;

      // Simulate streaming reveal
      let revealed = '';
      const step = Math.max(2, Math.floor(reply.length / 30));
      let currentIdx = 0;

      const interval = setInterval(() => {
        currentIdx += step;
        revealed = reply.slice(0, currentIdx);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId ? { ...m, text: revealed, tripLinks: currentIdx >= reply.length ? links : undefined } : m
          )
        );

        if (currentIdx >= reply.length) {
          clearInterval(interval);
          setIsStreaming(false);
        }
      }, 25);
    } catch {
      // Local intelligent planner fallback
      const { text: localReply, tripLinks } = generateLocalPlan(textToSend);
      let revealed = '';
      const step = Math.max(2, Math.floor(localReply.length / 25));
      let currentIdx = 0;

      const interval = setInterval(() => {
        currentIdx += step;
        revealed = localReply.slice(0, currentIdx);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId ? { ...m, text: revealed, tripLinks: currentIdx >= localReply.length ? tripLinks : undefined } : m
          )
        );

        if (currentIdx >= localReply.length) {
          clearInterval(interval);
          setIsStreaming(false);
        }
      }, 25);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div id="ai-planner" className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 bg-[#11141b]/95 hover:bg-neutral-900 border border-amber-500/40 hover:border-amber-400 rounded-full shadow-[0_8px_30px_rgba(245,158,11,0.25)] text-white text-xs font-medium transition-all duration-300 hover:scale-105 cursor-pointer"
            aria-label="Open AI Trip Planner"
          >
            <div className="relative">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <span className="font-sans font-medium tracking-wide">AI Trip Architect</span>
          </button>
        )}
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[440px] h-[600px] max-h-[85vh] bg-[#0e1117] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header with Title and Clear Chat */}
          <div className="px-4 py-3 bg-[#12161f] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">Wayfarer AI Architect</h3>
                <span className="text-[10px] text-amber-300/80 font-mono">Grounded in 2,400+ scout coordinates</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear chat history"
                className="p-1.5 text-neutral-400 hover:text-amber-300 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Clear chat history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Starters */}
          <div className="p-2.5 bg-[#0a0c10] border-b border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <Link
              to="/planner"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-full border border-amber-500/30 shrink-0 whitespace-nowrap transition-colors flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3 h-3" />
              <span>Full Route Planner ↗</span>
            </Link>

            {activeCategory === 'pakistan' ? (
              <>
                <button
                  onClick={() => handleSend('Plan a 7-day Karakoram Highway road trip from Islamabad to Khunjerab')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-full border border-white/10 shrink-0 whitespace-nowrap transition-colors"
                >
                  Hunza 7-Day KKH
                </button>
                <button
                  onClick={() => handleSend('Skardu cold desert dunes, Shangrila, and Deosai plains 5-day route')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-full border border-white/10 shrink-0 whitespace-nowrap transition-colors"
                >
                  Skardu & Deosai 5-Day
                </button>
                <button
                  onClick={() => handleSend('Walled City of Lahore Mughal architecture and midnight street food walking tour')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-full border border-white/10 shrink-0 whitespace-nowrap transition-colors"
                >
                  Lahore Heritage & Food
                </button>
                <button
                  onClick={() => handleSend('What permits, gear, and mountain safety steps do I need for Fairy Meadows and Nanga Parbat?')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-full border border-white/10 shrink-0 whitespace-nowrap transition-colors"
                >
                  Fairy Meadows Safety
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSend('3 days of brutalist architecture in Berlin under €300')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-full border border-white/10 shrink-0 whitespace-nowrap transition-colors"
                >
                  Berlin €300 3-Days
                </button>
                <button
                  onClick={() => handleSend('Solo explorer jazz kissaten and shadows in Kyoto')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-full border border-white/10 shrink-0 whitespace-nowrap transition-colors"
                >
                  Kyoto Kissaten & Shadows
                </button>
                <button
                  onClick={() => handleSend('Lisbon azulejo tile workshops and natural wine cellars')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-full border border-white/10 shrink-0 whitespace-nowrap transition-colors"
                >
                  Lisbon Tile & Cellars
                </button>
                <button
                  onClick={() => handleSend('Alpine altitude conditioning and cold immersion in Chamonix')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-full border border-white/10 shrink-0 whitespace-nowrap transition-colors"
                >
                  Chamonix Altitude Camp
                </button>
              </>
            )}
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] p-3.5 rounded-xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-400 text-neutral-950 font-medium rounded-tr-none'
                      : 'bg-[#151922] text-neutral-200 border border-white/10 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}

                  {/* Matching Trip Links */}
                  {msg.tripLinks && msg.tripLinks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-amber-400 block tracking-wider">
                        Matched Expeditions:
                      </span>
                      {msg.tripLinks.map((trip) => (
                        <Link
                          key={trip.slug}
                          to={`/trips/${trip.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
                        >
                          <div className="truncate mr-2">
                            <span className="text-[11px] font-medium text-white group-hover:text-amber-300 block truncate">
                              {trip.title}
                            </span>
                            <span className="text-[9px] font-mono text-neutral-400">{trip.city}</span>
                          </div>
                          <ArrowRight className="w-3 h-3 text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {msg.sender === 'ai' && msg.id !== 'msg-0' && (
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      title="Copy itinerary markdown"
                      className="mt-2.5 flex items-center gap-1 text-[10px] text-neutral-400 hover:text-amber-300 pt-1.5 border-t border-white/10 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied to clipboard
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy itinerary markdown
                        </>
                      )}
                    </button>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-neutral-300" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#11141b] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for customized secret city itineraries..."
              disabled={isStreaming}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="p-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl transition-colors disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
