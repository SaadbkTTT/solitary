import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, isRed, rankLabel } from '../game/klondike';
import { WitchHatArt } from './Art';

interface Props {
  card?: Card;
  w: number;
  h: number;
  onPress?: () => void;
  placeholder?: string;
}

export function CardView({ card, w, h, onPress, placeholder }: Props) {
  if (!card) {
    return (
      <Pressable onPress={onPress} style={[styles.slot, { width: w, height: h }]}>
        {placeholder ? <Text style={[styles.slotText, { fontSize: w * 0.4 }]}>{placeholder}</Text> : null}
      </Pressable>
    );
  }
  if (!card.faceUp) {
    return (
      <Pressable onPress={onPress} style={[styles.card, styles.back, { width: w, height: h }]}>
        <WitchHatArt size={w * 0.7} />
      </Pressable>
    );
  }
  const color = isRed(card.suit) ? '#c0392b' : '#1b1028';
  const fs = Math.max(11, w * 0.3);
  return (
    <Pressable onPress={onPress} style={[styles.card, styles.face, { width: w, height: h }]}>
      <View style={styles.corner}>
        <Text style={[styles.rank, { color, fontSize: fs }]}>{rankLabel(card.rank)}</Text>
        <Text style={{ color, fontSize: fs * 0.85, lineHeight: fs }}>{card.suit}</Text>
      </View>
      <Text style={[styles.center, { color, fontSize: w * 0.5 }]}>{card.suit}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  face: { backgroundColor: '#fbf6ea', borderColor: '#cdbfa0' },
  back: { backgroundColor: '#6b3fa0', borderColor: '#f2c94c', alignItems: 'center', justifyContent: 'center' },
  corner: { position: 'absolute', top: 2, left: 4, alignItems: 'center' },
  rank: { fontWeight: '800' },
  center: { position: 'absolute', bottom: 2, right: 4, opacity: 0.85 },
  slot: {
    borderRadius: 6,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(242,201,76,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: { color: 'rgba(242,201,76,0.45)' },
});
