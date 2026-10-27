import React, { useRef } from 'react';
import { ContentType, Category } from '../types';
import { CATEGORIES_LIST } from '../data/mockData';
import { BookOpen, FileText, Video, Users, Layers, Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  selectedContentType: ContentType;
  setSelectedContentType: (type: ContentType) => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({ selectedCategory, setSelectedCategory, selectedContentType, setSelectedContentType }) => {
  const typesRef = useRef<HTMLDivElement>(null);
  const catsRef = useRef<HTMLDivElement>(null);
  const scrollRow = (row: 'types' | 'categories', direction: 'left' | 'right') => {
    const ref = row === 'types' ? typesRef : catsRef;
    ref.current?.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  };
  const contentTypesList: { id: ContentType; label: string; icon: React.ReactNode }[] = [
    { id: 'Todas', label: 'Todas', icon: <Layers className="w-4 h-4" /> },
    { id: 'Cursos Online', label: 'Cursos Online', icon: <Video className="w-4 h-4" /> },
    { id: 'E-books', label: 'E-books', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'Arquivos', label: 'Arquivos', icon: <FileText className="w-4 h-4" /> },
    { id: 'Masterclass', label: 'Masterclass', icon: <Award className="w-4 h-4" /> },
    { id: 'Mentores', label: 'Mentores', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div id="catalogo" className="py-6 bg-white border-b border-[#dfdfe4] shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#11112c] font-outfit">Explorar Catálogo</h2>
          <div className="flex min-w-0 flex-1 sm:flex-none items-center gap-1.5 max-w-full sm:max-w-[65%]">
            <button type="button" aria-label="Tipos anteriores" onClick={() => scrollRow('types','left')} className="shrink-0 w-8 h-8 rounded-full border border-[#dfdfe4] bg-white flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
            <div ref={typesRef} className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pb-1">
              {contentTypesList.map((ct) => <button key={ct.id} type="button" onClick={() => setSelectedContentType(ct.id)} className={`min-h-10 flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${selectedContentType === ct.id ? 'bg-[#185a7d] text-white' : 'bg-[#f3f4f7] text-[#68687b] hover:bg-[#e8eef2]'}`}>{ct.icon}<span>{ct.label}</span></button>)}
            </div>
            <button type="button" aria-label="Mais tipos" onClick={() => scrollRow('types','right')} className="shrink-0 w-8 h-8 rounded-full border border-[#dfdfe4] bg-white flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-1.5">
          <button type="button" aria-label="Categorias anteriores" onClick={() => scrollRow('categories','left')} className="shrink-0 w-8 h-8 rounded-full border border-[#dfdfe4] bg-white flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
          <div ref={catsRef} className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
            {CATEGORIES_LIST.map((cat) => <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={`min-h-10 text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${selectedCategory === cat ? 'bg-[#11112c] text-white shadow' : 'bg-[#f8f9fa] border border-[#dfdfe4] text-[#232329] hover:border-[#185a7d] hover:text-[#185a7d]'}`}>{cat}</button>)}
          </div>
          <button type="button" aria-label="Mais categorias" onClick={() => scrollRow('categories','right')} className="shrink-0 w-8 h-8 rounded-full border border-[#dfdfe4] bg-white flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};
