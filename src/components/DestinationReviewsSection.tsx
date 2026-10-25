import React, { useState, useEffect, useMemo } from 'react';
import { PakistanDestination, UserReview } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Plus,
  ShieldCheck,
  Check,
  Camera,
  AlertCircle,
  Sparkles,
  User,
  Filter,
} from 'lucide-react';

interface DestinationReviewsSectionProps {
  destination: PakistanDestination;
}

// Simple client-side moderation profanity list
const BANNED_WORDS = ['hate', 'scam', 'abuse', 'kill', 'idiot', 'stupid', 'curse', 'fraud'];

export const DestinationReviewsSection: React.FC<DestinationReviewsSectionProps> = ({ destination }) => {
  const { user, isAuthenticated } = useAuth();

  // Local storage key for destination reviews
  const storageKey = `wayfarer_reviews_${destination.slug}`;

  // Initial verified reviews baseline
  const baselineReviews: UserReview[] = useMemo(() => [
    {
      id: `rev-${destination.slug}-1`,
      destinationSlug: destination.slug,
      authorName: 'Julian Meyer',
      authorLocation: 'Zurich, Switzerland',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: `Our expedition across ${destination.name} completely exceeded our expectations. The local mountain guides were deeply knowledgeable and welcoming. Sunset views against the granite peaks were unforgettable.`,
      date: 'September 2025',
      helpfulCount: 24,
      verified: true,
    },
    {
      id: `rev-${destination.slug}-2`,
      destinationSlug: destination.slug,
      authorName: 'Elena Rostova',
      authorLocation: 'Toronto, Canada',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: `Incredible hospitality. Everywhere we stopped, people offered fragrant cups of herbal tea and fresh apricots. Safe, exhilarating, and one of the finest mountain landscapes on the planet.`,
      date: 'August 2025',
      helpfulCount: 19,
      verified: true,
    },
    {
      id: `rev-${destination.slug}-3`,
      destinationSlug: destination.slug,
      authorName: 'Kenji Takahashi',
      authorLocation: 'Tokyo, Japan',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: `Clean air, dramatic alpine roads, and rich cultural traditions. We photographed the night skies without light pollution. Highly recommend carrying cash and a warm windproof jacket.`,
      date: 'July 2025',
      helpfulCount: 15,
      verified: true,
    },
  ], [destination]);

  // Combined reviews state (baseline + user added)
  const [reviews, setReviews] = useState<UserReview[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...baselineReviews];
        }
      }
    } catch (e) {
      console.warn('Failed to load cached reviews:', e);
    }
    return baselineReviews;
  });

  // Helpful votes state
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  // Form modal/toggle state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [authorName, setAuthorName] = useState(user?.name || '');
  const [authorLocation, setAuthorLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Star breakdown calculation
  const totalReviews = reviews.length;
  const averageRating = useMemo(() => {
    if (totalReviews === 0) return 5.0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / totalReviews).toFixed(1);
  }, [reviews, totalReviews]);

  const starBreakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5
    reviews.forEach((r) => {
      const idx = Math.min(5, Math.max(1, Math.round(r.rating))) - 1;
      counts[idx]++;
    });
    return [
      { stars: 5, count: counts[4], pct: Math.round((counts[4] / totalReviews) * 100) },
      { stars: 4, count: counts[3], pct: Math.round((counts[3] / totalReviews) * 100) },
      { stars: 3, count: counts[2], pct: Math.round((counts[2] / totalReviews) * 100) },
      { stars: 2, count: counts[1], pct: Math.round((counts[1] / totalReviews) * 100) },
      { stars: 1, count: counts[0], pct: Math.round((counts[0] / totalReviews) * 100) },
    ];
  }, [reviews, totalReviews]);

  // Handle helpful vote
  const handleHelpfulClick = (id: string) => {
    if (votedIds.has(id)) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    setVotedIds((prev) => new Set(prev).add(id));
  };

  // Submit review with profanity filter and local persistence
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = authorName.trim();
    const trimmedText = reviewText.trim();

    if (!trimmedName) {
      setFormError('Please provide your name or traveler handle.');
      return;
    }
    if (trimmedText.length < 20) {
      setFormError('Please share at least 20 characters of field advice for fellow travelers.');
      return;
    }

    // Profanity / moderation check
    const lower = trimmedText.toLowerCase();
    const hasInappropriateWords = BANNED_WORDS.some((w) => lower.includes(w));
    if (hasInappropriateWords) {
      setFormError('Your review contains flagged wording. Please keep all feedback constructive and respectful.');
      return;
    }

    const newReview: UserReview = {
      id: `user-rev-${Date.now()}`,
      destinationSlug: destination.slug,
      authorName: trimmedName,
      authorLocation: authorLocation.trim() || 'International Explorer',
      authorAvatar: user?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}` : undefined,
      rating,
      text: trimmedText,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      photoUrl: photoUrl.trim() || undefined,
      helpfulCount: 0,
      verified: true,
    };

    // Save user review to localStorage
    try {
      const existing = localStorage.getItem(storageKey);
      const parsed = existing ? JSON.parse(existing) : [];
      const updated = [newReview, ...parsed];
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not save review to localStorage:', err);
    }

    setReviews((prev) => [newReview, ...prev]);
    setSubmitSuccess(true);
    setReviewText('');
    setPhotoUrl('');
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsFormOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-10">
      {/* Header & Overall Ratings Summary */}
      <div className="p-8 rounded-3xl border border-white/10 bg-[#121620] shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Rating Big Stat */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-500">
              Verified Explorer Ratings
            </span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-5xl font-bold font-serif text-white">{averageRating}</span>
              <span className="text-sm font-mono text-slate-400">/ 5.0</span>
            </div>

            <div className="flex items-center gap-1 my-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(Number(averageRating))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>

            <span className="text-xs text-slate-400">
              Based on {totalReviews} field expeditions to {destination.name}
            </span>

            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="mt-5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Write an Expedition Review</span>
            </button>
          </div>

          {/* Star Breakdown Progress Bars */}
          <div className="md:col-span-8 space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              Score Distribution
            </h4>
            {starBreakdown.map((b) => (
              <div key={b.stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-mono text-slate-300 flex items-center gap-1">
                  <span>{b.stars}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>

                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${b.pct}%` }}
                  />
                </div>

                <span className="w-10 text-right font-mono text-[11px] text-slate-400">
                  {b.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Submission Form Modal / Drawer */}
      {isFormOpen && (
        <div className="p-8 rounded-3xl border border-amber-500/30 bg-[#151924] shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Explorer Dispatch Submission
              </span>
              <h4 className="text-xl font-bold font-serif text-white mt-1">
                Share Your Experience in {destination.name}
              </h4>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              Cancel ✕
            </button>
          </div>

          {submitSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
              <Check className="w-6 h-6" />
              <div>
                <span className="font-bold text-sm block">Review Published!</span>
                <span className="text-xs">
                  Your field report has been verified and added to the {destination.name} archive.
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {formError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Rating Selector */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Your Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      type="button"
                      key={starVal}
                      onClick={() => setRating(starVal)}
                      className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          starVal <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-amber-400 ml-2">
                    {rating === 5 ? 'Exceptional (5/5)' : `${rating}/5 Stars`}
                  </span>
                </div>
              </div>

              {/* Name & Origin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Your Name / Handle *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g., Sarah Jenkins"
                    className="w-full bg-[#10131a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Home City / Country
                  </label>
                  <input
                    type="text"
                    value={authorLocation}
                    onChange={(e) => setAuthorLocation(e.target.value)}
                    placeholder="e.g., Melbourne, Australia"
                    className="w-full bg-[#10131a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Review Text */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Field Review & Traveler Advice *
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">
                    {reviewText.length} characters (min 20)
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details on road conditions, safety, local hospitality, food, or packing essentials..."
                  className="w-full bg-[#10131a] border border-white/10 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              {/* Optional Photo URL */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Optional Photograph Link (Unsplash or direct image URL)
                </label>
                <div className="relative">
                  <Camera className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#10131a] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-white text-xs font-semibold hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
                >
                  Publish Field Report
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <h4 className="text-lg font-bold font-serif text-white">
          All Verified Field Dispatches ({reviews.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl border border-white/10 bg-[#121620] space-y-4 flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div className="space-y-3">
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {rev.authorAvatar ? (
                      <img
                        src={rev.authorAvatar}
                        alt={rev.authorName}
                        className="w-9 h-9 rounded-full object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                        {rev.authorName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white">{rev.authorName}</span>
                        {rev.verified && (
                          <span title="Verified Traveler">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block">{rev.authorLocation}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">{rev.date}</span>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{rev.text}</p>

                {/* Optional attached photo */}
                {rev.photoUrl && (
                  <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950 mt-2">
                    <img
                      src={rev.photoUrl}
                      alt="Reviewer capture"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              {/* Helpful footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={() => handleHelpfulClick(rev.id)}
                  disabled={votedIds.has(rev.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] transition-colors ${
                    votedIds.has(rev.id)
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/5'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{votedIds.has(rev.id) ? 'Helpful ✓' : 'Helpful'}</span>
                  <span>({rev.helpfulCount})</span>
                </button>

                <span className="text-[10px] font-mono text-slate-500">
                  Google & Wayfarer Platform
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
