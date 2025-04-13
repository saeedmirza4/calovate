
import { createClient } from '@supabase/supabase-js';

// Types for our database tables
export type DbUser = {
  id: string;
  name: string;
  email: string;
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    sugar: number;
    fat: number;
  };
  created_at?: string;
};

export type DbFood = {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  sugar: number;
  fat: number;
  date: string;
  created_at?: string;
};

// Get environment variables with explicit fallbacks to prevent runtime errors
// NOTE: You need to set these values in your Lovable project's environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
if (supabaseUrl === 'https://placeholder-url.supabase.co' || supabaseAnonKey === 'placeholder-key') {
  console.error('⚠️ Supabase credentials are not properly configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your project settings.');
}

// User functions
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data as DbUser;
}

export async function updateUserGoals(userId: string, goals: DbUser['goals']) {
  const { error } = await supabase
    .from('users')
    .update({ goals })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user goals:', error);
    throw error;
  }

  return true;
}

// Food functions
export async function getFoodsByUserId(userId: string) {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching foods:', error);
    return [];
  }

  return data as DbFood[];
}

export async function addFoodItem(food: Omit<DbFood, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('foods')
    .insert([food])
    .select();

  if (error) {
    console.error('Error adding food:', error);
    throw error;
  }

  return data[0] as DbFood;
}

export async function updateFoodItem(id: string, food: Partial<Omit<DbFood, 'id' | 'created_at'>>) {
  const { error } = await supabase
    .from('foods')
    .update(food)
    .eq('id', id);

  if (error) {
    console.error('Error updating food:', error);
    throw error;
  }

  return true;
}

export async function deleteFoodItem(id: string) {
  const { error } = await supabase
    .from('foods')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting food:', error);
    throw error;
  }

  return true;
}
