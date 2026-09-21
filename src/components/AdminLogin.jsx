import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { supabaseService } from '../lib/supabase';

export default function AdminLogin({ onAuthenticated, onCancel }) {
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
    <main className="flex min-h-screen items-center justify-center bg-[#11151d] px-4 py-8 text-white sm:px-6">
      <div className="absolute right-4 top-4">
        <LanguageSelector theme="dark" />
      </div>
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#1b202b] p-6 shadow-2xl sm:p-9">
        <button
          type="button"
          onClick={onCancel}
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-400 transition-colors hover:text-white"
        >
          <Icons.ArrowLeft className="h-4 w-4" />
          {t('backToMenu')}
        </button>

        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-[#0d1714]">
            <Icons.ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">{t('adminLoginTitle')}</h1>
          <p className="mt-2 text-sm leading-6 text-gray-400">{t('adminLoginDescription')}</p>
        </div>

        {!supabaseService.isConfigured() && (
          <div className="mb-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm leading-5 text-amber-200">
            {t('databaseNotConfigured')}
          </div>
        )}

        {error && (
          <div role="alert" className="mb-5 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-200">
            {error}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-400">{t('adminEmail')}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              className="w-full rounded-2xl border border-white/10 bg-[#11151d] px-4 py-3.5 text-sm font-semibold text-white outline-none transition focus:border-emerald-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-400">{t('adminPassword')}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="w-full rounded-2xl border border-white/10 bg-[#11151d] px-4 py-3.5 text-sm font-semibold text-white outline-none transition focus:border-emerald-400"
            />
          </label>
          <button
            type="submit"
            disabled={submitting || !supabaseService.isConfigured()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-black text-[#0d1714] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && <Icons.LoaderCircle className="h-4 w-4 animate-spin" />}
            {submitting ? t('adminSignInProgress') : t('adminSignIn')}
          </button>
        </form>
      </section>
    </main>
  );
}
