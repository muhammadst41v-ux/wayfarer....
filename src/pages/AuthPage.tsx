import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useTheme } from '../context/ThemeContext';
import { Heart, User, Lock, Mail, LogOut, Compass, Shield, ArrowRight } from 'lucide-react';
import { SmartImage } from '../components/SmartImage';

const AUTH_STORAGE_KEY = 'wayfarer_user_session_v1';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { currentContent } = useTheme();
  const { favorites, toggleFavorite, openBookingModal } = useTrips();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'my-trips'>(() => {
    return searchParams.get('tab') === 'favorites' ? 'my-trips' : 'login';
  });

  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setActiveTab('my-trips');
    }
  }, [currentUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    const user = {
      email,
      name: email.split('@')[0].toUpperCase(),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
    setActiveTab('my-trips');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const user = { email, name };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
    setActiveTab('my-trips');
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    setActiveTab('login');
  };

  const savedTrips = currentContent.items.filter((trip) => favorites.includes(trip.id));

  return (
    <div className="pt-28 pb-24 px-6 sm:px-8 max-w-5xl mx-auto min-h-screen text-white">
      {/* Top Heading */}
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Explorer Portal
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-light text-white mt-2 mb-3">
          {currentUser ? `Welcome back, ${currentUser.name}` : 'Member Access'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Manage your saved expeditions, access digital field dossiers, and verify fellowship privileges.
        </p>

        {/* Navigation Tabs */}
        <div className="mt-8 inline-flex items-center p-1 bg-white/5 border border-white/10 rounded-xl">
          {!currentUser ? (
            <>
              <button
                onClick={() => {
                  setError('');
                  setActiveTab('login');
                }}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'login'
                    ? 'bg-amber-400 text-neutral-950 font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setError('');
                  setActiveTab('register');
                }}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'register'
                    ? 'bg-amber-400 text-neutral-950 font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </>
          ) : (
            <button
              onClick={() => setActiveTab('my-trips')}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-amber-400 text-neutral-950 font-semibold"
            >
              My Expeditions & Saved ({favorites.length})
            </button>
          )}
        </div>
      </div>

      {/* Login Tab */}
      {activeTab === 'login' && !currentUser && (
        <div className="max-w-md mx-auto p-8 rounded-2xl bg-[#11141c] border border-white/12 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="explorer@studio.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Passkey / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {error && <p className="text-rose-400 text-[11px] font-mono">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg transition-colors text-xs"
            >
              Authenticate Member
            </button>
          </form>
        </div>
      )}

      {/* Register Tab */}
      {activeTab === 'register' && !currentUser && (
        <div className="max-w-md mx-auto p-8 rounded-2xl bg-[#11141c] border border-white/12 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Explorer Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amara Chen"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amara@studio.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Choose Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {error && <p className="text-rose-400 text-[11px] font-mono">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg transition-colors text-xs"
            >
              Register & Initialize Portal
            </button>
          </form>
        </div>
      )}

      {/* My Trips & Saved Protected View */}
      {currentUser && (
        <div className="space-y-8">
          {/* Member Badge & Profile Bar */}
          <div className="p-6 rounded-2xl bg-[#11141c] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-serif text-lg font-bold">
                {currentUser.name[0]}
              </div>
              <div>
                <h3 className="text-base font-serif text-white">{currentUser.name}</h3>
                <p className="text-xs text-neutral-400 font-mono">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-xs font-mono">
                <Shield className="w-3.5 h-3.5" /> Fellowship Active
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-3 py-1 bg-white/5 rounded-lg border border-white/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          </div>

          {/* Saved Favorites Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Bookmarked Journeys ({savedTrips.length})</span>
              </h3>
              <Link to="/trips" className="text-xs text-amber-400 hover:underline">
                Explore more trips →
              </Link>
            </div>

            {savedTrips.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white/5 border border-white/10">
                <Compass className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
                <p className="text-sm text-neutral-300">No journeys saved to your profile yet.</p>
                <p className="text-xs text-neutral-500 mt-1 mb-4">
                  Tap the heart icon on any expedition card to bookmark it for later review.
                </p>
                <Link
                  to="/trips"
                  className="px-4 py-2 bg-amber-400 text-neutral-950 font-semibold rounded-lg text-xs"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex gap-4 p-4 rounded-xl bg-[#12161f] border border-white/10 items-center justify-between"
                  >
                    <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0">
                      <SmartImage
                        src={trip.featuredImage}
                        fallbackUrls={trip.fallbackUrls}
                        placeName={trip.title}
                        alt={trip.title}
                        aspectRatio="6/5"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-amber-400 block">{trip.city}</span>
                      <h4 className="text-sm font-serif text-white truncate">{trip.title}</h4>
                      <span className="text-xs font-mono text-neutral-400 mt-0.5 block">${trip.price}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => openBookingModal(trip.id)}
                        className="px-3 py-1 bg-amber-400 text-neutral-950 font-semibold rounded text-[11px]"
                      >
                        Enquire
                      </button>
                      <button
                        onClick={() => toggleFavorite(trip.id)}
                        className="text-[10px] text-neutral-400 hover:text-rose-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
