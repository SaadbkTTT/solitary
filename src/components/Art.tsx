// Vector art for the spooky crew: witch hat, black cat, dragon.
import Svg, { Circle, Ellipse, Path, Polygon, Rect } from 'react-native-svg';

export function WitchHatArt({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Ellipse cx={50} cy={82} rx={46} ry={10} fill="#2b1640" />
      <Path d="M28 80 Q40 50 48 30 Q55 12 80 8 Q62 22 64 45 Q68 65 72 80 Z" fill="#43206a" />
      <Path d="M30 70 Q50 77 70 70 L72 80 Q50 87 28 80 Z" fill="#9b59d0" />
      <Rect x={44} y={71} width={11} height={10} fill="none" stroke="#f2c94c" strokeWidth={3} />
    </Svg>
  );
}

export function CatArt({ size = 80 }: { size?: number }) {
  return (
    <Svg width={size} height={size * (80 / 120)} viewBox="0 0 120 80">
      <Path d="M30 46 Q8 40 12 18 Q14 8 22 12" stroke="#0b0b0f" strokeWidth={7} fill="none" strokeLinecap="round" />
      <Ellipse cx={60} cy={48} rx={32} ry={16} fill="#0b0b0f" />
      <Rect x={36} y={56} width={7} height={20} rx={3} fill="#0b0b0f" />
      <Rect x={47} y={56} width={7} height={20} rx={3} fill="#0b0b0f" />
      <Rect x={70} y={56} width={7} height={20} rx={3} fill="#0b0b0f" />
      <Rect x={80} y={56} width={7} height={20} rx={3} fill="#0b0b0f" />
      <Circle cx={95} cy={33} r={15} fill="#0b0b0f" />
      <Polygon points="83,25 86,6 95,20" fill="#0b0b0f" />
      <Polygon points="98,20 107,6 109,27" fill="#0b0b0f" />
      <Ellipse cx={91} cy={32} rx={3} ry={4} fill="#f5d000" />
      <Ellipse cx={102} cy={32} rx={3} ry={4} fill="#f5d000" />
      <Ellipse cx={91.5} cy={32} rx={1} ry={3} fill="#0b0b0f" />
      <Ellipse cx={102.5} cy={32} rx={1} ry={3} fill="#0b0b0f" />
      <Polygon points="96,38 99,38 97.5,40" fill="#e88aa8" />
    </Svg>
  );
}

export function DragonBodyArt({ width = 160 }: { width?: number }) {
  return (
    <Svg width={width} height={width * (100 / 160)} viewBox="0 0 160 100">
      {/* tail */}
      <Path d="M50 60 Q20 70 6 52 Q20 62 40 54 Z" fill="#2e8b57" />
      <Polygon points="6,52 0,44 12,48" fill="#c0392b" />
      {/* body */}
      <Ellipse cx={75} cy={58} rx={34} ry={18} fill="#2e8b57" />
      <Ellipse cx={78} cy={64} rx={26} ry={9} fill="#a8e6a1" />
      {/* neck + head */}
      <Path d="M100 50 Q115 30 130 30 L138 40 Q118 42 108 62 Z" fill="#2e8b57" />
      <Path d="M126 24 Q146 22 156 34 Q150 42 132 42 Z" fill="#2e8b57" />
      <Polygon points="128,26 124,12 134,24" fill="#c0392b" />
      <Circle cx={140} cy={30} r={3} fill="#ffd400" />
      <Circle cx={141} cy={30} r={1.3} fill="#000" />
      <Circle cx={153} cy={35} r={1.2} fill="#0e3b22" />
      {/* legs */}
      <Rect x={60} y={70} width={8} height={14} rx={3} fill="#24704a" />
      <Rect x={86} y={70} width={8} height={14} rx={3} fill="#24704a" />
      {/* back spikes */}
      <Polygon points="58,42 64,32 70,41" fill="#c0392b" />
      <Polygon points="72,40 78,30 84,40" fill="#c0392b" />
      <Polygon points="86,41 92,32 97,43" fill="#c0392b" />
    </Svg>
  );
}

/** Wing drawn in the top half of its box so scaling around the centre pivots on the shoulder. */
export function DragonWingArt({ width = 80 }: { width?: number }) {
  return (
    <Svg width={width} height={width} viewBox="0 0 80 80">
      <Path d="M10 40 L30 2 L36 18 L48 4 L52 22 L66 10 L70 40 Z" fill="#1f6b42" />
      <Path d="M30 2 L34 40 M48 4 L50 40 M66 10 L62 40" stroke="#14492d" strokeWidth={2} />
    </Svg>
  );
}
