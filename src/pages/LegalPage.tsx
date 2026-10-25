import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Shield, FileText, CheckCircle2, Lock, Scale, Mail } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const { currentContent } = useTheme();

  // Determine active tab from route: '/privacy' -> 'privacy', '/terms' -> 'terms'
  const isPrivacyRoute = location.pathname.includes('privacy');
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(
    isPrivacyRoute ? 'privacy' : 'terms'
  );

  useEffect(() => {
    setActiveTab(location.pathname.includes('privacy') ? 'privacy' : 'terms');
  }, [location.pathname]);

  // Dynamic SEO title
  useEffect(() => {
    const titleText = activeTab === 'privacy' ? 'Privacy Policy & Data Sovereignty' : 'Terms of Service & Cohort Conduct';
    document.title = `${titleText} | ${currentContent.brandName}`;
  }, [activeTab, currentContent]);

  return (
    <div className="pt-28 pb-24 px-6 sm:px-8 max-w-4xl mx-auto min-h-screen text-white font-sans text-xs sm:text-sm leading-relaxed text-neutral-300">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Governance & Ethics · Wayfarer Discovery Studio
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-light text-white mt-2 mb-3">
          {activeTab === 'privacy' ? 'Privacy & Data Commitments' : 'Terms of Service & Cohort Rules'}
        </h1>
        <p className="text-neutral-400">
          Effective date: October 2026 · Governing all Wayfarer Studio expeditions, digital tools, and memberships.
        </p>

        {/* Tab switchers */}
        <div className="flex items-center gap-3 mt-6 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'privacy'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'terms'
                ? 'bg-amber-400 text-neutral-950 font-bold'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>
        </div>
      </div>

      {activeTab === 'privacy' ? (
        /* PRIVACY POLICY CONTENT */
        <div className="space-y-8 animate-in fade-in duration-300">
          <section className="space-y-4 p-8 rounded-2xl bg-[#11141c] border border-white/10">
            <h2 className="text-xl font-serif text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>1. Zero-Tracking & Data Minimization Pledge</span>
            </h2>
            <p>
              Wayfarer Discovery Studio was built on radical respect for personal privacy. We do not use third-party behavioral trackers, advertising pixels, invasive fingerprinting, or data broker networks.
            </p>
            <p>
              When you browse our dossiers or plan trips, your journey is your own. We collect only what is strictly required to deliver your itinerary, confirm cohort capacity, and coordinate emergency contact in the field.
            </p>
          </section>

          <section className="space-y-4 p-8 rounded-2xl bg-[#11141c] border border-white/10">
            <h2 className="text-xl font-serif text-white">2. What Information We Process</h2>
            <ul className="space-y-2.5 list-disc list-inside text-neutral-300">
              <li>
                <strong className="text-white">Reservation & Enquiry Data:</strong> Full name, email address, guest headcount, and optional dietary/mobility preferences provided during booking.
              </li>
              <li>
                <strong className="text-white">AI Trip Architect Generations:</strong> City preferences and themes submitted to generate itineraries. Generated plans are ephemeral and stored only within your local session unless you choose to bookmark them.
              </li>
              <li>
                <strong className="text-white">Local Device Storage:</strong> Saved trip favorites, custom text overrides (via Edit Mode), and theme preferences are stored strictly in your browser’s <code className="text-amber-300 font-mono">localStorage</code>. They never touch external servers.
              </li>
            </ul>
          </section>

          <section className="space-y-4 p-8 rounded-2xl bg-[#11141c] border border-white/10">
            <h2 className="text-xl font-serif text-white">3. Third-Party Transmission & Storage</h2>
            <p>
              Transactional notifications and reservation briefings are transmitted through encrypted enterprise SMTP or HTTPS endpoints. We never sell, rent, or trade your contact details with external commercial tours or advertisers.
            </p>
          </section>

          <section className="space-y-4 p-8 rounded-2xl bg-[#11141c] border border-white/10">
            <h2 className="text-xl font-serif text-white">4. Your Sovereignty & Rights</h2>
            <p>
              Under GDPR and international privacy statutes, you hold the unconditional right to request a complete export of your reservation records or demand their permanent erasure. Contact <a href="mailto:privacy@wayfarer.studio" className="text-amber-400 hover:underline">privacy@wayfarer.studio</a> to execute any data request.
            </p>
          </section>
        </div>
      ) : (
        /* TERMS OF SERVICE CONTENT */
        <div className="space-y-8 animate-in fade-in duration-300">
          <section className="space-y-4 p-8 rounded-2xl bg-[#11141c] border border-white/10">
            <h2 className="text-xl font-serif text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>1. Cohort Reservations, Deposits & Cancellations</span>
            </h2>
            <p>
              To maintain the integrity of our small cohorts (strictly 6 to 10 explorers per expedition), spots are secured via an initial refundable deposit of $200 per person.
            </p>
            <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200 space-y-1">
              <span className="font-mono font-bold block uppercase text-amber-400">
                100% Refund Guarantee:
              </span>
              <p>
                If you cancel at least 30 calendar days before the scheduled departure date, 100% of your deposit is refunded immediately to your original payment method, or you may transfer 100% of the funds to any future departure with zero fees.
              </p>
            </div>
            <p>
              For cancellations within 14–29 days of departure, deposits may be transferred as credit to another cohort within 12 months.
            </p>
          </section>

          <section className="space-y-4 p-8 rounded-2xl bg-[#11141c] border border-white/10">
            <h2 className="text-xl font-serif text-white">2. Ethical Scouting & Community Etiquette</h2>
            <p>
              Wayfarer explorers agree to enter local host spaces with deference and mindfulness:
            </p>
            <ul className="space-y-2 list-disc list-inside text-neutral-300">
              <li>
                <strong className="text-white">Acoustic Respect:</strong> No loud phone calls or disruption in designated listening rooms, traditional kissaten, or sacred architectural sites.
              </li>
              <li>
                <strong className="text-white">Photography Etiquette:</strong> Flash photography is strictly forbidden. Always ask before photographing private artisans or neighborhood residents.
              </li>
              <li>
                <strong className="text-white">Cohort Safety:</strong> Harassment, discriminatory language, or reckless endangerment of fellow travelers will result in immediate termination of expedition participation without refund.
              </li>
            </ul>
          </section>

          <section className="space-y-4 p-8 rounded-2xl bg-[#11141c] border border-white/10">
            <h2 className="text-xl font-serif text-white">3. Intellectual Property of Field Dossiers</h2>
            <p>
              Wayfarer maps, coordinate logs, and proprietary walking itineraries are crafted for personal use by registered cohort members. Commercial resale or unauthorized syndication of our field dossiers to commercial tour operators is strictly prohibited.
            </p>
          </section>

          <section className="space-y-4 p-8 rounded-2xl bg-[#11141c] border border-white/10">
            <h2 className="text-xl font-serif text-white">4. Health, Fitness & Physical Expectations</h2>
            <p>
              Participants are expected to comfortably walk between 5 and 10 kilometers daily over uneven historic cobblestones, staircases, and pedestrian pathways. For specialized expeditions (e.g. Wayfarer Kinetic alpine camps), specific elevation and aerobic baselines apply as detailed in the trip dossier.
            </p>
          </section>
        </div>
      )}

      {/* Contact Inquiry Link */}
      <div className="pt-10 border-t border-white/10 text-center text-xs text-neutral-400">
        Have specific legal or institutional questions? Reach our compliance desk directly at{' '}
        <Link to="/contact" className="text-amber-400 hover:underline">
          contact our curators
        </Link>.
      </div>
    </div>
  );
};
