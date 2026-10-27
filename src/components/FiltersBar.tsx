import React, { useRef } from 'react';
import { Category, ContentType } from '../types';
import { Search, SlidersHorizontal, ArrowUpDown, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES_LIST } from '../data/mockData';

interface FiltersBarProps {
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  selectedContentType: ContentType;
  setSelectedContentType: (type: ContentType) => void;
  priceFilter: 'all' | 'free' | 'paid';
  setPriceFilter: (price: 'all' | 'free' | 'paid') => void;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'popular' | 'price-asc' | 'price-desc' | 'rating') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalResults: number;
  showWishlistOnly: boolean;
  setShowWishlistOnly: (value: boolean) => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedContentType,
  setSelectedContentType,
  priceFilter,
  setPriceFilter,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
  totalResults,
  showWishlistOnly,
  setShowWishlistOnly,
}) => {
  const contentTypesRef = useRef<HTMLDivElement>(null);
  const scrollContentTypes = (direction: 'left' | 'right') => contentTypesRef.current?.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });

  const contentTypes: { id: ContentType; label: string }[] = [
    { id: 'Todas', label: 'Todos' },
    { id: 'Cursos Online', label: 'Cursos Online' },
    { id: 'E-books', label: 'E-books' },
    { id: 'Arquivos', label: 'Ficheiros' },
  ];

  const priceOptions: { id: 'all' | 'free' | 'paid'; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'free', label: 'Grátis' },
    { id: 'paid', label: 'Pagos' },
  ];

  const hasActiveFilters =
    selectedCategory !== 'Todas' ||
    selectedContentType !== 'Todas' ||
    priceFilter !== 'all' ||
    searchQuery.trim().length > 0 ||
    showWishlistOnly;

  const handleClearFilters = () => {
    setSelectedCategory('Todas');
    setSelectedContentType('Todas');
    setPriceFilter('all');
    setSearchQuery('');
    setShowWishlistOnly(false);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Filter Row: Search + Content Type Pills + Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar..."
            className="w-full bg-[#f4f5f7] rounded-full py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#0c2340] placeholder-[#8c9ba5] focus:outline-none focus:bg-white transition-all shadow-xs"
          />
          <Search className="w-4 h-4 text-[#8c9ba5] absolute left-3.5 top-3" />
        </div>

        {/* Category selector */}
        <div className="w-full lg:w-auto lg:max-w-[230px]">
          <label htmlFor="catalog-category-filter" className="sr-only">Filtrar por categoria</label>
          <select
            id="catalog-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category)}
            className="w-full bg-[#f4f5f7] border border-[#e6ded6] text-sm font-semibold text-[#51463e] py-2.5 px-3 rounded-full focus:outline-none focus:ring-1 focus:ring-[#be462a] cursor-pointer"
          >
            {CATEGORIES_LIST.map((category) => <option key={category} value={category}>{category === 'Todas' ? 'Todas as Categorias' : category}</option>)}
          </select>
        </div>

        {/* Content Type Filter Pills */}
        <div className="flex items-center gap-1 w-full min-w-0 lg:max-w-[430px]">
          <button type="button" onClick={() => scrollContentTypes('left')} aria-label="Ver filtros anteriores" className="shrink-0 w-8 h-8 rounded-full border border-[#e6ded6] bg-white text-[#574f49] flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
          <div ref={contentTypesRef} className="flex items-center gap-1.5 flex-1 min-w-0 overflow-x-auto no-scrollbar scroll-smooth pb-1">
          {contentTypes.map((ct) => (
            <button
              key={ct.id}
              onClick={() => setSelectedContentType(ct.id)}
              className={`min-h-10 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                selectedContentType === ct.id
                  ? 'bg-[#185a7d] text-white shadow-xs'
                  : 'bg-[#f4f5f7] text-[#5e6d77] hover:text-[#0c2340] hover:bg-[#eaf1f5]'
              }`}
            >
              {ct.label}
            </button>
          ))}
          </div>
          <button type="button" onClick={() => scrollContentTypes('right')} aria-label="Ver mais filtros" className="shrink-0 w-8 h-8 rounded-full border border-[#e6ded6] bg-white text-[#574f49] flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
        </div>

        {/* Sort & Price Dropdowns */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          {/* Price Filter */}
          <div className="flex items-center gap-1 bg-[#f4f5f7] rounded-full p-1">
            {priceOptions.map((po) => (
              <button
                key={po.id}
                onClick={() => setPriceFilter(po.id)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  priceFilter === po.id
                    ? 'bg-white text-[#0c2340] shadow-xs'
                    : 'text-[#8c9ba5] hover:text-[#0c2340]'
                }`}
              >
                {po.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#f4f5f7] text-[#0c2340] text-xs font-bold py-2 pl-7 pr-3 rounded-full focus:outline-none cursor-pointer appearance-none shadow-xs"
            >
              <option value="popular">Mais Populares</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-[#5e6d77] absolute left-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom Summary & Active Filter Tags */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-[#5e6d77]">
          <SlidersHorizontal className="w-4 h-4 text-[#8c3a27]" />
          <span className="text-sm">
            <strong>{totalResults}</strong> resultados
            {showWishlistOnly && <span className="inline-flex items-center gap-1 ml-2 rounded-full bg-[#f8eee8] text-[#8c3a27] px-2.5 py-1 font-semibold"><Heart className="w-3.5 h-3.5" /> Favoritos</span>}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs font-bold text-[#e05822] hover:underline cursor-pointer"
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  );
};
