# DESIGN.md — Paradise Design System & Visual Guidelines

> **Paradise (Dairi Horas Njuah Njuah)**  
> High-performance, modern editorial web application with rich cultural identity accents, warm natural canvas tones, and high-contrast typography.

---

## 1. Design System Overview

- **Aesthetic Philosophy**: Warm Editorial Minimalist meets Cultural Identity. Natural parchment canvas (`#f7f4ed`) combined with deep slate overlays (`#0f172a`), crisp dark text (`#1c1c1c`), and vibrant regional golden-amber accents (`#d97706` / `#fbbf24`).
- **Target Experience**: Fast-loading (60fps), highly responsive across Desktop, Tablet, and Mobile, with unmistakable active navigation indicators and clean component affordance.

---

## 2. Color Tokens

```css
:root {
  /* Canvas & Surface Colors */
  --color-bg: #f7f4ed;            /* Warm parchment canvas */
  --color-bg-secondary: #f7f4ed;  /* Section background */
  --color-bg-card: #f7f4ed;       /* Card background */
  --color-surface: #eceae4;       /* Hover state / subtle container */
  --color-border: #eceae4;        /* Dividers & borders */
  --color-border-hover: rgba(28, 28, 28, 0.4);

  /* Brand / Cultural Accent (Dairi Gold & Identity) */
  --color-accent: #d97706;        /* Primary golden amber */
  --color-accent-hover: #b45309;  /* Dark amber hover */
  --color-accent-light: rgba(217, 119, 6, 0.12); /* Subtle pill highlight */
  --color-accent-border: rgba(217, 119, 6, 0.35);
  --color-accent-glow: rgba(217, 119, 6, 0.25);
  --color-gold: #d97706;
  --color-gold-light: #fbbf24;    /* Vibrant hero text highlight */

  /* Text Hierarchy */
  --color-text-primary: #1c1c1c;   /* High-contrast charcoal black */
  --color-text-secondary: #5f5f5d; /* Soft muted gray */
  --color-text-muted: rgba(28, 28, 28, 0.4);

  /* Dark Overlay Surface (Hero & Solid Badges) */
  --color-dark-surface: #0f172a;
  --color-dark-card: #1c1c1c;
}
```

---

## 3. Typography & Hierarchy

- **Font Family**: Inter (`ui-sans-serif, system-ui, sans-serif`)
- **Title (Hero)**: `clamp(3rem, 8vw, 4.75rem)`, `font-weight: 700`, `-1.5px` letter-spacing, text-shadow for image readability.
- **Section Heading (`h2`)**: `clamp(1.8rem, 4vw, 2.8rem)`, `font-weight: 700`, charcoal primary text.
- **Tagline**: `clamp(1.15rem, 2.5vw, 1.55rem)`, `font-weight: 600`, golden amber `#fbbf24` text with side accent line decorators.
- **Body & Descriptions**: `line-height: 1.65`, 2-line clamped titles with baseline `min-height: 2.6em` to ensure uniform grid card heights.

---

## 4. Component Patterns & Rules

### A. Hero Section
- **Background Overlay**: Smooth dark-to-transparent multi-stop linear gradient (`180deg, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.5) 35%, rgba(15,23,42,0.85) 75%, var(--color-bg) 100%`).
- **Trust Badge**: Clean organic badge (`EST. 2013`) with Lucide `<Calendar size={13} />` icon, glass backdrop blur (`rgba(15,23,42,0.7)`), and subtle border.
- **CTA Actions**:
  - **Primary CTA ("Tentang Kami")**: `#1c1c1c` solid button, white text, subtle inset gold border shadow.
  - **Secondary CTA ("Lihat Kegiatan")**: `.secondaryBtn` glass outline button (`background: rgba(255,255,255,0.12)`, `border: 1.5px solid rgba(255,255,255,0.4)`), white text with hover lift.

### B. Navbar & Navigation
- **Header**: Fixed container with `backdrop-filter: blur(20px)` on scroll.
- **Link Spacing**: Generous horizontal padding (`0.6rem 1.25rem`) and link gap (`0.75rem`) for 13"-14" screen comfort.
- **Active State**: Unmistakable active indicator combining a subtle pill container background + glowing golden amber bottom underline bar (`3px height`).

### C. Kepengurusan (Officers Section)
- **Grid Layout**: Auto-centering flex wrap on Desktop/Tablet (`width: 200px` per card), 2-column grid on Mobile (`<640px`).
- **Initial Avatars**: 6 curated color gradient fallbacks for officers without photos:
  1. Deep Blue -> Sky (`linear-gradient(135deg, #1e3a8a, #3b82f6)`)
  2. Deep Amber -> Gold (`linear-gradient(135deg, #78350f, #d97706)`)
  3. Emerald -> Mint (`linear-gradient(135deg, #064e3b, #10b981)`)
  4. Crimson -> Rose (`linear-gradient(135deg, #881337, #f43f5e)`)
  5. Purple -> Violet (`linear-gradient(135deg, #4c1d95, #8b5cf6)`)
  6. Dark Slate (`linear-gradient(135deg, #1e293b, #475569)`)
- **Role Hierarchy**: Core BPH roles (Ketua, Wakil, Sekretaris, Bendahara) receive brand amber accent badges (`.positionCore`).

---

## 5. Performance & Rendering Principles

1. **Component Memoization**: Use `React.memo` for repeated list items (`OfficerCard`, `GalleryCard`) to prevent unnecessary re-renders.
2. **GPU Hardware Acceleration**: Apply `will-change: transform, opacity;` for animated CSS cards to ensure smooth 60fps transitions.
3. **Responsive Breakpoints**:
   - **Desktop**: `>=1024px` — spacious padding, centered flex rows.
   - **Tablet**: `641px - 1024px` — 180px card widths, optimized touch targets.
   - **Mobile**: `<=640px` — 2-column grid layout (`gap: 0.85rem`).
