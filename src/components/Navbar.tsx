import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { EditableText } from './EditableText';
import { Menu, X, Heart, Search, Sun, Moon, User, LogOut, Shield, Compass, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { currentContent, isDarkMode, toggleDarkMode } = useTheme();
  const { favorites } = useTrips();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = currentContent.navLinks || [];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-[#0b0d10]/90 backdrop-blur-md border-b border-white/8 py-3.5 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-serif font-medium tracking-tight text-white hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            <EditableText contentKey="brand.name" defaultText={currentContent.brandName} />
          </Link>

          {/* Zone 2: 4–5 concise single-line text links */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-sans font-medium text-neutral-300"
            aria-label="Main Navigation"
          >
            {navLinks.map((link, idx) => {
              const isExternal = link.href.startsWith('#');
              const isActive = location.pathname === link.href;

              if (isExternal) {
                return (
                  <a
                    key={idx}
                    href={link.href}
                    className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 relative py-1"
                  >
                    <EditableText contentKey={`nav.link.${idx}`} defaultText={link.label} />
                  </a>
                );
              }

              return (
                <Link
                  key={idx}
                  to={link.href}
                  className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 relative py-1 flex items-center gap-1.5 ${
                    isActive ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  <EditableText contentKey={`nav.link.${idx}`} defaultText={link.label} />
                  {link.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 leading-none">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + compact tools */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search command trigger */}
            <button
              onClick={onOpenSearch}
              title="Search site (Ctrl+K)"
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-mono text-[11px]">Search</span>
              <kbd className="hidden lg:inline-block px-1 text-[10px] bg-white/10 rounded">⌘K</kbd>
            </button>

            {/* Saved favorites quick link */}
            <Link
              to="/my-trips"
              title="Saved Expeditions"
              className="relative p-2 text-neutral-300 hover:text-amber-300 transition-colors"
            >
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'text-amber-400 fill-amber-400/20' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-amber-400 text-neutral-950 font-mono font-bold text-[10px] flex items-center justify-center leading-none shadow-md">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleDarkMode}
              title="Toggle theme appearance"
              className="p-2 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Avatar Menu if logged in, or Sign In button if logged out */}
            {isAuthenticated && user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs text-white"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-serif font-bold text-neutral-950"
                    style={{ backgroundColor: user.avatarColor || '#f59e0b' }}
                  >
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium text-xs max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#11141c] border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <span className="text-xs font-semibold text-white block truncate">{user.name}</span>
                      <span className="text-[10px] font-mono text-neutral-400 block truncate">{user.email}</span>
                    </div>

                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>Account Credentials</span>
                    </Link>

                    <Link
                      to="/my-trips"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-amber-400" />
                      <span>Saved Expeditions ({favorites.length})</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors text-left border-t border-white/5 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
              >
                <User className="w-3 h-3 text-amber-400" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Primary Action Button */}
            <Link
              to="/trips"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-full shadow-[0_2px_12px_rgba(245,158,11,0.25)] transition-all duration-200 whitespace-nowrap shrink-0 hover:scale-[1.02]"
            >
              <EditableText contentKey="nav.cta" defaultText="Book Expedition" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-300 hover:text-white"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-[#0b0d10]/95 backdrop-blur-xl pt-24 px-6 pb-8 flex flex-col justify-between">
          <nav className="flex flex-col gap-4 text-base font-serif">
            {/* Authenticated user banner in mobile */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 mb-2 font-sans">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-neutral-950"
                  style={{ backgroundColor: user.avatarColor || '#f59e0b' }}
                >
                  {user.name[0]}
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">{user.name}</span>
                  <span className="text-[10px] text-neutral-400 font-mono block">{user.email}</span>
                </div>
              </div>
            )}

            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-200 hover:text-amber-300 py-1 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              to="/trips"
              onClick={() => setMobileMenuOpen(false)}
              className="text-amber-400 hover:text-amber-300 py-1 border-b border-white/5"
            >
              All Expeditions & Trips
            </Link>
            <Link
              to="/my-trips"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-200 hover:text-amber-300 py-1 border-b border-white/5 flex items-center justify-between"
            >
              <span>My Saved Expeditions</span>
              {favorites.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 font-mono text-xs font-bold">
                  {favorites.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-neutral-200 hover:text-amber-300 py-1 border-b border-white/5"
                >
                  Account Credentials
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="text-rose-300 text-left py-1"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-amber-300 hover:text-amber-200 py-1 border-b border-white/5"
              >
                Sign In / Join Studio
              </Link>
            )}
          </nav>

          <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
            <Link
              to="/trips"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 text-center text-sm font-semibold text-neutral-950 bg-amber-400 rounded-lg shadow-lg"
            >
              Book an Expedition
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSearch) onOpenSearch();
              }}
              className="w-full py-2.5 text-center text-xs font-mono text-neutral-300 bg-white/5 border border-white/10 rounded-lg"
            >
              Open Site Search (⌘K)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
