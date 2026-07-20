import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import * as Icons from 'lucide-react';

import { initialMenu, initialCategories } from './data/initialMenu';
import CustomerMenu from './components/CustomerMenu';
import AdminDashboard from './components/AdminDashboard';
import ItemDetailModal from './components/ItemDetailModal';

export default function App() {
  // Global States
  const [menu, setMenu] = useState(initialMenu);
  const [categories] = useState(initialCategories);
  const [activeTheme, setActiveTheme] = useState('forest');
  
  // Seed initial values so analytics feels populated
  const [orders, setOrders] = useState([
    {
      id: 'ord-101',
      items: [
        { name: 'Truffle Mushroom Soup', quantity: 1, finalTotalPrice: 8.00, finalUnitPrice: 8.00, selectedCustomizations: { 'Serving Temperature': 'Warm' } },
        { name: 'Frothy Cappuccino', quantity: 1, finalTotalPrice: 3.50, finalUnitPrice: 3.50, selectedCustomizations: { 'Milk Choice': 'Whole Milk (Standard)' } }
      ],
      subtotal: 11.50,
      orderType: 'dine-in',
      tableNumber: '04',
      deliveryDetails: null,
      timestamp: '06:14 PM',
      status: 'completed',
      offerApplied: null
    },
    {
      id: 'ord-102',
      items: [
        { name: 'Chicken Tandoor', quantity: 1, finalTotalPrice: 16.00, finalUnitPrice: 16.00, selectedCustomizations: { 'Spice Intensity': 'Hot (Standard)' } },
        { name: 'Single Espresso', quantity: 2, finalTotalPrice: 5.00, finalUnitPrice: 2.50, selectedCustomizations: { 'Shot Type': 'Single Shot' } }
      ],
      subtotal: 21.00,
      orderType: 'delivery',
      tableNumber: null,
      deliveryDetails: {
        name: 'Sarah Connor',
        phone: '+1 (555) 9011',
        address: '742 Evergreen Terrace, Sector 4'
      },
      timestamp: '06:45 PM',
      status: 'completed',
      offerApplied: null
    }
  ]);
  
  const [waiterCalls, setWaiterCalls] = useState([]);
  
  const [reviews, setReviews] = useState([
    { tableNumber: 'Table 04', rating: 5, comment: 'The Truffle Mushroom Soup is absolutely legendary! Perfectly balanced flavor.', timestamp: '18/07/2026' },
    { tableNumber: 'Delivery Client', rating: 4, comment: 'Chicken was spiced perfectly. Service was super quick.', timestamp: '18/07/2026' }
  ]);

  const [restaurantName, setRestaurantName] = useState('Abbuu Coffee');
  const [tagline, setTagline] = useState('Scan the QR code to explore our digital menu.');

  // Routing: isAdmin decides if we render merchant console or customer menu
  const [isAdmin, setIsAdmin] = useState(false);

  // Floating detail modal target item
  const [activeDetailItem, setActiveDetailItem] = useState(null);

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

  // Update default names if theme changes
  useEffect(() => {
    if (activeTheme === 'forest') {
      setRestaurantName('Abbuu Coffee');
      setTagline('Scan the QR code to explore our digital menu.');
    } else if (activeTheme === 'amber') {
      setRestaurantName('Abbuu Coffee');
      setTagline('Fresh pours, cozy corners, and a seamless digital menu.');
    } else if (activeTheme === 'midnight') {
      setRestaurantName('Abbuu Coffee');
      setTagline('Sip, scan, and settle in with a modern cafe experience.');
    } else if (activeTheme === 'blossom') {
      setRestaurantName('Abbuu Coffee');
      setTagline('A bright coffeehouse experience from your phone.');
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

  const handlePlaceOrder = (newOrderMetadata) => {
    const fullOrder = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      ...newOrderMetadata
    };
    
    setOrders(prev => [fullOrder, ...prev]);
    
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

  const handleCallWaiter = (waiterCallMetadata) => {
    setWaiterCalls(prev => [waiterCallMetadata, ...prev]);
    playNotificationChime('waiter');
  };

  const handleAddReview = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId, nextStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
  };

  const handleResolveWaiterCall = (indexToDismiss) => {
    setWaiterCalls(prev => prev.filter((_, idx) => idx !== indexToDismiss));
  };

  return (
    <div className={`min-h-screen bg-bg-primary font-body theme-${activeTheme} transition-colors duration-300`}>
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
          onUpdateMenu={setMenu}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onResolveWaiterCall={handleResolveWaiterCall}
          onUpdateTheme={setActiveTheme}
          onUpdateRestaurantDetails={(name, tag) => {
            setRestaurantName(name);
            setTagline(tag);
          }}
          onToggleAdmin={() => setIsAdmin(false)}
        />
      ) : (
        // Render full width Customer Menu
        <CustomerMenu
          menu={menu}
          categories={categories}
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
