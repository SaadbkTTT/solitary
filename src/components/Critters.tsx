// Animated characters. Each reacts to a "trigger" counter: when it changes, the effect plays.
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { CatArt, DragonBodyArt, DragonWingArt, WitchHatArt } from './Art';

const native = true;

/** Black cat that strolls back and forth along the bottom and jumps when triggered. */
export function BlackCat({ width, jump }: { width: number; jump: number }) {
  const walk = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const hop = useRef(new Animated.Value(0)).current;
  const catW = 72;

  useEffect(() => {
    const a = Animated.loop(
      Animated.timing(walk, { toValue: 2, duration: 16000, easing: Easing.linear, useNativeDriver: native }),
    );
    const b = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 220, useNativeDriver: native }),
        Animated.timing(bob, { toValue: 0, duration: 220, useNativeDriver: native }),
      ]),
    );
    a.start();
    b.start();
    return () => {
      a.stop();
      b.stop();
    };
  }, [walk, bob]);

  useEffect(() => {
    if (!jump) return;
    hop.setValue(0);
    Animated.sequence([
      Animated.timing(hop, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: native }),
      Animated.spring(hop, { toValue: 0, friction: 4, useNativeDriver: native }),
    ]).start();
  }, [jump, hop]);

  const translateX = walk.interpolate({ inputRange: [0, 1, 2], outputRange: [0, width - catW, 0] });
  const scaleX = walk.interpolate({ inputRange: [0, 0.999, 1, 1.999, 2], outputRange: [1, 1, -1, -1, 1] });
  const translateY = Animated.add(
    bob.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }),
    hop.interpolate({ inputRange: [0, 1], outputRange: [0, -60] }),
  );
  const rotate = hop.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-15deg'] });

  return (
    <View pointerEvents="none" style={{ height: 60, width }}>
      <Animated.View style={{ position: 'absolute', bottom: 4, transform: [{ translateX }, { translateY }, { scaleX }, { rotate }] }}>
        <CatArt size={catW} />
      </Animated.View>
    </View>
  );
}

/** Dragon that flies across the screen now and then, and breathes fire when triggered. */
export function Dragon({ width, top, fire }: { width: number; top: number; fire: number }) {
  const fly = useRef(new Animated.Value(0)).current;
  const flap = useRef(new Animated.Value(0)).current;
  const flame = useRef(new Animated.Value(0)).current;
  const busy = useRef(false);
  const dW = 130;

  const pass = (breathe: boolean) => {
    if (busy.current) return;
    busy.current = true;
    fly.setValue(0);
    flame.setValue(0);
    Animated.parallel([
      Animated.timing(fly, { toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: native }),
      breathe
        ? Animated.sequence([
            Animated.delay(2200),
            Animated.timing(flame, { toValue: 1, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: native }),
          ])
        : Animated.delay(0),
    ]).start(() => {
      busy.current = false;
      flame.setValue(0);
    });
  };

  useEffect(() => {
    const f = Animated.loop(
      Animated.sequence([
        Animated.timing(flap, { toValue: 1, duration: 260, useNativeDriver: native }),
        Animated.timing(flap, { toValue: 0, duration: 260, useNativeDriver: native }),
      ]),
    );
    f.start();
    pass(false);
    const t = setInterval(() => pass(false), 25000);
    return () => {
      f.stop();
      clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fire) return;
    busy.current = false;
    pass(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fire]);

  const translateX = fly.interpolate({ inputRange: [0, 1], outputRange: [-dW - 40, width + 40] });
  const translateY = fly.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, -14, 0, 14, 0] });
  const wing = flap.interpolate({ inputRange: [0, 1], outputRange: [1, -0.6] });

  const puffs = [0, 1, 2, 3, 4, 5];
  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', top, left: 0, transform: [{ translateX }, { translateY }] }}>
      <DragonBodyArt width={dW} />
      <Animated.View style={{ position: 'absolute', left: dW * 0.33, top: dW * 0.02, transform: [{ scaleY: wing }] }}>
        <DragonWingArt width={dW * 0.5} />
      </Animated.View>
      {puffs.map((i) => {
        const dist = 24 + i * 22;
        return (
          <Animated.View
            key={i}
            style={[
              styles.puff,
              {
                left: dW - 6,
                top: dW * 0.18,
                width: 16 + i * 6,
                height: 16 + i * 6,
                backgroundColor: ['#fff3a0', '#ffd23f', '#ffa62b', '#ff7b25', '#f0542a', '#c2281f'][i],
                opacity: flame.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0, 0.95, 0.7, 0] }),
                transform: [
                  { translateX: flame.interpolate({ inputRange: [0, 1], outputRange: [0, dist] }) },
                  { translateY: flame.interpolate({ inputRange: [0, 1], outputRange: [0, (i % 2 ? 1 : -1) * i * 3] }) },
                  { scale: flame.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.2, 1, 1.4] }) },
                ],
              },
            ]}
          />
        );
      })}
    </Animated.View>
  );
}

/** Faint witch hats drifting in the background. */
export function FloatingHats({ width, height }: { width: number; height: number }) {
  const hats = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        x: ((i * 0.61) % 1) * (width - 50),
        y: ((i * 0.37 + 0.1) % 1) * (height - 80),
        size: 36 + (i % 3) * 14,
        v: new Animated.Value(0),
        dur: 3000 + i * 450,
      })),
    [width, height],
  );
  useEffect(() => {
    const loops = hats.map((h) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(h.v, { toValue: 1, duration: h.dur, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
          Animated.timing(h.v, { toValue: 0, duration: h.dur, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [hats]);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {hats.map((h, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: h.x,
            top: h.y,
            opacity: 0.22,
            transform: [
              { translateY: h.v.interpolate({ inputRange: [0, 1], outputRange: [0, -18] }) },
              { rotate: h.v.interpolate({ inputRange: [0, 1], outputRange: ['-10deg', '10deg'] }) },
            ],
          }}
        >
          <WitchHatArt size={h.size} />
        </Animated.View>
      ))}
    </View>
  );
}

/** A shower of spinning witch hats (used on win / king completed). */
export function HatRain({ width, height, trigger }: { width: number; height: number; trigger: number }) {
  const drops = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        x: ((i * 0.43 + 0.05) % 1) * (width - 40),
        delay: (i % 8) * 140,
        spin: i % 2 ? 1 : -1,
        v: new Animated.Value(0),
      })),
    [width],
  );
  useEffect(() => {
    if (!trigger) return;
    drops.forEach((d) => d.v.setValue(0));
    Animated.parallel(
      drops.map((d) =>
        Animated.sequence([
          Animated.delay(d.delay),
          Animated.timing(d.v, { toValue: 1, duration: 2600, easing: Easing.in(Easing.quad), useNativeDriver: native }),
        ]),
      ),
    ).start();
  }, [trigger, drops]);
  if (!trigger) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {drops.map((d, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: d.x,
            top: -60,
            opacity: d.v.interpolate({ inputRange: [0, 0.05, 0.9, 1], outputRange: [0, 1, 1, 0] }),
            transform: [
              { translateY: d.v.interpolate({ inputRange: [0, 1], outputRange: [0, height + 60] }) },
              { rotate: d.v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${d.spin * 540}deg`] }) },
            ],
          }}
        >
          <WitchHatArt size={40} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  puff: { position: 'absolute', borderRadius: 999 },
});
