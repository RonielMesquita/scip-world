import React from 'react';
import Svg, { Circle, Ellipse, G } from 'react-native-svg';

interface Props {
  size?: number;
  cyan?: string;
  purple?: string;
}

export default function GlobeNeonIcon({
  size = 54,
  cyan = '#4CC9F0',
  purple = '#7B61FF',
}: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.38;
  const s = 1.4;  // espessura principal
  const gs = 5;   // espessura do glow
  const go = 0.14; // opacidade do glow

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* ── Camada de glow (linhas grossas + transparentes) ── */}
      <G opacity={go}>
        <Circle cx={cx} cy={cy} r={R} stroke={cyan}   strokeWidth={gs * 2}   fill="none" />
        <Ellipse cx={cx} cy={cy}           rx={R}        ry={R * 0.30} stroke={cyan}   strokeWidth={gs}       fill="none" />
        <Ellipse cx={cx} cy={cy - R * 0.52} rx={R * 0.86} ry={R * 0.20} stroke={purple} strokeWidth={gs * 0.8} fill="none" />
        <Ellipse cx={cx} cy={cy + R * 0.52} rx={R * 0.86} ry={R * 0.20} stroke={purple} strokeWidth={gs * 0.8} fill="none" />
        <Ellipse cx={cx} cy={cy}           rx={R * 0.30} ry={R}        stroke={cyan}   strokeWidth={gs}       fill="none" />
        <Ellipse cx={cx} cy={cy}           rx={R * 0.68} ry={R}        stroke={purple} strokeWidth={gs * 0.8} fill="none" />
      </G>

      {/* ── Camada principal (linhas finas neon) ── */}
      {/* Círculo externo */}
      <Circle cx={cx} cy={cy} r={R} stroke={cyan} strokeWidth={s} fill="none" />
      {/* Equador */}
      <Ellipse cx={cx} cy={cy}           rx={R}        ry={R * 0.30} stroke={cyan}   strokeWidth={s}        fill="none" opacity={0.95} />
      {/* Paralelo norte */}
      <Ellipse cx={cx} cy={cy - R * 0.52} rx={R * 0.86} ry={R * 0.20} stroke={purple} strokeWidth={s * 0.85} fill="none" opacity={0.75} />
      {/* Paralelo sul */}
      <Ellipse cx={cx} cy={cy + R * 0.52} rx={R * 0.86} ry={R * 0.20} stroke={purple} strokeWidth={s * 0.85} fill="none" opacity={0.75} />
      {/* Meridiano central */}
      <Ellipse cx={cx} cy={cy}           rx={R * 0.30} ry={R}        stroke={cyan}   strokeWidth={s}        fill="none" opacity={0.90} />
      {/* Meridiano lateral */}
      <Ellipse cx={cx} cy={cy}           rx={R * 0.68} ry={R}        stroke={purple} strokeWidth={s * 0.85} fill="none" opacity={0.65} />
    </Svg>
  );
}
