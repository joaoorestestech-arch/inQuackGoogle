
import React from 'react';
import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import Logo from '../img/logoQuack.svg?react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center font-bold text-xl text-brand-dark">
                <Logo style={{width: '32px'}} />
              </div>
              <span className="text-2xl font-bold tracking-tight">inQuack</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Democratizando o acesso a ferramentas de elite para pequenos e médios empreendedores. Transforme seu negócio em uma potência digital.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-brand-primary hover:text-brand-dark transition-all"><Instagram size={20} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-brand-primary hover:text-brand-dark transition-all"><Linkedin size={20} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-brand-primary hover:text-brand-dark transition-all"><Twitter size={20} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-brand-primary hover:text-brand-dark transition-all"><Youtube size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Produto</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Quackpage (Site)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gestão de Vendas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">IA Consultora</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Empresa</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Quem Somos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Suporte</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">WhatsApp Suporte</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Email</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API para Devs</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} inQuack Inc. Todos os direitos reservados.</p>
          <div className="flex items-center gap-8">
            <span>Brasil 🇧🇷</span>
            <span>Segurança garantida 🔒</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
