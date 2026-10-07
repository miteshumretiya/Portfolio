# Mitesh Umretiya: Portfolio

Personal portfolio of Mitesh Umretiya, a computing graduate from IDEA College, Malta (web developer and network engineer).

**Stack:** Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger, SplitText) · Lenis · raw WebGL · `next/font` · `next/image`

## Scripts

```bash
npm run dev        # local dev server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run art        # regenerate every raster asset from code (needs Chromium)
npm run qa         # screenshots + horizontal-overflow check at 8 breakpoints
```

## Structure

- `src/lib/content.ts`: all copy, sourced from the CV
- `src/lib/motion.ts`: motion engine, loaded lazily after the page is idle (Lenis, scroll reveals, pinning, horizontal scroll, cursor, magnetic buttons)
- `src/lib/field-shader.ts`: the WebGL "field" shader behind the hero
- `src/components/sections/*`: one file per section
- `src/app/globals.css`: design tokens (`@theme`), the CSS-only preloader and hero intro, and reduced-motion rules

## Progressive enhancement

- With JavaScript off, all content is visible: the preloader and hero intro are pure CSS, and the work row falls back to a native horizontal scroller.
- `prefers-reduced-motion` turns off smooth scrolling, the preloader, pinning, scrubbing, the shader and the custom cursor.
- The custom cursor, magnetic buttons and tilt only load for fine pointers. Touch devices keep native scrolling.

See `CREDITS.md` for asset sources.
