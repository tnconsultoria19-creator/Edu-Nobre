import React, { useState, useMemo, useEffect } from 'react';
import { HeaderTop } from './components/HeaderTop';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryShowcase } from './components/CategoryShowcase';
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
import { BookOpen } from 'lucide-react';
import { apiArchiveProduct, apiCreateOrder, apiCreateProduct, apiListAudit, apiListLibrary, apiListProducts, apiListUsers, apiLogout, apiMe, apiRemoveUser, apiReviewProduct, apiUpdateProduct, apiUpdateUser, getSessionToken, setSessionToken } from './lib/api';

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

export function App() {
  // Global State
  const [currency, setCurrency] = useState('AOA');
  const [language, setLanguage] = useState('Português (AO)');
  const [user, setUser] = useState<User | null>(null);

  // Dynamic Catalog State
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);

  // Users List State for Admin Management
  const [usersList, setUsersList] = useState<User[]>(() => readBrowserState('edunombre_users_v2', []));

  // Purchased Items Library State
  const [purchasedItems, setPurchasedItems] = useState<CatalogItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

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

  useEffect(() => {
    let active = true;
    if (!getSessionToken()) return () => { active = false; };
    apiMe().then(({ user: restoredUser }) => { if (active) setUser(restoredUser); })
      .catch(() => { if (active) setSessionToken(null); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    apiListProducts()
      .then(({ items }) => { if (active) setCatalogItems(items); })
      .catch((error) => console.error('Edu-Nobre: não foi possível carregar o catálogo.', error));
    return () => { active = false; };
  }, [user?.id, user?.role]);

  useEffect(() => {
    let active = true;
    if (user?.role === 'Administrador') {
      Promise.all([apiListUsers(), apiListAudit()])
        .then(([users, logs]) => {
          if (!active) return;
          setUsersList(users.users);
          setAuditLogs(logs);
        })
        .catch((error) => console.error('Edu-Nobre: não foi possível carregar a gestão administrativa.', error));
    } else {
      setUsersList([]);
      setAuditLogs([]);
    }
    return () => { active = false; };
  }, [user?.id, user?.role]);

  useEffect(() => {
    let active = true;
    if (user && userLibraryOpen) {
      apiListLibrary().then(({ items }) => { if (active) setPurchasedItems(items); })
        .catch((error) => console.error('Edu-Nobre: não foi possível carregar a biblioteca.', error));
    } else if (!user) {
      setPurchasedItems([]);
    }
    return () => { active = false; };
  }, [user?.id, userLibraryOpen]);

  useEffect(() => writeBrowserState('edunombre_cart_v1', cartItems), [cartItems]);
  useEffect(() => writeBrowserState('edunombre_favourites_v1', wishlistIds), [wishlistIds]);

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

  const refreshAdminData = async () => {
    if (user?.role !== 'Administrador') return;
    try {
      const [users, logs] = await Promise.all([apiListUsers(), apiListAudit()]);
      setUsersList(users.users);
      setAuditLogs(logs);
    } catch (error) {
      console.error('Edu-Nobre: actualização administrativa falhou.', error);
    }
  };

  const handleAddItem = async (newItem: CatalogItem) => {
    try {
      const saved = await apiCreateProduct(newItem);
      setCatalogItems((prev) => [saved, ...prev.filter((item) => item.id !== saved.id)]);
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível guardar o conteúdo.');
      throw error;
    }
  };

  const handleUpdateItem = async (updatedItem: CatalogItem) => {
    try {
      const saved = await apiUpdateProduct(updatedItem);
      setCatalogItems((prev) => prev.map((item) => item.id === saved.id ? saved : item));
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível actualizar o conteúdo.');
      throw error;
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await apiArchiveProduct(id);
      setCatalogItems((prev) => prev.filter((item) => item.id !== id));
      setCartItems((prev) => prev.filter((item) => item.item.id !== id));
      setWishlistIds((prev) => prev.filter((itemId) => itemId !== id));
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível arquivar o conteúdo.');
    }
  };

  const handleApproveItem = async (id: string) => {
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
    if (!target) return;
    const status = role === 'Formador' && role !== target.role ? 'Pendente' : target.status;
    try {
      const saved = await apiUpdateUser(userId, { role, status });
      setUsersList((prev) => prev.map((entry) => entry.id === userId ? saved : entry));
      if (user?.id === userId) setUser(saved);
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível alterar o papel.');
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: NonNullable<User['status']>) => {
    const target = usersList.find((entry) => entry.id === userId);
    if (!target || (target.role === 'Administrador' && status !== 'Ativo')) return;
    try {
      const saved = await apiUpdateUser(userId, { role: target.role, status });
      setUsersList((prev) => prev.map((entry) => entry.id === userId ? saved : entry));
      if (user?.id === userId) setUser(saved);
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível alterar o estado do utilizador.');
    }
  };

  const handleRemoveUser = async (userId: string) => {
    const target = usersList.find((entry) => entry.id === userId);
    if (!target || target.role === 'Administrador' || user?.id === userId) return;
    try {
      await apiRemoveUser(userId);
      setUsersList((prev) => prev.filter((entry) => entry.id !== userId));
      await refreshAdminData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível bloquear o utilizador.');
    }
  };

  const handleSuccessfulLogin = (signedInUser: User) => {
    setUser(signedInUser);
    setAuthOpen(false);
  };

  const handleLogout = async () => {
    try { await apiLogout(); }
    catch (error) { console.warn('A sessão local foi terminada, mas a API reportou um erro.', error); }
    setUser(null);
    setUsersList([]);
    setAuditLogs([]);
    setPurchasedItems([]);
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
    <div className="min-h-screen flex flex-col bg-[#faf7f4] text-[#1a1a1a]">
      {/* 1. Header Top Info Bar */}
      <HeaderTop
        user={user}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={handleLogout}
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
      />

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
      />

      {/* 3. Hero Section with Background Image */}
      <Hero
        onExploreClick={() => {
          const elem = document.getElementById('catalogo');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
        onFormadorClick={() => handleOpenForm('Ser Formador')}
      />

      {/* 4. Main Body Wrapper with Background Image (Under Hero until Footer) */}
      <div 
        className="flex-1 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'linear-gradient(rgba(252, 249, 246, 0.94), rgba(252, 249, 246, 0.96))',
        }}
      >
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
            {filteredCatalog.length === 0 ? (
              <div className="bg-white/95 rounded-2xl p-12 text-center shadow-sm space-y-3">
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
                  className="bg-[#185a7d] text-white text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer hover:bg-[#12415b] transition-colors"
                >
                  Ver Todos os Cursos e Livros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCatalog.map((item) => (
                  <CourseCard
                    key={item.id}
                    item={item}
                    onAddToCart={(i) => (user ? handleAddToCart(i) : setAuthOpen(true))}
                    onToggleWishlist={user ? handleToggleWishlist : undefined}
                    isWishlisted={user ? wishlistIds.includes(item.id) : false}
                    onQuickView={(i) => setQuickViewItem(i)}
                    currency={currency}
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

        <CategoryShowcase
          catalogItems={catalogItems}
          selectedCategory={selectedCategory}
          setSelectedCategory={(category) => {
            setShowWishlistOnly(false);
            setSelectedCategory(category);
          }}
        />

        {/* 6. Advertising Card Section (Sponsored / Partner Showcase) */}
        <AdBannerSection onAdClick={() => handleOpenForm('Parceria')} />

        {/* Elegant Section Divider */}
        <div className="max-w-7xl mx-auto px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
        </div>

        {/* 7. Downloads & Resources Section with Previews */}
        <DownloadsSection />
      </div>

      {/* 6. Footer */}
      <Footer />

      {/* Modals & Direct Purchase Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onOpenFormModal={(need, details) => {
          if (!user) { setAuthOpen(true); return; }
          apiCreateOrder(cartItems.map(({ item, quantity }) => ({ productId: item.id, quantity })), 'whatsapp')
            .then(() => handleOpenForm(need || 'Comprar', details || ''))
            .catch((error) => alert(error instanceof Error ? error.message : 'Não foi possível registar o pedido de compra.'));
        }}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={handleSuccessfulLogin}
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
        onRemoveUser={handleRemoveUser}
        auditLogs={auditLogs}
      />

      <UserLibraryModal
        isOpen={userLibraryOpen}
        onClose={() => setUserLibraryOpen(false)}
        purchasedItems={purchasedItems}
      />
    </div>
  );
}

export default App;
