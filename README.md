# Saleng Works: YEQ pitch deck

A 21-slide web deck that follows the 6-minute YEQ pitch script (6:43 PM → Access → proof → method → model → ask → 6:43 PM again). It's a static site: plain HTML, CSS and JS with three.js in `vendor/`, so there's no build step. The palette is night over the valley: dark pine green with warm light type and the campfire colours as accents.

## Present
- **Next:** the Next button, →, Space, PageDown or Enter. Clickers send PageDown.
- **Back:** ←, PageUp. **F** toggles fullscreen. **H** hides the buttons. **Home/End** jump to the first or last slide.
- `#9` at the end of the URL opens slide 9.

Slides that reveal in steps (one click each):

| Slide | Clicks |
| --- | --- |
| 2 Seoul / La Trinidad | Seoul's line, then La Trinidad's |
| 3 Access | "not talent, not effort", then **Access.** |
| 12 Not the only one | Ate Analyn, then CCDC |
| 14 Audit → Build → Support | one diorama per step |
| 17 Packages | Spark, Flame, Bonfire light one per click; click 4 is the Care Plan line |
| 19 The ask | what it buys / what it gets |
| 20 50 years from now | who built it |
| 21 Close | the tagline band (then stand still for two seconds) |

## Numbers quoted on stage
Edit `src/content.js` (survey count, "3 years", "15 minutes", ₱15,000, the ask). Anything containing `___` shows on its slide with an amber dashed outline.

## 3D scenes
One builder per illustrated slide in `src/scenes.js`: the two split screens (2, 21), the spark hopping shop to shop across La Trinidad and Baguio (4), the twenty shops (5), the three costs (6–8), the three "not built for them" dioramas (9), Doc. Rena (10), the three businesses (13), Audit/Build/Support (14), the devices (15), the three fires (17) and La Trinidad in 50 years (20).

## Photos and screenshots
Screenshots in `assets/screens/` were taken from the real projects using sample or demo data only:

| File | From | Used on |
| --- | --- | --- |
| `pos.png`, `pos-phone.png` | SYSTEMS/SNACK STOP POS, `/demo/pos` and `/demo/owner` | 11, 18 |
| `kiosk.png`, `kiosk-orders.png` | SYSTEMS/LAUNDRY | 12, 18 |
| `docgen.png`, `docgen-tool.png` | SOFTWARE/DOC GEN | 12, 18 |
| `garcia.png` | SYSTEMS/GARCIA ACCOUNTING, demo data | 18 |

Still to add (their slots show the expected file name until then):

| File | Slide |
| --- | --- |
| `assets/photos/rena-pos.jpg` | 11 · the POS at the snack stop |
| `assets/screens/coop.png` | 18 · the cooperative system |

## Run locally
The 3D scenes load as ES modules, so open the deck through a local server, not by double-clicking the file:

```
node serve.mjs
```

Then go to http://127.0.0.1:8765/ (pass another port as the second argument if that one is taken: `node serve.mjs . 8766`).

## Files
- `index.html`: all slides
- `src/content.js`: the numbers quoted on stage
- `src/deck.js`: navigation and step reveals
- `src/deck.css`: styles
- `src/kit.js`: low-poly building blocks and the shared WebGL renderer
- `src/scenes.js`: one 3D scene per illustrated slide; `split` / `splitDone` draw Seoul and La Trinidad side by side
- `previews/`: the three original design directions (A, B, C); C was chosen
