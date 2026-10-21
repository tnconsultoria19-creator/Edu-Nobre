import React, { useRef } from 'react';
import { Category, CatalogItem } from '../types';
import { ArrowLeft, ArrowRight, GraduationCap } from 'lucide-react';

interface CategoryShowcaseProps {
  catalogItems: CatalogItem[];
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
}
interface CourseCategory {
  id: string;
  name: string;
  categoryKey: Category;
  coverImage: string;
}
const COURSE_CATEGORIES: CourseCategory[] = [
  { id: 'communication', name: 'Comunicação & Oratória', categoryKey: 'Comunicação', coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80' },
  { id: 'marketing', name: 'Marketing & Vendas', categoryKey: 'Marketing & vendas', coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80' },
  { id: 'finance', name: 'Finanças', categoryKey: 'Finanças', coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80' },
  { id: 'children', name: 'Kandengues', categoryKey: 'Kandengues', coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80' },
  { id: 'design', name: 'Beleza & Decoração', categoryKey: 'Beleza & Decoração', coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80' },
];

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ catalogItems, selectedCategory, setSelectedCategory }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoriesData = COURSE_CATEGORIES.map((category) => ({
    ...category,
    count: catalogItems.filter((item) => item.contentType === 'Cursos Online' && item.category === category.categoryKey && (!item.approvalStatus || item.approvalStatus === 'Publicado')).length,
  })).filter((category) => category.count > 0);
  const handleScroll = (direction: 'left' | 'right') => {
    scrollContainerRef.current?.scrollBy({ left: direction === 'left' ? -280 : 280, behavior: 'smooth' });
  };
  const handleSelect = (catKey: Category) => {
    setSelectedCategory(selectedCategory === catKey ? 'Todas' : catKey);
    document.getElementById('catalogo-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categorias-cursos" className="py-12 sm:py-14 bg-[#fcf9f6] border-y border-[#e6ded6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#8c3a27] text-sm font-semibold mb-1"><GraduationCap className="w-4 h-4" /><span>Cursos</span></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] font-outfit tracking-tight">Cursos por Categoria</h2>
            <p className="text-sm sm:text-base text-[#6f6862] mt-1">Explore as áreas de formação e encontre o próximo curso para si.</p>
          </div>
          {categoriesData.length > 3 && <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => handleScroll('left')} className="w-9 h-9 rounded-full bg-white hover:bg-[#f4eee8] text-[#574f49] border border-[#e6ded6] flex items-center justify-center transition-colors cursor-pointer" aria-label="Categorias anteriores"><ArrowLeft className="w-4 h-4" /></button>
            <button onClick={() => handleScroll('right')} className="w-9 h-9 rounded-full bg-white hover:bg-[#f4eee8] text-[#574f49] border border-[#e6ded6] flex items-center justify-center transition-colors cursor-pointer" aria-label="Mais categorias"><ArrowRight className="w-4 h-4" /></button>
          </div>}
        </div>
        <div ref={scrollContainerRef} className="flex items-stretch gap-4 overflow-x-auto no-scrollbar py-1">
          {categoriesData.map((category) => {
            const isSelected = selectedCategory === category.categoryKey;
            return <button key={category.id} type="button" onClick={() => handleSelect(category.categoryKey)} className={`group text-left bg-white rounded-xl border overflow-hidden transition-all shrink-0 w-[220px] sm:w-[245px] ${isSelected ? 'border-[#be462a] ring-1 ring-[#be462a]/25' : 'border-[#e6ded6] hover:border-[#d4c4b8]'}`}>
              <div className="w-full aspect-[5/3] bg-[#f3eee8] overflow-hidden"><img src={category.coverImage} alt={category.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" referrerPolicy="no-referrer" /></div>
              <div className="p-4">
                <h3 className={`text-sm sm:text-base font-semibold leading-snug ${isSelected ? 'text-[#8c3a27]' : 'text-[#26211e]'}`}>{category.name}</h3>
                <p className="text-sm text-[#746b65] mt-1">{category.count} {category.count === 1 ? 'curso' : 'cursos'}</p>
              </div>
            </button>;
          })}
        </div>
      </div>
    </section>
  );
};
