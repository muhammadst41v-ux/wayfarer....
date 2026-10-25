import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { EffectsProvider } from './context/EffectsContext';
import { AuthProvider } from './context/AuthContext';
import { EditModeProvider } from './context/EditModeContext';
import { TripProvider } from './context/TripContext';

import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CanvasParticles } from './components/CanvasParticles';
import { EditModeToolbar } from './components/EditModeToolbar';
import { CommandPalette } from './components/CommandPalette';
import { CookieConsent } from './components/CookieConsent';
import { BookingModal } from './components/BookingModal';
import { AiTripPlannerWidget } from './components/AiTripPlannerWidget';
import { Toast } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { TripsPage } from './pages/TripsPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { AboutPage } from './pages/AboutPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AccountPage } from './pages/AccountPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { MapPage } from './pages/MapPage';
import { CulturePage } from './pages/CulturePage';
import { TouristToolkitPage } from './pages/TouristToolkitPage';
import { TripPlannerPage } from './pages/TripPlannerPage';

// Scroll to top on route change
const ScrollToTopOnNavigate: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <GlobalErrorBoundary fallbackTitle="Wayfarer Application Recovered">
      <ThemeProvider>
        <EffectsProvider>
          <AuthProvider>
            <EditModeProvider>
              <TripProvider>
                <BrowserRouter>
                  <ScrollToTopOnNavigate />

                  <div className="relative min-h-screen bg-[#0b0d10] text-[#e8ebf0] flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
                    {/* Background Canvas Particles */}
                    <CanvasParticles />

                    {/* Navigation Bar */}
                    <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

                    {/* Main Content Router */}
                    <main className="flex-1 relative z-10">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/destinations" element={<DestinationsPage />} />
                        <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
                        <Route path="/map" element={<MapPage />} />
                        <Route path="/planner" element={<TripPlannerPage />} />
                        <Route path="/trips" element={<TripsPage />} />
                        <Route path="/trips/:slug" element={<TripDetailPage />} />

                        {/* Protected Routes */}
                        <Route
                          path="/my-trips"
                          element={
                            <ProtectedRoute>
                              <MyTripsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/account"
                          element={
                            <ProtectedRoute>
                              <AccountPage />
                            </ProtectedRoute>
                          }
                        />

                        {/* Auth Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/auth" element={<LoginPage />} />

                        {/* Content Pages */}
                        <Route path="/culture" element={<CulturePage />} />
                        <Route path="/toolkit" element={<TouristToolkitPage />} />
                        <Route path="/toolkit/:tab" element={<TouristToolkitPage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:slug" element={<BlogPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/privacy" element={<LegalPage />} />
                        <Route path="/terms" element={<LegalPage />} />

                        {/* Custom 404 with search */}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </main>

                    {/* Footer */}
                    <Footer />

                    {/* Global Overlays & Modals */}
                    <AiTripPlannerWidget />
                    <EditModeToolbar />
                    <BookingModal />
                    <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                    <CookieConsent />
                    <Toast />
                  </div>
                </BrowserRouter>
              </TripProvider>
            </EditModeProvider>
          </AuthProvider>
        </EffectsProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
}
