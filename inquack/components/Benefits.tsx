import React from 'react';
import { ArrowRight, ShoppingBag, Calendar, Eye, Check } from 'lucide-react';

const Benefits: React.FC = () => {
  const scrollAnim = "animate-[fade-in-up_linear_both] [animation-timeline:view()] [animation-range:entry_20%_cover_40%]";

  return (
    <section className="relative bg-#fbfaf9 pb-0 overflow-hidden">

      <div className="relative z-10">

        {/* Container for ALL Content */}
        <div className="bg-[#FFF5E1] rounded-t-[60px] md:rounded-t-[100px] pt-24 md:pt-32 pb-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col gap-16 md:gap-32">

            {/* --- SEÇÃO 1: 0% Taxa (Now in Dark Background) --- */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center`}>
              {/* Text Side */}
              <div className={`flex flex-col justify-center text-center md:text-left ${scrollAnim}`}>
                <h2 className="text-4xl md:text-5xl font-semibold text-brand-dark font-display tracking-tight leading-tight mb-6">
                  Vendas.<br />
                  Agendamentos.<br />
                  Tudo 0% de taxa.
                </h2>
                <p className="text-brand-dark/80 text-lg leading-relaxed font-medium mb-8">
                  Cada centavo que entra é seu. <br />Não temos comissões, tarifas escondidas ou taxas surpresas. <br />
                  Você paga apenas a mensalidade, ponto.
                </p>
              </div>

              {/* Duck on Coins & 0% Tax Visual */}
              <div className="relative flex flex-col items-center justify-center">
                <div className="relative w-[300px] md:w-[340px] h-[340px] md:h-[340px]">
                  <img
                    src="/img/Logotipo empresa marketing digital moderno preto e amarelo.png"
                    alt="Duck on Coins"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#FFEAA6]/20 blur-[80px] rounded-full pointer-events-none -z-10" />
              </div>
            </div>

            {/* --- SEÇÃO 2 (GRID INFERIOR): Mais Resultados --- */}
            <div className={`flex flex-col md:flex-row gap-12 items-start`}>
              <div className="flex-1 max-w-lg">
                <h2 className="text-4xl md:text-5xl font-semibold text-brand-dark font-display tracking-tight leading-tight mb-6">
                  Mais resultados.<br />
                  Menos ferramentas.
                </h2>
                <p className="text-brand-dark/80 text-lg leading-relaxed font-medium">
                  Substitua dezenas de ferramentas por uma única plataforma pensada em tudo o que você precisa para administrar e escalar seu negócio.
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 w-full">
                <ul className="flex flex-col gap-6">
                  {[
                    "Loja online", "Construtor de sites", "Catálogo de serviços e Produtos",
                    "Reserva de horários", "Análise de Audiência", "Produtos personalizados",
                    "Assistente de IA", "Análise de audiência e métricas de cliques/visitas."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 min-w-[20px] w-5 h-5 bg-[#ffc934] rounded-full flex items-center justify-center">
                        <Check size={12} className="text-[#4e2903]" strokeWidth={4} />
                      </div>
                      <h3 className="text-brand-dark font-bold text-xl leading-tight">{item}</h3>
                    </li>
                  ))}
                </ul>

                <ul className="flex flex-col gap-6">
                  {[
                    "Pagamento Integrado", "Reengajamento automático", "Chatbot no WhatsApp",
                    "Suporte Pix e Cartão", "CRM de clientes e leads."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 min-w-[20px] w-5 h-5 bg-[#ffc934] rounded-full flex items-center justify-center">
                        <Check size={12} className="text-[#4e2903]" strokeWidth={4} />
                      </div>
                      <h3 className="text-brand-dark font-bold text-xl leading-tight">{item}</h3>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>



      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Benefits;