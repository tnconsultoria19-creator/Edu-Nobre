import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onFormadorClick: () => void;
}

const BANNERS = [
  {
    id: 1,
    eyebrow: 'EDUNOMBRE · APRENDIZAGEM ONLINE',
    title: (<>Aprenda ao seu ritmo <span className="text-[#be462a]">.</span></>),
    subtitle: 'Cursos e recursos para o seu próximo passo.',
    ctaText: 'Explorar cursos',
    image: 'https://images.pexels.com/photos/36698292/pexels-photo-36698292.jpeg?auto=compress&cs=tinysrgb&w=1400',
    alt: 'Aprendizagem e estudo online'
  },
  {
    id: 2,
    eyebrow: 'APRENDA EM QUALQUER LUGAR',
    title: (<>Conhecimento para crescer<span className="text-[#be462a]">.</span></>),
    subtitle: 'Aprendizagem simples, prática e flexível.',
    ctaText: 'Ver cursos',
    image: 'https://images.pexels.com/photos/8154666/pexels-photo-8154666.jpeg?auto=compress&cs=tinysrgb&w=1400',
    alt: 'Jovem mulher a criar conteúdo com o telemóvel'
  },
  {
    id: 3,
    eyebrow: 'APRENDA COM QUEM FAZ',
    title: (<>Ideias que ganham vida<span className="text-[#be462a]">.</span></>),
    subtitle: 'Vídeos, cursos e materiais num só lugar.',
    ctaText: 'Explorar',
    image: 'https://images.pexels.com/photos/7242796/pexels-photo-7242796.jpeg?auto=compress&cs=tinysrgb&w=1400',
    alt: 'Criadora de conteúdo a gravar um vídeo'
  },
  {
    id: 4,
    eyebrow: 'CONTEÚDOS PARA O DIA A DIA',
    title: (<>Aprenda fazendo<span className="text-[#be462a]">.</span></>),
    subtitle: 'Descubra novas competências e ponha-as em prática.',
    ctaText: 'Ver conteúdos',
    image: 'https://images.pexels.com/photos/8770464/pexels-photo-8770464.jpeg?auto=compress&cs=tinysrgb&w=1400',
    alt: 'Criador a gravar um vídeo tutorial'
  },
  {
    id: 5,
    eyebrow: 'APRENDIZAGEM SEM FRONTEIRAS',
    title: (<>O próximo passo começa aqui<span className="text-[#be462a]">.</span></>),
    subtitle: 'Aceda aos seus conteúdos quando precisar.',
    ctaText: 'Explorar cursos',
    image: 'https://images.pexels.com/photos/5318479/pexels-photo-5318479.jpeg?auto=compress&cs=tinysrgb&w=1400',
    alt: 'Homem numa chamada de vídeo'
  },
];

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onFormadorClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % BANNERS.length), 6000);
    return () => clearInterval(timer);
  }, []);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  const banner = BANNERS[currentSlide];

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] items-center gap-8 lg:gap-14">
          <div className="relative order-2 md:order-1 min-w-0" key={banner.id}>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.16em] font-bold text-[#185a7d] mb-4">{banner.eyebrow}</p>
            <h1 className="text-3xl leading-tight sm:text-5xl lg:text-[3.6rem] lg:leading-[1.08] font-black tracking-tight text-[#0c2340]">{banner.title}</h1>
            <p className="mt-4 text-sm sm:text-base text-[#586675] max-w-md leading-relaxed">{banner.subtitle}</p>
            <div className="flex flex-wrap items-center gap-3 pt-5">
              <button onClick={onExploreClick} className="bg-[#be462a] hover:bg-[#a53b21] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors flex items-center gap-2">
                {banner.ctaText}<ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onFormadorClick} className="text-[#0c2340] hover:text-[#be462a] text-sm font-semibold px-3 py-3 rounded-full transition-colors">Sou formador</button>
            </div>
            <div className="flex items-center gap-2 pt-7">
              {BANNERS.map((slide, idx) => <button key={slide.id} onClick={() => setCurrentSlide(idx)} aria-label={`Ver banner ${idx + 1}`} className={`h-1.5 rounded-full transition-all ${currentSlide === idx ? 'w-7 bg-[#be462a]' : 'w-1.5 bg-[#d6dde3] hover:bg-[#9eabb7]'}`} />)}
              <span className="ml-2 text-[10px] tabular-nums text-[#8a96a2]">{String(currentSlide + 1).padStart(2, '0')} / {String(BANNERS.length).padStart(2, '0')}</span>
            </div>
          </div>
          <div className="relative order-1 md:order-2 min-w-0">
            <div className="aspect-[5/4] sm:aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-[2rem] bg-[#f4f6f7]">
              <img key={banner.image} src={banner.image} alt={banner.alt} className="w-full h-full object-cover transition-opacity duration-500" />
            </div>
            <button onClick={prevSlide} aria-label="Banner anterior" className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 shadow-sm border border-black/5 flex items-center justify-center text-[#0c2340] hover:bg-white"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={nextSlide} aria-label="Próximo banner" className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 shadow-sm border border-black/5 flex items-center justify-center text-[#0c2340] hover:bg-white"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
};
