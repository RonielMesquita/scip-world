export const Colors = {
  // ── Backgrounds
  bgDeep: '#04080F',      // fundo principal — quase preto
  bgMid: '#070D1A',       // fundo secundário
  bgCard: '#0B1C3D',      // cards — azul profundo
  bgCardAlt: '#0F2A5A',   // cards elevados — azul médio
  bgOverlay: 'rgba(4, 8, 15, 0.92)',
  bgGlass: 'rgba(255, 255, 255, 0.04)',
  bgGlassBorder: 'rgba(255, 255, 255, 0.08)',

  // ── Electric blue / neon (linhas, ícones, conexões)
  blue: '#1E90FF',
  blueBright: '#3FA9F5',
  cyan: '#4CC9F0',
  blueMuted: 'rgba(30, 144, 255, 0.15)',
  cyanMuted: 'rgba(76, 201, 240, 0.12)',

  // ── Purple / premium (logo, gradientes principais)
  purple: '#7B61FF',
  purpleMid: '#9D4EDD',
  purpleDark: '#5A4FCF',
  purpleMuted: 'rgba(123, 97, 255, 0.12)',

  // ── Urban light (globo, cidades — detalhe humanizador)
  gold: '#FFD166',
  amber: '#FFB703',

  // ── Panel / material tones
  concrete: '#B0B0B0',
  concreteDark: '#8D8D8D',
  eps: '#F2F2F2',
  mesh: '#2F2F2F',

  // ── Orange (mantido apenas para badges / CTAs externos)
  orange: '#FF6B00',
  orangeDark: '#E55A00',
  orangeGlow: 'rgba(255, 107, 0, 0.3)',
  orangeMuted: 'rgba(255, 107, 0, 0.12)',

  // ── Text
  white: '#FFFFFF',
  textMuted: '#A0AEC0',
  textDim: '#D1D5DB',
  textFaded: '#6B7A99',

  // ── Status
  success: '#00C48C',
  warning: '#FFB703',
  error: '#FF4D4D',

  // ── Misc
  star: '#FFD166',
  verified: '#1E90FF',
  premium: '#7B61FF',

  // ── Gradients
  gradients: {
    background: ['#04080F', '#070D1A'] as [string, string],
    backgroundDeep: ['#04080F', '#06101E', '#070D1A'] as readonly [string, string, string],

    // Login / auth principal
    premium: ['#7B61FF', '#9D4EDD'] as [string, string],
    premiumDeep: ['#5A4FCF', '#7B61FF'] as [string, string],

    // Azul neon (conexões, botões secundários)
    blue: ['#1E90FF', '#3FA9F5'] as [string, string],
    cyan: ['#4CC9F0', '#1E90FF'] as [string, string],

    // Tech (azul → roxo — usado no tab center, logo)
    tech: ['#1E90FF', '#7B61FF'] as [string, string],

    // Subtis
    blueSubtle: ['rgba(30,144,255,0.15)', 'rgba(63,169,245,0.05)'] as [string, string],
    purpleSubtle: ['rgba(123,97,255,0.15)', 'rgba(157,78,221,0.05)'] as [string, string],

    // Legados (outros ecrãs)
    orange: ['#FF6B00', '#E55A00'] as [string, string],
    orangeSubtle: ['rgba(255,107,0,0.15)', 'rgba(229,90,0,0.05)'] as [string, string],
    purple: ['#7B61FF', '#5A4FCF'] as [string, string],

    heroOverlay: ['rgba(9,20,43,0.85)', 'rgba(9,20,43,0.1)'] as [string, string],
    cardOverlay: ['transparent', 'rgba(9,20,43,0.92)'] as [string, string],
    dark: ['#070D1A', '#04080F'] as [string, string],
  },
};

export default Colors;
