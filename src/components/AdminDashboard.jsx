import React, { useEffect, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

const iconChoices = ['Coffee', 'MugHot', 'CupSoda', 'GlassWater', 'Soup', 'Leaf', 'Flame', 'Star', 'Utensils'];
const bankTypes = ['cbe', 'awash', 'dashen', 'telebirr', 'other'];
const themes = [
  { id: 'forest', color: '#047857' },
  { id: 'amber', color: '#b45309' },
  { id: 'midnight', color: '#2f6fba' },
  { id: 'blossom', color: '#be185d' },
];

const makeId = (value) => {
  const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return slug || `entry-${Date.now()}`;
};

const renderIcon = (name, className = 'h-4 w-4') => {
  const Icon = Icons[name] || Icons.HelpCircle;
  return <Icon className={className} />;
};

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:rounded-[2rem] sm:p-7">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-xl font-black tracking-tight text-slate-950">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900">
            <Icons.X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AppDialog({ t, title, message, tone = 'danger', onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const confirm = async () => {
    setBusy(true);
    try {
      await onConfirm?.();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone === 'danger' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {tone === 'danger' ? <Icons.TriangleAlert className="h-5 w-5" /> : <Icons.Info className="h-5 w-5" />}
        </div>
        <h2 className="mt-5 text-lg font-black text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={busy} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">{t('cancel')}</button>
          {onConfirm && <button type="button" onClick={confirm} disabled={busy} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white disabled:opacity-50 ${tone === 'danger' ? 'bg-red-700 hover:bg-red-800' : 'bg-emerald-700 hover:bg-emerald-800'}`}>{busy && <Icons.LoaderCircle className="h-4 w-4 animate-spin" />}{t('confirm')}</button>}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, children }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <Icon className="mx-auto h-10 w-10 text-slate-300" />
      <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-6 text-slate-500">{children}</p>
    </div>
  );
}

function FormError({ children }) {
  if (!children) return null;
  return <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold leading-5 text-red-700">{children}</p>;
}

export default function AdminDashboard({
  menu = [],
  categories = [],
  reviews = [],
  theme = 'forest',
  mode = 'light',
  restaurantName = '',
  tagline = '',
  bankAccounts = [],
  menuVisible = true,
  adminEmail = '',
  onSaveMenuItem,
  onDeleteMenuItem,
  onSaveCategory,
  onDeleteCategory,
  onSaveBankAccount,
  onDeleteBankAccount,
  onDeleteReview,
  onUpdateSettings,
  onPreviewSettings,
  onUpdateCredentials,
  onSignOut,
  onToggleMenuVisibility,
}) {
  const { t, getLocalizedCategory, getLocalizedItem } = useLanguage();
  const [activeTab, setActiveTab] = useState('menu');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [menuModal, setMenuModal] = useState(null);
  const [categoryModal, setCategoryModal] = useState(null);
  const [bankModal, setBankModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState(null);

  const tabs = [
    { id: 'menu', label: t('menuCatalog'), icon: 'Utensils' },
    { id: 'categories', label: t('categories'), icon: 'ListTree' },
    { id: 'banks', label: t('bankAccountsTab'), icon: 'Building2' },
    { id: 'reviews', label: t('customerReviewsTab'), icon: 'Star' },
    { id: 'settings', label: t('storefrontSetup'), icon: 'Settings2' },
  ];

  const selectTab = (tab) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
  };

  const submit = async (callback, payload, close) => {
    setSaving(true);
    try {
      await callback(payload);
      close(null);
    } finally {
      setSaving(false);
    }
  };

  const askConfirm = (config) => setDialog({ ...config, tone: 'danger' });
  const showNotice = (config) => setDialog({ ...config, tone: 'notice', onConfirm: null });

  return (
    <div className="admin-shell min-h-screen bg-[#f4f7f6] text-slate-900">
      <div className="flex min-h-screen">
        {mobileNavOpen && (
          <button aria-label={t('closeButton')} onClick={() => setMobileNavOpen(false)} className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" />
        )}

        <aside className={`fixed inset-y-0 left-0 z-40 flex w-[17rem] flex-col border-r border-white/10 bg-[#111720] px-4 py-5 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center gap-3 border-b border-white/10 px-2 pb-5">
            <img src="/abu-coffee-logo.png" alt="Abu Coffee" className="h-11 w-11 rounded-2xl object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{restaurantName || 'Abu Coffee'}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">{t('adminTitle')}</p>
            </div>
            <button type="button" onClick={() => setMobileNavOpen(false)} className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden">
              <Icons.X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
            <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{t('adminMenu')}</p>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => selectTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition ${activeTab === tab.id ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-900/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
              >
                {renderIcon(tab.icon, 'h-4 w-4')}
                <span>{tab.label}</span>
              </button>
            ))}

            {/* Menu Visibility Quick Toggle */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{t('quickToggle')}</p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${menuVisible ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className={`text-xs font-black ${menuVisible ? 'text-emerald-300' : 'text-red-300'}`}>
                    {menuVisible ? t('menuStatusLive') : t('menuStatusHidden')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onToggleMenuVisibility}
                  title={menuVisible ? t('hideMenu') : t('showMenu')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    menuVisible ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      menuVisible ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </nav>

          <div className="space-y-2 border-t border-white/10 pt-4">
            <button type="button" onClick={onSignOut} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-slate-300 transition hover:bg-red-500/10 hover:text-red-200">
              <Icons.LogOut className="h-4 w-4" />
              {t('signOut')}
            </button>
            <p className="px-3 text-[10px] leading-4 text-slate-500">{t('adminDescription')}</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 lg:ml-[17rem]">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f4f7f6]/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-9">
            <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button type="button" onClick={() => setMobileNavOpen(true)} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm lg:hidden">
                  <Icons.Menu className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-lg font-black tracking-tight text-slate-950 sm:text-xl">{tabs.find((tab) => tab.id === activeTab)?.label}</p>
                  <p className="hidden truncate text-xs font-semibold text-slate-500 sm:block">{tagline}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSelector theme={mode === 'dark' ? 'dark' : 'light'} />
                <button type="button" onClick={onSignOut} className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:border-red-200 hover:text-red-700 sm:flex">
                  <Icons.LogOut className="h-3.5 w-3.5" />
                  {t('signOut')}
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[90rem] px-4 py-6 sm:px-6 sm:py-8 lg:px-9">
            {activeTab === 'menu' && (
              <MenuTab
                menu={menu}
                categories={categories}
                t={t}
                getLocalizedCategory={getLocalizedCategory}
                getLocalizedItem={getLocalizedItem}
                onAdd={() => setMenuModal({ item: null })}
                onEdit={(item) => setMenuModal({ item })}
                onDelete={(id) => askConfirm({ title: t('deleteDrinkTitle'), message: t('deleteItemConfirm'), onConfirm: () => onDeleteMenuItem(id) })}
              />
            )}
            {activeTab === 'categories' && (
              <CategoriesTab
                categories={categories}
                menu={menu}
                t={t}
                getLocalizedCategory={getLocalizedCategory}
                onAdd={() => setCategoryModal({ category: null })}
                onEdit={(category) => setCategoryModal({ category })}
                onDelete={(id) => askConfirm({ title: t('deleteCategoryTitle'), message: t('deleteCategoryConfirm'), onConfirm: () => onDeleteCategory(id) })}
                onBlockedDelete={() => showNotice({ title: t('cannotDeleteCategoryTitle'), message: t('categoryHasItems') })}
              />
            )}
            {activeTab === 'banks' && (
              <BanksTab
                banks={bankAccounts}
                t={t}
                onAdd={() => setBankModal({ bank: null })}
                onEdit={(bank) => setBankModal({ bank })}
                onDelete={(id) => askConfirm({ title: t('deleteBankTitle'), message: t('deleteBankConfirm'), onConfirm: () => onDeleteBankAccount(id) })}
              />
            )}
            {activeTab === 'reviews' && <ReviewsTab reviews={reviews} t={t} onDelete={(id) => askConfirm({ title: t('deleteFeedbackTitle'), message: t('deleteReviewConfirm'), onConfirm: () => onDeleteReview(id) })} />}
            {activeTab === 'settings' && (
              <SettingsTab
                t={t}
                theme={theme}
                mode={mode}
                restaurantName={restaurantName}
                tagline={tagline}
                menuVisible={menuVisible}
                onSave={onUpdateSettings}
                onPreview={onPreviewSettings}
                adminEmail={adminEmail}
                onUpdateCredentials={onUpdateCredentials}
                onToggleMenuVisibility={onToggleMenuVisibility}
              />
            )}
          </div>
        </main>
      </div>

      {menuModal && (
        <MenuModal
          item={menuModal.item}
          categories={categories}
          t={t}
          saving={saving}
          onClose={() => setMenuModal(null)}
          onSave={(item) => submit(onSaveMenuItem, item, setMenuModal)}
        />
      )}
      {dialog && <AppDialog t={t} {...dialog} onClose={() => setDialog(null)} />}
      {categoryModal && (
        <CategoryModal
          category={categoryModal.category}
          t={t}
          saving={saving}
          onClose={() => setCategoryModal(null)}
          onSave={(category) => submit(onSaveCategory, category, setCategoryModal)}
        />
      )}
      {bankModal && (
        <BankModal
          bank={bankModal.bank}
          t={t}
          saving={saving}
          onClose={() => setBankModal(null)}
          onSave={(bank) => submit(onSaveBankAccount, bank, setBankModal)}
        />
      )}
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

function MenuTab({ menu, categories, t, getLocalizedCategory, getLocalizedItem, onAdd, onEdit, onDelete }) {
  const categoryNames = useMemo(() => Object.fromEntries(categories.map((category) => [category.id, getLocalizedCategory(category).name])), [categories, getLocalizedCategory]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const visibleMenu = useMemo(
    () => selectedCategory === 'all' ? menu : menu.filter((item) => String(item.category) === String(selectedCategory)),
    [menu, selectedCategory],
  );
  return (
    <>
      <PageHeading
        eyebrow={t('menuCatalogEditor')}
        title={t('menuCatalog')}
        description={t('menuCatalogDescription')}
        action={<button type="button" onClick={onAdd} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800"><Icons.Plus className="h-4 w-4" />{t('addDrink')}</button>}
      />
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="flex min-w-0 items-center gap-2 text-xs font-black text-slate-600">
          <span className="shrink-0">{t('filterCategory')}</span>
          <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:max-w-xs">
            <option value="all">{t('allCategories')}</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{getLocalizedCategory(category).name}</option>)}
          </select>
        </label>
        <span className="text-xs font-bold text-slate-400">{visibleMenu.length} {t('menuItemsLabel')}</span>
      </div>
      {menu.length === 0 ? <EmptyState icon={Icons.Utensils}>{t('emptyMenu')}</EmptyState> : visibleMenu.length === 0 ? <EmptyState icon={Icons.Search}>{t('noItemsFound')}</EmptyState> : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {visibleMenu.map((rawItem) => {
            const item = getLocalizedItem(rawItem);
            return (
              <article key={item.id} className="flex min-w-0 flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
                <div className="h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-emerald-50 sm:w-28">
                  {item.image?.startsWith('http') || item.image?.startsWith('data:image/') ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-emerald-700">{renderIcon('Coffee', 'h-8 w-8')}</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-black text-slate-950">{item.name}</h2>
                      <p className="mt-1 text-xs font-bold text-emerald-700">{categoryNames[item.category] || item.category}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-800">{item.price} ETB</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">{item.description || t('noDescription')}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => onEdit(rawItem)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"><Icons.Pencil className="h-3.5 w-3.5" />{t('edit')}</button>
                    <button type="button" onClick={() => onDelete(item.id)} className="inline-flex items-center gap-1.5 rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-50"><Icons.Trash2 className="h-3.5 w-3.5" />{t('delete')}</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

function CategoriesTab({ categories, menu, t, getLocalizedCategory, onAdd, onEdit, onDelete, onBlockedDelete }) {
  return (
    <>
      <PageHeading
        eyebrow={t('categoryManager')}
        title={t('categories')}
        description={t('categoryDescription')}
        action={<button type="button" onClick={onAdd} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800"><Icons.Plus className="h-4 w-4" />{t('addCategory')}</button>}
      />
      {categories.length === 0 ? <EmptyState icon={Icons.ListTree}>{t('emptyCategories')}</EmptyState> : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const localized = getLocalizedCategory(category);
            const itemCount = menu.filter((item) => item.category === category.id).length;
            return (
              <article key={category.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">{renderIcon(category.icon)}</div>
                    <div className="min-w-0"><h2 className="truncate font-black text-slate-950">{localized.name}</h2><p className="mt-1 text-xs font-semibold text-slate-400">{itemCount} {t('menuItemsLabel')}</p></div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">#{category.sortOrder}</span>
                </div>
                <div className="mt-5 flex gap-2">
                  <button type="button" onClick={() => onEdit(category)} className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-black text-slate-700 hover:border-emerald-300 hover:text-emerald-700">{t('edit')}</button>
                  <button type="button" onClick={() => {
                    if (itemCount > 0) return onBlockedDelete();
                    onDelete(category.id);
                  }} className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-50"><Icons.Trash2 className="h-4 w-4" /></button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

function BanksTab({ banks, t, onAdd, onEdit, onDelete }) {
  return (
    <>
      <PageHeading
        eyebrow={t('bankAccountsHeading')}
        title={t('bankAccountsTab')}
        description={t('bankAccountsSubheading')}
        action={<button type="button" onClick={onAdd} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800"><Icons.Plus className="h-4 w-4" />{t('addBankAccount')}</button>}
      />
      {banks.length === 0 ? <EmptyState icon={Icons.Building2}>{t('emptyBanks')}</EmptyState> : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {banks.map((bank) => (
            <article key={bank.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: bank.color }} /><h2 className="font-black text-slate-950">{bank.bankName}</h2></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-500">{bank.type}</span></div>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{t('accountHolder')}</p><p className="mt-1 font-bold text-slate-800">{bank.accountName}</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{t('accountNumber')}</p><p className="mt-1 break-all font-mono text-base font-black text-slate-900">{bank.accountNumber}</p>
              <div className="mt-5 flex gap-2"><button type="button" onClick={() => onEdit(bank)} className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-black text-slate-700 hover:border-emerald-300 hover:text-emerald-700">{t('edit')}</button><button type="button" onClick={() => onDelete(bank.id)} className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-50"><Icons.Trash2 className="h-4 w-4" /></button></div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function ReviewsTab({ reviews, t, onDelete }) {
  return (
    <>
      <PageHeading eyebrow={t('customerReviewsHeading')} title={t('customerReviewsTab')} description={t('customerReviewsDescription')} />
      {reviews.length === 0 ? <EmptyState icon={Icons.Star}>{t('emptyReviews')}</EmptyState> : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {reviews.map((review) => <article key={review.id || `${review.timestamp}-${review.comment}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-xs font-black uppercase tracking-wider text-emerald-700">{review.tableNumber}</span><span className="text-xs font-bold text-slate-400">{review.timestamp}</span></div><div className="mt-3 flex gap-1">{[1, 2, 3, 4, 5].map((star) => <Icons.Star key={star} className={`h-4 w-4 ${review.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}</div><p className="mt-4 text-sm leading-6 text-slate-600">{review.comment || t('noComment')}</p><button type="button" onClick={() => onDelete?.(review.id)} className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-50"><Icons.Trash2 className="h-3.5 w-3.5" />{t('deleteFeedback')}</button></article>)}
        </div>
      )}
    </>
  );
}

function handleImageUpload(event, setForm) {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = () => setForm((current) => ({ ...current, image: String(reader.result) }));
  reader.readAsDataURL(file);
}

function SettingsTab({ t, theme, mode, restaurantName, tagline, menuVisible, onSave, onPreview, adminEmail, onUpdateCredentials, onToggleMenuVisibility }) {
  const [form, setForm] = useState({ restaurantName, tagline, theme, mode });
  const [saving, setSaving] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '', confirmPassword: '' });
  const [credentialsSaving, setCredentialsSaving] = useState(false);
  const [credentialsMessage, setCredentialsMessage] = useState('');
  const [credentialsError, setCredentialsError] = useState('');
  const [profileError, setProfileError] = useState('');
  useEffect(() => setForm({ restaurantName, tagline, theme, mode }), [restaurantName, tagline, theme, mode]);
  const url = 'https://abu-coffee.vercel.app/';
  const changeAppearance = (changes) => {
    const next = { ...form, ...changes };
    setForm(next);
    onPreview?.(next);
  };
  const save = async (event) => {
    event.preventDefault();
    if (!form.restaurantName.trim() || !form.tagline.trim()) {
      setProfileError(t('formErrorSummary'));
      return;
    }
    setProfileError('');
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };
  const saveCredentials = async (event) => {
    event.preventDefault();
    setCredentialsError('');
    setCredentialsMessage('');
    if (credentials.password && credentials.password !== credentials.confirmPassword) {
      setCredentialsError(t('passwordsDoNotMatch'));
      return;
    }
    if (credentials.password && credentials.password.length < 8) {
      setCredentialsError(t('passwordTooShort'));
      return;
    }
    setCredentialsSaving(true);
    try {
      await onUpdateCredentials({ email: credentials.email, password: credentials.password });
      setCredentials({ email: '', password: '', confirmPassword: '' });
      setCredentialsMessage(t('credentialsUpdated'));
    } catch (credentialError) {
      setCredentialsError(credentialError.message || t('credentialsUpdateFailed'));
    } finally {
      setCredentialsSaving(false);
    }
  };
  return (
    <>
      <PageHeading eyebrow={t('storefrontSetup')} title={t('storefrontSetup')} description={t('profileDescription')} />

      {/* Menu Visibility Card */}
      <div className={`mb-5 flex flex-col gap-4 rounded-3xl border-2 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6 ${
        menuVisible
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-red-200 bg-red-50'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            menuVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {menuVisible
              ? <Icons.Eye className="h-6 w-6" />
              : <Icons.EyeOff className="h-6 w-6" />}
          </div>
          <div>
            <p className={`text-sm font-black ${
              menuVisible ? 'text-emerald-900' : 'text-red-900'
            }`}>{t('menuVisibility')}</p>
            <p className={`mt-1 text-xs leading-5 ${
              menuVisible ? 'text-emerald-700' : 'text-red-700'
            }`}>
              {menuVisible ? t('menuVisible') : t('menuHidden')}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{t('menuVisibilityDescription')}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleMenuVisibility}
          className={`inline-flex shrink-0 items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-black shadow-sm transition ${
            menuVisible
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {menuVisible
            ? <><Icons.EyeOff className="h-4 w-4" />{t('hideMenu')}</>
            : <><Icons.Eye className="h-4 w-4" />{t('showMenu')}</>}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
        <form noValidate onSubmit={save} className="settings-card rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-black text-slate-950">{t('profileDetails')}</h2>
          <FormError>{profileError}</FormError>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">{t('restaurantName')}</span><input className={inputClass} value={form.restaurantName} onChange={(e) => setForm({ ...form, restaurantName: e.target.value })} /></label>
            <label className="sm:col-span-2"><span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">{t('slogan')}</span><textarea className={`${inputClass} min-h-24 resize-y`} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></label>
          </div>
          <div className="mt-6"><span className="mb-3 block text-xs font-black uppercase tracking-wider text-slate-500">{t('theme')}</span><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{themes.map((option) => <button key={option.id} type="button" onClick={() => changeAppearance({ theme: option.id })} className={`settings-theme-option rounded-2xl border p-3 text-left transition ${form.theme === option.id ? 'settings-theme-option-selected border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'}`}><span className="mb-3 block h-7 rounded-xl" style={{ backgroundColor: option.color }} /><span className="settings-theme-label text-xs font-black capitalize text-slate-700">{t(`theme${option.id[0].toUpperCase()}${option.id.slice(1)}`)}</span></button>)}</div></div>
          <div className="mt-6"><span className="mb-3 block text-xs font-black uppercase tracking-wider text-slate-500">{t('appearanceMode')}</span><div className="grid grid-cols-2 gap-3">{['light', 'dark'].map((option) => <button key={option} type="button" onClick={() => changeAppearance({ mode: option })} className={`settings-theme-option flex items-center gap-3 rounded-2xl border p-3 text-left transition ${form.mode === option ? 'settings-theme-option-selected border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'}`}>{option === 'dark' ? <Icons.Moon className="h-5 w-5 text-slate-700" /> : <Icons.Sun className="h-5 w-5 text-amber-500" />}<span className="settings-theme-label text-xs font-black text-slate-700">{t(option === 'dark' ? 'darkMode' : 'lightMode')}</span></button>)}</div></div>
          <button type="submit" disabled={saving} className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-800 disabled:opacity-50">{saving && <Icons.LoaderCircle className="h-4 w-4 animate-spin" />}{t('saveChanges')}</button>
        </form>
        <form onSubmit={saveCredentials} className="settings-card rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-black text-slate-950">{t('accountSecurity')}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{t('accountSecurityDescription')}</p>
          <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">{t('currentAdminEmail')}: {adminEmail || t('notAvailable')}</p>
          <div className="mt-5 space-y-4">
            <label><span className="field-label">{t('newAdminEmail')}</span><input type="email" autoComplete="email" className={inputClass} value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} placeholder={adminEmail} /></label>
            <label><span className="field-label">{t('newAdminPassword')}</span><input type="password" autoComplete="new-password" minLength="8" className={inputClass} value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} /></label>
            <label><span className="field-label">{t('confirmAdminPassword')}</span><input type="password" autoComplete="new-password" minLength="8" className={inputClass} value={credentials.confirmPassword} onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })} /></label>
          </div>
          {credentialsError && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold leading-5 text-red-700">{credentialsError}</p>}
          {credentialsMessage && <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold leading-5 text-emerald-700">{credentialsMessage}</p>}
          <button type="submit" disabled={credentialsSaving || (!credentials.email.trim() && !credentials.password)} className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">{credentialsSaving && <Icons.LoaderCircle className="h-4 w-4 animate-spin" />}{t('updateCredentials')}</button>
        </form>
        </div>
        <div className="settings-card rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-7"><h2 className="text-lg font-black text-slate-950">{t('qrCodeTitle')}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{t('qrCodeDescription')}</p><div className="mx-auto mt-6 flex w-fit rounded-3xl border border-slate-100 bg-white p-4 shadow-inner"><QRCodeSVG value={url} size={170} level="H" includeMargin imageSettings={{ src: '/abu-coffee-logo.png', height: 34, width: 34, excavate: true }} /></div><p className="mt-4 break-all text-xs font-bold text-slate-400">{url}</p></div>
      </div>
    </>
  );
}

function MenuModal({ item, categories, t, saving, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    id: item?.id || '', name: item?.name || '', description: item?.description || '', price: item?.price || '', category: item?.category || categories[0]?.id || '', image: item?.image || '', tags: item?.tags?.join(', ') || '', ingredients: item?.ingredients?.join(', ') || '', prepTime: item?.prepTime || '', rating: item?.rating || 0, reviews: item?.reviews || 0, customizations: item?.customizations || [], translations: item?.translations || {},
  }));
  const [formError, setFormError] = useState('');
  const [useTemplate, setUseTemplate] = useState(false);
  const descriptionTemplate = t('descriptionTemplateText');
  const submitForm = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.category || Number(form.price) <= 0) {
      setFormError(t('formErrorSummary'));
      return;
    }
    setFormError('');
    onSave({ ...form, id: form.id || makeId(form.name), price: Number(form.price) || 0, description: useTemplate ? descriptionTemplate : form.description, tags: form.tags.split(',').map((value) => value.trim()).filter(Boolean), ingredients: form.ingredients.split(',').map((value) => value.trim()).filter(Boolean) });
  };
  const toggleTemplate = (checked) => {
    setUseTemplate(checked);
    if (checked) setForm((current) => ({ ...current, description: descriptionTemplate }));
  };
  return <Modal title={item ? t('editDrink') : t('addDrink')} onClose={onClose}><form noValidate onSubmit={submitForm} className="space-y-4"><FormError>{formError}</FormError><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="field-label">{t('drinkName')}</span><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label><span className="field-label">{t('basePrice')}</span><input type="number" min="0" step="0.01" className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label><label><span className="field-label">{t('category')}</span><select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="">{t('selectCategory')}</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="sm:col-span-2"><span className="field-label">{t('description')}</span><textarea className={`${inputClass} min-h-24 resize-y`} value={useTemplate ? descriptionTemplate : form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={useTemplate} /></label><label className="sm:col-span-2 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3"><input type="checkbox" checked={useTemplate} onChange={(e) => toggleTemplate(e.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-700" /><span><span className="block text-xs font-black text-emerald-900">{t('useDescriptionTemplate')}</span><span className="mt-1 block text-xs leading-5 text-emerald-800">{t('descriptionTemplateHelp')}</span></span></label><label className="sm:col-span-2"><span className="field-label">{t('drinkImage')}</span><input type="file" accept="image/*" className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-xs file:font-black file:text-emerald-800`} onChange={(e) => handleImageUpload(e, setForm)} /></label>{form.image && <div className="sm:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"><img src={form.image} alt={form.name || t('drinkImage')} className="h-16 w-16 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="text-xs font-black text-slate-700">{t('imagePreview')}</p><button type="button" onClick={() => setForm({ ...form, image: '' })} className="mt-1 text-xs font-bold text-red-700">{t('removeImage')}</button></div></div>}<label><span className="field-label">{t('prepTime')}</span><input className={inputClass} placeholder="15 min" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} /></label><label><span className="field-label">{t('tags')}</span><input className={inputClass} placeholder="Hot, Featured" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></label><label className="sm:col-span-2"><span className="field-label">{t('ingredients')}</span><input className={inputClass} placeholder="Coffee, milk, spice" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} /></label></div><div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700">{t('cancel')}</button><button type="submit" disabled={saving || !categories.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{saving && <Icons.LoaderCircle className="h-4 w-4 animate-spin" />}{t('saveDrink')}</button></div></form></Modal>;
}

function CategoryModal({ category, t, saving, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ id: category?.id || '', name: category?.name || '', icon: category?.icon || 'Utensils', sortOrder: category?.sortOrder ?? 0, translations: category?.translations || {} }));
  const [formError, setFormError] = useState('');
  const submitForm = (event) => { event.preventDefault(); if (!form.name.trim()) { setFormError(t('formErrorSummary')); return; } setFormError(''); onSave({ ...form, id: form.id || makeId(form.name), name: form.name.trim(), translations: { ...form.translations, en: form.name.trim() } }); };
  return (
    <Modal title={category ? t('editCategory') : t('addCategory')} onClose={onClose}>
      <form noValidate onSubmit={submitForm} className="space-y-4">
        <FormError>{formError}</FormError>
        <label><span className="field-label">{t('categoryName')}</span><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label><span className="field-label">{t('categoryIcon')}</span><select className={inputClass} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>{iconChoices.map((icon) => <option key={icon} value={icon}>{icon}</option>)}</select></label>
          <label><span className="field-label">{t('categoryOrder')}</span><input type="number" className={inputClass} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></label>
        </div>
        <div className="category-icon-preview flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">{renderIcon(form.icon, 'h-6 w-6')}</div>
          <div><p className="text-xs font-black uppercase tracking-wider text-slate-500">{t('iconPreview')}</p><p className="mt-1 text-sm font-bold text-slate-800">{form.name || t('categoryPreview')}</p></div>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700">{t('cancel')}</button><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{saving && <Icons.LoaderCircle className="h-4 w-4 animate-spin" />}{t('saveCategory')}</button></div>
      </form>
    </Modal>
  );
}

function BankModal({ bank, t, saving, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ id: bank?.id || '', bankName: bank?.bankName || '', accountName: bank?.accountName || '', accountNumber: bank?.accountNumber || '', type: bank?.type || 'cbe', color: bank?.color || '#166534' }));
  const [formError, setFormError] = useState('');
  const submitForm = (event) => { event.preventDefault(); if (!form.bankName.trim() || !form.accountName.trim() || !form.accountNumber.trim()) { setFormError(t('formErrorSummary')); return; } setFormError(''); onSave({ ...form, id: form.id || makeId(`${form.bankName}-${form.accountNumber}`) }); };
  return <Modal title={bank ? t('editBank') : t('addBankAccount')} onClose={onClose}><form noValidate onSubmit={submitForm} className="space-y-4"><FormError>{formError}</FormError><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label><span className="field-label">{t('bankName')}</span><input className={inputClass} value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} /></label><label><span className="field-label">{t('bankType')}</span><select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{bankTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label><span className="field-label">{t('accountHolder')}</span><input className={inputClass} value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })} /></label><label><span className="field-label">{t('accountNumber')}</span><input className={inputClass} value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} /></label><label><span className="field-label">{t('accentColor')}</span><input type="color" className="h-12 w-full rounded-xl border border-slate-200 bg-white p-1" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></label></div><div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700">{t('cancel')}</button><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{saving && <Icons.LoaderCircle className="h-4 w-4 animate-spin" />}{t('saveBank')}</button></div></form></Modal>;
}
