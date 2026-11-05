# Saleng Works: pitch deck

A 20-slide web deck (title slide + 19) for the business pitch. It's a static site: plain HTML, CSS and JS with three.js in `vendor/`, so there's no build step.

## Present
- **Next:** the Next button, →, Space, PageDown or Enter. Clickers send PageDown.
- **Back:** ←, PageUp. **F** toggles fullscreen. **H** hides the buttons. **Home/End** jump to the first or last slide.
- Some slides reveal in steps: 3 Access, 4 "Let me show you…", 9 CCDC screenshots and result, 12, 13 spark line, 15 packages one by one, 18.
- `#9` at the end of the URL opens slide 9.

## Fill in the blanks
Edit `src/content.js`. Any value that still contains `___` shows with an amber dashed outline on its slide.

## Photos and screenshots
The screenshots in `assets/screens/` were taken from the real projects using sample or demo data only:

| File | From | Used on |
| --- | --- | --- |
| `kiosk.png` | SYSTEMS/LAUNDRY, new-order form | 6 (portrait tablet) |
| `kiosk-orders.png` | SYSTEMS/LAUNDRY, orders list | 17 |
| `pos.png` | SYSTEMS/SNACK STOP POS, `/demo/pos` | 8 (tablet) |
| `pos-phone.png` | SYSTEMS/SNACK STOP POS, `/demo/owner` | 8, 17 (phone) |
| `docgen.png`, `docgen-tool.png` | SOFTWARE/DOC GEN | 9, 17 (laptops) |
| `garcia.png` | SYSTEMS/GARCIA ACCOUNTING, demo data | 17 (laptop) |

Still to add (their slots show the expected file name until then):

| File | Slide |
| --- | --- |
| `assets/photos/analyn-kiosk.jpg` | 6 |
| `assets/photos/rena-pos.jpg` | 8 |
| `assets/screens/coop.png` | 17 |

## Run locally
The 3D scenes load as ES modules, so open the deck through a local server, not by double-clicking the file:

```
node serve.mjs
```

Then go to http://127.0.0.1:8765/.

## Files
- `index.html`: all slides
- `src/content.js`: blanks and the DOC GEN URL
- `src/deck.js`: navigation and step reveals
- `src/deck.css`: styles
- `src/kit.js`: low-poly building blocks and the shared WebGL renderer
- `src/scenes.js`: one 3D scene per illustrated slide
- `previews/`: the three design directions (A, B, C); C was chosen
