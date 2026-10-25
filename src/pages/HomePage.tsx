import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { HeroScrub } from '../components/HeroScrub';
import { HeroExpansion } from '../components/HeroExpansion';
import { ManifestoReveal } from '../components/ManifestoReveal';
import { FeaturedTrips } from '../components/FeaturedTrips';
import { DeviceFrameScroll } from '../components/DeviceFrameScroll';
import { OrbitalTimeline } from '../components/OrbitalTimeline';
import { DayNightSlider } from '../components/DayNightSlider';
import { LensGallery } from '../components/LensGallery';
import { TestimonialColumns } from '../components/TestimonialColumns';
import { PricingSection } from '../components/PricingSection';

export const HomePage: React.FC = () => {
  const { currentContent } = useTheme();
  const heroType = currentContent.hero.type;

  return (
    <div className="relative w-full bg-[#0b0d10] text-[#e8ebf0]">
      {/* 1. Signature Hero Section (Scroll-locked scrub or expansion) */}
      {heroType === 'video-scrub' ? <HeroScrub /> : <HeroExpansion />}

      {/* 2. Text Scroll Animation: Manifesto reveal word-by-word */}
      <ManifestoReveal />

      {/* 3. Featured Curated Trips Grid */}
      <FeaturedTrips />

      {/* 4. Container Scroll Animation: Tilted 3D device frame flattening on scroll */}
      <DeviceFrameScroll />

      {/* 5. Radial Orbital Timeline: 7-day sample itinerary with interactive nodes */}
      <OrbitalTimeline />

      {/* 6. Image Comparison Slider: Day vs Night city photos */}
      <DayNightSlider />

      {/* 7. Optical Lens Gallery: Lens-zoom carousel with swipe & keyboard */}
      <LensGallery />

      {/* 8. Explorer Testimonials: Auto-scrolling columns */}
      <TestimonialColumns />

      {/* 9. Membership & Pricing with monthly/yearly toggle */}
      <PricingSection />
    </div>
  );
};
