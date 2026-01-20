
import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Register from '../img/logoRegisterQuack.svg?react';

interface LoginProps {
  onBack: () => void;
  onSwitchToSignup: () => void;
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onBack, onSwitchToSignup, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      
      onLoginSuccess({
        name: data.user?.user_metadata?.full_name || email.split('@')[0],
        email: data.user?.email || email
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      {/* Side Panel */}
      <div className="hidden md:flex flex-1 bg-brand-dark p-16 flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl text-brand-dark">
              <Register style={{width: '38px'}} />
            </div>
            <span className="text-2xl font-bold tracking-tight">inQuack</span>
          </div>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">Prepare seu negócio para o próximo nível.</h2>
          <p className="text-xl text-gray-400 max-w-md">O painel onde a mágica acontece. Seus relatórios, clientes e microsites a um clique de distância.</p>
        </div>
        
        <div className="relative z-10">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <p className="italic text-gray-300 mb-4">"A inQuack mudou a forma como eu gerencio meus clientes. Hoje vendo 2x mais sem precisar de uma secretária."</p>
            <div className="font-bold">— Marina Costa, Proprietária do Studio MC</div>
          </div>
        </div>

        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-primary/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white md:bg-brand-bg">
        <div className="w-full max-w-md">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-brand-muted hover:text-brand-dark font-medium mb-12 transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar para o site
          </button>

          <div className="bg-white py-10 px-6 rounded-[1.5rem] shadow-xl shadow-brand-dark/5 border border-gray-100">
            <h1 className="text-3xl font-black text-brand-dark mb-2">Bem-vindo de volta!</h1>
            <p className="text-brand-muted mb-8">Insira suas credenciais para acessar o painel.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Email Profissional</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ex: voce@empresa.com"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-brand-soft border border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-brand-soft border border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-brand-dark text-white rounded-2xl font-bold text-lg hover:bg-brand-muted transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Entrar no Painel"}
              </button>
            </form>

            <p className="text-center mt-10 text-brand-muted font-medium">
              Não tem uma conta? <button onClick={onSwitchToSignup} className="text-brand-dark font-bold hover:underline">Criar agora</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
