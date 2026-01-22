import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase'; // Certifique-se de que o caminho está correto
// ... seus outros imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import AppShowcase from './components/AppShowcase';
import Pricing from './components/Pricing';
import Clients from './components/Clients';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  // Estado inicial como 'landing' e user null
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'dashboard'>('landing');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // 1. Verificar se existe uma sessão salva no LocalStorage ao carregar a página
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser({ 
          name: session.user.user_metadata.name || 'Empreendedor', 
          email: session.user.email || '' 
        });
        setView('dashboard');
      }
      setIsInitializing(false);
    };

    checkSession();

    // 2. Ouvir mudanças na autenticação (Login, Logout, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({ 
          name: session.user.user_metadata.name || 'Empreendedor', 
          email: session.user.email || '' 
        });
        setView('dashboard');
      } else {
        setUser(null);
        setView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = (userData: { name: string; email: string }) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView('landing');
  };

  // Enquanto verifica a sessão, exibe um loader para evitar o "pulo" da landing para o dashboard
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  if (view === 'dashboard') {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  if (view === 'login') {
    return (
      <Login 
        onBack={() => setView('landing')} 
        onSwitchToSignup={() => setView('signup')} 
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (view === 'signup') {
    return (
      <Signup 
        onBack={() => setView('landing')} 
        onSwitchToLogin={() => setView('login')} 
        onSignupSuccess={(userData) => handleLoginSuccess(userData)}
      />
    );
  }

  return (
    <div className="min-h-screen selection:bg-brand-primary/30">
      <Navbar onLogin={() => setView('login')} />
      <main>
        <Hero onStart={() => setView('signup')} />
        <div id="features">
          <Features />
        </div>
        <div id="showcase">
          <AppShowcase />
        </div>
        <div id="pricing">
          <Pricing onSelectPlan={() => setView('signup')} />
        </div>
        <div id="clients">
          <Clients />
        </div>
      </main>
      <Footer />
    </div>
  );
};


export default App;