
import React from 'react';
import { Check, X } from 'lucide-react';

interface PricingProps {
  onSelectPlan: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const plans = [
    {
      name: "Basic",
      price: "39,00",
      desc: "Ideal para quem está começando agora.",
      features: [
        { text: "Até 10 Produtos", included: true },
        { text: "Até 10 Serviços", included: true },
        { text: "IA Auxiliar (Limite Mensal)", included: true },
        { text: "3 botões no site (Quackpage)", included: true },
        { text: "CRM Básico", included: true },
        { text: "Bot de WhatsApp", included: false },
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "89,00",
      desc: "Para empreendedores que buscam escala total.",
      features: [
        { text: "Até 25 Produtos", included: true },
        { text: "Até 25 Serviços", included: true },
        { text: "IA Auxiliar ILIMITADA", included: true },
        { text: "Bot de WhatsApp Incluso", included: true },
        { text: "5 botões no site (Quackpage)", included: true },
        { text: "Relatórios Avançados", included: true },
      ],
      popular: true
    }
  ];

  return (
    <section className="py-24 px-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4 tracking-tight">Planos que crescem com você</h2>
          <p className="text-xl text-brand-muted">Sem pegadinhas, taxas escondidas ou fidelidade.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-white rounded-[3rem] p-10 flex flex-col transition-all duration-300 ${
                plan.popular ? 'border-4 border-brand-primary shadow-2xl scale-105 z-10' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-brand-dark px-6 py-1.5 rounded-full font-bold text-sm uppercase tracking-widest shadow-lg">
                  Mais Escolhido
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-brand-dark mb-2">{plan.name}</h3>
                <p className="text-brand-muted">{plan.desc}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-lg font-bold text-brand-dark">R$</span>
                <span className="text-6xl font-black text-brand-dark">{plan.price}</span>
                <span className="text-brand-muted font-medium">/mês</span>
              </div>

              <div className="space-y-5 mb-10 flex-grow">
                {plan.features.map((feature, i) => (
                  <div key={i} className={`flex items-center gap-3 ${feature.included ? 'text-brand-dark' : 'text-gray-400'}`}>
                    {feature.included ? (
                      <Check className="text-brand-primary" size={20} strokeWidth={3} />
                    ) : (
                      <X className="text-gray-300" size={20} />
                    )}
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={onSelectPlan}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all ${
                  plan.popular 
                    ? 'bg-brand-primary text-brand-dark hover:bg-yellow-400 shadow-xl shadow-brand-primary/20' 
                    : 'bg-brand-dark text-white hover:bg-brand-muted'
                }`}
              >
                Escolher {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
