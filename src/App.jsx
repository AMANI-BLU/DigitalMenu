import React, { useEffect, useState } from 'react';

import CustomerMenu from './components/CustomerMenu';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import SplashScreen from './components/SplashScreen';
import { supabaseService, supabase } from './lib/supabase';

const emptyStore = {
  restaurantName: 'Abu Coffee',
  tagline: 'Digital menu for your restaurant',
  theme: 'forest',
  mode: 'light',
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [store, setStore] = useState(emptyStore);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRequested, setAdminRequested] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [modeOverride, setModeOverride] = useState(() => {
    if (typeof window === 'undefined') return '';
    const saved = window.localStorage.getItem('abu_coffee_mode');
    return saved === 'dark' || saved === 'light' ? saved : '';
  });

  const loadPublicData = async () => {
    setDataLoading(true);
    try {
      const [remoteMenu, remoteCategories, remoteBanks, remoteSettings] = await Promise.all([
        supabaseService.getMenuItems(),
        supabaseService.getCategories(),
        supabaseService.getBankAccounts(),
        supabaseService.getSettings(),
      ]);
      setMenu(remoteMenu || []);
      setCategories(remoteCategories || []);
      setBankAccounts(remoteBanks || []);
      setStore(remoteSettings ? { ...emptyStore, ...remoteSettings } : emptyStore);
      setError('');
    } catch (loadError) {
      setError(loadError.message || 'Unable to load the menu from the database.');
      setMenu([]);
      setCategories([]);
      setBankAccounts([]);
    } finally {
      setDataLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      setReviews((await supabaseService.getReviews()) || []);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load customer reviews.');
      setReviews([]);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAdminRequested(params.get('admin') === 'true');

    loadPublicData();

    let authSubscription;
    const initializeAuth = async () => {
      if (!supabaseService.isConfigured()) {
        setAuthLoading(false);
        return;
      }

      try {
        const currentSession = await supabaseService.getSession();
        if (currentSession && await supabaseService.isAdminUser(currentSession.user)) {
          setSession(currentSession);
          setIsAdmin(true);
          await loadAdminData();
        }
      } catch (authError) {
        setError(authError.message || 'Unable to initialize admin authentication.');
      } finally {
        setAuthLoading(false);
      }

      const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        window.setTimeout(async () => {
          if (nextSession && await supabaseService.isAdminUser(nextSession.user)) {
            setSession(nextSession);
            setIsAdmin(true);
            await loadAdminData();
          } else {
            setSession(null);
            setIsAdmin(false);
            setReviews([]);
          }
        }, 0);
      });
      authSubscription = data.subscription;
    };

    initializeAuth();
    return () => authSubscription?.unsubscribe();
  }, []);

  const withRefresh = async (operation, onSuccess) => {
    try {
      const saved = await operation();
      onSuccess(saved);
      setError('');
    } catch (operationError) {
      setError(operationError.message || 'The database could not save that change.');
      throw operationError;
    }
  };

  const handleSaveMenuItem = async (item) => {
    await withRefresh(
      () => supabaseService.saveMenuItem(item),
      (saved) => setMenu((current) => {
        const withoutSaved = current.filter((entry) => entry.id !== saved.id);
        return [...withoutSaved, saved];
      }),
    );
  };

  const handleDeleteMenuItem = async (itemId) => {
    await withRefresh(
      () => supabaseService.deleteMenuItem(itemId),
      () => setMenu((current) => current.filter((item) => item.id !== itemId)),
    );
  };

  const handleSaveCategory = async (category) => {
    await withRefresh(
      () => supabaseService.saveCategory(category),
      (saved) => setCategories((current) => {
        const withoutSaved = current.filter((entry) => entry.id !== saved.id);
        return [...withoutSaved, saved].sort((a, b) => a.sortOrder - b.sortOrder);
      }),
    );
  };

  const handleDeleteCategory = async (categoryId) => {
    await withRefresh(
      () => supabaseService.deleteCategory(categoryId),
      () => {
        setCategories((current) => current.filter((category) => category.id !== categoryId));
        setMenu((current) => current.filter((item) => item.category !== categoryId));
      },
    );
  };

  const handleSaveBankAccount = async (bank) => {
    await withRefresh(
      () => supabaseService.saveBankAccount(bank),
      (saved) => setBankAccounts((current) => {
        const withoutSaved = current.filter((entry) => entry.id !== saved.id);
        return [...withoutSaved, saved];
      }),
    );
  };

  const handleDeleteBankAccount = async (bankId) => {
    await withRefresh(
      () => supabaseService.deleteBankAccount(bankId),
      () => setBankAccounts((current) => current.filter((bank) => bank.id !== bankId)),
    );
  };

  const handleSaveSettings = async (settings) => {
    await withRefresh(() => supabaseService.saveSettings(settings), (saved) => {
      setStore(saved);
      setModeOverride('');
      window.localStorage.removeItem('abu_coffee_mode');
    });
  };

  const handleToggleMode = () => {
    const nextMode = (modeOverride || store.mode || 'light') === 'dark' ? 'light' : 'dark';
    setModeOverride(nextMode);
    window.localStorage.setItem('abu_coffee_mode', nextMode);
  };

  const handleAddReview = async (review) => {
    try {
      const saved = await supabaseService.createReview(review);
      setReviews((current) => [saved, ...current]);
      setError('');
    } catch (reviewError) {
      setError(reviewError.message || 'Your review could not be saved.');
      throw reviewError;
    }
  };

  const handleDeleteReview = async (reviewId) => {
    await withRefresh(
      () => supabaseService.deleteReview(reviewId),
      () => setReviews((current) => current.filter((review) => review.id !== reviewId)),
    );
  };

  const openAdmin = () => {
    setAdminRequested(true);
    window.history.replaceState({}, '', `${window.location.pathname}?admin=true`);
  };

  const closeAdmin = async () => {
    if (session) await supabaseService.signOut();
    setSession(null);
    setIsAdmin(false);
    setAdminRequested(false);
    window.history.replaceState({}, '', window.location.pathname);
  };

  const effectiveMode = modeOverride || store.mode || 'light';
  const appClassName = `min-h-screen bg-bg-primary font-body theme-${store.theme || 'forest'} mode-${effectiveMode} transition-colors duration-300`;

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (authLoading || dataLoading) {
    return (
      <div className={`${appClassName} flex min-h-screen items-center justify-center px-6 text-center`}>
        <div className="rounded-3xl border border-stone-200 bg-white px-7 py-8 shadow-xl">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="text-sm font-bold text-stone-600">Loading menu data…</p>
        </div>
      </div>
    );
  }

  if (adminRequested && !isAdmin) {
    return (
      <div className={appClassName}>
        <AdminLogin onAuthenticated={async (nextSession) => {
          setSession(nextSession);
          setIsAdmin(true);
          await loadAdminData();
        }} onCancel={() => {
          setAdminRequested(false);
          window.history.replaceState({}, '', window.location.pathname);
        }} />
      </div>
    );
  }

  return (
    <div className={appClassName}>
      {error && (
        <div className="fixed inset-x-3 top-3 z-[100] mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 shadow-lg">
          {error}
        </div>
      )}

      {isAdmin ? (
        <AdminDashboard
          menu={menu}
          categories={categories}
          reviews={reviews}
          theme={store.theme}
          mode={store.mode}
          restaurantName={store.restaurantName}
          tagline={store.tagline}
          bankAccounts={bankAccounts}
          adminEmail={session?.user?.email || ''}
          onSaveMenuItem={handleSaveMenuItem}
          onDeleteMenuItem={handleDeleteMenuItem}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          onSaveBankAccount={handleSaveBankAccount}
          onDeleteBankAccount={handleDeleteBankAccount}
          onDeleteReview={handleDeleteReview}
          onUpdateSettings={handleSaveSettings}
          onPreviewSettings={(draft) => setStore((current) => ({ ...current, ...draft }))}
          onUpdateCredentials={supabaseService.updateAdminCredentials}
          onSignOut={closeAdmin}
          onToggleAdmin={closeAdmin}
        />
      ) : (
        <CustomerMenu
          menu={menu}
          categories={categories}
          bankAccounts={bankAccounts}
          restaurantName={store.restaurantName}
          mode={effectiveMode}
          onToggleMode={handleToggleMode}
          onSubmitFeedback={handleAddReview}
          onToggleAdmin={openAdmin}
        />
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
