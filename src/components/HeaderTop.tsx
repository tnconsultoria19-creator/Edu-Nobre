import React from 'react';
import { Phone, User, Globe, ChevronDown, Check } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderTopProps {
  user: UserType | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  currency: string;
  setCurrency: (curr: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export const HeaderTop: React.FC<HeaderTopProps> = ({
  user,
  onOpenAuth,
  onLogout,
  currency,
  setCurrency,
  language,
  setLanguage,
}) => {
  const [langOpen, setLangOpen] = React.useState(false);
  const [currOpen, setCurrOpen] = React.useState(false);

  return (
    <div className="bg-[#efe1d6] border-b border-[#e2d5c8] text-xs py-2 px-4 sm:px-8 text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left contacts */}
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-[#be462a]"></span>
            <span className="hidden sm:inline font-semibold">Edunombre Angola</span>
          </span>
          <a
            href="tel:+244900000000"
            className="flex items-center gap-1.5 hover:text-[#be462a] transition-colors font-medium text-[#1a1a1a]"
          >
            <Phone className="w-3.5 h-3.5 text-[#be462a]" />
            +244 900 000 000
          </a>
        </div>

        {/* Right utilities */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setLangOpen(!langOpen);
                setCurrOpen(false);
              }}
              className="flex items-center gap-1 hover:text-[#be462a] cursor-pointer font-medium"
            >
              <Globe className="w-3.5 h-3.5 text-[#be462a]" />
              <span>{language}</span>
              <ChevronDown className="w-3 h-3 text-[#858586]" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-[#e2d5c8] rounded-xl shadow-lg z-50 py-1 min-w-[130px]">
                {['Português (AO)', 'English', 'Français'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setLangOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7ebe4] hover:text-[#be462a] flex items-center justify-between transition-colors"
                  >
                    <span>{lang}</span>
                    {language === lang && <Check className="w-3 h-3 text-[#be462a]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setCurrOpen(!currOpen);
                setLangOpen(false);
              }}
              className="flex items-center gap-1 hover:text-[#be462a] cursor-pointer font-medium"
            >
              <span className="font-bold text-[#be462a]">{currency}</span>
              <ChevronDown className="w-3 h-3 text-[#858586]" />
            </button>
            {currOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-[#e2d5c8] rounded-xl shadow-lg z-50 py-1 min-w-[100px]">
                {['AOA', 'USD', 'EUR'].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setCurrOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#f7ebe4] hover:text-[#be462a] flex items-center justify-between transition-colors"
                  >
                    <span>{curr}</span>
                    {currency === curr && <Check className="w-3 h-3 text-[#be462a]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[#e2d5c8]">
              <div className="w-5 h-5 rounded-full bg-[#be462a] text-white flex items-center justify-center font-bold text-[10px]">
                {user.name.charAt(0)}
              </div>
              <span className="font-semibold text-[#1a1a1a]">{user.name.split(' ')[0]}</span>
              <button
                onClick={onLogout}
                className="text-[10px] text-red-600 hover:underline ml-1 cursor-pointer"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 text-[#1a1a1a] hover:text-[#be462a] font-semibold cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#be462a]" />
              <span>Entrar / Registar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
