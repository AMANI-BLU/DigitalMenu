import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('https://nlnevskfnqujwfpwqily.supabase.co')
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
    return data.map(o => ({
      id: o.id,
      orderType: o.order_type || o.orderType || 'dine-in',
      tableNumber: o.table_number || o.tableNumber || null,
      items: o.items || [],
      subtotal: parseFloat(o.subtotal) || 0,
      deliveryDetails: o.delivery_details || o.deliveryDetails || null,
      offerApplied: o.offer_applied || o.offerApplied || null,
      status: o.status || 'pending',
      timestamp: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  },

  async createOrder(order) {
    if (!supabase) return null;
    const dbPayload = {
      id: order.id,
      order_type: order.orderType || 'dine-in',
      table_number: order.tableNumber || null,
      items: order.items || [],
      subtotal: parseFloat(order.subtotal) || 0,
      delivery_details: order.deliveryDetails || null,
      offer_applied: order.offerApplied || null,
      status: order.status || 'pending'
    };
    const { data, error } = await supabase
      .from('orders')
      .insert([dbPayload])
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
    return data.map(c => ({
      id: c.id,
      tableNumber: c.table_number || 'Customer',
      reason: c.reason,
      timestamp: c.timestamp || new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  },

  async createWaiterCall(call) {
    if (!supabase) return null;
    const dbPayload = {
      table_number: call.tableNumber || 'Customer',
      reason: call.reason || 'Service',
      timestamp: call.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const { data, error } = await supabase
      .from('waiter_calls')
      .insert([dbPayload])
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

  // Reviews sync
  async getReviews() {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase getReviews error:', error);
      return null;
    }
    return data.map(r => ({
      id: r.id,
      tableNumber: r.table_number || 'Customer Review',
      rating: r.rating,
      comment: r.comment,
      timestamp: new Date(r.created_at).toLocaleDateString()
    }));
  },

  async createReview(review) {
    if (!supabase) return null;
    const dbPayload = {
      table_number: review.tableNumber || 'Customer',
      rating: review.rating,
      comment: review.comment
    };
    const { data, error } = await supabase
      .from('reviews')
      .insert([dbPayload])
      .select();
    if (error) {
      console.warn('Supabase createReview error:', error);
      return null;
    }
    return data?.[0] || null;
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
  },

  // Bank accounts sync
  async getBankAccounts() {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      console.warn('Supabase getBankAccounts error:', error);
      return null;
    }
    return data.map(b => ({
      id: b.id,
      bankName: b.bank_name || b.bankName,
      accountName: b.account_name || b.accountName,
      accountNumber: b.account_number || b.accountNumber,
      type: b.type || 'cbe',
      color: b.color || '#6a1b9a'
    }));
  },

  async saveBankAccount(bank) {
    if (!supabase) return false;
    const dbPayload = {
      id: bank.id,
      bank_name: bank.bankName || bank.bank_name,
      account_name: bank.accountName || bank.account_name,
      account_number: bank.accountNumber || bank.account_number,
      type: bank.type || 'cbe',
      color: bank.color || '#6a1b9a'
    };
    const { error } = await supabase
      .from('bank_accounts')
      .upsert([dbPayload]);
    if (error) {
      console.warn('Supabase saveBankAccount error:', error);
      return false;
    }
    return true;
  },

  async deleteBankAccount(bankId) {
    if (!supabase) return false;
    const { error } = await supabase
      .from('bank_accounts')
      .delete()
      .eq('id', bankId);
    if (error) {
      console.warn('Supabase deleteBankAccount error:', error);
      return false;
    }
    return true;
  }
};
