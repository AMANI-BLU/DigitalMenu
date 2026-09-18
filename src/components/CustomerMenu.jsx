import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import ItemDetailModal from './ItemDetailModal';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { dishImagesMap } from '../data/initialMenu';

export default function CustomerMenu({ 
  menu, 
  categories, 
  onPlaceOrder, 
  onCallWaiter, 
  onSubmitFeedback, 
  initialTable,
  restaurantName,
  onToggleAdmin
}) {
  const { t, getLocalizedItem } = useLanguage();
  const localizedMenu = menu.map(getLocalizedItem);
  const [selectedCategory, setSelectedCategory] = useState('starters');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [filterSpicyOnly, setFilterSpicyOnly] = useState(false);
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Checkout type states
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' | 'delivery'
  const [tableNumber, setTableNumber] = useState(initialTable || '04');
  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const [showCallWaiterModal, setShowCallWaiterModal] = useState(false);
  const [showQrWelcomeModal, setShowQrWelcomeModal] = useState(false);
  const [waiterReason, setWaiterReason] = useState('general');
  const [waiterAlertSent, setWaiterAlertSent] = useState(false);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const [copiedMessage, setCopiedMessage] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);

  const categoryRefs = useRef({});

  useEffect(() => {
    if (initialTable) {
      setTableNumber(initialTable);
      setOrderType('dine-in');
    }
  }, [initialTable]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasSeenQrWelcome = window.localStorage.getItem('abu-coffee-welcome-seen');
    if (!hasSeenQrWelcome && !initialTable && !window.location.search.includes('admin=true')) {
      const timer = window.setTimeout(() => setShowQrWelcomeModal(true), 600);
      return () => window.clearTimeout(timer);
    }
  }, [initialTable]);

  const handleQrWelcomeClose = () => {
    setShowQrWelcomeModal(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('abu-coffee-welcome-seen', 'true');
    }
  };

  const renderIcon = (name, className = "w-4 h-4") => {
    const IconComponent = Icons[name] || Icons.HelpCircle;
    return <IconComponent className={className} />;
  };

  // Helper to count total quantity of a menu item currently in cart
  const getItemQuantityInCart = (itemId) => {
    return cart
      .filter(item => item.id === itemId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  // Inline Quick Add [ + ] button directly from the card
  const handleInlineAdd = (item, e) => {
    if (e) e.stopPropagation();

    // Check if an entry for this item already exists in cart
    const existingIndex = cart.findIndex(i => i.id === item.id);
    if (existingIndex > -1) {
      updateCartQty(existingIndex, 1);
    } else {
      // Add as new item with default selections if any
      const defaultSelections = {};
      if (item.customizations) {
        item.customizations.forEach(cust => {
          if (cust.type === 'single' && cust.options && cust.options[0]) {
            defaultSelections[cust.name] = cust.options[0];
          }
        });
      }

      addToCart({
        ...item,
        quantity: 1,
        selectedCustomizations: defaultSelections,
        finalUnitPrice: item.price,
        finalTotalPrice: item.price
      });
    }
  };

  // Inline Quick Subtract [ - ] button directly from the card
  const handleInlineSubtract = (item, e) => {
    if (e) e.stopPropagation();
    const existingIndex = cart.findIndex(i => i.id === item.id);
    if (existingIndex > -1) {
      updateCartQty(existingIndex, -1);
    }
  };

  const addToCart = (customizedItem) => {
    setCart(prev => {
      const matchIndex = prev.findIndex(i => 
        i.id === customizedItem.id && 
        JSON.stringify(i.selectedCustomizations) === JSON.stringify(customizedItem.selectedCustomizations)
      );

      if (matchIndex > -1) {
        const copy = [...prev];
        copy[matchIndex].quantity += customizedItem.quantity;
        copy[matchIndex].finalTotalPrice = copy[matchIndex].finalUnitPrice * copy[matchIndex].quantity;
        return copy;
      }
      return [...prev, customizedItem];
    });

    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 300);
  };

  const updateCartQty = (index, delta) => {
    setCart(prev => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty <= 0) {
        return copy.filter((_, idx) => idx !== index);
      }
      copy[index].quantity = newQty;
      copy[index].finalTotalPrice = copy[index].finalUnitPrice * newQty;
      return copy;
    });
  };

  const getSubtotal = () => cart.reduce((acc, curr) => acc + curr.finalTotalPrice, 0);
  const getTotalItemsCount = () => cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const subtotal = getSubtotal();
  const totalItemsCount = getTotalItemsCount();

  const filteredMenu = localizedMenu.filter(item => {
    if (item.category !== selectedCategory) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesDesc = item.description.toLowerCase().includes(q);
      const matchesIng = item.ingredients && item.ingredients.some(ing => ing.toLowerCase().includes(q));
      if (!matchesName && !matchesDesc && !matchesIng) return false;
    }

    if (filterVegOnly) {
      const isVeg = item.tags.some(tag => /vegetarian|vegan|vegetariano|ተክል|Biqiltuu/i.test(tag));
      if (!isVeg) return false;
    }

    if (filterSpicyOnly) {
      const isSpicy = item.tags.some(tag => /spicy|picante|ቅመም|Qaraawaa/i.test(tag));
      if (!isSpicy) return false;
    }

    return true;
  });

  // Generate the WhatsApp message using the active language.
  const generateWhatsAppMessage = () => {
    const header = t('waOrderGreeting');
    const itemsList = cart.map(item => {
      let customDetails = "";
      if (item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0) {
        const parts = Object.entries(item.selectedCustomizations)
          .map(([, v]) => Array.isArray(v) ? v.map(x => x.name).join(', ') : v)
          .filter(Boolean);
        if (parts.length > 0) {
          customDetails = ` (${parts.join(', ')})`;
        }
      }
      return `• ${item.quantity} ${item.name}${customDetails}`;
    }).join('\n');

    const totalText = `${t('waTotal')} ${subtotal} ETB`;
    const locationInfo = orderType === 'dine-in'
      ? `${t('waTable')} ${String(tableNumber).padStart(2, '0')}`
      : `${t('waDeliveryDetails')}\n${t('waName')} ${deliveryName || t('customerName')}\n${t('waPhone')} ${deliveryPhone}\n${t('waAddress')} ${deliveryAddress}`;

    return `${header}\n${itemsList}\n\n${totalText}\n${locationInfo}`;
  };

  const handleCopyMessage = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    if (orderType === 'dine-in' && !tableNumber) {
      alert(t('alertEnterTable'));
      return;
    }
    if (orderType === 'delivery' && (!deliveryName || !deliveryPhone || !deliveryAddress)) {
      alert(t('alertEnterDelivery'));
      return;
    }

    const message = generateWhatsAppMessage();
    // Default cafe WhatsApp phone number (can be customized)
    const phone = "251911234567";
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    // Open in WhatsApp
    window.open(waUrl, '_blank');

    // Also record the order in our system
    onPlaceOrder({
      items: cart,
      subtotal,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : null,
      deliveryDetails: orderType === 'delivery' ? {
        name: deliveryName,
        phone: deliveryPhone,
        address: deliveryAddress
      } : null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
      offerApplied: null
    });

    setOrderSuccessModal(true);
    setCart([]);
    setIsCartOpen(false);
  };

  const handleDirectSystemOrder = () => {
    if (orderType === 'dine-in' && !tableNumber) {
      alert(t('alertEnterTable'));
      return;
    }
    if (orderType === 'delivery' && (!deliveryName || !deliveryPhone || !deliveryAddress)) {
      alert(t('alertEnterDelivery'));
      return;
    }

    onPlaceOrder({
      items: cart,
      subtotal,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : null,
      deliveryDetails: orderType === 'delivery' ? {
        name: deliveryName,
        phone: deliveryPhone,
        address: deliveryAddress
      } : null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
      offerApplied: null
    });

    setOrderSuccessModal(true);
    setCart([]);
    setIsCartOpen(false);
  };

  const handleCallWaiterSubmit = (e) => {
    e.preventDefault();
    if (!tableNumber) {
      alert(t('alertEnterTableFirst'));
      return;
    }
    const waiterReasonLabel = {
      general: t('waiterReasonGeneral'),
      water: t('waiterReasonWater'),
      bill: t('waiterReasonBill'),
      napkins: t('waiterReasonNapkins')
    }[waiterReason] || t('waiterReasonGeneral');
    onCallWaiter({
      tableNumber,
      reason: waiterReasonLabel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setWaiterAlertSent(true);
    setTimeout(() => {
      setWaiterAlertSent(false);
      setShowCallWaiterModal(false);
    }, 2000);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    onSubmitFeedback({
      tableNumber: orderType === 'dine-in' ? `${t('tableLabel')} ${tableNumber}` : t('delivery'),
      rating: feedbackRating,
      comment: feedbackComment,
      timestamp: new Date().toLocaleDateString()
    });
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setFeedbackComment('');
      setShowFeedbackModal(false);
    }, 2000);
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    categoryRefs.current[catId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  };

  const renderItemThumbnail = (imageKey, itemName) => {
    const imageUrl = dishImagesMap[imageKey] || (imageKey && imageKey.startsWith('http') ? imageKey : null);

    if (imageUrl) {
      return (
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-stone-200/80 relative bg-stone-100 group">
          <img 
            src={imageUrl} 
            alt={itemName} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
        <Icons.Coffee className="w-8 h-8" />
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col relative shadow-2xl border-x border-stone-200 font-body pb-32">
      
      {/* 1. TOP APP BAR (matching the smartphone mockup in reference poster) */}
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
            className="w-7 h-7 rounded-full object-cover border border-amber-600/30"
          />
          <h1 className="font-extrabold text-base tracking-tight text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>
            {restaurantName}
          </h1>
        </div>

        {/* Shopping Cart Button with Green Count Badge */}
        <div className="flex items-center gap-1.5">
        <LanguageSelector variant="header" />
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-100 active:scale-95 transition-all"
          aria-label={t('openCart')}
        >
          <Icons.ShoppingCart className="w-5 h-5 stroke-[2.2]" />
          {totalItemsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
              {totalItemsCount}
            </span>
          )}
        </button>
        </div>
      </header>

      {/* 2. HERO BANNER WITH BRAND LOGO & TAGLINES */}
      <div className="relative pt-6 pb-5 px-6 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white text-center overflow-hidden">
        {/* Ambient Coffee Glow & Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay filter blur-[1px]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop')` }}
        ></div>
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

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

          {/* Quick Action Pills: WhatsApp Concierge, Call Waiter, Table info */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-3 border-t border-white/10 w-full">
            {orderType === 'dine-in' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/15">
                <Icons.MapPin className="w-3.5 h-3.5 text-amber-400" />
                {t('tableLabel')} {String(tableNumber).padStart(2, '0')}
              </span>
            )}
            <button 
              onClick={() => setShowCallWaiterModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 active:scale-95"
            >
              <Icons.BellRing className="w-3.5 h-3.5 text-amber-400" />
              {t('callWaiter')}
            </button>
            <a 
              href="https://wa.me/251911234567" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition-all border border-emerald-400/30 active:scale-95 shadow-sm"
            >
              <Icons.MessageCircle className="w-3.5 h-3.5" />
              {t('directWhatsApp')}
            </a>
          </div>
        </div>
      </div>

      {/* 3. CATEGORIES HORIZONTAL CAROUSEL (matching inspiration mockup pills) */}
      <nav aria-label={t('menuCategories')} className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 py-3 px-4 shadow-xs">
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar scroll-smooth">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                ref={el => categoryRefs.current[cat.id] = el}
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 ${
                  isSelected 
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-[1.02]' 
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                {renderIcon(cat.icon, `w-3.5 h-3.5 ${isSelected ? 'stroke-[2.5]' : ''}`)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. SEARCH & QUICK FILTERS */}
      <div className="w-full max-w-4xl mx-auto px-4 pt-3 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-xl py-2.5 pl-9 pr-8 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 border border-stone-200 shadow-xs"
          />
          <div className="absolute left-3 top-2.5 text-stone-400">
            <Icons.Search className="w-4 h-4" />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-9 px-3 rounded-xl flex items-center justify-center border transition-all text-xs font-bold gap-1.5 shadow-xs ${
            showFilters || filterVegOnly || filterSpicyOnly
              ? 'text-emerald-700 border-emerald-600 bg-emerald-50'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Icons.SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{t('filters')}</span>
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="mx-4 mt-2 p-2.5 bg-white rounded-xl border border-stone-200 shadow-xs flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilterVegOnly(!filterVegOnly)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
                filterVegOnly 
                  ? 'bg-emerald-600 border-emerald-600 text-white' 
                  : 'bg-stone-50 border-stone-200 text-stone-600'
              }`}
            >
              <Icons.Leaf className="w-3 h-3" /> {t('filterVegetarian')}
            </button>
            <button 
              onClick={() => setFilterSpicyOnly(!filterSpicyOnly)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
                filterSpicyOnly 
                  ? 'bg-rose-600 border-rose-600 text-white' 
                  : 'bg-stone-50 border-stone-200 text-stone-600'
              }`}
            >
              <Icons.Flame className="w-3 h-3" /> {t('filterSpicy')}
            </button>
          </div>
          <button 
            onClick={() => {
              setFilterVegOnly(false);
              setFilterSpicyOnly(false);
              setShowFilters(false);
            }}
            className="text-[11px] font-bold text-stone-400 hover:text-stone-700"
          >
            {t('filterClear')}
          </button>
        </div>
      )}

      {/* 5. DISHES / ITEMS LIST (CENTERPIECE FROM THE INSPIRATION POSTER) */}
      <main className="w-full max-w-5xl mx-auto px-4 mt-4 flex-1">
        {filteredMenu.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {filteredMenu.map(item => {
              const qtyInCart = getItemQuantityInCart(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`flex items-center gap-3 p-3 sm:p-4 bg-white rounded-2xl border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:border-emerald-300 ${
                    qtyInCart > 0 ? 'border-emerald-500/40 bg-emerald-50/20' : 'border-stone-200'
                  }`}
                >
                  {/* Left: Square Thumbnail (inspired by Bruschetta / Caesar / Pasta on reference image) */}
                  {renderItemThumbnail(item.image, item.name)}

                  {/* Middle: Dish Name, Description, Price */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-stone-900 leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>
                        {item.name}
                      </h3>
                      {item.tags && item.tags.length > 0 && item.tags.includes("Favorito") && (
                        <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider">
                          {t('favoriteBadge')}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Bottom Row: Price + Direct Quantity Selector Pill [ - 1 + ] */}
                    <div className="flex items-center justify-between mt-2.5 pt-1">
                      <span className="font-extrabold text-sm sm:text-base text-stone-900">
                        {item.price} ETB
                      </span>

                      {/* Quantity Selector Pill as shown in the inspiration mockup */}
                      {qtyInCart > 0 ? (
                        <div 
                          className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 rounded-full px-1.5 py-0.5 shadow-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleInlineSubtract(item, e)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-emerald-800 hover:bg-emerald-200 active:scale-90 transition-all font-black text-sm"
                            title={t('decreaseQty')}
                          >
                            −
                          </button>
                          <span className="w-4 text-center font-black text-xs text-emerald-900">
                            {qtyInCart}
                          </span>
                          <button
                            onClick={(e) => handleInlineAdd(item, e)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-emerald-800 hover:bg-emerald-200 active:scale-90 transition-all font-black text-sm"
                            title={t('increaseQty')}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleInlineAdd(item, e)}
                          className="px-3 py-1 rounded-full bg-stone-100 hover:bg-emerald-600 hover:text-white text-stone-700 font-bold text-xs border border-stone-200 transition-all active:scale-95 flex items-center gap-1 shadow-2xs"
                        >
                          <span>+</span>
                          <span>{t('addToCart')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-stone-400">
            <Icons.Coffee className="w-10 h-10 mx-auto stroke-[1.2] text-stone-300" />
            <p className="text-xs font-semibold mt-2">{t('noItemsFound')}</p>
          </div>
        )}
      </main>

      {/* 6. STICKY BOTTOM BAR (EXACT INSPIRATION DESIGN: "ENVIAR PEDIDO POR WHATSAPP") */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-2xl z-40 max-w-5xl mx-auto animate-slide-up">
          <div className="flex items-center justify-between gap-3">
            {/* Left Summary: Item Count & Total */}
            <div 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 cursor-pointer select-none py-1 pl-1"
            >
              <div className="relative w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Icons.ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-emerald-700 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow">
                  {totalItemsCount}
                </span>
              </div>
              <div className="text-left leading-tight">
                <span className="text-[11px] font-semibold text-stone-500 block">
                  {totalItemsCount} {totalItemsCount === 1 ? t('itemSingle') : t('itemPlural')}
                </span>
                <span className="text-base font-black text-stone-900">
                  {subtotal} ETB
                </span>
              </div>
            </div>

            {/* Right Action Button: Big Green "ENVIAR PEDIDO POR WHATSAPP" CTA */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`flex-1 max-w-xs h-12 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all whatsapp-glow ${
                animateCart ? 'cart-bounce' : ''
              }`}
            >
              {/* WhatsApp Icon */}
              <Icons.MessageCircle className="w-4.5 h-4.5 fill-white text-emerald-700" />
              <span>{t('sendOrderWhatsApp')}</span>
            </button>
          </div>
        </div>
      )}

      {/* 7. WHATSAPP CHECKOUT & CHAT PREVIEW DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex flex-col justify-end animate-fade-in">
          <div className="w-full bg-white rounded-t-[32px] max-h-[92dvh] flex flex-col shadow-2xl max-w-2xl mx-auto border-t border-stone-200">
            {/* Header */}
            <div className="px-6 pt-5 pb-3 border-b flex items-center justify-between border-stone-200">
              <div className="flex items-center gap-2">
                <img 
                  src="/abu-coffee-logo.png" 
                  alt="Abu Coffee" 
                  className="w-6 h-6 rounded-full"
                />
                <h2 className="text-base font-extrabold tracking-tight text-stone-900">
                  {t('yourOrder')}
                </h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Contents */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              
              {/* Order Mode Toggle: Dine-In vs Delivery */}
              <div className="flex border border-stone-200 rounded-xl p-1 bg-stone-100 gap-1">
                <button
                  type="button"
                  onClick={() => setOrderType('dine-in')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    orderType === 'dine-in'
                      ? 'bg-emerald-700 text-white shadow'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icons.Utensils className="w-3.5 h-3.5" />
                  <span>{t('dineIn')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    orderType === 'delivery'
                      ? 'bg-emerald-700 text-white shadow'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icons.Bike className="w-3.5 h-3.5" />
                  <span>{t('delivery')}</span>
                </button>
              </div>

              {/* Table or Address Fields */}
              {orderType === 'dine-in' ? (
                <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Icons.QrCode className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">{t('tableNumberLabel')}</span>
                    <input
                      type="number"
                      required
                      placeholder={t('tableNumberPlaceholder')}
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full mt-0.5 bg-transparent font-black text-sm border-b border-stone-300 focus:border-emerald-600 focus:outline-none text-stone-900"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 space-y-2 text-left">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-1">{t('customerName')}</label>
                      <input
                        type="text"
                        placeholder={t('customerName')}
                        value={deliveryName}
                        onChange={(e) => setDeliveryName(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-1">{t('customerPhone')}</label>
                      <input
                        type="tel"
                        placeholder="+251 ..."
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 block mb-1">{t('deliveryAddress')}</label>
                    <input
                      type="text"
                      placeholder={t('deliveryAddressPlaceholder')}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="divide-y divide-stone-200">
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 text-left">
                      <h4 className="font-bold text-xs text-stone-900">{item.name}</h4>
                      {item.selectedCustomizations && (
                        <div className="text-[10px] text-stone-500 mt-0.5 space-y-0.5">
                          {Object.entries(item.selectedCustomizations).map(([cName, val]) => {
                            if (Array.isArray(val)) {
                              if (val.length === 0) return null;
                              return <p key={cName}>{cName}: {val.map(v => v.name).join(', ')}</p>;
                            }
                            return <p key={cName}>{cName}: {val}</p>;
                          })}
                        </div>
                      )}
                      <span className="text-xs font-extrabold text-emerald-800 mt-1 inline-block">
                        {item.finalUnitPrice} ETB
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 border border-stone-200 rounded-xl p-1 bg-stone-50">
                      <button 
                        onClick={() => updateCartQty(idx, -1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-white rounded"
                      >
                        <Icons.Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQty(idx, 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-white rounded"
                      >
                        <Icons.Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* WHATSAPP MESSAGE BUBBLE PREVIEW (recreating the graphic shown in the inspiration poster!) */}
              <div className="mt-4 pt-3 border-t border-stone-200 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                    <Icons.MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    {t('whatsAppPreviewTitle')}
                  </span>
                  <button 
                    onClick={handleCopyMessage}
                    className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <Icons.Copy className="w-3 h-3" />
                    {copiedMessage ? t('copiedSuccess') : t('copyMessage')}
                  </button>
                </div>

                <div className="whatsapp-chat-bubble p-4 text-xs text-stone-800 space-y-1.5 font-sans leading-relaxed">
                  <p className="font-semibold text-stone-900">{t('waOrderGreeting')}</p>
                  <div className="pl-1 space-y-0.5">
                    {cart.map((item, i) => (
                      <p key={i} className="font-medium">
                        • {item.quantity} {item.name}
                      </p>
                    ))}
                  </div>
                  <div className="pt-2 mt-2 border-t border-emerald-300/40 flex items-center justify-between font-bold">
                    <span>{t('waTotal')} {subtotal} ETB</span>
                    <span className="text-[10px] text-stone-500 font-normal flex items-center gap-1">
                      11:30 <Icons.CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                  </div>
                </div>

                {/* Pedido recibido confirmation bubble simulation (from inspiration mockup) */}
                <div className="mt-3 bg-white p-3 rounded-2xl border border-emerald-200 shadow-2xs flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Icons.Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-stone-900">{t('orderReceivedSimulation')}</h5>
                    <p className="text-[11px] text-stone-500">{t('orderReceivedSimDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50 flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-sm font-black">
                <span>{t('totalToPay')}</span>
                <span className="text-xl font-black text-emerald-800">
                  {subtotal} ETB
                </span>
              </div>

              {/* Main Button 1: Send via WhatsApp */}
              <button
                onClick={handleOpenWhatsApp}
                className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all"
              >
                <Icons.MessageCircle className="w-4.5 h-4.5 fill-white" />
                <span>{t('sendOrderWhatsApp')}</span>
              </button>

              {/* Direct Kitchen Confirm Button */}
              <button
                onClick={handleDirectSystemOrder}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-200 font-bold text-xs transition-all"
              >
                {t('confirmDirectKitchen')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. ORDER SUCCESS MODAL */}
      {orderSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[160] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-emerald-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Icons.CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-black text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>
              {t('orderSuccessTitle')}
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              {t('orderSuccessDesc')}
            </p>

            <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs font-semibold text-stone-700 flex items-center justify-between">
              <span>{t('orderStatusLabel')}</span>
              <span className="text-emerald-700 font-bold">{t('orderStatusPreparing')}</span>
            </div>

            <button
              onClick={() => setOrderSuccessModal(false)}
              className="mt-5 w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              {t('backToMenu')}
            </button>
          </div>
        </div>
      )}

      {/* 9. SIDE DRAWER NAVIGATION (CLICK HAMBURGER) */}
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
                  <h3 className="font-black text-sm leading-none">Abu Coffee</h3>
                  <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Ethiopia</span>
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
              <LanguageSelector variant="drawer" />

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">{t('guestWifi')}</span>
                <div className="text-xs font-bold text-stone-800">
                  <p>{t('networkLabel')} <span className="font-mono text-emerald-800">AbuCoffee_Guest</span></p>
                  <p>{t('passwordLabel')} <span className="font-mono text-emerald-800">buna2026</span></p>
                </div>
              </div>

              <div className="space-y-1">
                <button 
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setShowCallWaiterModal(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-100 text-xs font-bold text-stone-800"
                >
                  <Icons.BellRing className="w-4 h-4 text-amber-600" />
                  <span>{t('callWaiter')}</span>
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

                <a 
                  href="https://wa.me/251911234567" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-100 text-xs font-bold text-stone-800"
                >
                  <Icons.MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{t('whatsappContact')}</span>
                </a>
              </div>
            </div>

            {/* Switch to Merchant Console */}
            <div className="pt-4 border-t border-stone-200">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onToggleAdmin();
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

      {/* 10. CALL WAITER MODAL */}
      {showCallWaiterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center text-stone-900">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Icons.BellRing className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black tracking-tight">{t('waiterModalTitle')}</h3>
            <p className="text-xs text-stone-500 mt-1">{t('waiterModalSubtitle')}</p>

            {waiterAlertSent ? (
              <div className="mt-4 p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-200">
                <Icons.CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t('waiterSentAlert')}
              </div>
            ) : (
              <form onSubmit={handleCallWaiterSubmit} className="mt-4">
                <div className="mb-3 text-left">
                  <label className="text-[10px] uppercase font-bold text-stone-500">{t('tableNumberLabel')}</label>
                  <input
                    type="number"
                    required
                    placeholder={t('tableNumberPlaceholder')}
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full mt-1 border border-stone-200 bg-stone-50 rounded-xl p-2.5 text-xs font-black focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    ['general', 'waiterReasonGeneral'],
                    ['water', 'waiterReasonWater'],
                    ['bill', 'waiterReasonBill'],
                    ['napkins', 'waiterReasonNapkins']
                  ].map(([reason, labelKey]) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setWaiterReason(reason)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                        waiterReason === reason 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                          : 'border-stone-200 text-stone-600 bg-white'
                      }`}
                    >
                      {t(labelKey)}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCallWaiterModal(false)}
                    className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                  >
                    {t('cancelButton')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white"
                  >
                    {t('callButton')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 11. FEEDBACK / REVIEW MODAL */}
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

      {/* 12. WELCOME QR MODAL */}
      {showQrWelcomeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[180] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-stone-200 rounded-[28px] p-6 w-full max-w-sm shadow-2xl text-center text-stone-900">
            <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-amber-600 to-emerald-600 mx-auto mb-3 shadow">
              <img 
                src="/abu-coffee-logo.png" 
                alt="Abu Coffee" 
                className="w-full h-full rounded-full object-cover bg-black"
              />
            </div>
            <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {t('welcomeTitle')}
            </h3>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              {t('welcomeDesc')}
            </p>

            <div className="mt-4 text-left">
              <label className="text-[10px] uppercase font-bold text-stone-500">{t('whichTablePrompt')}</label>
              <input
                type="number"
                placeholder={t('tableNumberPlaceholder')}
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full mt-1 border border-stone-200 bg-stone-50 rounded-xl p-2.5 text-sm font-black focus:outline-none focus:border-emerald-600 text-stone-900"
              />
            </div>

            <button
              type="button"
              onClick={handleQrWelcomeClose}
              className="mt-5 w-full py-3 text-xs font-black uppercase tracking-wider rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white shadow-md shadow-emerald-700/25"
            >
              {t('exploreMenuButton')}
            </button>
          </div>
        </div>
      )}

      {/* 13. ITEM DETAIL MODAL (CUSTOMIZATIONS) */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={addToCart}
        />
      )}

    </div>
  );
}
