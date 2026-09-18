import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function AdminDashboard({
  menu,
  categories,
  orders,
  waiterCalls,
  reviews,
  theme,
  restaurantName,
  tagline,
  bankAccounts = [],
  onUpdateMenu,
  onUpdateOrderStatus,
  onResolveWaiterCall,
  onUpdateTheme,
  onUpdateRestaurantDetails,
  onUpdateBankAccounts,
  onToggleAdmin
}) {
  const { t, getLocalizedCategory, getLocalizedItem } = useLanguage();
  const localizedCategories = categories.map(getLocalizedCategory);
  const localizedMenu = menu.map(getLocalizedItem);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'banks' | 'menu' | 'tables' | 'analytics' | 'settings'
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  
  // Bank CRUD states
  const [editingBank, setEditingBank] = useState(null);
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankFormName, setBankFormName] = useState('');
  const [bankFormAccountName, setBankFormAccountName] = useState('');
  const [bankFormAccountNumber, setBankFormAccountNumber] = useState('');
  const [bankFormType, setBankFormType] = useState('cbe');
  const [bankFormColor, setBankFormColor] = useState('#6a1b9a');

  // Menu CRUD states
  const [editingItem, setEditingItem] = useState(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formCategory, setFormCategory] = useState('starters');
  const [formImage, setFormImage] = useState('soup');
  const [formTags, setFormTags] = useState('');
  const [formIngredients, setFormIngredients] = useState('');

  const renderIcon = (name, className = "w-4 h-4") => {
    const IconComponent = Icons[name] || Icons.HelpCircle;
    return <IconComponent className={className} />;
  };

  const handleAddNewItem = () => {
    setEditingItem(null);
    setFormName('');
    setFormDesc('');
    setFormPrice(10);
    setFormCategory('starters');
    setFormImage('soup');
    setFormTags('Vegetarian');
    setFormIngredients('Garlic, Herbs');
    setShowMenuForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(item.price);
    setFormCategory(item.category);
    setFormImage(item.image);
    setFormTags(item.tags.join(', '));
    setFormIngredients(item.ingredients ? item.ingredients.join(', ') : '');
    setShowMenuForm(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    const updatedTags = formTags.split(',').map(t => t.trim()).filter(Boolean);
    const updatedIngredients = formIngredients.split(',').map(i => i.trim()).filter(Boolean);

    const targetItem = {
      id: editingItem ? editingItem.id : `custom-${Date.now()}`,
      name: formName,
      description: formDesc,
      price: parseFloat(formPrice) || 0,
      category: formCategory,
      image: formImage,
      tags: updatedTags,
      rating: editingItem ? editingItem.rating : 5.0,
      reviews: editingItem ? editingItem.reviews : 1,
      prepTime: editingItem ? editingItem.prepTime : "15 mins",
      ingredients: updatedIngredients,
      customizations: editingItem ? editingItem.customizations : []
    };

    let newMenu;
    if (editingItem) {
      newMenu = menu.map(m => m.id === editingItem.id ? targetItem : m);
    } else {
      newMenu = [...menu, targetItem];
    }

    onUpdateMenu(newMenu);
    setShowMenuForm(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm(t('deleteItemConfirm'))) {
      const newMenu = menu.filter(m => m.id !== itemId);
      onUpdateMenu(newMenu);
    }
  };

  const bankPresets = [
    { type: 'cbe', name: 'Commercial Bank of Ethiopia (CBE)', color: '#6a1b9a' },
    { type: 'telebirr', name: 'Telebirr', color: '#0070ba' },
    { type: 'abyssinia', name: 'Bank of Abyssinia (BOA)', color: '#d4af37' },
    { type: 'awash', name: 'Awash Bank', color: '#15803d' },
    { type: 'dashen', name: 'Dashen Bank', color: '#1e3a8a' },
    { type: 'other', name: 'Other Bank / Provider', color: '#475569' }
  ];

  const handleOpenAddBank = () => {
    setEditingBank(null);
    setBankFormName('Commercial Bank of Ethiopia (CBE)');
    setBankFormAccountName('Abu Coffee PLC');
    setBankFormAccountNumber('');
    setBankFormType('cbe');
    setBankFormColor('#6a1b9a');
    setShowBankForm(true);
  };

  const handleOpenEditBank = (bank) => {
    setEditingBank(bank);
    setBankFormName(bank.bankName);
    setBankFormAccountName(bank.accountName);
    setBankFormAccountNumber(bank.accountNumber);
    setBankFormType(bank.type || 'other');
    setBankFormColor(bank.color || '#475569');
    setShowBankForm(true);
  };

  const handlePresetSelect = (preset) => {
    setBankFormType(preset.type);
    if (!editingBank) {
      setBankFormName(preset.name);
    }
    setBankFormColor(preset.color);
  };

  const handleSaveBank = (e) => {
    e.preventDefault();
    const bankItem = {
      id: editingBank ? editingBank.id : `bank-${Date.now()}`,
      bankName: bankFormName,
      accountName: bankFormAccountName,
      accountNumber: bankFormAccountNumber,
      type: bankFormType,
      color: bankFormColor
    };

    let updatedBanks;
    if (editingBank) {
      updatedBanks = bankAccounts.map(b => b.id === editingBank.id ? bankItem : b);
    } else {
      updatedBanks = [...bankAccounts, bankItem];
    }

    if (onUpdateBankAccounts) {
      onUpdateBankAccounts(updatedBanks);
    }
    setShowBankForm(false);
    setEditingBank(null);
  };

  const handleDeleteBank = (bankId) => {
    if (window.confirm(t('deleteBankConfirm'))) {
      const updated = bankAccounts.filter(b => b.id !== bankId);
      if (onUpdateBankAccounts) {
        onUpdateBankAccounts(updated);
      }
    }
  };

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((acc, curr) => acc + curr.subtotal, 0);

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;

  const adminTabs = [
    { id: 'orders', label: t('liveOrders'), icon: 'Inbox', badge: pendingCount > 0 ? pendingCount : null },
    { id: 'banks', label: t('bankAccountsTab'), icon: 'Building2' },
    { id: 'menu', label: t('menuCatalog'), icon: 'UtensilsCrossed' },
    { id: 'analytics', label: t('salesKpi'), icon: 'BarChart3' },
    { id: 'settings', label: t('storefrontSetup'), icon: 'Settings' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#111319] text-gray-200">
      
      {/* Subheader with Hamburger on Mobile */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-[#171923] border-b border-[#252836] gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Drawer Trigger */}
          <button 
            onClick={() => setIsMobileDrawerOpen(true)}
            className="md:hidden p-2 rounded-xl text-gray-300 hover:bg-[#1f2232] border border-[#2d3142] active:scale-95 transition-all shrink-0"
            aria-label="Open navigation drawer"
          >
            {renderIcon("Menu", "w-5 h-5")}
          </button>

          <img 
            src="/abu-coffee-logo.png" 
            alt="Abu Coffee" 
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-amber-500/40 shadow-sm shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight truncate">
                {t('adminTitle')}
              </h2>
              {/* Active Tab indicator on mobile */}
              <span className="md:hidden text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
                {adminTabs.find(t => t.id === activeTab)?.label}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 truncate hidden sm:block">
              {t('adminDescription', { restaurant: restaurantName })}
            </p>
          </div>
        </div>

        {/* Right tools / Preparing Counters (Hidden on mobile nav to keep it clean!) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button 
            onClick={onToggleAdmin}
            className="hidden sm:flex text-xs font-bold text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-500/20 items-center gap-1.5 hover:bg-emerald-950/60 transition-colors shrink-0"
          >
            {renderIcon("ShoppingBag", "w-3 h-3")} {t('viewStorefront')}
          </button>
          <LanguageSelector variant="header" theme="dark" className="admin-language-selector shrink-0" />
          <div className="hidden md:flex bg-[#1f2232] rounded-xl px-2.5 sm:px-3 py-1.5 items-center gap-1.5 sm:gap-2 border border-[#2d3142] shrink-0">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <div className="text-left leading-none">
              <span className="text-[8px] sm:text-[9px] text-gray-400 font-bold block uppercase">{t('preparing')}</span>
              <span className="text-xs sm:text-sm font-black text-white">{preparingCount}</span>
            </div>
          </div>
          <div className="hidden md:flex bg-[#1f2232] rounded-xl px-2.5 sm:px-3 py-1.5 items-center gap-1.5 sm:gap-2 border border-[#2d3142] shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <div className="text-left leading-none">
              <span className="text-[8px] sm:text-[9px] text-gray-400 font-bold block uppercase">{t('incoming')}</span>
              <span className="text-xs sm:text-sm font-black text-white">{pendingCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER NAVIGATION (SLIDE OVER) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[250] md:hidden flex animate-fade-in">
          <div className="w-72 bg-[#171923] h-full border-r border-[#2d3142] shadow-2xl flex flex-col p-5 text-left animate-slide-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#252836]">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/abu-coffee-logo.png" 
                  alt="Abu Coffee" 
                  className="w-9 h-9 rounded-full object-cover border border-amber-500/40"
                />
                <div>
                  <h3 className="text-sm font-extrabold text-white leading-tight">Abu Coffee</h3>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{t('adminMenu')}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1f2232]"
              >
                {renderIcon("X", "w-5 h-5")}
              </button>
            </div>

            {/* Navigation links in drawer */}
            <div className="flex-1 py-4 space-y-1.5 overflow-y-auto">
              {adminTabs.map(tab => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                      isSelected
                        ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 shadow-xs'
                        : 'border border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#1f2232]'
                    }`}
                  >
                    {renderIcon(tab.icon, `w-4 h-4 shrink-0 ${isSelected ? 'stroke-[2.5]' : ''}`)}
                    <span className="flex-1">{tab.label}</span>
                    {tab.badge && (
                      <span className="px-2 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-black leading-none">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Drawer Bottom Tools */}
            <div className="pt-4 border-t border-[#252836] space-y-3">
              <LanguageSelector variant="drawer" theme="dark" className="admin-language-selector" />
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  onToggleAdmin();
                }}
                className="w-full py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-950/50 transition-all"
              >
                {renderIcon("ShoppingBag", "w-3.5 h-3.5")}
                <span>{t('viewStorefront')}</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileDrawerOpen(false)} />
        </div>
      )}

      {/* Main SaaS panel */}
      <div className="flex flex-1 min-h-0 flex-col md:flex-row overflow-hidden">
        {/* Desktop Sidebar tabs (Clean vertical sidebar; hidden on mobile in favor of Drawer) */}
        <div className="hidden md:block w-60 bg-[#171923] border-r border-[#252836] py-4 shrink-0">
          <div className="flex flex-col gap-1.5 px-3">
            {adminTabs.map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap w-full ${
                    isSelected
                      ? 'bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 shadow-xs'
                      : 'border border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#1f2232]'
                  }`}
                >
                  {renderIcon(tab.icon, `w-4 h-4 shrink-0 ${isSelected ? 'stroke-[2.5]' : ''}`)}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-auto px-1.5 py-0.5 text-[9px] bg-red-500 text-white rounded-full font-black leading-none">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* View Space content */}
        <div className="flex-1 min-w-0 overflow-y-auto p-3 sm:p-6">
          
          {/* TAB 1: LIVE ORDERS */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-6">
              
              {/* Waiter calls alerts bar */}
              {waiterCalls.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-rose-500 flex items-center gap-1">
                    {renderIcon("BellRing", "w-4 h-4 animate-bounce")} {t('activeWaiterNotifications')} ({waiterCalls.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {waiterCalls.map((call, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3.5 bg-rose-950/20 border border-rose-900/50 rounded-2xl text-xs text-rose-300 animate-pulse"
                      >
                        <div className="text-left leading-tight">
                          <p className="font-extrabold text-sm text-white">{t('tableNo', { table: call.tableNumber })}</p>
                          <p className="text-[10px] text-rose-400 font-semibold mt-1">{t('requested', { reason: call.reason, time: call.timestamp })}</p>
                        </div>
                        <button
                          onClick={() => onResolveWaiterCall(idx)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-[10px]"
                        >
                          {t('dismiss')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grid lists */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Active and preparing orders */}
                <div className="xl:col-span-2 flex flex-col gap-4">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    {renderIcon("Bell", "w-4 h-4 text-amber-500")}
                    <span>{t('activeOrdersBoard')}</span>
                  </h3>
                  
                  {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {orders
                        .filter(o => o.status !== 'completed' && o.status !== 'cancelled')
                        .map(order => (
                          <div 
                            key={order.id} 
                            className={`p-4 rounded-2xl border bg-[#171923] flex flex-col justify-between gap-4 shadow-md transition-all ${
                              order.status === 'pending' 
                                ? 'border-amber-500/30 bg-amber-500/[0.02]' 
                                : 'border-[#2d3142]'
                            }`}
                          >
                            {/* Card header */}
                            <div className="flex justify-between items-start">
                              <div className="text-left">
                                <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                  order.orderType === 'delivery' 
                                    ? 'bg-rose-500 text-white' 
                                    : 'bg-emerald-500 text-black'
                                }`}>
                                  {order.orderType === 'delivery' ? t('deliveryOrder') : t('dineIn')}
                                </span>
                                
                                <p className="text-base font-extrabold text-white mt-2">
                                  {order.deliveryDetails?.name 
                                    ? order.deliveryDetails.name 
                                    : (order.orderType === 'dine-in' ? `Dine-In Order #${order.id.slice(-4)}` : `Delivery #${order.id.slice(-4)}`)
                                  }
                                </p>
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold">{order.timestamp}</span>
                            </div>

                            {/* Client Address/Delivery details if type is delivery */}
                            {order.orderType === 'delivery' && order.deliveryDetails && (
                              <div className="bg-[#1e202e] p-3 rounded-xl border border-[#2d3142] text-[11px] text-gray-300 text-left space-y-1">
                                <p className="font-extrabold text-white flex items-center gap-1.5">
                                  {renderIcon("User", "w-3.5 h-3.5 text-emerald-400")} 
                                  <span>{order.deliveryDetails.name}</span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                  {renderIcon("Phone", "w-3.5 h-3.5 text-emerald-400")} 
                                  <span>{order.deliveryDetails.phone}</span>
                                </p>
                                <p className="flex items-center gap-1.5 leading-relaxed">
                                  {renderIcon("MapPin", "w-3.5 h-3.5 text-emerald-400")} 
                                  <span>{order.deliveryDetails.address}</span>
                                </p>
                              </div>
                            )}

                            {/* Dish Items list */}
                            <div className="border-t border-b border-[#252836] py-3 text-left">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="text-xs py-1 leading-relaxed">
                                  <div className="flex justify-between font-bold text-gray-200">
                                    <span>{item.quantity}x {localizedMenu.find(menuItem => menuItem.id === item.id)?.name || item.name}</span>
                                    <span className="text-gray-400">{item.finalTotalPrice} ETB</span>
                                  </div>
                                  {item.selectedCustomizations && (
                                    <div className="text-[9px] text-gray-500 pl-4">
                                      {Object.entries(item.selectedCustomizations).map(([k,v]) => {
                                        if (Array.isArray(v)) {
                                          if (v.length === 0) return null;
                                          return <span key={k}>{k}: {v.map(val => val.name).join(', ')} </span>;
                                        }
                                        return <span key={k}>{k}: {v} </span>;
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))}
                              
                              {order.offerApplied && (
                                <div className="mt-2 text-[9px] font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 p-1.5 rounded-lg flex items-center gap-1">
                                  {renderIcon("Sparkles", "w-3 h-3")} {t('comboPromoApplied')}
                                </div>
                              )}
                            </div>

                            {/* Total bill */}
                            <div className="flex justify-between items-center font-bold">
                              <span className="text-xs text-gray-400">{t('totalBill')}</span>
                              <span className="text-base font-black text-emerald-400">{order.subtotal} ETB</span>
                            </div>

                            {/* Action status workflow */}
                            <div className="flex gap-2 mt-2">
                              {order.status === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                                    className="flex-1 min-h-[44px] py-2.5 rounded-xl border border-[#2d3142] hover:bg-[#1f2232] text-xs font-bold text-gray-400 active:scale-[0.98] transition-all"
                                  >
                                    {t('decline')}
                                  </button>
                                  <button
                                    onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                                    className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-amber-500 text-black hover:brightness-110 text-xs font-bold active:scale-[0.98] transition-all"
                                  >
                                    {t('accept')}
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                                  className="w-full min-h-[44px] py-2.5 rounded-xl bg-emerald-600 text-white hover:brightness-110 text-xs font-bold active:scale-[0.98] transition-all"
                                >
                                  {order.orderType === 'delivery' ? t('shipDelivery') : t('markServed')}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-[#2d3142] rounded-3xl py-16 text-center">
                      {renderIcon("Inbox", "w-10 h-10 text-gray-600 mx-auto stroke-[1.5]")}
                      <p className="text-sm font-semibold text-gray-400 mt-2">{t('noActiveOrders')}</p>
                    </div>
                  )}
                </div>

                {/* History list */}
                <div className="xl:col-span-1 flex flex-col gap-4">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    {renderIcon("History", "w-4 h-4 text-emerald-500")}
                    <span>{t('completedLogs')}</span>
                  </h3>

                  <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                    {orders.filter(o => o.status === 'completed' || o.status === 'cancelled').length > 0 ? (
                      orders
                        .filter(o => o.status === 'completed' || o.status === 'cancelled')
                        .map(order => (
                          <div 
                            key={order.id} 
                            className="p-4 bg-[#171923]/60 rounded-2xl border border-[#252836]/60 text-left text-xs"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-extrabold text-gray-200">
                                {order.deliveryDetails?.name || (order.orderType === 'delivery' ? t('delivery') : `Order #${order.id.slice(-4)}`)}
                              </span>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                order.status === 'completed' 
                                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' 
                                  : 'bg-rose-950/40 text-rose-400 border border-rose-900/40'
                              }`}>
                                {t(`status${order.status.charAt(0).toUpperCase()}${order.status.slice(1)}`)}
                              </span>
                            </div>
                            <div className="text-gray-400 mt-2">
                              {order.items.map((i, idx) => (
                                <p key={idx}>{i.quantity}x {localizedMenu.find(menuItem => menuItem.id === i.id)?.name || i.name}</p>
                              ))}
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#252836]/40 font-bold">
                              <span className="text-gray-500">{t('subtotal')}</span>
                              <span className="text-emerald-400">{order.subtotal} ETB</span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-6">{t('noOrderLogs')}</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: BANK ACCOUNTS (MULTI-BANK MANAGEMENT) */}
          {activeTab === 'banks' && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-[#171923] border border-[#252836] rounded-2xl">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                    {renderIcon("Building2", "w-5 h-5 text-amber-400")}
                    <span>{t('bankAccountsHeading')}</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {t('bankAccountsSubheading')}
                  </p>
                </div>
                <button
                  onClick={handleOpenAddBank}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-emerald-900/30 shrink-0"
                >
                  {renderIcon("Plus", "w-4 h-4")}
                  <span>{t('addBankAccount')}</span>
                </button>
              </div>

              {/* Grid of Bank Accounts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bankAccounts && bankAccounts.length > 0 ? (
                  bankAccounts.map(bank => (
                    <div
                      key={bank.id}
                      className="p-4 rounded-2xl bg-[#171923] border border-[#252836] hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xs relative group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                              style={{ backgroundColor: bank.color || '#d97706' }}
                            />
                            <h3 className="font-extrabold text-sm text-white">{bank.bankName}</h3>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 bg-[#1e212f] px-2 py-0.5 rounded-md border border-[#2d3142]">
                            {bank.type || 'bank'}
                          </span>
                        </div>

                        <div className="mt-3 space-y-2 text-xs">
                          <div className="text-gray-400">
                            <span className="text-[10px] uppercase font-bold text-gray-500 block">{t('accountHolder')}</span>
                            <span className="font-semibold text-gray-200">{bank.accountName}</span>
                          </div>
                          <div className="pt-1">
                            <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">{t('accountNumber')}</span>
                            <div className="bg-[#1e212f] p-2.5 rounded-xl border border-[#2d3142] flex items-center justify-between">
                              <span className="font-mono text-sm font-black text-amber-400 tracking-wider">
                                {bank.accountNumber}
                              </span>
                              <span className="text-[9px] text-gray-500 font-semibold uppercase">{t('copyAccount')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[#252836]">
                        <button
                          onClick={() => handleOpenEditBank(bank)}
                          className="p-2 rounded-xl bg-[#1e212f] text-gray-300 hover:text-white hover:bg-[#252836] transition-colors"
                          title={t('editBank')}
                        >
                          {renderIcon("Pencil", "w-4 h-4")}
                        </button>
                        <button
                          onClick={() => handleDeleteBank(bank.id)}
                          className="p-2 rounded-xl bg-red-950/30 text-red-400 hover:bg-red-950/60 border border-red-900/40 transition-colors"
                          title="Delete Bank"
                        >
                          {renderIcon("Trash2", "w-4 h-4")}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full border border-dashed border-[#2d3142] rounded-3xl py-12 text-center text-gray-400">
                    <p className="text-sm font-bold">No bank accounts added yet.</p>
                    <p className="text-xs text-gray-500 mt-1">Add your CBE, Telebirr, or other accounts for customer transfers.</p>
                    <button
                      onClick={handleOpenAddBank}
                      className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
                    >
                      {renderIcon("Plus", "w-4 h-4")}
                      <span>{t('addBankAccount')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MENU EDITOR */}
          {activeTab === 'menu' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white leading-none">{t('menuCatalogEditor')}</h3>
                  <p className="text-xs text-gray-400 mt-1">{t('menuCatalogDescription')}</p>
                </div>
                <button
                  onClick={handleAddNewItem}
                  className="self-start sm:self-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  {renderIcon("Plus", "w-4 h-4")} {t('addDish')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {menu.map(item => {
                  const itemCategory = localizedCategories.find(c => c.id === item.category)?.name || item.category;
                  const localizedItem = localizedMenu.find(m => m.id === item.id) || item;
                  return (
                    <div 
                      key={item.id}
                      className="p-4 bg-[#171923] border border-[#252836] rounded-2xl flex flex-col justify-between gap-4"
                    >
                      <div className="text-left">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-500 bg-amber-950/20 px-2.5 py-0.5 rounded-full border border-amber-900/30">
                            {itemCategory}
                          </span>
                          <span className="text-base font-black text-emerald-400">
                            {item.price} ETB
                          </span>
                        </div>
                        <h4 className="font-extrabold text-white text-sm mt-3.5">{localizedItem.name}</h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{localizedItem.description}</p>
                        
                        {localizedItem.tags && localizedItem.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {localizedItem.tags.map(tag => (
                              <span key={tag} className="text-[9px] font-bold px-2 py-0.5 bg-[#1f2232] text-gray-300 rounded border border-[#2d3142]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-[#252836]">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 rounded-xl border border-[#2d3142] text-rose-500 hover:bg-rose-950/20 hover:border-rose-900/50 flex items-center justify-center shrink-0"
                        >
                          {renderIcon("Trash2", "w-4.5 h-4.5")}
                        </button>
                        <button
                          onClick={() => handleEditItem(item)}
                          className="flex-1 py-2 bg-[#1f2232] hover:bg-[#282c3f] rounded-xl text-xs font-bold text-gray-200 border border-[#2d3142]"
                        >
                          {t('editRecipe')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-6 text-left">
              <div>
                <h3 className="text-lg font-bold text-white leading-none">Analytics Performance KPIs</h3>
                <p className="text-xs text-gray-400 mt-1">Visual reports on sales, order quantities, and ratings.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-3.5 sm:p-4 bg-[#171923] border border-[#252836] rounded-2xl">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">{t('completedSales')}</span>
                    {renderIcon("TrendingUp", "w-4 h-4 text-emerald-500")}
                  </div>
                  <h4 className="text-lg sm:text-2xl font-black text-white mt-1.5 sm:mt-2 truncate">{totalRevenue.toLocaleString()} ETB</h4>
                </div>

                <div className="p-3.5 sm:p-4 bg-[#171923] border border-[#252836] rounded-2xl">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">{t('totalCheckouts')}</span>
                    {renderIcon("ClipboardList", "w-4 h-4 text-amber-500")}
                  </div>
                  <h4 className="text-lg sm:text-2xl font-black text-white mt-1.5 sm:mt-2">{orders.length}</h4>
                </div>

                <div className="p-3.5 sm:p-4 bg-[#171923] border border-[#252836] rounded-2xl">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">{t('averageBill')}</span>
                    {renderIcon("CreditCard", "w-4 h-4 text-blue-500")}
                  </div>
                  <h4 className="text-lg sm:text-2xl font-black text-white mt-1.5 sm:mt-2 truncate">
                    {orders.length > 0 ? (totalRevenue / orders.length).toFixed(0) : "0"} ETB
                  </h4>
                </div>

                <div className="p-3.5 sm:p-4 bg-[#171923] border border-[#252836] rounded-2xl">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">{t('customerRating')}</span>
                    {renderIcon("Star", "w-4 h-4 text-yellow-500")}
                  </div>
                  <h4 className="text-lg sm:text-2xl font-black text-white mt-1.5 sm:mt-2">
                    {reviews.length > 0 ? (reviews.reduce((a,b)=>a+b.rating,0)/reviews.length).toFixed(1) : "4.9"}
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-4 sm:p-5 bg-[#171923] border border-[#252836] rounded-2xl">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-4">{t('hourlyRevenue')}</h4>
                  
                  <div className="overflow-x-auto no-scrollbar pb-1">
                    <div className="h-44 min-w-[320px] w-full flex items-end justify-between relative pt-6 border-b border-l border-[#2d3142] px-2.5 pb-2">
                      <div className="absolute inset-0 border-t border-[#1f2232] top-1/4 pointer-events-none"></div>
                      <div className="absolute inset-0 border-t border-[#1f2232] top-2/4 pointer-events-none"></div>
                      <div className="absolute inset-0 border-t border-[#1f2232] top-3/4 pointer-events-none"></div>

                      {[
                        { hr: "12 PM", val: 40 },
                        { hr: "2 PM", val: 85 },
                        { hr: "4 PM", val: 30 },
                        { hr: "6 PM", val: 120 },
                        { hr: "8 PM", val: 180 },
                        { hr: "10 PM", val: 95 }
                      ].map((pt, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 z-10 w-10 sm:w-12">
                          <div 
                            className="w-4 sm:w-5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md hover:brightness-110 transition-all duration-300"
                            style={{ height: `${(pt.val / 200) * 120}px` }}
                          ></div>
                          <span className="text-[9px] text-gray-500 font-bold">{pt.hr}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 p-5 bg-[#171923] border border-[#252836] rounded-2xl flex flex-col gap-4">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400">Client Reviews ({reviews.length})</h4>
                  
                  <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] pr-1">
                    {reviews.length > 0 ? (
                      reviews.map((rev, idx) => (
                        <div key={idx} className="p-3 bg-[#1e212f] rounded-xl border border-[#2b3042] text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">
                              {rev.tableNumber && !rev.tableNumber.toLowerCase().includes('table') ? rev.tableNumber : 'Customer Review'}
                            </span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(st => (
                                <Icons.Star 
                                  key={st}
                                  className={`w-3 h-3 ${st <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                                />
                              ))}
                            </div>
                          </div>
                          {rev.comment && (
                            <p className="text-[10px] text-gray-400 mt-1.5 italic">"{rev.comment}"</p>
                          )}
                          <span className="text-[8px] text-gray-500 block mt-2">{rev.timestamp}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-6">No customer feedback yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="p-5 bg-[#171923] border border-[#252836] rounded-2xl flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Restaurant Profile Details</h3>
                  <p className="text-[10px] text-gray-400 mt-1">Configure global display names for the client application storefront.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      value={restaurantName}
                      onChange={(e) => onUpdateRestaurantDetails(e.target.value, tagline)}
                      className="w-full bg-[#1e212f] border border-[#2d3142] rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Slogan / Tagline</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => onUpdateRestaurantDetails(restaurantName, e.target.value)}
                      className="w-full bg-[#1e212f] border border-[#2d3142] rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 bg-[#171923] border border-[#252836] rounded-2xl flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Store Palette Branding</h3>
                  <p className="text-[10px] text-gray-400 mt-1">Swap colors across customer layout and print outputs.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    { id: 'forest', name: 'Forest Bistro', desc: 'Emerald & Gold', class: 'border-emerald-600 bg-emerald-950/20 text-emerald-300' },
                    { id: 'amber', name: 'Amber Cafe', desc: 'Yellow & Teal', class: 'border-amber-500 bg-amber-950/20 text-amber-300' },
                    { id: 'midnight', name: 'Midnight Grill', desc: 'Crimson & Gold', class: 'border-rose-600 bg-rose-950/20 text-rose-300' },
                    { id: 'blossom', name: 'Blossom Cafe', desc: 'Pink & Sage', class: 'border-pink-600 bg-pink-950/20 text-pink-300' },
                  ].map(t => {
                    const isSelected = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => onUpdateTheme(t.id)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all ${
                          isSelected
                            ? `${t.class} shadow-md`
                            : 'border-[#2d3142] bg-[#1e212f] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <span className="font-extrabold text-xs text-white">{t.name}</span>
                        <span className="text-[9px] font-semibold opacity-80">{t.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Storefront Menu QR Stand Card */}
              <div className="p-5 bg-[#171923] border border-[#252836] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5 text-left">
                <div className="flex-1">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    {renderIcon("QrCode", "w-4 h-4 text-emerald-400")}
                    <span>Digital Menu QR Code</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Customers can scan this QR code with their phone cameras to instantly access your digital showcase menu, prices in ETB, and bank account transfer numbers.
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                    >
                      {renderIcon("Printer", "w-3.5 h-3.5")}
                      <span>Print QR Stand</span>
                    </button>
                    <button
                      onClick={onToggleAdmin}
                      className="px-4 py-2 bg-[#1e212f] hover:bg-[#252836] text-gray-300 border border-[#2d3142] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      {renderIcon("ExternalLink", "w-3.5 h-3.5")}
                      <span>Open Customer Menu</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-md flex flex-col items-center shrink-0">
                  <QRCodeSVG
                    value={typeof window !== 'undefined' ? window.location.origin : 'https://abu-coffee.et'}
                    size={135}
                    level="H"
                    includeMargin={true}
                  />
                  <span className="text-[10px] font-black text-stone-900 mt-1">Abu Coffee Menu</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CRUD Form Modal */}
      {showMenuForm && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-[#171923] border border-[#2d3142] rounded-3xl p-4 sm:p-6 w-full max-w-lg max-h-[calc(100dvh-2rem)] shadow-2xl text-left text-gray-200">
            <h3 className="text-base font-extrabold tracking-tight text-white mb-4">
              {editingItem ? "Edit Catalog Item" : "Create Catalog Recipe"}
            </h3>

            <form onSubmit={handleSaveItem} className="flex flex-col gap-3 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">{t('basePrice')}</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400">Description</label>
                <textarea
                  required
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-medium focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">Thumbnail Graphic</label>
                  <select
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none"
                  >
                    <option value="soup">Soup Graphic</option>
                    <option value="coffee">Coffee/Espresso Graphic</option>
                    <option value="mocktail">Mocktail Graphic</option>
                    <option value="tiramisu">Cake/Dessert Graphic</option>
                    <option value="salad">Salad Graphic</option>
                    <option value="steak">Flame/Meat Graphic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">Dietary Labels (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Vegan, Spicy, Gluten-Free"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">Ingredients (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Potato, Olive, Oregano"
                    value={formIngredients}
                    onChange={(e) => setFormIngredients(e.target.value)}
                    className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={() => setShowMenuForm(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-[#2d3142] text-gray-400 hover:bg-[#1f2232]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:brightness-110"
                >
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Bank Account Add/Edit Modal */}
      {showBankForm && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#171923] border border-[#2d3142] rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl text-left text-gray-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#252836]">
              <h3 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                {renderIcon("Building2", "w-5 h-5 text-amber-400")}
                <span>{editingBank ? t('editBank') : t('addBankAccount')}</span>
              </h3>
              <button 
                onClick={() => setShowBankForm(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg"
              >
                {renderIcon("X", "w-5 h-5")}
              </button>
            </div>

            <form onSubmit={handleSaveBank} className="flex flex-col gap-3.5">
              {/* Preset Selector */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">{t('bankType')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {bankPresets.map(preset => (
                    <button
                      key={preset.type}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                        bankFormType === preset.type
                          ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400'
                          : 'border-[#2d3142] bg-[#1e212f] text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full inline-block mr-1.5" style={{ backgroundColor: preset.color }} />
                      <span className="capitalize">{preset.type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400">{t('bankName')}</label>
                <input
                  type="text"
                  required
                  value={bankFormName}
                  onChange={(e) => setBankFormName(e.target.value)}
                  placeholder="e.g. Commercial Bank of Ethiopia"
                  className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400">{t('accountHolder')}</label>
                <input
                  type="text"
                  required
                  value={bankFormAccountName}
                  onChange={(e) => setBankFormAccountName(e.target.value)}
                  placeholder="e.g. Abu Coffee PLC"
                  className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400">{t('accountNumber')}</label>
                <input
                  type="text"
                  required
                  value={bankFormAccountNumber}
                  onChange={(e) => setBankFormAccountNumber(e.target.value)}
                  placeholder="e.g. 1000284918234 or 0911234567"
                  className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-mono font-bold tracking-wider focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2.5 mt-3 pt-3 border-t border-[#252836]">
                <button
                  type="button"
                  onClick={() => setShowBankForm(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-[#2d3142] text-gray-400 hover:bg-[#1f2232]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/40"
                >
                  {t('saveBank')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
