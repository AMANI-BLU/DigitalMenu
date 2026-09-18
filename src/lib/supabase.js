import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project')
);

// Create client instance when credentials exist, otherwise null
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Service helpers for Supabase sync
 */
export const supabaseService = {
  // Check connection status
  isConfigured: () => isSupabaseConfigured,

  // Orders table sync
  async getOrders() {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase getOrders error:', error);
      return null;
    }
    return data;
  },

  async createOrder(order) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select();
    if (error) {
      console.warn('Supabase createOrder error:', error);
      return null;
    }
    return data?.[0] || null;
  },

  async updateOrderStatus(orderId, status) {
    if (!supabase) return false;
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    if (error) {
      console.warn('Supabase updateOrderStatus error:', error);
      return false;
    }
    return true;
  },

  // Waiter calls sync
  async getWaiterCalls() {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('waiter_calls')
      .select('*')
      .eq('resolved', false)
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase getWaiterCalls error:', error);
      return null;
    }
    return data;
  },

  async createWaiterCall(call) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('waiter_calls')
      .insert([call])
      .select();
    if (error) {
      console.warn('Supabase createWaiterCall error:', error);
      return null;
    }
    return data?.[0] || null;
  },

  async resolveWaiterCall(callId) {
    if (!supabase) return false;
    const { error } = await supabase
      .from('waiter_calls')
      .update({ resolved: true })
      .eq('id', callId);
    if (error) {
      console.warn('Supabase resolveWaiterCall error:', error);
      return false;
    }
    return true;
  },

  // Menu items sync
  async getMenuItems() {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('menu_items')
      .select('*');
    if (error) {
      console.warn('Supabase getMenuItems error:', error);
      return null;
    }
    return data;
  },

  async saveMenuItem(item) {
    if (!supabase) return false;
    const { error } = await supabase
      .from('menu_items')
      .upsert([item]);
    if (error) {
      console.warn('Supabase saveMenuItem error:', error);
      return false;
    }
    return true;
  },

  async deleteMenuItem(itemId) {
    if (!supabase) return false;
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', itemId);
    if (error) {
      console.warn('Supabase deleteMenuItem error:', error);
      return false;
    }
    return true;
  }
};
