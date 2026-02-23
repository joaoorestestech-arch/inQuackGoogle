import React from 'react';
import Logo from '../img/logotipo.svg?react';

interface FooterProps {
  onLogin?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onLogin }) => {
  const col1 = [
    { label: 'Login', action: onLogin },
    { label: 'Home', href: '#' },
    { label: 'Recursos', href: '#features' },
    { label: 'Preços', href: '#pricing' },
    { label: 'Benefícios', href: '#benefits' },
  ];

  const col2 = [
    { label: 'FAQ', href: '#faq' },
    { label: 'Ajuda', href: '#' },
    { label: 'Política de Privacidade', href: '#' },
    { label: 'Termos & Condições', href: '#' },
    { label: 'Quer Trabalhar Com A Gente?', href: '#' },
  ];

  const socials = [
    {
      href: 'https://www.instagram.com/inquack/',
      label: 'Instagram',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      href: 'https://x.com/inquack_',
      label: 'X (Twitter)',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  const LinkItem = ({ item }: { item: { label: string; href?: string; action?: () => void } }) =>
    item.action ? (
      <button
        onClick={item.action}
        className="text-brand-dark text-base font-medium hover:opacity-50 transition-opacity bg-transparent border-none cursor-pointer p-0 text-left"
      >
        {item.label}
      </button>
    ) : (
      <a href={item.href} className="text-brand-dark text-base font-medium hover:opacity-50 transition-opacity no-underline">
        {item.label}
      </a>
    );

  return (
    <div className="relative">
      {/* Gradiente que sobe para cobrir a CTASection acima */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{
          height: '700px',
          background: 'linear-gradient(to bottom, transparent 0%, #F9CE69 45%)',
          zIndex: -1,
        }}
      />

      <footer className="px-6 py-12 max-w-6xl mx-auto relative">

        {/* ── Desktop ── */}
        <div className="hidden md:flex items-start justify-between gap-12 mb-8">
          <div className="flex gap-16">
            <ul className="flex flex-col gap-5">
              {col1.map(item => <li key={item.label}><LinkItem item={item} /></li>)}
            </ul>
            <ul className="flex flex-col gap-5">
              {col2.map(item => <li key={item.label}><LinkItem item={item} /></li>)}
            </ul>
          </div>

          <div className="flex items-center gap-5 mt-1">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-brand-dark hover:opacity-50 transition-opacity">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Mobile ── */}
        <div className="md:hidden">
          <div className="flex gap-10 mb-10">
            <ul className="flex flex-col gap-5">
              {col1.map(item => <li key={item.label}><LinkItem item={item} /></li>)}
            </ul>
            <ul className="flex flex-col gap-5">
              {col2.map(item => <li key={item.label}><LinkItem item={item} /></li>)}
            </ul>
          </div>

          <div className="flex items-center gap-5 mb-8">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-brand-dark hover:opacity-50 transition-opacity">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Logo + copyright ── */}
        <div className="pt-8 border-t border-brand-dark/10">
          <Logo style={{ width: '150px', height: '64px' }} />
          <p className="text-brand-dark/40 text-xs mt-3">
            © {new Date().getFullYear()} inQuack Inc. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;