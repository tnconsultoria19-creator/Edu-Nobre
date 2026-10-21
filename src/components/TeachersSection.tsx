import React from 'react';

interface Instructor {
  id: string;
  name: string;
  role: string;
  image: string;
}

export const TeachersSection: React.FC = () => {
  const instructors: Instructor[] = [
    {
      id: '1',
      name: 'Sarah Fontenot',
      role: 'Subject Expert',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85',
    },
    {
      id: '2',
      name: 'Erika Walker',
      role: 'Online Course Coach',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=85',
    },
    {
      id: '3',
      name: 'Joan Martinez',
      role: 'Academic Mentor',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85',
    },
    {
      id: '4',
      name: 'Helen Walker',
      role: 'Language Instructor',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85',
    },
  ];

  return (
    <section id="formadores" className="py-16 sm:py-20 flex flex-col justify-center items-center space-y-10">
      {/* Elegant Section Header with Visual Divider */}
      <div className="text-center max-w-2xl mx-auto px-4 space-y-3">
<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0c2340] font-outfit tracking-tight">
          Nossos Formadores & Autores
        </h2>
        
        <p className="text-sm sm:text-base text-[#5e6d77] leading-relaxed">
          Aprenda diretamente com profissionais de referência nas áreas jurídica, financeira, fiscal e gestão de negócios em Angola.
        </p>

        {/* Symmetrical divider line */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#185a7d]/40 rounded-full" />
          <div className="w-2 h-2 rounded-full bg-[#185a7d]" />
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#185a7d]/40 rounded-full" />
        </div>
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-4 overflow-x-auto no-scrollbar">
        {/* FOUR-CARD ROW IN A SINGLE HORIZONTAL LINE WITH 24PX GAP */}
        <div className="flex flex-row items-center justify-center gap-6 min-w-fit mx-auto py-2">
          {instructors.map((inst) => (
            <div
              key={inst.id}
              className="w-[230px] h-[350px] bg-white rounded-[18px] shadow-sm flex flex-col shrink-0 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* ZONE 1 — WHITE TEXT HEADER (95px height, centered text) */}
              <div className="h-[95px] w-full flex flex-col items-center justify-center text-center px-3 bg-white shrink-0">
                <h3 className="text-[17px] font-semibold text-[#0c2340] tracking-tight whitespace-nowrap leading-tight font-outfit">
                  {inst.name}
                </h3>
                <p className="text-sm font-normal text-[#6e8090] mt-[3px] whitespace-nowrap">
                  {inst.role}
                </p>
              </div>

              {/* ZONE 2 — FULL-WIDTH IMAGE FLUSH WITH LEFT, RIGHT, AND BOTTOM (255px height, rounded top & bottom corners) */}
              <div className="w-[230px] h-[255px] bg-[#2b2d31] rounded-[18px] overflow-hidden shrink-0">
                <img
                  src={inst.image}
                  alt=""
                  className="w-full h-full object-cover object-top block rounded-[18px]"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



