import React, { useState, useEffect } from 'react';

interface HeroProps {
  onExploreClick: () => void;
  onFormadorClick: () => void;
}

const BANNERS = [
  {
    id: 1,
    eyebrow: 'EDUNOMBRE · APRENDIZAGEM ONLINE',
    title: (<>Aprenda ao seu ritmo <span className="text-[#f0a67d]">.</span></>),
    subtitle: 'Cursos e recursos para o seu próximo passo.',
    ctaText: 'Explorar cursos',
    image: 'https://images.pexels.com/photos/36698292/pexels-photo-36698292.jpeg?auto=compress&cs=tinysrgb&w=1400',
    alt: 'Aprendizagem e estudo online'
  },
  {
    id: 2,
    eyebrow: 'APRENDA EM QUALQUER LUGAR',
    title: (<>Conhecimento para crescer<span className="text-[#f0a67d]">.</span></>),
    subtitle: 'Aprendizagem simples, prática e flexível.',
    ctaText: 'Explorar cursos',
    image: 'https://images.pexels.com/photos/8154666/pexels-photo-8154666.jpeg?auto=compress&cs=tinysrgb&w=1400',
    alt: 'Jovem mulher a criar conteúdo com o telemóvel'
  },
  {
    id: 3,
    eyebrow: 'APRENDA COM QUEM FAZ',
    title: (<>Ideias que ganham vida<span className="text-[#f0a67d]">.</span></>),
    subtitle: 'Vídeos, cursos e materiais num só lugar.',
    ctaText: 'Explorar cursos',
    image: 'https://images.pexels.com/photos/7242796/pexels-photo-7242796.jpeg?auto=compress&cs=tinysrgb&w=1400',
    alt: 'Criadora de conteúdo a gravar um vídeo'
  },
  {
    id: 4,
    eyebrow: 'CONTEÚDOS PARA O DIA A DIA',
    title: (<>Aprenda fazendo<span className="text-[#f0a67d]">.</span></>),
    subtitle: 'Descubra novas competências e ponha-as em prática.',
    ctaText: 'Explorar cursos',
    image: 'https://images.pexels.com/photos/8770464/pexels-photo-8770464.jpeg?auto=compress&cs=tinysrgb&w=1400',
    alt: 'Criador a gravar um vídeo tutorial'
  },
  {
    id: 5,
    eyebrow: 'APRENDIZAGEM SEM FRONTEIRAS',
    title: (<>O próximo passo começa aqui<span className="text-[#f0a67d]">.</span></>),
    subtitle: 'Aceda aos seus conteúdos quando precisar.',
    ctaText: 'Explorar cursos',
    image: 'https://images.pexels.com/photos/5318479/pexels-photo-5318479.jpeg?auto=compress&cs=tinysrgb&w=1400',
    alt: 'Homem numa chamada de vídeo'
  },
];

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onFormadorClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[currentSlide];

  return (
    <section
      className="relative flex min-h-[540px] sm:min-h-[600px] lg:min-h-[640px] items-center overflow-hidden bg-[#101d2a]"
      aria-label={banner.alt}
    >
      <div aria-hidden="true" className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat opacity-40 blur-2xl" style={{ backgroundImage: `url('${banner.image}')` }} />
      <img src={banner.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover sm:object-contain sm:[mask-image:linear-gradient(to_right,transparent_0%,black_35%,black_65%,transparent_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071425]/80 via-[#071425]/45 to-[#071425]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071425]/20 via-transparent to-[#071425]/5" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
        <div key={banner.id} className="max-w-5xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/90">{banner.eyebrow}</p>
          <h1 className="max-w-5xl text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-[4.25rem]">{banner.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:mt-5 sm:text-lg">{banner.subtitle}</p>
          <div className="flex flex-wrap items-center gap-3 pt-6">
            <button onClick={onExploreClick} className="inline-flex items-center justify-center rounded-full border border-[#e66a32] bg-[#e66a32] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-[#ca5423] hover:bg-[#ca5423]">
              {banner.ctaText}
            </button>
            <button onClick={onFormadorClick} className="rounded-full border border-white/90 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-[#f0a67d] hover:text-[#f0a67d]">Sou formador</button>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-5">
            {BANNERS.map((slide, idx) => (
              <button key={slide.id} onClick={() => setCurrentSlide(idx)} aria-label={`Ver banner ${idx + 1}`} aria-current={currentSlide === idx ? 'true' : undefined} className={`h-2 rounded-full border border-white transition-all ${currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-transparent hover:border-[#f0a67d]'}`} />
            ))}
            <span className="ml-2 text-xs tabular-nums text-white/90">{String(currentSlide + 1).padStart(2, '0')} / {String(BANNERS.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
