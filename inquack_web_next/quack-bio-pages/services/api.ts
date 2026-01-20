import { supabase } from './supabaseClient';
import { QuackPage, Product, Service, BusinessHour, Appointment, Sale } from '../types';

export const fetchPageBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('quack_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as QuackPage;
};

export const fetchPageData = async (userId: string) => {
  const [products, services, hours] = await Promise.all([
    supabase.from('products').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('services').select('*').eq('user_id', userId).eq('active', true).order('created_at', { ascending: false }),
    supabase.from('business_hours').select('*').eq('user_id', userId)
  ]);

  return {
    products: (products.data as Product[]) || [],
    services: (services.data as Service[]) || [],
    hours: (hours.data as BusinessHour[]) || []
  };
};

export const fetchAppointmentsByDate = async (userId: string, date: string) => {
  // Date format YYYY-MM-DD
  const { data, error } = await supabase
    .from('appointments')
    .select('appointment_time, duration')
    .eq('user_id', userId)
    .eq('appointment_date', date)
    .neq('status', 'cancelled'); // Don't count cancelled appointments

  if (error) throw error;
  return data as Partial<Appointment>[];
};

export const createAppointment = async (appointment: Appointment) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointment])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createSales = async (sales: Sale[]) => {
  const { data, error } = await supabase
    .from('sales')
    .insert(sales)
    .select();

  if (error) throw error;
  return data;
};
