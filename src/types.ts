export type ContentType = 'Cursos Online' | 'E-books' | 'Arquivos' | 'Masterclass' | 'Mentores' | 'Todas';

export type Category = 
  | 'Todas'
  | 'Kandengues'
  | 'Estilo de vida'
  | 'Finanças'
  | 'Desenvolvimento pessoal'
  | 'Beleza & Decoração'
  | 'Marketing & vendas'
  | 'Saúde'
  | 'TI & Software'
  | 'Comunicação'
  | 'Cidadania'
  | 'Fotografia & Arte'
  | 'Moda'
  | 'Profissões'
  | 'Música & Vídeo'
  | 'Economia'
  | 'Fitness'
  | 'Académico'
  | 'Direito'
  | 'Negócio'
  | 'Outros';

export interface CourseModule {
  title: string;
  duration: string;
  lessons: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  youtubeUrl?: string;
  contentUrl?: string;
  duration?: string;
  preview?: boolean;
}

export interface CatalogItem {
  id: string;
  title: string;
  subtitle?: string;
  category: Category;
  contentType: ContentType;
  price: number; // in AOA (0 for Free)
  originalPrice?: number;
  badge?: 'Premium' | 'Popular' | 'Novo' | 'Oferta' | 'Utilidade' | 'Hot';
  discountBadge?: string; // e.g. "-30%"
  lessonsCount?: number;
  durationHours?: number;
  format?: 'Vídeo' | 'PDF Livre' | 'Ficheiros' | 'Ao Vivo';
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  rating: number; // 1-5
  ratingCount?: number;
  image: string;
  description: string;
  // Learning resource links and optional browser-local demo upload.
  youtubeUrl?: string;
  contentUrl?: string;
  resourceAssetId?: string;
  resourceAssetName?: string;
  resourceAssetType?: string;
  modules?: CourseModule[];
  lessons?: CourseLesson[];
  completedLessonIds?: string[];
  level?: 'Iniciante' | 'Intermédio' | 'Avançado' | 'Todos os Níveis';
  approvalStatus?: 'Publicado' | 'Pendente' | 'Rejeitado';
  rejectionReason?: string;
  creatorEmail?: string;
  createdAt?: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  publishedCount: number;
  bio: string;
  specialty: string;
  rating: number;
}

export interface Masterclass {
  id: string;
  title: string;
  type: 'Masterclass' | 'Workshop' | 'Imersão';
  category: string;
  description: string;
  date?: string;
  instructor: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
  companyLogo?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Formador' | 'Aluno' | 'Afiliado';
  avatar?: string;
  status?: 'Ativo' | 'Pendente' | 'Bloqueado';
  earningsAOA?: number;
}

export interface CartItem {
  item: CatalogItem;
  quantity: number;
}

export interface ContactFormData {
  fullName: string;
  need: 'Comprar' | 'Ser Formador' | 'Afiliado' | 'Corp.';
  provinceCountry: string;
  fieldOfStudy: string;
  details: string;
}


export interface AuditLogEntry {
  id: string;
  action: 'Criado' | 'Editado' | 'Eliminado' | 'Aprovado' | 'Rejeitado' | 'Registado' | 'Papel alterado' | 'Estado alterado' | 'Sessão iniciada' | 'Sessão terminada';
  entityType: 'Conteúdo' | 'Utilizador' | 'Sessão';
  entityId?: string;
  description: string;
  actorName: string;
  actorEmail?: string;
  createdAt: string;
}
