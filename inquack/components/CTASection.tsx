import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onSignup?: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onSignup }) => {
  const scrollAnim = "animate-[fade-in-up_linear_both] [animation-timeline:view()] [animation-range:entry_20%_cover_40%]";

  return (
    <section className="bg-[#1a1a1a] text-white px-8 md:px-12 pt-10 pb-8 mx-6 mb-6 rounded-[2rem] overflow-hidden max-w-6xl mx-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16 flex flex-col items-center text-center gap-8">

        {/* Headline */}
        <h2 className={`text-4xl md:text-6xl font-semibold text-white font-display tracking-tight leading-tight ${scrollAnim}`}>
          Facilite a vida do seu cliente vendendo tudo em um só lugar.
        </h2>

        {/* Subtexto */}
        <p className={`text-white text-lg leading-relaxed font-medium max-w-xl ${scrollAnim}`}>
          Junte-se a milhares de empreendedores que já faturam muito mais sem pagar taxa em cada venda.        </p>

        {/* CTA */}
        <div className={`flex flex-col items-center gap-3`}>
          <button
            onClick={onSignup}
            className="group flex text-brand-dark items-center gap-3 bg-brand-primary  hover:bg-brand-muted  hover:text-white pl-6 pr-2 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 active:scale-95"
          >
            Comece grátis por 7 dias
            <span
              className="flex items-center justify-center rounded-full bg-brand-dark group-hover:bg-brand-primary transition-colors duration-200"
              style={{ width: '30px', height: '30px', flexShrink: 0 }}
            >
              <ArrowRight size={15} className="text-brand-primary group-hover:text-brand-dark transition-colors duration-200" />
            </span>
          </button>

          <p className="text-white text-sm">
            Sua primeira loja em 5 minutos.
          </p>
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

export default CTASection;