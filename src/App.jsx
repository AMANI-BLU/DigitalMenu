import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

import { initialMenu, initialCategories } from './data/initialMenu';
import { initialBankAccounts } from './data/initialBanks';
import CustomerMenu from './components/CustomerMenu';
import AdminDashboard from './components/AdminDashboard';
import SplashScreen from './components/SplashScreen';
import { supabaseService, supabase } from './lib/supabase';

export default function App() {
  // Brand Splash Screen state (luxurious animated entrance)
  const [showSplash, setShowSplash] = useState(true);

  // Global States
  const [menu, setMenu] = useState(initialMenu);
  const [categories] = useState(initialCategories);
  const [bankAccounts, setBankAccounts] = useState(initialBankAccounts);
  const [activeTheme, setActiveTheme] = useState('forest');
  
  // Seed initial values so analytics feels populated (matching inspiration dishes Total: $23.00)
  const [orders, setOrders] = useState([
    {
      id: 'ord-101',
      items: [
        { name: 'Bruschetta Caprese', quantity: 1, finalTotalPrice: 350.00, finalUnitPrice: 350.00, selectedCustomizations: {} },
        { name: 'Classic Caesar Salad', quantity: 1, finalTotalPrice: 420.00, finalUnitPrice: 420.00, selectedCustomizations: {} },
        { name: 'Creamy Fettuccine Alfredo', quantity: 1, finalTotalPrice: 520.00, finalUnitPrice: 520.00, selectedCustomizations: {} }
      ],
      subtotal: 1290.00,
      orderType: 'dine-in',
      tableNumber: '04',
      deliveryDetails: null,
      timestamp: '11:30 AM',
      status: 'completed',
      offerApplied: null
    },
    {
      id: 'ord-102',
      items: [
        { name: 'Traditional Jebena Buna Coffee', quantity: 2, finalTotalPrice: 240.00, finalUnitPrice: 120.00, selectedCustomizations: { 'Service': 'Cardamom Touch' } },
        { name: 'Tiramisu with Abu Ethiopia Coffee', quantity: 1, finalTotalPrice: 340.00, finalUnitPrice: 340.00, selectedCustomizations: {} }
      ],
      subtotal: 580.00,
      orderType: 'delivery',
      tableNumber: null,
      deliveryDetails: {
        name: 'Sofia Al-Hassan',
        phone: '+251 91 123 4567',
        address: 'Bole Medhanealem, Addis Ababa'
      },
      timestamp: '10:45 AM',
      status: 'completed',
      offerApplied: null
    }
  ]);
  
  const [waiterCalls, setWaiterCalls] = useState([]);
  
  const [reviews, setReviews] = useState([
    { tableNumber: 'Table 04', rating: 5, comment: 'The Bruschetta Caprese and Alfredo pasta were delicious. The Jebena Buna coffee is unmatched!', timestamp: 'Today' },
    { tableNumber: 'Delivery Customer', rating: 5, comment: 'Ordering through WhatsApp was quick and convenient. Everything arrived hot and perfect.', timestamp: 'Yesterday' }
  ]);

  const [restaurantName, setRestaurantName] = useState('Abu Coffee');
  const [tagline, setTagline] = useState('Your menu, your orders, in one click · Digital QR menu with WhatsApp ordering');

  // Routing: isAdmin decides if we render merchant console or customer menu
  const [isAdmin, setIsAdmin] = useState(false);

  // Extract table/admin parameter from URL query (?table=4 or ?admin=true)
  const [initialTable, setInitialTable] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tableParam = urlParams.get('table');
    const adminParam = urlParams.get('admin');
    
    if (adminParam === 'true') {
      setIsAdmin(true);
    } else if (tableParam) {
      setInitialTable(tableParam);
      setIsAdmin(false);
    }
  }, []);

  // Supabase Data Hydration & Realtime Subscription
  useEffect(() => {
    if (!supabaseService.isConfigured()) return;

    // Load initial data from Supabase
    const loadRemoteData = async () => {
      const remoteOrders = await supabaseService.getOrders();
      if (remoteOrders && remoteOrders.length > 0) {
        setOrders(remoteOrders);
      }
      const remoteCalls = await supabaseService.getWaiterCalls();
      if (remoteCalls && remoteCalls.length > 0) {
        setWaiterCalls(remoteCalls);
      }
      const remoteBanks = await supabaseService.getBankAccounts();
      if (remoteBanks && remoteBanks.length > 0) {
        setBankAccounts(remoteBanks);
      }
      const remoteReviews = await supabaseService.getReviews();
      if (remoteReviews && remoteReviews.length > 0) {
        setReviews(remoteReviews);
      }
    };
    loadRemoteData();

    // Subscribe to Realtime order events
    if (supabase) {
      const channel = supabase
        .channel('public:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new, ...prev.filter(o => o.id !== payload.new.id)]);
            playNotificationChime('order');
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o));
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Update default names if theme changes
  useEffect(() => {
    if (activeTheme === 'forest') {
      setRestaurantName('Abu Coffee');
      setTagline('Your menu, your orders, in one click · Digital QR menu with WhatsApp ordering');
    } else if (activeTheme === 'amber') {
      setRestaurantName('Abu Coffee');
      setTagline('Authentic Ethiopian coffee and artisan cuisine · Simple, Modern, Fast');
    } else if (activeTheme === 'midnight') {
      setRestaurantName('Abu Coffee');
      setTagline('Specialty coffee and gourmet lounge · Direct WhatsApp ordering');
    } else if (activeTheme === 'blossom') {
      setRestaurantName('Abu Coffee');
      setTagline('A warm, modern experience from your mobile phone.');
    }
  }, [activeTheme]);

  // Audio synths
  const playNotificationChime = (type = 'order') => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (type === 'order') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); 
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); 
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, ctx.currentTime); 
        osc.frequency.setValueAtTime(261.63, ctx.currentTime + 0.15); 
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn("Audio Context blocked by browser safety policies.", e);
    }
  };

  const handlePlaceOrder = async (newOrderMetadata) => {
    const fullOrder = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      ...newOrderMetadata
    };
    
    setOrders(prev => [fullOrder, ...prev]);
    
    // Sync to Supabase if configured
    if (supabaseService.isConfigured()) {
      supabaseService.createOrder(fullOrder);
    }
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 }
    });

    playNotificationChime('order');
    
    // Clear url query params so reload doesn't trigger initialTable re-fill
    // but keep table number parameter if dining in
    if (newOrderMetadata.orderType === 'dine-in') {
      window.history.replaceState({}, '', `?table=${newOrderMetadata.tableNumber}`);
    } else {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleCallWaiter = async (waiterCallMetadata) => {
    setWaiterCalls(prev => [waiterCallMetadata, ...prev]);
    if (supabaseService.isConfigured()) {
      supabaseService.createWaiterCall(waiterCallMetadata);
    }
    playNotificationChime('waiter');
  };

  const handleAddReview = async (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    if (supabaseService.isConfigured()) {
      await supabaseService.createReview(newReview);
    }
  };

  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    if (supabaseService.isConfigured()) {
      supabaseService.updateOrderStatus(orderId, nextStatus);
    }
  };

  const handleResolveWaiterCall = (indexToDismiss) => {
    const callToResolve = waiterCalls[indexToDismiss];
    setWaiterCalls(prev => prev.filter((_, idx) => idx !== indexToDismiss));
    if (callToResolve?.id && supabaseService.isConfigured()) {
      supabaseService.resolveWaiterCall(callToResolve.id);
    }
  };

  const handleUpdateBankAccounts = async (newBanks) => {
    setBankAccounts(newBanks);
    if (supabaseService.isConfigured()) {
      for (const bank of newBanks) {
        await supabaseService.saveBankAccount(bank);
      }
    }
  };

  return (
    <div className={`min-h-screen bg-bg-primary font-body theme-${activeTheme} transition-colors duration-300`}>
      {/* Luxury Animated Splash Screen on App Load */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {isAdmin ? (
        // Render full width Admin Dashboard
        <AdminDashboard
          menu={menu}
          categories={categories}
          orders={orders}
          waiterCalls={waiterCalls}
          reviews={reviews}
          theme={activeTheme}
          restaurantName={restaurantName}
          tagline={tagline}
          bankAccounts={bankAccounts}
          onUpdateMenu={setMenu}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onResolveWaiterCall={handleResolveWaiterCall}
          onUpdateTheme={setActiveTheme}
          onUpdateRestaurantDetails={(name, tag) => {
            setRestaurantName(name);
            setTagline(tag);
          }}
          onUpdateBankAccounts={handleUpdateBankAccounts}
          onToggleAdmin={() => setIsAdmin(false)}
        />
      ) : (
        // Render full width Customer Menu
        <CustomerMenu
          menu={menu}
          categories={categories}
          bankAccounts={bankAccounts}
          theme={activeTheme}
          restaurantName={restaurantName}
          tagline={tagline}
          initialTable={initialTable}
          onPlaceOrder={handlePlaceOrder}
          onCallWaiter={handleCallWaiter}
          onSubmitFeedback={handleAddReview}
          onToggleAdmin={() => setIsAdmin(true)}
        />
      )}

      {/* Embedded CSS rules for general helpers */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
