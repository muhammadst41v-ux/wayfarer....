import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { useTheme } from '../context/ThemeContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SmartImage } from '../components/SmartImage';
import {
  User,
  Mail,
  Palette,
  Heart,
  Calendar,
  LogOut,
  Shield,
  Clock,
  Compass,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, updateUser, logout, enquiries } = useAuth();
  const { favorites, toggleFavorite, openBookingModal } = useTrips();
  const { currentContent } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor || '#f59e0b');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    document.title = `My Account & Field Record | ${currentContent.brandName}`;
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarColor(user.avatarColor || '#f59e0b');
    }
  }, [user, currentContent]);

  const colorPalette = [
    { label: 'Obsidian Amber', value: '#f59e0b' },
    { label: 'Cyan Aurora', value: '#06b6d4' },
    { label: 'Basalt Emerald', value: '#10b981' },
    { label: 'Deep Violet', value: '#8b5cf6' },
    { label: 'Rose Quartz', value: '#f43f5e' },
    { label: 'Alpine Sky', value: '#38bdf8' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, avatarColor });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const savedTrips = currentContent.items.filter((trip) => favorites.includes(trip.id));

  return (
    <div className="pt-28 pb-24 px-6 sm:px-8 max-w-5xl mx-auto min-h-screen text-white">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Explorer Account' }]} />
      </div>

      {/* Account Hero Banner */}
      <div className="p-8 rounded-3xl bg-[#11141c] border border-white/10 shadow-2xl mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-serif text-2xl font-bold shadow-lg text-neutral-950 shrink-0 transition-colors"
            style={{ backgroundColor: avatarColor }}
          >
            {name ? name[0].toUpperCase() : 'W'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif text-white">{name}</h1>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono">
                <Shield className="w-3 h-3" /> Fellowship Key
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-1">{email}</p>
            <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">
              Member since {user?.createdAt || '2026'} · Sovereign Device Storage
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 rounded-xl text-xs font-mono transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Edit Profile Details & Avatar Color */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#12161f] border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <User className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-serif text-white">Profile Credentials</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Explorer Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Avatar Color Swatches */}
              <div>
                <label className="block text-neutral-300 font-medium mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Avatar Heraldry Color</span>
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {colorPalette.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setAvatarColor(c.value)}
                      title={c.label}
                      style={{ backgroundColor: c.value }}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        avatarColor === c.value ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {isSaved && (
                <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Profile updated and encrypted to local storage.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-xl text-xs transition-colors shadow"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Past Enquiries List */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#12161f] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-serif text-white">Past Enquiries & Holds</h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">{enquiries.length}</span>
            </div>

            {enquiries.length === 0 ? (
              <p className="text-xs text-neutral-500 py-3 text-center">No past enquiries logged yet.</p>
            ) : (
              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-amber-400 uppercase">{enq.date}</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                        {enq.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-medium text-white line-clamp-1">{enq.title}</h4>
                    <p className="text-[11px] text-neutral-400">{enq.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Saved Expeditions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#12161f] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h3 className="text-lg font-serif text-white">Saved Expeditions ({savedTrips.length})</h3>
              </div>
              <Link to="/trips" className="text-xs text-amber-400 hover:underline">
                Browse catalog →
              </Link>
            </div>

            {savedTrips.length === 0 ? (
              <div className="py-16 text-center text-xs">
                <Compass className="w-8 h-8 text-neutral-500 mx-auto mb-2 opacity-50" />
                <p className="text-neutral-300 font-medium">No saved journeys in your dossier yet.</p>
                <p className="text-neutral-500 mt-1 mb-4">
                  Browse the catalog and click the heart icon on any expedition to bookmark it.
                </p>
                <Link
                  to="/trips"
                  className="px-4 py-2 bg-amber-400 text-neutral-950 font-semibold rounded-lg text-xs"
                >
                  Explore Expeditions
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/30 transition-all gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
                        <SmartImage
                          src={trip.featuredImage}
                          fallbackUrls={trip.fallbackUrls}
                          placeName={trip.title}
                          alt={trip.title}
                          aspectRatio="1/1"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 block">{trip.city}</span>
                        <h4 className="text-sm font-serif text-white line-clamp-1">{trip.title}</h4>
                        <span className="text-xs font-mono text-neutral-400">${trip.price} · {trip.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openBookingModal(trip.id)}
                        className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg text-xs transition-colors"
                      >
                        Enquire
                      </button>
                      <button
                        onClick={() => toggleFavorite(trip.id)}
                        title="Remove from saved"
                        className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
