# T&F Summer Training — PWA

A complete, installable app version of your training tracker. Rebuilt from scratch with **zero external dependencies** — no CDN scripts, no fonts fetched at runtime, nothing that can fail to load. Tested end-to-end in a real browser before shipping (every day, every week 1-11, every checklist, the warm-up picker, and the interval timer).

## Files
- `index.html` — the whole app (HTML + CSS + JS, self-contained)
- `manifest.json` — makes it installable
- `sw.js` — service worker, caches everything after first load so it works offline
- `icons/` — app icons

## 1. Host it (free, ~5 minutes)

### Option A — Netlify Drop (easiest)
1. Go to https://app.netlify.com/drop
2. Drag the whole `tf-tracker-pwa` folder onto the page
3. You'll get a live URL like `https://random-name-123.netlify.app`

### Option B — GitHub Pages
1. Create a repo, e.g. `tf-tracker-pwa`
2. Click **Add file → Upload files**, drag in the whole folder (keep `icons/` nested inside)
3. Commit changes
4. Settings → Pages → Source: `main` branch, root folder
5. Live at `https://yourusername.github.io/tf-tracker-pwa`

## 2. Install on your iPhone
1. Open the live URL in **Safari** (must be Safari)
2. Tap Share (square with arrow) → **Add to Home Screen** → **Add**

It'll sit on your home screen with its own icon, open full-screen, and after the first load keep working with no signal.

## If you had the old broken version installed
1. Long-press the old icon on your home screen → Remove App
2. Deploy this new folder to your host
3. Open the fresh URL in Safari, then Add to Home Screen again

## Notes
- Progress saves locally on your phone (`localStorage`) per week/day — nothing is sent anywhere.
- If you edit the files later, bump `CACHE_NAME` in `sw.js` (e.g. `tf-tracker-v5`) so your phone picks up the change instead of serving a cached copy.
