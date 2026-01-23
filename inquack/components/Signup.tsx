import React, { useState } from 'react';
import { 
  ArrowLeft, Mail, Lock, User, Loader2, AlertCircle, 
  CheckCircle2, Crown, Zap, Check, Link as LinkIcon, 
  Briefcase, MapPin, Scissors 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Register from '../img/logoRegisterQuack.svg?react';

interface SignupProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
  onSignupSuccess: (user: { name: string; email: string }) => void;
}

const TALENT_OPTIONS = [
  "Manicure", "Designer de Sobrancelha", "Depilador", "Massagista", 
  "Barbeiro", "Cabelereiro", "Tatuador", "Maquiador(a)", 
  "Estética Facial", "Outros"
];

const WORK_STYLE_OPTIONS = [
  "Em casa", "Tenho meu próprio espaço", "Vou até o cliente", 
  "Trabalho em salão/clinica", "Estou começando"
];

const Signup: React.FC<SignupProps> = ({ onBack, onSwitchToLogin, onSignupSuccess }) => {
  // Estados de controle de fluxo (Agora são 3 passos)
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<'basic' | 'pro' | null>(null);
  
  // Estados do formulário - Passo 1 (Credenciais)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados do formulário - Passo 2 (Perfil & Link)
  const [slug, setSlug] = useState('');
  const [talent, setTalent] = useState('');
  const [workStyle, setWorkStyle] = useState('');

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
      if (!name || !email || !password || password.length < 6) {
        setError("Preencha todos os campos corretamente.");
        return;
      }
      setStep(2);
      return;
    }

    // Validação Passo 2
    if (step === 2) {
      if (!slug || !talent || !workStyle) {
        setError("Por favor, preencha todos os detalhes do seu perfil.");
        return;
      }
      setStep(3);
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
      // 1. Criar o usuário no Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            selected_plan: plan,

            slug: slug,
            talent: talent,
            local: workStyle
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Erro ao criar usuário.");

      // 2. Chamar a Edge Function para gerar o link do Mercado Pago
      // Usamos o invoke para chamar a função que criamos no passo anterior
      const { data: payData, error: funcError } = await supabase.functions.invoke('mercado-pago-checkout', {
        body: { 
          userId: authData.user.id, 
          email: email, 
          plan: plan 
        }
      });

      if (funcError) throw funcError;

      // 3. Redirecionar o usuário para o Checkout do Mercado Pago
      if (payData?.url) {
        window.location.href = payData.url; 
      } else {
        throw new Error("Não foi possível gerar o link de pagamento.");
      }

    } catch (err: any) {
      setError(err.message || 'Erro no processo de cadastro.');
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
          <h2 className="text-3xl font-black text-brand-dark">Conta criada!</h2>
          <p className="text-brand-muted leading-relaxed">
            Sua QuackPage <strong>quack.page/{slug}</strong> foi reservada! <br/>
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
    switch(step) {
      case 1: return { title: "Comece sua jornada digital.", text: "Crie sua identidade profissional em segundos." };
      case 2: return { title: "Personalize sua QuackPage.", text: "Defina seu link exclusivo e conte o que você faz." };
      case 3: return { title: "Escolha o poder da sua conta.", text: "Selecione o plano ideal para o seu momento." };
      default: return { title: "Bem-vindo", text: "" };
    }
  };

  const sidebarContent = getSidebarContent();

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      {/* Side Panel */}
      <div className="hidden md:flex flex-1 bg-brand-primary p-16 flex-col justify-between text-brand-dark relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl text-white">
              <Register style={{width: '36px'}} />
            </div>
            <span className="text-2xl font-bold tracking-tight">inQuack</span>
          </div>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight transition-all duration-500">
            {sidebarContent.title}
          </h2>
          <p className="text-xl text-brand-dark/70 max-w-md transition-all duration-500">
            {sidebarContent.text}
          </p>
        </div>
        
        <div className="relative z-10">
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                <div className="text-2xl font-bold mb-1">Pague depois</div>
                <div className="text-sm opacity-70">Teste todas as ferramentas Pro por 7 dias grátis.</div>
              </div>
              <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                <div className="text-2xl font-bold mb-1">IA Ativa</div>
                <div className="text-sm opacity-70">Nossa IA já começa a trabalhar no seu primeiro microsite.</div>
              </div>
           </div>
        </div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white md:bg-brand-bg">
        <div className="w-full max-w-xl">
          <button 
            onClick={handleBackStep}
            className="flex items-center gap-2 text-brand-muted hover:text-brand-dark font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <div className="bg-white p-8 rounded-[1.5rem] shadow-xl shadow-brand-dark/5 border border-gray-100">
            {/* Indicador de Progresso */}
            <div className="flex gap-2 mb-8">
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-brand-primary' : 'bg-gray-100'}`}></div>
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-brand-primary' : 'bg-gray-100'}`}></div>
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-brand-primary' : 'bg-gray-100'}`}></div>
            </div>

            {/* ERRO GLOBAL */}
            {error && (
               <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm italic animate-pulse">
                 <AlertCircle size={18} /> {error}
               </div>
             )}

            <form onSubmit={handleNextStep}>
              {step === 1 && (
                /* ETAPA 1: DADOS PESSOAIS */
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h1 className="text-3xl font-black text-brand-dark mb-2">Crie sua conta</h1>
                  <p className="text-brand-muted mb-8">Passo 1 de 3: Suas credenciais</p>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-brand-dark mb-2">Seu Nome ou Empresa</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="João Silva" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-brand-soft border border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-medium" required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-brand-dark mb-2">Email Profissional</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-brand-soft border border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-medium" required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-brand-dark mb-2">Crie uma Senha</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-brand-soft border border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-medium" required minLength={6} />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-brand-dark text-white rounded-2xl font-bold text-lg hover:bg-brand-muted transition-all flex items-center justify-center gap-2 shadow-lg mt-4">
                      Continuar <ArrowLeft className="rotate-180" size={20} />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                /* ETAPA 2: DADOS DO PERFIL (NOVA ETAPA) */
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h1 className="text-3xl font-black text-brand-dark mb-2">Sobre seu negócio</h1>
                  <p className="text-brand-muted mb-8">Passo 2 de 3: Personalize seu link</p>

                  <div className="space-y-5">
                    
                    {/* Link da QuackPage */}
                    <div>
                      <label className="block text-sm font-bold text-brand-dark mb-2">Seu Link Exclusivo</label>
                      <div className="relative flex items-center">
                        <div className="absolute left-4 text-gray-400 flex items-center gap-1 font-medium select-none pointer-events-none">
                            <LinkIcon size={18} />
                            <span>inquack.com/</span>
                        </div>
                        <input 
                            type="text" 
                            value={slug} 
                            onChange={handleSlugChange} 
                            placeholder="sua-loja" 
                            className="w-full pl-[135px] pr-4 py-4 rounded-2xl bg-brand-soft border border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-bold text-brand-dark lowercase" 
                            required 
                        />
                      </div>
                      <p className="text-xs text-brand-muted mt-2 ml-1">Use apenas letras e números, sem espaços.</p>
                    </div>

                    {/* Dropdown Talento */}
                    <div>
                      <label className="block text-sm font-bold text-brand-dark mb-2">Qual seu talento?</label>
                      <div className="relative">
                        <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select 
                            value={talent} 
                            onChange={(e) => setTalent(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-brand-soft border border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-medium appearance-none cursor-pointer text-brand-dark"
                            required
                        >
                            <option value="" disabled>Selecione sua profissão</option>
                            {TALENT_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* Dropdown Local de Trabalho */}
                    <div>
                      <label className="block text-sm font-bold text-brand-dark mb-2">Como você trabalha?</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select 
                            value={workStyle} 
                            onChange={(e) => setWorkStyle(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-brand-soft border border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-medium appearance-none cursor-pointer text-brand-dark"
                            required
                        >
                            <option value="" disabled>Selecione seu local</option>
                            {WORK_STYLE_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-brand-dark text-white rounded-2xl font-bold text-lg hover:bg-brand-muted transition-all flex items-center justify-center gap-2 shadow-lg mt-4">
                      Ver Planos <ArrowLeft className="rotate-180" size={20} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                /* ETAPA 3: PLANOS */
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h1 className="text-3xl font-black text-brand-dark mb-2">Escolha seu plano</h1>
                  <p className="text-brand-muted mb-8">Passo 3 de 3: Finalize seu cadastro</p>

                  <div className="grid grid-cols-1 gap-4 mb-8">
                    {/* Card Plano Basic */}
                    <button 
                      type="button"
                      onClick={() => setPlan('basic')}
                      className={`relative p-2 rounded-3xl border-2 transition-all text-left flex items-center gap-4 ${plan === 'basic' ? 'border-brand-primary bg-brand-primary/5 ring-4 ring-brand-primary/10' : 'border-gray-100 hover:border-brand-primary/30'}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${plan === 'basic' ? 'bg-brand-primary text-brand-dark' : 'bg-brand-soft text-brand-muted'}`}>
                        <Zap size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-brand-dark text-xl">Basic</h3>
                        <p className="text-sm text-brand-muted">Ideal para iniciantes</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-brand-dark">R$ 39</span>
                        <span className="text-sm text-brand-muted font-bold">/mês</span>
                      </div>
                      {plan === 'basic' && <Check className="absolute -top-2 -right-2 bg-brand-primary rounded-full p-1" size={24} />}
                    </button>

                    {/* Card Plano Pro */}
                    <button 
                      type="button"
                      onClick={() => setPlan('pro')}
                      className={`relative p-2 rounded-3xl border-2 transition-all text-left flex items-center gap-4 ${plan === 'pro' ? 'border-brand-dark bg-brand-dark/5 ring-4 ring-brand-dark/10' : 'border-gray-100 hover:border-brand-primary/30'}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${plan === 'pro' ? 'bg-brand-dark text-white' : 'bg-brand-soft text-brand-muted'}`}>
                        <Crown size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-brand-dark text-xl">Pro</h3>
                          <span className="bg-brand-primary text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Best</span>
                        </div>
                        <p className="text-sm text-brand-muted">Mais benefícios </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-brand-dark">R$ 89</span>
                        <span className="text-sm text-brand-muted font-bold">/mês</span>
                      </div>
                      {plan === 'pro' && <Check className="absolute -top-2 -right-2 bg-brand-dark text-white rounded-full p-1" size={24} />}
                    </button>
                  </div>

                  <button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !plan}
                    className="w-full py-4 bg-brand-primary text-brand-dark rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-brand-primary/20"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Finalizar Cadastro"}
                  </button>
                </div>
              )}
            </form>

            <p className="text-center mt-10 text-brand-muted font-medium">
              Já tem uma conta? <button onClick={onSwitchToLogin} className="text-brand-dark font-bold hover:underline">Fazer Login</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;