
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from '../img/logoQuack.svg?react';

interface NavbarProps {
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Funcionalidades', href: '#features' },
    { name: 'O App', href: '#showcase' },
    { name: 'Preços', href: '#pricing' },
    { name: 'Clientes', href: '#clients' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="text-2xl font-bold font-montserrat tracking-tight text-brand-dark">
            in
          </span>
          <div className="w-6 h-10 rounded-xl flex items-center justify-center font-bold text-xl">
            <Logo style={{width: '32px'}} />
          </div>
          <span className="text-2xl font-bold font-montserrat tracking-tight text-brand-dark">
            uack
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-brand-muted hover:text-brand-dark font-medium transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={onLogin}
            className="flex items-center gap-2 bg-brand-dark text-white px-6 py-2.5 rounded-full font-semibold hover:bg-brand-muted transition-all active:scale-95"
          >
            Acessar Painel
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-xl p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-brand-muted hover:text-brand-dark"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => {
              onLogin();
              setIsMobileMenuOpen(false);
            }}
            className="bg-brand-primary text-brand-dark font-bold py-3 rounded-xl"
          >
            Acessar Painel
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
