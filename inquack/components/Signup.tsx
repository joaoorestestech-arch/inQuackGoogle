import React, { useState } from 'react';
import {
  ArrowLeft, Mail, Lock, User, Loader2, AlertCircle,
  CheckCircle2, Crown, Zap, Check, Link as LinkIcon,
  Briefcase, MapPin, Scissors, Phone, Eye, EyeOff,
  ShoppingBag, Star, Sparkles, MessageSquare
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Register from '../img/logoRegisterQuack.svg?react';
import StarIcon from '../img/star.png';
import LogoQuack from '../img/logoQuack.svg?react';

interface SignupProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
  onSignupSuccess: (user: { name: string; email: string }) => void;
}

const TALENT_OPTIONS = [
  { label: "Designer de Sobrancelhas", icon: "👁️" },
  { label: "Barbeiro", icon: "✂️" },
  { label: "Manicure", icon: "💅" },
  { label: "Body Piercer", icon: "👃" },
  { label: "Tatuador(a)", icon: "✒️" },
  { label: "Cabelereiro(a)", icon: "👱" },
  { label: "depilador(a)", icon: "🪒" },
  { label: "Estética Facial", icon: "🧴" },
  { label: "Massagista & Spa", icon: "💆" },
  { label: "Maquiador(a)", icon: "💄" },
  { label: "Outro", icon: "❓" }
];

const WORK_STYLE_OPTIONS = [
  { label: "Estou começando", icon: "🐣" },
  { label: "Tenho meu próprio espaço", icon: "🏢" },
  { label: "Trabalho em salão/clinica", icon: "🏥" },
  { label: "Em casa", icon: "🏠" },
  { label: "Vou até o cliente", icon: "🚗" },
  { label: "Sou influencer/criador(a)", icon: "👁️" }
];

const EXPERIENCE_OPTIONS = [
  { id: "novato", label: "Novato", sub: "Estou começando agora com a minha presença online.", icon: "🐣" },
  { id: "ja_tentei", label: "Já tentei", sub: "Já tentei vender 1-2x antes, mas sem sucesso!", icon: "👩‍💻" },
  { id: "intermediario", label: "Intermediário", sub: "Já ganhei algum dinheiro online, nada expressivo.", icon: "🤴" },
  { id: "vendedor", label: "Vendedor nato", sub: "Atualmente está pagando minhas contas", icon: "🤑" }
];

const PLAN_FEATURES = {
  basic: [
    { text: "Até 10 Produtos", included: true },
    { text: "Até 10 Serviços", included: true },
    { text: "IA Auxiliar (Limite Mensal)", included: true },
    { text: "3 botões no site (Quackpage)", included: true },
    { text: "CRM Básico", included: true },
    { text: "Bot de WhatsApp", included: false },
  ],
  pro: [
    { text: "Até 25 Produtos", included: true },
    { text: "Até 25 Serviços", included: true },
    { text: "IA Auxiliar ILIMITADA", included: true },
    { text: "Bot de WhatsApp Incluso", included: true },
    { text: "5 botões no site (Quackpage)", included: true },
    { text: "Relatórios Avançados", included: true },
  ]
};

const Signup: React.FC<SignupProps> = ({ onBack, onSwitchToLogin, onSignupSuccess }) => {
  // Estados de controle de fluxo (Atualizado para 5 passos)
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<'basic' | 'pro' | null>(null);

  // Estados do formulário - Passo 1 (Credenciais)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estados do formulário - Passo 2 (Perfil & Link)
  const [slug, setSlug] = useState('');

  // Passo 3 (Categoria)
  const [talent, setTalent] = useState('');
  const [workStyle, setWorkStyle] = useState('');

  // Passo 4 (Experiência)
  const [experience, setExperience] = useState('');

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Sanitização do Slug em tempo real
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(value);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação Passo 1
    if (step === 1) {
      if (!email || !password || password.length < 6 || !phone) {
        setError("Preencha todos os campos corretamente (e-mail, telefone e senha de no mínimo 6 dígitos).");
        return;
      }
      setStep(2);
      window.scrollTo(0, 0);
      return;
    }

    // Validação Passo 2
    if (step === 2) {
      if (!slug) {
        setError("Por favor, escolha seu link.");
        return;
      }
      setStep(3);
      return;
    }

    // Validação Passo 3
    if (step === 3) {
      if (!talent || !workStyle) {
        setError("Por favor, selecione sua categoria e como trabalha atualmente.");
        return;
      }
      setStep(4);
      window.scrollTo(0, 0);
      return;
    }

    // Validação Passo 4
    if (step === 4) {
      if (!experience) {
        setError("Por favor, selecione sua experiência.");
        return;
      }
      setStep(5);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    if (!plan) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || slug,
            phone_number: phone,
            selected_plan: plan,
            slug: slug,
            talent: talent,
            local: workStyle,
            experience: experience
          }
        }
      });

      if (signUpError) throw signUpError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- VIEW: SUCESSO ---
  if (success) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-brand-dark font-display tracking-tight">Conta criada!</h2>
          <p className="text-brand-muted leading-relaxed">
            Sua QuackPage <strong>quack.page/{slug}</strong> foi reservada! <br />
            Enviamos um e-mail de confirmação para <strong>{email}</strong>.
          </p>
          <button
            onClick={() => onSignupSuccess({ name, email })}
            className="w-full py-4 bg-brand-dark text-white rounded-2xl font-bold text-lg hover:bg-brand-muted transition-all"
          >
            Acessar meu Painel
          </button>
        </div>
      </div>
    );
  }

  // Textos dinâmicos do Sidebar baseados no passo atual
  const getSidebarContent = () => {
    const displayName = slug ? `@${slug}` : "@seunome";

    if (step === 1) {
      return {
        title: "Comece sua jornada digital.",
        text: "Vende, agende e receba pelas redes sociais. Site na bio profissional, loja online e pagamentos integrados. Tudo sem taxa sobre vendas.",
        features: [
          { title: "0% de taxa sobre suas vendas", desc: "Zero taxa sobre vendas e agendamentos", icon: <ShoppingBag className="text-[#FF8A50]" size={24} /> },
          { title: "Tudo em um único link", desc: "Produtos, serviços, agenda, relatório e pagamentos centralizados", icon: <Star className="text-[#FF8A50]" size={24} /> },
          { title: "Venda sem complicação", desc: "Checkout rápido e pagamento em um clique.", icon: <Sparkles className="text-[#FF8A50]" size={24} /> },
          { title: "Assistente de IA", desc: "IA responde dúvidas, qualifica clientes, reengaja e dispara mensagens para os seus clientes. Atendimento inteligente 24/7.", icon: <MessageSquare className="text-[#FF8A50]" size={24} /> }
        ]
      };
    } else {
      return {
        title: <>Ola {displayName} 👋,<br />comece com 14 dias gratuitos.</>,
        text: "Cancele quando quiser.",
        features: [
          { title: "Acesso a todos os recursos", desc: "Todas as ferramentas e análises incluídas", icon: <CheckCircle2 className="text-[#FF8A50]" size={20} /> },
          { title: "Experiente nosso plano", desc: "14 dias de teste.", icon: <CheckCircle2 className="text-[#FF8A50]" size={20} /> },
          { title: "Não se esqueça", desc: "Temos 0% de taxa. Tudo que você lucra é seu.", icon: <CheckCircle2 className="text-[#FF8A50]" size={20} /> }
        ]
      };
    }
  };

  const sidebarContent = getSidebarContent();

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      {/* Side Panel */}
      <div className="hidden md:flex flex-1 bg-gradient-to-b from-[#FFFFFF] to-[#FFF5DE] p-16 flex-col justify-between text-brand-dark relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url(${StarIcon})`,
            backgroundSize: '40px 40px',
            backgroundRepeat: 'repeat'
          }}
        ></div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-35 flex justify-start">
            <div className="w-120 h-120 bg-white/40 rounded-full flex items-center justify-center p-5 shadow-sm">
              <Register className="w-full h-full" />
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-semibold text-brand-dark font-display tracking-tight mb-4 leading-[1.1] transition-all duration-500 max-w-xg">
                {sidebarContent.title}
              </h2>
              <p className="text-lg text-[#555555] max-w-xl transition-all duration-500">
                {sidebarContent.text}
              </p>
            </div>

            <div className="space-y-8">
              {sidebarContent.features.map((feature: any, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111111]">{feature.title}</h3>
                    <p className="text-[#555555] leading-snug max-w-xl">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          <div className="w-full max-w-xl pb-20">
            <div className="bg-white">

              {/* ERRO GLOBAL */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm italic animate-pulse">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              <form onSubmit={handleNextStep}>
                {step === 1 && (
                  /* ETAPA 1: CREDENCIAIS */
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h1 className="text-[32px] font-medium text-stone-900 mb-8 text-center">Crie sua conta</h1>

                    <div className="space-y-4">
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-400 transition-colors" size={20} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-[#E5E5E5] focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all text-lg"
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-4 py-4 rounded-xl bg-white border border-[#E5E5E5] text-gray-600 font-medium whitespace-nowrap">
                          <img src="https://flagcdn.com/w20/br.png" alt="BR" className="w-5" />
                          <span>+55</span>
                        </div>
                        <div className="relative flex-1 group">
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Número de telefone"
                            className="w-full px-4 py-4 rounded-xl bg-white border border-[#E5E5E5] focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all text-lg"
                            required
                          />
                        </div>
                      </div>

                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-400 transition-colors" size={20} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Senha"
                          className="w-full pl-12 pr-12 py-4 rounded-xl bg-white border border-[#E5E5E5] focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all text-lg"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="flex items-center gap-4 py-2">
                        <div className="h-[1px] flex-1 bg-[#F0F0F0]"></div>
                        <span className="text-[#888888] text-sm">ou</span>
                        <div className="h-[1px] flex-1 bg-[#F0F0F0]"></div>
                      </div>

                      {/* Google Button */}
                      <button
                        type="button"
                        className="w-full py-4 bg-white hover:bg-gray-50 border border-[#E5E5E5] rounded-xl font-medium text-stone-700 transition-all flex items-center justify-center gap-3"
                      >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Continuar com o Google
                      </button>

                      <div className="text-center py-2">
                        <button
                          type="button"
                          onClick={onSwitchToLogin}
                          className="text-[#8e8e8e] hover:text-orange-400 transition-colors text-sm font-medium"
                        >
                          Já possui conta? Entrar!
                        </button>
                      </div>

                      <button type="submit" className="w-full py-5 bg-[#111111] text-white rounded-xl font-bold text-xl hover:bg-[#222222] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2">
                        Continuar
                      </button>

                      <p className="text-[11px] text-[#8e8e8e] text-center mt-6 leading-relaxed">
                        Ao continuar, você concorda com nossos <span className="underline cursor-pointer">Termos de Serviço</span> e <span className="underline cursor-pointer">Política de Privacidade</span>.
                      </p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  /* ETAPA 2: LINK */
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h1 className="text-[32px] font-medium text-stone-900 mb-2 text-center">Bem vindo a inQuack</h1>
                    <p className="text-[#555555] mb-8 text-center max-w-sm mx-auto">
                      O <b>link é exclusivo</b> para o seu negócio. Aproveite que os melhores ainda estão disponíveis!
                    </p>

                    <div className="space-y-6">
                      <div className="relative flex items-center group">
                        <div className="absolute left-4 text-gray-400 flex items-center gap-1 font-medium select-none pointer-events-none group-focus-within:text-orange-400 transition-colors">
                          <LinkIcon size={18} />
                          <span>inquack.com/</span>
                        </div>
                        <input
                          type="text"
                          value={slug}
                          onChange={handleSlugChange}
                          placeholder="seunome"
                          className="w-full pl-[135px] pr-4 py-4 rounded-xl bg-[#F0F0F0] ml-1 border border-transparent focus:border-orange-400 focus:bg-white outline-none transition-all font-regular text-stone-900 lowercase text-lg"
                          required
                        />
                      </div>
                      <p className="text-xs text-stone-400 mt-2 text-left">Use apenas letras e números, sem espaços.</p>

                      <button type="submit" className="w-full py-5 bg-[#111111] text-white rounded-xl font-bold text-xl hover:bg-[#222222] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4">
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  /* ETAPA 3: CATEGORIA */
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h1 className="text-[32px] font-medium text-stone-900 mb-2 text-center">Sobre você e o seu negócio</h1>
                    <p className="text-[#555555] mb-8 text-center">Qual categoria você está relacionada?</p>

                    <div className="space-y-8">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {TALENT_OPTIONS.map((opt) => (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => setTalent(opt.label)}
                            className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 text-sm font-medium ${talent === opt.label ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-[#E5E5E5] bg-white text-stone-700 hover:border-orange-300'}`}
                          >
                            <span>{opt.icon}</span>
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      <div>
                        <p className="text-[#555555] mb-4 text-center font-medium">Como você trabalha atualmente?</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {WORK_STYLE_OPTIONS.map((opt) => (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => setWorkStyle(opt.label)}
                              className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 text-sm font-medium ${workStyle === opt.label ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-[#E5E5E5] bg-white text-stone-700 hover:border-orange-300'}`}
                            >
                              <span>{opt.icon}</span>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button type="submit" className="w-full py-5 bg-[#111111] text-white rounded-xl font-bold text-xl hover:bg-[#222222] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4">
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  /* ETAPA 4: EXPERIENCIA */
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h1 className="text-[32px] font-medium text-stone-900 mb-8 text-center">Perfeito! Você já fez dinheiro online antes?</h1>

                    <div className="space-y-3">
                      {EXPERIENCE_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setExperience(opt.id)}
                          className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 ${experience === opt.id ? 'border-orange-400 bg-orange-50/50 shadow-sm' : 'border-[#F0F0F0] bg-[#FDFBF2] hover:border-orange-200'}`}
                        >
                          <div className="text-2xl">{opt.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-bold text-stone-900">{opt.label}</h3>
                            <p className="text-xs text-[#888888]">{opt.sub}</p>
                          </div>
                        </button>
                      ))}

                      <button type="submit" className="w-full py-5 bg-[#111111] text-white rounded-xl font-bold text-xl hover:bg-[#222222] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-8">
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  /* ETAPA 5: PLANOS */
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h1 className="text-[32px] font-medium text-stone-900 mb-2 text-center">Escolha seu plano e comece a ganhar hoje mesmo 💸</h1>

                    <div className="rounded-2xl p-6 mb-8 mt-6">
                      <div className="space-y-3">
                        {(PLAN_FEATURES[plan || 'basic']).map((feat, i) => (
                          <div key={i} className={`flex items-center gap-3 ${feat.included ? 'text-stone-700' : 'text-stone-300'}`}>
                            {feat.included ? (
                              <Check className="text-orange-400" size={18} />
                            ) : (
                              <AlertCircle className="text-stone-300" size={18} />
                            )}
                            <span className={`text-sm font-medium ${!feat.included ? 'line-through' : ''}`}>{feat.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {/* Card Plano Basic */}
                      <button
                        type="button"
                        onClick={() => setPlan('basic')}
                        className={`w-full relative px-6 py-6 rounded-xl border transition-all text-left flex items-center justify-between gap-4 ${plan === 'basic' ? 'border-orange-400 bg-orange-50/30' : 'border-[#F0F0F0] bg-white'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${plan === 'basic' ? 'border-orange-400' : 'border-gray-300'}`}>
                            {plan === 'basic' && <div className="w-2.5 h-2.5 bg-orange-400 rounded-full" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-stone-900 text-xl leading-none">Basic</h3>
                            </div>
                            <p className="text-sm text-stone-400 mt-1">Perfeito para começar</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-black text-stone-900">R$39/ mês</span>
                        </div>
                      </button>

                      {/* Card Plano Pro */}
                      <button
                        type="button"
                        onClick={() => setPlan('pro')}
                        className={`w-full relative px-6 py-6 rounded-xl border transition-all text-left flex items-center justify-between gap-4 ${plan === 'pro' ? 'border-orange-400 bg-orange-50/30' : 'border-[#F0F0F0] bg-white'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${plan === 'pro' ? 'border-orange-400' : 'border-gray-300'}`}>
                            {plan === 'pro' && <div className="w-2.5 h-2.5 bg-orange-400 rounded-full" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-stone-900 text-xl leading-none">Pro</h3>
                              <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">+ Popular</span>
                            </div>
                            <p className="text-sm text-stone-400 mt-1">Escale com todos os nossos benefícios</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-black text-stone-900">R$89/ mês</span>
                        </div>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading || !plan}
                      className="w-full py-5 bg-[#111111] text-white rounded-xl font-bold text-xl hover:bg-[#222222] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : (plan === 'pro' ? "Escolher Pro" : "Escolher Basic")}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="w-full absolute bottom-0 right-0 left-0 bg-white border-t border-gray-100">
            {/* Indicador de Progresso (Linha contínua em degradê) - Agora no rodapé */}
            <div className="w-full h-[4px] bg-gray-50 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 transition-all duration-700 ease-in-out"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>

            <div className="px-12 py-6 flex justify-between items-center">
              {step > 1 && (
                <button
                  onClick={handleBackStep}
                  className="flex items-center gap-2 text-[#555555] hover:text-stone-900 font-bold transition-colors"
                  type="button"
                >
                  <ArrowLeft size={20} />
                  Voltar
                </button>
              )}
              <div className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;