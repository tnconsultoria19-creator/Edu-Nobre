import React from 'react';
import { BookOpen, Sparkles, Code, DollarSign, Megaphone, ShieldCheck, Palette, GraduationCap } from 'lucide-react';

interface TopCategoriesSectionProps {
  onSelectCategory: (cat: string) => void;
}

export const TopCategoriesSection: React.FC<TopCategoriesSectionProps> = ({ onSelectCategory }) => {
  const topCategories = [
    {
      name: 'Comunicação & Oratória',
      count: '38 Formações',
      icon: <Sparkles className="w-6 h-6 text-[#ea407f]" />,
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Marketing & Vendas',
      count: '54 Formações',
      icon: <Megaphone className="w-6 h-6 text-[#ea407f]" />,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Finanças & Negócios',
      count: '42 Formações',
      icon: <DollarSign className="w-6 h-6 text-[#ea407f]" />,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'TI & Software',
      count: '29 Formações',
      icon: <Code className="w-6 h-6 text-[#ea407f]" />,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Direito & Cidadania',
      count: '21 Formações',
      icon: <ShieldCheck className="w-6 h-6 text-[#ea407f]" />,
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Kandengues & Educação',
      count: '18 Formações',
      icon: <GraduationCap className="w-6 h-6 text-[#ea407f]" />,
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-16 bg-[#11112c] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#ea407f]/20 text-[#ea407f] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Categorias em Destaque</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">
            Especializações Mais Procuradas
          </h2>
          <p className="text-sm text-[#b0b0bc]">
            Escolha a área ideal para o seu desenvolvimento profissional e pessoal em Angola.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {topCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => onSelectCategory(cat.name.split(' ')[0])}
              className="bg-[#232329] hover:bg-[#2e2e38] border border-[#3f3f4a] hover:border-[#ea407f] rounded-2xl p-4 text-center transition-all group cursor-pointer flex flex-col items-center justify-between h-full space-y-3"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#11112c] mb-2">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11112c] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#ea407f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow">
                  {cat.count}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white group-hover:text-[#ea407f] transition-colors font-outfit line-clamp-1">
                  {cat.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
