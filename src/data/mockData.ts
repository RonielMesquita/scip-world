// ─── PROJECTS ───────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  location: string;
  size: string;
  image: string;
  type: string;
}

export const FEATURED_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Residência Villagio',
    location: 'São Paulo, SP',
    size: '320 m²',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=520&q=80',
    type: 'Residencial',
  },
  {
    id: 'p2',
    title: 'Edifício Horizon',
    location: 'Rio de Janeiro, RJ',
    size: '1.200 m²',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=520&q=80',
    type: 'Comercial',
  },
  {
    id: 'p3',
    title: 'Casa Vale Verde',
    location: 'Curitiba, PR',
    size: '480 m²',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=520&q=80',
    type: 'Residencial',
  },
  {
    id: 'p4',
    title: 'Torre Alfa Business',
    location: 'Brasília, DF',
    size: '2.800 m²',
    image: 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b9?w=520&q=80',
    type: 'Corporativo',
  },
  {
    id: 'p5',
    title: 'Condomínio Paradiso',
    location: 'Florianópolis, SC',
    size: '650 m²',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=520&q=80',
    type: 'Residencial',
  },
];

// ─── COMPANIES ──────────────────────────────────────────────────────────────
export interface Company {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
  category: string;
  services: string[];
  description: string;
  coverImage: string;
  logoColor: string;
  logoInitial: string;
  phone: string;
  yearsExperience?: string;
  certifications?: string[];
}

export const COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'EcoBuild',
    rating: 4.9,
    reviewCount: 128,
    location: 'São Paulo, SP',
    verified: true,
    category: 'Construção',
    services: ['Alvenaria SCIP', 'Projetos Sustentáveis', 'Reforma'],
    description:
      'Especialistas em construção sustentável com tecnologia SCIP. Mais de 15 anos entregando obras de alto padrão com foco em eficiência e inovação.',
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    logoColor: '#00C48C',
    logoInitial: 'E',
    phone: '+5511999990001',
  },
  {
    id: 'c2',
    name: 'FIXA Systems',
    rating: 4.8,
    reviewCount: 94,
    location: 'Rio de Janeiro, RJ',
    verified: true,
    category: 'Engenharia',
    services: ['Engenharia Estrutural', 'Laudos Técnicos', 'Consultoria'],
    description:
      'Engenharia de alta precisão com soluções inovadoras para construção civil. Nosso time é formado por engenheiros seniores com expertise em painéis SCIP.',
    coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    logoColor: '#2F6BFF',
    logoInitial: 'F',
    phone: '+5521999990002',
  },
  {
    id: 'c3',
    name: 'ArquiPro',
    rating: 4.7,
    reviewCount: 76,
    location: 'Curitiba, PR',
    verified: true,
    category: 'Engenharia',
    services: ['Arquitetura', 'Design de Interiores', 'Projetos 3D'],
    description:
      'Studio de arquitetura premium especializado em residências de alto padrão. Integramos tecnologia SCIP desde a fase de projeto para máxima eficiência.',
    coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    logoColor: '#FF7A00',
    logoInitial: 'A',
    phone: '+5541999990003',
  },
  {
    id: 'c4',
    name: 'PainelTech',
    rating: 4.6,
    reviewCount: 52,
    location: 'Belo Horizonte, MG',
    verified: false,
    category: 'Fábrica',
    services: ['Fabricação de Painéis', 'Corte CNC', 'Entrega Nacional'],
    description:
      'Fábrica líder em produção de painéis SCIP com tecnologia CNC. Atendemos construtoras e autônomos em todo o Brasil com qualidade certificada.',
    coverImage: 'https://images.unsplash.com/photo-1565031491910-e57fac031c41?w=800&q=80',
    logoColor: '#A0A8B8',
    logoInitial: 'P',
    phone: '+5531999990004',
  },
  {
    id: 'c5',
    name: 'ConstrUP',
    rating: 4.5,
    reviewCount: 41,
    location: 'Brasília, DF',
    verified: false,
    category: 'Construção',
    services: ['Obra Residencial', 'Obra Comercial', 'SCIP Avançado'],
    description:
      'Construtora moderna com foco em velocidade e qualidade. Reduzimos o tempo de obra em até 60% com o sistema SCIP sem abrir mão do acabamento premium.',
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    logoColor: '#FF4D4D',
    logoInitial: 'C',
    phone: '+5561999990005',
  },
];

// ─── BRANDS ─────────────────────────────────────────────────────────────────
export interface Brand {
  id: string;
  name: string;
  color: string;
  tagline: string;
}

export const BRANDS: Brand[] = [
  { id: 'b1', name: 'DeWalt', color: '#FFB800', tagline: 'Ferramentas Premium' },
  { id: 'b2', name: 'Bosch', color: '#2F6BFF', tagline: 'Inovação Alemã' },
  { id: 'b3', name: 'Makita', color: '#00C48C', tagline: 'Potência e Durabilidade' },
  { id: 'b4', name: 'Vonder', color: '#FF7A00', tagline: 'Qualidade Nacional' },
  { id: 'b5', name: 'Tramontina', color: '#A0A8B8', tagline: 'Tradição Brasileira' },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'f1',
    question: 'Quais as vantagens do SCIP?',
    answer:
      'O SCIP (Sistema Construtivo Inovador de Placas) oferece construção até 60% mais rápida, peso até 5x menor que alvenaria convencional, excelente isolamento térmico e acústico, alta resistência estrutural e sustentabilidade comprovada. Ideal para obras residenciais, comerciais e industriais.',
  },
  {
    id: 'f2',
    question: 'Quanto tempo leva uma construção com SCIP?',
    answer:
      'Uma residência de 100m² pode ser concluída em apenas 45 a 60 dias com o sistema SCIP, contra 4 a 6 meses da alvenaria convencional. O tempo de obra reduzido significa menos custos com mão de obra e retorno mais rápido do investimento.',
  },
  {
    id: 'f3',
    question: 'Quais os principais materiais usados?',
    answer:
      'O sistema SCIP utiliza painéis de EPS (poliestireno expandido) com malha de aço eletrossoldada, revestidos com argamassa projetada. Os materiais são leves, duráveis e sustentáveis, com alto desempenho térmico e acústico.',
  },
  {
    id: 'f4',
    question: 'O SCIP é aprovado por engenheiros?',
    answer:
      'Sim. O SCIP possui aprovação técnica em conformidade com as normas ABNT, laudos estruturais e certificações internacionais. Milhares de engenheiros e arquitetos já especificam o sistema em seus projetos em todo o Brasil.',
  },
  {
    id: 'f5',
    question: 'Como obter um orçamento?',
    answer:
      'Você pode usar nossa Calculadora SCIP para uma estimativa instantânea, ou entrar em contato diretamente com uma das empresas parceiras cadastradas na plataforma. O processo é simples e você recebe uma resposta em até 24 horas.',
  },
];

// ─── COURSES ─────────────────────────────────────────────────────────────────
export interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  price: number | null;
  isPremium: boolean;
  progress?: number;
  thumbnail: string;
  category: string;
  rating: number;
  students: number;
}

export const COURSES: Course[] = [
  {
    id: 'cr1',
    title: 'Fundamentos do Sistema SCIP',
    instructor: 'Eng. Ricardo Alves',
    duration: '4h 30min',
    price: null,
    isPremium: false,
    progress: 65,
    thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
    category: 'Introdução',
    rating: 4.8,
    students: 2847,
  },
  {
    id: 'cr2',
    title: 'Projetos Estruturais com SCIP',
    instructor: 'Arq. Fernanda Costa',
    duration: '8h 15min',
    price: 197,
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80',
    category: 'Estrutural',
    rating: 4.9,
    students: 1203,
  },
  {
    id: 'cr3',
    title: 'Orçamento e Gestão de Obras',
    instructor: 'Eng. Marcos Silva',
    duration: '6h 00min',
    price: 147,
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    category: 'Gestão',
    rating: 4.7,
    students: 891,
  },
  {
    id: 'cr4',
    title: 'Instalações Elétricas em SCIP',
    instructor: 'Téc. Paulo Mendes',
    duration: '3h 45min',
    price: 97,
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1565031491910-e57fac031c41?w=400&q=80',
    category: 'Instalações',
    rating: 4.6,
    students: 634,
  },
  {
    id: 'cr5',
    title: 'Acabamentos e Revestimentos Premium',
    instructor: 'Arq. Ana Luiza Rocha',
    duration: '5h 20min',
    price: 127,
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
    category: 'Acabamentos',
    rating: 4.8,
    students: 1056,
  },
];

// ─── VIDEO LESSONS ────────────────────────────────────────────────────────────
export interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  views: string;
}

export const VIDEO_LESSONS: VideoLesson[] = [
  {
    id: 'v1',
    title: 'Como Montar um Painel SCIP Passo a Passo',
    duration: '18:42',
    thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
    views: '12.4k',
  },
  {
    id: 'v2',
    title: 'Fundações Superficiais para Construção SCIP',
    duration: '24:15',
    thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80',
    views: '8.7k',
  },
  {
    id: 'v3',
    title: 'Cobertura e Telhado em Sistema SCIP',
    duration: '31:08',
    thumbnail: 'https://images.unsplash.com/photo-1565031491910-e57fac031c41?w=400&q=80',
    views: '6.2k',
  },
];

// ─── NETFLIX CATEGORIES ───────────────────────────────────────────────────────
export interface NetflixVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  views: string;
  isPremium?: boolean;
  progress?: number;
  tag?: string;
  youtubeId?: string;
}

export interface NetflixCategory {
  id: string;
  emoji: string;
  title: string;
  videos: NetflixVideo[];
}

export const PROJECT_OF_MONTH = {
  title: 'O Que Você Não Sabe Sobre Casa de EPS',
  subtitle: 'Tudo sobre a construção com painéis EPS/SCIP',
  description: 'Descubra os segredos da construção com painéis de EPS: resistência, economia, velocidade e sustentabilidade em um só sistema. O vídeo que está mudando a forma de construir no Brasil.',
  thumbnail: `https://img.youtube.com/vi/aJjngghQvJ8/maxresdefault.jpg`,
  duration: '–',
  rating: 4.9,
  tags: ['EPS', 'SCIP', 'Inovação'],
  youtubeId: 'aJjngghQvJ8',
};

export const NETFLIX_CATEGORIES: NetflixCategory[] = [
  {
    id: 'destaque',
    emoji: '🎬',
    title: 'Vídeos em Destaque',
    videos: [
      { id: 'yt1', title: 'O Que Você Não Sabe Sobre Casa de EPS', duration: '–', thumbnail: 'https://img.youtube.com/vi/aJjngghQvJ8/hqdefault.jpg', views: 'YouTube', tag: 'EPS Brasil', youtubeId: 'aJjngghQvJ8' },
      { id: 'yt2', title: 'Hitech House — Construção EPS ao Vivo', duration: '–', thumbnail: 'https://img.youtube.com/vi/6bOxsducYEk/hqdefault.jpg', views: 'YouTube', tag: 'Hitech House', youtubeId: '6bOxsducYEk' },
      { id: 'yt3', title: 'SCIP — A Solução Sustentável para sua Obra', duration: '–', thumbnail: 'https://img.youtube.com/vi/t-yAkZm8ShA/hqdefault.jpg', views: 'YouTube', tag: 'Sustentável', youtubeId: 't-yAkZm8ShA' },
      { id: 'yt4', title: 'Construindo Casa com Painéis de Poliestireno', duration: '–', thumbnail: 'https://img.youtube.com/vi/F6iR8coludI/hqdefault.jpg', views: 'YouTube', tag: 'México', youtubeId: 'F6iR8coludI' },
      { id: 'yt5', title: 'SCIP Panels — Resistência ao Fogo e Furacões', duration: '–', thumbnail: 'https://img.youtube.com/vi/9yd9U32ma8A/hqdefault.jpg', views: 'YouTube', tag: 'Short', youtubeId: '9yd9U32ma8A' },
      { id: 'yt6', title: 'Proteja sua Família com Casa SCIP', duration: '–', thumbnail: 'https://img.youtube.com/vi/hHiwsVBftvA/hqdefault.jpg', views: 'YouTube', tag: 'Segurança', youtubeId: 'hHiwsVBftvA' },
      { id: 'yt7', title: 'Extreme SIPs — Casa 1.400 ft² em Birmingham', duration: '–', thumbnail: 'https://img.youtube.com/vi/U-CQNraKTjA/hqdefault.jpg', views: 'YouTube', tag: 'SIP EUA', youtubeId: 'U-CQNraKTjA' },
      { id: 'yt8', title: 'ADU em 1 Hora com Painéis SIP', duration: '–', thumbnail: 'https://img.youtube.com/vi/BYUa_Xgf8lY/hqdefault.jpg', views: 'YouTube', tag: 'Speed Build', youtubeId: 'BYUa_Xgf8lY' },
    ],
  },
  {
    id: 'desastres',
    emoji: '🌪️',
    title: 'SCIP vs Desastres Naturais',
    videos: [
      { id: 'd1', title: 'SCIP vs Furacão Categoria 5', duration: '22:14', thumbnail: 'https://img.youtube.com/vi/aJjngghQvJ8/hqdefault.jpg', views: '18.2k', tag: 'Resistência', youtubeId: 'aJjngghQvJ8' },
      { id: 'd2', title: 'Terremoto Grau 7 — SCIP Sobrevive', duration: '15:38', thumbnail: 'https://img.youtube.com/vi/U-CQNraKTjA/hqdefault.jpg', views: '14.5k', tag: 'Teste Real', youtubeId: 'U-CQNraKTjA' },
      { id: 'd3', title: 'Inundação: SCIP vs Alvenaria', duration: '19:02', thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80', views: '9.8k', tag: 'Comparativo', youtubeId: 'aJjngghQvJ8' },
      { id: 'd4', title: 'Incêndio: Classificação A1 em Ação', duration: '11:45', thumbnail: 'https://images.unsplash.com/photo-1565031491910-e57fac031c41?w=400&q=80', views: '7.3k', tag: 'Segurança', youtubeId: 'aJjngghQvJ8' },
    ],
  },
  {
    id: 'modelagem',
    emoji: '🧊',
    title: 'Projetos 3D SCIP',
    videos: [
      { id: 'm1', title: 'Cox Residence SCIP — Panel Layout 3D', duration: '–', thumbnail: 'https://img.youtube.com/vi/3q0TnF5ohLQ/hqdefault.jpg', views: 'YouTube', tag: '3D SCIP', youtubeId: '3q0TnF5ohLQ' },
      { id: 'm2', title: "Belwin' LLC Panel Take-off #02", duration: '–', thumbnail: 'https://img.youtube.com/vi/3Bm8oi5U3y8/hqdefault.jpg', views: 'YouTube', tag: 'Panel Layout', youtubeId: '3Bm8oi5U3y8' },
      { id: 'm3', title: 'Brunell House Nevada — Studio RMA', duration: '–', thumbnail: 'https://img.youtube.com/vi/MLGKK1ztYaE/hqdefault.jpg', views: 'YouTube', tag: 'Residencial', youtubeId: 'MLGKK1ztYaE' },
      { id: 'm4', title: '3D MODEL SCIP — Painel Estrutural', duration: '–', thumbnail: 'https://img.youtube.com/vi/Oa-F-Q5ArhY/hqdefault.jpg', views: 'YouTube', tag: '3D Model', youtubeId: 'Oa-F-Q5ArhY' },
      { id: 'm5', title: '3D SCIP Telcom Hub', duration: '–', thumbnail: 'https://img.youtube.com/vi/QIl5zW5tDoU/hqdefault.jpg', views: 'YouTube', tag: 'Comercial', youtubeId: 'QIl5zW5tDoU' },
      { id: 'm6', title: '3D SCIP House — Painéis Estruturais', duration: '–', thumbnail: 'https://img.youtube.com/vi/s1VH9H_6ai4/hqdefault.jpg', views: 'YouTube', tag: 'Residencial', youtubeId: 's1VH9H_6ai4' },
      { id: 'm7', title: '3D SCIP Building', duration: '–', thumbnail: 'https://img.youtube.com/vi/4uwTEhq6BuA/hqdefault.jpg', views: 'YouTube', tag: 'Edifício', youtubeId: '4uwTEhq6BuA' },
    ],
  },
  {
    id: 'casas',
    emoji: '🏠',
    title: 'Projetos de Casas SCIP',
    videos: [
      { id: 'c1', title: 'ADU em 1 Hora com Painéis SIP', duration: '–', thumbnail: 'https://img.youtube.com/vi/BYUa_Xgf8lY/hqdefault.jpg', views: 'YouTube', tag: 'Speed Build', youtubeId: 'BYUa_Xgf8lY' },
      { id: 'c2', title: 'Casa EPS Hitech House — Obra Completa', duration: '–', thumbnail: 'https://img.youtube.com/vi/6bOxsducYEk/hqdefault.jpg', views: 'YouTube', tag: 'Brasil', youtubeId: '6bOxsducYEk' },
      { id: 'c3', title: 'Casa 1.400 ft² com Extreme SIPs', duration: '–', thumbnail: 'https://img.youtube.com/vi/U-CQNraKTjA/hqdefault.jpg', views: 'YouTube', tag: 'SIP USA', youtubeId: 'U-CQNraKTjA' },
      { id: 'c4', title: 'Sobrado 3 Quartos — Tour Completo', duration: '29:15', thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80', views: '12.8k', tag: 'Tour', youtubeId: 'aJjngghQvJ8' },
    ],
  },
  {
    id: 'cursos',
    emoji: '🎓',
    title: 'Cursos SCIP Academy',
    videos: [
      { id: 'cu1', title: 'Fundamentos do Sistema SCIP', duration: '4h 30min', thumbnail: 'https://img.youtube.com/vi/aJjngghQvJ8/hqdefault.jpg', views: '2.8k alunos', progress: 65, tag: 'Grátis', youtubeId: 'aJjngghQvJ8' },
      { id: 'cu2', title: 'Projetos Estruturais com SCIP', duration: '8h 15min', thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80', views: '1.2k alunos', isPremium: true, tag: 'Premium', youtubeId: 'aJjngghQvJ8' },
      { id: 'cu3', title: 'Orçamento e Gestão de Obras', duration: '6h 00min', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', views: '891 alunos', isPremium: true, tag: 'Premium', youtubeId: 'aJjngghQvJ8' },
      { id: 'cu4', title: 'Instalações em EPS — Passo a Passo', duration: '–', thumbnail: 'https://img.youtube.com/vi/6bOxsducYEk/hqdefault.jpg', views: 'YouTube', progress: 30, tag: 'Prático', youtubeId: '6bOxsducYEk' },
    ],
  },
  {
    id: 'obras',
    emoji: '🏗️',
    title: 'Obras Reais',
    videos: [
      { id: 'o1', title: 'Construção EPS ao Vivo — Hitech House', duration: '–', thumbnail: 'https://img.youtube.com/vi/6bOxsducYEk/hqdefault.jpg', views: 'YouTube', tag: 'Brasil', youtubeId: '6bOxsducYEk' },
      { id: 'o2', title: 'SCIP House in Alvin, Texas', duration: '–', thumbnail: 'https://img.youtube.com/vi/Swg2r6Ft8aw/hqdefault.jpg', views: 'YouTube', tag: 'Texas', youtubeId: 'Swg2r6Ft8aw' },
      { id: 'o3', title: 'How To Build With SCIP — Foundation', duration: '–', thumbnail: 'https://img.youtube.com/vi/KYlQv_UrEsY/hqdefault.jpg', views: 'YouTube', tag: 'Tutorial', youtubeId: 'KYlQv_UrEsY' },
      { id: 'o4', title: 'SCIP Structural Concrete Insulated Panels — Part 1', duration: '–', thumbnail: 'https://img.youtube.com/vi/vuWpJwzGDr0/hqdefault.jpg', views: 'YouTube', tag: 'Fundamentos', youtubeId: 'vuWpJwzGDr0' },
      { id: 'o5', title: 'Extreme SIPs — Processo Completo', duration: '–', thumbnail: 'https://img.youtube.com/vi/U-CQNraKTjA/hqdefault.jpg', views: 'YouTube', tag: 'EUA', youtubeId: 'U-CQNraKTjA' },
    ],
  },
  {
    id: 'mundo',
    emoji: '🌍',
    title: 'SCIP no Mundo',
    videos: [
      { id: 'w1', title: 'Casa EPS — O Que Você Não Sabia', duration: '–', thumbnail: 'https://img.youtube.com/vi/aJjngghQvJ8/hqdefault.jpg', views: 'YouTube', tag: 'Brasil', youtubeId: 'aJjngghQvJ8' },
      { id: 'w2', title: 'ADU em 1 Hora — Painéis SIP nos EUA', duration: '–', thumbnail: 'https://img.youtube.com/vi/BYUa_Xgf8lY/hqdefault.jpg', views: 'YouTube', tag: 'EUA', youtubeId: 'BYUa_Xgf8lY' },
      { id: 'w3', title: 'Hitech House — Inovação EPS no Brasil', duration: '–', thumbnail: 'https://img.youtube.com/vi/6bOxsducYEk/hqdefault.jpg', views: 'YouTube', tag: 'Brasil', youtubeId: '6bOxsducYEk' },
      { id: 'w4', title: 'Extreme SIPs — Birmingham Build Show', duration: '–', thumbnail: 'https://img.youtube.com/vi/U-CQNraKTjA/hqdefault.jpg', views: 'YouTube', tag: 'Build Show', youtubeId: 'U-CQNraKTjA' },
    ],
  },
];

// ─── COMMUNITY POSTS ──────────────────────────────────────────────────────────
export interface CommunityPost {
  id: string;
  author: string;
  role: string;
  avatarColor: string;
  avatarInitial: string;
  question: string;
  answers: number;
  views: number;
  time: string;
  tags: string[];
  isAnswered: boolean;
}

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'q1',
    author: 'Carlos Menezes',
    role: 'Engenheiro Civil',
    avatarColor: '#2F6BFF',
    avatarInitial: 'C',
    question: 'Qual a espessura mínima de argamassa para revestimento SCIP em área externa?',
    answers: 7,
    views: 234,
    time: '2h atrás',
    tags: ['Revestimento', 'Argamassa'],
    isAnswered: true,
  },
  {
    id: 'q2',
    author: 'Lucia Ferreira',
    role: 'Arquiteta',
    avatarColor: '#FF7A00',
    avatarInitial: 'L',
    question:
      'Como especificar painéis SCIP em projeto para aprovação na prefeitura? Quais documentos são necessários?',
    answers: 4,
    views: 187,
    time: '5h atrás',
    tags: ['Projeto', 'Prefeitura', 'Aprovação'],
    isAnswered: false,
  },
  {
    id: 'q3',
    author: 'André Souza',
    role: 'Construtor',
    avatarColor: '#00C48C',
    avatarInitial: 'A',
    question: 'SCIP vs Steel Frame: qual a melhor opção para clima tropical úmido?',
    answers: 12,
    views: 892,
    time: '1d atrás',
    tags: ['Comparativo', 'Clima', 'Steel Frame'],
    isAnswered: true,
  },
  {
    id: 'q4',
    author: 'Renata Lima',
    role: 'Estudante de Engenharia',
    avatarColor: '#A0A8B8',
    avatarInitial: 'R',
    question: 'Onde encontrar laudos técnicos oficiais do sistema SCIP para meu TCC?',
    answers: 3,
    views: 156,
    time: '2d atrás',
    tags: ['Laudos', 'TCC', 'Documentação'],
    isAnswered: true,
  },
  {
    id: 'q5',
    author: 'Marcos Oliveira',
    role: 'Mestre de Obras',
    avatarColor: '#FF4D4D',
    avatarInitial: 'M',
    question: 'Quais as ferramentas essenciais para trabalhar com painéis SCIP em obra?',
    answers: 9,
    views: 445,
    time: '3d atrás',
    tags: ['Ferramentas', 'Obra', 'Prático'],
    isAnswered: true,
  },
];

// ─── SPECIALISTS ─────────────────────────────────────────────────────────────
export interface Specialist {
  id: string;
  name: string;
  role: string;
  area: string;
  bio: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  projectsDone: number;
  yearsExp: number;
  avatarColor: string;
  avatarInitial: string;
  isOnline: boolean;
  isVerified: boolean;
  phone: string;
}

export const SPECIALIST_AREAS = [
  { id: 'todos',       label: 'Todos',               icon: 'grid-outline' },
  { id: 'civil',       label: 'Eng. Civil',           icon: 'business-outline' },
  { id: 'eletrica',    label: 'Eng. Elétrica',        icon: 'flash-outline' },
  { id: 'mecanica',    label: 'Eng. Mecânica',        icon: 'settings-outline' },
  { id: 'scip',        label: 'Painel SCIP',          icon: 'layers-outline' },
  { id: 'hidraulica',  label: 'Hidráulica SCIP',      icon: 'water-outline' },
  { id: 'eletrica_scip', label: 'Elétrica em SCIP',  icon: 'bulb-outline' },
  { id: 'fundacao',    label: 'Fundações',            icon: 'construct-outline' },
  { id: 'projetos',    label: 'Projetos',             icon: 'document-text-outline' },
  { id: 'execucao',    label: 'Execução',             icon: 'hammer-outline' },
  { id: 'treinamento', label: 'Treinamentos',         icon: 'school-outline' },
  { id: 'orcamento',   label: 'Orçamento',            icon: 'cash-outline' },
  { id: 'arquitetura', label: 'Arquitetura',          icon: 'home-outline' },
  { id: 'gestao',      label: 'Gestão de Obras',      icon: 'clipboard-outline' },
];

export const SPECIALISTS: Specialist[] = [
  {
    id: 's1', name: 'Eng. Ricardo Alves', role: 'Engenheiro Civil Sênior', area: 'civil',
    bio: 'Especialista em estruturas de concreto e SCIP com 18 anos de experiência em obras residenciais e comerciais.',
    rating: 4.9, reviewCount: 214, responseTime: '< 1h', projectsDone: 87, yearsExp: 18,
    avatarColor: '#2F6BFF', avatarInitial: 'R', isOnline: true, isVerified: true, phone: '+5511991110001',
  },
  {
    id: 's2', name: 'Eng. Fernanda Costa', role: 'Engenheira Elétrica', area: 'eletrica',
    bio: 'Projetos elétricos residenciais e comerciais, com foco em instalações para sistemas SCIP e construção industrializada.',
    rating: 4.8, reviewCount: 178, responseTime: '< 2h', projectsDone: 63, yearsExp: 12,
    avatarColor: '#FF7A00', avatarInitial: 'F', isOnline: true, isVerified: true, phone: '+5511991110002',
  },
  {
    id: 's3', name: 'Eng. Marcos Silva', role: 'Especialista em Painel SCIP', area: 'scip',
    bio: 'Referência nacional em painéis SCIP. Consultoria técnica, laudos e especificações para projetos de qualquer porte.',
    rating: 5.0, reviewCount: 302, responseTime: '< 30min', projectsDone: 145, yearsExp: 15,
    avatarColor: '#00C48C', avatarInitial: 'M', isOnline: true, isVerified: true, phone: '+5511991110003',
  },
  {
    id: 's4', name: 'Téc. Paulo Mendes', role: 'Hidráulica em SCIP', area: 'hidraulica',
    bio: 'Técnico especializado em instalações hidrossanitárias em sistemas SCIP. Embutimento correto sem comprometer a estrutura.',
    rating: 4.7, reviewCount: 94, responseTime: '< 3h', projectsDone: 52, yearsExp: 9,
    avatarColor: '#4CC9F0', avatarInitial: 'P', isOnline: false, isVerified: true, phone: '+5511991110004',
  },
  {
    id: 's5', name: 'Eng. Ana Luiza Rocha', role: 'Elétrica em SCIP', area: 'eletrica_scip',
    bio: 'Instalações elétricas projetadas para painéis SCIP, seguindo normas ABNT. Passagem de eletrodutos e caixas embutidas.',
    rating: 4.8, reviewCount: 121, responseTime: '< 2h', projectsDone: 74, yearsExp: 11,
    avatarColor: '#FFB800', avatarInitial: 'A', isOnline: true, isVerified: true, phone: '+5511991110005',
  },
  {
    id: 's6', name: 'Eng. Carlos Moura', role: 'Engenheiro de Fundações', area: 'fundacao',
    bio: 'Projetos de fundações superficiais e profundas adaptadas ao sistema SCIP. Laudos geotécnicos e sondagens.',
    rating: 4.9, reviewCount: 167, responseTime: '< 1h', projectsDone: 98, yearsExp: 20,
    avatarColor: '#7B61FF', avatarInitial: 'C', isOnline: false, isVerified: true, phone: '+5511991110006',
  },
  {
    id: 's7', name: 'Arq. Juliana Pires', role: 'Arquitetura SCIP', area: 'arquitetura',
    bio: 'Projetos arquitetônicos premium com integração nativa ao sistema SCIP. Especialista em residências de alto padrão.',
    rating: 4.9, reviewCount: 188, responseTime: '< 2h', projectsDone: 76, yearsExp: 13,
    avatarColor: '#FF4D9D', avatarInitial: 'J', isOnline: true, isVerified: true, phone: '+5511991110007',
  },
  {
    id: 's8', name: 'Eng. Bruno Teixeira', role: 'Projetos Estruturais SCIP', area: 'projetos',
    bio: 'Desenvolvimento de projetos estruturais completos para SCIP. Cálculo de cargas, detalhamento e memorial descritivo.',
    rating: 4.7, reviewCount: 143, responseTime: '< 3h', projectsDone: 61, yearsExp: 10,
    avatarColor: '#00A3FF', avatarInitial: 'B', isOnline: true, isVerified: false, phone: '+5511991110008',
  },
  {
    id: 's9', name: 'Mestre Robson Lima', role: 'Execução e Obra', area: 'execucao',
    bio: 'Mestre de obras com experiência em mais de 120 construções SCIP. Gestão de equipes, qualidade e prazos.',
    rating: 4.8, reviewCount: 256, responseTime: '< 1h', projectsDone: 121, yearsExp: 22,
    avatarColor: '#FF5722', avatarInitial: 'R', isOnline: false, isVerified: true, phone: '+5511991110009',
  },
  {
    id: 's10', name: 'Eng. Patrícia Ramos', role: 'Treinamentos SCIP', area: 'treinamento',
    bio: 'Instrutora certificada para montagem e execução de painéis SCIP. Treinamentos in-loco e online para equipes de obra.',
    rating: 5.0, reviewCount: 389, responseTime: '< 1h', projectsDone: 200, yearsExp: 14,
    avatarColor: '#9C27B0', avatarInitial: 'P', isOnline: true, isVerified: true, phone: '+5511991110010',
  },
  {
    id: 's11', name: 'Eng. Diego Campos', role: 'Orçamento e Custos', area: 'orcamento',
    bio: 'Especialista em orçamentos, planejamento de obras e viabilidade econômica para projetos SCIP de todos os portes.',
    rating: 4.6, reviewCount: 112, responseTime: '< 2h', projectsDone: 48, yearsExp: 8,
    avatarColor: '#43A047', avatarInitial: 'D', isOnline: true, isVerified: false, phone: '+5511991110011',
  },
  {
    id: 's12', name: 'Eng. Thiago Nogueira', role: 'Engenheiro Mecânico', area: 'mecanica',
    bio: 'Projetos de climatização, ventilação e sistemas mecânicos integrados ao SCIP. AVAC e eficiência energética.',
    rating: 4.7, reviewCount: 88, responseTime: '< 3h', projectsDone: 39, yearsExp: 10,
    avatarColor: '#78909C', avatarInitial: 'T', isOnline: false, isVerified: true, phone: '+5511991110012',
  },
  {
    id: 's13', name: 'Eng. Letícia Barros', role: 'Gestão de Obras SCIP', area: 'gestao',
    bio: 'Gerenciamento completo de obras com sistema SCIP. Cronograma, BIM, controle de qualidade e entrega no prazo.',
    rating: 4.9, reviewCount: 174, responseTime: '< 1h', projectsDone: 82, yearsExp: 16,
    avatarColor: '#E91E63', avatarInitial: 'L', isOnline: true, isVerified: true, phone: '+5511991110013',
  },
];

// ─── SPECIALISTS ONLINE (legado comunidade) ───────────────────────────────────
export const SPECIALISTS_ONLINE = SPECIALISTS.filter(s => s.isOnline).slice(0, 4);

// ─── CALCULATOR ───────────────────────────────────────────────────────────────
export const OBRA_TYPES = [
  { label: 'Residencial Simples', value: 'residencial_simples', costPerM2: 1800 },
  { label: 'Residencial Premium', value: 'residencial_premium', costPerM2: 2800 },
  { label: 'Comercial', value: 'comercial', costPerM2: 2200 },
  { label: 'Industrial', value: 'industrial', costPerM2: 1500 },
  { label: 'Corporativo', value: 'corporativo', costPerM2: 3200 },
];
