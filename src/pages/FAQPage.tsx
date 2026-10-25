import React, { useState, useId, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown, HelpCircle, Search, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const FAQPage: React.FC = () => {
  const { currentContent } = useTheme();
  const faqItems = currentContent.faq;

  const [openIds, setOpenIds] = useState<string[]>(['faq-0']);
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');

  // Dynamic SEO title
  useEffect(() => {
    document.title = `Frequently Asked Questions | ${currentContent.brandName}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        `Find answers about group sizes, vetting, cancellation guarantees, and our proprietary scouting protocol at ${currentContent.brandName}.`
      );
    }
  }, [currentContent]);

  // Assign topics to questions if missing
  const categorizedFaqs = faqItems.map((item, idx) => {
    let topic = (item as any).topic || (item as any).category;
    if (!topic) {
      if (idx === 0 || item.question.toLowerCase().includes('group') || item.question.toLowerCase().includes('who')) {
        topic = 'Cohorts & Philosophy';
      } else if (item.question.toLowerCase().includes('cancel') || item.question.toLowerCase().includes('refund') || item.question.toLowerCase().includes('cost')) {
        topic = 'Bookings & Cancellations';
      } else if (item.question.toLowerCase().includes('solo') || item.question.toLowerCase().includes('room')) {
        topic = 'Accommodations & Solo';
      } else {
        topic = 'Scout Protocol & Access';
      }
    }
    return {
      ...item,
      id: `faq-${idx}`,
      topic,
    };
  });

  const topics = ['All', ...Array.from(new Set(categorizedFaqs.map((f) => f.topic)))];

  const filteredFaq = categorizedFaqs.filter((item) => {
    const matchesTopic = selectedTopic === 'All' || item.topic === selectedTopic;
    const matchesSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase()) ||
      item.topic.toLowerCase().includes(search.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  // Group by topic for display
  const groupedFaqs = topics.filter((t) => t !== 'All').map((topic) => ({
    topic,
    items: filteredFaq.filter((f) => f.topic === topic),
  })).filter((group) => group.items.length > 0);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="pt-28 pb-24 px-6 sm:px-8 max-w-4xl mx-auto min-h-screen text-white">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'FAQ & Knowledge Base' },
          ]}
        />
      </div>

      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Knowledge Base · Field Protocol
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-light text-white mt-2 mb-4">
          Frequently Answered
        </h1>
        <p className="text-sm text-neutral-400">
          Clear answers about group sizes, vetting, cancellation guarantees, and our proprietary scouting protocol.
        </p>

        {/* Search input */}
        <div className="relative mt-6 max-w-md mx-auto">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by keyword..."
            aria-label="Search questions"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Topic filter buttons */}
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTopic === t
                  ? 'bg-amber-400 text-neutral-950 font-semibold'
                  : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Groups */}
      {groupedFaqs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/5 border border-white/10">
          <HelpCircle className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-50" />
          <h3 className="text-base font-serif text-white mb-1">No matching questions found</h3>
          <p className="text-xs text-neutral-400 mb-4">
            Try adjusting your search terms or view all topics.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedTopic('All');
            }}
            className="px-4 py-1.5 bg-amber-400 text-neutral-950 rounded-lg text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedFaqs.map((group) => (
            <div key={group.topic} className="space-y-3">
              <h2 className="text-sm font-mono uppercase text-amber-400/90 tracking-wider px-1">
                {group.topic}
              </h2>

              <div className="space-y-3">
                {group.items.map((item) => {
                  const isOpen = openIds.includes(item.id);
                  const buttonId = `button-${item.id}`;
                  const regionId = `region-${item.id}`;

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-white/10 bg-[#12161f] overflow-hidden transition-all duration-200 hover:border-white/20"
                    >
                      <button
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={regionId}
                        onClick={() => toggleAccordion(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleAccordion(item.id);
                          }
                        }}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                      >
                        <span className="text-sm sm:text-base font-serif text-white font-normal">
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div
                          id={regionId}
                          role="region"
                          aria-labelledby={buttonId}
                          className="px-5 pb-5 text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200"
                        >
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Still need help CTA Section */}
      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-[#131722] to-[#0e1117] border border-amber-400/20 text-center max-w-xl mx-auto shadow-2xl">
        <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-serif text-white mb-2">Still Need Help?</h3>
        <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto mb-6">
          Have an unlisted query about route timing, dietary adaptations, or custom group bookings? Our lead curator desk responds within 24 hours.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-full text-xs shadow-lg transition-transform hover:scale-105"
        >
          <span>Ask a Curator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
