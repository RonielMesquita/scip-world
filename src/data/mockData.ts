// ─── PROJECTS ───────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  location: string;
  size: string;
  image: string;
  type: string;
  companyId: string;
}

export const FEATURED_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Residência Villagio',
    location: 'São Paulo, SP',
    size: '320 m²',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=520&q=80',
    type: 'Residencial',
    companyId: 'c1',
  },
  {
    id: 'p2',
    title: 'Edifício Horizon',
    location: 'Rio de Janeiro, RJ',
    size: '1.200 m²',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=520&q=80',
    type: 'Comercial',
    companyId: 'c2',
  },
  {
    id: 'p3',
    title: 'Casa Vale Verde',
    location: 'Curitiba, PR',
    size: '480 m²',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=520&q=80',
    type: 'Residencial',
    companyId: 'c3',
  },
  {
    id: 'p4',
    title: 'Torre Alfa Business',
    location: 'Brasília, DF',
    size: '2.800 m²',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=520&q=80',
    type: 'Corporativo',
    companyId: 'c5',
  },
  {
    id: 'p5',
    title: 'Condomínio Paradiso',
    location: 'Florianópolis, SC',
    size: '650 m²',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=520&q=80',
    type: 'Residencial',
    companyId: 'c6',
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
    category: 'Arquitetura',
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
  {
    id: 'c6',
    name: 'BeachLife Development',
    rating: 4.8,
    reviewCount: 67,
    location: 'Florianópolis, SC',
    verified: true,
    category: 'Construção',
    services: ['Obras Litorâneas', 'SCIP Costeiro', 'Alto Padrão'],
    description:
      'Construtora especializada em empreendimentos litorâneos de alto padrão com tecnologia SCIP. Projetos que unem durabilidade, resistência à maresia e design contemporâneo.',
    coverImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
    logoColor: '#00C8FF',
    logoInitial: 'B',
    phone: '+5548999990006',
  },
  {
    id: 'c7',
    name: 'ObraGest',
    rating: 4.7,
    reviewCount: 89,
    location: 'São Paulo, SP',
    verified: true,
    category: 'Gestão de Obra',
    services: ['Gestão de Cronograma', 'Controle de Custos', 'BIM'],
    description: 'Especialistas em gestão de obras com tecnologia BIM. Garantimos prazos e orçamentos com dashboards em tempo real e coordenação completa da equipe de campo.',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    logoColor: '#7B61FF',
    logoInitial: 'O',
    phone: '+5511999990007',
  },
  {
    id: 'c8',
    name: 'Nexus Consultoria',
    rating: 4.8,
    reviewCount: 113,
    location: 'Belo Horizonte, MG',
    verified: true,
    category: 'Consultoria',
    services: ['Consultoria Técnica', 'Due Diligence', 'Laudos SCIP'],
    description: 'Consultoria técnica especializada em construção SCIP. Assessoramos desde a viabilidade do projeto até a entrega final, garantindo conformidade e excelência técnica.',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    logoColor: '#FF7A00',
    logoInitial: 'N',
    phone: '+5531999990008',
  },
  {
    id: 'c9',
    name: 'ProjetaBR',
    rating: 4.6,
    reviewCount: 58,
    location: 'Porto Alegre, RS',
    verified: false,
    category: 'Projetos',
    services: ['Projeto Executivo', 'Compatibilização', 'Projetos 3D'],
    description: 'Escritório de projetos multidisciplinar com foco em construções SCIP. Desenvolvemos projetos arquitetônicos, estruturais e complementares totalmente integrados.',
    coverImage: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
    logoColor: '#00C8FF',
    logoInitial: 'P',
    phone: '+5551999990009',
  },
  {
    id: 'c10',
    name: 'EletroSCIP',
    rating: 4.5,
    reviewCount: 44,
    location: 'Campinas, SP',
    verified: false,
    category: 'Elétrica',
    services: ['Instalações Elétricas', 'Automação Residencial', 'SPDA'],
    description: 'Especialistas em instalações elétricas em painéis SCIP. Executamos projetos residenciais e comerciais com segurança certificada e acabamento impecável.',
    coverImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80',
    logoColor: '#FFB300',
    logoInitial: 'E',
    phone: '+5519999990010',
  },
  {
    id: 'c11',
    name: 'HidroTech',
    rating: 4.4,
    reviewCount: 37,
    location: 'Goiânia, GO',
    verified: false,
    category: 'Hidráulica',
    services: ['Hidráulica SCIP', 'Captação de Água', 'Esgoto Sanitário'],
    description: 'Soluções hidráulicas completas para construções em painéis SCIP. Instalamos sistemas de água fria, quente e esgoto com tecnologia de embutimento certificada.',
    coverImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
    logoColor: '#4CC9F0',
    logoInitial: 'H',
    phone: '+5562999990011',
  },
  {
    id: 'c12',
    name: 'RevocoMax',
    rating: 4.3,
    reviewCount: 29,
    location: 'Fortaleza, CE',
    verified: false,
    category: 'Reboco Projetado',
    services: ['Reboco Projetado', 'Textura Acrílica', 'Argamassa SCIP'],
    description: 'Líderes em reboco projetado para painéis SCIP. Utilizamos argamassas de alta aderência específicas para EPS, garantindo acabamento liso e durável.',
    coverImage: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80',
    logoColor: '#A0A8B8',
    logoInitial: 'R',
    phone: '+5585999990012',
  },
  {
    id: 'c13',
    name: 'ConcreBrasil',
    rating: 4.6,
    reviewCount: 62,
    location: 'São Paulo, SP',
    verified: true,
    category: 'Concreto',
    services: ['Concretagem', 'Concreto Usinado', 'Lajes SCIP'],
    description: 'Fornecimento e aplicação de concreto para estruturas SCIP. Trabalhamos com traços específicos para aderência em EPS, incluindo lajes nervuradas e contrapisos.',
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    logoColor: '#8D9EB5',
    logoInitial: 'C',
    phone: '+5511999990013',
  },
  {
    id: 'c14',
    name: 'SuprimeSCIP',
    rating: 4.5,
    reviewCount: 48,
    location: 'Curitiba, PR',
    verified: false,
    category: 'Fornecedores',
    services: ['Painéis EPS', 'Tela de Aço Galvanizado', 'Insumos SCIP'],
    description: 'Distribuidora especializada em insumos para construção SCIP. Fornecemos painéis EPS certificados, telas de aço galvanizado e todos os acessórios para obra.',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    logoColor: '#00C48C',
    logoInitial: 'S',
    phone: '+5541999990014',
  },
  {
    id: 'c15',
    name: 'LocaMaq',
    rating: 4.4,
    reviewCount: 33,
    location: 'Brasília, DF',
    verified: false,
    category: 'Aluguel de Máquinas',
    services: ['Projetores de Argamassa', 'Bombas de Concreto', 'Andaimes'],
    description: 'Locadora de máquinas e equipamentos para obras SCIP. Disponibilizamos projetores de argamassa, bombas de concreto, andaimes e toda a infraestrutura necessária.',
    coverImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
    logoColor: '#FF6B35',
    logoInitial: 'L',
    phone: '+5561999990015',
  },
  {
    id: 'c16',
    name: 'PintaSCIP',
    rating: 4.5,
    reviewCount: 55,
    location: 'Rio de Janeiro, RJ',
    verified: false,
    category: 'Pintura',
    services: ['Pintura Interna', 'Pintura Externa', 'Texturas Decorativas'],
    description: 'Especialistas em pintura para superfícies SCIP. Utilizamos tintas e primers de alta aderência para EPS rebocado, com acabamentos lisos, texturizados e decorativos.',
    coverImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80',
    logoColor: '#FF4D9D',
    logoInitial: 'P',
    phone: '+5521999990016',
  },
  {
    id: 'c17',
    name: 'TelhaMax',
    rating: 4.6,
    reviewCount: 71,
    location: 'São Paulo, SP',
    verified: true,
    category: 'Telhado',
    services: ['Telhado Cerâmico', 'Telhado Metálico', 'Telhado Verde'],
    description: 'Soluções completas em cobertura para construções SCIP. Executamos telhados cerâmicos, metálicos e verdes com estrutura leve compatível com o sistema de painéis.',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    logoColor: '#FF7A00',
    logoInitial: 'T',
    phone: '+5511999990017',
  },
  {
    id: 'c18',
    name: 'ImperTech',
    rating: 4.7,
    reviewCount: 83,
    location: 'Curitiba, PR',
    verified: true,
    category: 'Impermeabilização',
    services: ['Impermeabilização de Lajes', 'Mantas Asfálticas', 'Impermeabilização SCIP'],
    description: 'Impermeabilização certificada para estruturas em painéis SCIP. Aplicamos mantas, membranas e revestimentos de alta performance contra infiltrações e umidade.',
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    logoColor: '#2F6BFF',
    logoInitial: 'I',
    phone: '+5541999990018',
  },
  {
    id: 'c19',
    name: 'PisosPro',
    rating: 4.5,
    reviewCount: 47,
    location: 'Belo Horizonte, MG',
    verified: false,
    category: 'Pisos',
    services: ['Piso Porcelanato', 'Piso Vinílico', 'Contrapiso SCIP'],
    description: 'Aplicação de pisos e contrapisos para obras em painéis SCIP. Trabalhamos com porcelanato, vinílico, cimentício e madeira, com nivelamento preciso sobre base SCIP.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    logoColor: '#00C48C',
    logoInitial: 'P',
    phone: '+5531999990019',
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
  location: string;
  services: string[];
  certifications?: string[];
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
    bio: 'Especialista em estruturas de concreto e SCIP com 18 anos de experiência em obras residenciais e comerciais. Atua em projetos de todos os portes, desde residências unifamiliares até edifícios comerciais de múltiplos pavimentos.',
    rating: 4.9, reviewCount: 214, responseTime: '< 1h', projectsDone: 87, yearsExp: 18,
    avatarColor: '#2F6BFF', avatarInitial: 'R', isOnline: true, isVerified: true, phone: '+5511991110001',
    location: 'São Paulo, SP',
    services: ['Projetos Estruturais SCIP', 'Laudos Técnicos', 'Consultoria em Obras', 'Vistoria e ART'],
    certifications: ['CREA-SP Ativo', 'SCIP Certificado', 'NR-18'],
  },
  {
    id: 's2', name: 'Eng. Fernanda Costa', role: 'Engenheira Elétrica', area: 'eletrica',
    bio: 'Projetos elétricos residenciais e comerciais, com foco em instalações para sistemas SCIP e construção industrializada. Atende normas ABNT NBR 5410 com soluções seguras e eficientes.',
    rating: 4.8, reviewCount: 178, responseTime: '< 2h', projectsDone: 63, yearsExp: 12,
    avatarColor: '#FF7A00', avatarInitial: 'F', isOnline: true, isVerified: true, phone: '+5511991110002',
    location: 'São Paulo, SP',
    services: ['Projeto Elétrico Residencial', 'Projeto Elétrico Comercial', 'SPDA / Para-Raios', 'Laudo Elétrico'],
    certifications: ['CREA-SP Ativo', 'NR-10', 'ABNT NBR 5410'],
  },
  {
    id: 's3', name: 'Eng. Marcos Silva', role: 'Especialista em Painel SCIP', area: 'scip',
    bio: 'Referência nacional em painéis SCIP. Consultoria técnica, laudos e especificações para projetos de qualquer porte. Já assessorou mais de 140 obras em todo o Brasil com índice zero de não-conformidades.',
    rating: 5.0, reviewCount: 302, responseTime: '< 30min', projectsDone: 145, yearsExp: 15,
    avatarColor: '#00C48C', avatarInitial: 'M', isOnline: true, isVerified: true, phone: '+5511991110003',
    location: 'São Paulo, SP',
    services: ['Consultoria Técnica SCIP', 'Laudos SCIP', 'Especificação de Painéis', 'Treinamento Especializado'],
    certifications: ['SCIP Master Certificado', 'ABNT NBR 15575', 'CREA-SP Ativo'],
  },
  {
    id: 's4', name: 'Téc. Paulo Mendes', role: 'Hidráulica em SCIP', area: 'hidraulica',
    bio: 'Técnico especializado em instalações hidrossanitárias em sistemas SCIP. Embutimento correto sem comprometer a estrutura. Atende residências e empreendimentos comerciais com soluções duráveis.',
    rating: 4.7, reviewCount: 94, responseTime: '< 3h', projectsDone: 52, yearsExp: 9,
    avatarColor: '#4CC9F0', avatarInitial: 'P', isOnline: false, isVerified: true, phone: '+5511991110004',
    location: 'Rio de Janeiro, RJ',
    services: ['Hidráulica em SCIP', 'Projeto Hidrossanitário', 'Esgoto Sanitário', 'Captação de Água'],
    certifications: ['CREA-RJ Ativo', 'SCIP Técnico Hidráulico'],
  },
  {
    id: 's5', name: 'Eng. Ana Luiza Rocha', role: 'Elétrica em SCIP', area: 'eletrica_scip',
    bio: 'Instalações elétricas projetadas para painéis SCIP, seguindo normas ABNT. Passagem de eletrodutos e caixas embutidas com precisão e segurança certificada.',
    rating: 4.8, reviewCount: 121, responseTime: '< 2h', projectsDone: 74, yearsExp: 11,
    avatarColor: '#FFB800', avatarInitial: 'A', isOnline: true, isVerified: true, phone: '+5511991110005',
    location: 'Belo Horizonte, MG',
    services: ['Elétrica em SCIP', 'Eletrodutos Embutidos', 'Automação Residencial', 'Laudo Elétrico SCIP'],
    certifications: ['CREA-MG Ativo', 'NR-10', 'SCIP Elétrico Certificado'],
  },
  {
    id: 's6', name: 'Eng. Carlos Moura', role: 'Engenheiro de Fundações', area: 'fundacao',
    bio: 'Projetos de fundações superficiais e profundas adaptadas ao sistema SCIP. Laudos geotécnicos e sondagens. Expertise em radier nervurado e estacas helicoidais para construções leves.',
    rating: 4.9, reviewCount: 167, responseTime: '< 1h', projectsDone: 98, yearsExp: 20,
    avatarColor: '#7B61FF', avatarInitial: 'C', isOnline: false, isVerified: true, phone: '+5511991110006',
    location: 'Porto Alegre, RS',
    services: ['Projeto de Fundações SCIP', 'Laudos Geotécnicos', 'Sondagem SPT', 'Radier Nervurado'],
    certifications: ['CREA-RS Ativo', 'Geotecnia Avançada', 'ABNT NBR 6122'],
  },
  {
    id: 's7', name: 'Arq. Juliana Pires', role: 'Arquitetura SCIP', area: 'arquitetura',
    bio: 'Projetos arquitetônicos premium com integração nativa ao sistema SCIP. Especialista em residências de alto padrão. Alia estética contemporânea à eficiência construtiva do sistema industrializado.',
    rating: 4.9, reviewCount: 188, responseTime: '< 2h', projectsDone: 76, yearsExp: 13,
    avatarColor: '#FF4D9D', avatarInitial: 'J', isOnline: true, isVerified: true, phone: '+5511991110007',
    location: 'Curitiba, PR',
    services: ['Projeto Arquitetônico SCIP', 'Design de Interiores', 'Projetos 3D / BIM', 'Aprovação em Prefeitura'],
    certifications: ['CAU-PR Ativo', 'BIM Professional', 'SCIP Arquitetura'],
  },
  {
    id: 's8', name: 'Eng. Bruno Teixeira', role: 'Projetos Estruturais SCIP', area: 'projetos',
    bio: 'Desenvolvimento de projetos estruturais completos para SCIP. Cálculo de cargas, detalhamento e memorial descritivo. Entrega projetos executivos prontos para obra dentro do prazo.',
    rating: 4.7, reviewCount: 143, responseTime: '< 3h', projectsDone: 61, yearsExp: 10,
    avatarColor: '#00A3FF', avatarInitial: 'B', isOnline: true, isVerified: false, phone: '+5511991110008',
    location: 'Florianópolis, SC',
    services: ['Projeto Estrutural SCIP', 'Cálculo Estrutural', 'Memorial Descritivo', 'Compatibilização de Projetos'],
    certifications: ['CREA-SC Ativo'],
  },
  {
    id: 's9', name: 'Mestre Robson Lima', role: 'Execução e Obra', area: 'execucao',
    bio: 'Mestre de obras com experiência em mais de 120 construções SCIP. Gestão de equipes, controle de qualidade e cumprimento de prazos. Atua em obras residenciais e comerciais em todo o Nordeste.',
    rating: 4.8, reviewCount: 256, responseTime: '< 1h', projectsDone: 121, yearsExp: 22,
    avatarColor: '#FF5722', avatarInitial: 'R', isOnline: false, isVerified: true, phone: '+5511991110009',
    location: 'Salvador, BA',
    services: ['Gestão de Execução SCIP', 'Montagem de Painéis', 'Controle de Qualidade', 'Treinamento de Equipe'],
    certifications: ['SCIP Executor Certificado', 'NR-18', 'NR-35'],
  },
  {
    id: 's10', name: 'Eng. Patrícia Ramos', role: 'Treinamentos SCIP', area: 'treinamento',
    bio: 'Instrutora certificada para montagem e execução de painéis SCIP. Treinamentos in-loco e online para equipes de obra. Já capacitou mais de 500 profissionais em todo o Brasil.',
    rating: 5.0, reviewCount: 389, responseTime: '< 1h', projectsDone: 200, yearsExp: 14,
    avatarColor: '#9C27B0', avatarInitial: 'P', isOnline: true, isVerified: true, phone: '+5511991110010',
    location: 'São Paulo, SP',
    services: ['Treinamento Presencial SCIP', 'Cursos Online SCIP', 'Capacitação de Equipes', 'Certificação In-loco'],
    certifications: ['SCIP Instrutora Master', 'Formação Pedagógica', 'NR-18 Multiplicadora'],
  },
  {
    id: 's11', name: 'Eng. Diego Campos', role: 'Orçamento e Custos', area: 'orcamento',
    bio: 'Especialista em orçamentos, planejamento de obras e viabilidade econômica para projetos SCIP de todos os portes. Reduz custos sem comprometer a qualidade da execução.',
    rating: 4.6, reviewCount: 112, responseTime: '< 2h', projectsDone: 48, yearsExp: 8,
    avatarColor: '#43A047', avatarInitial: 'D', isOnline: true, isVerified: false, phone: '+5511991110011',
    location: 'Goiânia, GO',
    services: ['Orçamentos Detalhados SCIP', 'Planejamento de Obra', 'Viabilidade Econômica', 'Composição de Custos'],
    certifications: ['CREA-GO Ativo', 'MS Project Avançado'],
  },
  {
    id: 's12', name: 'Eng. Thiago Nogueira', role: 'Engenheiro Mecânico', area: 'mecanica',
    bio: 'Projetos de climatização, ventilação e sistemas mecânicos integrados ao SCIP. AVAC e eficiência energética. Especialista em conforto térmico para edificações industrializadas.',
    rating: 4.7, reviewCount: 88, responseTime: '< 3h', projectsDone: 39, yearsExp: 10,
    avatarColor: '#78909C', avatarInitial: 'T', isOnline: false, isVerified: true, phone: '+5511991110012',
    location: 'Recife, PE',
    services: ['AVAC em SCIP', 'Climatização Residencial', 'Ventilação Mecânica', 'Eficiência Energética'],
    certifications: ['CREA-PE Ativo', 'ASHRAE Member', 'SCIP Mecânico'],
  },
  {
    id: 's13', name: 'Eng. Letícia Barros', role: 'Gestão de Obras SCIP', area: 'gestao',
    bio: 'Gerenciamento completo de obras com sistema SCIP. Cronograma, BIM, controle de qualidade e entrega no prazo. Coordena equipes multidisciplinares garantindo eficiência do início ao fim.',
    rating: 4.9, reviewCount: 174, responseTime: '< 1h', projectsDone: 82, yearsExp: 16,
    avatarColor: '#E91E63', avatarInitial: 'L', isOnline: true, isVerified: true, phone: '+5511991110013',
    location: 'São Paulo, SP',
    services: ['Gerenciamento de Obras SCIP', 'BIM Coordination', 'Controle de Cronograma', 'Controle de Qualidade'],
    certifications: ['CREA-SP Ativo', 'PMP Certificada', 'BIM Manager'],
  },
];

// ─── SPECIALISTS ONLINE (legado comunidade) ───────────────────────────────────
export const SPECIALISTS_ONLINE = SPECIALISTS.filter(s => s.isOnline).slice(0, 4);

// ─── CALCULATOR ───────────────────────────────────────────────────────────────
// costs are always per m² in local currency (pt=BRL, en=USD, es=USD)
export const OBRA_TYPES = [
  { label: 'Residencial Simples', value: 'residencial_simples', costs: { pt: 1800, en: 320, es: 290 } },
  { label: 'Residencial Premium', value: 'residencial_premium', costs: { pt: 2800, en: 490, es: 450 } },
  { label: 'Comercial',           value: 'comercial',           costs: { pt: 2200, en: 380, es: 350 } },
  { label: 'Industrial',          value: 'industrial',          costs: { pt: 1500, en: 260, es: 240 } },
  { label: 'Corporativo',         value: 'corporativo',         costs: { pt: 3200, en: 560, es: 510 } },
];

// ─── FEED ─────────────────────────────────────────────────────────────────────
export interface FeedStory {
  id: string;
  userName: string;
  avatarInitial: string;
  avatarColor: string;
  viewed: boolean;
  image: string;
  caption?: string;
}

export interface FeedPost {
  id: string;
  userName: string;
  userRole: string;
  avatarInitial: string;
  avatarColor: string;
  verified: boolean;
  isPremium: boolean;
  image: string;
  caption: string;
  likes: number;
  timeAgo: string;
  location?: string;
  companyId?: string;
}

export const FEED_STORIES: FeedStory[] = [
  { id: 'fs1', userName: 'Ricardo',     avatarInitial: 'R', avatarColor: '#4CC9F0', viewed: false, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=85', caption: 'Estrutura do dia — SCIP na veia! 🏗️' },
  { id: 'fs2', userName: 'ArchiPro',    avatarInitial: 'A', avatarColor: '#7B61FF', viewed: false, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=85', caption: 'Projeto residencial 420m² — quase pronto!' },
  { id: 'fs3', userName: 'TechBuild',   avatarInitial: 'T', avatarColor: '#FF6B00', viewed: true,  image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=85', caption: 'Painéis saindo da linha de produção 🔥' },
  { id: 'fs4', userName: 'Mariana',     avatarInitial: 'M', avatarColor: '#FF4D9D', viewed: false, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=85', caption: 'Luz natural e SCIP — combinação perfeita ✨' },
  { id: 'fs5', userName: 'ConstruFast', avatarInitial: 'C', avatarColor: '#00C48C', viewed: true,  image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=85', caption: 'Entrega antes do prazo! 🏆' },
  { id: 'fs6', userName: 'Fabricasa',   avatarInitial: 'F', avatarColor: '#FFB703', viewed: false, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=85', caption: 'Nova fábrica — capacidade triplicada!' },
  { id: 'fs7', userName: 'GrupoAlpha',  avatarInitial: 'G', avatarColor: '#1E90FF', viewed: false, image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=85', caption: 'Canteiro de obras em dia ⚙️' },
];

export const FEED_POSTS: FeedPost[] = [
  {
    id: 'fp1',
    userName: 'Ricardo Alves',
    userRole: 'Engenheiro Estrutural',
    avatarInitial: 'R',
    avatarColor: '#4CC9F0',
    verified: true,
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    caption: 'Finalizamos mais uma obra residencial em SCIP! Estrutura concluída em tempo recorde com excelente acabamento. Tecnologia que transforma o mercado da construção. 🏗️',
    likes: 127,
    timeAgo: '2h',
    location: 'São Paulo, SP',
    companyId: 'c1',
  },
  {
    id: 'fp2',
    userName: 'ArchiPro Construções',
    userRole: 'Construtora Premium',
    avatarInitial: 'A',
    avatarColor: '#7B61FF',
    verified: true,
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    caption: 'Projeto residencial de alto padrão concluído. 420m² de pura elegância com painéis SCIP de última geração. Venha conhecer nosso portfólio completo!',
    likes: 89,
    timeAgo: '5h',
    location: 'Curitiba, PR',
    companyId: 'c3',
  },
  {
    id: 'fp3',
    userName: 'TechBuild Brasil',
    userRole: 'Fábrica de Painéis SCIP',
    avatarInitial: 'T',
    avatarColor: '#FF6B00',
    verified: true,
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    caption: '🔥 PROMOÇÃO — Painéis SCIP com 15% de desconto para pedidos acima de 200m². Válido até fim do mês. Entre em contato agora!',
    likes: 214,
    timeAgo: '8h',
    location: 'Joinville, SC',
    companyId: 'c2',
  },
  {
    id: 'fp4',
    userName: 'Mariana Costa',
    userRole: 'Arquiteta',
    avatarInitial: 'M',
    avatarColor: '#FF4D9D',
    verified: true,
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    caption: 'Design moderno encontra tecnologia SCIP. Este projeto em Florianópolis foi um desafio incrível — linhas limpas, muita luz natural e sustentabilidade em cada detalhe.',
    likes: 56,
    timeAgo: '12h',
    location: 'Florianópolis, SC',
  },
  {
    id: 'fp5',
    userName: 'ConstruFast',
    userRole: 'Construtora',
    avatarInitial: 'C',
    avatarColor: '#00C48C',
    verified: true,
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    caption: 'Edifício comercial entregue 30 dias antes do prazo! A velocidade do sistema SCIP é impressionante. Parabéns à equipe toda! 🏆',
    likes: 178,
    timeAgo: '1d',
    location: 'Rio de Janeiro, RJ',
    companyId: 'c5',
  },
  {
    id: 'fp6',
    userName: 'Fabricasa Painéis',
    userRole: 'Fábrica de Painéis',
    avatarInitial: 'F',
    avatarColor: '#FFB703',
    verified: true,
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1565031491910-e57fac031c41?w=800&q=80',
    caption: 'Nossos painéis chegando em mais um canteiro de obras em Brasília. Qualidade e agilidade que fazem a diferença. Solicite seu orçamento!',
    likes: 93,
    timeAgo: '2d',
    location: 'Brasília, DF',
    companyId: 'c4',
  },
];
