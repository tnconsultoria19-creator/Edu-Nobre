import React from 'react';
import { ContentType, Category } from '../types';
import { CATEGORIES_LIST } from '../data/mockData';
import { BookOpen, FileText, Video, Users, Layers, Award } from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  selectedContentType: ContentType;
  setSelectedContentType: (type: ContentType) => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedContentType,
  setSelectedContentType,
}) => {
  const contentTypesList: { id: ContentType; label: string; icon: React.ReactNode }[] = [
    { id: 'Todas', label: 'Todas', icon: <Layers className="w-4 h-4" /> },
    { id: 'Cursos Online', label: 'Cursos Online', icon: <Video className="w-4 h-4" /> },
    { id: 'E-books', label: 'E-books', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'Arquivos', label: 'Arquivos', icon: <FileText className="w-4 h-4" /> },
    { id: 'Masterclass', label: 'Masterclass', icon: <Award className="w-4 h-4" /> },
    { id: 'Mentores', label: 'Mentores', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div id="catalogo" className="py-6 bg-white border-b border-[#dfdfe4] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-5">
        {/* Type Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#11112c] font-outfit">
            Explorar Catálogo
          </h2>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {contentTypesList.map((ct) => (
              <button
                key={ct.id}
                onClick={() => setSelectedContentType(ct.id)}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  selectedContentType === ct.id
                    ? 'bg-[#ea407f] text-white shadow-md shadow-[#ea407f]/20'
                    : 'bg-[#f3f4f7] text-[#68687b] hover:bg-[#FFEFEF] hover:text-[#ea407f]'
                }`}
              >
                {ct.icon}
                <span>{ct.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories Bar Horizontal Scroll */}
        <div className="relative">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#11112c] text-white shadow'
                    : 'bg-[#f8f9fa] border border-[#dfdfe4] text-[#232329] hover:border-[#ea407f] hover:text-[#ea407f]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
