import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onFormadorClick: () => void;
}

const BANNERS = [
  {
    id: 1,
    title: (<>Aprenda em qualquer lugar <br /><span className="text-[#d8c29b] inline-block">Formação Online</span></>),
    subtitle: 'Descubra cursos práticos para desenvolver competências, abrir novas oportunidades e avançar na sua carreira.',
    ctaText: 'Explorar Cursos',
    image: 'https://img.magnific.com/free-photo/smart-pretty-young-woman-working-with-laptop-table-library-studying-university-learning-freelancer-working-searching-internet-clever-student-hard-working_197531-1856.jpg'
  },
  {
    id: 2,
    title: (<>Aprendizagem que <br /><span className="text-[#d8c29b] inline-block">acompanha o seu ritmo</span></>),
    subtitle: 'Aprenda de forma flexível com conteúdos digitais criados para a vida real, o trabalho e o crescimento pessoal.',
    ctaText: 'Ver Cursos',
    image: 'https://img.magnific.com/free-photo/woman-searching-something-internet-using-her-smartphone-while-being-home_23-2149240356.jpg'
  },
  {
    id: 3,
    title: (<>Conhecimento para <br /><span className="text-[#d8c29b] inline-block">o próximo passo</span></>),
    subtitle: 'Explore cursos em áreas profissionais relevantes, encontre formadores e transforme conhecimento em novas possibilidades.',
    ctaText: 'Explorar Cursos',
    image: 'https://img.magnific.com/free-photo/woman-using-digital-tablet-technology_23-2149491853.jpg'
  },
  {
    id: 4,
    title: (<>Aprenda. Pratique. <br /><span className="text-[#d8c29b] inline-block">Evolua.</span></>),
    subtitle: 'Aceda a recursos de aprendizagem e formação digital num espaço organizado para estudantes e profissionais.',
    ctaText: 'Descobrir Formações',
    image: 'https://img.magnific.com/free-photo/education-learning-concept-with-opening-book-textbook-old-library_1150-9085.jpg'
  }
];

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onFormadorClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % BANNERS.length), 5000);
    return () => clearInterval(timer);
  }, []);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  const banner = BANNERS[currentSlide];

  return (
    <section className="relative overflow-hidden bg-cover bg-center py-20 sm:py-24 lg:py-32 transition-all duration-700" style={{ backgroundImage: `linear-gradient(to right, rgba(17, 17, 17, 0.82) 0%, rgba(26, 26, 26, 0.56) 58%, rgba(26, 26, 26, 0.24) 100%), url('${banner.image}')` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 flex items-center justify-between">
        <button onClick={prevSlide} className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer absolute left-4" aria-label="Banner anterior"><ChevronLeft className="w-5 h-5" /></button>
        <div className="max-w-3xl space-y-5 text-left mx-auto md:ml-16 transition-opacity duration-500" key={banner.id}>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-outfit leading-[1.15]">{banner.title}</h1>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl leading-relaxed font-normal">{banner.subtitle}</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button onClick={banner.id === 3 ? onFormadorClick : onExploreClick} className="bg-[#be462a] hover:bg-[#a53b21] active:bg-[#8e321b] text-white text-sm font-semibold px-7 py-3 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"><span>{banner.ctaText}</span><ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
        <button onClick={nextSlide} className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer absolute right-4" aria-label="Próximo banner"><ChevronRight className="w-5 h-5" /></button>
      </div>
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-20">
        {BANNERS.map((_, idx) => <button key={idx} onClick={() => setCurrentSlide(idx)} aria-label={`Ver banner ${idx + 1}`} className={`h-2 rounded-full transition-all cursor-pointer ${currentSlide === idx ? 'w-7 bg-[#d8c29b]' : 'w-2 bg-white/50 hover:bg-white/80'}`} />)}
      </div>
    </section>
  );
};
