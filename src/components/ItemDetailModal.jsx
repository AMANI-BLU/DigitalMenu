import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ItemDetailModal({ item, onClose }) {
  const { t } = useLanguage();
  const [selections, setSelections] = useState({});

  // Initialize selections with first option for single selections
  useEffect(() => {
    if (item && item.customizations) {
      const initial = {};
      item.customizations.forEach(cust => {
        if (cust.type === 'single') {
          initial[cust.name] = cust.options[0];
        } else if (cust.type === 'multiple') {
          initial[cust.name] = [];
        }
      });
      setSelections(initial);
    }
  }, [item]);

  if (!item) return null;

  // Render icons dynamically from Lucide-React
  const renderIcon = (name, className = "w-4 h-4") => {
    const IconComponent = Icons[name] || Icons.HelpCircle;
    return <IconComponent className={className} />;
  };

  // Handle single selection options
  const handleSingleSelect = (customizationName, option) => {
    setSelections(prev => ({
      ...prev,
      [customizationName]: option
    }));
  };

  // Handle multiple selection options (checkboxes)
  const handleMultipleSelect = (customizationName, option) => {
    setSelections(prev => {
      const currentList = prev[customizationName] || [];
      const exists = currentList.find(o => o.name === option.name);
      
      let updatedList;
      if (exists) {
        updatedList = currentList.filter(o => o.name !== option.name);
      } else {
        updatedList = [...currentList, option];
      }

      return {
        ...prev,
        [customizationName]: updatedList
      };
    });
  };

  const renderDrinkGraphics = (imageType) => {
    const imageSource = imageType && (imageType.startsWith('http') || imageType.startsWith('data:image/')) ? imageType : null;

    if (imageSource) {
      return (
        <div className="w-full h-48 rounded-2xl overflow-hidden relative border border-border-color shadow-sm">
          <img 
            src={imageSource}
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          {/* Floating Tag */}
          {item.tags && item.tags.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
              {item.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-gray-800 shadow">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    const bgStyle = { backgroundColor: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' };
    return (
      <div 
        className="w-full h-48 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300"
        style={bgStyle}
      >
        <div className="absolute w-36 h-36 -top-12 -left-12 rounded-full opacity-10 bg-current"></div>
        <div className="absolute w-44 h-44 -bottom-16 -right-12 rounded-full opacity-15 bg-current"></div>
        <Icons.Utensils className="w-16 h-16 stroke-[1.5]" />
        
        {/* Floating Tag */}
        {item.tags && item.tags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {item.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-gray-800 shadow">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-end justify-center p-0 transition-opacity duration-300 animate-fade-in">
      <div 
        className="w-full max-w-2xl max-h-[92dvh] bg-white rounded-t-[32px] shadow-2xl flex flex-col animate-slide-up overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
      >
        {/* Header Drag Bar / Close Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-gray-100 bg-opacity-95 backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
            {t('itemDetailsTitle')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            {renderIcon("X", "w-5 h-5")}
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-28 flex-1">
          {/* Cover Image/Graphics */}
          <div className="mt-2">
            {renderDrinkGraphics(item.image)}
          </div>

            {/* Drink details and pricing */}
          <div className="mt-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {item.name}
              </h3>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400" style={{ color: 'var(--primary)' }}>
                {item.price} ETB
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-semibold text-gray-500" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-1">
                {renderIcon("Star", "w-4 h-4 fill-amber-400 stroke-amber-400")}
                <span className="text-gray-800 dark:text-gray-200 font-bold">{item.rating}</span>
                <span>({item.reviews} {t('reviewsCount')})</span>
              </div>
              <div className="flex items-center gap-1">
                {renderIcon("Clock", "w-4 h-4")}
                <span>{item.prepTime?.split(' ')[0]} {t('prepTimeLabel')}</span>
              </div>
              {item.calories && (
                <div className="flex items-center gap-1">
                  {renderIcon("Flame", "w-4 h-4 text-orange-500")}
                  <span>{item.calories} {t('caloriesLabel')}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {item.description}
            </p>
          </div>

          {/* Ingredients list */}
          {item.ingredients && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">{t('ingredientsTitle')}</h4>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients.map(ing => (
                  <span 
                    key={ing} 
                    className="text-xs px-2.5 py-1 rounded-lg border border-gray-200"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Customization Options */}
          {item.customizations && item.customizations.map(cust => (
            <div key={cust.name} className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold uppercase tracking-wider">{cust.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-widest">
                  {cust.type === 'single' ? t('selectOneOption') : t('optionalMulti')}
                </span>
              </div>

              {cust.type === 'single' ? (
                // Radio Options (Horizontal / Vertical stack)
                <div className="flex flex-col gap-2">
                  {cust.options.map(opt => {
                    const isSelected = selections[cust.name] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSingleSelect(cust.name, opt)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          isSelected 
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        style={{
                          borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                          backgroundColor: isSelected ? 'rgba(var(--primary-rgb), 0.08)' : '',
                          color: isSelected ? 'var(--primary)' : 'var(--text-primary)'
                        }}
                      >
                        <span>{opt}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                        }`}
                        style={{
                          borderColor: isSelected ? 'var(--primary)' : '',
                          backgroundColor: isSelected ? 'var(--primary)' : '',
                        }}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                // Checkbox Options
                <div className="flex flex-col gap-2">
                  {cust.options.map(opt => {
                    const selectedList = selections[cust.name] || [];
                    const isSelected = !!selectedList.find(o => o.name === opt.name);
                    return (
                      <button
                        key={opt.name}
                        onClick={() => handleMultipleSelect(cust.name, opt)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          isSelected 
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        style={{
                          borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                          backgroundColor: isSelected ? 'rgba(var(--primary-rgb), 0.08)' : '',
                          color: isSelected ? 'var(--primary)' : 'var(--text-primary)'
                        }}
                      >
                        <span>{opt.name}</span>
                        <div className="flex items-center gap-3">
                          {opt.price > 0 && (
                            <span className="text-xs text-gray-500 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                              +{opt.price} ETB
                            </span>
                          )}
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                          }`}
                          style={{
                            borderColor: isSelected ? 'var(--primary)' : '',
                            backgroundColor: isSelected ? 'var(--primary)' : '',
                          }}
                          >
                            {isSelected && renderIcon("Check", "w-3 h-3 text-white stroke-[3]")}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sticky Footer Showcase Controls */}
        <div className="sticky bottom-0 left-0 right-0 p-4 sm:p-5 border-t border-gray-100 bg-opacity-95 backdrop-blur-md flex items-center justify-between gap-4 z-20" style={{ backgroundColor: 'var(--bg-secondary)', borderTopColor: 'var(--border-color)' }}>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              {t('basePrice')}
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400" style={{ color: 'var(--primary)' }}>
              {item.price} ETB
            </span>
          </div>

          <button
            onClick={onClose}
            className="py-3 px-6 rounded-2xl text-white font-extrabold text-sm tracking-wide shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {t('closeModal')}
          </button>
        </div>
      </div>
    </div>
  );
}
