# 🎨 ANNA PARIS - Design Decisions 2025

**Last Updated:** October 24, 2025  
**Design Lead:** AI UX/UI Specialist (Luxury E-commerce)

---

## 🎯 Design Philosophy

### Core Principles
```
Quiet Luxury + Timeless Elegance + Modern Minimalism
```

**What This Means:**
- **Whisper, Don't Shout:** Subtle sophistication over loud branding
- **Space as Luxury:** Generous whitespace = premium experience
- **Details Matter:** Every pixel serves purpose and beauty
- **Emotional Connection:** Design that evokes feeling, not just function

---

## 🎨 2025 Design Trends Applied

### 1. Bento Grid Layouts
**Decision:** Use for product grids and featured collections  
**Reason:** Dynamic, modern, breaks traditional e-commerce monotony  
**Implementation:** CSS Grid with varying card sizes

```css
/* Luxury Bento Pattern */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

### 2. Glassmorphism 2.0
**Decision:** Apply to overlays, modals, and floating elements  
**Reason:** Premium aesthetic, depth without heaviness  
**Implementation:** backdrop-blur + subtle transparency

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 3. Ambient Gradients
**Decision:** Subtle radial gradients as background accents  
**Reason:** Adds warmth and depth to neutral palette  
**Implementation:** Low-opacity radial gradients

```css
.ambient-bg {
  background: 
    radial-gradient(circle at 20% 10%, rgba(244,239,229,0.1), transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(15,26,36,0.03), transparent 50%);
}
```

### 4. Kinetic Typography
**Decision:** Text that responds to scroll and hover  
**Reason:** Creates premium interactive experience  
**Implementation:** Framer Motion + GSAP

### 5. Micro-scrolling
**Decision:** Parallax effects on product images  
**Reason:** Adds depth and luxury feel  
**Implementation:** translateY on scroll

---

## 📱 Mobile-First Design Decisions

### Touch Targets
**Standard:** Minimum 44px × 44px  
**Our Standard:** 48px × 48px (more premium feel)

### Gesture Navigation
**Implemented:**
- Swipe left/right: Product gallery
- Swipe down: Dismiss modals
- Long press: Quick actions
- Pinch: Image zoom

### Bottom Navigation Zone
**Decision:** Important actions within thumb reach (bottom 40%)  
**Reason:** One-handed luxury shopping experience

---

## 🎭 Animation Philosophy

### Timing & Easing
```javascript
// Luxury Animation Standards
const timing = {
  instant: 150,
  fast: 250,
  normal: 350,
  slow: 500,
  luxurious: 700
}

const easing = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  smooth: 'cubic-bezier(0.22, 0.61, 0.36, 1)' // Luxury
}
```

### Animation Principles
1. **Purposeful:** Every animation communicates state or guides attention
2. **Subtle:** Movements should feel natural, not jarring
3. **Responsive:** Immediate feedback (<100ms)
4. **Premium:** Slightly slower than typical (elegance > speed)

---

## 🖼️ Image Treatment

### Product Photography Style
**Decision:** Minimal styling, neutral backgrounds, natural light feel  
**Aspect Ratios:**
- Product cards: 3:4 (portrait)
- Product detail: 1:1 (square)
- Lifestyle shots: 16:9 (landscape)

### Image Optimization
```typescript
// Next.js Image Config
{
  formats: ['webp', 'avif'],
  sizes: '(max-width: 768px) 100vw, 50vw',
  quality: 90, // Higher for luxury
  priority: false, // Except hero
}
```

### Hover Effects
**Decision:** Subtle zoom (1.05x) + shadow elevation  
**Duration:** 500ms (luxurious pace)  
**Reason:** Premium feel without distraction

---

## 🎨 Color Usage Guidelines

### Primary Palette
```css
--ink: #0F1A24        /* Headlines, primary text */
--ink-2: #0F1A24      /* Body text, secondary */
--bg: #FCFCFD         /* Main background (warm white) */
--platinum: #EDEFF5   /* Section backgrounds */
--champagne: #F4EFE5  /* Accent color (warm) */
--hairline: #E6EAF0   /* Subtle borders */
```

### Usage Rules
- **Ink:** Never pure black (#000) - too harsh
- **Backgrounds:** Always off-white, never pure white
- **Champagne:** Sparingly - for emphasis only
- **Platinum:** Generous use for section separation

### Contrast Ratios
- Text on BG: 11:1 (AAA)
- Secondary text: 7:1 (AA+)
- UI elements: 4.5:1 minimum

---

## 📐 Spacing System

### Base Unit: 4px

```css
/* Spacing Scale */
--space-1: 4px;    /* Tight */
--space-2: 8px;    /* Close */
--space-3: 12px;   /* Snug */
--space-4: 16px;   /* Default */
--space-5: 20px;   /* Comfortable */
--space-6: 24px;   /* Relaxed */
--space-8: 32px;   /* Spacious */
--space-10: 40px;  /* Generous */
--space-12: 48px;  /* Luxurious */
--space-16: 64px;  /* Dramatic */
--space-20: 80px;  /* Statement */
```

### Luxury Spacing Rules
- **Product Cards:** 24px gap minimum
- **Sections:** 80px+ vertical padding
- **Content Max-Width:** 1700px (existing)
- **Reading Width:** 65ch (optimal)

---

## 🔤 Typography Decisions

### Font Stack (Preserved)
```css
--font-serif: 'Playfair Display', Georgia, serif;
--font-sans: 'Lato', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale (Enhanced)
```css
/* Display (Serif) */
--text-display-1: 4rem / 1.1 / -0.02em;   /* Hero headlines */
--text-display-2: 3rem / 1.15 / -0.01em;  /* Section titles */
--text-display-3: 2rem / 1.2 / 0;         /* Card headers */

/* Body (Sans) */
--text-body-lg: 1.125rem / 1.6 / 0.01em;  /* Intro text */
--text-body: 1rem / 1.6 / 0.01em;         /* Main text */
--text-body-sm: 0.875rem / 1.5 / 0.02em; /* Caption */
--text-body-xs: 0.75rem / 1.4 / 0.04em;  /* Fine print */
```

### Weight Guidelines
- **300:** Light - Subtitles, quotes
- **400:** Regular - Body text
- **500:** Medium - Emphasis
- **600:** Semibold - CTAs, headings (maximum)

**Never use:**
- Bold (700) - too heavy for luxury
- Black (900) - too aggressive

---

## 🎯 Component Design Patterns

### Button Hierarchy

**Primary (Ink Background)**
```css
.btn-primary {
  background: var(--ink);
  color: white;
  padding: 14px 32px;
  transition: transform 300ms ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(15,26,36,0.15);
}
```

**Secondary (Outline)**
```css
.btn-secondary {
  background: transparent;
  border: 1px solid var(--hairline);
  color: var(--ink);
}
```

**Tertiary (Text Only)**
```css
.btn-tertiary {
  background: none;
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

### Card Design

**Product Card**
```typescript
<Card>
  <ImageContainer> {/* 3:4 aspect ratio */}
    <Image />
    <QuickActions> {/* Appear on hover */}
      <WishlistButton />
      <QuickViewButton />
    </QuickActions>
  </ImageContainer>
  <Content>
    <Category /> {/* Small, uppercase, tracked */}
    <Title />    {/* Serif, medium */}
    <Price />    {/* Sans, bold */}
  </Content>
</Card>
```

**Hover State:**
- Image scale: 1.05x
- Card lift: translateY(-8px)
- Shadow: 0 12px 24px rgba(0,0,0,0.08)
- Duration: 400ms

---

## 🎨 Page-Specific Decisions

### Product Detail Page

**Layout Decision:** 60/40 split (Image Gallery / Product Info)  
**Reason:** Images are hero, info is supporting

**Image Gallery:**
- Main image: Zoomable (magnify on hover)
- Thumbnails: Vertical strip (left side)
- Mobile: Swipeable carousel

**Add to Cart:**
- Fixed position on mobile (bottom sheet)
- Animated feedback on success
- Fly-to-cart particle effect

### Product Listing

**Layout Decision:** Bento grid (variable card sizes)  
**Reason:** More interesting than uniform grid

**Filter Sidebar:**
- Sticky position (desktop)
- Drawer (mobile)
- Instant filter (no page reload)

### Checkout

**Layout Decision:** Split screen (Form / Summary)  
**Steps:** 3-step with progress indicator  
**Mobile:** Vertical stack, sticky summary

---

## 📊 Performance Design Decisions

### Image Strategy
**Decision:** Progressive loading + blur placeholder  
**Reason:** Premium experience even on slow connections

```typescript
<Image
  src={src}
  placeholder="blur"
  blurDataURL={thumbnailBase64}
  loading="lazy"
/>
```

### Animation Strategy
**Decision:** CSS for simple, Framer Motion for complex  
**Reason:** Performance + flexibility

**CSS Animations:** Hovers, simple transitions  
**Framer Motion:** Page transitions, complex sequences

### Code Splitting
**Decision:** Route-based splitting + component lazy loading  
**Reason:** Fast initial load, on-demand features

---

## ♿ Accessibility Decisions

### Focus States
**Decision:** Visible focus ring (2px champagne)  
**Reason:** Elegant + accessible

```css
*:focus-visible {
  outline: 2px solid var(--champagne);
  outline-offset: 2px;
}
```

### Color Contrast
**Minimum:** WCAG AA (4.5:1)  
**Target:** WCAG AAA (7:1)

### Keyboard Navigation
- All interactive elements: Tab accessible
- Escape: Close modals/overlays
- Cmd/Ctrl + K: Search

### Screen Readers
- Semantic HTML always
- ARIA labels for icons
- Skip to content link

---

## 🎯 Micro-interaction Catalog

### Add to Cart
```
1. Button press (scale 0.95)
2. Checkmark appears (500ms)
3. Product image flies to cart (800ms)
4. Cart badge bounces (300ms)
5. Toast notification (2s)
```

### Wishlist Heart
```
1. Tap/click
2. Heart fills (red gradient)
3. Scale pulse (1 → 1.2 → 1)
4. Particle burst effect
5. Haptic feedback (mobile)
```

### Image Hover
```
Desktop:
- Scale: 1 → 1.05 (500ms)
- Shadow elevation
- Quick actions fade in

Mobile:
- Double tap: Zoom
- Pinch: Zoom control
- Long press: Save image
```

---

## 🎨 Modal & Overlay Design

### Search Overlay
**Decision:** Full-screen with blur backdrop  
**Animation:** Fade + scale from center  
**Focus:** Auto-focus search input

### Cart Sidebar
**Decision:** Slide from right (400px width)  
**Backdrop:** Dark overlay (opacity: 0.4)  
**Close:** Click outside, ESC, or X button

### Quick View Modal
**Decision:** Centered modal (800px max-width)  
**Content:** Product essentials only  
**CTA:** Add to cart or View details

---

## 💎 Luxury UX Details

### Empty States
**Decision:** Beautiful illustrations + encouraging copy  
**Reason:** Turn negatives into delightful moments

### Loading States
**Decision:** Skeleton screens (not spinners)  
**Reason:** Perceived performance + elegance

### Success States
**Decision:** Celebration animations  
**Reason:** Reward users emotionally

### Error States
**Decision:** Friendly tone + clear action  
**Reason:** Reduce frustration, maintain luxury feel

---

## 🚀 Implementation Standards

### Code Quality
- TypeScript: Strict mode
- Components: Functional + hooks
- Props: Fully typed
- Comments: JSDoc for complex logic

### File Organization
```
/components
  /ui          → Reusable primitives
  /layout      → Headers, footers
  /products    → Product-specific
  /checkout    → Checkout flow
  /auth        → Auth pages
```

### Naming Conventions
- Components: PascalCase
- Files: kebab-case
- CSS Classes: kebab-case
- Functions: camelCase

---

*This document evolves with the project. All decisions are subject to testing and refinement.*
