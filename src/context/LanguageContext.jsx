import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages } from '../data/translations';
import { adminTranslations } from '../data/adminTranslations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Default to English ('en'), restore from localStorage if user previously selected
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('abu_coffee_language');
      if (saved && (saved === 'en' || saved === 'am' || saved === 'om')) {
        return saved;
      }
    }
    return 'en';
  });

  const setLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'am' || newLang === 'om') {
      setLanguageState(newLang);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('abu_coffee_language', newLang);
      }
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  // Translation helper with English fallback and token replacements {key}
  const t = (key, replacements = {}) => {
    const langDict = translations[language] || translations.en;
    const adminLangDict = adminTranslations[language] || adminTranslations.en;
    let text = langDict[key] || adminLangDict[key] || translations.en[key] || adminTranslations.en[key] || key;

    if (replacements && typeof replacements === 'object') {
      Object.entries(replacements).forEach(([token, val]) => {
        text = text.replace(new RegExp(`\\{${token}\\}`, 'g'), val);
      });
    }

    return text;
  };

  // Resolve a localized category object
  const getLocalizedCategory = (cat) => {
    if (!cat) return cat;
    const localizedName = cat.translations?.[language] || cat.translations?.en || cat.name;
    return {
      ...cat,
      name: localizedName,
    };
  };

  // Resolve a localized menu item object (name, description, tags, ingredients, customizations)
  const getLocalizedItem = (item) => {
    if (!item) return item;
    
    const localizedData = item.translations?.[language] || item.translations?.en || {};
    const name = localizedData.name || item.name;
    const description = localizedData.description || item.description;
    const tags = localizedData.tags || item.tags || [];
    const ingredients = localizedData.ingredients || item.ingredients || [];

    // Localize customizations if present
    let customizations = item.customizations || [];
    if (item.customizations && item.customizations.length > 0) {
      customizations = item.customizations.map(cust => {
        const custTranslations = cust.translations?.[language] || cust.translations?.en || {};
        const custName = custTranslations.name || cust.name;

        if (cust.type === 'single') {
          const options = custTranslations.options || cust.options;
          return {
            ...cust,
            name: custName,
            options,
          };
        } else if (cust.type === 'multiple') {
          const options = cust.options.map(opt => {
            const optName = opt.translations?.[language] || opt.translations?.en || opt.name;
            return {
              ...opt,
              name: optName,
            };
          });
          return {
            ...cust,
            name: custName,
            options,
          };
        }

        return cust;
      });
    }

    return {
      ...item,
      name,
      description,
      tags,
      ingredients,
      customizations,
    };
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages,
        getLocalizedCategory,
        getLocalizedItem,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
