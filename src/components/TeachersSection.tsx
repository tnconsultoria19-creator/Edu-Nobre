import React, { useRef, useState } from 'react';
import { X, UserRound } from 'lucide-react';

interface Instructor {
  id: string;
  name: string;
  role: string;
  image: string;
  focus: string;
  bio: string;
}

const instructors: Instructor[] = [
  { id: '1', name: 'Sarah Fontenot', role: 'Especialista de Área', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85', focus: 'Conteúdo especializado e aprendizagem prática', bio: 'Perfil de formadora para apresentar a sua área de conhecimento, os recursos que disponibiliza e a forma como apoia os alunos.' },
  { id: '2', name: 'Erika Walker', role: 'Orientadora de Cursos Online', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=85', focus: 'Aprendizagem online e acompanhamento de alunos', bio: 'Perfil dedicado a orientar alunos na aprendizagem online e a tornar os conteúdos mais fáceis de acompanhar e aplicar.' },
  { id: '3', name: 'Joan Martinez', role: 'Mentor Académico', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85', focus: 'Orientação académica e desenvolvimento de competências', bio: 'Perfil de mentor para ajudar os alunos a organizar o seu percurso de aprendizagem e a desenvolver competências.' },
  { id: '4', name: 'Helen Walker', role: 'Formadora de Idiomas', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85', focus: 'Idiomas e comunicação', bio: 'Perfil dedicado à aprendizagem de idiomas e ao desenvolvimento de competências de comunicação.' },
];

export const TeachersSection: React.FC = () => {
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => scrollRef.current?.scrollBy({ left: direction === 'left' ? -310 : 310, behavior: 'smooth' });

  return (
    <section id="formadores" className="w-full bg-white py-10 sm:py-16 flex flex-col items-center gap-6 sm:gap-8">
      <div className="text-center max-w-2xl mx-auto px-4 space-y-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0c2340] font-outfit tracking-tight">Formadores</h2>
      </div>
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <div ref={scrollRef} className="w-full min-w-0 flex justify-start xl:justify-center gap-4 overflow-x-auto no-scrollbar scroll-smooth py-3">
            {instructors.map((inst) => (
              <button key={inst.id} type="button" onClick={() => setSelectedInstructor(inst)} aria-haspopup="dialog" aria-label={`Ver informações de ${inst.name}`} className="w-[260px] h-[382px] shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#185a7d] transition-shadow">
                <div className="h-[95px] px-3 flex flex-col items-center justify-center text-center bg-white">
                  <h3 className="text-[17px] font-semibold text-[#0c2340] tracking-tight leading-tight">{inst.name}</h3>
                  <p className="text-sm text-[#6e8090] mt-1 leading-tight">{inst.role}</p>
                </div>
                <div className="w-full h-[255px] bg-white overflow-hidden"><img src={inst.image} alt={inst.name} className="w-full h-full object-cover object-top block" referrerPolicy="no-referrer" loading="lazy" /></div>
                <div className="flex h-[32px] items-center border-t border-slate-100 px-3 text-xs font-semibold text-[#185a7d] bg-white">Ver perfil</div>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button type="button" onClick={() => scroll('left')} className="rounded-full border border-[#185a7d] bg-white px-5 py-2.5 text-sm font-semibold text-[#185a7d] transition-colors hover:border-[#0c2340] hover:text-[#0c2340]" aria-label="Formadores anteriores">Anterior</button>
            <button type="button" onClick={() => scroll('right')} className="rounded-full border border-[#185a7d] bg-white px-5 py-2.5 text-sm font-semibold text-[#185a7d] transition-colors hover:border-[#0c2340] hover:text-[#0c2340]" aria-label="Mais formadores">Seguinte</button>
          </div>
        </div>
      </div>
      {selectedInstructor && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedInstructor(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="instructor-modal-title" className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setSelectedInstructor(null)} aria-label="Fechar perfil" className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full border border-slate-300 bg-white text-[#243447] flex items-center justify-center"><X className="w-4 h-4" /></button>
            <div className="flex items-center gap-4 p-5 border-b border-[#eee7e0]">
              <img src={selectedInstructor.image} alt={selectedInstructor.name} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
              <div className="min-w-0"><h3 id="instructor-modal-title" className="text-lg font-bold text-[#0c2340] leading-tight">{selectedInstructor.name}</h3><p className="text-sm text-[#64748b] mt-1">{selectedInstructor.role}</p></div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3"><UserRound className="w-4 h-4 text-[#185a7d] mt-0.5 shrink-0" /><div><p className="text-xs uppercase tracking-wide font-bold text-[#64748b]">Área de foco</p><p className="text-sm font-semibold text-[#243447] mt-1">{selectedInstructor.focus}</p></div></div>
              <p className="text-sm leading-relaxed text-[#52616f]">{selectedInstructor.bio}</p>
              <p className="text-[11px] text-[#8c9ba5]">Os dados reais de experiência e qualificações devem ser confirmados e actualizados pela equipa Edu-Nobre.</p>
            </div>
            <div className="px-5 pb-5"><button type="button" onClick={() => setSelectedInstructor(null)} className="w-full min-h-10 rounded-full border border-[#185a7d] bg-white hover:border-[#0c2340] text-[#185a7d] hover:text-[#0c2340] text-sm font-bold py-2.5 transition-colors">Fechar perfil</button></div>
          </div>
        </div>
      )}
    </section>
  );
};
