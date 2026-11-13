# Saleng Works: YEQ pitch deck

A 15-slide web deck that follows the 6-minute YEQ pitch script (6:43 PM → Access → proof → method → model → 6:43 PM again). It's a static site: plain HTML, CSS and JS with three.js in `vendor/`, so there's no build step. The palette is night over the valley: dark pine green with warm light type and the campfire colours as accents.

## Present
- **Next:** the Next button, →, Space, PageDown or Enter. Clickers send PageDown.
- **Back:** ←, PageUp. **F** toggles fullscreen. **H** hides the buttons. **Home/End** jump to the first or last slide.
- `#9` at the end of the URL opens slide 9.

Slides that reveal in steps (one click each):

| Slide | Clicks |
| --- | --- |
| 1 6:43 PM | opens blank; the click pops out 6:43 PM |
| 2 Seoul / La Trinidad | Seoul's line, then La Trinidad's |
| 3 Access | "not talent, not effort", then **Access.** |
| 6 It costs them | money, nights, freedom |
| 9 Not the only one | Auntie Analyn, then CCDC |
| 11 Audit → Build → Support | one diorama per step |
| 12 Packages | Spark, Flame, Bonfire light one per click; click 4 is the Care Plan line |
| 14 50 years from now | made right here in the mountains, then "Not imported. Homegrown." |
| 15 Close | the line is up on entry; the click lands 6:43 (then stand still for two seconds) |

## Numbers quoted on stage
Edit `src/content.js` (survey count, "3 years", "15 minutes"). Anything containing `___` shows on its slide with an amber dashed outline.

## 3D scenes
One builder per illustrated slide in `src/scenes.js`: the split screen (2), the POS, kiosk, laptop, desktop and phone popping up beside the name (4), the twenty shops (5), the three costs (6), Doc. Rena (7), the three businesses (10), Audit/Build/Support (11), the three fires (12) and the spark hopping from shop to shop across La Trinidad and Baguio (14).

## Photos and screenshots
Screenshots in `assets/screens/` were taken from the real projects using sample or demo data only:

| File | From | Used on |
| --- | --- | --- |
| `pos.png`, `pos-phone.png` | SYSTEMS/SNACK STOP POS, `/demo/pos` and `/demo/owner` | 8, 13 |
| `kiosk.png`, `kiosk-orders.png` | SYSTEMS/LAUNDRY | 9, 13 |
| `docgen.png`, `docgen-tool.png` | SOFTWARE/DOC GEN | 9, 13 |
| `garcia.png` | SYSTEMS/GARCIA ACCOUNTING, demo data | 13 |
| `assets/photos/rena-pos.jpg` | the POS and receipt printer at Doc. Rena's snack stop | 8 |

Still to add (its slot shows the expected file name until then):

| File | Slide |
| --- | --- |
| `assets/screens/coop.png` | 13 · the cooperative system |

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
- `src/scenes.js`: one 3D scene per illustrated slide; `split` draws Seoul and La Trinidad side by side
- `previews/`: the three original design directions (A, B, C); C was chosen
