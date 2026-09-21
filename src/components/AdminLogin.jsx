import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { supabaseService } from '../lib/supabase';

export default function AdminLogin({ onAuthenticated, onCancel, mode = 'light', onToggleMode }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError(t('loginFieldsRequired'));
      return;
    }
    setSubmitting(true);
    try {
      const nextSession = await supabaseService.signInAdmin(email.trim(), password);
      await onAuthenticated(nextSession);
    } catch (loginError) {
      const isInvalidCredentials = loginError.message?.toLowerCase().includes('invalid login credentials');
      setError(isInvalidCredentials ? t('adminInvalidCredentials') : (loginError.message || t('adminAccessDenied')));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login-shell relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMode}
          aria-label={t(mode === 'dark' ? 'lightMode' : 'darkMode')}
          title={t(mode === 'dark' ? 'lightMode' : 'darkMode')}
          className="admin-login-mode-toggle"
        >
          {mode === 'dark' ? <Icons.Sun className="h-4 w-4" /> : <Icons.Moon className="h-4 w-4" />}
        </button>
        <LanguageSelector theme={mode === 'dark' ? 'dark' : 'light'} />
      </div>
      <section className="admin-login-card w-full max-w-md rounded-[2rem] p-6 sm:p-9">
        <button
          type="button"
          onClick={onCancel}
          className="admin-login-back mb-8 inline-flex items-center gap-2 text-sm font-bold transition-colors"
        >
          <Icons.ArrowLeft className="h-4 w-4" />
          {t('backToMenu')}
        </button>

        <div className="mb-8">
          <div className="admin-login-mark mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icons.ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="admin-login-title text-2xl font-black tracking-tight">{t('adminLoginTitle')}</h1>
          <p className="admin-login-description mt-2 text-sm leading-6">{t('adminLoginDescription')}</p>
        </div>

        {!supabaseService.isConfigured() && (
          <div className="admin-login-notice mb-5 rounded-2xl px-4 py-3 text-sm leading-5">
            {t('databaseNotConfigured')}
          </div>
        )}

        {error && (
          <div role="alert" className="admin-login-error mb-5 rounded-2xl px-4 py-3 text-sm leading-5">
            {error}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="admin-login-label mb-2 block text-xs font-black uppercase tracking-wider">{t('adminEmail')}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              className="admin-login-input w-full rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none transition"
            />
          </label>
          <label className="block">
            <span className="admin-login-label mb-2 block text-xs font-black uppercase tracking-wider">{t('adminPassword')}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="admin-login-input w-full rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none transition"
            />
          </label>
          <button
            type="submit"
            disabled={submitting || !supabaseService.isConfigured()}
            className="admin-login-submit flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && <Icons.LoaderCircle className="h-4 w-4 animate-spin" />}
            {submitting ? t('adminSignInProgress') : t('adminSignIn')}
          </button>
        </form>
      </section>
    </main>
  );
}
