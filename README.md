# Unit Converter — Ionic Angular

A deployment-ready, offline-first Ionic + Angular unit converter inspired by the supplied mobile UI. No backend is required for conversions, history, favorites, onboarding, theme, precision, or usage tracking.

## Requirements
- Node.js 20+ (Node 22 recommended)
- npm 10+
- Ionic CLI: `npm install -g @ionic/cli` (optional; `npx ionic` also works)

## Install and run
```bash
npm install
ionic serve
```
The app uses hash-based Angular routing, so static hosts do not need SPA rewrite rules and direct refreshes remain safe.

## Build
```bash
npm run build
# or
ionic build
```
Production files are written to `www/`.

## Deploy
### Netlify
`netlify.toml` is included. Connect the repository; build command is `npm run build`, publish directory is `www`.

### Vercel
`vercel.json` is included. Build command is `npm run build`; output directory is `www`.

### Firebase Hosting
Install Firebase CLI, run `firebase login`, then `firebase deploy`. `firebase.json` is included and serves `www`.

### GitHub Pages
Run `npm run build`, then publish the contents of `www/` to the `gh-pages` branch (for example with a GitHub Actions workflow). Hash routing avoids route-refresh 404s. If hosting at a repository subpath, build with the appropriate `--base-href /REPOSITORY/` option.

## Project structure
- `src/app/core/models` — unit, category, history, favorite and settings interfaces
- `src/app/core/services/conversion.service.ts` — centralized category data, factors, temperature/fuel formulas and formatting
- `src/app/core/services/storage.service.ts` — guarded LocalStorage abstraction
- `src/app/core/services/app-state.service.ts` — persistent history, favorites, usage, theme, precision and onboarding
- `src/app/shared/components/bottom-nav` — reusable fixed tab navigation
- `src/app/pages` — welcome, home, categories, converter, recent, favorites, settings and info pages
- `src/global.scss` — responsive dark/light design system

## Main features
- 16 working converter categories with centralized formulas
- Smart search including `kg to lb`, `c to f`, and `meters to feet`
- Instant conversion, swap, copy, Web Share fallback, clear, quick values
- Favorite unit pairs and up to 50 recent conversions
- Automatically calculated most-used categories
- Dark, light and system themes
- Automatic or 0–6 decimal precision
- Responsive mobile/tablet/desktop layout with accessible labels and focus states
- Offline core calculations and browser-safe storage

## LocalStorage
All data remains on the current browser/device. Keys are namespaced with `uc.`: onboarding state, recent conversions, favorites, usage counts, theme and precision. Corrupt or missing JSON is handled by falling back to safe defaults.

## Notes on definitions
Month uses the average Gregorian month (30.4375 days), year uses 365.25 days, Mach uses 343 m/s as a practical reference, US customary liquid volume units are used, and Data Storage uses binary 1024-based multiples.
