export interface QuackPage {
  id: string;
  user_id: string;
  store_name: string | null;
  address: string | null;
  bio: string | null;
  banner_url: string | null;
  profile_url: string | null;
  show_products: boolean;
  show_services: boolean;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  telegram: string | null;
  tiktok: string | null;
  youtube: string | null;
  linkedin: string | null;
  pinterest: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  primary_color: string | null;
  text_color: string | null;
  slug: string;
}

export interface Service {
  id: string;
  user_id: string;
  name: string;
  price: number;
  description: string | null;
  duration: string | null;
  image_url: string | null;
  active: boolean;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  price: number;
  quantity: number;
  description: string | null;
  image_url: string | null;
}

export interface BusinessHour {
  id: string;
  user_id: string;
  day_of_week: string;
  active: boolean;
  open_time: string | null;
  close_time: string | null;
}

export interface Appointment {
  id?: string;
  user_id: string;
  client_name: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  duration: string | null;
  status?: string;
  cellphone: string | null;
  created_at?: string;
}

export interface Sale {
  id?: string;
  user_id: string;
  client_name: string;
  product_id: string;
  service_id?: string | null;
  amount: number;
  payment_method: string;
  status?: string;
  created_at?: string;
  cellphone: string;
  adress: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export type ViewState = 'products' | 'services' | 'info';
