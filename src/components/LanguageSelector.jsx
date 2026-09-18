import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector({ variant = 'header', className = '', theme = 'light' }) {
  const { language, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isDark = theme === 'dark' || className.includes('admin') || className.includes('dark');
  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Drawer / List Variant (full row buttons with native names and checkmarks)
  if (variant === 'drawer') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex items-center justify-between px-1 mb-1">
          <span className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${
            isDark ? 'text-gray-400' : 'text-stone-400'
          }`}>
            <Icons.Globe className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
            <span>{t('selectLanguage')}</span>
          </span>
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {languages.map(lang => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  isDark
                    ? isSelected
                      ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-400 shadow-2xs'
                      : 'bg-[#1e212f] border-[#2d3142] text-gray-300 hover:bg-[#252836] hover:text-white'
                    : isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{lang.flag}</span>
                  <div className="text-left leading-tight">
                    <span className={`block font-extrabold ${isDark ? 'text-white' : 'text-stone-900'}`}>
                      {lang.nativeName}
                    </span>
                    <span className={`text-[10px] font-medium ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>
                      {lang.name}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-emerald-500 text-black' : 'bg-emerald-600 text-white'
                  }`}>
                    <Icons.Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Pill row variant
  if (variant === 'pills') {
    return (
      <div className={`inline-flex items-center gap-1 p-1 rounded-xl border ${
        isDark 
          ? 'bg-[#1e212f] border-[#2d3142]' 
          : 'bg-stone-100 border-stone-200'
      } ${className}`}>
        {languages.map(lang => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : isDark 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.short}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Header Dropdown Variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={t('selectLanguage')}
        aria-expanded={isOpen}
        className={`h-9 px-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 shadow-2xs ${
          isDark
            ? 'bg-[#1e212f] hover:bg-[#252836] text-gray-200 border-[#2d3142]'
            : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200/80'
        }`}
      >
        <Icons.Globe className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
        <span className="hidden sm:inline font-extrabold">{currentLangObj.nativeName}</span>
        <span className="sm:hidden font-extrabold">{currentLangObj.short}</span>
        <Icons.ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-1.5 w-48 rounded-2xl shadow-2xl py-1.5 z-50 animate-slide-up border ${
          isDark
            ? 'bg-[#171923] border-[#2d3142] text-gray-200'
            : 'bg-white border-stone-200 text-stone-800'
        }`}>
          <div className={`px-3 py-1.5 border-b text-[10px] uppercase font-bold tracking-wider ${
            isDark
              ? 'border-[#252836] text-gray-400'
              : 'border-stone-100 text-stone-400'
          }`}>
            {t('selectLanguage')}
          </div>
          {languages.map(lang => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs font-bold transition-colors ${
                  isDark
                    ? isSelected
                      ? 'bg-emerald-950/60 text-emerald-400'
                      : 'text-gray-300 hover:bg-[#1e212f] hover:text-white'
                    : isSelected 
                      ? 'bg-emerald-50 text-emerald-900' 
                      : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <div>
                    <p className={`font-extrabold leading-none ${
                      isDark 
                        ? (isSelected ? 'text-emerald-400' : 'text-white')
                        : (isSelected ? 'text-emerald-900' : 'text-stone-900')
                    }`}>
                      {lang.nativeName}
                    </p>
                    <p className={`text-[10px] font-normal mt-0.5 ${
                      isDark ? 'text-gray-400' : 'text-stone-500'
                    }`}>
                      {lang.name}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <Icons.Check className={`w-4 h-4 stroke-[2.5] ${
                    isDark ? 'text-emerald-400' : 'text-emerald-700'
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
