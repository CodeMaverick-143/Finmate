import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Currency formatting helper
export const formatCurrency = (amount: number, currency: string = 'INR') => {
  const currencyMap: Record<string, { code: string; locale: string }> = {
    USD: { code: 'USD', locale: 'en-US' },
    EUR: { code: 'EUR', locale: 'de-DE' },
    GBP: { code: 'GBP', locale: 'en-GB' },
    CAD: { code: 'CAD', locale: 'en-CA' },
    AUD: { code: 'AUD', locale: 'en-AU' },
    INR: { code: 'INR', locale: 'en-IN' },
    JPY: { code: 'JPY', locale: 'ja-JP' },
    CNY: { code: 'CNY', locale: 'zh-CN' },
    KRW: { code: 'KRW', locale: 'ko-KR' },
    SGD: { code: 'SGD', locale: 'en-SG' },
    HKD: { code: 'HKD', locale: 'en-HK' },
    THB: { code: 'THB', locale: 'th-TH' },
    MYR: { code: 'MYR', locale: 'ms-MY' },
    PHP: { code: 'PHP', locale: 'en-PH' },
    IDR: { code: 'IDR', locale: 'id-ID' },
    VND: { code: 'VND', locale: 'vi-VN' },
    TWD: { code: 'TWD', locale: 'zh-TW' },
    LKR: { code: 'LKR', locale: 'si-LK' }
  };

  const currencyInfo = currencyMap[currency] || currencyMap.INR;
  
  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currencyInfo.code
  }).format(amount);
};

// Get current currency from settings
export const getCurrentCurrency = () => {
  const savedSettings = localStorage.getItem('financeSettings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    return settings.currency || 'INR';
  }
  return 'INR';
};

// Types
export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  goal_amount: number;
  goal_title: string;
  target_month: string;
  created_at: string;
}

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

// Transaction helpers
export const transactions = {
  create: async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: user.id }])
      .select()
      .single();
    return { data, error };
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    return { data, error };
  },

  getByMonth: async (month: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', `${month}-01`)
      .lte('date', `${month}-31`)
      .order('date', { ascending: false });
    return { data, error };
  },

  getByType: async (type: 'income' | 'expense') => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('type', type)
      .order('date', { ascending: false });
    return { data, error };
  },

  getByCategory: async (category: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false });
    return { data, error };
  },

  update: async (id: string, updates: Partial<Transaction>) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Goal helpers
export const goals = {
  create: async (goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => {
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('goals')
      .insert([{ ...goal, user_id: user.id }])
      .select()
      .single();
    return { data, error };
  },

  getAll: async () => {
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('target_month', { ascending: true });
    return { data, error };
  },

  update: async (id: string, updates: Partial<Goal>) => {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);
    return { error };
  }
};