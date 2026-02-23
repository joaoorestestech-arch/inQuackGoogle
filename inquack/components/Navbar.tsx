import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from '../img/logotipo.svg?react';

interface NavbarProps {
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Preço', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* ── Top bar that holds the pill ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-3">
        {/*
          PILL WRAPPER
          - Always white + rounded-full + subtle border
          - On scroll: stronger drop-shadow on the pill itself
        */}
        <div
          className="w-full max-w-7xl flex items-center bg-white rounded-full border border-black/[0.07] px-4 py-2 transition-shadow duration-300"
          style={{
            boxShadow: scrolled
              ? '0 8px 32px rgba(0,0,0,0.14)'
              : '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          {/* ── Logo ── */}
          <a href="#" className="flex items-center flex-shrink-0">
            <div style={{ width: '200px', height: '46px' }}>
              <Logo
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'left center',
                }}
              />
            </div>
          </a>

          {/* ── Center Nav Links — desktop ── */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-brand-dark font-medium whitespace-nowrap px-4 py-2 rounded-full transition-colors duration-150 hover:bg-black/[0.06]"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* ── Right Buttons — desktop ── */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <button
              onClick={onLogin}
              className="rounded-full font-semibold text-base border border-brand-dark/40 px-6 py-2 hover:border-brand-dark text-brand-dark transition-colors whitespace-nowrap"
            >
              Entrar
            </button>
            <button
              onClick={onLogin}
              className="group flex items-center gap-3 bg-brand-primary hover:bg-brand-dark text-brand-dark hover:text-white pl-6 pr-2 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 active:scale-95"
            >
              Criar conta
              <span
                className="flex items-center justify-center rounded-full bg-brand-dark group-hover:bg-brand-primary transition-colors duration-200"
                style={{ width: '30px', height: '30px', flexShrink: 0 }}
              >
                <ArrowRight size={15} className="text-brand-primary group-hover:text-brand-dark transition-colors duration-200" />
              </span>
            </button>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            className="md:hidden ml-auto p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu — fullscreen ── */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '160px', height: '38px' }}>
                <Logo
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'left center',
                  }}
                />
              </div>
            </a>
            <button
              style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '0.5rem 1.5rem' }}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  padding: '1rem 0',
                  textDecoration: 'none',
                  display: 'block',
                  lineHeight: 1.2,
                }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              padding: '1rem 1.5rem',
              paddingBottom: '1.5rem',
            }}
          >
            <button
              onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.75rem',
                border: '1px solid rgba(0,0,0,0.25)',
                padding: '0.9375rem',
                fontWeight: 700,
                fontSize: '1rem',
                background: 'white',
                cursor: 'pointer',
                color: '#1a1a1a',
              }}
            >
              Entrar
            </button>
            <button
              onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
              style={{
                borderRadius: '0.75rem',
                padding: '1rem',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                border: 'none',
                color: '#1a1a1a',
              }}
              className="bg-brand-primary"
            >
              Criar conta
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;