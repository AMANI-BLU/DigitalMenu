import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-supabase-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const throwIfError = ({ data, error }) => {
  if (error) throw error;
  return data;
};

const isMissingRelation = (error, relation) => Boolean(
  error && (
    error.code === 'PGRST205' ||
    error.message?.includes(`public.${relation}`) ||
    error.message?.includes(`relation \"${relation}\" does not exist`)
  )
);

const mapCategory = (category) => ({
  id: category.id,
  name: category.name,
  icon: category.icon || 'Utensils',
  sortOrder: category.sort_order ?? 0,
  active: category.active !== false,
  translations: category.translations || {},
});

const mapMenuItem = (item) => ({
  id: item.id,
  name: item.name,
  description: item.description || '',
  price: Number(item.price) || 0,
  category: item.category,
  image: item.image || '',
  tags: item.tags || [],
  rating: Number(item.rating) || 0,
  reviews: Number(item.reviews) || 0,
  prepTime: item.prep_time || '',
  ingredients: item.ingredients || [],
  customizations: item.customizations || [],
  translations: item.translations || {},
});

const mapBankAccount = (bank) => ({
  id: bank.id,
  bankName: bank.bank_name,
  accountName: bank.account_name,
  accountNumber: bank.account_number,
  type: bank.type || 'cbe',
  color: bank.color || '#166534',
});

const mapReview = (review) => ({
  id: review.id,
  tableNumber: review.table_number || 'Customer',
  rating: review.rating,
  comment: review.comment || '',
  timestamp: review.created_at ? new Date(review.created_at).toLocaleDateString() : '',
});

export const supabaseService = {
  isConfigured: () => isSupabaseConfigured,

  async getSession() {
    if (!supabase) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async signInAdmin(email, password) {
    if (!supabase) throw new Error('The database is not configured.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle();

    if (adminError || !adminUser) {
      await supabase.auth.signOut();
      throw new Error('This account is not allowed to access the admin dashboard.');
    }

    return data.session;
  },

  async isAdminUser(user) {
    if (!supabase || !user) return false;
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
    return !error && Boolean(data);
  },

  async signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  },

  async updateAdminCredentials({ email, password }) {
    if (!supabase) throw new Error('The database is not configured.');
    const updates = {};
    if (email?.trim()) updates.email = email.trim();
    if (password) updates.password = password;
    if (Object.keys(updates).length === 0) {
      throw new Error('Enter a new email or password.');
    }

    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data.user;
  },

  async getCategories() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });
    return throwIfError({ data: (data || []).map(mapCategory), error });
  },

  async saveCategory(category) {
    if (!supabase) throw new Error('The database is not configured.');
    const payload = {
      id: category.id,
      name: category.name,
      icon: category.icon || 'Utensils',
      sort_order: Number(category.sortOrder) || 0,
      active: category.active !== false,
      translations: category.translations || { en: category.name },
    };
    const { data, error } = await supabase.from('categories').upsert(payload).select().single();
    return mapCategory(throwIfError({ data, error }));
  },

  async deleteCategory(categoryId) {
    if (!supabase) throw new Error('The database is not configured.');
    const { error } = await supabase.from('categories').delete().eq('id', categoryId);
    throwIfError({ data: true, error });
    return true;
  },

  async getMenuItems() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: true });
    return throwIfError({ data: (data || []).map(mapMenuItem), error });
  },

  async saveMenuItem(item) {
    if (!supabase) throw new Error('The database is not configured.');
    const payload = {
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: Number(item.price) || 0,
      category: item.category,
      image: item.image || '',
      tags: item.tags || [],
      rating: Number(item.rating) || 0,
      reviews: Number(item.reviews) || 0,
      prep_time: item.prepTime || '',
      ingredients: item.ingredients || [],
      customizations: item.customizations || [],
      translations: item.translations || { en: { name: item.name, description: item.description || '' } },
      active: true,
    };
    const { data, error } = await supabase.from('menu_items').upsert(payload).select().single();
    return mapMenuItem(throwIfError({ data, error }));
  },

  async deleteMenuItem(itemId) {
    if (!supabase) throw new Error('The database is not configured.');
    const { error } = await supabase.from('menu_items').delete().eq('id', itemId);
    throwIfError({ data: true, error });
    return true;
  },

  async getBankAccounts() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .order('created_at', { ascending: true });
    return throwIfError({ data: (data || []).map(mapBankAccount), error });
  },

  async saveBankAccount(bank) {
    if (!supabase) throw new Error('The database is not configured.');
    const payload = {
      id: bank.id,
      bank_name: bank.bankName,
      account_name: bank.accountName,
      account_number: bank.accountNumber,
      type: bank.type || 'cbe',
      color: bank.color || '#166534',
    };
    const { data, error } = await supabase.from('bank_accounts').upsert(payload).select().single();
    return mapBankAccount(throwIfError({ data, error }));
  },

  async deleteBankAccount(bankId) {
    if (!supabase) throw new Error('The database is not configured.');
    const { error } = await supabase.from('bank_accounts').delete().eq('id', bankId);
    throwIfError({ data: true, error });
    return true;
  },

  async getSettings() {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('restaurant_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();
    if (isMissingRelation(error, 'restaurant_settings')) return null;
    const settings = throwIfError({ data, error });
    return settings
      ? { restaurantName: settings.restaurant_name, tagline: settings.tagline, theme: settings.theme || 'forest', mode: settings.mode || 'light' }
      : null;
  },

  async saveSettings(settings) {
    if (!supabase) throw new Error('The database is not configured.');
    const payload = {
      id: 'default',
      restaurant_name: settings.restaurantName,
      tagline: settings.tagline,
      theme: settings.theme || 'forest',
      mode: settings.mode || 'light',
    };
    const { data, error } = await supabase.from('restaurant_settings').upsert(payload).select().single();
    const saved = throwIfError({ data, error });
    return { restaurantName: saved.restaurant_name, tagline: saved.tagline, theme: saved.theme || 'forest', mode: saved.mode || 'light' };
  },

  async getReviews() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    return throwIfError({ data: (data || []).map(mapReview), error });
  },

  async deleteReview(reviewId) {
    if (!supabase) throw new Error('The database is not configured.');
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    throwIfError({ data: true, error });
    return true;
  },

  async createReview(review) {
    if (!supabase) throw new Error('The database is not configured.');
    const { error } = await supabase
      .from('reviews')
      .insert({
        table_number: review.tableNumber || 'Customer',
        rating: review.rating,
        comment: review.comment || '',
      });
    throwIfError({ data: true, error });
    return {
      id: `local-${Date.now()}`,
      tableNumber: review.tableNumber || 'Customer',
      rating: review.rating,
      comment: review.comment || '',
      timestamp: new Date().toLocaleDateString(),
    };
  },
};
