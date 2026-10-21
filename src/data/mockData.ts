import { CatalogItem, Mentor, Masterclass, Review, NewsArticle, Category } from '../types';

export const CATEGORIES_LIST: Category[] = [
  'Todas',
  'Kandengues',
  'Estilo de vida',
  'Finanças',
  'Desenvolvimento pessoal',
  'Beleza & Decoração',
  'Marketing & vendas',
  'Saúde',
  'TI & Software',
  'Comunicação',
  'Cidadania',
  'Fotografia & Arte',
  'Moda',
  'Profissões',
  'Música & Vídeo',
  'Economia',
  'Fitness',
  'Académico',
  'Direito',
  'Negócio',
  'Outros'
];

export const MOCK_CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'course-1',
    title: 'Oratória Estratégica',
    subtitle: 'Comunicação de Alto Impacto para Líderes e Profissionais',
    category: 'Comunicação',
    contentType: 'Cursos Online',
    price: 59900,
    badge: 'Premium',
    lessonsCount: 20,
    durationHours: 12,
    format: 'Vídeo',
    level: 'Avançado',
    author: {
      name: 'Dr. Manuel Neto',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Especialista em Comunicação'
    },
    rating: 5,
    ratingCount: 148,
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
    description: 'Aprenda as técnicas avançadas de persuasão, expressão verbal e linguagem corporal para dominar apresentações de negócios, palestras e negociações em Angola.',
    modules: [
      { title: 'Módulo 1: Fundamentos da Oratória de Alta Performance', duration: '2h 15m', lessons: 4 },
      { title: 'Módulo 2: Linguagem Corporal e Expressão Facial', duration: '3h 10m', lessons: 5 },
      { title: 'Módulo 3: Estruturação de Discursos e Storytelling', duration: '3h 45m', lessons: 6 },
      { title: 'Módulo 4: Gestão do Nervosismo e Perguntas Difíceis', duration: '2h 50m', lessons: 5 }
    ]
  },
  {
    id: 'course-2',
    title: 'Marketing Digital',
    subtitle: 'Estratégias de Conversão e Redes Sociais no Mercado Angolano',
    category: 'Marketing & vendas',
    contentType: 'Cursos Online',
    price: 25000,
    originalPrice: 35000,
    badge: 'Popular',
    discountBadge: '-28%',
    lessonsCount: 45,
    durationHours: 30,
    format: 'Vídeo',
    level: 'Todos os Níveis',
    author: {
      name: 'Albertina Silva',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Especialista em Tráfego Pago'
    },
    rating: 5,
    ratingCount: 320,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    description: 'Curso completo de Marketing Digital focado na realidade empresarial de Luanda e províncias. Venda mais pelo Instagram, WhatsApp Business, Facebook Ads e Google.',
    modules: [
      { title: 'Módulo 1: Posicionamento de Marca e Buyer Persona', duration: '5h', lessons: 8 },
      { title: 'Módulo 2: Copywriting e Criação de Conteúdo Virado a Vendas', duration: '8h', lessons: 12 },
      { title: 'Módulo 3: Anúncios Pagos no Meta Ads & WhatsApp Business', duration: '10h', lessons: 15 },
      { title: 'Módulo 4: Automação de Vendas e Funil de Conversão', duration: '7h', lessons: 10 }
    ]
  },
  {
    id: 'course-3',
    title: 'Excel Profissional',
    subtitle: 'Do Zero ao Dashboard Interativo para Finanças e Gestão',
    category: 'Finanças',
    contentType: 'Cursos Online',
    price: 37000,
    lessonsCount: 30,
    durationHours: 15,
    format: 'Vídeo',
    level: 'Intermédio',
    author: {
      name: 'Eng. Wilson Santos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Analista Financeiro Senior'
    },
    rating: 4.8,
    ratingCount: 210,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    description: 'Aprenda a criar relatórios dinâmicos, tabelas dinâmicas, PROCV, XLOOKUP, automações em VBA e dashboards financeiros de nível corporativo.',
    modules: [
      { title: 'Módulo 1: Fórmulas Avançadas e Lógica Condicional', duration: '4h', lessons: 8 },
      { title: 'Módulo 2: Tratamento de Dados e Tabelas Dinâmicas', duration: '4h', lessons: 8 },
      { title: 'Módulo 3: Construção de Dashboards Financeiros', duration: '4h', lessons: 8 },
      { title: 'Módulo 4: Análise Financeira Prática no Mercado Angolano', duration: '3h', lessons: 6 }
    ]
  },
  {
    id: 'course-4',
    title: 'Caminho das Vendas',
    subtitle: 'Prospecção, Fechamento e Fidelização de Clientes em Angola',
    category: 'Marketing & vendas',
    contentType: 'Cursos Online',
    price: 19000,
    originalPrice: 25000,
    badge: 'Novo',
    discountBadge: '-24%',
    lessonsCount: 18,
    durationHours: 8,
    format: 'Vídeo',
    level: 'Iniciante',
    author: {
      name: 'Paulo Cambuta',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Mentor de Negócios'
    },
    rating: 4.9,
    ratingCount: 94,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80',
    description: 'Um guia prático com metodologias testadas para superar objeções, acelerar negociações B2B e B2C e multiplicar o seu faturamento mensal.',
    modules: [
      { title: 'Módulo 1: Mentalidade de Vendedor Insuperável', duration: '2h', lessons: 4 },
      { title: 'Módulo 2: Técnicas de Contorno de Objeções de Preço', duration: '3h', lessons: 7 },
      { title: 'Módulo 3: Estratégias de Fechamento Rápido', duration: '3h', lessons: 7 }
    ]
  },
  {
    id: 'course-5',
    title: 'Desafio O Aprendiz',
    subtitle: 'Educação Financeira e Investimentos na Prática',
    category: 'Finanças',
    contentType: 'Cursos Online',
    price: 16989,
    originalPrice: 22000,
    badge: 'Hot',
    discountBadge: '-23%',
    lessonsCount: 15,
    durationHours: 5,
    format: 'Vídeo',
    level: 'Iniciante',
    author: {
      name: 'Cláudia Fontes',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'Consultora de Finanças Pessoais'
    },
    rating: 4.7,
    ratingCount: 112,
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    description: 'Saia das dívidas, organize o seu orçamento doméstico ou empresarial e descubra como fazer o seu dinheiro render com segurança em Kwanza.',
    modules: [
      { title: 'Módulo 1: Mapeamento de Gastos e Orçamento', duration: '1.5h', lessons: 5 },
      { title: 'Módulo 2: Reservas de Emergência e Proteção do Capital', duration: '1.5h', lessons: 5 },
      { title: 'Módulo 3: Ativos e Oportunidades Locais de Investimento', duration: '2h', lessons: 5 }
    ]
  },
  {
    id: 'ebook-1',
    title: 'Eu Me Escolhi',
    subtitle: 'Autoconhecimento, Autoestima e Desenvolvimento Pessoal',
    category: 'Desenvolvimento pessoal',
    contentType: 'E-books',
    price: 0,
    badge: 'Oferta',
    format: 'PDF Livre',
    author: {
      name: 'Dra. Nzinga Luvumbo',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'Psicóloga e Escritora'
    },
    rating: 5,
    ratingCount: 450,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    description: 'Um e-book inspirador para transformar a sua mentalidade, libertar-se de crenças limitantes e assumir o controlo do seu destino pessoal e profissional.'
  },
  {
    id: 'ebook-2',
    title: 'Como Vender Peixe',
    subtitle: 'Arte de Negociar em Mercados Competitivos e Criar Conexões',
    category: 'Marketing & vendas',
    contentType: 'E-books',
    price: 7999,
    format: 'PDF Livre',
    author: {
      name: 'Mateus Afonso',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      role: 'Empreendedor do Ano'
    },
    rating: 4.8,
    ratingCount: 189,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    description: 'Manual definitivo de negociação informal e formal. Aprenda a apresentar a sua proposta com autoridade, cativar clientes e fechar negócios em qualquer cenário.'
  },
  {
    id: 'file-1',
    title: 'Livro de Minutas Jurídicas',
    subtitle: 'Modelos Prontos de Contratos, Procurações e Requerimentos',
    category: 'Direito',
    contentType: 'Arquivos',
    price: 10000,
    badge: 'Utilidade',
    format: 'Ficheiros',
    author: {
      name: 'Gabinete de Apoio Jurídico',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      role: 'Juristas de Angola'
    },
    rating: 4.9,
    ratingCount: 230,
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    description: 'Mais de 50 modelos editáveis em Word com contratos de prestação de serviços, contratos de trabalho, arrendamento, estatutos de sociedade e minutas comerciais de acordo com a legislação angolana.'
  },
  {
    id: 'course-6',
    title: 'Kandengues Tech',
    subtitle: 'Programação de Jogos e Robótica para Crianças e Jovens',
    category: 'Kandengues',
    contentType: 'Cursos Online',
    price: 22000,
    lessonsCount: 16,
    durationHours: 10,
    format: 'Vídeo',
    level: 'Iniciante',
    author: {
      name: 'Prof. Pedro Domingos',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      role: 'Instrutor de Robótica'
    },
    rating: 5,
    ratingCount: 88,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    description: 'Inicie os seus filhos no mundo da lógica de programação, criação de jogos com Scratch e introdução à inteligência artificial de forma divertida e pedagógica.'
  },
  {
    id: 'course-7',
    title: 'Design & Decoração de Interiores',
    subtitle: 'Transforme Espaços Residenciais e Comerciais com Requinte',
    category: 'Beleza & Decoração',
    contentType: 'Cursos Online',
    price: 28000,
    lessonsCount: 24,
    durationHours: 14,
    format: 'Vídeo',
    level: 'Intermédio',
    author: {
      name: 'Arq. Yara da Costa',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
      role: 'Designer de Interiores'
    },
    rating: 4.7,
    ratingCount: 76,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
    description: 'Estudo de paletas de cores, iluminação ambiente, mobiliário sustentável e arranjo de espaços funcionais para o estilo de vida contemporâneo.'
  }
];

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Leslie Alexander',
    role: 'Especialista em Gestão Estratégica',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    publishedCount: 5,
    bio: 'Mais de 12 anos de experiência na capacitação de executivos e equipas de alta performance.',
    specialty: 'Gestão e Liderança',
    rating: 5.0
  },
  {
    id: 'mentor-2',
    name: 'Guy Hawkins',
    role: 'Mentor de Finanças e Mercados',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    publishedCount: 12,
    bio: 'Especializado em análise financeira, reestruturação de empresas e investimentos privados.',
    specialty: 'Finanças Corporativas',
    rating: 4.9
  },
  {
    id: 'mentor-3',
    name: 'Esther Howard',
    role: 'Consultora de Marketing & Branding',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    publishedCount: 10,
    bio: 'Ajudou mais de 100 marcas a posicionarem-se no topo das redes sociais e canais de vendas.',
    specialty: 'Marketing Digital',
    rating: 5.0
  },
  {
    id: 'mentor-4',
    name: 'Shikhon Islam',
    role: 'Arquiteto de Software & Cloud',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    publishedCount: 7,
    bio: 'Desenvolvedor Full Stack com paixão pelo ensino de tecnologia e inovação para a juventude.',
    specialty: 'TI & Engenharia de Software',
    rating: 4.8
  },
  {
    id: 'mentor-5',
    name: 'Kawser Ahmed',
    role: 'Especialista em Direito Comercial',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    publishedCount: 4,
    bio: 'Jurista focado em assessoria de empresas emergentes, propriedade intelectual e contratos.',
    specialty: 'Direito & Cidadania',
    rating: 4.9
  },
  {
    id: 'mentor-6',
    name: 'Brooklyn Simmons',
    role: 'Mentora de Oratória & Expressão',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    publishedCount: 15,
    bio: 'Preparadora vocal e de postura para líderes de opinião, jornalistas e empreendedores.',
    specialty: 'Comunicação e Oratória',
    rating: 5.0
  }
];

export const MOCK_MASTERCLASSES: Masterclass[] = [
  {
    id: 'mc-1',
    title: 'Gestão e Finanças',
    type: 'Masterclass',
    category: 'Negócio & Economia',
    description: 'Estratégias corporativas para empresas emergentes em Angola. Como gerir fluxo de caixa e captar investimento.',
    date: 'Próxima Quinta-feira, 18:00',
    instructor: 'Guy Hawkins'
  },
  {
    id: 'mc-2',
    title: 'Marketing Digital',
    type: 'Workshop',
    category: 'Marketing',
    description: 'Aprenda a aplicar estratégias de conversão no mercado angolano com foco no público-alvo local.',
    date: 'Sábado, 10:00',
    instructor: 'Esther Howard'
  },
  {
    id: 'mc-3',
    title: 'Direito Processual',
    type: 'Imersão',
    category: 'Direito',
    description: 'Análise prática de casos e tramitação de processos civis com estudo de jurisprudência recente em Luanda.',
    date: 'Terça-feira, 19:00',
    instructor: 'Kawser Ahmed'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'review-1',
    name: 'Ronald Richards',
    role: 'Marketing Coordinator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    comment: 'A plataforma Edunombre transformou completamente a minha abordagem profissional. A qualidade dos cursos de Marketing e Finanças no contexto de Angola é incomparável!',
    rating: 5,
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
  },
  {
    id: 'review-2',
    name: 'Dianne Russell',
    role: 'Project Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    comment: 'Uma das maiores vantagens da Edunombre é a facilidade de acesso a e-books e minutas jurídicas práticas. Consegui estruturar os processos da minha empresa em poucos dias.',
    rating: 5,
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
  },
  {
    id: 'review-3',
    name: 'Ronald Richards',
    role: 'Director de Operações',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    comment: 'Como formador, ter uma infraestrutura que trata do processamento de pagamentos e distribuição dos conteúdos para milhares de alunos em todo o país é extraordinário.',
    rating: 5,
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
  }
];

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'O Futuro da Educação Digital e do Aprendizado Híbrido em Angola',
    category: 'Actividades',
    date: '10 Feb, 2026',
    author: 'Admin Edunombre',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
    excerpt: 'Descubra como o ecossistema da Edunombre está a democratizar o acesso a especializações profissionais e a criar novas oportunidades de rendimento para formadores.'
  },
  {
    id: 'news-2',
    title: 'Como Monetizar o Seu Conhecimento Através de Cursos e Mentoria',
    category: 'Actividades',
    date: '20 Mar, 2026',
    author: 'Admin Edunombre',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
    excerpt: 'Passos fundamentais para transformar a sua experiência numa masterclass lucrativa e alcançar alunos em todas as províncias angolanas.'
  },
  {
    id: 'news-3',
    title: '5 Ferramentas Essenciais para Acelerar a Sua Carreira Profissional',
    category: 'Actividades',
    date: '14 Jun, 2026',
    author: 'Admin Edunombre',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
    excerpt: 'De oratória a gestão financeira: as competências mais procuradas pelas empresas no mercado nacional em 2026.'
  },
  {
    id: 'news-4',
    title: 'Programa de Afiliados Edunombre: Ganhe Comissões Recomendando Cursos',
    category: 'Actividades',
    date: '12 Mar, 2026',
    author: 'Admin Edunombre',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80',
    excerpt: 'Entenda como funciona o sistema de afiliados da plataforma e como criar links de recomendação para gerar renda passiva diária.'
  }
];
