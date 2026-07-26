# T&F Summer Training — PWA

A real installable app version of your training tracker. This folder is a complete static site — no build step needed.

## Files
- `index.html` — the app
- `manifest.json` — tells iOS/Android this is installable
- `sw.js` — service worker, caches everything after first load so it works offline
- `icons/` — app icons

## 1. Host it (pick one, both are free, ~5 minutes)

### Option A — Netlify Drop (easiest)
1. Go to https://app.netlify.com/drop
2. Drag the whole `pwa` folder onto the page
3. You'll get a live URL like `https://random-name-123.netlify.app`

### Option B — GitHub Pages
1. Create a new repo on GitHub, e.g. `tf-tracker-app`
2. Upload all the files in this folder (keep the `icons/` folder structure)
3. Go to Settings → Pages → set source to the `main` branch, root folder
4. Your app will be live at `https://yourusername.github.io/tf-tracker-app`

## 2. Install it on your iPhone
1. Open the live URL in **Safari** (must be Safari, not Chrome)
2. Tap the Share icon (square with arrow) at the bottom
3. Scroll down, tap **Add to Home Screen**
4. Tap **Add**

It'll now sit on your home screen with its own icon, open full-screen with no browser bar, and keep working without signal once you've opened it at least once.

## Notes
- Progress is saved locally on your phone (`localStorage`), per week/day — nothing is sent anywhere.
- This version has **zero external dependencies** — no CDN scripts, no fonts fetched at runtime. Everything needed is in this folder, so it can't fail from a slow or blocked network request.
- If you update the files later, bump `CACHE_NAME` in `sw.js` (e.g. `tf-tracker-v3`) so your phone picks up the new version instead of serving the cached one.

## If you already installed the broken version
The old version loaded fonts/scripts from the internet and could show a gray blank screen if that failed. To fix an already-installed copy:
1. Remove the app from your home screen (long-press → Remove App)
2. Re-deploy these updated files to your host (Netlify/GitHub Pages)
3. Open the URL fresh in Safari, then Add to Home Screen again
