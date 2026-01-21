
import React from 'react';
import myImage from '../img/moreinfo2.png';

const AppShowcase: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 order-2 lg:order-1">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative rounded-[3rem] overflow-hidden p-4">
                 <img 
                  src={myImage} 
                  alt="App interface" 
                  className="rounded-[2rem] w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
              Design Minimalista, <br/> Resultados Máximos.
            </h2>
            <p className="text-xl text-brand-muted leading-relaxed">
              Desenvolvemos a inQuack focados na experiência do usuário. Nada de menus complexos ou termos técnicos. Uma interface limpa, intuitiva e que funciona perfeitamente em qualquer dispositivo.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-brand-soft rounded-3xl border border-gray-100">
                <div className="text-3xl font-bold text-brand-dark mb-1">98%</div>
                <div className="text-sm text-brand-muted font-medium">Satisfação dos Usuários</div>
              </div>
              <div className="p-6 bg-brand-soft rounded-3xl border border-gray-100">
                <div className="text-3xl font-bold text-brand-dark mb-1">+35%</div>
                <div className="text-sm text-brand-muted font-medium">Aumento em Vendas</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-brand-dark flex-shrink-0 mt-1">✓</div>
                <div>
                  <h4 className="font-bold text-brand-dark">Gestão de Caixa Simplificada</h4>
                  <p className="text-brand-muted">Relatórios que você realmente entende.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-brand-dark flex-shrink-0 mt-1">✓</div>
                <div>
                  <h4 className="font-bold text-brand-dark">Páginas de Alta Conversão</h4>
                  <p className="text-brand-muted">Modelos prontos para o seu nicho.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
