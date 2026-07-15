# 🧩 twenty48

A clean **2048** in the browser. Slide tiles with arrow keys / WASD / swipe; matching tiles merge and double. Get to 2048 (and beyond). Vanilla JS + CSS grid, no dependencies, no backend. Best score persists in `localStorage`.

## Play
```bash
bunx serve .    # or: python -m http.server → open index.html
```

## Layout
- `logic.js` — pure game logic (`slide`, `move`, `addRandom`, `hasMoves`), unit-tested.
- `game.js` — rendering + input (keyboard & swipe).
- `index.html` — board + styles.

## Dev
```bash
bun test        # slide/merge, all 4 directions, lock detection
```

## Deploy
Static → **GitHub Pages** via `.github/workflows/pages.yml` (tests, then publishes). Settings → Pages → "GitHub Actions".

MIT.
