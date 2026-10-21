import React from 'react';
import { MOCK_MENTORS } from '../data/mockData';
import { Users, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export const MentorsSection: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="mentores" className="py-16 bg-[#faf7f4] border-b border-[#e2d5c8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[#be462a] text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Formadores & Mentores</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a1a1a] font-outfit">
            Rede de Mentores em Destaque
          </h2>
          <p className="text-sm text-[#858586]">
            Especialistas e profissionais experientes dedicados a impulsionar o seu sucesso.
          </p>
        </div>

        {/* Carousel Container with Arrows matching Boimela template */}
        <div className="relative group">
          {/* Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#be462a] text-white flex items-center justify-center shadow-lg hover:bg-[#a53b21] transition-all cursor-pointer opacity-90 hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#be462a] text-white flex items-center justify-center shadow-lg hover:bg-[#a53b21] transition-all cursor-pointer opacity-90 hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Scroll Container */}
          <div
            ref={containerRef}
            className="flex items-center gap-6 overflow-x-auto no-scrollbar py-4 px-2"
          >
            {MOCK_MENTORS.map((mentor) => (
              <div
                key={mentor.id}
                className="min-w-[220px] max-w-[220px] bg-white rounded-2xl p-6 border border-[#e2d5c8] shadow-custom text-center flex flex-col items-center space-y-3 hover:border-[#be462a] transition-all group shrink-0"
              >
                {/* Avatar with circular badge frame */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#be462a] to-[#f0a67d] shadow-md">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow">
                    {mentor.publishedCount.toString().padStart(2, '0')} Cursos/Livros
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-sm font-bold text-[#1a1a1a] font-outfit group-hover:text-[#be462a] transition-colors">
                    {mentor.name}
                  </h3>
                  <p className="text-[11px] text-[#858586] font-medium mt-0.5">
                    {mentor.specialty}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[#f59e0b] text-xs font-bold pt-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{mentor.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
