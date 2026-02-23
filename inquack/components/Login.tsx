
import React, { useState } from 'react';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LogoQuack from '../img/logoQuack.svg?react';
import StarIcon from '../img/star.png';

interface LoginProps {
  onBack: () => void;
  onSwitchToSignup: () => void;
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onBack, onSwitchToSignup, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login com Google.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF6] via-[#FDF4D1] to-[#F7E7A9] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: `url(${StarIcon})`,
          backgroundSize: '40px 40px',
          backgroundRepeat: 'repeat'
        }}
      ></div>

      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        {/* Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="mb-6">
            <LogoQuack style={{ width: '80px', height: '80px' }} />
          </div>
          <div className="mb-4 text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-medium text-stone-900 font-display tracking-tight leading-tight">
              Bem vindo de volta
            </h1>
            <p className="text-[#555555] text-lg leading-relaxed max-w-[440px]">
              Sentimos sua falta, que tal transformamos seu negócio em algo grandioso?
            </p>
          </div>
        </div>

        {error && (
          <div className="w-full mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-5 py-4 rounded-xl bg-white border border-[#E5E5E5] focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all text-lg"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-5 py-4 rounded-xl bg-white border border-[#E5E5E5] focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all text-lg pr-12"
              required
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
            <div className="h-[1px] flex-1 bg-[#D2D2D2]"></div>
            <span className="text-[#888888] text-sm">ou</span>
            <div className="h-[1px] flex-1 bg-[#D2D2D2]"></div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white hover:bg-gray-50 border border-[#E5E5E5] rounded-xl font-semibold text-gray-700 transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continuar com o Google
          </button>

          <div className="text-center">
            <button type="button" className="text-[#8e8e8e] hover:text-black transition-colors text-sm font-medium">
              Esqueceu sua senha?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-[#111111] text-white rounded-xl font-bold text-xl hover:bg-[#222222] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Entrar"}
          </button>
        </form>

        <div className="mt-8 text-center flex flex-col gap-6">
          <p className="text-[11px] text-[#8e8e8e] leading-relaxed max-w-[320px]">
            Ao continuar, você concorda com nossos <a href="#" className="underline">Termos de Serviço</a> e <a href="#" className="underline">Política de Privacidade</a>.
          </p>

          <p className="text-[#555555]">
            Não tem uma conta? <button onClick={onSwitchToSignup} className="text-black font-bold hover:underline">Criar agora.</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
