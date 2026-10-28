import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  XCircle, 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Package, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  FileText,
  DollarSign,
  UploadCloud,
  Sparkles,
  UserCheck,
  Building,
  Layers,
  History,
  UserPlus,
  Ban,
  CheckCircle
} from 'lucide-react';
import { CatalogItem, Category, ContentType, User, AuditLogEntry } from '../types';
import { saveLocalAsset } from '../lib/localAssets';
import { apiUploadAsset } from '../lib/api';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogItems: CatalogItem[];
  onAddItem: (item: CatalogItem) => void | Promise<void>;
  onUpdateItem: (item: CatalogItem) => void | Promise<void>;
  onDeleteItem: (id: string) => void;
  onApproveItem: (id: string) => void;
  onRejectItem: (id: string, reason: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  usersList: User[];
  onUpdateUserRole: (userId: string, role: User['role']) => void;
  onUpdateUserStatus: (userId: string, status: NonNullable<User['status']>) => void;
  onUpdateUserDetails: (userId: string, changes: { name?: string; email?: string }) => void;
  onRemoveUser: (userId: string) => void;
  auditLogs: AuditLogEntry[];
  demoMode?: boolean;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  catalogItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onApproveItem,
  onRejectItem,
  currentUser,
  setCurrentUser,
  usersList,
  onUpdateUserRole,
  onUpdateUserStatus,
  onUpdateUserDetails,
  onRemoveUser,
  auditLogs,
  demoMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'catalog' | 'add_edit' | 'creator' | 'users' | 'audit'>(() => currentUser?.role === 'Administrador' ? 'approvals' : 'creator');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('Todos');
  const [filterCategory, setFilterCategory] = useState<string>('Todas');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [usersSearch, setUsersSearch] = useState('');
  const [usersStatusFilter, setUsersStatusFilter] = useState<string>('Todos');
  const [auditSearch, setAuditSearch] = useState('');

  // Form state for creating/editing items
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<{ id: string; reason: string } | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('Finanças');
  const [formContentType, setFormContentType] = useState<ContentType>('Cursos Online');
  const [formPrice, setFormPrice] = useState<number>(15000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(25000);
  const [formAuthorName, setFormAuthorName] = useState('TN Consultoria');
  const [formAuthorRole, setFormAuthorRole] = useState('Especialista em Gestão');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80');
  const [formDescription, setFormDescription] = useState('Formação prática completa concebida para o mercado angolano.');
  const [formBadge, setFormBadge] = useState<any>('Novo');
  const [formFormat, setFormFormat] = useState<any>('Vídeo');
  const [formYoutubeUrl, setFormYoutubeUrl] = useState('');
  const [formContentUrl, setFormContentUrl] = useState('');
  const [formLessonsText, setFormLessonsText] = useState('');
  const [formAssetId, setFormAssetId] = useState('');
  const [formAssetName, setFormAssetName] = useState('');
  const [formAssetType, setFormAssetType] = useState('');
  const [assetUploadMessage, setAssetUploadMessage] = useState('');

  useEffect(() => {
    if (currentUser?.role !== 'Administrador') {
      setActiveTab('creator');
    } else if (activeTab === 'creator') {
      setActiveTab('approvals');
    }
  }, [currentUser?.role]);

  if (!isOpen) return null;

  // Filter items pending approval
  const pendingItems = catalogItems.filter(i => i.approvalStatus === 'Pendente');
  const publishedItems = catalogItems.filter(i => i.approvalStatus === 'Publicado' || !i.approvalStatus);

  const filteredCatalog = catalogItems.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          i.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'Todos' || i.contentType === filterType;
    const matchesCategory = filterCategory === 'Todas' || i.category === filterCategory;
    const status = i.approvalStatus || 'Publicado';
    const matchesStatus = filterStatus === 'Todos' || status === filterStatus;
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });
  const filteredUsers = usersList.filter((u) => {
    const q = usersSearch.trim().toLowerCase();
    return (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (usersStatusFilter === 'Todos' || (u.status || 'Ativo') === usersStatusFilter);
  });
  const filteredAuditLogs = auditLogs.filter((entry) => {
    const q = auditSearch.trim().toLowerCase();
    return !q || [entry.actorName, entry.actorEmail || '', entry.action, entry.entityType, entry.description].some((value) => value.toLowerCase().includes(q));
  });

  const handleEditUserDetails = (target: User) => {
    const name = prompt('Nome:', target.name);
    if (name === null) return;
    const email = prompt('Utilizador/e-mail:', target.email);
    if (email === null) return;
    if (!name.trim() || !email.trim()) {
      alert('O nome e o utilizador são obrigatórios.');
      return;
    }
    onUpdateUserDetails(target.id, { name: name.trim(), email: email.trim() });
  };

  const handleOpenAddForm = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('Finanças');
    setFormContentType('Cursos Online');
    setFormPrice(15000);
    setFormOriginalPrice(25000);
    setFormAuthorName(currentUser?.name || 'TN Consultoria');
    setFormAuthorRole('Formador Certificado');
    setFormImage('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80');
    setFormDescription('Descrição detalhada do conteúdo e objetivos de aprendizagem.');
    setFormYoutubeUrl('');
    setFormContentUrl('');
    setFormLessonsText('');
    setFormAssetId('');
    setFormAssetName('');
    setFormAssetType('');
    setAssetUploadMessage('');
    setActiveTab('add_edit');
  };

  const handleOpenEditForm = (item: CatalogItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormContentType(item.contentType);
    setFormPrice(item.price);
    setFormOriginalPrice(item.originalPrice || item.price * 1.5);
    setFormAuthorName(item.author.name);
    setFormAuthorRole(item.author.role || 'Formador');
    setFormImage(item.image);
    setFormDescription(item.description);
    setFormBadge(item.badge || 'Novo');
    setFormFormat(item.format || 'Vídeo');
    setFormYoutubeUrl(item.youtubeUrl || '');
    setFormContentUrl(item.contentUrl || '');
    setFormLessonsText((item.lessons || []).map((lesson) => [lesson.title, lesson.youtubeUrl || '', lesson.duration || ''].join(' | ')).join('\n'));
    setFormAssetId(item.resourceAssetId || '');
    setFormAssetName(item.resourceAssetName || '');
    setFormAssetType(item.resourceAssetType || '');
    setAssetUploadMessage(item.resourceAssetName ? 'Ficheiro associado: ' + item.resourceAssetName : '');
    setActiveTab('add_edit');
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formTitle.trim()) return;

    if (currentUser?.role !== 'Administrador' && currentUser?.role !== 'Formador') {
      alert('Apenas formadores ou administradores podem submeter conteúdos.');
      return;
    }
    if (currentUser?.role === 'Formador' && currentUser.status !== 'Ativo') {
      alert('A sua conta de formador aguarda aprovação do administrador.');
      return;
    }
    if (editingItem && currentUser?.role !== 'Administrador' && editingItem.creatorEmail?.toLowerCase() !== currentUser?.email.toLowerCase()) {
      alert('Só pode editar conteúdos da sua própria conta.');
      return;
    }

    const parsedLessons: NonNullable<CatalogItem['lessons']> = [];
    const lessonLines = formLessonsText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    for (let index = 0; index < lessonLines.length; index += 1) {
      const parts = lessonLines[index].split('|').map((part) => part.trim());
      if (!parts[0] || !parts[1]) {
        alert('Cada aula deve conter: Título | URL do YouTube | Duração (opcional).');
        return;
      }
      if (!/(youtube\.com|youtu\.be)/i.test(parts[1])) {
        alert('A aula "' + parts[0] + '" precisa de uma ligação do YouTube válida.');
        return;
      }
      parsedLessons.push({
        id: editingItem?.lessons?.[index]?.id || 'lesson-' + String(index + 1),
        title: parts[0],
        youtubeUrl: parts[1],
        duration: parts[2] || undefined,
      });
    }

    const newItemData: CatalogItem = {
      id: editingItem ? editingItem.id : `custom-${Date.now()}`,
      title: formTitle,
      category: formCategory,
      contentType: formContentType,
      price: Number(formPrice),
      originalPrice: Number(formOriginalPrice),
      badge: formBadge,
      format: formFormat,
      author: {
        name: formAuthorName,
        role: formAuthorRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      rating: editingItem ? editingItem.rating : 5.0,
      ratingCount: editingItem ? editingItem.ratingCount : 1,
      image: formImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      description: formDescription,
      youtubeUrl: formYoutubeUrl.trim() || undefined,
      contentUrl: formContentUrl.trim() || undefined,
      lessons: parsedLessons,
      resourceAssetId: formAssetId || undefined,
      resourceAssetName: formAssetName || undefined,
      resourceAssetType: formAssetType || undefined,
      // If Admin creates/edits -> Auto Publish. If Creator submits -> Set to Pendente!
      approvalStatus: currentUser?.role === 'Administrador' ? 'Publicado' : 'Pendente',
      creatorEmail: editingItem?.creatorEmail || currentUser?.email,
      createdAt: editingItem?.createdAt || new Date().toISOString(),
    };

    try {
      if (editingItem) await onUpdateItem(newItemData);
      else await onAddItem(newItemData);
    } catch {
      // The parent displays the API error; do not claim the save succeeded.
      return;
    }

    alert(demoMode
      ? 'Conteúdo guardado neste navegador (modo de demonstração).'
      : currentUser?.role === 'Administrador'
      ? 'Conteúdo guardado e publicado no catálogo.'
      : 'Submissão guardada. Aguarda aprovação do Administrador.');

    setActiveTab(currentUser?.role === 'Administrador' ? 'catalog' : 'creator');
  };

  // Demo user role switcher profiles
  const demoUsers: User[] = [
    { id: 'u1', name: 'Admin Principal', email: 'admin@tnconsultoria.ao', role: 'Administrador', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80' },
    { id: 'u2', name: 'Sarah Fontenot (Criadora)', email: 'sarah@formadores.ao', role: 'Formador', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
    { id: 'u3', name: 'António Silva (Aluno)', email: 'antonio@estudante.ao', role: 'Aluno', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Top Header & Persona Switcher */}
        <div className="bg-[#0c2340] text-white p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#185a7d] flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-outfit text-white">
                  Painel de Administração
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#e05822] text-white">
                  {currentUser?.role || 'Administrador'}
                </span>
              </div>
              <p className="text-xs text-slate-300">Gerir conteúdos e utilizadores.</p>
              {demoMode && <p className="mt-1 text-[10px] font-semibold text-amber-300">DEMO LOCAL · alterações neste navegador</p>}
            </div>
          </div>

          {/* Demo persona selector must never be exposed in a public production build. */}
          {import.meta.env.DEV && (
            <div className="flex flex-col gap-1.5 items-end">
              <span className="text-[10px] text-amber-300 font-semibold">Pré-visualização local — sem autenticação real</span>
              <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
                {demoUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      if (u.role === 'Administrador') setActiveTab('approvals');
                      else setActiveTab('creator');
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      currentUser?.email === u.email
                        ? 'bg-[#185a7d] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                    }`}
                  >
                    <span>{u.role === 'Administrador' ? 'Admin preview' : u.role === 'Formador' ? 'Criador preview' : 'Aluno preview'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#f8fafc] border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {currentUser?.role === 'Administrador' && (
            <>
              <button
                onClick={() => setActiveTab('approvals')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'approvals'
                    ? 'bg-[#0c2340] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-400" />
                Pendentes ({pendingItems.length})
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-[#0c2340] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Package className="w-4 h-4 text-sky-400" />
                Catálogo ({catalogItems.length})
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-[#0c2340] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                Utilizadores
              </button>
              <button onClick={() => setActiveTab('audit')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'audit' ? 'bg-[#0c2340] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                <History className="w-4 h-4" /> Registo ({auditLogs.length})
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('creator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'creator'
                ? 'bg-[#0c2340] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            Submissões
          </button>

          <button
            onClick={handleOpenAddForm}
            className="ml-auto bg-[#e05822] hover:bg-[#c84a1b] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">

          {/* 1. APPROVALS QUEUE TAB */}
          {activeTab === 'approvals' && currentUser?.role === 'Administrador' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-amber-900">
                      Submissões Aguardando Moderação
                    </h3>
                    <p className="text-xs text-amber-700">
                      Examine o conteúdo criado por instrutores e parceiros antes da sua publicação na loja.
                    </p>
                  </div>
                </div>
                <span className="text-sm font-black text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full">
                  {pendingItems.length} Pendentes
                </span>
              </div>

              {pendingItems.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-base font-bold text-[#0c2340]">Nenhuma submissão pendente</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Todos os conteúdos submetidos pelos criadores foram revistos e processados.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                            {item.contentType} • {item.category}
                          </span>
                          <span className="text-sm font-bold text-[#185a7d]">
                            {item.price === 0 ? 'Grátis' : `${item.price.toLocaleString()} Kz`}
                          </span>
                        </div>

                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt=""
                            className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-[#0c2340] leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500">
                              Autor: <strong>{item.author.name}</strong> ({item.author.role})
                            </p>
                            <p className="text-xs text-slate-600 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Approval / Rejection Controls */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleOpenEditForm(item)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Editar
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const reason = prompt('Motivo da rejeição:', 'Informações insuficientes ou fora das diretrizes.');
                              if (reason) onRejectItem(item.id, reason);
                            }}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-700 flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Rejeitar
                          </button>

                          <button
                            onClick={() => onApproveItem(item.id)}
                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            Aprovar & Publicar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. CATALOG MANAGEMENT TAB */}
          {activeTab === 'catalog' && currentUser?.role === 'Administrador' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar no catálogo..."
                    className="w-full bg-slate-100 rounded-xl py-2 pl-9 pr-3 text-xs text-[#0c2340] focus:outline-none focus:bg-white"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-slate-100 text-sm font-semibold text-[#0c2340] py-2 px-3 rounded-xl focus:outline-none cursor-pointer">
                    <option value="Todos">Todos os Formatos</option><option value="Cursos Online">Cursos Online</option><option value="E-books">E-books</option><option value="Arquivos">Arquivos & Minutas</option><option value="Masterclass">Masterclass</option>
                  </select>
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-slate-100 text-sm font-semibold text-[#0c2340] py-2 px-3 rounded-xl focus:outline-none cursor-pointer">
                    <option value="Todas">Todas as Categorias</option>
                    {Array.from(new Set(catalogItems.map((item) => item.category))).sort().map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-slate-100 text-sm font-semibold text-[#0c2340] py-2 px-3 rounded-xl focus:outline-none cursor-pointer">
                    <option value="Todos">Todos os Estados</option><option value="Publicado">Publicado</option><option value="Pendente">Pendente</option><option value="Rejeitado">Rejeitado</option>
                  </select>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3.5">Conteúdo</th>
                        <th className="p-3.5">Categoria</th>
                        <th className="p-3.5">Preço</th>
                        <th className="p-3.5">Estado</th>
                        <th className="p-3.5 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCatalog.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                              <div>
                                <h4 className="font-bold text-[#0c2340] line-clamp-1">{item.title}</h4>
                                <span className="text-[11px] text-slate-400">Por {item.author.name}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md text-[11px]">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-[#185a7d]">
                            {item.price === 0 ? 'Grátis' : `${item.price.toLocaleString()} Kz`}
                          </td>
                          <td className="p-3.5">
                            {item.approvalStatus === 'Publicado' || !item.approvalStatus ? (
                              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3" /> Publicado
                              </span>
                            ) : item.approvalStatus === 'Pendente' ? (
                              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1 w-fit">
                                <Clock className="w-3 h-3" /> Pendente
                              </span>
                            ) : (
                              <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1 w-fit">
                                <XCircle className="w-3 h-3" /> Rejeitado
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditForm(item)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors inline-block cursor-pointer"
                              title="Editar"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Tem a certeza que deseja eliminar "${item.title}"?`)) {
                                  onDeleteItem(item.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors inline-block cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. ADD / EDIT FORM TAB */}
          {activeTab === 'add_edit' && (currentUser?.role === 'Administrador' || currentUser?.role === 'Formador') && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base sm:text-lg font-bold text-[#0c2340]">
                  {editingItem ? 'Editar Entrada de Conteúdo' : 'Adicionar Novo Conteúdo ao Catálogo'}
                </h3>
                <span className="text-xs text-slate-400">
                  {currentUser?.role === 'Administrador' ? 'Modo Administrador (Publicação Direta)' : 'Submissão de Criador'}
                </span>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Título do Conteúdo *</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Ex: Curso Prático de Gestão Financeira em Luanda"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-[#0c2340] focus:outline-none focus:border-[#185a7d]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Tipo de Conteúdo</label>
                    <select
                      value={formContentType}
                      onChange={(e) => setFormContentType(e.target.value as ContentType)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-[#0c2340] focus:outline-none"
                    >
                      <option value="Cursos Online">Cursos Online</option>
                      <option value="E-books">E-books</option>
                      <option value="Arquivos">Arquivos & Minutas</option>
                      <option value="Masterclass">Masterclass</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Categoria</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as Category)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-[#0c2340] focus:outline-none"
                    >
                      <option value="Finanças">Finanças</option>
                      <option value="Direito">Direito</option>
                      <option value="Marketing & vendas">Marketing & Vendas</option>
                      <option value="TI & Software">TI & Software</option>
                      <option value="Economia">Economia</option>
                      <option value="Negócio">Negócio</option>
                      <option value="Desenvolvimento pessoal">Desenvolvimento Pessoal</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Preço Atual (Kz) - 0 para Grátis</label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-[#0c2340] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Preço Anterior (Riscado)</label>
                    <input
                      type="number"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-[#0c2340] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Nome do Autor/Formador</label>
                    <input
                      type="text"
                      required
                      value={formAuthorName}
                      onChange={(e) => setFormAuthorName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-[#0c2340] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Cargo/Especialidade do Autor</label>
                    <input
                      type="text"
                      value={formAuthorRole}
                      onChange={(e) => setFormAuthorRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-[#0c2340] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">URL da Imagem de Capa</label>
                    <input
                      type="url"
                      required
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-[#0c2340] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-3 sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Vídeo principal do YouTube (opcional)</label>
                      <input type="url" value={formYoutubeUrl} onChange={(e) => setFormYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-[#0c2340] focus:outline-none focus:border-[#185a7d]" />
                      <p className="text-[10px] leading-relaxed text-slate-500">Use "Não listado" (Unlisted), não "Privado": um vídeo privado só pode ser visto por contas Google convidadas individualmente e não funciona como aula aberta a todos os alunos.</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Aulas do curso (uma por linha)</label>
                      <textarea rows={4} value={formLessonsText} onChange={(e) => setFormLessonsText(e.target.value)} placeholder={"Introdução | https://youtu.be/ID_DO_VIDEO | 08:25\nMódulo 1 | https://youtube.com/watch?v=ID_DO_VIDEO | 12:40"} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-[#0c2340] focus:outline-none focus:border-[#185a7d]" />
                      <p className="text-[10px] leading-relaxed text-slate-500">Formato: Título da aula | URL do YouTube | Duração opcional. As aulas só serão devolvidas ao aluno depois da inscrição.</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Ligação HTTPS de material externo (opcional)</label>
                      <input type="url" value={formContentUrl} onChange={(e) => setFormContentUrl(e.target.value)} placeholder="https://..." className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-[#0c2340] focus:outline-none focus:border-[#185a7d]" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Carregar ficheiro</label>
                      <input type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip,.txt" onChange={async (e) => {
                        const file = e.currentTarget.files?.[0];
                        if (!file) return;
                        try {
                          const saved = demoMode ? await saveLocalAsset(file) : await apiUploadAsset(file);
                          setFormAssetId(saved.id);
                          setFormAssetName(saved.name);
                          setFormAssetType(saved.type);
                          setAssetUploadMessage((demoMode ? 'Ficheiro de demonstração no navegador: ' : 'Ficheiro guardado no armazenamento da plataforma: ') + saved.name + ' (' + Math.max(1, Math.round(saved.size / 1024)) + ' KB)');
                        } catch (error) {
                          alert(error instanceof Error ? error.message : 'Não foi possível guardar o ficheiro.');
                        }
                      }} className="w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[#e8eef2] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#0c2340]" />
                      {assetUploadMessage && <p className="text-[11px] text-emerald-700">{assetUploadMessage}</p>}
                      <p className="text-[10px] leading-relaxed text-slate-500">{demoMode ? "No modo de demonstração, o ficheiro fica apenas neste navegador." : "Os ficheiros ficam privados no R2 quando o armazenamento estiver configurado; vídeos são adicionados por ligação do YouTube."}</p>
                    </div>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Descrição Completa</label>
                    <textarea
                      rows={3}
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-[#0c2340] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab(currentUser?.role === 'Administrador' ? 'catalog' : 'creator')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#185a7d] hover:bg-[#12415b] text-white shadow-sm cursor-pointer"
                  >
                    {editingItem ? 'Atualizar Item' : currentUser?.role === 'Administrador' ? 'Publicar Agora' : 'Submeter para Aprovação'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. CREATOR PORTAL TAB */}
          {activeTab === 'creator' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#0c2340] to-[#185a7d] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${currentUser?.status === 'Ativo' ? 'bg-emerald-500' : 'bg-amber-500'} text-white`}>
                    {currentUser?.status === 'Ativo' ? 'Formador aprovado' : 'Candidatura em análise'}
                  </span>
                  <h3 className="text-xl font-bold font-outfit">
                    Bem-vindo, {currentUser?.name || 'Formador Partner'}
                  </h3>
                  <p className="text-sm text-slate-200 max-w-xl">
                    {currentUser?.status === 'Ativo'
                      ? 'Submeta novos cursos, acompanhe o estado da revisão e mantenha o seu catálogo actualizado.'
                      : 'O seu perfil de formador está em análise. O administrador precisa de aprovar a conta antes de poder submeter conteúdos.'}
                  </p>
                </div>

                <button
                  onClick={handleOpenAddForm}
                  disabled={currentUser?.role !== 'Administrador' && currentUser?.status !== 'Ativo'}
                  className="bg-white text-[#0c2340] hover:bg-[#e05822] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded-full text-sm font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  + Submeter Novo Conteúdo
                </button>
              </div>

              {/* Creator Submissions List */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-[#0c2340]">Minhas Submissões & Estado</h4>

                <div className="space-y-3">
                  {catalogItems.filter(i => i.creatorEmail?.toLowerCase() === currentUser?.email.toLowerCase()).length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">
                      Ainda não submeteu nenhum conteúdo com esta conta. Clique em "+ Submeter Novo Conteúdo" acima.
                    </div>
                  ) : (
                    catalogItems.filter(i => i.creatorEmail?.toLowerCase() === currentUser?.email.toLowerCase()).map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-200 shrink-0" />
                          <div className="min-w-0">
                            <h5 className="text-sm font-semibold text-[#26211e]">{item.title}</h5>
                            <span className="text-sm text-slate-500">{item.contentType} • {item.price.toLocaleString()} Kz</span>
                            {item.rejectionReason && item.approvalStatus === 'Rejeitado' && <p className="text-xs text-rose-700 mt-1">Motivo da rejeição: {item.rejectionReason}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {item.approvalStatus === 'Publicado' || !item.approvalStatus
                            ? <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-md">Publicado</span>
                            : item.approvalStatus === 'Pendente'
                            ? <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-md">Em análise</span>
                            : <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-1 rounded-md">Rejeitado</span>}
                          <button onClick={() => handleOpenEditForm(item)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 cursor-pointer" title="Editar e reenviar"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => { if (confirm(`Eliminar “${item.title}”?`)) onDeleteItem(item.id); }} className="p-2 rounded-lg text-rose-600 hover:bg-rose-100 cursor-pointer" title="Eliminar submissão"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 5. USERS MANAGEMENT TAB */}
          {activeTab === 'users' && currentUser?.role === 'Administrador' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-[#0c2340]">Gestão de Utilizadores Registados</h4>
                    <p className="text-sm text-slate-500 mt-1">{usersList.filter((u) => u.role === 'Formador' && u.status === 'Pendente').length} candidaturas de formador pendentes</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input value={usersSearch} onChange={(e) => setUsersSearch(e.target.value)} placeholder="Pesquisar nome ou e-mail..." className="bg-slate-100 text-sm rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#be462a]" />
                    <select value={usersStatusFilter} onChange={(e) => setUsersStatusFilter(e.target.value)} className="bg-slate-100 text-sm rounded-xl px-3 py-2">
                      <option value="Todos">Todos os estados</option><option value="Pendente">Pendente</option><option value="Ativo">Ativo</option><option value="Bloqueado">Bloqueado</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 uppercase text-xs">
                      <tr><th className="p-3">Nome</th><th className="p-3">E-mail</th><th className="p-3">Papel</th><th className="p-3">Estado</th><th className="p-3 text-right">Acções</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td className="p-3 font-semibold text-[#26211e]">{u.name}</td>
                          <td className="p-3 text-slate-500">{u.email}</td>
                          <td className="p-3">
                            <select value={u.role} onChange={(e) => onUpdateUserRole(u.id, e.target.value as User['role'])} disabled={u.id === currentUser?.id} className="bg-slate-100 text-sm font-semibold text-[#0c2340] p-2 rounded-lg focus:outline-none disabled:opacity-60">
                              <option value="Aluno">Aluno</option><option value="Formador">Formador / Criador</option><option value="Afiliado">Afiliado</option><option value="Administrador">Administrador</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${(u.status || 'Ativo') === 'Ativo' ? 'bg-emerald-50 text-emerald-700' : (u.status || 'Ativo') === 'Pendente' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>{u.status || 'Ativo'}</span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="inline-flex flex-wrap justify-end gap-1.5">
                              <button onClick={() => handleEditUserDetails(u)} title="Editar nome e e-mail" className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 text-xs font-semibold cursor-pointer"><Edit3 className="w-3.5 h-3.5" /> Editar</button>
                              {u.role === 'Formador' && u.status === 'Pendente' && <button onClick={() => onUpdateUserStatus(u.id, 'Ativo')} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white px-2.5 py-1.5 text-xs font-semibold cursor-pointer"><UserPlus className="w-3.5 h-3.5" /> Aprovar</button>}
                              {u.id !== currentUser?.id && <button onClick={() => onUpdateUserStatus(u.id, (u.status || 'Ativo') === 'Bloqueado' ? 'Ativo' : 'Bloqueado')} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 text-xs font-semibold cursor-pointer">{(u.status || 'Ativo') === 'Bloqueado' ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}{(u.status || 'Ativo') === 'Bloqueado' ? 'Activar' : 'Bloquear'}</button>}
                              {u.id !== currentUser?.id && <button onClick={() => { if (confirm(`Eliminar a conta de ${u.name}? Esta acção não pode ser anulada.`)) onRemoveUser(u.id); }} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer" title="Eliminar utilizador"><Trash2 className="w-4 h-4" /></button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && <tr><td colSpan={5} className="text-center p-8 text-slate-500">Nenhum utilizador corresponde aos filtros.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && currentUser?.role === 'Administrador' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div><h3 className="text-base font-bold text-[#0c2340]">Registo de Auditoria</h3><p className="text-sm text-slate-500 mt-1">Histórico das alterações registadas nesta instalação do navegador.</p></div>
                <input value={auditSearch} onChange={(e) => setAuditSearch(e.target.value)} placeholder="Pesquisar actividade..." className="bg-white border border-slate-200 text-sm rounded-xl py-2.5 px-3 sm:w-72 focus:outline-none focus:ring-1 focus:ring-[#be462a]" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[760px]">
                  <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide"><tr><th className="p-3">Data / Hora</th><th className="p-3">Utilizador</th><th className="p-3">Acção</th><th className="p-3">Objecto</th><th className="p-3">Detalhes</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAuditLogs.map((entry) => <tr key={entry.id} className="align-top hover:bg-slate-50">
                      <td className="p-3 whitespace-nowrap text-slate-500">{new Date(entry.createdAt).toLocaleString('pt-PT')}</td>
                      <td className="p-3"><div className="font-semibold text-[#26211e]">{entry.actorName}</div><div className="text-xs text-slate-500">{entry.actorEmail || '—'}</div></td>
                      <td className="p-3"><span className="rounded-full bg-[#f4eee8] px-2.5 py-1 text-xs font-semibold text-[#7b3524]">{entry.action}</span></td>
                      <td className="p-3 text-slate-600">{entry.entityType}{entry.entityId ? <div className="text-xs text-slate-400">{entry.entityId}</div> : null}</td>
                      <td className="p-3 text-slate-600">{entry.description}</td>
                    </tr>)}
                    {filteredAuditLogs.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-slate-500">Ainda não existem actividades registadas que correspondam à pesquisa.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}



        </div>
      </div>
    </div>
  );
};
