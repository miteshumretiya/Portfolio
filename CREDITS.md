# Credits & asset sources

Every visual asset on this site is original and was generated from code in this repository. No stock photos, videos or third-party illustrations are used.

The build environment's network policy blocked Unsplash, Pexels, Mixkit and Coverr, so instead of placeholders the artwork was made in code. All of it is reproducible with `npm run art` (`scripts/generate-art.mjs`).

| Asset | Path | Source / how it was made | Licence |
| --- | --- | --- | --- |
| Hero background poster | `public/images/field-poster.webp` | One frame of the site's own WebGL "field" shader (`src/lib/field-shader.ts`), rendered in headless Chromium | Original, © Mitesh Umretiya |
| Live hero background | `src/components/FieldBackground.tsx` | Real-time GLSL shader, written for this site | Original |
| Project cover: Air Canvas | `public/images/work/air-canvas.webp` | HTML/SVG composition (MediaPipe-style 21-point hand skeleton, toolbar), rendered to WebP | Original |
| Project cover: ArtisanBazaar | `public/images/work/artisanbazaar.webp` | HTML/SVG storefront mock with a generated Maltese-tile pattern | Original |
| Project cover: Real-time Weather | `public/images/work/weather.webp` | HTML/SVG dashboard mock | Original |
| Project cover: Netflix clone | `public/images/work/streambox.webp` | HTML/CSS streaming-UI mock; fictional titles, no third-party logos | Original |
| Project cover: Google Drive clone | `public/images/work/drive.webp` | HTML/CSS file-manager mock; no third-party logos | Original |
| Project cover: Music Library | `public/images/work/music.webp` | HTML/CSS music-app mock; fictional artists | Original |
| Film grain tile | `public/images/grain.webp` | 128px seeded random noise, generated with sharp | Original |
| Open Graph image | `public/og.png` | Composition of the shader poster + type | Original |
| Favicon / app icon | `src/app/icon.svg`, `src/app/apple-icon.png` | Hand-drawn SVG "network node" mark | Original |
| "Bloom" monogram avatar | `src/components/Brand.tsx` | Inline SVG | Original |
| Icons | `src/components/Icons.tsx` | Inline SVGs in the style of [Lucide](https://lucide.dev) (ISC licence); paths adapted from Lucide | ISC |

## Fonts

| Font | Use | Source | Licence |
| --- | --- | --- | --- |
| Geist | UI and body text | Google Fonts, self-hosted at build time via `next/font` | SIL Open Font License 1.1 |
| Instrument Serif | Italic editorial accents | Google Fonts, self-hosted via `next/font` | SIL Open Font License 1.1 |

## Libraries

Next.js (MIT), React (MIT), Tailwind CSS (MIT), GSAP with ScrollTrigger and SplitText (free under the GSAP Standard "No Charge" licence), Lenis (MIT).

## Replacing artwork

To use a real portrait, add `public/images/portrait.webp` and swap the `<Bloom />` avatar in `src/components/sections/Hero.tsx` for a `next/image`. Project covers can be replaced with real screenshots at the same paths (4:3, at least 1600×1200).
