import { autoMove, draw, isWon, newGame, GameState, Source } from '../src/game/klondike';

const count = (s: GameState) =>
  s.stock.length + s.waste.length + s.foundations.flat().length + s.tableau.flat().length;

let wins = 0;
for (let seed = 1; seed <= 300; seed++) {
  let s = newGame(seed);
  if (count(s) !== 52) throw new Error('bad deal');
  for (let step = 0; step < 2000 && !isWon(s); step++) {
    const srcs: Source[] = [{ pile: 'waste' }];
    s.tableau.forEach((col, c) => col.forEach((card, i) => card.faceUp && srcs.push({ pile: 'tableau', col: c, index: i })));
    // greedy: foundation moves first, then tableau moves that reveal a card
    let moved = false;
    for (const src of srcs) {
      const r = autoMove(s, src);
      if (r && (r.dest.pile === 'foundation' || (src.pile === 'tableau' && src.index > 0 && !s.tableau[src.col][src.index - 1].faceUp) || src.pile === 'waste')) {
        s = r.state; moved = true; break;
      }
    }
    if (!moved) s = draw(s);
    if (count(s) !== 52) throw new Error('card lost at seed ' + seed);
    s.tableau.forEach((col) => { if (col.length && !col[col.length - 1].faceUp) throw new Error('top face-down'); });
  }
  if (isWon(s)) wins++;
}
console.log('OK, greedy bot won', wins, 'of 300 deals');
