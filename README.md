# WitchyKaren 🐈‍⬛🐉🧙

Klondike solitaire for **Android & iOS** (Expo / React Native) with a spooky crew:

- **Black cat** strolls along the bottom and jumps whenever a card reaches a foundation.
- **Dragon** flies across the sky and breathes fire when you complete a suit or win.
- **Witch hats** float in the background, decorate the card backs, and rain down when you win.

## Play
Tap a card to auto-move it to the best legal spot (foundation first). Tap the deck to draw; tap the empty deck to recycle. Undo and New Game in the header.

## Run
```bash
npm install
npx expo start        # scan the QR code with Expo Go (Android/iOS)
```

## Test
```bash
npm test              # rules sanity test over 300 deals
npm run typecheck
```

## Build for the stores (EAS)
```bash
npx eas-cli@latest build --platform android --profile preview   # installable APK
npx eas-cli@latest build --platform ios --profile production
```
Bundle id / package is `com.witchykaren.app` in `app.json` — change it to your own before publishing.

## Structure
- `src/game/klondike.ts` – pure game rules
- `src/components/Art.tsx` – SVG cat, dragon, witch hat
- `src/components/Critters.tsx` – animations
- `src/components/CardView.tsx` – cards
- `App.tsx` – board & wiring
