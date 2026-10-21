import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onFormadorClick: () => void;
}

const BANNERS = [
  {
    id: 1,
    title: (
      <>
        Food Market Event <br />
        <span className="text-[#f0a67d] inline-block">Online Workshop</span>
      </>
    ),
    subtitle: 'Participe na maior conferência de nutrição e mercado alimentar do ano. Garanta o seu bilhete agora.',
    ctaText: 'Participar no Evento',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: 2,
    title: (
      <>
        Promoções de <br />
        <span className="text-[#f0a67d] inline-block">Páscoa</span>
      </>
    ),
    subtitle: 'Aproveite até 50% de desconto em todos os cursos de especialização de TI e Design durante este mês.',
    ctaText: 'Explorar Cursos',
    image: 'https://images.pexels.com/photos/4466418/pexels-photo-4466418.jpeg?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: 3,
    title: (
      <>
        O Seu Ecossistema <br />
        de <span className="text-[#f0a67d] inline-block">Aprendizagem</span>
      </>
    ),
    subtitle: 'Ganhe dinheiro a ensinar ou impulsione a sua carreira com especializações de excelência. Um sítio online onde profissionais rentabilizam o seu saber.',
    ctaText: 'Tornar-se Formador',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80'
  }
];

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onFormadorClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  const banner = BANNERS[currentSlide];

  return (
    <section 
      className="relative overflow-hidden bg-cover bg-center py-24 sm:py-32 lg:py-40 transition-all duration-700"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(17, 17, 28, 0.90) 0%, rgba(26, 26, 26, 0.75) 50%, rgba(26, 26, 26, 0.5) 100%), url('${banner.image}')`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 flex items-center justify-between">
        
        {/* Carousel Navigation - Left */}
        <button onClick={prevSlide} className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer absolute left-4">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="max-w-3xl space-y-6 text-left mx-auto md:ml-16 transition-opacity duration-500" key={banner.id}>
          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-outfit leading-[1.15]">
            {banner.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed font-normal">
            {banner.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={banner.id === 3 ? onFormadorClick : onExploreClick}
              className="bg-[#be462a] hover:bg-[#a53b21] active:bg-[#8e321b] text-white text-sm font-bold px-8 py-3.5 rounded-full shadow-lg shadow-black/30 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{banner.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Navigation - Right */}
        <button onClick={nextSlide} className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer absolute right-4">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${currentSlide === idx ? 'w-8 bg-[#be462a]' : 'w-2 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </section>
  );
};
