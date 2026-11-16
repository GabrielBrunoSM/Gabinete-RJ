export type RegionFilter = 'all' | 'zona-sul' | 'centro-st' | 'zona-norte';

export interface ActivitySlot {
  id: string;
  period: 'Manhã / Tarde' | 'Noite';
  title: string;
  description: string;
  neighborhood: string;
  mapsQuery: string;
  tip?: string;
  options?: {
    id: string;
    label: string;
    description: string;
    neighborhood: string;
    mapsQuery: string;
  }[];
}

export interface ItineraryDay {
  dayNumber: string;
  date: string;
  weekday: string;
  regionKey: Exclude<RegionFilter, 'all'>;
  regionLabel: string;
  headline: string;
  strategicNote?: string;
  morning: ActivitySlot;
  evening?: ActivitySlot;
}

export interface ZoneNode {
  id: string;
  name: string;
  subtitle: string;
  regionKey: Exclude<RegionFilter, 'all'>;
  x: number;
  y: number;
  days: string[];
  connectionNote: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  category: string;
  done: boolean;
}

export type PlaceCategory = 'all' | 'praias' | 'gastronomia' | 'cultura';

export interface SuggestedPlace {
  id: string;
  name: string;
  neighborhood: string;
  category: Exclude<PlaceCategory, 'all'>;
  categoryLabel: string;
  note: string;
  mapsQuery: string;
  suggestedDay: string;
}

export const HERO_IMAGE = {
  src: '/src/assets/images/rio_hero_sugarloaf_1794790308793.jpg',
  alt: 'Vista panorâmica da Baía de Guanabara e do Pão de Açúcar ao entardecer no Rio de Janeiro',
  caption: 'Baía de Guanabara e Pão de Açúcar ao fim de tarde — cenário do quarto dia de roteiro.',
};

export const GALLERY_IMAGES = [
  {
    id: 'fig-01',
    figure: 'Fig. 01',
    src: '/src/assets/images/rio_cristo_jardim_1794790309925.jpg',
    alt: 'Alameda das Palmeiras Imperiais no Jardim Botânico do Rio de Janeiro com o Cristo Redentor ao fundo',
    title: 'Jardim Botânico & Parque Lage',
    subtitle: 'Terça-feira, 17/11 · Caminhada matinal sob as palmeiras imperiais na Zona Sul.',
  },
  {
    id: 'fig-02',
    figure: 'Fig. 02',
    src: '/src/assets/images/rio_santa_teresa_lapa_1794790310224.jpg',
    alt: 'Bonde amarelo descendo os trilhos de paralelepípedo em Santa Teresa com os Arcos da Lapa ao fundo ao anoitecer',
    title: 'Santa Teresa rumo à Lapa',
    subtitle: 'Sexta-feira, 20/11 · Conexão geográfica a pé da Escadaria Selarón até os arcos.',
  },
  {
    id: 'fig-03',
    figure: 'Fig. 03',
    src: '/src/assets/images/rio_arpoador_sunset_1794790310907.jpg',
    alt: 'Pôr do sol dourado na Pedra do Arpoador com vista para a Praia de Ipanema e o Morro Dois Irmãos',
    title: 'Pôr do sol na Pedra do Arpoador',
    subtitle: 'Sábado, 21/11 · Fim de tarde clássico entre Ipanema e Copacabana.',
  },
];

export const ITINERARY_DAYS: ItineraryDay[] = [
  {
    dayNumber: '01',
    date: '16/11',
    weekday: 'Segunda-feira',
    regionKey: 'centro-st',
    regionLabel: 'Corcovado & Centro Histórico',
    headline: 'Cristo Redentor & Roda de Samba na Pedra do Sal',
    strategicNote:
      'A Pedra do Sal foi alocada estrategicamente na segunda-feira por ser o dia oficial e mais tradicional da roda de samba raiz no local.',
    morning: {
      id: 'd1-m',
      period: 'Manhã / Tarde',
      title: 'Cristo Redentor',
      description: 'Subida de trenzinho pelo Cosme Velho ou de van oficial pelas Paineiras.',
      neighborhood: 'Cosme Velho / Alto da Boa Vista',
      mapsQuery: 'Cristo Redentor Rio de Janeiro',
      tip: 'Prefira o primeiro horário da manhã (08h–09h) para evitar neblina e filas longas no embarque.',
    },
    evening: {
      id: 'd1-n',
      period: 'Noite',
      title: 'Pedra do Sal',
      description:
        'A segunda-feira é o dia mais tradicional e lotado para a roda de samba histórica aos pés do Morro da Conceição.',
      neighborhood: 'Saúde / Centro',
      mapsQuery: 'Pedra do Sal Rio de Janeiro',
      tip: 'Chegue por volta das 18h30 para garantir bom lugar próximo à roda; leve dinheiro trocado ou Pix.',
    },
  },
  {
    dayNumber: '02',
    date: '17/11',
    weekday: 'Terça-feira',
    regionKey: 'zona-sul',
    regionLabel: 'Zona Sul · Jardim Botânico',
    headline: 'Aléias do Jardim Botânico & Parque Lage',
    morning: {
      id: 'd2-m',
      period: 'Manhã / Tarde',
      title: 'Jardim Botânico & Parque Lage',
      description:
        'Caminhada pelas aléias centenárias do Jardim Botânico e visita ao palacete do Parque Lage logo ao lado.',
      neighborhood: 'Jardim Botânico',
      mapsQuery: 'Jardim Botanico do Rio de Janeiro',
      tip: 'Os dois parques ficam a poucos minutos a pé pela Rua Jardim Botânico; leve repelente para as trilhas.',
    },
    evening: {
      id: 'd2-n',
      period: 'Noite',
      title: 'Noite Livre',
      description: 'Sugestão de jantar descontraído em Botafogo ou nos arredores da Gávea.',
      neighborhood: 'Botafogo ou Gávea',
      mapsQuery: 'Baixo Gavea Rio de Janeiro',
      tip: 'Rua Arnaldo Quintela (Botafogo) e Praça Santos Dumont (Gávea) concentram ótimos bistrôs e bares.',
    },
  },
  {
    dayNumber: '03',
    date: '18/11',
    weekday: 'Quarta-feira',
    regionKey: 'zona-sul',
    regionLabel: 'Zona Sul ou Porto Maravilha',
    headline: 'Praia de Ipanema ou Museu do Amanhã & Le Max',
    morning: {
      id: 'd3-m',
      period: 'Manhã / Tarde',
      title: 'Praia ou Centro Cultural',
      description:
        'Escolha entre uma manhã de sol na Praia de Ipanema ou passeio arquitetônico pelo Museu do Amanhã e Boulevard Olímpico.',
      neighborhood: 'Ipanema / Centro',
      mapsQuery: 'Praia de Ipanema Posto 9 Rio de Janeiro',
      tip: 'Se escolher o Boulevard Olímpico, aproveite o VLT Carioca para circular pelo Porto Maravilha.',
      options: [
        {
          id: 'ipanema',
          label: 'Praia de Ipanema',
          description: 'Manhã clássica de praia entre os postos 8 e 10 com vista para o Morro Dois Irmãos.',
          neighborhood: 'Ipanema',
          mapsQuery: 'Praia de Ipanema Rio de Janeiro',
        },
        {
          id: 'amanha',
          label: 'Museu do Amanhã & Boulevard',
          description: 'Passeio pelo museu de Santiago Calatrava e caminhada pelo Boulevard Olímpico e mural Etnias.',
          neighborhood: 'Praça Mauá / Centro',
          mapsQuery: 'Museu do Amanha Rio de Janeiro',
        },
      ],
    },
    evening: {
      id: 'd3-n',
      period: 'Noite',
      title: 'Le Max Hambúrguer',
      description: 'Jantar conforme o planejamento na hamburgueria artesanal.',
      neighborhood: 'Centro / Ipanema',
      mapsQuery: 'Le Max Hamburgueria Rio de Janeiro',
    },
  },
  {
    dayNumber: '04',
    date: '19/11',
    weekday: 'Quinta-feira',
    regionKey: 'zona-sul',
    regionLabel: 'Zona Sul · Urca & Botafogo',
    headline: 'Bondinho do Pão de Açúcar & Polo Botafogo',
    morning: {
      id: 'd4-m',
      period: 'Manhã / Tarde',
      title: 'Pão de Açúcar',
      description: 'Subida de bondinho no meio da tarde para acompanhar o pôr do sol sobre a Baía de Guanabara.',
      neighborhood: 'Urca',
      mapsQuery: 'Bondinho Pao de Acucar Rio de Janeiro',
      tip: 'Suba por volta das 15h30 para curtir o Morro da Urca com calma antes de seguir ao topo no fim de tarde.',
    },
    evening: {
      id: 'd4-n',
      period: 'Noite',
      title: 'Polo Botafogo / Baixo Gávea',
      description: 'Noite de barzinhos, petiscos de boteco e cerveja gelada.',
      neighborhood: 'Botafogo / Gávea',
      mapsQuery: 'Rua Arnaldo Quintela Botafogo Rio de Janeiro',
    },
  },
  {
    dayNumber: '05',
    date: '20/11',
    weekday: 'Sexta-feira',
    regionKey: 'centro-st',
    regionLabel: 'Centro & Santa Teresa',
    headline: 'Escadaria Selarón, Santa Teresa & Samba na Lapa',
    strategicNote:
      'A Escadaria Selarón ficou na sexta para conectar geograficamente com a noite de samba na Lapa, já que ficam lado a lado no centro da cidade.',
    morning: {
      id: 'd5-m',
      period: 'Manhã / Tarde',
      title: 'Escadaria Selarón & Santa Teresa',
      description:
        'Fotos na escadaria de azulejos e subida pelas ladeiras para almoçar e caminhar pelo bairro boêmio de Santa Teresa.',
      neighborhood: 'Lapa / Santa Teresa',
      mapsQuery: 'Escadaria Selaron Rio de Janeiro',
      tip: 'Suba pelo Largo dos Guimarães para almoçar e explore ateliês e o Parque das Ruínas à tarde.',
    },
    evening: {
      id: 'd5-n',
      period: 'Noite',
      title: 'Noite na Lapa',
      description:
        'Muito samba, música ao vivo e bar da cachaça descendo as ruas de Santa Teresa direto para os Arcos da Lapa.',
      neighborhood: 'Lapa',
      mapsQuery: 'Arcos da Lapa Rio de Janeiro',
      tip: 'Rua do Lavradio e Avenida Mem de Sá concentram casas de samba tradicionais como Rio Scenarium e Carioca da Gema.',
    },
  },
  {
    dayNumber: '06',
    date: '21/11',
    weekday: 'Sábado',
    regionKey: 'zona-sul',
    regionLabel: 'Zona Sul · Arpoador & Copacabana',
    headline: 'Dia de Praia no Arpoador & Noite em Copacabana',
    morning: {
      id: 'd6-m',
      period: 'Manhã / Tarde',
      title: 'Praia e Pedra do Arpoador',
      description: 'Dia completo de praia finalizando com o clássico pôr do sol aplaudido na Pedra do Arpoador.',
      neighborhood: 'Arpoador / Ipanema',
      mapsQuery: 'Pedra do Arpoador Rio de Janeiro',
      tip: 'Chegue na pedra 40 minutos antes do pôr do sol para escolher um bom ponto sobre as rochas.',
    },
    evening: {
      id: 'd6-n',
      period: 'Noite',
      title: 'Copacabana · Galeto Sat’s',
      description: 'Jantar rápido (como o clássico Galeto Sat’s) ou noite caminhando pelo calçadão de pedras portuguesas.',
      neighborhood: 'Copacabana',
      mapsQuery: 'Galeto Sats Copacabana Rio de Janeiro',
    },
  },
  {
    dayNumber: '07',
    date: '22/11',
    weekday: 'Domingo',
    regionKey: 'zona-norte',
    regionLabel: 'Zona Norte · São Cristóvão',
    headline: 'Feira de São Cristóvão & Noite de Despedida',
    morning: {
      id: 'd7-m',
      period: 'Manhã / Tarde',
      title: 'Feira de São Cristóvão',
      description:
        'Dia perfeito para almoçar comida nordestina autêntica, comprar produtos regionais e ouvir forró e música ao vivo.',
      neighborhood: 'São Cristóvão',
      mapsQuery: 'Feira de Sao Cristovao Rio de Janeiro',
      tip: 'O Centro Luiz Gonzaga de Tradições Nordestinas ganha vida no almoço de domingo; experimente carne de sol com macaxeira.',
    },
    evening: {
      id: 'd7-n',
      period: 'Noite',
      title: 'Despedida tranquila',
      description: 'Noite calma para descansar, organizar compras e arrumar as malas.',
      neighborhood: 'Hospedagem',
      mapsQuery: 'Rio de Janeiro',
    },
  },
  {
    dayNumber: '08',
    date: '23/11',
    weekday: 'Segunda-feira',
    regionKey: 'zona-norte',
    regionLabel: 'Retorno',
    headline: 'Preparativos Finais & Viagem de Retorno',
    morning: {
      id: 'd8-m',
      period: 'Manhã / Tarde',
      title: 'Check-out & Embarque',
      description: 'Preparativos finais, conferência de bagagens e deslocamento para o aeroporto ou rodoviária.',
      neighborhood: 'Aeroporto / Rodoviária',
      mapsQuery: 'Aeroporto Santos Dumont Rio de Janeiro',
      tip: 'Considere o trânsito da manhã de segunda-feira rumo ao Galeão ou Santos Dumont e saia com antecedência.',
    },
  },
];

export const ZONE_NODES: ZoneNode[] = [
  {
    id: 'sao-cristovao',
    name: 'São Cristóvão',
    subtitle: 'Feira Nordestina',
    regionKey: 'zona-norte',
    x: 245,
    y: 88,
    days: ['22/11 (Dom)'],
    connectionNote: 'Fácil acesso via Metrô (Estação São Cristóvão) ou carro pela Linha Vermelha/Av. Brasil.',
  },
  {
    id: 'pedra-do-sal',
    name: 'Pedra do Sal & Porto',
    subtitle: 'Samba de Segunda · Museu do Amanhã',
    regionKey: 'centro-st',
    x: 365,
    y: 122,
    days: ['16/11 (Seg noite)', '18/11 (Qua opção)'],
    connectionNote: 'Região portuária revitalizada conectada pelo VLT Carioca entre Praça Mauá, Saúde e Centro.',
  },
  {
    id: 'santa-teresa-lapa',
    name: 'Santa Teresa · Selarón · Lapa',
    subtitle: 'Conexão direta ladeira abaixo',
    regionKey: 'centro-st',
    x: 342,
    y: 175,
    days: ['20/11 (Sex dia e noite)'],
    connectionNote: 'Fluxo contínuo a pé: fotos na Escadaria Selarón, subida para almoço em Santa Teresa e descida direto para os Arcos da Lapa.',
  },
  {
    id: 'cristo',
    name: 'Corcovado · Cristo Redentor',
    subtitle: 'Trem do Corcovado / Paineiras',
    regionKey: 'centro-st',
    x: 245,
    y: 230,
    days: ['16/11 (Seg manhã)'],
    connectionNote: 'Acesso pelo Cosme Velho (trem) ou vans oficiais em Copacabana/Largo do Machado.',
  },
  {
    id: 'pao-de-acucar',
    name: 'Urca & Pão de Açúcar',
    subtitle: 'Bondinho ao entardecer · Botafogo',
    regionKey: 'zona-sul',
    x: 410,
    y: 252,
    days: ['19/11 (Qui tarde/noite)'],
    connectionNote: 'Praia Vermelha (Urca) fica a apenas 10 minutos de carro dos bares de Botafogo.',
  },
  {
    id: 'jardim-botanico',
    name: 'Jardim Botânico & Parque Lage',
    subtitle: 'Aléias e Mata Atlântica · Gávea',
    regionKey: 'zona-sul',
    x: 215,
    y: 295,
    days: ['17/11 (Ter)', '19/11 (Baixo Gávea)'],
    connectionNote: 'Jardim Botânico e Parque Lage são vizinhos na mesma avenida, próximos ao Baixo Gávea.',
  },
  {
    id: 'arpoador-copa',
    name: 'Ipanema · Arpoador · Copacabana',
    subtitle: 'Praias, pôr do sol e Galeto Sat’s',
    regionKey: 'zona-sul',
    x: 318,
    y: 344,
    days: ['18/11 (Qua opção)', '21/11 (Sáb)'],
    connectionNote: 'Orla contínua: a Pedra do Arpoador conecta exatamente o fim de Ipanema ao início de Copacabana.',
  },
];

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-1',
    label: 'Comprar ingresso antecipado do Trem do Corcovado / Van Cristo (16/11)',
    category: 'Ingressos',
    done: false,
  },
  {
    id: 'chk-2',
    label: 'Reservar horário do Bondinho Pão de Açúcar para o meio da tarde (19/11)',
    category: 'Ingressos',
    done: false,
  },
  {
    id: 'chk-3',
    label: 'Separar dinheiro trocado e habilitar Pix para a Pedra do Sal e Feira de São Cristóvão',
    category: 'Pagamentos',
    done: false,
  },
  {
    id: 'chk-4',
    label: 'Levar tênis confortável para caminhar no Jardim Botânico, Santa Teresa e Lapa',
    category: 'Bagagem',
    done: false,
  },
  {
    id: 'chk-5',
    label: 'Protetor solar, óculos escuros e canga para Ipanema e Arpoador',
    category: 'Praia',
    done: false,
  },
  {
    id: 'chk-6',
    label: 'Confirmar se quarta-feira (18/11) será Praia de Ipanema ou Museu do Amanhã',
    category: 'Planejamento',
    done: false,
  },
];

export const SUGGESTED_PLACES: SuggestedPlace[] = [
  {
    id: 'sug-mureta-urca',
    name: 'Mureta da Urca & Bar Urca',
    neighborhood: 'Urca',
    category: 'gastronomia',
    categoryLabel: 'Gastronomia & Bares',
    note: 'Pastel de siri e cerveja na mureta de frente para a Baía de Guanabara.',
    mapsQuery: 'Bar Urca Rio de Janeiro',
    suggestedDay: '04',
  },
  {
    id: 'sug-mirante-dona-marta',
    name: 'Mirante Dona Marta',
    neighborhood: 'Santa Teresa / Cosme Velho',
    category: 'praias',
    categoryLabel: 'Praias & Mirantes',
    note: 'Vista panorâmica gratuita para Cristo, Pão de Açúcar e Lagoa.',
    mapsQuery: 'Mirante Dona Marta Rio de Janeiro',
    suggestedDay: '01',
  },
  {
    id: 'sug-confeitaria-colombo',
    name: 'Confeitaria Colombo',
    neighborhood: 'Centro',
    category: 'gastronomia',
    categoryLabel: 'Gastronomia & Bares',
    note: 'Salão histórico de 1894 para café da manhã ou lanche da tarde.',
    mapsQuery: 'Confeitaria Colombo Centro Rio de Janeiro',
    suggestedDay: '03',
  },
  {
    id: 'sug-real-gabinete',
    name: 'Real Gabinete Português de Leitura',
    neighborhood: 'Centro',
    category: 'cultura',
    categoryLabel: 'Cultura & História',
    note: 'Biblioteca histórica no centro, a poucos minutos a pé da Lapa.',
    mapsQuery: 'Real Gabinete Portugues de Leitura Rio de Janeiro',
    suggestedDay: '05',
  },
  {
    id: 'sug-forte-copacabana',
    name: 'Forte de Copacabana',
    neighborhood: 'Copacabana / Arpoador',
    category: 'cultura',
    categoryLabel: 'Cultura & História',
    note: 'Café da manhã na Confeitaria Colombo do Forte com vista para a orla.',
    mapsQuery: 'Forte de Copacabana Rio de Janeiro',
    suggestedDay: '06',
  },
  {
    id: 'sug-lagoa',
    name: 'Ciclovia da Lagoa Rodrigo de Freitas',
    neighborhood: 'Lagoa',
    category: 'praias',
    categoryLabel: 'Praias & Mirantes',
    note: 'Caminhada ou bicicleta no fim de tarde perto do Jardim Botânico.',
    mapsQuery: 'Lagoa Rodrigo de Freitas Rio de Janeiro',
    suggestedDay: '02',
  },
  {
    id: 'sug-praia-vermelha',
    name: 'Praia Vermelha & Pista Cláudio Coutinho',
    neighborhood: 'Urca',
    category: 'praias',
    categoryLabel: 'Praias & Mirantes',
    note: 'Mergulho rápido ou caminhada leve antes de subir o Bondinho.',
    mapsQuery: 'Praia Vermelha Urca Rio de Janeiro',
    suggestedDay: '04',
  },
  {
    id: 'sug-beco-sardinhas',
    name: 'Beco das Sardinhas',
    neighborhood: 'Centro / Saúde',
    category: 'gastronomia',
    categoryLabel: 'Gastronomia & Bares',
    note: 'Sardinhas na brasa e chope gelado antes da roda da Pedra do Sal.',
    mapsQuery: 'Beco das Sardinhas Rio de Janeiro',
    suggestedDay: '01',
  },
  {
    id: 'sug-parque-ruinas',
    name: 'Parque das Ruínas & Chácara do Céu',
    neighborhood: 'Santa Teresa',
    category: 'cultura',
    categoryLabel: 'Cultura & História',
    note: 'Mirante cultural para o Centro e Pão de Açúcar durante o passeio.',
    mapsQuery: 'Parque das Ruinas Santa Teresa Rio de Janeiro',
    suggestedDay: '05',
  },
  {
    id: 'sug-feirinha-ipanema',
    name: 'Feira Hippie de Ipanema',
    neighborhood: 'Ipanema (Praça General Osório)',
    category: 'cultura',
    categoryLabel: 'Cultura & História',
    note: 'Artesanato, quadros e lembranças aos domingos pela manhã.',
    mapsQuery: 'Feira Hippie de Ipanema Rio de Janeiro',
    suggestedDay: '07',
  },
  {
    id: 'sug-praia-leblon',
    name: 'Mirante do Leblon',
    neighborhood: 'Leblon',
    category: 'praias',
    categoryLabel: 'Praias & Mirantes',
    note: 'Deque de madeira no canto da praia com vista para toda a orla.',
    mapsQuery: 'Mirante do Leblon Rio de Janeiro',
    suggestedDay: '03',
  },
  {
    id: 'sug-cafe-parque-lage',
    name: 'Bistrô Plage no Parque Lage',
    neighborhood: 'Jardim Botânico',
    category: 'gastronomia',
    categoryLabel: 'Gastronomia & Bares',
    note: 'Café ao redor da piscina do palacete após o Jardim Botânico.',
    mapsQuery: 'Parque Lage Rio de Janeiro',
    suggestedDay: '02',
  },
];

