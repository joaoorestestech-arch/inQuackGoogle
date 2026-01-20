
import React, { useState } from 'react';
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
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'dashboard'>('landing');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLoginSuccess = (userData: { name: string; email: string }) => {
    setUser(userData);
    setView('dashboard');
  };

  if (view === 'dashboard') {
    return <Dashboard user={user} onLogout={() => { setView('landing'); setUser(null); }} />;
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
