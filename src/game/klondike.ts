// Klondike solitaire rules (draw-1). Pure functions, no React.

export type Suit = '♠' | '♥' | '♦' | '♣';
export const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];

export interface Card {
  id: string;
  suit: Suit;
  rank: number; // 1 = Ace ... 13 = King
  faceUp: boolean;
}

export interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: Card[][]; // 4 piles
  tableau: Card[][]; // 7 columns
  moves: number;
}

export type Source =
  | { pile: 'waste' }
  | { pile: 'tableau'; col: number; index: number }
  | { pile: 'foundation'; idx: number };

export type Dest = { pile: 'foundation'; idx: number } | { pile: 'tableau'; col: number };

export const isRed = (s: Suit) => s === '♥' || s === '♦';
export const rankLabel = (r: number) =>
  r === 1 ? 'A' : r === 11 ? 'J' : r === 12 ? 'Q' : r === 13 ? 'K' : String(r);

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function newGame(seed = Date.now()): GameState {
  const deck: Card[] = [];
  for (const suit of SUITS)
    for (let rank = 1; rank <= 13; rank++) deck.push({ id: `${suit}${rank}`, suit, rank, faceUp: false });
  const rand = rng(seed);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  const tableau: Card[][] = [];
  for (let c = 0; c < 7; c++) {
    const col = deck.splice(0, c + 1);
    col[col.length - 1].faceUp = true;
    tableau.push(col);
  }
  return { stock: deck, waste: [], foundations: [[], [], [], []], tableau, moves: 0 };
}

const clone = (s: GameState): GameState => ({
  stock: s.stock.map((c) => ({ ...c })),
  waste: s.waste.map((c) => ({ ...c })),
  foundations: s.foundations.map((p) => p.map((c) => ({ ...c }))),
  tableau: s.tableau.map((p) => p.map((c) => ({ ...c }))),
  moves: s.moves,
});

const top = <T,>(a: T[]) => a[a.length - 1];

export function draw(s: GameState): GameState {
  if (!s.stock.length && !s.waste.length) return s;
  const n = clone(s);
  if (!n.stock.length) {
    n.stock = n.waste.reverse().map((c) => ({ ...c, faceUp: false }));
    n.waste = [];
  } else {
    const c = n.stock.pop()!;
    c.faceUp = true;
    n.waste.push(c);
  }
  n.moves++;
  return n;
}

export function canFoundation(card: Card, pile: Card[]) {
  const t = top(pile);
  return t ? t.suit === card.suit && t.rank + 1 === card.rank : card.rank === 1;
}

export function canTableau(card: Card, pile: Card[]) {
  const t = top(pile);
  return t ? t.faceUp && isRed(t.suit) !== isRed(card.suit) && t.rank === card.rank + 1 : card.rank === 13;
}

function picked(s: GameState, src: Source): Card[] | null {
  if (src.pile === 'waste') return s.waste.length ? [top(s.waste)] : null;
  if (src.pile === 'foundation') {
    const p = s.foundations[src.idx];
    return p.length ? [top(p)] : null;
  }
  const col = s.tableau[src.col];
  const c = col[src.index];
  return c && c.faceUp ? col.slice(src.index) : null;
}

export function move(s: GameState, src: Source, dest: Dest): GameState | null {
  const cards = picked(s, src);
  if (!cards) return null;
  if (dest.pile === 'foundation') {
    if (cards.length !== 1 || src.pile === 'foundation') return null;
    if (!canFoundation(cards[0], s.foundations[dest.idx])) return null;
  } else {
    if (src.pile === 'tableau' && src.col === dest.col) return null;
    if (!canTableau(cards[0], s.tableau[dest.col])) return null;
  }
  const n = clone(s);
  if (src.pile === 'waste') n.waste.pop();
  else if (src.pile === 'foundation') n.foundations[src.idx].pop();
  else {
    const col = n.tableau[src.col];
    col.splice(src.index);
    if (col.length) top(col).faceUp = true;
  }
  const moved = cards.map((c) => ({ ...c, faceUp: true }));
  if (dest.pile === 'foundation') n.foundations[dest.idx].push(...moved);
  else n.tableau[dest.col].push(...moved);
  n.moves++;
  return n;
}

/** Tap-to-play: find the best legal destination for a tapped card. */
export function autoMove(s: GameState, src: Source): { state: GameState; dest: Dest } | null {
  const cards = picked(s, src);
  if (!cards) return null;
  const tries: Dest[] = [];
  if (cards.length === 1 && src.pile !== 'foundation')
    for (let i = 0; i < 4; i++) tries.push({ pile: 'foundation', idx: i });
  // Prefer non-empty columns, then empty ones (but don't shuffle a king from one empty spot to another).
  const cols = [0, 1, 2, 3, 4, 5, 6];
  const kingAtBase = src.pile === 'tableau' && src.index === 0;
  for (const c of cols) if (s.tableau[c].length) tries.push({ pile: 'tableau', col: c });
  if (!kingAtBase) for (const c of cols) if (!s.tableau[c].length) tries.push({ pile: 'tableau', col: c });
  for (const d of tries) {
    const state = move(s, src, d);
    if (state) return { state, dest: d };
  }
  return null;
}

export const isWon = (s: GameState) => s.foundations.every((p) => p.length === 13);
