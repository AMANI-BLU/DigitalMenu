import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import ItemDetailModal from './ItemDetailModal';
import { dishImagesMap } from '../data/initialMenu';

export default function CustomerMenu({ 
  menu, 
  categories, 
  theme, 
  onPlaceOrder, 
  onCallWaiter, 
  onSubmitFeedback, 
  initialTable,
  restaurantName,
  tagline,
  onToggleAdmin
}) {
  const [selectedCategory, setSelectedCategory] = useState('starters');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [filterSpicyOnly, setFilterSpicyOnly] = useState(false);
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Checkout type states
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' | 'delivery'
  const [tableNumber, setTableNumber] = useState(initialTable || '');
  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const [showCallWaiterModal, setShowCallWaiterModal] = useState(false);
  const [waiterReason, setWaiterReason] = useState('Assistance');
  const [waiterAlertSent, setWaiterAlertSent] = useState(false);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const [activeHeaderOverlay, setActiveHeaderOverlay] = useState(null); // 'location' | 'phone' | 'whatsapp' | null
  const categoryRefs = useRef({});

  useEffect(() => {
    if (initialTable) {
      setTableNumber(initialTable);
      setOrderType('dine-in');
    }
  }, [initialTable]);

  const renderIcon = (name, className = "w-4 h-4") => {
    const IconComponent = Icons[name] || Icons.HelpCircle;
    return <IconComponent className={className} />;
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

  const romanticOffer = {
    threshold: 60,
    title: "Romantic Dining Offer",
    desc: "Spend $60 to unlock 1 complimentary dessert + 1 mocktail"
  };
  const subtotal = getSubtotal();
  const romanticProgressPercent = Math.min(100, (subtotal / romanticOffer.threshold) * 100);
  const romanticOfferUnlocked = subtotal >= romanticOffer.threshold;

  const filteredMenu = menu.filter(item => {
    if (item.category !== selectedCategory) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesDesc = item.description.toLowerCase().includes(q);
      const matchesIng = item.ingredients && item.ingredients.some(ing => ing.toLowerCase().includes(q));
      if (!matchesName && !matchesDesc && !matchesIng) return false;
    }

    if (filterVegOnly) {
      const isVeg = item.tags.some(tag => tag.toLowerCase().includes('vegetarian') || tag.toLowerCase().includes('vegan'));
      if (!isVeg) return false;
    }

    if (filterSpicyOnly) {
      const isSpicy = item.tags.some(tag => tag.toLowerCase().includes('spicy'));
      if (!isSpicy) return false;
    }

    return true;
  });

  const handlePlaceOrderClick = () => {
    if (orderType === 'dine-in') {
      if (!tableNumber) {
        alert("Please enter your Table Number before placing your order!");
        return;
      }
    } else {
      if (!deliveryName || !deliveryPhone || !deliveryAddress) {
        alert("Please fill out your Name, Phone Number, and Delivery Address to place a delivery order!");
        return;
      }
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
      offerApplied: romanticOfferUnlocked ? romanticOffer.title : null
    });

    // Reset Cart and inputs
    setCart([]);
    setIsCartOpen(false);
    setDeliveryName('');
    setDeliveryPhone('');
    setDeliveryAddress('');
  };

  const handleCallWaiterSubmit = (e) => {
    e.preventDefault();
    if (!tableNumber) {
      alert("Please specify your table number first!");
      return;
    }
    onCallWaiter({
      tableNumber,
      reason: waiterReason,
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
      tableNumber: orderType === 'dine-in' ? `Table ${tableNumber}` : "Delivery Client",
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

  const renderItemThumbnail = (imageType) => {
    const imageUrl = dishImagesMap[imageType] || (imageType && imageType.startsWith('http') ? imageType : null);

    if (imageUrl) {
      return (
        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-border-color shadow-sm">
          <img 
            src={imageUrl} 
            alt="Dish Thumbnail" 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
      );
    }

    const defaultColor = 'var(--primary)';
    const defaultBg = 'rgba(var(--primary-rgb), 0.08)';
    return (
      <div 
        className="w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all shadow-sm shrink-0"
        style={{ backgroundColor: defaultBg, color: defaultColor }}
      >
        <Icons.Utensils className="w-8 h-8" />
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen bg-bg-primary text-text-primary flex flex-col relative shadow-xl border-x border-border-color transition-all duration-300 pb-36">
      
      {/* Top Banner Cover Photo */}
      <div className="relative h-56 w-full bg-gray-950 z-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 filter blur-[0.5px]" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop')` }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-black/30 to-transparent"></div>
        </div>
        
        {/* Contacts overlay bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveHeaderOverlay(activeHeaderOverlay === 'location' ? null : 'location')}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white/25 active:scale-95"
            >
              {renderIcon("MapPin", "w-5 h-5")}
            </button>
            <button 
              onClick={() => setActiveHeaderOverlay(activeHeaderOverlay === 'phone' ? null : 'phone')}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white/25 active:scale-95"
            >
              {renderIcon("PhoneCall", "w-5 h-5")}
            </button>
            <button 
              onClick={() => setActiveHeaderOverlay(activeHeaderOverlay === 'whatsapp' ? null : 'whatsapp')}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white/25 active:scale-95"
            >
              {renderIcon("MessageCircle", "w-5 h-5")}
            </button>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFeedbackModal(true)}
              className="text-xs font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full hover:bg-white/25 transition-all"
            >
              Review Us
            </button>
            <button 
              onClick={onToggleAdmin}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white/25 active:scale-95"
              title="Merchant View"
            >
              {renderIcon("Lock", "w-4 h-4")}
            </button>
          </div>
        </div>

        {/* Dynamic header widgets overlays */}
        {activeHeaderOverlay && (
          <div className="absolute top-16 left-4 right-4 bg-bg-secondary p-4 rounded-2xl shadow-2xl z-50 text-xs text-text-primary border border-border-color animate-fade-in">
            {activeHeaderOverlay === 'location' && (
              <div className="flex flex-col gap-1.5 text-left">
                <span className="font-extrabold text-sm text-text-primary flex items-center gap-1.5">
                  {renderIcon("MapPin", "w-4 h-4 text-red-500")} Restaurant Address
                </span>
                <p className="text-text-secondary mt-1">102 Elegant Promenade Avenue, Suite A</p>
                <a href="#map" className="text-primary font-bold hover:underline mt-2 inline-block">View Route on Map &rarr;</a>
              </div>
            )}
            {activeHeaderOverlay === 'phone' && (
              <div className="flex flex-col gap-1.5 text-left">
                <span className="font-extrabold text-sm text-text-primary flex items-center gap-1.5">
                  {renderIcon("PhoneCall", "w-4 h-4 text-emerald-500")} Front Desk Call
                </span>
                <p className="text-text-secondary mt-1">Direct support hotline for reservations and queries.</p>
                <a href="tel:+15550199" className="bg-primary text-white text-center py-2.5 rounded-xl font-bold mt-2 inline-block shadow">+1 (555) 0199</a>
              </div>
            )}
            {activeHeaderOverlay === 'whatsapp' && (
              <div className="flex flex-col gap-1.5 text-left">
                <span className="font-extrabold text-sm text-text-primary flex items-center gap-1.5">
                  {renderIcon("MessageCircle", "w-4 h-4 text-emerald-500")} WhatsApp Concierge
                </span>
                <p className="text-text-secondary mt-1">Text-only assistant for custom event catering bookings.</p>
                <a href="https://wa.me/15550199" target="_blank" rel="noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-white text-center py-2.5 rounded-xl font-bold mt-2 inline-block shadow">
                  Chat with Concierge
                </a>
              </div>
            )}
          </div>
        )}

        {/* Restaurant logo (inspired by Image 1 logo badge) */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
          <div className="w-24 h-24 rounded-full border-4 border-accent bg-[#0f5132] flex items-center justify-center shadow-2xl transition-transform hover:scale-105 duration-300">
            <div className="text-center p-2 text-white flex flex-col items-center justify-center">
              <span className="text-[6px] tracking-wider uppercase opacity-90 leading-none">Bistro &amp; Lounge</span>
              <span className="text-xs font-black tracking-widest uppercase leading-none mt-1">BISTRO</span>
              <span className="text-[6px] tracking-wider uppercase opacity-90 leading-none mt-1">&amp; Company</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intro branding text */}
      <div className="text-center mt-20 px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-primary opacity-80">Welcome To</p>
        <h1 
          className="text-2xl font-black tracking-tight mt-1 mb-1"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {restaurantName}
        </h1>
        <p className="text-xs italic text-text-secondary leading-relaxed">
          {tagline}
        </p>
      </div>

      {/* Categories Horizontal Carousel */}
      <div className="mt-6 px-6 overflow-x-auto whitespace-nowrap hide-scrollbar scroll-smooth">
        <div className="flex gap-2.5 pb-1">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                ref={el => categoryRefs.current[cat.id] = el}
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm border ${
                  isSelected 
                    ? 'border-transparent text-white' 
                    : 'bg-bg-secondary text-text-secondary border-border-color hover:bg-bg-tertiary'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--primary)' : '',
                  color: isSelected ? 'var(--text-light)' : ''
                }}
              >
                {renderIcon(cat.icon, `w-4 h-4 ${isSelected ? 'stroke-[2.5]' : ''}`)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters bar */}
      <div className="px-6 mt-4 flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search recipes, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-secondary rounded-xl py-3 pl-10 pr-10 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-border-color"
          />
          <div className="absolute left-3.5 top-3.5 text-text-secondary">
            {renderIcon("Search", "w-4 h-4")}
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-text-secondary hover:text-text-primary"
            >
              {renderIcon("X", "w-4 h-4")}
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl flex items-center justify-center border transition-all ${
            showFilters || filterVegOnly || filterSpicyOnly
              ? 'text-primary border-primary bg-primary/10'
              : 'bg-bg-secondary border-border-color text-text-secondary'
          }`}
        >
          {renderIcon("SlidersHorizontal", "w-4.5 h-4.5")}
        </button>
      </div>

      {/* Expanded filters options */}
      {showFilters && (
        <div className="mx-6 mt-2.5 p-3.5 bg-bg-secondary rounded-2xl border border-border-color shadow-sm flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilterVegOnly(!filterVegOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                filterVegOnly 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : 'bg-transparent border-border-color text-text-secondary'
              }`}
            >
              {renderIcon("Leaf", "w-3.5 h-3.5")} Vegetarian
            </button>
            <button 
              onClick={() => setFilterSpicyOnly(!filterSpicyOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                filterSpicyOnly 
                  ? 'bg-red-600 border-red-600 text-white' 
                  : 'bg-transparent border-border-color text-text-secondary'
              }`}
            >
              {renderIcon("Flame", "w-3.5 h-3.5")} Spicy
            </button>
          </div>
          <button 
            onClick={() => {
              setFilterVegOnly(false);
              setFilterSpicyOnly(false);
              setShowFilters(false);
            }}
            className="text-xs font-bold text-text-secondary hover:text-text-primary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Dishes display grid */}
      <div className="px-6 mt-4 flex-1">
        {filteredMenu.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenu.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="flex items-center justify-between p-4 bg-bg-secondary rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-sm border border-border-color text-left gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-sm tracking-tight text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                      {item.name}
                    </h3>
                    {item.tags.includes("Chef Recommendation") && (
                      <span className="text-[8px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Special</span>
                    )}
                  </div>
                  <p className="text-xs mt-1 text-text-secondary line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="inline-block mt-3 font-black text-sm text-primary">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {renderItemThumbnail(item.image)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {renderIcon("Compass", "w-10 h-10 text-text-secondary mx-auto stroke-[1.5]")}
            <p className="text-sm text-text-secondary mt-2 font-bold">No recipes found under this category.</p>
          </div>
        )}
      </div>

      {/* Bottom Sticky Promotion Bar & Cart Checkout Access */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-bg-secondary/95 backdrop-blur-md z-40 border-border-color shadow-2xl max-w-2xl mx-auto flex flex-col gap-3">
        {/* Promotion progress bar removed as requested */}

        {/* Action button row: Waiter Calling & Checkout Cart */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowCallWaiterModal(true)}
            className="w-14 h-14 rounded-2xl flex items-center justify-center border hover:bg-bg-tertiary active:scale-95 transition-all text-red-500 bg-bg-secondary border-border-color"
            title="Call Waiter"
          >
            {renderIcon("BellRing", "w-6 h-6")}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className={`flex-1 h-14 rounded-2xl text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-between px-6 shadow-xl hover:brightness-110 active:scale-95 transition-all ${
              animateCart ? 'cart-bounce' : ''
            }`}
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <div className="flex items-center gap-2">
              {renderIcon("ShoppingCart", "w-5 h-5")}
              <span>View Order</span>
              {cart.length > 0 && (
                <span className="bg-white text-primary text-xs w-6 h-6 flex items-center justify-center rounded-full font-black" style={{ color: 'var(--primary)' }}>
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </div>
            <span>${subtotal.toFixed(2)}</span>
          </button>
        </div>
      </div>

      {/* Call Waiter Modal Overlays */}
      {showCallWaiterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-bg-secondary border border-border-color rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center text-text-primary">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/20 text-red-500 flex items-center justify-center mx-auto mb-4">
              {renderIcon("BellRing", "w-7 h-7")}
            </div>
            <h3 className="text-lg font-black tracking-tight">Need Table Assistance?</h3>
            <p className="text-xs text-text-secondary mt-1.5">Select your assistance request below.</p>

            {waiterAlertSent ? (
              <div className="mt-5 p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-500/20">
                {renderIcon("CheckCircle2", "w-4.5 h-4.5 text-emerald-500")} Alert Sent to Staff!
              </div>
            ) : (
              <form onSubmit={handleCallWaiterSubmit} className="mt-5">
                <div className="mb-4 text-left">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Enter Table Number</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 4"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full mt-1 border border-border-color bg-bg-tertiary rounded-xl p-3 text-xs font-black focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-5">
                  {['Assistance', 'Request Water', 'Bring Bill', 'More Menus'].map(reason => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setWaiterReason(reason)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                        waiterReason === reason 
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border-color text-text-secondary bg-bg-secondary'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCallWaiterModal(false)}
                    className="flex-1 py-3 text-xs font-bold rounded-xl border border-border-color text-text-secondary hover:bg-bg-tertiary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-xs font-bold rounded-xl text-white hover:brightness-110"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    Send Alert
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Cart Drawer / Slide Panel Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex flex-col justify-end animate-fade-in">
          <div className="w-full bg-bg-secondary rounded-t-[32px] max-h-[90%] flex flex-col shadow-2xl max-w-2xl mx-auto border-t border-border-color">
            {/* Header */}
            <div className="px-6 pt-5 pb-3 border-b flex items-center justify-between border-border-color">
              <div className="flex items-center gap-2">
                {renderIcon("ShoppingCart", "w-5 h-5 text-primary")}
                <h2 className="text-base font-extrabold tracking-tight">Checkout Order</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-bg-tertiary"
              >
                {renderIcon("X", "w-5 h-5")}
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              
              {/* Order Mode Toggle: Dine-In vs Delivery */}
              <div className="flex border border-border-color rounded-xl p-1 bg-bg-tertiary gap-1 mb-5">
                <button
                  type="button"
                  onClick={() => setOrderType('dine-in')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    orderType === 'dine-in'
                      ? 'bg-primary text-white shadow'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {renderIcon("UtensilsCrossed", "w-3.5 h-3.5")}
                  <span>Dine In (Table Scan)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    orderType === 'delivery'
                      ? 'bg-primary text-white shadow'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {renderIcon("Bike", "w-3.5 h-3.5")}
                  <span>Order Delivery</span>
                </button>
              </div>

              {/* Checkout Parameter Fields based on Order Type */}
              {orderType === 'dine-in' ? (
                <div className="mb-5 p-4 rounded-2xl border flex items-center gap-3 bg-bg-tertiary border-border-color">
                  {renderIcon("Tablet", "w-5 h-5 text-amber-500")}
                  <div className="flex-1 text-left">
                    <span className="text-[10px] uppercase font-extrabold text-text-secondary block leading-none">Scanning Table Number</span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 4"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full mt-1.5 bg-transparent font-black text-sm border-b focus:outline-none border-border-color focus:border-primary text-text-primary"
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-5 p-4 rounded-2xl border flex flex-col gap-3 bg-bg-tertiary border-border-color text-left animate-fade-in">
                  <h4 className="text-[10px] font-black uppercase text-text-secondary flex items-center gap-1">
                    {renderIcon("Map", "w-3.5 h-3.5")} Delivery Credentials
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-text-secondary block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={deliveryName}
                        onChange={(e) => setDeliveryName(e.target.value)}
                        className="w-full bg-bg-secondary border border-border-color rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-text-secondary block mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 0184"
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value)}
                        className="w-full bg-bg-secondary border border-border-color rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-text-secondary block mb-1">Full Delivery Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Street name, Apartment, Block/Room"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full bg-bg-secondary border border-border-color rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {cart.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {cart.map((item, idx) => (
                    <div 
                      key={`${item.id}-${idx}`}
                      className="flex items-center justify-between pb-3.5 border-b border-border-color"
                    >
                      <div className="flex-1 text-left pr-2">
                        <h4 className="font-extrabold text-xs text-text-primary">{item.name}</h4>
                        {item.selectedCustomizations && (
                          <div className="text-[9px] text-text-secondary mt-0.5 space-y-0.5 leading-none">
                            {Object.entries(item.selectedCustomizations).map(([cName, val]) => {
                              if (Array.isArray(val)) {
                                if (val.length === 0) return null;
                                return <p key={cName}>{cName}: {val.map(v => v.name).join(', ')}</p>;
                              }
                              return <p key={cName}>{cName}: {val}</p>;
                            })}
                          </div>
                        )}
                        <span className="text-[10px] font-bold text-primary mt-1 inline-block">
                          ${item.finalUnitPrice.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 border rounded-lg p-0.5 bg-bg-tertiary border-border-color">
                        <button 
                          onClick={() => updateCartQty(idx, -1)}
                          className="w-7 h-7 flex items-center justify-center text-text-secondary hover:bg-bg-secondary rounded"
                        >
                          {renderIcon("Minus", "w-3.5 h-3.5")}
                        </button>
                        <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQty(idx, 1)}
                          className="w-7 h-7 flex items-center justify-center text-text-secondary hover:bg-bg-secondary rounded"
                        >
                          {renderIcon("Plus", "w-3.5 h-3.5")}
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {romanticOfferUnlocked && (
                    <div className="flex items-center justify-between p-3 bg-emerald-500/10 text-emerald-500 rounded-xl text-xs font-bold border border-emerald-500/20">
                      <span className="flex items-center gap-1.5">
                        {renderIcon("Sparkles", "w-4 h-4")} Special Promo Unlocked: 1 Dessert + 1 Mocktail Included
                      </span>
                      <span>FREE</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-14 text-text-secondary text-xs">
                  {renderIcon("ShoppingBag", "w-10 h-10 text-text-secondary/40 mx-auto mb-2.5 stroke-[1.5]")}
                  Your cart is empty.
                </div>
              )}
            </div>

            {/* Total summary calculations */}
            <div className="p-6 border-t bg-bg-secondary border-border-color">
              <div className="flex justify-between items-center text-xs font-bold text-text-secondary mb-3">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {orderType === 'delivery' && (
                <div className="flex justify-between items-center text-xs font-bold text-text-secondary mb-3 border-b border-border-color/30 pb-2">
                  <span>Estimated Delivery Fee</span>
                  <span className="text-emerald-500">FREE</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm font-black mb-5">
                <span>Total Bill</span>
                <span className="text-lg text-primary">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={handlePlaceOrderClick}
                className="w-full py-4 rounded-2xl text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl disabled:opacity-40 disabled:pointer-events-none hover:brightness-110 active:scale-[0.98] transition-all"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {renderIcon("ChefHat", "w-4.5 h-4.5")} 
                <span>{orderType === 'dine-in' ? 'Send Order to Kitchen' : 'Confirm Delivery Order'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review / Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-bg-secondary border border-border-color rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center text-text-primary animate-slide-up">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center mx-auto mb-3">
              {renderIcon("HeartHandshake", "w-7 h-7")}
            </div>
            <h3 className="text-base font-extrabold tracking-tight">Review Your Meal</h3>
            <p className="text-xs text-text-secondary mt-1">We appreciate your feedback to make meals more delightful.</p>

            {feedbackSuccess ? (
              <div className="mt-5 p-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5">
                {renderIcon("CheckCircle2", "w-4.5 h-4.5 text-emerald-500")} Review Submitted Successfully!
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="mt-5 flex flex-col gap-4">
                <div className="flex items-center justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      {renderIcon("Star", `w-8 h-8 ${
                        feedbackRating >= star 
                          ? 'fill-amber-400 stroke-amber-400 text-amber-400' 
                          : 'stroke-text-secondary text-transparent'
                      }`)}
                    </button>
                  ))}
                </div>

                <div className="text-left">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Your Comment</label>
                  <textarea
                    rows={3}
                    placeholder="Write your review here..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full mt-1 border border-border-color bg-bg-tertiary text-text-primary rounded-xl p-3 text-xs font-medium focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="flex-1 py-3 text-xs font-bold rounded-xl border border-border-color text-text-secondary hover:bg-bg-tertiary"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-xs font-bold rounded-xl text-white hover:brightness-110"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Detailed Inspect Modal */}
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
