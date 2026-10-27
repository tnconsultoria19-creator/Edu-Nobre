import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, ChevronRight, ShieldCheck, BookOpen, House, LogOut } from 'lucide-react';
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
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  catalogItems: CatalogItem[];
  onSelectItem: (item: CatalogItem) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  currentUser?: User | null;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems, onOpenCart, onOpenFormModal, onOpenAuth, onOpenAdminPortal, onOpenUserLibrary, onLogout,
  searchQuery, setSearchQuery, catalogItems, onSelectItem, activeNavTab, setActiveNavTab, currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const itemCount = cartItems.reduce((total, entry) => total + entry.quantity, 0);
  const searchResults = searchQuery.trim()
    ? catalogItems.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];
  const navItems = [
    { label: 'Início', id: 'inicio' },
    { label: 'Cursos', id: 'catalogo-grid' },
    { label: 'Formadores', id: 'formadores' },
    { label: 'Downloads', id: 'downloads' },
  ];

  const handleNavClick = (id: string) => {
    setActiveNavTab(id);
    setMobileMenuOpen(false);
    if (id === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#e6ded6]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center gap-3">
        <a href="#" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="shrink-0 flex items-baseline">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1a1a1a]">Edunombre<span className="text-[#be462a]">.</span></span>
        </a>

        <nav className="hidden lg:flex items-center gap-5 ml-5 text-sm font-semibold text-[#1a1a1a]">
          {navItems.map((item) => <button key={item.id} type="button" onClick={() => handleNavClick(item.id)} className={'relative py-2 ' + (activeNavTab === item.id ? 'text-[#be462a]' : 'hover:text-[#be462a]')}>{item.id === 'inicio' ? <House className="w-4 h-4" /> : item.label}{activeNavTab === item.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#be462a] rounded-full" />}</button>)}
        </nav>

        <div className="relative hidden md:block flex-1 max-w-xs ml-auto">
          <input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => window.setTimeout(() => setSearchFocused(false), 150)} placeholder="Pesquisar..." className="w-full rounded-full border border-[#e6ded6] bg-[#f7f3ee] py-2 pl-4 pr-9 text-xs focus:outline-none focus:border-[#be462a]" />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-[#858586]" />
          {searchFocused && searchResults.length > 0 && <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#e6ded6] shadow-xl z-50 p-2">{searchResults.map((item) => <button key={item.id} type="button" onMouseDown={() => { onSelectItem(item); setSearchQuery(''); }} className="w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-[#f7f3ee]"><img src={item.image} alt="" className="w-8 h-8 rounded-md object-cover" /><span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-[#1a1a1a] truncate">{item.title}</span><span className="block text-[10px] text-[#be462a]">{item.price === 0 ? 'Grátis' : item.price.toLocaleString('pt-AO') + ' Kz'}</span></span></button>)}</div>}
        </div>

        <div className="ml-auto lg:ml-0 flex items-center gap-1.5 sm:gap-2">
          <button type="button" onClick={onOpenCart} title="Carrinho" aria-label="Carrinho" className="relative w-9 h-9 rounded-full border border-[#e6ded6] flex items-center justify-center text-[#1a1a1a] hover:bg-[#f7f3ee]">
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#be462a] text-white text-[9px] font-bold flex items-center justify-center">{itemCount}</span>}
          </button>
          {currentUser && <button type="button" onClick={onOpenUserLibrary} title="Minha área" aria-label="Minha área" className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-full bg-[#f3f6f8] text-[#185a7d] text-xs font-semibold hover:bg-[#e7eef2]"><BookOpen className="w-4 h-4" /><span className="hidden sm:inline">Minha área</span></button>}
          {(currentUser?.role === 'Administrador' || currentUser?.role === 'Formador') && <button type="button" onClick={onOpenAdminPortal} title="Portal de gestão" aria-label="Portal de gestão" className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-full bg-[#0c2340] text-white text-xs font-semibold hover:bg-[#185a7d]"><ShieldCheck className="w-4 h-4" /><span className="hidden sm:inline">{currentUser.role === 'Administrador' ? 'Admin' : 'Portal'}</span></button>}
          {currentUser ? (
            <button type="button" onClick={onLogout} title="Terminar sessão" aria-label="Terminar sessão" className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-[#e6ded6] text-[#574f49] text-xs font-semibold hover:bg-[#f7f3ee]"><LogOut className="w-4 h-4" /><span className="hidden sm:inline">Sair</span></button>
          ) : (
            <button type="button" onClick={onOpenAuth} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-[#be462a] hover:bg-[#a53b21] text-white text-xs font-bold"><span>Entrar</span><ChevronRight className="w-3.5 h-3.5" /></button>
          )}
          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'} className="lg:hidden w-9 h-9 flex items-center justify-center text-[#1a1a1a] hover:bg-[#f7f3ee] rounded-full">{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </div>

      {mobileMenuOpen && <div className="lg:hidden border-t border-[#e6ded6] bg-white px-3 py-3 space-y-2">
        <div className="relative md:hidden"><input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Pesquisar..." className="w-full rounded-full border border-[#e6ded6] bg-[#f7f3ee] py-2 pl-4 pr-9 text-xs" /><Search className="absolute right-3 top-2.5 w-4 h-4 text-[#858586]" /></div>
        {navItems.map((item) => <button key={item.id} type="button" onClick={() => handleNavClick(item.id)} className={'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold ' + (activeNavTab === item.id ? 'bg-[#f7ebe4] text-[#be462a]' : 'text-[#1a1a1a] hover:bg-[#f7f3ee]')}>{item.id === 'inicio' ? 'Início' : item.label}<ChevronRight className="w-4 h-4" /></button>)}
        <button type="button" onClick={() => { setMobileMenuOpen(false); onOpenFormModal(); }} className="w-full rounded-lg px-3 py-2.5 text-sm font-semibold text-[#185a7d] hover:bg-[#f3f6f8]">Contacto / Parcerias</button>
      </div>}
    </header>
  );
};
