import React from 'react';

interface AdBannerProps {
  onAdClick?: () => void;
}

export const AdBannerSection: React.FC<AdBannerProps> = () => (
  <section aria-label="Publicidade" className="py-5 sm:py-7">
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="rounded-lg border border-slate-200 bg-white text-center py-2.5 text-[10px] font-bold tracking-[0.18em] text-[#746b65]">
        PUBLICIDADE
      </div>
    </div>
  </section>
);
