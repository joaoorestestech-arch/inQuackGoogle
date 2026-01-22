
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Copy, 
  ShoppingBag, 
  Calendar, 
  BarChart3, 
  UserRound,
  Zap, 
  Home, 
  MessageSquare, 
  Layout, 
  Menu as MenuIcon,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  Trash2,
  Edit3,
  X,
  User,
  Power,
  Send,
  Image as ImageIcon,
  Link,
  Instagram,
  Facebook,
  Twitter,
  Send as TelegramIcon,
  Youtube,
  Linkedin,
  Globe,
  Camera,
  ChevronRight,
  Settings,
  CreditCard,
  ShieldCheck,
  FileText,
  HelpCircle,
  Percent,
  TrendingUp,
  XCircle,
  Bell,
  Upload,
  Loader2,
  Palette,
  Type
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '../lib/supabase';
import Logo from '../img/logoQuack.svg?react';
import CRM from './CRM';

interface DashboardProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

type Tab = 'home' | 'inbox' | 'quackpage' | 'sales' | 'menu' | 'products' | 'agenda' | 'ia';
type AgendaSubTab = 'requests' | 'services' | 'hours';
type SalesFilter = 'weekly' | 'semiannual';
type InboxFilter = 'all' | 'products' | 'agenda' | 'payments';

interface Product {
  id: string;
  name: string;
  price: string;
  quantity: number;
  description: string;
  image_url: string;
  status: 'F' | 'D';
}

interface Service {
  id: string;
  name: string;
  price: string;
  description: string;
  duration: string;
  image_url: string;
  active: boolean;
}

interface ChatMessage {
  role: 'user' | 'model';
  message: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  read: boolean;
  created_at: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [agendaSubTab, setAgendaSubTab] = useState<AgendaSubTab>('requests');
  const [salesFilter, setSalesFilter] = useState<SalesFilter>('weekly');
  const [inboxFilter, setInboxFilter] = useState<InboxFilter>('all');
  const [copied, setCopied] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
    
  // States for Data
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form States
  const [productForm, setProductForm] = useState({ name: '', price: '', quantity: 0, description: '', image_url: '', status:'F' as 'F' | 'D' });
  const [serviceForm, setServiceForm] = useState({ name: '', price: '', description: '', duration: '', image_url: '' });
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const [tempImagePreview, setTempImagePreview] = useState<string | null>(null);
  const [activeServiceMenu, setActiveServiceMenu] = useState<string | null>(null);

  // Business Hours State
  const [businessHours, setBusinessHours] = useState<Record<string, { id?: string, active: boolean, open: string, close: string }>>({
    'Segunda': { active: true, open: '09:00', close: '18:00' },
    'Terça': { active: true, open: '09:00', close: '18:00' },
    'Quarta': { active: true, open: '09:00', close: '18:00' },
    'Quinta': { active: true, open: '09:00', close: '18:00' },
    'Sexta': { active: true, open: '09:00', close: '18:00' },
    'Sábado': { active: false, open: '09:00', close: '14:00' },
    'Domingo': { active: false, open: '09:00', close: '12:00' },
  });

  // AI Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Quackpage States
  const [quackConfig, setQuackConfig] = useState<any>({
    id: null,
    store_name: '',
    address: '',
    bio: '',
    banner_url: 'https://picsum.photos/seed/banner/1200/400',
    profile_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`,
    show_products: true,
    show_services: true,
    whatsapp: '',
    facebook: '',
    instagram: '',
    twitter: '',
    telegram: '',
    tiktok: '',
    youtube: '',
    linkedin: '',
    pinterest: '',
    published: false,
    primary_color: '#FFD700',
    text_color: '#1A1A1A',
    bg_color: '#F4F4F4', 
    pd_layout: 'grid',   
    slug: ''
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [slugError, setSlugError] = useState(false);

  const pendingAppointmentsCount = useMemo(() => 
  appointments.filter(a => a.status === 'pending').length, 
  [appointments]);

  const sanitizeSlug = (text: string) => {
  return text
    .toString()
    .normalize("NFD")                   // Decompõe caracteres acentuados (ex: á -> a + ´)
    .replace(/[\u0300-\u036f]/g, "")    // Remove os acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")               // Substitui espaços por hifens
    .replace(/[^\w-]+/g, "")            // Remove tudo que não for letra, número ou hífen
    .replace(/--+/g, "-");              // Substitui múltiplos hifens por um único
  };

  const [clients, setClients] = useState<any[]>([]);

  const syncClientData = async (data: {
  client_name: string;
  client_phone?: string;
  amount: number;
  item_name: string;
  type: 'product' | 'service';
  }) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // 1. Tenta buscar o cliente existente pelo nome (ou telefone, se preferir)
      const { data: existingClient } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('client_name', data.client_name)
        .maybeSingle();

      const payload = {
        user_id: authUser.id,
        client_name: data.client_name,
        client_phone: data.client_phone || (existingClient?.client_phone),
        sum_price: (existingClient?.sum_price || 0) + data.amount,
        last_service: data.type === 'service' ? data.item_name : (existingClient?.last_service),
        last_product: data.type === 'product' ? data.item_name : (existingClient?.last_product),
        last_date: new Date().toISOString(),
      };

      if (existingClient) {
        // Atualiza cliente existente
        await supabase.from('clients').update(payload).eq('id', existingClient.id);
      } else {
        // Insere novo cliente
        await supabase.from('clients').insert([payload]);
      }

      // 2. Atualiza o estado local para refletir no CRM imediatamente
      const { data: updatedClients } = await supabase.from('clients').select('*').eq('user_id', authUser.id);
      if (updatedClients) setClients(updatedClients);

    } catch (error) {
      console.error("Erro ao sincronizar cliente:", error);
    }
  };

  // Initial Data Fetching
  useEffect(() => {
    const fetchData = async () => {

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: clientsData } = await supabase.from('clients').select('*').eq('user_id', authUser.id);
      if (clientsData) setClients(clientsData);

      setIsLoadingData(true);
      try {
        const { data: prods } = await supabase.from('products').select('*').eq('user_id', authUser.id);
        if (prods) setProducts(prods);

        const { data: servs } = await supabase.from('services').select('*').eq('user_id', authUser.id);
        if (servs) setServices(servs);

        const { data: notifs } = await supabase.from('notifications').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false });
        if (notifs) setNotifications(notifs);

        const { data: hours } = await supabase.from('business_hours').select('*').eq('user_id', authUser.id);
        if (hours && hours.length > 0) {
          const hoursMap: any = { ...businessHours };
          hours.forEach((h: any) => {
            hoursMap[h.day_of_week] = { 
              id: h.id, 
              active: h.active, 
              open: h.open_time?.slice(0, 5) || '09:00', 
              close: h.close_time?.slice(0, 5) || '18:00' 
            };
          });
          setBusinessHours(hoursMap);
        }

        const { data: qPage } = await supabase.from('quack_pages').select('*').eq('user_id', authUser.id).maybeSingle();
        if (qPage) setQuackConfig(qPage);

        const { data: chats } = await supabase.from('ai_chats').select('*').eq('user_id', authUser.id).order('created_at', { ascending: true });
        if (chats) setChatMessages(chats.map((c: any) => ({ role: c.role, message: c.message })));

        const { data: salesData } = await supabase.from('sales').select('*, products(name), services(name)').eq('user_id', authUser.id);
        if (salesData) setSales(salesData);

        const { data: appts } = await supabase.from('appointments').select('*, services(name)').eq('user_id', authUser.id);
        if (appts) setAppointments(appts);

      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const copyLink = () => {
    const link = `inquack.com/${quackConfig.store_name?.toLowerCase().replace(/\s/g, '') || user?.name?.toLowerCase().replace(/\s/g, '') || 'usuario'}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTempImageFile(file);
      setTempImagePreview(URL.createObjectURL(file));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const uploadToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('inquack-assets')
        .upload(filePath, file);

      if (uploadError) {
        return await fileToBase64(file);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('inquack-assets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      return await fileToBase64(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      let imageUrl = productForm.image_url;
      if (tempImageFile) {
        imageUrl = await uploadToSupabase(tempImageFile);
      }

      const payload = {
          name: productForm.name,
          price: parseFloat(productForm.price),
          quantity: productForm.quantity,
          description: productForm.description,
          image_url: imageUrl,
          status: productForm.status, // Inserido no payload
          user_id: authUser.id,
          updated_at: new Date().toISOString()
      };

      if (editingItem) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingItem.id);
        if (!error) setProducts(products.map(p => p.id === editingItem.id ? { ...p, ...payload } : p));
      } else {
        const { data, error } = await supabase.from('products').insert([payload]).select().single();
        if (data) setProducts([...products, data]);
      }
      
      setShowProductModal(false);
      setEditingItem(null);
      setProductForm({ name: '', price: '', quantity: 0, description: '', image_url: '' });
      setTempImageFile(null);
      setTempImagePreview(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      let imageUrl = serviceForm.image_url;
      if (tempImageFile) {
        imageUrl = await uploadToSupabase(tempImageFile);
      }

      const payload = {
        name: serviceForm.name,
        price: parseFloat(serviceForm.price),
        description: serviceForm.description,
        duration: serviceForm.duration,
        image_url: imageUrl,
        active: true,
        user_id: authUser.id,
        updated_at: new Date().toISOString()
      };

      if (editingItem) {
        const { error } = await supabase.from('services').update(payload).eq('id', editingItem.id);
        if (!error) setServices(services.map(s => s.id === editingItem.id ? { ...s, ...payload } : s));
      } else {
        const { data, error } = await supabase.from('services').insert([payload]).select().single();
        if (data) setServices([...services, data]);
      }
      
      setShowServiceModal(false);
      setEditingItem(null);
      setServiceForm({ name: '', price: '', description: '', duration: '', image_url: '' });
      setTempImageFile(null);
      setTempImagePreview(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateBusinessHours = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    try {
      const promises = (Object.entries(businessHours) as [string, { id?: string, active: boolean, open: string, close: string }][]).map(([day, config]) => {
        const payload = {
          user_id: authUser.id,
          day_of_week: day,
          active: config.active,
          open_time: config.open + ":00",
          close_time: config.close + ":00"
        };
        if (config.id) {
          return supabase.from('business_hours').update(payload).eq('id', config.id);
        } else {
          return supabase.from('business_hours').insert([payload]);
        }
      });
      await Promise.all(promises);
      alert('Horários salvos com sucesso!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isAiTyping) return;

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    // 1. Adiciona mensagem do usuário na UI imediatamente
    const userMsg: ChatMessage = { role: 'user', message: inputMessage };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsAiTyping(true);

    // Salva no Supabase (Opcional: Idealmente fazer isso em background)
    await supabase.from('ai_chats').insert([{ user_id: authUser.id, role: 'user', message: userMsg.message }]);

    try {
      // 2. Inicializa o Gemini
      // ATENÇÃO: Se usar Vite, use import.meta.env.VITE_GEMINI_API_KEY
      // Se usar Create React App, use process.env.REACT_APP_GEMINI_API_KEY
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''; 
      
      if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        throw new Error("API Key não configurada.");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview", // Modelo rápido e gratuito
        systemInstruction: 'Você é um consultor especialista em alavancagem de pequenos e médios negócios (SMBs). Seu objetivo é ajudar o usuário com dicas práticas de marketing, vendas, CRM e gestão. Seja direto, motivador e profissional. Use o tom da marca inQuack: minimalista, moderno e eficiente.'
      });

      // 3. Prepara o histórico para o formato do Gemini
      // O Gemini espera "user" e "model". Seu estado já usa esses nomes, mas vamos garantir o formato.
      const history = chatMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.message }]
      }));

      // 4. Inicia o chat com histórico
      const chat = model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      // 5. Envia a nova mensagem
      const result = await chat.sendMessage(userMsg.message);
      const response = await result.response;
      const aiText = response.text();

      // 6. Atualiza UI com resposta da IA
      const aiMsg: ChatMessage = { role: 'model', message: aiText };
      setChatMessages(prev => [...prev, aiMsg]);
      
      await supabase.from('ai_chats').insert([{ user_id: authUser.id, role: 'model', message: aiMsg.message }]);

    } catch (err: any) {
      console.error("Erro Gemini:", err);
      let errorText = 'Ocorreu um erro ao conectar com a IA.';
      
      if (err.message.includes("API Key")) {
        errorText = 'Erro de configuração: Chave de API inválida.';
      } else if (err.message.includes("429")) {
        errorText = 'Muitas requisições. Tente novamente em alguns instantes.';
      }

      setChatMessages(prev => [...prev, { role: 'model', message: errorText }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleQuackImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'profile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPublishing(true);
    try {
      const imageUrl = await uploadToSupabase(file);
      setQuackConfig((prev: any) => ({
        ...prev,
        [type === 'banner' ? 'banner_url' : 'profile_url']: imageUrl
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublish = async () => {
  setSlugError(false);
  setIsPublishing(true);
  
  const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    try {
      // 1. Gerar o slug atual para validação
      const currentSlug = quackConfig.slug || quackConfig.store_name
        .toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      // 2. Verificar se o slug já existe para OUTRO usuário
      const { data: existingPage, error: checkError } = await supabase
        .from('quack_pages')
        .select('user_id')
        .eq('slug', currentSlug)
        .single();

      if (existingPage && existingPage.user_id !== authUser.id) {
        setSlugError(true);
        setIsPublishing(false);
        return; // Interrompe a publicação
      }

    const payload = {
      store_name: quackConfig.store_name,
      address: quackConfig.address,
      bio: quackConfig.bio,
      banner_url: quackConfig.banner_url,
      profile_url: quackConfig.profile_url,
      show_products: quackConfig.show_products,
      show_services: quackConfig.show_services,
      whatsapp: quackConfig.whatsapp,
      facebook: quackConfig.facebook,
      instagram: quackConfig.instagram,
      twitter: quackConfig.twitter,
      telegram: quackConfig.telegram,
      tiktok: quackConfig.tiktok,
      youtube: quackConfig.youtube,
      linkedin: quackConfig.linkedin,
      pinterest: quackConfig.pinterest,
      primary_color: quackConfig.primary_color,
      text_color: quackConfig.text_color,
      bg_color: quackConfig.bg_color,
      pd_layout: quackConfig.pd_layout,
      published: true,
      user_id: authUser.id,
      slug: currentSlug, // Garantimos o slug aqui
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
        .from('quack_pages')
        .upsert(payload, { onConflict: 'user_id' })
        .select().single();

      if (error) throw error;
      if (data) {
        setQuackConfig(data);
        alert('Sua Quackpage foi publicada com sucesso!');
      }
    } catch (error) {
      console.error("Erro ao publicar:", error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsPublishing(false);
    }
  }

  const chartData = useMemo(() => {
    const now = new Date();
    let groupedData: { label: string; value: number; fullDate: Date }[] = [];
    
    // 1. Configurar os buckets (grupos de tempo) baseados no filtro
    if (salesFilter === 'weekly') {
      // Últimos 7 dias
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        groupedData.push({
          label: d.toLocaleDateString('pt-BR', { weekday: 'short' }), // Seg, Ter...
          value: 0,
          fullDate: d
        });
      }
    } else if (salesFilter === 'semiannual') {
      // Últimos 6 meses
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        groupedData.push({
          label: d.toLocaleDateString('pt-BR', { month: 'short' }), // Jan, Fev...
          value: 0,
          fullDate: d
        });
      }
    } else {
      // Anual (12 meses)
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        groupedData.push({
          label: d.toLocaleDateString('pt-BR', { month: 'short' }),
          value: 0,
          fullDate: d
        });
      }
    }

    // 2. Somar as vendas nos buckets corretos
    sales.forEach(sale => {
      const saleDate = new Date(sale.created_at);
      
      // Ignora vendas que falharam
      if (sale.status !== 'success') return;

      if (salesFilter === 'weekly') {
        // Compara dia/mês/ano
        const match = groupedData.find(g => 
          g.fullDate.getDate() === saleDate.getDate() && 
          g.fullDate.getMonth() === saleDate.getMonth()
        );
        if (match) match.value += parseFloat(sale.amount);
      } else {
        // Compara mês/ano (para semestral e anual)
        const match = groupedData.find(g => 
          g.fullDate.getMonth() === saleDate.getMonth() && 
          g.fullDate.getFullYear() === saleDate.getFullYear()
        );
        if (match) match.value += parseFloat(sale.amount);
      }
    });

    // 3. Calcular altura relativa (porcentagem) para o CSS
    const maxValue = Math.max(...groupedData.map(d => d.value)) || 1; // Evita divisão por zero
    
    return groupedData.map(d => ({
      ...d,
      heightPercentage: (d.value / maxValue) * 100
    }));

  }, [sales, salesFilter]);

  // Calcula o total filtrado para exibir no topo do card
  const filteredTotal = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

    const renderHome = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-4 gap-4">
      {[
        { label: "Produtos", icon: <ShoppingBag size={24} />, tab: 'products', badge: null },
        {
          label: "Agenda",
          icon: <Calendar size={24} />,
          tab: 'agenda',
          badge: pendingAppointmentsCount > 0 ? pendingAppointmentsCount : null
        },
        { label: "Relatório", icon: <BarChart3 size={24} />, tab: 'sales',badge: null },
        { label: "IA", icon: <Zap size={24} />, tab: 'ia', badge: null },
      ].map((action, i) => (
        <div key={i} onClick={() => setActiveTab(action.tab as Tab)} className="flex flex-col items-center gap-3 group cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand-muted group-hover:bg-brand-primary group-hover:text-brand-dark transition-all shadow-sm relative">
            {action.icon}
            
            {/* BADGE REFINADO - CANTO INFERIOR DIREITO */}
            {action.badge !== null && (
            <div className="absolute -bottom-2 -right-2">
              <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                <div className="h-5 w-5 rounded-full bg-[#EAB308] flex items-center justify-center">
                  <span className="text-[10px] font-black text-black leading-none">
                    {action.badge}
                  </span>
                </div>
              </div>
            </div>
            )}
          </div>
          <span className="text-[10px] font-black text-brand-muted uppercase tracking-[0.1em]">{action.label}</span>
        </div>
      ))}
    </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Agendamentos hoje", value: appointments.filter(a => a.status === 'confirmed').length.toString(), icon: <Calendar className="text-blue-500" /> },
          { label: "Vendas realizadas", value: sales.length.toString(), icon: <ShoppingBag className="text-emerald-500" /> },
          { label: "Visitas ao link", value: "1.2k", icon: <ArrowUpRight className="text-orange-500" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-gray-50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-muted font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-brand-dark">{stat.value}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-soft/50 flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-50 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-brand-dark">Transações Recentes</h3>
          <button onClick={() => setActiveTab('sales')} className="text-xs font-bold text-brand-primary uppercase tracking-widest">Ver tudo</button>
        </div>
        <div className="divide-y divide-gray-50">
          {sales.slice(0, 5).map((t) => (
            <div key={t.id} className="px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                  {t.status === 'success' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <p className="font-bold text-brand-dark text-sm">{t.client_name || 'Cliente Anonimo'}</p>
                  <p className="text-xs text-brand-muted">{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-brand-dark mb-1 text-sm">R$ {t.amount}</p>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  t.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
          {sales.length === 0 && <p className="p-8 text-center text-brand-muted text-sm font-medium">Nenhuma venda registrada ainda.</p>}
        </div>
      </div>
    </div>
  );

    const renderProducts = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
      {/* Header Fixo/Sticky para Mobile */}
      <div className="flex items-center justify-between sticky top-[88px] bg-brand-bg/80 backdrop-blur-md z-20 py-2">
        <h3 className="text-xl font-black text-brand-dark tracking-tight">Produtos</h3>
        <button 
          onClick={() => { 
            setEditingItem(null); 
            setProductForm({ name: '', price: '', quantity: 0, description: '', image_url: '' });
            setTempImageFile(null);
            setTempImagePreview(null);
            setShowProductModal(true); 
          }}
          className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:opacity-90 transition-all shadow-lg"
        >
          <Plus size={16} />
          Novo
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-10 rounded-[2rem] border border-dashed border-gray-300 text-center space-y-4">
          <div className="w-14 h-14 bg-brand-soft rounded-full flex items-center justify-center mx-auto text-brand-muted">
            <ShoppingBag size={28} />
          </div>
          <p className="font-bold text-brand-dark text-sm">Nenhum produto cadastrado</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-3 rounded-2xl border border-gray-50 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform">
              {/* Thumbnail Reduzida para Mobile */}
              <div className="relative flex-shrink-0">
                <img src={p.image_url} className="w-16 h-16 rounded-xl object-cover bg-brand-soft" alt={p.name} />
                {p.quantity <= 5 && (
                  <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </div>



              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-brand-dark text-sm truncate">{p.name}</h4>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                  p.status === 'F' ? 'bg-amber-200 text-amber-600 border border-amber-400' : 'bg-green-100 text-green-800 border border-green-200'}`}>{p.status === 'F' ? 'Físico' : 'Digital'}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-brand-dark font-black text-sm">R$ {p.price}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${p.quantity > 0 ? 'bg-brand-soft text-brand-muted' : 'bg-red-50 text-red-500'}`}>
                    Estoque: {p.quantity}
                  </span>
                </div>
              </div>

              {/* Ações Compactas */}
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => { 
                    setEditingItem(p); 
                    setProductForm({ ...p, price: p.price.toString() }); 
                    setTempImagePreview(p.image_url);
                    setShowProductModal(true); 
                  }}
                  className="p-2.5 bg-brand-soft text-brand-muted rounded-lg"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={async () => {
                    if (confirm('Excluir produto?')) {
                      await supabase.from('products').delete().eq('id', p.id);
                      setProducts(products.filter(item => item.id !== p.id));
                    }
                  }}
                  className="p-2.5 bg-red-50 text-red-400 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAgenda = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-10">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {[
          { id: 'requests', label: 'Agendamentos' },
          { id: 'services', label: 'Serviços' },
          { id: 'hours', label: 'Horários' },
        ].map(sub => (
          <button 
            key={sub.id}
            onClick={() => setAgendaSubTab(sub.id as AgendaSubTab)}
            className={`flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
              agendaSubTab === sub.id ? 'bg-brand-dark text-white shadow-lg' : 'bg-white text-brand-muted border border-gray-100'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {agendaSubTab === 'requests' && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-brand-muted uppercase tracking-widest px-2">Solicitações Pendentes</h4>
          {appointments.filter(a => a.status === 'pending').map(req => (
            <div key={req.id} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-soft rounded-2xl flex items-center justify-center text-brand-muted"><User size={24} /></div>
                <div>
                  <p className="font-bold text-brand-dark">{req.client_name}</p>
                  <p className="text-xs text-brand-muted">{req.services?.name} • {req.duration}</p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-brand-dark">
                    <Calendar size={12} /> {req.appointment_date} às {req.appointment_time?.slice(0, 5)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={async () => {
                    await supabase.from('appointments').update({ status: 'confirmed' }).eq('id', req.id);
                    setAppointments(appointments.map(a => a.id === req.id ? { ...a, status: 'confirmed' } : a));
                  }}
                  className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Aceitar
                </button>
                <button 
                  onClick={async () => {
                    await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', req.id);
                    setAppointments(appointments.filter(a => a.id !== req.id));
                  }}
                  className="p-2 text-brand-muted hover:text-red-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ))}
          {appointments.filter(a => a.status === 'pending').length === 0 && <p className="text-center py-10 text-brand-muted font-medium">Nenhum agendamento pendente.</p>}
        </div>
      )}
      {agendaSubTab === 'services' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Meus Serviços</h4>
            <button 
              onClick={() => { 
                setEditingItem(null); 
                setServiceForm({ name: '', price: '', description: '', duration: '', image_url: '' });
                setTempImagePreview(null);
                setShowServiceModal(true); 
              }}
              className="bg-brand-primary/10 text-brand-dark font-black text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Plus size={14} /> ADICIONAR
            </button>
          </div>

          <div className="grid gap-3">
        {services.map(s => (
          <div key={s.id} className={`relative bg-white p-3 rounded-2xl border border-gray-50 shadow-sm flex items-center gap-3 transition-all ${!s.active ? 'opacity-60' : ''}`}>
            
            {/* 1. Thumbnail com tamanho fixo - flex-shrink-0 impede que ela esmague */}
            <div className="relative flex-shrink-0">
              <img src={s.image_url} className="w-14 h-14 rounded-xl object-cover bg-brand-soft" alt={s.name} />
              {!s.active && (
                <div className="absolute inset-0 bg-white/40 flex items-center justify-center rounded-xl">
                  <Power size={14} className="text-brand-muted" />
                </div>
              )}
            </div>

            {/* 2. Container de Texto com min-w-0 - ISSO É O SEGREDO */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="font-bold text-brand-dark text-sm truncate pr-2">
                {s.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-brand-dark font-black text-xs whitespace-nowrap">
                  R$ {s.price}
                </span>
                {/* Duração com truncate também, caso o texto seja customizado e longo */}
                <span className="text-[9px] text-brand-muted font-bold uppercase bg-brand-soft px-2 py-0.5 rounded-full truncate max-w-[80px]">
                  {s.duration}
                </span>
              </div>
            </div>

            {/* 3. Botão de Ação - flex-shrink-0 garante que ele sempre apareça */}
            <button 
              onClick={() => setActiveServiceMenu(s.id)}
              className="flex-shrink-0 p-3 -mr-1 hover:bg-gray-50 rounded-xl text-brand-muted active:scale-90 transition-all"
            >
              <Settings size={20} />
            </button>

            {/* O Action Sheet (Menu inferior) permanece igual ao anterior */}
            {activeServiceMenu === s.id && (
              <>
                            {/* Backdrop para fechar ao clicar fora */}
                            <div 
                              className="fixed inset-0 z-60 bg-brand-dark/20 backdrop-blur-[2px]" 
                              onClick={() => setActiveServiceMenu(null)}
                            />
                            <div className="fixed bottom-14 left-0 right-0 z-70 bg-white rounded-t-[2.5rem] p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
                              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                              
                              <h5 className="text-center font-black text-brand-dark mb-6 tracking-tight">Gerenciar Serviço</h5>
                              
                              <div className="space-y-2">
                                <button 
                                  onClick={async () => {
                                    const nextState = !s.active;
                                    await supabase.from('services').update({ active: nextState }).eq('id', s.id);
                                    setServices(services.map(item => item.id === s.id ? { ...item, active: nextState } : item));
                                    setActiveServiceMenu(null);
                                  }}
                                  className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-colors ${s.active ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}
                                >
                                  <Power size={18} />
                                  {s.active ? 'Pausar Serviço' : 'Ativar Serviço'}
                                </button>

                                <button 
                                  onClick={() => {
                                    setEditingItem(s);
                                    setServiceForm({ ...s, price: s.price.toString() });
                                    setTempImagePreview(s.image_url);
                                    setShowServiceModal(true);
                                    setActiveServiceMenu(null);
                                  }}
                                  className="w-full flex items-center gap-4 p-4 bg-brand-soft rounded-2xl font-bold text-sm text-brand-dark"
                                >
                                  <Edit3 size={18} />
                                  Editar Informações
                                </button>

                                <button 
                                  onClick={async () => {
                                    if (confirm('Deseja excluir este serviço?')) {
                                      await supabase.from('services').delete().eq('id', s.id);
                                      setServices(services.filter(item => item.id !== s.id));
                                      setActiveServiceMenu(null);
                                    }
                                  }}
                                  className="w-full flex items-center gap-4 p-4 bg-red-50 rounded-2xl font-bold text-sm text-red-500"
                                >
                                  <Trash2 size={18} />
                                  Excluir Permanentemente
                                </button>
                              </div>
                            </div>
                          </>
            )}
          </div>
        ))}
                </div>
              </div>
            )}

            {agendaSubTab === 'hours' && (
              <div className="bg-white rounded-[2.5rem] p-4 sm:p-8 border border-gray-50 shadow-sm space-y-6">
                <h4 className="text-lg font-black text-brand-dark">Horários de Funcionamento</h4>
                <div className="space-y-4">
                  {(Object.entries(businessHours) as [string, { id?: string, active: boolean, open: string, close: string }][]).map(([day, config]) => (
                    <div key={day} className="flex flex-col gap-4 pb-4 border-b border-gray-50 last:border-0">
                      <div className="flex flex-wrap items-center justify-between gap-y-3">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setBusinessHours(prev => ({ ...prev, [day]: { ...prev[day], active: !prev[day].active } }))}
                            className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${config.active ? 'bg-brand-dark' : 'bg-gray-200'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.active ? 'right-1' : 'left-1'}`}></div>
                          </button>
                          <span className={`font-bold transition-colors ${config.active ? 'text-brand-dark' : 'text-gray-300'}`}>{day}</span>
                        </div>
                        {config.active ? (
                          <div className="flex items-center gap-2 sm:gap-3 animate-in fade-in zoom-in-95 duration-200">
                            <input 
                              type="time" 
                              value={config.open} 
                              onChange={e => setBusinessHours(prev => ({ ...prev, [day]: { ...prev[day], open: e.target.value } }))}
                              className="bg-brand-soft px-2 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold outline-none border-none" 
                            />
                            <span className="text-brand-muted text-[10px] sm:text-xs font-medium">até</span>
                            <input 
                              type="time" 
                              value={config.close} 
                              onChange={e => setBusinessHours(prev => ({ ...prev, [day]: { ...prev[day], close: e.target.value } }))}
                              className="bg-brand-soft px-2 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold outline-none border-none" 
                            />
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Fechado</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleUpdateBusinessHours}
                  className="w-full bg-brand-dark text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-dark/10 active:scale-95 transition-all"
                >
                  Salvar Configurações
                </button>
              </div>
            )}
          </div>
        );

  const renderIaChat = () => (
    <div className="flex flex-col h-[calc(100vh-250px)] animate-in slide-in-from-bottom duration-300">
      <div className="flex-1 overflow-y-auto px-2 space-y-4 no-scrollbar" ref={scrollRef}>
        {chatMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-60">
            <div className="w-16 h-16 bg-brand-primary/20 text-brand-dark rounded-full flex items-center justify-center">
              <Zap size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-dark">Consultor inQuack IA</h3>
              <p className="text-sm text-brand-muted max-w-xs">Pergunte sobre marketing, vendas ou como alavancar seu negócio.</p>
            </div>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed ${
              msg.role === 'user' ? 'bg-brand-dark text-white rounded-br-none' : 'bg-white text-brand-dark rounded-bl-none border border-gray-100'
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
        {isAiTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-[1.5rem] rounded-bl-none border border-gray-100 flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="mt-6 flex gap-2">
        <input 
          type="text" 
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Como posso aumentar minhas vendas hoje?"
          className="flex-1 bg-white border border-gray-100 px-6 py-4 rounded-2xl font-medium outline-none focus:ring-2 ring-brand-primary transition-all"
        />
        <button 
          type="submit"
          className="bg-brand-dark text-brand-primary p-4 rounded-2xl hover:bg-brand-muted transition-all active:scale-95 disabled:opacity-50"
          disabled={!inputMessage.trim() || isAiTyping}
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );

  const renderQuackpage = () => (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-black text-brand-dark tracking-tight">Configurar Quackpage</h3>
        <button 
          onClick={handlePublish}
          disabled={isPublishing}
          className="bg-brand-dark text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-brand-muted transition-all flex items-center gap-2"
        >
          {isPublishing ? <Loader2 className="animate-spin" size={18} /> : <Globe size={18} />}
          Publicar Quackpage
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-50 overflow-hidden">
        {/* Hidden inputs for banner/profile selection */}
        <input 
          type="file" 
          id="quack-banner-input" 
          className="hidden" 
          accept="image/*" 
          onChange={(e) => handleQuackImageChange(e, 'banner')} 
        />
        <input 
          type="file" 
          id="quack-profile-input" 
          className="hidden" 
          accept="image/*" 
          onChange={(e) => handleQuackImageChange(e, 'profile')} 
        />

        <div className="relative h-48 bg-brand-soft group/banner">
          <img src={quackConfig.banner_url} className="w-full h-full object-cover" alt="Banner" />
          <button 
            onClick={() => document.getElementById('quack-banner-input')?.click()}
            className="absolute top-4 right-4 p-2 bg-white/60 backdrop-blur rounded-full text-brand-dark hover:bg-white transition-all opacity-0 group-hover/banner:opacity-100"
          >
            <Camera size={18} />
          </button>
          
          <div className="absolute -bottom-10 left-8 flex items-end gap-4">
            <div className="relative group/profile">
              <div className="w-24 h-24 bg-white p-1 rounded-full shadow-lg">
                <img src={quackConfig.profile_url} className="w-full h-full rounded-full bg-brand-soft object-cover" alt="Profile" />
              </div>
              <button 
                onClick={() => document.getElementById('quack-profile-input')?.click()}
                className="absolute inset-0 bg-brand-dark/40 text-white flex items-center justify-center rounded-full opacity-0 group-hover/profile:opacity-100 transition-opacity"
              >
                <Camera size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-14 p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-muted uppercase">Nome do Estabelecimento</label>
                <input 
                  type="text" 
                  value={quackConfig.store_name}
                  onChange={e => {
                    setSlugError(false); // Limpa o erro ao digitar
                    setQuackConfig({...quackConfig, store_name: e.target.value, slug: sanitizeSlug(e.target.value)});
                  }}
                  className={`w-full bg-brand-soft px-4 py-3 rounded-2xl outline-none border-2 transition-all ${slugError ? 'border-red-500' : 'border-transparent focus:border-brand-primary'}`} 
                />
                {slugError && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 animate-in fade-in slide-in-from-top-1">
                    Este nome de site já está em uso. Favor escolha outro.
                  </p>
                )}
              </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-muted uppercase">Endereço (Opcional)</label>
              <input 
                type="text" 
                value={quackConfig.address}
                onChange={e => setQuackConfig({...quackConfig, address: e.target.value})}
                className="w-full bg-brand-soft px-4 py-3 rounded-2xl outline-none" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-muted uppercase">Biografia / Slogan</label>
            <textarea 
              value={quackConfig.bio}
              onChange={e => setQuackConfig({...quackConfig, bio: e.target.value})}
              className="w-full bg-brand-soft px-4 py-3 rounded-2xl outline-none h-24 resize-none"
              placeholder="Fale um pouco sobre o que você faz..."
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => setQuackConfig({...quackConfig, show_products: !quackConfig.show_products})}
              className={`flex-1 p-6 rounded-[2rem] border transition-all flex items-center justify-between ${quackConfig.show_products ? 'bg-brand-primary/10 border-brand-primary' : 'bg-brand-soft border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className={quackConfig.show_products ? 'text-brand-dark' : 'text-brand-muted'} />
                <span className="font-bold text-brand-dark hidden sm:inline">Ativar Produtos</span>
                <span className="font-bold text-brand-dark sm:hidden">Produtos</span>
              </div>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${quackConfig.show_products ? 'bg-brand-dark' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${quackConfig.show_products ? 'right-1' : 'left-1'}`}></div>
              </div>
            </button>

            <button 
              onClick={() => setQuackConfig({...quackConfig, show_services: !quackConfig.show_services})}
              className={`flex-1 p-6 rounded-[2rem] border transition-all flex items-center justify-between ${quackConfig.show_services ? 'bg-brand-primary/10 border-brand-primary' : 'bg-brand-soft border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <Calendar className={quackConfig.show_services ? 'text-brand-dark' : 'text-brand-muted'} />
                <span className="font-bold text-brand-dark hidden sm:inline">Ativar Serviços</span>
                <span className="font-bold text-brand-dark sm:hidden">Serviços</span>
              </div>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${quackConfig.show_services ? 'bg-brand-dark' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${quackConfig.show_services ? 'right-1' : 'left-1'}`}></div>
              </div>
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-brand-muted uppercase tracking-widest">Redes Sociais & Contatos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'whatsapp', icon: <MessageSquare size={18} />, label: 'Whatsapp' },
                { id: 'instagram', icon: <Instagram size={18} />, label: 'Instagram' },
                { id: 'facebook', icon: <Facebook size={18} />, label: 'Facebook' },
                { id: 'twitter', icon: <Twitter size={18} />, label: 'Twitter (X)' },
                { id: 'telegram', icon: <TelegramIcon size={18} />, label: 'Telegram' },
                { id: 'tiktok', icon: <Clock size={18} />, label: 'TikTok' },
                { id: 'youtube', icon: <Youtube size={18} />, label: 'Youtube' },
                { id: 'linkedin', icon: <Linkedin size={18} />, label: 'LinkedIn' },
                { id: 'pinterest', icon: <ImageIcon size={18} />, label: 'Pinterest' },
              ].map(social => (
                <div key={social.id} className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors">
                    {social.icon}
                  </div>
                  <input 
                    type="text" 
                    placeholder={social.label}
                    value={(quackConfig as any)[social.id] || ''}
                    onChange={e => setQuackConfig({
                      ...quackConfig, 
                      [social.id]: e.target.value
                    })}
                    className="w-full bg-brand-soft pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-1 ring-brand-primary text-sm font-medium"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Seção de Customização Visual */}
          <div className="space-y-4 pt-4 border-t border-gray-50">
          <h4 className="text-xs font-bold text-brand-muted uppercase tracking-widest">Identidade Visual</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Cor Principal */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-muted uppercase ml-2">Cor Principal</label>
              <div className="flex items-center gap-3 bg-brand-soft p-2 rounded-2xl border border-transparent focus-within:border-brand-primary transition-all">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white shadow-sm flex-shrink-0">
                  <input 
                    type="color" 
                    value={quackConfig.primary_color || '#FFD700'}
                    onChange={e => setQuackConfig({...quackConfig, primary_color: e.target.value})}
                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                  />
                </div>
                <input 
                  type="text"
                  maxLength={7}
                  value={quackConfig.primary_color || '#FFD700'}
                  onChange={e => setQuackConfig({...quackConfig, primary_color: e.target.value})}
                  className="flex-1 bg-transparent outline-none text-sm font-bold text-brand-dark uppercase"
                  placeholder="#000000"
                />
                <Palette size={18} className="text-brand-muted mr-2" />
              </div>
            </div>
            {/* Cor do Texto */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-muted uppercase ml-2">Cor do Texto</label>
              <div className="flex items-center gap-3 bg-brand-soft p-2 rounded-2xl border border-transparent focus-within:border-brand-primary transition-all">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white shadow-sm flex-shrink-0">
                  <input 
                    type="color" 
                    value={quackConfig.text_color || '#1A1A1A'}
                    onChange={e => setQuackConfig({...quackConfig, text_color: e.target.value})}
                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                  />
                </div>
                <input 
                  type="text"
                  maxLength={7}
                  value={quackConfig.text_color || '#1A1A1A'}
                  onChange={e => setQuackConfig({...quackConfig, text_color: e.target.value})}
                  className="flex-1 bg-transparent outline-none text-sm font-bold text-brand-dark uppercase"
                  placeholder="#000000"
                />
                <Type size={18} className="text-brand-muted mr-2" />
              </div>
            </div>
            
            {/* Cor de Fundo */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-muted uppercase ml-2">Cor de Fundo da Página</label>
              <div className="flex items-center gap-3 bg-brand-soft p-2 rounded-2xl border border-transparent focus-within:border-brand-primary transition-all">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white shadow-sm flex-shrink-0">
                  <input 
                    type="color" 
                    value={quackConfig.bg_color || '#F4F4F4'}
                    onChange={e => setQuackConfig({...quackConfig, bg_color: e.target.value})}
                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                  />
                </div>
                <input 
                  type="text"
                  maxLength={7}
                  value={quackConfig.bg_color || '#F4F4F4'}
                  onChange={e => setQuackConfig({...quackConfig, bg_color: e.target.value})}
                  className="flex-1 bg-transparent outline-none text-sm font-bold text-brand-dark uppercase"
                  placeholder="#F4F4F4"
                />
                <ImageIcon size={18} className="text-brand-muted mr-2" />
              </div>
            </div>

            {/* Seletor de Layout de Produtos */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-muted uppercase ml-2">Layout dos Produtos</label>
              <div className="flex bg-brand-soft p-1 rounded-2xl border border-gray-100">
                <button
                  onClick={() => setQuackConfig({...quackConfig, pd_layout: 'grid'})}
                  className={`flex-1 py-5 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${
                    quackConfig.pd_layout === 'grid' ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-muted'
                  }`}
                >
                  <Layout size={14} /> Galeria
                </button>
                <button
                  onClick={() => setQuackConfig({...quackConfig, pd_layout: 'list'})}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${
                    quackConfig.pd_layout === 'list' ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-muted'
                  }`}
                >
                  <MenuIcon size={14} /> Lista
                </button>
              </div>
            </div>

          </div>
        </div>



        </div>
      </div>      
    </div>
  );

  const renderSales = () => (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h3 className="text-2xl font-black text-brand-dark tracking-tight">
          Relatórios de Vendas
        </h3>

        <div className="flex bg-white rounded-2xl p-1 border border-gray-100 shadow-sm">
          {[
            { id: 'weekly', label: 'Semanal' },
            { id: 'semiannual', label: 'Semestral' }
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setSalesFilter(f.id as SalesFilter)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                salesFilter === f.id
                  ? 'bg-brand-dark text-white'
                  : 'text-brand-muted hover:bg-brand-soft'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>


      {/* CARD DE FATURAMENTO E GRÁFICO */}
      <div className="bg-white p-8 rounded-[1.5rem] border border-gray-50 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="font-bold text-brand-dark">Faturamento ({salesFilter === 'weekly' ? 'Últimos 7 dias' : salesFilter === 'semiannual' ? 'Últimos 6 meses' : 'Este ano'})</h4>
            <p className="text-xs text-brand-muted font-medium">Resultados baseados no filtro selecionado</p>
          </div>
          <div className="text-right">
            {/* Valor Dinâmico Filtrado */}
            <span className="text-2xl font-black text-brand-dark">R$ {filteredTotal.toFixed(2)}</span>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">+12% vs período anterior</p>
          </div>
        </div>
        
        {/* GRÁFICO DINÂMICO */}
        <div className="flex items-end justify-between h-48 gap-2 border-b border-dashed border-gray-200 pb-2">
          {chartData.map((data, i) => (
            <div key={i} className="flex-1 group relative flex flex-col justify-end h-full">
              {/* Barra */}
              <div 
                style={{ height: `${data.heightPercentage || 2}%` }} // Mínimo de 2% para não sumir visualmente
                className={`w-full rounded-t-lg transition-all duration-500 relative ${data.value > 0 ? 'bg-brand-primary hover:bg-brand-dark' : 'bg-gray-100'}`}
              >
                 {/* Tooltip com Valor */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  R$ {data.value.toFixed(2)}
                </div>
              </div>
              {/* Label do Eixo X (Dia/Mês) */}
              <div className="text-center mt-2">
                 <span className="text-[10px] text-brand-muted font-bold uppercase">{data.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESTO DOS CARDS DE PRODUTOS/SERVIÇOS (MANTIDOS IGUAIS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[1.5rem] border border-gray-50 shadow-sm">
          <h4 className="font-bold text-brand-dark mb-6">Produtos mais vendidos</h4>
          <div className="space-y-6">
            {products.slice(0, 3).map((p, i) => {
              const count = sales.filter(s => s.product_id === p.id && s.status === 'success').length;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-brand-muted">
                    <span>{p.name}</span>
                    <span>{count} vendas</span>
                  </div>
                  <div className="h-2 w-full bg-brand-soft rounded-full overflow-hidden">
                    <div className={`h-full bg-brand-primary`} style={{ width: `${Math.min(100, (count/10)*100)}%` }}></div>
                  </div>
                </div>
              );
            })}
            {products.length === 0 && <p className="text-center text-xs text-brand-muted font-medium py-4">Nenhum dado disponível.</p>}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[1.5rem] border border-gray-50 shadow-sm">
          <h4 className="font-bold text-brand-dark mb-6">Serviços mais vendidos</h4>
          <div className="space-y-6">
            {services.slice(0, 3).map((s, i) => {
              const count = sales.filter(sale => sale.service_id === s.id && sale.status === 'success').length;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-brand-muted">
                    <span>{s.name}</span>
                    <span>{count} agendamentos</span>
                  </div>
                  <div className="h-2 w-full bg-brand-soft rounded-full overflow-hidden">
                    <div className={`h-full bg-purple-400`} style={{ width: `${Math.min(100, (count/10)*100)}%` }}></div>
                  </div>
                </div>
              );
            })}
            {services.length === 0 && <p className="text-center text-xs text-brand-muted font-medium py-4">Nenhum dado disponível.</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-gray-50 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50">
          <h4 className="font-bold text-brand-dark">Ranking de Clientes</h4>
        </div>
        <div className="divide-y divide-gray-50">
          {sales.filter(s => s.status === 'success').slice(0, 5).map((c, i) => (
            <div key={i} className="px-8 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-brand-primary font-black text-lg">#{i + 1}</span>
                <div>
                  <p className="font-bold text-brand-dark text-sm">{c.client_name || 'Cliente Anonimo'}</p>
                  <p className="text-[10px] text-brand-muted uppercase font-bold tracking-widest">{c.payment_method}</p>
                </div>
              </div>
              <span className="font-black text-brand-dark">R$ {c.amount}</span>
            </div>
          ))}
          {sales.length === 0 && <p className="p-8 text-center text-brand-muted text-sm font-medium">Nenhum dado para mostrar.</p>}
        </div>
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <h3 className="text-2xl font-black text-brand-dark tracking-tight">Configurações</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-bold text-brand-muted uppercase tracking-[0.2em] mb-4 px-4">Minha Conta</h4>
          <div className="bg-white rounded-[1.5rem] border border-gray-50 shadow-sm overflow-hidden divide-y divide-gray-50">
            {[
              { icon: <User size={20} />, label: 'Informação Pessoal', desc: 'Edite seus dados de perfil' },
              { icon: <Zap size={20} />, label: 'Planos de Assinatura', desc: 'Gerencie seu plano atual' },
              { icon: <CreditCard size={20} />, label: 'Métodos de Pagamento', desc: 'Configurações de recebimento' },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-6 hover:bg-brand-soft transition-all group">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 bg-brand-soft rounded-xl flex items-center justify-center text-brand-muted group-hover:bg-brand-primary group-hover:text-brand-dark transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-brand-dark text-sm">{item.label}</p>
                    <p className="text-[10px] text-brand-muted font-medium">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-dark transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-brand-muted uppercase tracking-[0.2em] mb-4 px-4">Configurações do App</h4>
          <div className="bg-white rounded-[1.5rem] border border-gray-50 shadow-sm overflow-hidden divide-y divide-gray-50">
            {[
              { icon: <ShieldCheck size={20} />, label: 'Configurações e Privacidade', desc: 'Sua segurança em primeiro lugar' },
              { icon: <Percent size={20} />, label: 'Taxas e Comissões', desc: 'Visualize seus custos operacionais' },
              { icon: <HelpCircle size={20} />, label: 'Tire suas dúvidas', desc: 'Central de ajuda inQuack' },
              { icon: <FileText size={20} />, label: 'Termos do aplicativo', desc: 'Legal e políticas' },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-6 hover:bg-brand-soft transition-all group">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 bg-brand-soft rounded-xl flex items-center justify-center text-brand-muted group-hover:bg-brand-primary group-hover:text-brand-dark transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-brand-dark text-sm">{item.label}</p>
                    <p className="text-[10px] text-brand-muted font-medium">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-dark transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full py-5 bg-red-50 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all shadow-sm"
        >
          Encerrar Sessão
        </button>
      </div>
    </div>
  );

  const renderInbox = () => {
    const filteredNotifications = notifications.filter(n => {
      if (inboxFilter === 'all') return true;
      return n.type === inboxFilter;
    });
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-brand-dark tracking-tight">Inbox</h3>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-muted border border-gray-100 shadow-sm">
            <Bell size={20} />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'all', label: 'Tudo' },
            { id: 'products', label: 'Produtos' },
            { id: 'agenda', label: 'Agenda' },
            { id: 'payments', label: 'Pagamentos' },
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setInboxFilter(f.id as InboxFilter)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-xs transition-all ${
                inboxFilter === f.id ? 'bg-brand-dark text-white shadow-lg' : 'bg-white text-brand-muted border border-gray-100 shadow-sm'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-gray-300 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-brand-soft rounded-full flex items-center justify-center text-brand-muted">
                 <MessageSquare size={32} />
              </div>
              <p className="font-bold text-brand-muted">Sua inbox está limpa!</p>
            </div>
          ) : (
            filteredNotifications.map(n => (
              <div key={n.id} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm flex items-start gap-4 hover:shadow-md transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-brand-soft flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {n.type === 'agenda' ? <Calendar className="text-blue-500" /> : n.type === 'payments' ? <CreditCard className="text-green-500" /> : <ShoppingBag className="text-orange-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-brand-dark text-sm">{n.title}</h4>
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-tighter">{new Date(n.created_at).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed">{n.description}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-brand-primary mt-2"></div>}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-brand-primary" />
          <p className="font-bold text-brand-dark animate-pulse">Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg pb-24 font-manrope">
      <header className="bg-white px-6 py-6 border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-12 h-12 bg-brand-primary rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-brand-dark overflow-hidden">
               <img src={quackConfig.profile_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="avatar" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm text-brand-muted font-medium">Olá, {quackConfig.store_name || user?.name || 'Empreendedor'}</h2>
              <p className="text-lg font-bold text-brand-dark truncate">R$ {sales.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toFixed(2)}</p>
            </div>
          </div>
          
          <button 
            onClick={copyLink}
            className="flex items-center gap-2 bg-brand-soft px-4 py-2.5 rounded-2xl text-xs font-bold text-brand-dark hover:bg-gray-200 transition-all border border-gray-100"
          >
            <span className="hidden sm:inline">inquack.com/{quackConfig.slug || user?.name?.toLowerCase().replace(/\s/g, '') || 'usuario'}</span>
            <Copy size={16} className={copied ? "text-green-500" : "text-brand-muted"} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'agenda' && renderAgenda()}
        {activeTab === 'ia' && renderIaChat()}
        {activeTab === 'quackpage' && renderQuackpage()}
        {activeTab === 'sales' && renderSales()}
        {activeTab === 'menu' && renderMenu()}
        {activeTab === 'inbox' && renderInbox()}
        {activeTab === 'CRM' && <CRM clients={clients} />}
        
      </main>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" onClick={() => !isUploading && setShowProductModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-brand-dark">{editingItem ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button disabled={isUploading} onClick={() => setShowProductModal(false)} className="p-2 hover:bg-brand-soft rounded-full transition-colors"><X /></button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-muted uppercase">Foto do Produto</label>
                <div 
                  onClick={() => document.getElementById('product-image-input')?.click()}
                  className="w-full h-40 bg-brand-soft rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-primary transition-all overflow-hidden group"
                >
                  {tempImagePreview ? (
                    <img src={tempImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="text-brand-muted group-hover:text-brand-primary transition-colors" />
                      <span className="text-[10px] font-bold text-brand-muted uppercase">Clique para enviar</span>
                    </>
                  )}
                  <input id="product-image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-muted uppercase">Nome do Produto</label>
                  <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} type="text" className="w-full bg-brand-soft px-4 py-3 rounded-2xl outline-none focus:ring-2 ring-brand-primary" placeholder="Ex: Cerveja Artesanal" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-muted uppercase">Preço (R$)</label>
                  <input required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} type="text" className="w-full bg-brand-soft px-4 py-3 rounded-2xl outline-none" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-muted uppercase">Quantidade em estoque</label>
                <input required value={productForm.quantity} onChange={e => setProductForm({...productForm, quantity: parseInt(e.target.value) || 0})} type="number" className="w-full bg-brand-soft px-4 py-3 rounded-2xl outline-none" placeholder="10" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-muted uppercase">Tipo de Produto</label>
                <div className="flex bg-brand-soft p-1 rounded-2xl border border-gray-100">
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, status: 'F' })}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                      productForm.status === 'F' ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-muted'
                    }`}
                  >
                    Físico (F)
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, status: 'D' })}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                      productForm.status === 'D' ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-muted'
                    }`}
                  >
                    Digital (D)
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-muted uppercase">Breve Descrição</label>
                <textarea required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-brand-soft px-4 py-3 rounded-2xl outline-none h-24 resize-none" placeholder="Descreva seu product..."></textarea>
              </div>
              <button disabled={isUploading} type="submit" className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold shadow-xl shadow-brand-dark/10 transition-transform active:scale-95 flex items-center justify-center gap-2">
                {isUploading ? <Loader2 className="animate-spin" /> : editingItem ? 'Salvar Alterações' : 'Criar Produto'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" onClick={() => !isUploading && setShowServiceModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-brand-dark">{editingItem ? 'Editar Serviço' : 'Novo Serviço'}</h3>
              <button disabled={isUploading} onClick={() => setShowServiceModal(false)} className="p-2 hover:bg-brand-soft rounded-full transition-colors"><X /></button>
            </div>
            <form onSubmit={handleAddService} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-muted uppercase">Foto do Serviço</label>
                <div 
                  onClick={() => document.getElementById('service-image-input')?.click()}
                  className="w-full h-40 bg-brand-soft rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-primary transition-all overflow-hidden group"
                >
                  {tempImagePreview ? (
                    <img src={tempImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="text-brand-muted group-hover:text-brand-primary transition-colors" />
                      <span className="text-[10px] font-bold text-brand-muted uppercase">Clique para enviar</span>
                    </>
                  )}
                  <input id="service-image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-muted uppercase">Nome do Serviço</label>
                  <input required value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} type="text" className="w-full bg-brand-soft px-4 py-3 rounded-2xl outline-none focus:ring-2 ring-brand-primary" placeholder="Ex: Manicure" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-muted uppercase">Preço (R$)</label>
                  <input required value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} type="text" className="w-full bg-brand-soft px-4 py-3 rounded-2xl outline-none" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-muted uppercase">Tempo de Duração</label>
                <select required value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})} className="w-full bg-brand-soft px-4 py-3 rounded-2xl outline-none appearance-none">
                  <option value="">Selecione...</option>
                  <option value="30 min">30 min</option>
                  <option value="45 min">45 min</option>
                  <option value="1 hora">1 hora</option>
                  <option value="1h 30min">1h 30min</option>
                  <option value="2 horas">2 horas</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-muted uppercase">Descrição</label>
                <textarea required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="w-full bg-brand-soft px-4 py-3 rounded-2xl outline-none h-24 resize-none" placeholder="O que está incluso?"></textarea>
              </div>
              <button disabled={isUploading} type="submit" className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold shadow-xl shadow-brand-dark/10 transition-transform active:scale-95 flex items-center justify-center gap-2">
                {isUploading ? <Loader2 className="animate-spin" /> : editingItem ? 'Salvar Alterações' : 'Criar Serviço'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Render CRM */}




      {/* Fixed Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-3 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-brand-primary' : 'text-brand-muted'}`}>
            <Home size={24} />
            <span className="text-[10px] font-bold uppercase">Home</span>
          </button>
          <button onClick={() => setActiveTab('inbox')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'inbox' ? 'text-brand-primary' : 'text-brand-muted'}`}>
            <MessageSquare size={24} />
            <span className="text-[10px] font-bold uppercase">Inbox</span>
          </button>
          <button onClick={() => setActiveTab('quackpage')} className="flex flex-col items-center gap-1 -mt-8 group">
            <div className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center border-4 border-white transition-all ${activeTab === 'quackpage' ? 'bg-brand-primary text-brand-dark' : 'bg-brand-dark text-brand-primary group-hover:bg-brand-muted'}`}>
              <div className="font-black text-lg">
                <Logo style={{width: '26px'}} />
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase mt-1 transition-colors ${activeTab === 'quackpage' ? 'text-brand-primary' : 'text-brand-muted'}`}>Quackpage</span>
          </button>
          <button onClick={() => setActiveTab('CRM')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'CRM' ? 'text-brand-primary' : 'text-brand-muted'}`}>
            <UserRound size={24} />
            <span className="text-[10px] font-bold uppercase">CRM</span>
          </button>
          <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'menu' ? 'text-brand-primary' : 'text-brand-muted'}`}>
            <MenuIcon size={24} />
            <span className="text-[10px] font-bold uppercase">Menu</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
