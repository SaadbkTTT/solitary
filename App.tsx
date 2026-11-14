import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardView } from './src/components/CardView';
import { BlackCat, Dragon, FloatingHats, HatRain } from './src/components/Critters';
import { autoMove, draw, GameState, isWon, newGame, Source, SUITS } from './src/game/klondike';

const PAD = 8;
const GAP = 5;

function Game() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [game, setGame] = useState<GameState>(() => newGame());
  const [history, setHistory] = useState<GameState[]>([]);
  const [catJump, setCatJump] = useState(0);
  const [dragonFire, setDragonFire] = useState(0);
  const [hatRain, setHatRain] = useState(0);
  const won = isWon(game);

  const boardW = Math.min(width, 700);
  const cw = Math.floor((boardW - PAD * 2 - GAP * 6) / 7);
  const ch = Math.floor(cw * 1.4);

  const commit = useCallback(
    (next: GameState) => {
      setHistory((h) => [...h.slice(-99), game]);
      setGame(next);
    },
    [game],
  );

  const tap = (src: Source) => {
    const r = autoMove(game, src);
    if (!r) return;
    commit(r.state);
    if (r.dest.pile === 'foundation') {
      setCatJump((n) => n + 1);
      const pile = r.state.foundations[r.dest.idx];
      if (isWon(r.state)) {
        setDragonFire((n) => n + 1);
        setHatRain((n) => n + 1);
      } else if (pile.length === 13) {
        setDragonFire((n) => n + 1); // a whole suit completed
      }
    }
  };

  const restart = () => {
    setHistory([]);
    setGame(newGame());
    setHatRain(0);
  };

  const undo = () => {
    if (!history.length) return;
    setGame(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  // Tableau: shrink fan offsets so the longest column always fits.
  const tableauH = height - insets.top - insets.bottom - 60 - ch - 24 - 64;
  const offsets = (col: GameState['tableau'][number]) => {
    let down = ch * 0.16;
    let up = ch * 0.3;
    const needed = col.reduce((s, c, i) => (i === col.length - 1 ? s : s + (c.faceUp ? up : down)), ch);
    if (needed > tableauH) {
      const k = (tableauH - ch) / (needed - ch);
      down *= k;
      up *= k;
    }
    let y = 0;
    return col.map((c) => {
      const cur = y;
      y += c.faceUp ? up : down;
      return cur;
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />
      <FloatingHats width={width} height={height} />

      <View style={styles.header}>
        <Text style={styles.title}>Witchy Solitaire</Text>
        <Text style={styles.moves}>Moves {game.moves}</Text>
        <Pressable onPress={undo} style={styles.btn}>
          <Text style={styles.btnText}>Undo</Text>
        </Pressable>
        <Pressable onPress={restart} style={styles.btn}>
          <Text style={styles.btnText}>New</Text>
        </Pressable>
      </View>

      <View style={[styles.board, { width: boardW }]}>
        <View style={[styles.row, { gap: GAP }]}>
          <CardView
            w={cw}
            h={ch}
            card={game.stock.length ? game.stock[game.stock.length - 1] : undefined}
            placeholder="↻"
            onPress={() => commit(draw(game))}
          />
          <CardView
            w={cw}
            h={ch}
            card={game.waste[game.waste.length - 1]}
            onPress={() => tap({ pile: 'waste' })}
          />
          <View style={{ width: cw }} />
          {game.foundations.map((p, i) => (
            <CardView
              key={i}
              w={cw}
              h={ch}
              card={p[p.length - 1]}
              placeholder={SUITS[i]}
              onPress={() => tap({ pile: 'foundation', idx: i })}
            />
          ))}
        </View>

        <View style={[styles.row, { gap: GAP, marginTop: 14, flex: 1 }]}>
          {game.tableau.map((col, c) => {
            const ys = offsets(col);
            return (
              <View key={c} style={{ width: cw }}>
                {col.length === 0 ? <CardView w={cw} h={ch} placeholder="K" /> : null}
                {col.map((card, i) => (
                  <View key={card.id} style={{ position: 'absolute', top: ys[i] }}>
                    <CardView w={cw} h={ch} card={card} onPress={() => tap({ pile: 'tableau', col: c, index: i })} />
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </View>

      <BlackCat width={width} jump={catJump} />
      <Dragon width={width} top={insets.top + 40} fire={dragonFire} />
      <HatRain width={width} height={height} trigger={hatRain} />

      {won ? (
        <View style={styles.winBox}>
          <Text style={styles.winTitle}>The coven is pleased!</Text>
          <Text style={styles.winSub}>Solved in {game.moves} moves</Text>
          <Pressable onPress={restart} style={[styles.btn, { marginTop: 12 }]}>
            <Text style={styles.btnText}>Deal again</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Game />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1a0f2e', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: PAD, height: 52, alignSelf: 'stretch' },
  title: { color: '#f2c94c', fontSize: 20, fontWeight: '800', flex: 1 },
  moves: { color: '#d9c8f0', fontSize: 13 },
  btn: { backgroundColor: '#6b3fa0', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '700' },
  board: { flex: 1, paddingHorizontal: PAD, paddingTop: 8 },
  row: { flexDirection: 'row' },
  winBox: {
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
    backgroundColor: 'rgba(26,15,46,0.95)',
    borderColor: '#f2c94c',
    borderWidth: 2,
    borderRadius: 14,
    padding: 22,
    alignItems: 'center',
  },
  winTitle: { color: '#f2c94c', fontSize: 22, fontWeight: '800' },
  winSub: { color: '#d9c8f0', marginTop: 6 },
});
