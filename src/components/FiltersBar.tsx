import React from 'react';
import { Category, ContentType } from '../types';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

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
}) => {
  const contentTypes: { id: ContentType; label: string }[] = [
    { id: 'Todas', label: 'Todos os Formatos' },
    { id: 'Cursos Online', label: 'Cursos Online' },
    { id: 'E-books', label: 'E-books' },
    { id: 'Arquivos', label: 'Minutas & Modelos' },
  ];

  const priceOptions: { id: 'all' | 'free' | 'paid'; label: string }[] = [
    { id: 'all', label: 'Todos os Preços' },
    { id: 'free', label: 'Grátis' },
    { id: 'paid', label: 'Pagos' },
  ];

  const hasActiveFilters =
    selectedCategory !== 'Todas' ||
    selectedContentType !== 'Todas' ||
    priceFilter !== 'all' ||
    searchQuery.trim().length > 0;

  const handleClearFilters = () => {
    setSelectedCategory('Todas');
    setSelectedContentType('Todas');
    setPriceFilter('all');
    setSearchQuery('');
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
            placeholder="Pesquisar por curso, livro ou formador..."
            className="w-full bg-[#f4f5f7] rounded-full py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#0c2340] placeholder-[#8c9ba5] focus:outline-none focus:bg-white transition-all shadow-xs"
          />
          <Search className="w-4 h-4 text-[#8c9ba5] absolute left-3.5 top-3" />
        </div>

        {/* Content Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {contentTypes.map((ct) => (
            <button
              key={ct.id}
              onClick={() => setSelectedContentType(ct.id)}
              className={`text-xs font-bold px-3.5 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                selectedContentType === ct.id
                  ? 'bg-[#185a7d] text-white shadow-xs'
                  : 'bg-[#f4f5f7] text-[#5e6d77] hover:text-[#0c2340] hover:bg-[#eaf1f5]'
              }`}
            >
              {ct.label}
            </button>
          ))}
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
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#185a7d]" />
          <span>
            A mostrar <strong>{totalResults}</strong> resultados
            {selectedCategory !== 'Todas' && (
              <> na categoria <strong className="text-[#0c2340]">{selectedCategory}</strong></>
            )}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs font-bold text-[#e05822] hover:underline cursor-pointer"
          >
            Limpar Todos os Filtros
          </button>
        )}
      </div>
    </div>
  );
};
