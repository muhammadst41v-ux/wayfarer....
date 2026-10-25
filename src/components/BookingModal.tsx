import React, { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { useTheme } from '../context/ThemeContext';
import { X, Check, Loader2, Calendar, Users, MapPin } from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { selectedTripForBooking, closeBookingModal, submitEnquiry, enquiryStatus, resetEnquiryStatus } = useTrips();
  const { currentContent } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedTripForBooking) return null;

  const trip = currentContent.items.find((t) => t.id === selectedTripForBooking) || currentContent.items[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitEnquiry({
      tripId: trip.id,
      name,
      email,
      guests,
      notes,
    });
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetEnquiryStatus();
    closeBookingModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#11141c] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{trip.city}, {trip.country}</span>
            </div>
            <h3 className="text-xl font-serif text-white">{trip.title}</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Expedition deposit & reservation request</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {enquiryStatus.status === 'success' ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-amber-400/20 text-amber-400 border border-amber-400/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-serif text-white mb-2">Expedition Request Logged</h4>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto mb-6">
              {enquiryStatus.message || 'Our lead scout will review cohort availability and dispatch your field access pass within 24 hours.'}
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg text-xs transition-colors"
            >
              Return to Journey
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Email for Field Dossier</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@studio.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-300 font-medium mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Number of Guests</span>
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-[#171b24] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={1}>1 Solo Explorer</option>
                  <option value={2}>2 Explorers (Twin/Double)</option>
                  <option value={3}>3 Explorers</option>
                  <option value={4}>4 Explorers (Private Pod)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Target Departure</span>
                </label>
                <div className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-neutral-300 font-mono text-[11px]">
                  Upcoming Season 2026
                </div>
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                Specific Interests or Dietary Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. passionate about brutalist photography, vegetarian, looking for quiet room"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                Deposit: <span className="text-white font-mono">$200 refundable</span>
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Submit Reservation Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
