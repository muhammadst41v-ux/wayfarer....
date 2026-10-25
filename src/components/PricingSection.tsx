import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTrips } from '../context/TripContext';
import { EditableText } from './EditableText';
import { LiquidButton } from './LiquidButton';
import { Check, X, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { PricingPlan } from '../types';

export const PricingSection: React.FC = () => {
  const { currentContent } = useTheme();
  const { showToast } = useTrips();
  const plans = currentContent.pricingPlans;
  const [isAnnual, setIsAnnual] = useState(true);

  // Modal state
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenPlanModal = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsSuccess(false);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setName('');
    setEmail('');
    setNotes('');
    setIsSuccess(false);
  };

  const handleSubmitPlanEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      setIsSuccess(true);
      return;
    }

    if (!email || !email.includes('@')) {
      showToast('Please provide a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'membership_signup',
          planId: selectedPlan?.id,
          planName: selectedPlan?.name,
          billing: isAnnual ? 'annual' : 'monthly',
          price: isAnnual ? selectedPlan?.annualPrice : selectedPlan?.monthlyPrice,
          name,
          email,
          notes,
        }),
      });
    } catch {
      // client fallback simulation
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    showToast(`Welcome! Membership inquiry for ${selectedPlan?.name} dispatched.`);
  };

  return (
    <section
      id="pricing-section"
      className="relative py-28 px-6 sm:px-8 bg-[#0b0d10] text-white overflow-hidden border-t border-white/8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Memberships & Tiers
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-white mt-2 mb-4">
            Invest in Deeper Exploration
          </h2>
          <p className="text-sm text-neutral-400">
            Choose between pay-as-you-go curated expeditions or unlock the annual Fellowship for unlisted routes and AI planning.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-white/5 border border-white/10 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
                !isAnnual ? 'bg-amber-400 text-neutral-950 font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 ${
                isAnnual ? 'bg-amber-400 text-neutral-950 font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Annual Fellowship</span>
              <span className="text-[10px] font-mono py-0.5 px-1.5 bg-black/20 text-neutral-950 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between p-8 rounded-2xl transition-all duration-300 ${
                  isPopular
                    ? 'bg-[#141822] border-2 border-amber-400/80 shadow-[0_8px_32px_rgba(245,158,11,0.18)] scale-[1.02] z-10'
                    : 'bg-[#101319] border border-white/10 hover:border-white/20'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-neutral-950 text-[11px] font-mono font-bold tracking-wider uppercase rounded-full shadow">
                    Most Recommended
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-serif text-white mb-2">
                    <EditableText contentKey={`pricing.${idx}.name`} defaultText={plan.name} />
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-6 min-h-[36px]">
                    <EditableText contentKey={`pricing.${idx}.tagline`} defaultText={plan.tagline} />
                  </p>

                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-white/10">
                    <span className="text-4xl font-serif text-white tabular-nums">
                      ${price}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      {price === 0 ? 'zero dues' : isAnnual ? '/month, billed annually' : '/month'}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8 text-xs text-neutral-300">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <EditableText
                            contentKey={`pricing.${idx}.feature.${fIdx}`}
                            defaultText={feature}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <LiquidButton
                  onClick={() => handleOpenPlanModal(plan)}
                  variant={isPopular ? 'liquid' : 'outline'}
                  size="md"
                  className="w-full text-center"
                >
                  <EditableText contentKey={`pricing.${idx}.cta`} defaultText={plan.ctaText} />
                </LiquidButton>
              </div>
            );
          })}
        </div>
      </div>

      {/* Choose Plan Signup & Enquiry Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#11141c] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/10 flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 block mb-1">
                  Tier Enrollment
                </span>
                <h3 className="text-xl font-serif text-white">{selectedPlan.name}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  ${isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice}
                  {selectedPlan.monthlyPrice === 0 ? ' / free' : isAnnual ? '/mo (billed annually)' : '/month'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-amber-400/20 text-amber-400 border border-amber-400/40 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-serif text-white">Membership Request Logged</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Your inquiry for the <strong className="text-amber-300">{selectedPlan.name}</strong> tier has been registered. Our lead curator desk will activate your scout key via email within 24 hours.
                </p>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg text-xs transition-colors"
                >
                  Return to Studio
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitPlanEnquiry} className="p-6 space-y-4 text-xs font-sans">
                {/* Honeypot */}
                <input
                  type="text"
                  name="b_plan_honeypot"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Reid"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcus@domain.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Special notes or travel preferences (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. focused on architectural photography, traveling solo or with partner"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2 text-neutral-400 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>30-day money-back guarantee. No lock-in contracts.</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Confirm & Enquire</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
