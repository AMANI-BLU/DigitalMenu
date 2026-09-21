import React, { useEffect, useState, useRef } from 'react';
import * as Icons from 'lucide-react';
import ItemDetailModal from './ItemDetailModal';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function CustomerMenu({ 
  menu = [], 
  categories = [], 
  bankAccounts = [],
  onSubmitFeedback, 
  restaurantName = 'Abu Coffee',
  onToggleAdmin,
  mode = 'light',
  onToggleMode,
}) {
  const { t, getLocalizedCategory, getLocalizedItem } = useLanguage();
  const localizedCategories = categories.map(getLocalizedCategory);
  const localizedMenu = menu.map(getLocalizedItem);
  const menuCategories = localizedCategories.filter((category) => localizedMenu.some((item) => String(item.category) === String(category.id)));
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals and Drawers
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [copiedBankId, setCopiedBankId] = useState(null);

  // Feedback State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const categoryRefs = useRef({});

  useEffect(() => {
    if (selectedCategory !== 'all' && !localizedCategories.some((category) => String(category.id) === String(selectedCategory))) {
      setSelectedCategory('all');
    }
  }, [categories, selectedCategory]);

  const renderIcon = (name, className = "w-4 h-4") => {
    const IconComponent = Icons[name] || Icons.HelpCircle;
    return <IconComponent className={className} />;
  };

  const handleCopyAccount = async (bank) => {
    if (!bank?.accountNumber) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(bank.accountNumber);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = bank.accountNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedBankId(bank.id);
      setTimeout(() => {
        setCopiedBankId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy account number:', err);
    }
  };

  const filteredMenu = localizedMenu.filter(item => {
    if (selectedCategory !== 'all' && String(item.category) !== String(selectedCategory)) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = item.name?.toLowerCase().includes(q);
      const matchesDesc = item.description?.toLowerCase().includes(q);
      const matchesIng = item.ingredients && item.ingredients.some(ing => ing.toLowerCase().includes(q));
      if (!matchesName && !matchesDesc && !matchesIng) return false;
    }

    return true;
  });

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (onSubmitFeedback) {
      onSubmitFeedback({
        tableNumber: 'Customer',
        rating: feedbackRating,
        comment: feedbackComment,
        timestamp: new Date().toLocaleDateString()
      });
    }
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setFeedbackComment('');
      setShowFeedbackModal(false);
    }, 2000);
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId !== 'all') {
      categoryRefs.current[catId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  const renderItemThumbnail = (imageKey, itemName) => {
    const imageSource = imageKey && (imageKey.startsWith('http') || imageKey.startsWith('data:image/')) ? imageKey : null;

    if (imageSource) {
      return (
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-xs border border-stone-200/80 relative bg-stone-100 group">
          <img 
            src={imageSource}
            alt={itemName} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-xs">
        <Icons.Coffee className="w-8 h-8" />
      </div>
    );
  };

  return (
    <div className="customer-shell w-full max-w-6xl mx-auto min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col relative shadow-2xl border-x border-stone-200 font-body pb-16">
      
      {/* 1. TOP APP BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs min-h-16">
        {/* Hamburger Menu button */}
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-100 active:scale-95 transition-all"
          aria-label={t('openMenu')}
        >
          <Icons.Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Center Title with official emblem */}
        <div className="flex items-center gap-2">
          <img 
            src="/abu-coffee-logo.png" 
            alt="Abu Coffee" 
            className="w-8 h-8 rounded-full object-cover border border-amber-600/30 shadow-xs"
          />
          <h1 className="font-extrabold text-base tracking-tight text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>
            {restaurantName}
          </h1>
        </div>

        {/* Right Tools: Transfer Birr Quick Button & Language Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setShowBankModal(true)}
            className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 text-xs font-bold transition-all active:scale-95"
            title={t('transferBirr')}
          >
            <Icons.CreditCard className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">{t('transferBirr')}</span>
            <span className="sm:hidden font-mono font-bold text-[11px]">ETB</span>
          </button>
          <button
            type="button"
            onClick={onToggleMode}
            aria-label={t(mode === 'dark' ? 'lightMode' : 'darkMode')}
            title={t(mode === 'dark' ? 'lightMode' : 'darkMode')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-stone-700 transition hover:bg-stone-200"
          >
            {mode === 'dark' ? <Icons.Sun className="h-4 w-4" /> : <Icons.Moon className="h-4 w-4" />}
          </button>
          <LanguageSelector variant="header" theme={mode === 'dark' ? 'dark' : 'light'} />
        </div>
      </header>

      {/* 2. HERO BANNER WITH BRAND LOGO & ACTIONS */}
      <div className="theme-hero relative pt-7 pb-6 px-6 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white text-center overflow-hidden">
        {/* Ambient Coffee Glow & Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay filter blur-[1px]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop')` }}
        ></div>
        <div className="absolute -top-12 -left-12 w-44 h-44 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Official Abu Coffee Ethiopia Circular Emblem Logo */}
          <div className="relative mb-3 group">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-600 via-amber-300 to-emerald-500 shadow-2xl transition-transform duration-300 group-hover:scale-105">
              <img 
                src="/abu-coffee-logo.png" 
                alt="Abu Coffee Ethiopia" 
                className="w-full h-full rounded-full object-cover bg-stone-950 shadow-inner"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full border-2 border-stone-900 shadow">
              <Icons.Check className="w-3 h-3 stroke-[3]" />
            </div>
          </div>

          {/* Slogan & Poster Subheading */}
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            {t('heroHeading')}
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-sm font-medium">
            {t('heroTagline')}
          </p>

          {/* Inspiration Badge: "Simple · Moderno · Rápido" */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-700/80 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold mt-2.5 shadow-sm">
            <span>{t('badgeSimple')}</span>
            <span>•</span>
            <span>{t('badgeModern')}</span>
            <span>•</span>
            <span>{t('badgeFast')}</span>
          </div>

          {/* Quick Action Pills: Bank Transfer Modal & Feedback */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4 pt-3.5 border-t border-white/10 w-full max-w-md">
            <button 
              onClick={() => setShowBankModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black transition-all shadow-md active:scale-95"
            >
              <Icons.Building2 className="w-4 h-4 text-stone-950" />
              <span>{t('transferBirr')}</span>
            </button>

            <button 
              onClick={() => setShowFeedbackModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 active:scale-95"
            >
              <Icons.Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{t('leaveReview')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CATEGORIES HORIZONTAL CAROUSEL */}
      <nav aria-label={t('menuCategories')} className="customer-category-nav sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="category-scroller hide-scrollbar">
          <button
            type="button"
            onClick={() => handleCategorySelect('all')}
            className={`category-pill ${selectedCategory === 'all' ? 'category-pill-active' : ''}`}
          >
            <Icons.LayoutGrid className={`w-3.5 h-3.5 ${selectedCategory === 'all' ? 'stroke-[2.5]' : ''}`} />
            <span>{t('allCategories')}</span>
          </button>
          {menuCategories.map(cat => {
            const isSelected = String(selectedCategory) === String(cat.id);
            return (
              <button
              key={cat.id}
                ref={el => categoryRefs.current[cat.id] = el}
                onClick={() => handleCategorySelect(cat.id)}
                className={`category-pill ${isSelected ? 'category-pill-active' : ''}`}
              >
                {renderIcon(cat.icon, `w-3.5 h-3.5 ${isSelected ? 'stroke-[2.5]' : ''}`)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. SEARCH & QUICK FILTERS */}
      <div className="customer-filter-bar">
        <div className="customer-search">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="customer-search-input"
          />
          <div className="customer-search-icon">
            <Icons.Search className="w-4 h-4" />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="customer-search-clear"
              aria-label={t('clearSearch')}
            >
              <Icons.X className="w-4 h-4" />
            </button>
          )}
        </div>

        <label className="customer-category-filter">
          <span className="sr-only">{t('filterCategory')}</span>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="customer-category-select"
          >
            <option value="all">{t('allCategories')}</option>
            {menuCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <Icons.ChevronDown className="customer-category-chevron" aria-hidden="true" />
        </label>
      </div>

      {/* 5. HOT DRINKS / ITEMS LIST */}
      <main className="w-full max-w-5xl mx-auto px-4 mt-4 flex-1">
        {filteredMenu.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredMenu.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-stone-200 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:border-emerald-300 group"
              >
                {/* Left: Square Thumbnail */}
                {renderItemThumbnail(item.image, item.name)}

                {/* Middle: Drink name, description, and price in ETB */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-stone-900 leading-snug group-hover:text-emerald-800 transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                      {item.name}
                    </h3>
                    {item.tags && item.tags.length > 0 && item.tags.includes("Favorito") && (
                      <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {t('favoriteBadge')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Bottom Row: Price & Details Pill */}
                  <div className="flex items-center justify-between mt-2.5 pt-1">
                    <span className="font-extrabold text-sm sm:text-base text-emerald-900">
                      {item.price} ETB
                    </span>

                    <span className="text-[11px] font-bold text-stone-400 group-hover:text-emerald-700 flex items-center gap-1 transition-colors">
                      <span>{t('viewDetails') || 'Details'}</span>
                      <Icons.ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-stone-400">
            <Icons.Coffee className="w-10 h-10 mx-auto stroke-[1.2] text-stone-300" />
            <p className="text-xs font-semibold mt-2">{t('noItemsFound')}</p>
          </div>
        )}
      </main>

      {/* 6. BANK TRANSFER / MOBILE MONEY MODAL */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[160] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-stone-200 rounded-[28px] p-5 sm:p-6 w-full max-w-md shadow-2xl text-left text-stone-900 max-h-[90dvh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Icons.Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                    {t('bankAccountsTitle')}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {t('bankAccountsSubtitle')}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowBankModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Banks */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {bankAccounts && bankAccounts.length > 0 ? (
                bankAccounts.map(bank => {
                  const isCopied = copiedBankId === bank.id;
                  return (
                    <div 
                      key={bank.id}
                      className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/80 hover:bg-white hover:border-amber-400/60 transition-all shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3 h-3 rounded-full shrink-0" 
                              style={{ backgroundColor: bank.color || '#d97706' }}
                            />
                            <h4 className="font-extrabold text-sm text-stone-900">
                              {bank.bankName}
                            </h4>
                          </div>
                          <p className="text-xs text-stone-500 mt-1">
                            <span className="font-medium text-stone-400">{t('accountNameLabel')} </span>
                            <span className="font-semibold text-stone-700">{bank.accountName}</span>
                          </p>
                        </div>
                      </div>

                      {/* Account Number & Copy Button */}
                      <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between gap-2">
                        <div className="bg-white px-3 py-1.5 rounded-xl border border-stone-200/80 flex-1">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block leading-none mb-0.5">
                            {t('accountNumberLabel')}
                          </span>
                          <span className="font-mono text-sm sm:text-base font-black text-stone-900 tracking-wider">
                            {bank.accountNumber}
                          </span>
                        </div>

                        <button
                          onClick={() => handleCopyAccount(bank)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 shadow-xs shrink-0 ${
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-900 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Icons.Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>{t('accountCopied')}</span>
                            </>
                          ) : (
                            <>
                              <Icons.Copy className="w-3.5 h-3.5" />
                              <span>{t('copyAccount')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-stone-400 text-xs">
                  {t('emptyBanks')}
                </div>
              )}

              {/* Receipt notice */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
                <Icons.Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  {t('transferReceiptNotice')}
                </p>
              </div>
            </div>

            {/* Bottom Close */}
            <div className="pt-3 border-t border-stone-200">
              <button
                onClick={() => setShowBankModal(false)}
                className="w-full py-2.5 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
              >
                {t('closeModal')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. SIDE DRAWER NAVIGATION */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[150] flex animate-fade-in">
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col p-6 text-left animate-slide-right">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <img 
                  src="/abu-coffee-logo.png" 
                  alt="Abu Coffee Logo" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-black text-sm leading-none">{restaurantName}</h3>
                </div>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Links & Info */}
            <div className="flex-1 py-4 space-y-4 overflow-y-auto">
              <LanguageSelector variant="drawer" theme={mode === 'dark' ? 'dark' : 'light'} />

              <div className="space-y-1">
                <button 
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setShowBankModal(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-100 text-xs font-bold text-stone-800"
                >
                  <Icons.Building2 className="w-4 h-4 text-amber-600" />
                  <span>{t('transferBirr')}</span>
                </button>

                <button 
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setShowFeedbackModal(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-100 text-xs font-bold text-stone-800"
                >
                  <Icons.Star className="w-4 h-4 text-amber-500" />
                  <span>{t('leaveReview')}</span>
                </button>
              </div>
            </div>

            {/* Switch to Merchant Console */}
            <div className="pt-4 border-t border-stone-200">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  if (onToggleAdmin) onToggleAdmin();
                }}
                className="w-full py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Icons.Lock className="w-3.5 h-3.5" />
                <span>{t('adminConsole')}</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsDrawerOpen(false)}></div>
        </div>
      )}

      {/* 8. FEEDBACK / REVIEW MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center text-stone-900">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2.5">
              <Icons.Star className="w-6 h-6 fill-amber-500 text-amber-500" />
            </div>
            <h3 className="text-base font-black">{t('reviewModalTitle')}</h3>
            <p className="text-xs text-stone-500 mt-0.5">{t('reviewModalSubtitle')}</p>

            {feedbackSuccess ? (
              <div className="mt-4 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5">
                <Icons.CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t('reviewSuccessMessage')}
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Icons.Star className={`w-7 h-7 ${
                        feedbackRating >= star 
                          ? 'fill-amber-400 stroke-amber-400 text-amber-400' 
                          : 'stroke-stone-300 text-transparent'
                      }`} />
                    </button>
                  ))}
                </div>

                <div className="text-left">
                  <label className="text-[10px] uppercase font-bold text-stone-500">{t('reviewCommentLabel')}</label>
                  <textarea
                    rows={3}
                    placeholder={t('reviewCommentPlaceholder')}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full mt-1 border border-stone-200 bg-stone-50 text-stone-900 rounded-xl p-2.5 text-xs font-medium focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                  >
                    {t('closeButton')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white"
                  >
                    {t('submitReviewButton')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 9. ITEM DETAIL SHOWCASE MODAL */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

    </div>
  );
}
