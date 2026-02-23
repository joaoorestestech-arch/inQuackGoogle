import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface PricingProps {
  onSelectPlan: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

  const wrapperStyle = "bg-[#FFF5E1] pt-12 pb-24 relative z-20 rounded-b-[60px] md:rounded-b-[100px]";
  const plans = [
    {
      id: "start",
      name: "Start",
      priceMonthly: "39,00",
      priceYearlyMonthly: "31,17",
      totalPriceYearly: "374,00",
      totalPriceMonthlyYearly: "468,00",
      desc: "Perfeito para profissionais autônomos e quem está começando a automatizar",
      cta: "Comece agora",
      features: [
        { text: "Construtor de site personalizavel", included: true },
        { text: "10 produtos físicos ou digitais", included: true },
        { text: "Agenda online para reservas de horários", included: true },
        { text: "Assistente de IA", included: true },
        { text: "Loja Online", included: true },
        { text: "CRM essencial para organizar clientes e leads", included: true },
        { text: "Chatbot", included: true },
        { text: "Análises básicas de audiência e cliques", included: true },
        { text: "Pagamento integrado", included: true },
      ],
      popular: false,
    },
    {
      id: "essencial",
      name: "Essencial",
      priceMonthly: "79,00",
      priceYearlyMonthly: "63,17",
      totalPriceYearly: "758,00",
      totalPriceMonthlyYearly: "948,00",
      desc: "Perfeito para quem já vende e quer buscar ativamente a fidelização e o aumento do faturamento.",
      cta: "Comece agora",
      features: [
        { text: "25 produtos físicos ou digitais", included: true },
        { text: "25 serviços cadastrados", included: true },
        { text: "Reengajamento automático com mensagens inteligentes", included: true },
        { text: "Relatórios Avançados", included: true },
        { text: "Análises avançadas de audiência e relatórios de vendas", included: true },
        { text: "Suporte prioritário via WhatsApp.", included: true },
      ],
      popular: true,
      preFeaturesBlock: "Tudo do Plano Start",
    }
  ];

  return (
    <section className={wrapperStyle}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header & Toggle */}
        <div className="flex flex-col items-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-brand-dark font-display tracking-tight text-center leading-tight mb-6">
            Escolha o plano que <br /> cresce junto com o seu negócio.
          </h2>
          <div className="border border-brand-dark p-1 rounded-full inline-flex items-center relative">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 md:px-8 py-2 rounded-full text-sm md:text-base font-medium transition-all ${billingCycle === 'monthly'
                ? 'bg-brand-primary text-brand-dark'
                : 'text-brand-dark/70 hover:text-brand-dark'
                }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 md:px-8 py-2 rounded-full text-sm md:text-base font-medium transition-all ${billingCycle === 'yearly'
                ? 'bg-brand-primary text-brand-dark shadow-sm'
                : 'text-brand-dark/70 hover:text-brand-dark'
                }`}
            >
              Anual <span className="font-normal opacity-80">(20% de desconto)</span>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="group rounded-[32px] flex flex-col transition-all duration-300 relative overflow-hidden bg-white border-2 border-brand-dark"
            >
              <div className="p-8 md:p-10 pb-6 flex flex-col">
                <h3 className="text-2xl font-bold text-brand-dark mb-2 font-display leading-tight">
                  {plan.name}
                </h3>
                <p className="text-brand-dark/70 text-sm leading-relaxed mb-6 min-h-[40px]">
                  {plan.desc}
                </p>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-brand-dark tracking-tight">R$</span>
                    <span className="text-5xl font-medium text-brand-dark tracking-tighter">
                      {billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearlyMonthly}
                    </span>
                    <span className="text-brand-dark/70 text-sm font-medium">/mês</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-brand-dark/70 font-medium mt-1">
                      R$ {plan.totalPriceYearly} /ano
                    </p>
                  )}
                  {billingCycle === 'monthly' && (
                    <p className="text-sm text-brand-dark/70 font-medium mt-1">
                      R$ {plan.totalPriceMonthlyYearly} /ano
                    </p>
                  )}
                </div>

                {/* Botão Start — inalterado */}
                {plan.id === 'start' && (
                  <button
                    onClick={onSelectPlan}
                    className="w-full transition-colors inline-flex items-center justify-center mb-2 rounded-full font-semibold text-base sm:text-lg border-[1px] border-brand-dark/40 px-[1.4375rem] py-[0.9375rem] hover:border-brand-dark bg-white text-brand-dark"
                  >
                    {plan.cta}
                  </button>
                )}

                {/* Botão Essencial — com seta e hover invertido */}
                {plan.id === 'essencial' && (
                  <button
                    onClick={onSelectPlan}
                    className="group/btn w-full relative inline-flex items-center justify-center mb-2 px-[1.4375rem] py-[0.9375rem] rounded-full font-semibold text-base sm:text-lg text-brand-dark bg-brand-primary hover:text-white hover:bg-brand-dark shadow-sm transition-colors duration-200"
                  >
                    {plan.cta}
                    <span
                      className="absolute right-2 flex items-center justify-center rounded-full bg-brand-dark group-hover/btn:bg-brand-primary transition-colors duration-200"
                      style={{ width: '40px', height: '40px', flexShrink: 0 }}
                    >
                      <ArrowRight size={15} className="text-white group-hover/btn:text-brand-dark" />
                    </span>
                  </button>
                )}

                <div className="w-full text-center">
                  <p className="text-sm font-medium text-brand-dark/70">
                    Teste grátis por 7 dias. Pague nada hoje.
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-brand-dark rounded-t-[32px] p-8 md:p-10 bg-white flex flex-col flex-grow -mt-2 pt-10 relative z-10">
                {plan.preFeaturesBlock && (
                  <div className="py-2 px-4 mb-2 text-md font-semibold text-brand-dark">
                    {plan.preFeaturesBlock}
                  </div>
                )}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-brand-dark/80">
                      <Check className="text-brand-dark flex-shrink-0 mt-0.5 w-4 h-4" strokeWidth={2} />
                      <span className="text-sm md:text-sm font-medium leading-relaxed">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;