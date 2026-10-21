import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, ChevronRight, ShieldCheck, BookOpen } from 'lucide-react';
import { CartItem, CatalogItem, User } from '../types';

interface HeaderProps {
  cartItems: CartItem[];
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenFormModal: () => void;
  onOpenAuth: () => void;
  onOpenAdminPortal: () => void;
  onOpenUserLibrary: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  catalogItems: CatalogItem[];
  onSelectItem: (item: CatalogItem) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  currentUser?: User | null;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenFormModal,
  onOpenAuth,
  onOpenAdminPortal,
  onOpenUserLibrary,
  searchQuery,
  setSearchQuery,
  catalogItems,
  onSelectItem,
  activeNavTab,
  setActiveNavTab,
  currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalCartPrice = cartItems.reduce(
    (acc, curr) => acc + curr.item.price * curr.quantity,
    0
  );

  const filteredSearchResults = searchQuery.trim()
    ? catalogItems.filter(
        (i) =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Navigation options
  const navItems = [
    { label: 'Início', id: 'inicio' },
    { label: 'Cursos & Livros', id: 'catalogo-grid' },
    { label: 'Formadores', id: 'formadores' },
    { label: 'Downloads', id: 'downloads' },
    { label: 'Instituições', id: 'aderir' },
  ];

  const handleNavClick = (id: string) => {
    setActiveNavTab(id);
    setMobileMenuOpen(false);

    // Scroll to relevant section if present (or handle logic)
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e2d5c8] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-baseline group cursor-pointer"
        >
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#1a1a1a] font-outfit">
            Edunombre
          </span>
          <span className="text-[#be462a] text-3xl font-black leading-none ml-0.5">.</span>
        </a>

        {/* Desktop Navigation - 3 Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#1a1a1a]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`transition-colors relative py-1 cursor-pointer ${
                activeNavTab === item.id
                  ? 'text-[#be462a] font-extrabold'
                  : 'text-[#1a1a1a] hover:text-[#be462a]'
              }`}
            >
              {item.label}
              {activeNavTab === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#be462a] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Search & Action Icons */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative hidden sm:block w-44 lg:w-60">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Pesquisar formação..."
                className="w-full bg-[#f7f3ee] border border-[#e2d5c8] focus:border-[#be462a] rounded-full py-1.5 pl-4 pr-9 text-xs text-[#1a1a1a] focus:outline-none transition-all placeholder:text-[#858586]"
              />
              <button className="absolute right-2.5 text-[#858586] hover:text-[#be462a]">
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Dropdown Results */}
            {searchFocused && filteredSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e2d5c8] rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto p-2">
                <div className="text-[10px] font-bold text-[#858586] px-2 py-1 uppercase">
                  Resultados encontrados ({filteredSearchResults.length})
                </div>
                {filteredSearchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectItem(item);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2 hover:bg-[#f7ebe4] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#1a1a1a] truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-[#be462a] font-bold">
                        {item.price === 0
                          ? 'Grátis'
                          : `${item.price.toLocaleString('pt-AO')} AOA`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-[#1a1a1a] hover:text-[#be462a] transition-colors cursor-pointer"
            title="Lista de Desejos"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#be462a] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-[#1a1a1a] hover:text-[#be462a] transition-colors cursor-pointer flex items-center gap-1.5"
            title="Carrinho de Compras"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#be462a] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </div>
            {totalCartPrice > 0 && (
              <span className="hidden xl:inline text-xs font-bold text-[#be462a]">
                {totalCartPrice.toLocaleString('pt-AO')} AOA
              </span>
            )}
          </button>

          {/* User Library CTA */}
          <button
            onClick={onOpenUserLibrary}
            className="hidden lg:inline-flex items-center gap-1.5 bg-[#f4f6f8] hover:bg-[#e2e8f0] text-[#0c2340] text-xs font-bold px-3 py-2 rounded-full transition-all cursor-pointer border border-slate-200"
            title="Ver conteúdos comprados e descarregados"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#185a7d]" />
            <span>Adquiridos</span>
          </button>

          {/* Admin & Portal CTA */}
          <button
            onClick={onOpenAdminPortal}
            className="inline-flex items-center gap-1.5 bg-[#0c2340] hover:bg-[#185a7d] text-white text-xs font-bold px-3.5 py-2 rounded-full transition-all shadow-sm cursor-pointer"
            title="Aceder ao Painel de Moderação, Moderação e Criadores"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Admin / Criador</span>
          </button>

          {/* Account Login CTA */}
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-1 bg-[#be462a] hover:bg-[#a53b21] text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <span>{currentUser ? currentUser.name.split(' ')[0] : 'Entrar'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1a1a1a] hover:text-[#be462a] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#e2d5c8] px-4 py-4 space-y-3">
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar formação..."
              className="w-full bg-[#f7f3ee] border border-[#e2d5c8] rounded-xl py-2 pl-4 pr-9 text-xs text-[#1a1a1a]"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-[#858586]" />
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
                  activeNavTab === item.id
                    ? 'bg-[#f7ebe4] text-[#be462a]'
                    : 'text-[#1a1a1a] hover:bg-gray-50'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-[#858586]" />
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFormModal();
              }}
              className="w-full bg-[#be462a] text-white text-xs font-bold py-2.5 rounded-xl text-center shadow"
            >
              Contactar / Agência & Formador
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
