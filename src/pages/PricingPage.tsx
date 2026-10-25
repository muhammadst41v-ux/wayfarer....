import React from 'react';
import { PricingSection } from '../components/PricingSection';
import { Check, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  return (
    <div className="pt-24 pb-24 text-white">
      <PricingSection />

      {/* Feature Comparison Matrix */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 mt-8">
        <h3 className="text-2xl font-serif text-white mb-6 text-center">Membership Feature Matrix</h3>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#101319]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 font-mono text-neutral-400">
                <th className="p-4">Privilege</th>
                <th className="p-4">Single Trip</th>
                <th className="p-4 text-amber-400">Fellowship ($39/mo)</th>
                <th className="p-4">Private Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              <tr>
                <td className="p-4 font-medium">Curated Expedition Booking</td>
                <td className="p-4"><Check className="w-4 h-4 text-emerald-400" /></td>
                <td className="p-4"><Check className="w-4 h-4 text-amber-400" /></td>
                <td className="p-4"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Expedition Member Discount</td>
                <td className="p-4 text-neutral-500">—</td>
                <td className="p-4 font-mono text-amber-400">15% off all trips</td>
                <td className="p-4 font-mono text-emerald-400">20% off all trips</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">AI Trip Planner Unlimited Generations</td>
                <td className="p-4 text-neutral-500">3 free plans</td>
                <td className="p-4"><Check className="w-4 h-4 text-amber-400" /></td>
                <td className="p-4"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Secret Pop-Up Dinners & Weekend Drops</td>
                <td className="p-4 text-neutral-500">—</td>
                <td className="p-4"><Check className="w-4 h-4 text-amber-400" /></td>
                <td className="p-4"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Private 1-on-1 Lead Curator Hotline</td>
                <td className="p-4 text-neutral-500">—</td>
                <td className="p-4 text-neutral-500">—</td>
                <td className="p-4"><Check className="w-4 h-4 text-emerald-400" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center text-xs text-neutral-400">
          Have bespoke questions about group commissions or company retreats?{' '}
          <Link to="/contact" className="text-amber-400 hover:underline">
            Reach out to our curator team
          </Link>
        </div>
      </div>
    </div>
  );
};
