# T&F Summer Training — PWA

A complete, installable app version of your training tracker. Rebuilt from scratch with **zero external dependencies** — no CDN scripts, no fonts fetched at runtime, nothing that can fail to load. Tested end-to-end in a real browser before shipping (every day, every week 1-11, every checklist, the warm-up picker, and the interval timer).

## What's new in this version
- **Circuits and warm-ups now live in their own files too** (`circuits/` and `warmups/`), same pattern as phases — no more duplicated exercise data sitting inside `index.html`.
- **Phases live in separate files.** `index.html` never needs to change when you add a new phase — you just drop a new JSON file into the `phases/` folder and add its filename to `phases/manifest.json`.
- **Mark Day Complete**: a button on every day, independent of the exercise checkboxes.
- **Training Log**: tap the calendar icon in the header to see a grid of every week/day, with a checkmark for anything marked complete. Tap any cell to toggle it.
- **Catalog**: tap the search icon in the header to browse and search every circuit and warm-up currently loaded, independent of phase.
- **Session Blocks**: one unified checklist mechanism for "this day is made of distinct components you want to check off." It works two ways — auto-generated from a "10 x 100m"-style prescription (toggle it on per day), or an explicit list you define directly in a day's data (like a jump-prep day made of warmup/mobility/hops/jumps). Either way it's the same card, same behavior.
- **Day 5 support**: phases can now have up to 5 distinct workout days (`day1`-`day5`) plus Recovery.
- **Two recovery pills**: Recovery now has independent "Mark Day 6" / "Mark Day 7" buttons instead of one combined day-complete button.

## Don't want to write JSON by hand? Use this AI prompt

Paste the block below into any AI (this one, ChatGPT, whatever), then attach or paste your source material — a PDF, screenshot, whiteboard photo, or typed list describing a phase, circuit, or warm-up. It'll hand back ready-to-save JSON plus the exact filename and manifest line to add.

````
You are converting a training program into JSON files for a specific web app. The app reads three kinds of files: **phases** (a multi-week block of training, e.g. "Summer Training" or "Indoor Season"), **circuits** (a named set of exercises done as a block, e.g. "General Circuit 1"), and **warmups** (a named warm-up routine). I will give you source material — a PDF, screenshot, photo of a whiteboard, typed list, or plain description — and you will output the correctly formatted JSON file(s), ready to drop into the app's folders.

## Step 1: Figure out what type of content this is
If it's not obvious, ask me. It's usually one of:
- **A phase**: a multi-week block with distinct workout days (Day 1, Day 2, etc.) and/or recovery guidance, where each day changes week to week.
- **A circuit**: a single named set of exercises done as a block (bodyweight circuit, plyo series, etc.), used inside a phase's Day 2/Day 4-style content.
- **A warmup**: a single named warm-up routine, structurally identical to a circuit but used before the main workout.

## Step 2: Extract the content faithfully
- Preserve exercise names, rep/set counts, and any special notation (like `20"/40"` for seconds-on/seconds-off) exactly as given.
- Don't invent numbers, exercises, or notes that aren't in the source. If something is illegible or ambiguous, leave a `"// TODO: confirm ___"` style note in your reply (not inside the JSON itself — JSON doesn't support comments) rather than guessing silently.
- If a circuit/warmup includes structural lines like "3x 50m Build-ups with Skip Return" that sit *between* exercises rather than being an exercise themselves, prefix that line with `→ ` — the app renders anything starting with `→` as a section divider instead of a checkbox.

## Step 3: Output using these exact schemas

### Circuit or Warmup file
```json
{
  "key": "lowercase_no_spaces_unique_id",
  "name": "Display Name As Written",
  "items": [
    "Exercise 1",
    "Exercise 2",
    "→ 3x 50m Build-ups with Skip Return",
    "Exercise 3"
  ],
  "timer": { "work": 30, "rest": 15 }
}
```
- `key` must match the filename (without `.json`), lowercase, no spaces — e.g. `key: "gc5"` → filename `gc5.json`.
- Circuits go in the `circuits/` folder, warmups go in the `warmups/` folder.
- **`timer` is optional** — only include it if the source describes a work/rest interval scheme for this circuit (e.g. "30 seconds on, 15 seconds rest between each exercise", or "20"-40" seconds ON / 20"-40" seconds Rest per exercise" — if it's a range, pick a single reasonable value like the lower end). When present, the app shows a live countdown timer that cycles through the exercise list, naming each one as it goes. Omit `timer` entirely for straight rep/set-based circuits (like "10 Push Ups, 10 Squats...") that have no interval structure — those just render as a plain checklist, which is correct for them.
- If the source describes *different* timing for different weeks of the same circuit (e.g. "20"/40" in weeks 1-4, then 30"/30" in weeks 5-8"), flag that to me explicitly rather than picking one — that's a week-dependent scheduling detail that needs a small code change, not something you can encode in the circuit file alone.

### Phase file
```json
{
  "key": "lowercase_no_spaces_unique_id",
  "label": "Display Name As Written",
  "weeksCount": 8,
  "days": {
    "day1": {
      "label": "Short tab name (e.g. Speed)",
      "full": "Day 1 — Full Title",
      "base": "General instructions for this day, shown under the title.",
      "weeks": {
        "1": "Week 1's prescription, e.g. \"5 x 60m\"",
        "2": "Week 2's prescription"
      },
      "tj": "A short coaching note for a triple jumper doing this program — flag anything that needs modifying for a jumper's joint/impact load, or say what to prioritize if short on time. Write this yourself based on the workout content; don't leave it blank.",
      "blocks": ["Optional list of distinct session components", "Each renders as its own checkable row"],
      "lungeMatrixUrl": "https://... (optional, any day can have a video link, not just one named day4/day5)"
    },
    "day2": { "...": "same shape as day1" },
    "day3": { "...": "same shape as day1" },
    "day4": { "...": "same shape as day1" },
    "day5": { "...": "same shape as day1 — currently supports day1 through day5" }
  },
  "recovery": {
    "label": "Recovery",
    "full": "Days X-Y — Active Recovery",
    "text": "General recovery guidance.",
    "options": ["Yoga", "Swim", "Bike", "..."],
    "tj": "Recovery-specific note for a triple jumper."
  }
}
```
- Only include the day keys that actually exist in the source — leave the others out entirely rather than filling them with placeholders. Up to 5 workout days (`day1`-`day5`) are supported.
- `weeks` only needs entries for the weeks you actually have information on.
- **`blocks` is optional.** Use it when a day is made of several *different* named components (like a jump-prep day: warmup, hurdle mobility, hurdle hops, approach jumps) rather than one exercise repeated N times. Don't use `blocks` for a simple "`<number> x <description>`" prescription like "10 x 100m" — leave that as plain text in `weeks`, since the app can already auto-generate a rep-by-rep checklist from that pattern on its own (a toggle the person using the app controls, not something you set in the file). Only reach for `blocks` when the day's structure genuinely isn't "one thing repeated."
- `recovery` can be omitted or set to `null` if the source doesn't cover it.
- If the source doesn't include the kind of "triple jump note" described above, write a reasonable one yourself based on general jumps-event training knowledge, and say in your reply that you added it so I can double check it.

## Step 4: Tell me what to do with it
This step matters — the single most common mistake is creating the new file but forgetting to register it, and then it silently doesn't show up anywhere with no error message. Every time, end your reply with a deploy checklist in exactly this format:

> **Deploy checklist:**
> 1. Save this as `<folder>/<filename>.json` (e.g. `warmups/studly2.json`)
> 2. Open `<folder>/manifest.json` and add `"<filename>.json"` to the list — **this is a second file you must also upload, not just the new content file.**
> 3. Upload/redeploy both files together.

Two files always change together: the new content file, AND the manifest.json in that same folder. Never present the new file as if it's a complete, ready-to-use deliverable on its own — always pair it with the manifest instruction, even if I don't explicitly ask for it.

Output only valid JSON in the code block (no trailing commas, all quotes properly escaped) — I'll be pasting it directly into a file.
````

## How to add a new circuit or warm-up

Same idea as phases:

1. Copy any file in `circuits/` (or `warmups/`) as a template, e.g. `circuits/gc1.json`.
2. Rename it and fill in the fields:
   ```json
   { "key": "gc5", "name": "General Circuit 5", "items": ["Push Ups", "Squats", "..."] }
   ```
   - `key` must be unique and match how you'll reference it in code.
   - `items` is the checklist. Any item starting with `→` renders as a section divider instead of a checkbox (used for the "3x 50m Build-ups..." style lines in the warm-ups).
   - Optionally add `"timer": { "work": 30, "rest": 15 }` if the circuit has a work/rest interval structure (like Vacation and Dudley do). The app then shows a countdown timer that cycles through the exercise list automatically — no code changes needed. Leave it out for plain rep/set circuits.
3. Add the filename to `circuits/manifest.json` (or `warmups/manifest.json`).
4. Redeploy the folder.

**One caveat:** which circuits show up on which day/week is still decided by logic in `index.html` (the `circuitsForDay` function) — adding a new circuit file makes its data available and lets its Plyo/Circuit Timer work correctly, but you'd still need a small code change (or ask me) to actually schedule it into a specific day/week for a phase. This is different from adding a phase, which is fully self-contained.

**Another caveat:** the app currently supports up to 5 workout days per phase (`day1` through `day5`) plus Recovery — that's a fixed tab structure in `index.html`. A phase with fewer days (like the placeholder phases, which have none yet) works fine. Needing a 6th distinct workout day would require a small code change to add another tab slot — ask me if that comes up.

## How to add a new phase (no code editing of index.html required)

1. Copy `phases/phase1.json` (or any existing file) as a starting template.
2. Rename it, e.g. `phases/indoor.json`.
3. Fill in the fields — schema below.
4. Open `phases/manifest.json` and add your new filename to the list, e.g.:
   ```json
   ["summer.json", "phase1.json", "phase2.json", "competition.json", "indoor.json"]
   ```
5. Redeploy the whole folder (see hosting steps below). That's it — `index.html` is untouched.

### Phase file schema
```json
{
  "key": "indoor",
  "label": "Indoor Season",
  "weeksCount": 6,
  "days": {
    "day1": {
      "label": "Speed",
      "full": "Day 1 — Speed",
      "base": "Text shown under the day title.",
      "weeks": { "1": "5 x 60m", "2": "5 x 60m", "3": "6 x 60m" },
      "tj": "Triple jump note shown in the green box.",
      "blocks": ["Optional: distinct session components, each its own checkable row"],
      "lungeMatrixUrl": "https://... (optional, works on any day)"
    },
    "day2": { "...": "same shape" },
    "day3": { "...": "same shape" },
    "day4": { "...": "same shape" },
    "day5": { "...": "same shape — day1 through day5 are supported" }
  },
  "recovery": {
    "label": "Recovery",
    "full": "Days 6-7 — Active Recovery",
    "text": "Description text.",
    "options": ["Yoga", "Swim", "..."],
    "tj": "Triple jump note for recovery days."
  }
}
```
- `key` must be unique and match what's in the filename (no spaces).
- `weeksCount` controls how many weeks show in the top lane track.
- `days` can have anywhere from 0 to 5 entries (`day1`-`day5`). Missing days show as "no program added yet" in the app.
- `recovery` can be `null` if you don't have recovery content yet for that phase. Recovery gets two independent "Mark Day 6" / "Mark Day 7" pills rather than a single day-complete button, since it typically spans two days.
- The `weeks` map only needs entries for the weeks you have content for — the app just won't show a prescription for weeks you leave out.
- **`blocks` is optional** and covers the same ground as auto-parsed reps, just for days that aren't "one exercise repeated N times." If a day's `weeks` text follows the "`<number> x <description>`" pattern (e.g. `"10 x 100m"`), the app can auto-generate a rep-by-rep checklist from it (toggled on per-day by the person using the app — this only applies when `blocks` isn't already set). If a day is instead made of several *different* named components (like a jump-prep day: warmup, hurdle mobility, hurdle hops, approach jumps), list them explicitly in `blocks` instead — that renders unconditionally as its own checklist, no toggle needed. Both ultimately render through the same "Session Blocks" checklist mechanism.
- Circuit checklists (General Circuits, Mercury/Venus/Mars, Vacation/Dudley, etc.) are Summer-Training-specific and their day/week scheduling stays coded in `index.html` — new phases get the plain prescription text plus the day-complete button and Session Blocks, but not auto-scheduled circuit checklists unless you ask for that to be added for a specific phase.

## Files
- `index.html` — the whole app (HTML + CSS + JS, self-contained, fetches all data at runtime)
- `manifest.json` — makes it installable (this is the PWA manifest, different from the other `manifest.json` files)
- `sw.js` — service worker, caches everything after first load so it works offline
- `icons/` — app icons
- `phases/` — one JSON file per training phase, plus `phases/manifest.json` listing which files to load
- `circuits/` — one JSON file per named circuit (General Circuit 1-4, Mercury, Venus, Mars, Bounding Series A, Running, Vacation, Dudley), plus `circuits/manifest.json`
- `warmups/` — one JSON file per warm-up (Circuit Warm Up, Circuit Warm Up B, Studly Warm Up), plus `warmups/manifest.json`

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

## Updating content later
Redeploy your changed files (new phase, edited circuit, whatever) to the same host location and you're done — **no need to touch `sw.js`.** The app always checks the network for the latest version first, and only falls back to its offline cache when there's no signal.

If the home screen app ever looks stale after a deploy (this can happen — iOS sometimes doesn't fully wake up a dormant background app to check for updates on launch), tap the **refresh icon** in the top-right of the header. It clears everything cached and reloads from scratch — no need to delete and reinstall the icon anymore.

## Notes
- Progress saves locally on your phone (`localStorage`) per week/day — nothing is sent anywhere, and the refresh button above doesn't touch it.
- A brand-new phase/circuit/warmup file will load correctly the first time your phone is online after you add it, and keeps working offline after that first visit.
- If you ever want to force a hard reset from the deploy side instead, bump `CACHE_NAME` in `sw.js` to any new string.
