import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  isCollapsed?: boolean;
  fullWidth?: boolean;
}

export default function LanguageSwitcher({ isCollapsed = false, fullWidth = true }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh-TW' ? 'en' : 'zh-TW';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center justify-center border border-[#eceae4] bg-white/50 shadow-sm text-[#5f5f5d] hover:text-[#1c1c1c] transition-all hover:bg-black/5 shrink-0 ${
        isCollapsed 
          ? 'p-2 rounded-2xl flex-col lg:p-3' 
          : `p-2 rounded-2xl lg:px-5 lg:py-3 flex-col lg:flex-row lg:justify-start lg:rounded-full ${fullWidth ? 'w-full' : 'w-auto px-4 py-2'}`
      }`}
      title={i18n.language === 'zh-TW' ? 'Switch to English' : '切換至繁體中文'}
      aria-label="Toggle Language"
    >
      <Globe className="w-4 h-4 shrink-0" />
      {!isCollapsed && (
        <span className="text-[10px] lg:text-sm font-medium tracking-wide ml-2 lg:ml-3">
          {i18n.language === 'zh-TW' ? '繁體中文' : 'English'}
        </span>
      )}
    </button>
  );
}
