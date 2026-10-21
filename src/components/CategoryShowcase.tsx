import React, { useRef } from 'react';
import { Category } from '../types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CategoryShowcaseProps {
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
}

interface TopCategoryItem {
  id: string;
  name: string;
  categoryKey: Category;
  count: number;
  numberBadge: string;
  coverImage: string;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categoriesData: TopCategoryItem[] = [
    {
      id: '1',
      name: 'Romance Books',
      categoryKey: 'Desenvolvimento pessoal',
      count: 80,
      numberBadge: '01',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      name: 'Design Low Book',
      categoryKey: 'Marketing & vendas',
      count: 6,
      numberBadge: '02',
      coverImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: '3',
      name: 'Safe Home',
      categoryKey: 'Direito',
      count: 5,
      numberBadge: '03',
      coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: '4',
      name: 'Grow Flower',
      categoryKey: 'Finanças',
      count: 7,
      numberBadge: '04',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: '5',
      name: 'Adventure Book',
      categoryKey: 'Comunicação',
      count: 4,
      numberBadge: '05',
      coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: '6',
      name: 'TI & Software',
      categoryKey: 'TI & Software',
      count: 14,
      numberBadge: '06',
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: '7',
      name: 'Kandengues',
      categoryKey: 'Kandengues',
      count: 18,
      numberBadge: '07',
      coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&auto=format&fit=crop&q=80',
    },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSelect = (catKey: Category) => {
    setSelectedCategory(selectedCategory === catKey ? 'Todas' : catKey);
    const elem = document.getElementById('catalogo-grid');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="catalogo" className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Section Header with Left/Right Navigation Arrows */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] font-outfit tracking-tight">
              Top Categorias
            </h2>
            <p className="text-xs sm:text-sm text-[#5e6d77] mt-1">
              Explore os tópicos e livros mais procurados por estudantes e profissionais
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#185a7d] text-[#0c2340] hover:text-white flex items-center justify-center shadow-sm transition-all cursor-pointer"
              aria-label="Previous Categories"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#185a7d] text-[#0c2340] hover:text-white flex items-center justify-center shadow-sm transition-all cursor-pointer"
              aria-label="Next Categories"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-3 px-1"
        >
          {categoriesData.map((cat) => {
            const isSelected = selectedCategory === cat.categoryKey;
            return (
              <div
                key={cat.id}
                onClick={() => handleSelect(cat.categoryKey)}
                className={`group flex flex-col items-center bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer shrink-0 w-[160px] sm:w-[180px] ${
                  isSelected ? 'ring-2 ring-[#be462a] shadow-md' : ''
                }`}
              >
                {/* Book Cover Container */}
                <div className="w-full aspect-[3/4] rounded-xl bg-[#f4f6f8] flex items-center justify-center p-3 mb-3 overflow-hidden relative group-hover:bg-[#ebf1f5] transition-colors">
                  <span className="absolute top-2 left-2 text-[10px] font-bold text-[#8c9ba5] bg-white/80 px-2 py-0.5 rounded-md">
                    {cat.numberBadge}
                  </span>
                  <img
                    src={cat.coverImage}
                    alt={cat.name}
                    className="h-28 sm:h-32 w-auto max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Category Info */}
                <div className="text-center w-full">
                  <h3
                    className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                      isSelected ? 'text-[#be462a]' : 'text-[#0c2340] group-hover:text-[#185a7d]'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-[#8c9ba5] font-medium block mt-0.5">
                    {cat.count} títulos
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
