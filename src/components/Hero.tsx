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
    ctaText: 'Ver cursos',
    image: 'https://images.pexels.com/photos/8154666/pexels-photo-8154666.jpeg?auto=compress&cs=tinysrgb&w=1400',
    alt: 'Jovem mulher a criar conteúdo com o telemóvel'
  },
  {
    id: 3,
    eyebrow: 'APRENDA COM QUEM FAZ',
    title: (<>Ideias que ganham vida<span className="text-[#f0a67d]">.</span></>),
    subtitle: 'Vídeos, cursos e materiais num só lugar.',
    ctaText: 'Explorar',
    image: 'https://images.pexels.com/photos/7242796/pexels-photo-7242796.jpeg?auto=compress&cs=tinysrgb&w=1400',
    alt: 'Criadora de conteúdo a gravar um vídeo'
  },
  {
    id: 4,
    eyebrow: 'CONTEÚDOS PARA O DIA A DIA',
    title: (<>Aprenda fazendo<span className="text-[#f0a67d]">.</span></>),
    subtitle: 'Descubra novas competências e ponha-as em prática.',
    ctaText: 'Ver conteúdos',
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
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % BANNERS.length), 6000);
    return (
    <section
      className="relative flex min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] items-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${banner.image}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#071425]/85 via-[#071425]/60 to-[#071425]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071425]/25 via-transparent to-[#071425]/10" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div key={banner.id} className="max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/90">{banner.eyebrow}</p>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">{banner.title}</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">{banner.subtitle}</p>
          <div className="flex flex-wrap items-center gap-3 pt-7">
            <button onClick={onExploreClick} className="inline-flex items-center justify-center rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-[#f0a67d] hover:text-[#f0a67d]">
              {banner.ctaText}
            </button>
            <button onClick={onFormadorClick} className="rounded-full border border-white/90 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-[#f0a67d] hover:text-[#f0a67d]">Sou formador</button>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-7">
            {BANNERS.map((slide, idx) => <button key={slide.id} onClick={() => setCurrentSlide(idx)} aria-label={`Ver banner ${idx + 1}`} aria-current={currentSlide === idx ? 'true' : undefined} className={`h-2 rounded-full border border-white transition-all ${currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-transparent hover:border-[#f0a67d]'}`} />)}
            <span className="ml-2 text-xs tabular-nums text-white/90">{String(currentSlide + 1).padStart(2, '0')} / {String(BANNERS.length).padStart(2, '0')}</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={prevSlide} className="rounded-full border border-white/85 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[#f0a67d] hover:text-[#f0a67d]">Anterior</button>
            <button type="button" onClick={nextSlide} className="rounded-full border border-white/85 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[#f0a67d] hover:text-[#f0a67d]">Seguinte</button>
          </div>
        </div>
      </div>
    </section>
  );
};
