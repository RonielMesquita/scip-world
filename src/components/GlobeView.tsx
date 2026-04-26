import React, { useRef, useState, useEffect } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const R = 128;
const SIZE = R * 2 + 32;
const CX = SIZE / 2;
const CY = SIZE / 2;
const D = Math.PI / 180;

// City lights: [lat, lon] — real populated centers
const LIGHTS: [number, number][] = [
  // ── North America ──────────────────────────────
  [40.7, -74.0], [41.4, -72.9], [42.4, -71.1], [39.9, -75.2], [38.9, -77.0],
  [43.0, -76.1], [41.5, -81.7], [39.1, -84.5], [40.4, -79.9], [38.3, -85.8],
  [33.7, -84.4], [35.2, -80.8], [36.2, -86.8], [30.3, -81.7], [27.9, -82.5],
  [25.8, -80.2], [29.7, -95.4], [30.3, -97.7], [32.8, -96.8], [35.4, -97.5],
  [34.0, -118.2], [33.5, -117.2], [37.8, -122.4], [38.4, -121.5],
  [45.5, -122.7], [47.6, -122.3], [32.7, -117.1], [36.2, -115.2],
  [41.8, -87.6], [43.0, -89.4], [44.9, -93.2], [39.1, -94.6], [41.6, -93.6],
  [40.0, -83.0], [42.3, -83.0], [38.6, -90.2], [39.7, -104.9],
  [45.4, -75.7], [45.5, -73.6], [49.3, -123.1], [51.1, -114.1], [49.9, -97.1],
  [43.7, -79.4], [46.8, -71.2], [53.5, -113.5],
  [19.4, -99.1], [20.7, -103.4], [25.7, -100.3], [17.1, -96.7],
  // ── Europe ──────────────────────────────────────
  [51.5, -0.1], [53.5, -2.2], [55.9, -3.2], [53.8, -1.5], [52.5, -1.9],
  [52.6, -1.1], [50.8, -1.1], [51.9, -2.1],
  [48.9, 2.3], [43.3, 5.4], [43.6, 1.4], [45.7, 4.8], [44.8, -0.6],
  [51.5, 4.5], [50.9, 4.3], [52.4, 4.9], [52.1, 5.1], [51.9, 5.9],
  [52.5, 13.4], [53.6, 10.0], [51.2, 6.8], [50.9, 6.0], [48.1, 11.6],
  [50.1, 8.7], [49.5, 11.1], [51.1, 13.7], [53.1, 8.8], [54.3, 10.1],
  [41.9, 12.5], [45.5, 9.2], [45.5, 12.3], [40.8, 14.3], [38.1, 13.4], [45.1, 7.7],
  [40.4, -3.7], [41.4, 2.2], [37.4, -6.0], [39.5, -0.4], [43.3, -8.4],
  [38.0, 23.7], [41.0, 29.0], [39.9, 32.9],
  [52.2, 21.0], [50.1, 14.4], [50.1, 19.9], [47.5, 19.1], [50.5, 30.5],
  [44.8, 20.5], [44.5, 26.1], [46.8, 23.6], [48.3, 25.9],
  [59.3, 18.1], [60.4, 5.3], [55.7, 12.6], [60.2, 25.0], [63.8, 20.3],
  [48.2, 16.4], [47.4, 19.1], [47.0, 28.9],
  // ── Russia / Central Asia ────────────────────────
  [55.8, 37.6], [59.9, 30.3], [56.8, 60.6], [55.0, 82.9], [53.4, 83.8],
  [56.5, 84.9], [43.2, 76.9], [41.3, 69.3],
  // ── Middle East ─────────────────────────────────
  [35.7, 51.4], [36.3, 59.6], [33.3, 44.4], [29.9, 47.9],
  [24.7, 46.7], [21.4, 39.8], [25.3, 55.4], [26.2, 50.6],
  [23.6, 58.6], [31.8, 35.2], [33.9, 35.5], [30.1, 31.2],
  // ── India / South Asia ──────────────────────────
  [28.6, 77.2], [19.1, 72.9], [13.1, 80.3], [22.6, 88.4], [17.4, 78.5],
  [12.9, 77.6], [23.0, 72.6], [18.5, 73.9], [26.8, 80.9], [22.7, 75.9],
  [26.9, 75.8], [21.2, 81.4], [27.7, 85.3], [23.7, 90.4], [22.3, 91.8],
  [24.9, 67.0], [31.5, 74.4], [33.7, 73.1], [31.6, 74.3], [25.4, 68.4],
  // ── China / East Asia ───────────────────────────
  [31.2, 121.5], [23.1, 113.3], [22.3, 114.2], [39.9, 116.4], [30.6, 114.3],
  [32.1, 118.8], [36.1, 120.4], [26.1, 119.3], [24.5, 118.1], [22.8, 108.3],
  [34.3, 108.9], [30.7, 104.1], [36.7, 116.9], [41.8, 123.4], [43.8, 125.3],
  [28.7, 115.9], [27.1, 111.7], [25.1, 110.3], [24.1, 120.7], [25.0, 121.5],
  // ── Japan / Korea ───────────────────────────────
  [35.7, 139.7], [34.7, 135.5], [34.4, 132.5], [43.1, 141.4], [33.6, 130.4],
  [35.2, 137.0], [35.0, 135.8], [35.5, 139.3], [34.3, 134.0],
  [37.6, 127.0], [35.2, 129.1], [37.5, 126.7], [35.9, 128.6],
  // ── Southeast Asia ──────────────────────────────
  [13.8, 100.5], [3.1, 101.7], [1.3, 103.8], [10.8, 106.7], [21.0, 105.8],
  [14.6, 121.0], [12.4, 123.0], [16.9, 96.2], [6.9, 158.2],
  [-6.2, 106.8], [-7.8, 110.4], [-7.0, 107.6], [1.3, 124.8],
  // ── Africa ──────────────────────────────────────
  [36.8, 3.1], [33.9, -6.9], [34.0, -5.0], [32.9, 13.2], [36.8, 10.2],
  [9.1, 7.4], [6.5, 3.4], [5.6, -0.2], [4.0, 9.7], [12.4, -1.5],
  [-4.3, 15.3], [-4.0, 21.8], [-1.3, 36.8], [15.6, 32.5], [9.0, 38.7],
  [-25.7, 28.2], [-26.3, 27.9], [-33.9, 18.4], [-29.9, 31.0],
  // ── South America ───────────────────────────────
  [-23.5, -46.6], [-22.9, -43.2], [-20.3, -43.3], [-19.9, -44.0],
  [-15.8, -47.9], [-12.9, -38.5], [-8.1, -34.9], [-3.7, -38.6],
  [-3.1, -60.0], [-1.5, -48.5], [-5.1, -42.8],
  [-34.6, -58.4], [-31.4, -64.2], [-33.5, -70.7], [-12.0, -77.0],
  [10.5, -66.9], [4.7, -74.1], [11.0, -74.8], [6.2, -75.6],
  [-0.2, -78.5], [-0.9, -90.0],
  // ── Australia ───────────────────────────────────
  [-33.9, 151.2], [-37.8, 145.0], [-31.9, 115.9], [-27.5, 153.0],
  [-34.9, 138.6], [-35.3, 149.1], [-19.3, 146.8],
];

// Pre-compute lat/lon in radians to avoid per-frame conversions
const LIGHTS_RAD = LIGHTS.map(([lat, lon]) => [lat * D, lon * D] as [number, number]);

interface ProjectedPoint {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}

function projectLights(theta: number): ProjectedPoint[] {
  const out: ProjectedPoint[] = [];
  for (let i = 0; i < LIGHTS_RAD.length; i++) {
    const [latR, lonR] = LIGHTS_RAD[i];
    const adjLon = lonR + theta;
    const cosLat = Math.cos(latR);
    const x3 = cosLat * Math.sin(adjLon);
    const y3 = -Math.sin(latR);
    const z3 = cosLat * Math.cos(adjLon);
    if (z3 <= 0) continue;
    out.push({
      cx: CX + x3 * R,
      cy: CY + y3 * R,
      r: 0.55 + z3 * 1.1,
      opacity: Math.min(1, 0.15 + z3 * 0.85),
    });
  }
  return out;
}

interface Props {
  size?: number;
}

export default function GlobeView({ size }: Props) {
  const scale = size ? size / SIZE : 1;

  const rotRef = useRef(1.4); // start showing Americas
  const [points, setPoints] = useState<ProjectedPoint[]>(() => projectLights(rotRef.current));
  const isPanning = useRef(false);
  const lastDx = useRef(0);
  const velRef = useRef(0);
  const rafId = useRef<number>(0);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const tick = (ts: number) => {
      if (!isPanning.current) {
        const dt = Math.min((ts - (lastUpdateRef.current || ts)) / 1000, 0.05);
        if (Math.abs(velRef.current) > 0.0005) {
          velRef.current *= 0.92;
          rotRef.current += velRef.current;
        } else {
          velRef.current = 0;
          rotRef.current += dt * 0.12;
        }
        if (ts - lastUpdateRef.current >= 30) {
          setPoints(projectLights(rotRef.current));
          lastUpdateRef.current = ts;
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const pan = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      isPanning.current = true;
      velRef.current = 0;
      lastDx.current = 0;
    },
    onPanResponderMove: (_, gs) => {
      const dx = gs.dx - lastDx.current;
      lastDx.current = gs.dx;
      const delta = dx * (0.007 / (scale || 1));
      velRef.current = delta;
      rotRef.current += delta;
      setPoints(projectLights(rotRef.current));
    },
    onPanResponderRelease: () => {
      isPanning.current = false;
      lastDx.current = 0;
    },
    onPanResponderTerminate: () => {
      isPanning.current = false;
      lastDx.current = 0;
    },
  });

  return (
    <View
      {...pan.panHandlers}
      style={[styles.container, size ? { width: size, height: size } : undefined]}
    >
      <Svg width={SIZE} height={SIZE} style={scale !== 1 ? { transform: [{ scale }] } : undefined}>
        <Defs>
          {/* Sphere base gradient — dark navy with faint lit area top-left */}
          <RadialGradient id="sphereBg" cx="40%" cy="35%" r="65%">
            <Stop offset="0%" stopColor="#0E1E42" stopOpacity="1" />
            <Stop offset="45%" stopColor="#070F22" stopOpacity="1" />
            <Stop offset="100%" stopColor="#010408" stopOpacity="1" />
          </RadialGradient>
          {/* Atmosphere glow — blue ring at the limb */}
          <RadialGradient id="atmo" cx="50%" cy="50%" r="50%">
            <Stop offset="72%" stopColor="#1A4080" stopOpacity="0" />
            <Stop offset="88%" stopColor="#2255B0" stopOpacity="0.22" />
            <Stop offset="100%" stopColor="#4488FF" stopOpacity="0.45" />
          </RadialGradient>
          {/* Limb darkening — edges of sphere get darker */}
          <RadialGradient id="limb" cx="50%" cy="50%" r="50%">
            <Stop offset="55%" stopColor="#000000" stopOpacity="0" />
            <Stop offset="80%" stopColor="#000000" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0.72" />
          </RadialGradient>
          {/* Subtle specular highlight top-left */}
          <RadialGradient id="spec" cx="34%" cy="30%" r="35%">
            <Stop offset="0%" stopColor="#5080C8" stopOpacity="0.18" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Outer atmosphere ring */}
        <Circle cx={CX} cy={CY} r={R + 14} fill="url(#atmo)" />

        {/* Globe surface */}
        <Circle cx={CX} cy={CY} r={R} fill="url(#sphereBg)" />

        {/* City lights */}
        {points.map((p, i) => (
          <Circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill="#FFD580"
            opacity={p.opacity}
          />
        ))}

        {/* Specular highlight */}
        <Circle cx={CX} cy={CY} r={R} fill="url(#spec)" />

        {/* Limb darkening overlay */}
        <Circle cx={CX} cy={CY} r={R} fill="url(#limb)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
