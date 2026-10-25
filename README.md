# Wayfarer — World & Pakistan Tourist Discovery Platform

A production-grade, multi-page web platform for destination discovery, curated expeditions, interactive maps, and AI-powered travel planning. Features deep exploration for **Pakistan** (20+ destinations across 7 regions, interactive clustering maps, stay & rental booking), plus full modular content packs for **City Architecture ('travel')**, **Alpine Endurance ('fitness')**, and **Live-Fire Taverns ('food')**.

---

## 🐙 How to Upload to GitHub

You have two easy ways to upload this project to GitHub:

### Option 1: Direct Push from Git CLI (Recommended)
1. **Create a new repository** on [GitHub.com](https://github.com/new) (e.g. `wayfarer-travel`). Do **not** initialize it with a README or .gitignore (this project already has both configured).
2. Open your terminal in this project folder and run:
   ```bash
   # Rename branch to main
   git branch -M main

   # Add your GitHub remote repository (replace YOUR_USERNAME and YOUR_REPO)
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

   # Push the code to GitHub
   git push -u origin main
   ```

### Option 2: Using the AI Studio UI
1. Look at the top-right corner of the AI Studio interface.
2. Click the **Export** / **Download** icon (or choose **Export to GitHub** if available in your AI Studio toolbar).
3. If downloading as a ZIP:
   - Extract the ZIP on your computer.
   - Open GitHub Desktop or run `git init`, `git add .`, `git commit -m "Initial commit"`.
   - Publish to GitHub.

---

## ⚡ Architecture Summary & Folder Structure

Built with a **Content-as-Data** foundation: every string, image, color, itinerary node, and configuration value lives in pure TypeScript data files (`/src/config/site.config.ts` and `/src/data/*.ts`), completely decoupled from component templates.

```text
├── index.html                  # HTML5 entry with editorial Google Fonts & meta
├── metadata.json               # Applet identity & major capabilities
├── package.json                # Dependencies & run scripts
├── server.ts                   # Express full-stack backend with /api/contact & /api/chat
├── vite.config.ts              # Vite + React + Tailwind v4 config
└── src/
    ├── config/
    │   └── site.config.ts      # Active category ('travel' | 'fitness' | 'food') & 3 theme presets
    ├── data/
    │   ├── travel.ts           # Wayfarer: City architecture & underground culture
    │   ├── fitness.ts          # Wayfarer Kinetic: Alpine endurance & athletic camps
    │   └── food.ts             # Wayfarer Palate: Live-fire taverns, woks & cellars
    ├── context/
    │   ├── EditModeContext.tsx # Live in-place text editing, local persistence, import/export
    │   ├── ThemeContext.tsx    # Category & theme switching with CSS variables
    │   └── TripContext.tsx     # Saved expeditions, booking enquiries & persistence
    ├── components/
    │   ├── Navbar.tsx          # 3-zone top bar contract, scroll blur & mobile drawer
    │   ├── Footer.tsx          # Newsletter with honeypot spam protection & quick switcher
    │   ├── HeroScrub.tsx       # Scroll-locked video scrub hero ("The city opens")
    │   ├── HeroExpansion.tsx   # Configurable alternative expansion hero
    │   ├── ManifestoReveal.tsx # Word-by-word scroll text reveal
    │   ├── DeviceFrameScroll.tsx # 3D perspective tilting device frame
    │   ├── OrbitalTimeline.tsx # Radial 7-day circular timeline with interactive nodes
    │   ├── DayNightSlider.tsx  # Daylight vs Subterranean Night drag/arrow comparison
    │   ├── LensGallery.tsx     # Optical lens carousel with swipe, arrows & lightbox
    │   ├── TestimonialColumns.tsx # Infinite auto-scrolling testimonial marquee
    │   ├── PricingSection.tsx  # Monthly/annual toggle with highlighted Fellowship plan
    │   ├── AiTripPlannerWidget.tsx # Floating AI trip architect with streaming output
    │   ├── CanvasParticles.tsx # Flowing particle background with click ripple
    │   ├── CommandPalette.tsx  # Ctrl+K site-wide search and navigation
    │   ├── BookingModal.tsx    # Reservation request form with guest selection
    │   ├── CookieConsent.tsx   # Essential storage consent banner
    │   ├── EditableText.tsx    # In-place live text editing wrapper
    │   └── LiquidButton.tsx    # Liquid-metal styled CTA button (zero heavy libs)
    ├── pages/
    │   ├── HomePage.tsx        # Signature landing experience
    │   ├── TripsPage.tsx       # Filterable catalog with search, vibe, and price range
    │   ├── TripDetailPage.tsx  # Full dossier, gallery, day-by-day protocol & booking
    │   ├── AboutPage.tsx       # Studio philosophy & resident scout network
    │   ├── PricingPage.tsx     # Membership plans & feature comparison matrix
    │   ├── BlogPage.tsx        # Field dispatches index & article reader view
    │   ├── ContactPage.tsx     # Curator enquiry form with honeypot & office info
    │   ├── FAQPage.tsx         # Searchable knowledge base accordion
    │   ├── AuthPage.tsx        # Member login/register & protected "My Trips" dashboard
    │   ├── LegalPage.tsx       # Terms of service, cancellation rules & privacy
    │   └── NotFoundPage.tsx    # Custom coordinate 404 handler
    └── types/
        └── index.ts            # Strict TypeScript contracts for content and themes
```

---

## 🚀 Change the Category in 5 Minutes

Wayfarer ships with **3 complete, fully populated content packs**:
1. `travel` (Default) — City discovery, brutalist architecture, cold war bunkers, jazz kissaten.
2. `fitness` — Wayfarer Kinetic: high-altitude camps, technical ridge running, hydro-recovery.
3. `food` — Wayfarer Palate: Basque cider taverns, Bangkok midnight woks, wild ferments.

### Step-by-Step Instructions:
1. Open `/src/config/site.config.ts`.
2. Locate line 105:
   ```typescript
   export const siteConfig: SiteConfig = {
     // SWITCH ACTIVE CATEGORY HERE ('travel' | 'fitness' | 'food')
     activeCategory: 'travel',
   ```
3. Change `'travel'` to `'fitness'` or `'food'`.
4. Save the file.
5. That's it! Every page (Hero, Navbar, Expeditions, Itineraries, Pricing, Testimonials, Journal, FAQ) updates immediately to the new domain.

---

## 🎨 Theme Presets

Switch between 3 distinct aesthetic directions by changing `activeTheme` in `/src/config/site.config.ts`:
- `'cinematic-amber'` (Default): Deep obsidian `#0b0d10`, warm amber glow, filmic mood.
- `'clean-light'`: Architectural off-white paper `#faf9f6`, crisp ink, sepia accents.
- `'bold-neon'`: Noir obsidian `#070709`, cyan `#06b6d4` & electric coral accents.

---

## ✏️ Hidden Live Edit Mode

- Press **`Ctrl+E`** (or **`Cmd+E`**) on any page, or append **`?edit=1`** to the URL.
- Click any headline, label, or body text with a dashed outline to edit it in place.
- All edits are automatically persisted to your browser's `localStorage`.
- Use the floating toolbar at the bottom to:
  - **Export JSON**: Download your customized text overrides as a JSON file.
  - **Import JSON**: Paste a JSON payload to load custom content across the site.
  - **Reset**: Restore all copy back to the default `site.config.ts` version.

---

## 🛠️ Install, Run, Build & Deploy

### Prerequisites
Node.js 18+ and npm.

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
# Starts full-stack Express server at http://localhost:3000 with Vite middleware
```

### Production Build
```bash
npm run build
npm run start
```

### Deploy to Vercel
1. Push to GitHub.
2. Import project into Vercel.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add environment variable `GEMINI_API_KEY` in Project Settings (optional, fallback is built-in).

### Deploy to Netlify
1. Connect repository in Netlify.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Configure redirect rule in `public/_redirects`:
   ```text
   /*    /index.html   200
   ```

---

## 📸 Where to Replace Media, Videos & Brand Name

### 1. Brand Name & Copy
- **Brand Name**: Change `brandName` in `/src/data/travel.ts` (or `fitness.ts` / `food.ts`).
- **Tagline**: Change `tagline` in `/src/data/*.ts`.
- **Global Identity**: Edit `index.html` (`<title>`, `<meta name="description">`) and `metadata.json`.

### 2. Hero Video & Poster
- In `/src/data/travel.ts` (or active content pack):
  ```typescript
  hero: {
    type: 'video-scrub', // or 'expansion'
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-urban-city-street-aerial-view-at-night-42171-large.mp4',
    poster: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=2000&q=85',
  }
  ```
  Replace `videoUrl` with any MP4 URL or self-hosted video in `/public`.

### 3. Expeditions, Gallery & Blog Images
- **Trips / Expeditions**: Edit the `items` array in `/src/data/travel.ts`, `/src/data/fitness.ts`, or `/src/data/food.ts`. Update `featuredImage` and `gallery`.
- **Day/Night Slider**: Update `dayNightSlider.dayImage` and `dayNightSlider.nightImage` in `/src/data/*.ts`.
- **Blog Articles**: Update `coverImage` in each post inside `blogPosts` in `/src/data/*.ts`.

---

## 🔒 Security & Environment Variables
- `GEMINI_API_KEY`: Used strictly server-side by `/api/chat` via `@google/genai`. Never bundled or exposed in client builds.
- Honeypot spam field (`honeypot`) silently filters bots on the Contact and Newsletter forms.

