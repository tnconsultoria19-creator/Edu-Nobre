import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FiltersBar } from './components/FiltersBar';
import { CourseCard } from './components/CourseCard';
import { AdBannerSection } from './components/AdBannerSection';
import { TeachersSection } from './components/TeachersSection';
import { DownloadsSection } from './components/DownloadsSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { PlatformAgencyFormModal } from './components/PlatformAgencyFormModal';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { UserLibraryModal } from './components/UserLibraryModal';

import { CatalogItem, Category, ContentType, CartItem, User, AuditLogEntry } from './types';
import { InvoiceModal } from './components/InvoiceModal';
import { MOCK_CATALOG_ITEMS } from './data/mockData';
import { BookOpen } from 'lucide-react';
import { apiArchiveProduct, apiCreateOrder, apiCreateProduct, apiListAudit, apiListLibrary, apiListProducts, apiListUsers, apiLogout, apiMe, apiRemoveUser, apiReviewProduct, apiUpdateProduct, apiUpdateUser, apiEnrollFree, getSessionToken, setSessionToken, OrderCreateResult } from './lib/api';

const readBrowserState = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeBrowserState = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Continue the current session if browser storage is disabled or full.
  }
};

// Temporary frontend-only demo; never use this mode with production data.
const DEMO_MODE = import.meta.env.DEV && import.meta.env.VITE_EDUNOBRE_DEMO_MODE !== 'false';
const DEMO_USERS: User[] = [
  { id: 'demo-admin', name: 'Admin Demo', email: 'admin@demo.local', role: 'Administrador', status: 'Ativo' },
  { id: 'demo-trainer', name: 'Formador Demo', email: 'formador@demo.local', role: 'Formador', status: 'Ativo' },
  { id: 'demo-student', name: 'Aluno Demo', email: 'aluno@demo.local', role: 'Aluno', status: 'Ativo' },
];

export function App() {
  // Global State
  const currency = 'AOA';
  const [user, setUser] = useState<User | null>(() => DEMO_MODE ? readBrowserState<User | null>('edunombre_demo_user_v1', null) : null);

  // Demo content and changes persist in this browser only.
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(() => DEMO_MODE ? readBrowserState<CatalogItem[]>('edunombre_demo_catalog_v1', MOCK_CATALOG_ITEMS) : []);
  const isDemoCatalog = DEMO_MODE;
  const [usersList, setUsersList] = useState<User[]>(() => DEMO_MODE ? readBrowserState<User[]>('edunombre_demo_users_v1', DEMO_USERS) : []);
  const [purchasedItems, setPurchasedItems] = useState<CatalogItem[]>(() => DEMO_MODE ? readBrowserState<CatalogItem[]>('edunombre_demo_library_v1', []) : []);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => DEMO_MODE ? readBrowserState<AuditLogEntry[]>('edunombre_demo_audit_v1', []) : []);
  const [catalogLoading, setCatalogLoading] = useState(!DEMO_MODE);
  const [catalogLoadError, setCatalogLoadError] = useState('');

  // Filters, Search & Sorting
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todas');
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('Todas');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNavTab, setActiveNavTab] = useState('catalogo');

  // Interactive Collections
  const [cartItems, setCartItems] = useState<CartItem[]>(() => readBrowserState('edunombre_cart_v1', []));
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => readBrowserState('edunombre_favourites_v1', []));
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // Modals & Drawers
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [userLibraryOpen, setUserLibraryOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formModalNeed, setFormModalNeed] = useState<string>('Comprar');
  const [formModalDetails, setFormModalDetails] = useState('');
  const [quickViewItem, setQuickViewItem] = useState<CatalogItem | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<{ order: OrderCreateResult; items: CartItem[] } | null>(null);
  const [checkoutBusy, setCheckoutBusy] = useState(false);

  useEffect(() => {
    if (DEMO_MODE) return;
    let alive = true;
    setCatalogLoading(true);
    Promise.all([
      apiListProducts(),
      getSessionToken() ? apiMe().catch(() => {
        setSessionToken(null);
        return { user: null as unknown as User };
      }) : Promise.resolve({ user: null as unknown as User }),
    ]).then(([catalog, auth]) => {
      if (!alive) return;
      setCatalogItems(catalog.items);
      setUser(auth.user || null);
      setCatalogLoadError('');
    }).catch((error) => {
      if (!alive) return;
      setCatalogItems([]);
      setCatalogLoadError(error instanceof Error ? error.message : 'Não foi possível carregar o catálogo.');
    }).finally(() => {
      if (alive) setCatalogLoading(false);
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!DEMO_MODE) return;
    writeBrowserState('edunombre_demo_catalog_v1', catalogItems);
    writeBrowserState('edunombre_demo_users_v1', usersList);
    writeBrowserState('edunombre_demo_audit_v1', auditLogs);
    writeBrowserState('edunombre_demo_library_v1', purchasedItems);
  }, [catalogItems, usersList, auditLogs, purchasedItems]);

  useEffect(() => writeBrowserState('edunombre_cart_v1', cartItems), [cartItems]);
  useEffect(() => writeBrowserState('edunombre_favourites_v1', wishlistIds), [wishlistIds]);

  useEffect(() => {
    if (!user || !userLibraryOpen) {
      if (!user) setPurchasedItems([]);
      return;
    }
    if (DEMO_MODE) {
      setPurchasedItems(readBrowserState<CatalogItem[]>('edunombre_demo_library_v1', []));
      return;
    }
    let alive = true;
    apiListLibrary().then((result) => {
      if (alive) setPurchasedItems(result.items);
    }).catch((error) => {
      if (alive) alert(error instanceof Error ? error.message : 'Não foi possível carregar a sua área de aprendizagem.');
    });
    return () => { alive = false; };
  }, [user?.id, userLibraryOpen]);

  // Comprehensive Filter & Sorting Logic (Only Published items show in store)
  const filteredCatalog = useMemo(() => {
    let result = catalogItems.filter((item) => {
      // Approval Status check: Only show Published items in the main store
      if (item.approvalStatus && item.approvalStatus !== 'Publicado') {
        return false;
      }
      if (showWishlistOnly && !wishlistIds.includes(item.id)) return false;
      // Category match
      if (selectedCategory !== 'Todas' && item.category !== selectedCategory) {
        return false;
      }
      // Content Type match
      if (selectedContentType !== 'Todas' && item.contentType !== selectedContentType) {
        return false;
      }
      // Price Filter match
      if (priceFilter === 'free' && item.price > 0) {
        return false;
      }
      if (priceFilter === 'paid' && item.price === 0) {
        return false;
      }
      // Search Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSub = item.subtitle?.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchAuthor = item.author.name.toLowerCase().includes(q);
        if (!matchTitle && !matchSub && !matchCat && !matchAuthor) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.ratingCount || 0) - (a.ratingCount || 0); // popular
    });
  }, [catalogItems, selectedCategory, selectedContentType, priceFilter, sortBy, searchQuery, showWishlistOnly, wishlistIds]);

  const addDemoAudit = (
    action: AuditLogEntry['action'],
    entityType: AuditLogEntry['entityType'],
    description: string,
    entityId?: string,
    actor: User | null = user,
  ) => {
    if (!DEMO_MODE) return;
    const entry: AuditLogEntry = {
      id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      action, entityType, entityId, description,
      actorName: actor?.name || 'Admin Demo',
      actorEmail: actor?.email,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((previous) => [entry, ...previous].slice(0, 200));
  };

  const refreshAdminData = async () => {
    if (DEMO_MODE || user?.role !== 'Administrador') return;
    try {
      const [users, logs] = await Promise.all([apiListUsers(), apiListAudit()]);
      setUsersList(users.users);
      setAuditLogs(logs);
    } catch (error) {
      console.error('Edu-Nobre: actualização administrativa falhou.', error);
    }
  };

  const handleAddItem = async (newItem: CatalogItem) => {
    if (DEMO_MODE) {
      const saved: CatalogItem = { ...newItem, approvalStatus: newItem.approvalStatus || 'Publicado' };
      setCatalogItems((previous) => [saved, ...previous.filter((item) => item.id !== saved.id)]);
      addDemoAudit('Criado', 'Conteúdo', `Criou “${saved.title}”.`, saved.id);
      return;
    }
    try {
      const saved = await apiCreateProduct(newItem);
      setCatalogItems((previous) => [saved, ...previous.filter((item) => item.id !== saved.id)]);
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível guardar o conteúdo.');
      throw error;
    }
  };

  const handleUpdateItem = async (updatedItem: CatalogItem) => {
    if (DEMO_MODE) {
      setCatalogItems((previous) => previous.map((item) => item.id === updatedItem.id ? updatedItem : item));
      addDemoAudit('Editado', 'Conteúdo', `Editou “${updatedItem.title}”.`, updatedItem.id);
      return;
    }
    try {
      const saved = await apiUpdateProduct(updatedItem);
      setCatalogItems((previous) => previous.map((item) => item.id === saved.id ? saved : item));
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível actualizar o conteúdo.');
      throw error;
    }
  };

  const handleDeleteItem = async (id: string) => {
    const target = catalogItems.find((item) => item.id === id);
    if (DEMO_MODE) {
      setCatalogItems((previous) => previous.filter((item) => item.id !== id));
      setCartItems((previous) => previous.filter((item) => item.item.id !== id));
      setWishlistIds((previous) => previous.filter((itemId) => itemId !== id));
      addDemoAudit('Eliminado', 'Conteúdo', `Eliminou “${target?.title || id}”.`, id);
      return;
    }
    try {
      await apiArchiveProduct(id);
      setCatalogItems((previous) => previous.filter((item) => item.id !== id));
      setCartItems((previous) => previous.filter((item) => item.item.id !== id));
      setWishlistIds((previous) => previous.filter((itemId) => itemId !== id));
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível arquivar o conteúdo.');
    }
  };

  const handleApproveItem = async (id: string) => {
    if (DEMO_MODE) {
      const target = catalogItems.find((item) => item.id === id);
      setCatalogItems((previous) => previous.map((item) => item.id === id ? { ...item, approvalStatus: 'Publicado', rejectionReason: undefined } : item));
      addDemoAudit('Aprovado', 'Conteúdo', `Publicou “${target?.title || id}”.`, id);
      return;
    }
    try {
      await apiReviewProduct(id, 'approve');
      const { items } = await apiListProducts();
      setCatalogItems(items);
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível aprovar o conteúdo.');
    }
  };

  const handleRejectItem = async (id: string, reason: string) => {
    if (DEMO_MODE) {
      const target = catalogItems.find((item) => item.id === id);
      setCatalogItems((previous) => previous.map((item) => item.id === id ? { ...item, approvalStatus: 'Rejeitado', rejectionReason: reason } : item));
      addDemoAudit('Rejeitado', 'Conteúdo', `Rejeitou “${target?.title || id}”: ${reason}`, id);
      return;
    }
    try {
      await apiReviewProduct(id, 'reject', reason);
      const { items } = await apiListProducts();
      setCatalogItems(items);
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível rejeitar o conteúdo.');
    }
  };

  const handleUpdateUserRole = async (userId: string, role: User['role']) => {
    const target = usersList.find((entry) => entry.id === userId);
    if (!target || target.id === user?.id) return;
    const status = role === 'Formador' && role !== target.role ? 'Pendente' : target.status;
    if (DEMO_MODE) {
      setUsersList((previous) => previous.map((entry) => entry.id === userId ? { ...entry, role, status } : entry));
      addDemoAudit('Papel alterado', 'Utilizador', `Alterou o papel de ${target.name} para ${role}.`, userId);
      return;
    }
    try {
      const saved = await apiUpdateUser(userId, { role, status });
      setUsersList((previous) => previous.map((entry) => entry.id === userId ? saved : entry));
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível alterar o papel.');
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: NonNullable<User['status']>) => {
    const target = usersList.find((entry) => entry.id === userId);
    if (!target || target.id === user?.id) return;
    if (DEMO_MODE) {
      setUsersList((previous) => previous.map((entry) => entry.id === userId ? { ...entry, status } : entry));
      addDemoAudit('Estado alterado', 'Utilizador', `Alterou o estado de ${target.name} para ${status}.`, userId);
      return;
    }
    try {
      const saved = await apiUpdateUser(userId, { role: target.role, status });
      setUsersList((previous) => previous.map((entry) => entry.id === userId ? saved : entry));
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível alterar o estado do utilizador.');
    }
  };

  const handleUpdateUserDetails = async (userId: string, changes: { name?: string; email?: string }) => {
    const target = usersList.find((entry) => entry.id === userId);
    if (!target) return;
    if (DEMO_MODE) {
      const updated = { ...target, ...changes };
      setUsersList((previous) => previous.map((entry) => entry.id === userId ? updated : entry));
      if (user?.id === userId) {
        setUser(updated);
        writeBrowserState('edunombre_demo_user_v1', updated);
      }
      addDemoAudit('Editado', 'Utilizador', `Editou os dados de ${target.name}.`, userId);
      return;
    }
  };

  const handleRemoveUser = async (userId: string) => {
    const target = usersList.find((entry) => entry.id === userId);
    if (!target || target.id === user?.id) return;
    if (DEMO_MODE) {
      setUsersList((previous) => previous.filter((entry) => entry.id !== userId));
      addDemoAudit('Eliminado', 'Utilizador', `Eliminou o utilizador ${target.name}.`, userId);
      return;
    }
    try {
      await apiRemoveUser(userId);
      setUsersList((previous) => previous.filter((entry) => entry.id !== userId));
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível bloquear o utilizador.');
    }
  };

  const handleOpenContent = (item: CatalogItem) => {
    if (!user) {
      setQuickViewItem(null);
      setAuthOpen(true);
      return;
    }
    if (DEMO_MODE) {
      const nextLibrary = [item, ...purchasedItems.filter((entry) => entry.id !== item.id)];
      writeBrowserState('edunombre_demo_library_v1', nextLibrary);
      setPurchasedItems(nextLibrary);
      setQuickViewItem(null);
      setUserLibraryOpen(true);
      return;
    }
    const enrolled = purchasedItems.some((entry) => entry.id === item.id);
    if (enrolled) {
      setQuickViewItem(null);
      setUserLibraryOpen(true);
      return;
    }
    if (item.price === 0) {
      apiEnrollFree(item.id).then(() => apiListLibrary()).then((result) => {
        setPurchasedItems(result.items);
        setQuickViewItem(null);
        setUserLibraryOpen(true);
      }).catch((error) => alert(error instanceof Error ? error.message : 'Não foi possível inscrever-se neste conteúdo.'));
      return;
    }
    setQuickViewItem(null);
    handleAddToCart(item);
    alert('Este curso é pago. Depois de gerar a pró-forma, o acesso será activado apenas após confirmação do pagamento.');
  };

  const handleSuccessfulLogin = (signedInUser: User) => {
    setUser(signedInUser);
    if (DEMO_MODE) {
      writeBrowserState('edunombre_demo_user_v1', signedInUser);
      setUsersList((previous) => [signedInUser, ...previous.filter((entry) => entry.id !== signedInUser.id)]);
      addDemoAudit('Sessão iniciada', 'Sessão', 'Sessão de demonstração iniciada.', undefined, signedInUser);
    } else {
      apiListProducts().then((result) => setCatalogItems(result.items)).catch((error) => {
        setCatalogLoadError(error instanceof Error ? error.message : 'Não foi possível actualizar o catálogo.');
      });
      if (signedInUser.role === 'Administrador') void refreshAdminData();
    }
    setAuthOpen(false);
  };

  const handleLogout = async () => {
    if (!DEMO_MODE) {
      try { await apiLogout(); }
      catch (error) { console.warn('A sessão local foi terminada, mas a API reportou um erro.', error); }
    } else {
      if (user) addDemoAudit('Sessão terminada', 'Sessão', 'Sessão de demonstração terminada.', undefined, user);
      writeBrowserState('edunombre_demo_user_v1', null);
    }
    setUser(null);
    setPurchasedItems([]);
    setSessionToken(null);
  };

  // Cart / Direct Purchase Handlers (Kubeta.ao style)
  const handleAddToCart = (item: CatalogItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.item.id !== id));
  };

  // Wishlist Handler
  const handleToggleWishlist = (item: CatalogItem) => {
    setWishlistIds((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  };

  const handleOpenForm = (need: string = 'Comprar', details: string = '') => {
    setFormModalNeed(need);
    setFormModalDetails(details);
    setFormModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a1a1a]">
      {/* 2. Main Navigation Header */}
      <Header
        cartItems={cartItems}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => {
          setSelectedCategory('Todas');
          setSelectedContentType('Todas');
          setShowWishlistOnly((current) => !current);
          const elem = document.getElementById('catalogo-grid');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenFormModal={() => handleOpenForm('Comprar')}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenAdminPortal={() => setAdminPortalOpen(true)}
        onOpenUserLibrary={() => setUserLibraryOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        catalogItems={catalogItems}
        onSelectItem={(item) => setQuickViewItem(item)}
        activeNavTab={activeNavTab}
        setActiveNavTab={setActiveNavTab}
        currentUser={user}
        onLogout={handleLogout}
      />

      {/* 3. Hero Section with Background Image */}
      <Hero
        onExploreClick={() => {
          const elem = document.getElementById('catalogo');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
        onFormadorClick={() => handleOpenForm('Ser Formador')}
      />

      {/* Main page content below the hero stays pure white. */}
      <div className="flex-1 bg-white">
        {/* Top Categories Showcase */}
        {/* Catalog Grid & Filters Section */}
        <section id="catalogo-grid" className="py-6 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
            {/* Filters Bar Component */}
            <FiltersBar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedContentType={selectedContentType}
              setSelectedContentType={setSelectedContentType}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalResults={filteredCatalog.length}
              showWishlistOnly={showWishlistOnly}
              setShowWishlistOnly={setShowWishlistOnly}
            />

            {/* Catalog Grid */}
            {!DEMO_MODE && catalogLoadError && (
              <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                Não foi possível ligar ao catálogo real: {catalogLoadError}. Os cursos de demonstração não serão apresentados como conteúdo real.
              </div>
            )}
            {!DEMO_MODE && catalogLoading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">A carregar cursos publicados…</div>
            ) : filteredCatalog.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
                <BookOpen className="w-10 h-10 text-[#858586] mx-auto" />
                <h3 className="text-lg font-bold text-[#0c2340]">Nenhum item encontrado</h3>
                <p className="text-xs text-[#858586]">
                  Tente alterar os filtros ou pesquisar por outros termos.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('Todas');
                    setSelectedContentType('Todas');
                    setShowWishlistOnly(false);
                    setPriceFilter('all');
                    setSearchQuery('');
                  }}
                  className="border border-[#185a7d] bg-white text-[#185a7d] text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer hover:border-[#0c2340] hover:text-[#0c2340] transition-colors"
                >
                  Ver Todos os Cursos e Livros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredCatalog.map((item) => (
                  <CourseCard
                    key={item.id}
                    item={item}
                    onAddToCart={(i) => (user ? handleAddToCart(i) : setAuthOpen(true))}
                    onToggleWishlist={user ? handleToggleWishlist : undefined}
                    isWishlisted={user ? wishlistIds.includes(item.id) : false}
                    onQuickView={(i) => setQuickViewItem(i)}
                    currency={currency}
                    demoMode={isDemoCatalog}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Elegant Section Divider */}
        <div className="max-w-7xl mx-auto px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
        </div>

        {/* 5. Teachers & Authors Section (Faithful Replica of Uploaded Image) */}
        <TeachersSection />

        {/* 6. Advertising Card Section (Sponsored / Partner Showcase) */}
        <AdBannerSection onAdClick={() => handleOpenForm('Parceria')} />

        {/* Elegant Section Divider */}
        <div className="max-w-7xl mx-auto px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
        </div>

        {/* 7. Downloads & Resources Section with Previews */}
        <DownloadsSection items={catalogItems} onOpenItem={handleOpenContent} />
      </div>

      {/* 6. Footer */}
      <Footer />

      {/* Modals & Direct Purchase Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        busy={checkoutBusy}
        onOpenFormModal={async (_need, _details, paymentMethod) => {
          if (!user) { setAuthOpen(true); return; }
          if (DEMO_MODE) {
            alert('A criação de pedidos e os pagamentos estão desactivados no modo de demonstração.');
            return;
          }
          if (checkoutBusy || cartItems.length === 0) return;
          setCheckoutBusy(true);
          const itemsSnapshot = cartItems.map(({ item, quantity }) => ({ item, quantity }));
          try {
            const order = await apiCreateOrder(
              itemsSnapshot.map(({ item, quantity }) => ({ productId: item.id, quantity })),
              'platform',
              paymentMethod || 'multicaixa_express'
            );
            setInvoiceOrder({ order, items: itemsSnapshot });
            setCartItems([]);
            setCartOpen(false);
          } catch (error) {
            alert(error instanceof Error ? error.message : 'Não foi possível criar a pró-forma.');
          } finally {
            setCheckoutBusy(false);
          }
        }}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={handleSuccessfulLogin}
        demoMode={DEMO_MODE}
      />

      <InvoiceModal
        order={invoiceOrder?.order || null}
        items={invoiceOrder?.items || []}
        onClose={() => setInvoiceOrder(null)}
      />

      <div id="aderir">
        <PlatformAgencyFormModal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          defaultNeed={formModalNeed}
          defaultDetails={formModalDetails}
        />
      </div>

      <ItemDetailsModal
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onAddToCart={(item) => (user ? handleAddToCart(item) : setAuthOpen(true))}
        onOpenFormModal={handleOpenForm}
        onOpenContent={handleOpenContent}
        demoMode={isDemoCatalog}
      />

      <AdminPortalModal
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
        catalogItems={catalogItems}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onApproveItem={handleApproveItem}
        onRejectItem={handleRejectItem}
        currentUser={user}
        setCurrentUser={(nextUser) => { setUser(nextUser); }}
        usersList={usersList}
        onUpdateUserRole={handleUpdateUserRole}
        onUpdateUserStatus={handleUpdateUserStatus}
        onUpdateUserDetails={handleUpdateUserDetails}
        onRemoveUser={handleRemoveUser}
        auditLogs={auditLogs}
        demoMode={DEMO_MODE}
      />

      <UserLibraryModal
        isOpen={userLibraryOpen}
        onClose={() => setUserLibraryOpen(false)}
        purchasedItems={purchasedItems}
        currentUser={user}
        demoMode={DEMO_MODE}
      />
    </div>
  );
}

export default App;
